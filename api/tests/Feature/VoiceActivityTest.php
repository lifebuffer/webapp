<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Laravel\Passport\Passport;
use Tests\TestCase;

class VoiceActivityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // For testing, we use Passport::actingAs() which doesn't require OAuth clients
        // The passport:install command doesn't work well with in-memory database
    }

    /**
     * Create a fake audio file for testing.
     * Note: Laravel's fake file system doesn't perfectly simulate MIME types,
     * but this works for testing the core functionality.
     */
    private function createFakeAudioFile(string $filename = 'recording.webm', string $mimeType = 'audio/webm', int $size = 1000): UploadedFile
    {
        return UploadedFile::fake()->createWithContent($filename, str_repeat('A', $size));
    }

    /** @test */
    public function it_can_create_activity_from_voice_recording()
    {
        // Arrange
        $user = User::factory()->create();
        Passport::actingAs($user);

        // Mock OpenAI Whisper API response
        Http::fake([
            'https://api.openai.com/v1/audio/transcriptions' => Http::response([
                'text' => 'Fix the authentication bug in the login system. The password validation is not working correctly and users cannot sign in.'
            ], 200),
            'https://api.openai.com/v1/chat/completions' => Http::response([
                'choices' => [
                    [
                        'message' => [
                            'content' => json_encode([
                                'title' => 'Fix authentication bug',
                                'notes' => 'The password validation is not working correctly and users cannot sign in.'
                            ])
                        ]
                    ]
                ]
            ], 200)
        ]);

        // Create a fake audio file
        $audioFile = $this->createFakeAudioFile();

        // Act
        $response = $this->postJson('/api/activities/voice', [
            'audio' => $audioFile
        ]);

        // Assert
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'title',
            'notes',
            'transcript'
        ]);

        $responseData = $response->json();
        $this->assertEquals('Fix authentication bug', $responseData['title']);
        $this->assertStringContainsString('password validation', $responseData['notes']);
        $this->assertStringContainsString('Fix the authentication bug', $responseData['transcript']);

        // Verify API calls were made correctly
        Http::assertSent(function ($request) {
            return $request->url() === 'https://api.openai.com/v1/audio/transcriptions' &&
                   $request->hasHeader('Authorization', 'Bearer ' . config('services.openai.api_key')) &&
                   $request->data()['model'] === 'whisper-1' &&
                   $request->data()['language'] === 'en';
        });

        Http::assertSent(function ($request) {
            return $request->url() === 'https://api.openai.com/v1/chat/completions' &&
                   $request->hasHeader('Authorization', 'Bearer ' . config('services.openai.api_key')) &&
                   $request['model'] === 'gpt-4o-mini';
        });
    }

    /** @test */
    public function it_handles_short_transcripts_directly()
    {
        // Arrange
        $user = User::factory()->create();
        Passport::actingAs($user);

        // Mock short transcript
        Http::fake([
            'https://api.openai.com/v1/audio/transcriptions' => Http::response([
                'text' => 'Call dentist'
            ], 200)
        ]);

        $audioFile = $this->createFakeAudioFile('recording.webm', 'audio/webm', 500);

        // Act
        $response = $this->postJson('/api/activities/voice', [
            'audio' => $audioFile
        ]);

        // Assert
        $response->assertStatus(200);
        $responseData = $response->json();
        $this->assertEquals('Call dentist', $responseData['title']);
        $this->assertNull($responseData['notes']);

        // Should not call ChatGPT for short transcripts
        Http::assertNotSent(function ($request) {
            return $request->url() === 'https://api.openai.com/v1/chat/completions';
        });
    }

    /** @test */
    public function it_validates_audio_file_upload()
    {
        // Arrange
        $user = User::factory()->create();
        Passport::actingAs($user);

        // Act & Assert - Missing file
        $response = $this->postJson('/api/activities/voice', []);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['audio']);

        // Act & Assert - Wrong file type
        $textFile = UploadedFile::fake()->createWithContent('document.txt', 'not an audio file');
        $response = $this->postJson('/api/activities/voice', [
            'audio' => $textFile
        ]);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['audio']);

        // Act & Assert - File too large
        $largeFile = $this->createFakeAudioFile('large.webm', 'audio/webm', 15000); // 15MB
        $response = $this->postJson('/api/activities/voice', [
            'audio' => $largeFile
        ]);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['audio']);
    }

    /** @test */
    public function it_handles_whisper_api_failures()
    {
        // Arrange
        $user = User::factory()->create();
        Passport::actingAs($user);

        // Mock Whisper API failure
        Http::fake([
            'https://api.openai.com/v1/audio/transcriptions' => Http::response([], 400)
        ]);

        $audioFile = $this->createFakeAudioFile();

        // Act
        $response = $this->postJson('/api/activities/voice', [
            'audio' => $audioFile
        ]);

        // Assert
        $response->assertStatus(500);
        $response->assertJson([
            'error' => 'Failed to process voice recording. Please try again.'
        ]);
    }

    /** @test */
    public function it_handles_empty_transcription()
    {
        // Arrange
        $user = User::factory()->create();
        Passport::actingAs($user);

        // Mock empty transcription
        Http::fake([
            'https://api.openai.com/v1/audio/transcriptions' => Http::response([
                'text' => ''
            ], 200)
        ]);

        $audioFile = $this->createFakeAudioFile();

        // Act
        $response = $this->postJson('/api/activities/voice', [
            'audio' => $audioFile
        ]);

        // Assert
        $response->assertStatus(422);
        $response->assertJson([
            'error' => 'Could not transcribe audio. Please try again.'
        ]);
    }

    /** @test */
    public function it_handles_chatgpt_api_failures_gracefully()
    {
        // Arrange
        $user = User::factory()->create();
        Passport::actingAs($user);

        $longTranscript = 'This is a very long transcript that should trigger ChatGPT processing to extract title and notes from the content automatically.';

        // Mock successful Whisper but failed ChatGPT
        Http::fake([
            'https://api.openai.com/v1/audio/transcriptions' => Http::response([
                'text' => $longTranscript
            ], 200),
            'https://api.openai.com/v1/chat/completions' => Http::response([], 500)
        ]);

        $audioFile = $this->createFakeAudioFile();

        // Act
        $response = $this->postJson('/api/activities/voice', [
            'audio' => $audioFile
        ]);

        // Assert - Should still work with fallback processing
        $response->assertStatus(200);
        $responseData = $response->json();
        $this->assertNotEmpty($responseData['title']);
        $this->assertNotEmpty($responseData['notes']);
        $this->assertEquals($longTranscript, $responseData['transcript']);
    }

    /** @test */
    public function it_requires_authentication()
    {
        // Arrange
        $audioFile = $this->createFakeAudioFile();

        // Act
        $response = $this->postJson('/api/activities/voice', [
            'audio' => $audioFile
        ]);

        // Assert
        $response->assertStatus(401);
    }

    /** @test */
    public function it_cleans_up_temporary_files()
    {
        // Arrange
        $user = User::factory()->create();
        Passport::actingAs($user);

        // Mock successful processing
        Http::fake([
            'https://api.openai.com/v1/audio/transcriptions' => Http::response([
                'text' => 'Test transcript'
            ], 200)
        ]);

        $audioFile = $this->createFakeAudioFile();

        // Act
        $response = $this->postJson('/api/activities/voice', [
            'audio' => $audioFile
        ]);

        // Assert
        $response->assertStatus(200);

        // Verify no temp files are left behind
        $tempFiles = Storage::disk('local')->files('temp');
        $this->assertEmpty($tempFiles);
    }

    /** @test */
    public function it_handles_malformed_chatgpt_response()
    {
        // Arrange
        $user = User::factory()->create();
        Passport::actingAs($user);

        $longTranscript = 'Fix the user authentication system that is currently broken and preventing login attempts.';

        // Mock Whisper success but malformed ChatGPT response
        Http::fake([
            'https://api.openai.com/v1/audio/transcriptions' => Http::response([
                'text' => $longTranscript
            ], 200),
            'https://api.openai.com/v1/chat/completions' => Http::response([
                'choices' => [
                    [
                        'message' => [
                            'content' => 'This is not valid JSON'
                        ]
                    ]
                ]
            ], 200)
        ]);

        $audioFile = $this->createFakeAudioFile();

        // Act
        $response = $this->postJson('/api/activities/voice', [
            'audio' => $audioFile
        ]);

        // Assert - Should fallback to manual processing
        $response->assertStatus(200);
        $responseData = $response->json();
        $this->assertNotEmpty($responseData['title']);
        $this->assertEquals($longTranscript, $responseData['transcript']);
    }

    /** @test */
    public function it_accepts_various_audio_formats()
    {
        // Arrange
        $user = User::factory()->create();
        Passport::actingAs($user);

        Http::fake([
            'https://api.openai.com/v1/audio/transcriptions' => Http::response([
                'text' => 'Test transcript'
            ], 200)
        ]);

        $formats = [
            ['recording.webm', 'audio/webm'],
            ['recording.wav', 'audio/wav'],
            ['recording.mp3', 'audio/mp3'],
            ['recording.m4a', 'audio/m4a'],
            ['recording.ogg', 'audio/ogg'],
        ];

        foreach ($formats as [$filename, $mimeType]) {
            // Act
            $audioFile = $this->createFakeAudioFile($filename, $mimeType, 1000);
            $response = $this->postJson('/api/activities/voice', [
                'audio' => $audioFile
            ]);

            // Assert
            $response->assertStatus(200, "Failed for format: $mimeType");
        }
    }
}