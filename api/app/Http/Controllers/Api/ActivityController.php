<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ActivityController extends Controller
{
    /**
     * Create a new activity from voice recording.
     */
    public function createFromVoice(Request $request): JsonResponse
    {
        \Log::info('Voice endpoint hit', [
            'method' => $request->method(),
            'url' => $request->url(),
            'has_auth_header' => $request->hasHeader('Authorization'),
            'content_type' => $request->header('Content-Type'),
        ]);

        $user = $request->user();

        if (!$user) {
            \Log::error('No authenticated user found for voice request');
            return response()->json(['error' => 'Authentication required'], 401);
        }

        \Log::info('User authenticated for voice request', ['user_id' => $user->id]);

        // Validate the uploaded audio file
        $validator = Validator::make($request->all(), [
            'audio' => 'required|file|mimes:webm,wav,mp3,m4a,ogg|max:10240', // Max 10MB
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            Log::info('Voice recording request started', [
                'user_id' => $user->id,
                'has_file' => $request->hasFile('audio'),
                'file_size' => $request->hasFile('audio') ? $request->file('audio')->getSize() : null,
                'file_type' => $request->hasFile('audio') ? $request->file('audio')->getMimeType() : null,
                'file_name' => $request->hasFile('audio') ? $request->file('audio')->getClientOriginalName() : null,
                'temp_dir_exists' => file_exists(storage_path('app/private/temp')),
                'temp_dir_writable' => is_writable(storage_path('app/private/temp')),
            ]);

            $audioFile = $request->file('audio');

            // Ensure temp directory exists
            $tempDirectory = storage_path('app/private/temp');
            if (!file_exists($tempDirectory)) {
                mkdir($tempDirectory, 0755, true);
                Log::info('Created temp directory', ['path' => $tempDirectory]);
            }

            // Store the file temporarily
            Log::info('Attempting to store file', [
                'original_name' => $audioFile->getClientOriginalName(),
                'size' => $audioFile->getSize(),
                'mime_type' => $audioFile->getMimeType(),
                'is_valid' => $audioFile->isValid(),
                'error' => $audioFile->getError(),
            ]);

            try {
                $tempPath = $audioFile->store('temp', 'local');
                Log::info('File store result', [
                    'temp_path' => $tempPath,
                    'success' => !empty($tempPath),
                ]);
            } catch (\Exception $e) {
                Log::error('Exception during file store', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
                throw $e;
            }

            if (!$tempPath) {
                Log::error('Failed to store temporary file - tempPath is empty');
                return response()->json(['error' => 'Failed to process audio file. Please try again.'], 422);
            }

            $fullPath = storage_path('app/private/' . $tempPath);

            // Wait for filesystem to sync (Docker volume timing issue)
            $maxAttempts = 10;
            $attempt = 0;
            while (!file_exists($fullPath) && $attempt < $maxAttempts) {
                usleep(100000); // Wait 100ms
                $attempt++;
                Log::info('Waiting for file to appear', [
                    'attempt' => $attempt,
                    'path' => $fullPath,
                    'exists' => file_exists($fullPath),
                ]);
            }

            Log::info('File stored temporarily', [
                'temp_path' => $tempPath,
                'full_path' => $fullPath,
                'file_exists' => file_exists($fullPath),
                'file_size' => file_exists($fullPath) ? filesize($fullPath) : null,
                'attempts_needed' => $attempt,
            ]);

            if (!file_exists($fullPath)) {
                Log::error('File still does not exist after waiting', [
                    'path' => $fullPath,
                    'max_attempts' => $maxAttempts,
                ]);
                return response()->json(['error' => 'File upload failed. Please try again.'], 422);
            }

            // Step 1: Send to OpenAI Whisper for speech-to-text
            Log::info('Starting Whisper transcription');
            $transcript = $this->transcribeAudio($fullPath);
            Log::info('Whisper transcription completed', [
                'transcript_length' => strlen($transcript),
                'transcript_preview' => substr($transcript, 0, 100),
            ]);

            if (empty($transcript)) {
                Log::warning('Empty transcript received from Whisper');
                // Clean up temp file
                Storage::disk('local')->delete($tempPath);
                return response()->json(['error' => 'Could not transcribe audio. Please try again.'], 422);
            }

            // Step 2: Process transcript to extract title and notes
            Log::info('Starting transcript processing');
            $processed = $this->processTranscript($transcript);
            Log::info('Transcript processing completed', [
                'title' => $processed['title'],
                'has_notes' => !empty($processed['notes']),
                'notes_length' => $processed['notes'] ? strlen($processed['notes']) : 0,
            ]);

            // Clean up temp file
            Storage::disk('local')->delete($tempPath);
            Log::info('Temporary file cleaned up');

            return response()->json([
                'title' => $processed['title'],
                'notes' => $processed['notes'],
                'transcript' => $transcript, // For debugging purposes
            ]);

        } catch (\Exception $e) {
            Log::error('Voice processing failed', [
                'error_message' => $e->getMessage(),
                'error_file' => $e->getFile(),
                'error_line' => $e->getLine(),
                'stack_trace' => $e->getTraceAsString(),
                'user_id' => $user->id,
            ]);

            // Clean up temp file if it exists
            if (isset($tempPath)) {
                Storage::disk('local')->delete($tempPath);
                Log::info('Cleaned up temp file after error', ['temp_path' => $tempPath]);
            }

            return response()->json([
                'error' => 'Failed to process voice recording. Please try again.',
                'debug_message' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Transcribe audio using OpenAI Whisper API.
     */
    private function transcribeAudio(string $filePath): string
    {
        $apiKey = config('services.openai.api_key');

        if (empty($apiKey)) {
            throw new \Exception('OpenAI API key not configured');
        }

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
        ])->attach(
            'file', file_get_contents($filePath), basename($filePath)
        )->post('https://api.openai.com/v1/audio/transcriptions', [
            'model' => 'whisper-1',
            'language' => 'en',
            'response_format' => 'json',
            'temperature' => 0, // Lower temperature for more accurate transcription
        ]);

        if (!$response->successful()) {
            Log::error('Whisper API failed: ' . $response->body());
            throw new \Exception('Speech transcription failed');
        }

        $data = $response->json();
        return $data['text'] ?? '';
    }

    /**
     * Process transcript to extract title and notes using OpenAI Chat API.
     */
    private function processTranscript(string $transcript): array
    {
        $wordCount = str_word_count($transcript);

        // If transcript is short (< 8 words), use it directly as title
        if ($wordCount < 8) {
            return [
                'title' => trim($transcript),
                'notes' => null,
            ];
        }

        // For longer transcripts, use ChatGPT to extract title and notes
        $apiKey = config('services.openai.api_key');

        if (empty($apiKey)) {
            // Fallback: use first part as title
            $words = explode(' ', $transcript);
            $title = implode(' ', array_slice($words, 0, 5));
            $notes = implode(' ', array_slice($words, 5));

            return [
                'title' => $title,
                'notes' => $notes ?: null,
            ];
        }

        $prompt = "Extract a clear, concise activity title and detailed notes from this voice recording transcript. The title should be 5-8 words maximum and capture the main task/activity. The notes should contain additional context, details, or steps mentioned.

Transcript: \"$transcript\"

Respond in JSON format:
{
  \"title\": \"Brief activity title\",
  \"notes\": \"Detailed notes with context (or null if no additional details)\"
}";

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json',
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-4o-mini', // Best model for this task
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'You are a helpful assistant that extracts activity titles and notes from voice transcripts. Always respond with valid JSON.'
                ],
                [
                    'role' => 'user',
                    'content' => $prompt
                ]
            ],
            'temperature' => 0.3, // Low temperature for consistent formatting
            'max_tokens' => 300,
            'response_format' => ['type' => 'json_object'],
        ]);

        if (!$response->successful()) {
            Log::error('ChatGPT API failed: ' . $response->body());

            // Fallback: split manually
            $words = explode(' ', $transcript);
            $title = implode(' ', array_slice($words, 0, 5));
            $notes = implode(' ', array_slice($words, 5));

            return [
                'title' => $title,
                'notes' => $notes ?: null,
            ];
        }

        $data = $response->json();
        $content = $data['choices'][0]['message']['content'] ?? '';

        try {
            $parsed = json_decode($content, true);

            return [
                'title' => $parsed['title'] ?? trim(substr($transcript, 0, 50)),
                'notes' => $parsed['notes'] ?: null,
            ];
        } catch (\Exception $e) {
            Log::error('Failed to parse ChatGPT response: ' . $content);

            // Fallback: split manually
            $words = explode(' ', $transcript);
            $title = implode(' ', array_slice($words, 0, 5));
            $notes = implode(' ', array_slice($words, 5));

            return [
                'title' => $title,
                'notes' => $notes ?: null,
            ];
        }
    }

    /**
     * Create a new activity.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        // Validate the request data
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'required|in:new,in_progress,done',
            'time' => 'nullable|integer|min:0',
            'context_id' => 'nullable|exists:contexts,id',
            'date' => 'required|date_format:Y-m-d',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        // Ensure context belongs to the user if provided
        if (isset($data['context_id']) && $data['context_id'] !== null) {
            $contextExists = \App\Models\Context::where('id', $data['context_id'])
                ->where('user_id', $user->id)
                ->exists();

            if (!$contextExists) {
                return response()->json(['error' => 'Context not found'], 404);
            }
        }

        // Create or find the day record (for consistency with the days table)
        $day = \App\Models\Day::firstOrCreate(
            [
                'user_id' => $user->id,
                'date' => $data['date'],
            ]
        );

        // Add user_id to the data (keep date as activities table has a date column)
        $data['user_id'] = $user->id;

        // Create the activity
        $activity = Activity::create($data);

        // Load context relationship
        $activity->load('context');

        return response()->json($activity, 201);
    }

    /**
     * Update the specified activity.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        
        // Find the activity
        $activity = Activity::findOrFail($id);

        // Authorize the action
        $this->authorize('update', $activity);

        // Validate the request data
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'notes' => 'sometimes|nullable|string',
            'status' => 'sometimes|required|in:new,in_progress,done',
            'time' => 'sometimes|nullable|integer|min:0',
            'context_id' => 'sometimes|nullable|exists:contexts,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Get the validated data
        $updateData = [];
        
        // Handle each field explicitly to ensure null values are processed
        if ($request->has('title')) {
            $updateData['title'] = $request->input('title');
        }
        if ($request->has('notes')) {
            $updateData['notes'] = $request->input('notes');
        }
        if ($request->has('status')) {
            $updateData['status'] = $request->input('status');
        }
        if ($request->has('time')) {
            $updateData['time'] = $request->input('time');
        }
        if ($request->has('context_id')) {
            $updateData['context_id'] = $request->input('context_id');
        }
        
        // Ensure context belongs to the user if provided and not null
        if (isset($updateData['context_id']) && $updateData['context_id'] !== null) {
            $contextExists = \App\Models\Context::where('id', $updateData['context_id'])
                ->where('user_id', $user->id)
                ->exists();
                
            if (!$contextExists) {
                return response()->json(['error' => 'Context not found'], 404);
            }
        }

        $activity->update($updateData);
        
        // Load the updated activity with context
        $activity->load('context');

        return response()->json($activity);
    }

    /**
     * Delete the specified activity.
     */
    public function destroy(string $id): JsonResponse
    {
        // Find the activity
        $activity = Activity::findOrFail($id);

        // Authorize the action
        $this->authorize('delete', $activity);

        // Delete the activity
        $activity->delete();

        return response()->json(['message' => 'Activity deleted successfully']);
    }
}