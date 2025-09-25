<?php

namespace App\Services;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class MeetingPreparationService
{
    /**
     * Prepare meeting notes from activities and days
     */
    public function prepare(Collection $activities, ?Collection $days, array $options): array
    {
        // If no activities, return a simple message
        if ($activities->isEmpty()) {
            return [
                'markdown' => "# Meeting Notes\n\n*No activities found for the selected date range and contexts.*",
                'sections' => [],
            ];
        }

        // Build the prompt for OpenAI
        $prompt = $this->buildPrompt($activities, $days, $options);

        // Try to generate meeting notes with OpenAI
        try {
            $generatedNotes = $this->generateWithOpenAI($prompt, $options);

            if ($generatedNotes) {
                return $generatedNotes;
            }
        } catch (\Exception $e) {
            Log::warning('OpenAI generation failed, using fallback', [
                'error' => $e->getMessage(),
            ]);
        }

        // Fallback to manual formatting if OpenAI fails
        return $this->generateFallbackNotes($activities, $days, $options);
    }

    /**
     * Build the prompt for OpenAI
     */
    private function buildPrompt(Collection $activities, ?Collection $days, array $options): string
    {
        $startDate = Carbon::parse($options['start_date'])->format('F j, Y');
        $endDate = Carbon::parse($options['end_date'])->format('F j, Y');

        // Group activities data
        $activitiesByStatus = $activities->groupBy('status');
        $completedCount = $activitiesByStatus->get('done', collect())->count();
        $inProgressCount = $activitiesByStatus->get('in_progress', collect())->count();
        $newCount = $activitiesByStatus->get('new', collect())->count();

        // Calculate total time
        $totalTimeMinutes = $activities->sum('time') ?? 0;
        $totalTimeFormatted = $this->formatTime($totalTimeMinutes);

        // Prepare activities JSON
        $activitiesData = $activities->map(function ($activity) use ($options) {
            $data = [
                'date' => $activity->date,
                'title' => $activity->title,
                'status' => $activity->status,
                'context' => $activity->context->name ?? 'General',
            ];

            if ($options['include_time'] && $activity->time) {
                $data['time_minutes'] = $activity->time;
            }

            if ($options['include_notes'] && $activity->notes) {
                $data['notes'] = $activity->notes;
            }

            return $data;
        })->toJson();

        // Prepare day notes if included
        $dayNotesText = '';
        if ($days && !$days->isEmpty()) {
            $dayNotes = $days->map(function ($day) {
                return "Date: {$day->date}\nNotes: {$day->notes}";
            })->join("\n\n");
            $dayNotesText = "\n\nDay Notes:\n$dayNotes";
        }

        // Build the prompt based on meeting type
        $meetingTypeInstructions = match($options['meeting_type']) {
            'team_update' => 'Format the notes for a team update meeting, focusing on project progress and team achievements.',
            'project_review' => 'Format the notes for a project review meeting, emphasizing milestones, deliverables, and next steps.',
            default => 'Format the notes for a 1:1 meeting with a manager, highlighting individual accomplishments and areas needing support.',
        };

        $prompt = "You are an expert assistant helping prepare notes for a professional meeting.

Given the following activities from $startDate to $endDate, create structured meeting notes.

Statistics:
- Total activities: {$activities->count()}
- Completed: $completedCount
- In Progress: $inProgressCount
- New/Planned: $newCount
- Total time tracked: $totalTimeFormatted

Activities data:
$activitiesData
$dayNotesText

Instructions:
1. $meetingTypeInstructions
2. Group related activities into logical themes or projects
3. Highlight key accomplishments and measurable progress
4. Identify any blockers, challenges, or dependencies
5. Suggest specific discussion points for the meeting
6. Include relevant metrics and time allocation where appropriate
7. Format as clear, professional bullet points
8. Keep the tone professional but conversational
9. Focus on impact and outcomes, not just task lists

Generate meeting notes in the following structure:

# Meeting Notes - $endDate

## Summary
[Brief 2-3 sentence overview of the period]

## Key Accomplishments
[Group by theme/project with bullet points]

## Work in Progress
[Current initiatives and their status]

## Challenges & Blockers
[Issues requiring discussion or support]

## Topics for Discussion
[Specific questions or topics to address]

## Next Steps
[Planned activities and priorities]

Keep the notes concise but comprehensive. Focus on what matters most for the meeting.";

        return $prompt;
    }

    /**
     * Generate meeting notes using OpenAI
     */
    private function generateWithOpenAI(string $prompt, array $options): ?array
    {
        $apiKey = config('services.openai.api_key');

        if (empty($apiKey)) {
            Log::warning('OpenAI API key not configured');
            return null;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(30)->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-4o-mini',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are a professional assistant that helps prepare meeting notes. Generate clear, structured meeting notes that are actionable and insightful. Always format your response in markdown.',
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt,
                    ],
                ],
                'temperature' => 0.3, // Lower temperature for consistent, professional output
                'max_tokens' => 2000,
            ]);

            if (!$response->successful()) {
                Log::error('OpenAI API request failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return null;
            }

            $data = $response->json();
            $content = $data['choices'][0]['message']['content'] ?? '';

            if (empty($content)) {
                return null;
            }

            // Parse sections from the markdown content
            $sections = $this->parseSections($content);

            return [
                'markdown' => $content,
                'sections' => $sections,
                'ai_generated' => true,
                'model' => 'gpt-4o-mini',
                'processing_time_ms' => $response->handlerStats()['total_time'] ?? null,
            ];

        } catch (\Exception $e) {
            Log::error('OpenAI meeting generation failed', [
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Generate fallback notes without AI
     */
    private function generateFallbackNotes(Collection $activities, ?Collection $days, array $options): array
    {
        $startDate = Carbon::parse($options['start_date'])->format('F j, Y');
        $endDate = Carbon::parse($options['end_date'])->format('F j, Y');

        $markdown = "# Meeting Notes - $endDate\n\n";
        $markdown .= "**Period:** $startDate to $endDate\n\n";

        // Summary
        $totalActivities = $activities->count();
        $completedActivities = $activities->where('status', 'done')->count();
        $totalTime = $this->formatTime($activities->sum('time') ?? 0);

        $markdown .= "## Summary\n";
        $markdown .= "During this period, I worked on $totalActivities activities, completing $completedActivities of them. ";
        if ($totalTime !== '0 minutes') {
            $markdown .= "Total time tracked: $totalTime.\n\n";
        } else {
            $markdown .= "\n\n";
        }

        // Group by context
        $activitiesByContext = $activities->groupBy(function ($activity) {
            return $activity->context->name ?? 'General';
        });

        // Key Accomplishments (completed items)
        $markdown .= "## Key Accomplishments\n\n";
        foreach ($activitiesByContext as $contextName => $contextActivities) {
            $completed = $contextActivities->where('status', 'done');
            if ($completed->isNotEmpty()) {
                $icon = $completed->first()->context->icon ?? '';
                $markdown .= "### $icon $contextName\n";
                foreach ($completed as $activity) {
                    $markdown .= "- {$activity->title}";
                    if ($options['include_time'] && $activity->time) {
                        $markdown .= " ({$this->formatTime($activity->time)})";
                    }
                    $markdown .= "\n";
                    if ($options['include_notes'] && $activity->notes) {
                        $markdown .= "  - {$activity->notes}\n";
                    }
                }
                $markdown .= "\n";
            }
        }

        // Work in Progress
        $markdown .= "## Work in Progress\n\n";
        foreach ($activitiesByContext as $contextName => $contextActivities) {
            $inProgress = $contextActivities->where('status', 'in_progress');
            if ($inProgress->isNotEmpty()) {
                $icon = $inProgress->first()->context->icon ?? '';
                $markdown .= "### $icon $contextName\n";
                foreach ($inProgress as $activity) {
                    $markdown .= "- {$activity->title}";
                    if ($options['include_time'] && $activity->time) {
                        $markdown .= " ({$this->formatTime($activity->time)} spent)";
                    }
                    $markdown .= "\n";
                    if ($options['include_notes'] && $activity->notes) {
                        $markdown .= "  - {$activity->notes}\n";
                    }
                }
                $markdown .= "\n";
            }
        }

        // Planned/New items
        $newActivities = $activities->where('status', 'new');
        if ($newActivities->isNotEmpty()) {
            $markdown .= "## Planned Activities\n\n";
            foreach ($newActivities->groupBy('context.name') as $contextName => $contextActivities) {
                $icon = $contextActivities->first()->context->icon ?? '';
                $markdown .= "### $icon $contextName\n";
                foreach ($contextActivities as $activity) {
                    $markdown .= "- {$activity->title}\n";
                    if ($options['include_notes'] && $activity->notes) {
                        $markdown .= "  - {$activity->notes}\n";
                    }
                }
                $markdown .= "\n";
            }
        }

        // Add day notes if available
        if ($days && !$days->isEmpty()) {
            $markdown .= "## Additional Notes\n\n";
            foreach ($days as $day) {
                $dayDate = Carbon::parse($day->date)->format('F j');
                $markdown .= "**$dayDate:** {$day->notes}\n\n";
            }
        }

        // Topics for discussion (generic)
        $markdown .= "## Topics for Discussion\n\n";
        $markdown .= "- Review progress on current initiatives\n";
        $markdown .= "- Discuss priorities for the upcoming period\n";
        $markdown .= "- Address any blockers or resource needs\n";

        $sections = $this->parseSections($markdown);

        return [
            'markdown' => $markdown,
            'sections' => $sections,
            'ai_generated' => false,
        ];
    }

    /**
     * Parse markdown into sections
     */
    private function parseSections(string $markdown): array
    {
        $sections = [];
        $lines = explode("\n", $markdown);
        $currentSection = null;
        $currentItems = [];

        foreach ($lines as $line) {
            if (preg_match('/^##\s+(.+)/', $line, $matches)) {
                // Save previous section
                if ($currentSection) {
                    $sections[] = [
                        'title' => $currentSection,
                        'items' => $currentItems,
                    ];
                }
                // Start new section
                $currentSection = $matches[1];
                $currentItems = [];
            } elseif (preg_match('/^-\s+(.+)/', $line, $matches)) {
                // Add item to current section
                $currentItems[] = $matches[1];
            }
        }

        // Save last section
        if ($currentSection) {
            $sections[] = [
                'title' => $currentSection,
                'items' => $currentItems,
            ];
        }

        return $sections;
    }

    /**
     * Format time from minutes to human readable
     */
    private function formatTime(int $minutes): string
    {
        if ($minutes === 0) {
            return '0 minutes';
        }

        $hours = floor($minutes / 60);
        $remainingMinutes = $minutes % 60;

        if ($hours > 0 && $remainingMinutes > 0) {
            return "{$hours} hour" . ($hours !== 1 ? 's' : '') . " {$remainingMinutes} minute" . ($remainingMinutes !== 1 ? 's' : '');
        } elseif ($hours > 0) {
            return "{$hours} hour" . ($hours !== 1 ? 's' : '');
        } else {
            return "{$remainingMinutes} minute" . ($remainingMinutes !== 1 ? 's' : '');
        }
    }
}