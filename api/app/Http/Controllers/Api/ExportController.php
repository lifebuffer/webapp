<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Day;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    /**
     * Export user data in the requested format
     */
    public function export(Request $request): StreamedResponse
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date_format:Y-m-d',
            'end_date' => 'required|date_format:Y-m-d|after_or_equal:start_date',
            'context_ids' => 'required|array|min:1',
            'context_ids.*' => 'integer|exists:contexts,id',
            'format' => 'required|in:markdown,text,csv',
            'include_notes' => 'boolean',
        ]);

        if ($validator->fails()) {
            abort(422, 'Invalid export parameters');
        }

        $user = $request->user();
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $contextIds = $request->input('context_ids');
        $format = $request->input('format');
        $includeNotes = $request->boolean('include_notes', true);

        // Verify user owns all requested contexts
        $userContextIds = $user->contexts()->whereIn('id', $contextIds)->pluck('id')->toArray();
        if (count($userContextIds) !== count($contextIds)) {
            abort(403, 'Unauthorized access to contexts');
        }

        // Get activities within date range and contexts
        $activities = Activity::where('user_id', $user->id)
            ->whereBetween('date', [$startDate, $endDate])
            ->whereIn('context_id', $contextIds)
            ->with('context')
            ->orderBy('date', 'asc')
            ->orderBy('created_at', 'asc')
            ->get();

        // Get days within date range for notes
        $days = Day::where('user_id', $user->id)
            ->whereBetween('date', [$startDate, $endDate])
            ->orderBy('date', 'asc')
            ->get()
            ->keyBy('date');

        // Group activities by date
        $activitiesByDate = $activities->groupBy('date');

        // Generate filename
        $filename = sprintf(
            'lifebuffer-export-%s-to-%s.%s',
            $startDate,
            $endDate,
            $format === 'csv' ? 'csv' : ($format === 'markdown' ? 'md' : 'txt')
        );

        // Return streamed response
        return response()->streamDownload(function () use ($format, $activitiesByDate, $days, $startDate, $endDate, $includeNotes) {
            switch ($format) {
                case 'markdown':
                    $this->exportMarkdown($activitiesByDate, $days, $startDate, $endDate, $includeNotes);
                    break;
                case 'text':
                    $this->exportText($activitiesByDate, $days, $startDate, $endDate, $includeNotes);
                    break;
                case 'csv':
                    $this->exportCsv($activitiesByDate, $days, $startDate, $endDate, $includeNotes);
                    break;
            }
        }, $filename);
    }

    /**
     * Export data as Markdown
     */
    private function exportMarkdown($activitiesByDate, $days, $startDate, $endDate, $includeNotes): void
    {
        $formattedStart = Carbon::parse($startDate)->format('M j, Y');
        $formattedEnd = Carbon::parse($endDate)->format('M j, Y');

        echo "# LifeBuffer.com Export - {$formattedStart} to {$formattedEnd}\n\n";

        // Generate date range
        $currentDate = Carbon::parse($startDate);
        $endDateCarbon = Carbon::parse($endDate);

        while ($currentDate <= $endDateCarbon) {
            $dateStr = $currentDate->format('Y-m-d');
            $formattedDate = $currentDate->format('l, F j, Y');

            echo "## {$formattedDate}\n\n";

            // Add day notes if exists and notes are included
            if ($includeNotes && isset($days[$dateStr]) && !empty($days[$dateStr]->notes)) {
                echo "### Notes\n\n";
                echo $days[$dateStr]->notes . "\n\n";
            }

            // Add activities
            if (isset($activitiesByDate[$dateStr])) {
                $activitiesByContext = $activitiesByDate[$dateStr]->groupBy('context.name');

                foreach ($activitiesByContext as $contextName => $activities) {
                    $contextIcon = $activities->first()->context->icon ?? '';
                    echo "### {$contextIcon} {$contextName}\n\n";

                    foreach ($activities as $activity) {
                        // Status checkbox
                        $checkbox = match($activity->status) {
                            'done' => '[x]',
                            'in_progress' => '[-]',
                            default => '[ ]',
                        };

                        echo "- {$checkbox} {$activity->title}";

                        // Add time if exists
                        if ($activity->time) {
                            $hours = floor($activity->time / 60);
                            $minutes = $activity->time % 60;
                            $timeStr = $hours > 0 ? "{$hours}h {$minutes}m" : "{$minutes}m";
                            echo " ({$timeStr})";
                        }

                        echo "\n";

                        // Add notes if requested and exists
                        if ($includeNotes && !empty($activity->notes)) {
                            // Indent notes
                            $notes = str_replace("\n", "\n  ", $activity->notes);
                            echo "  > {$notes}\n";
                        }
                    }
                    echo "\n";
                }
            } else {
                echo "*No activities for this day*\n\n";
            }

            $currentDate->addDay();
        }
    }

    /**
     * Export data as plain text
     */
    private function exportText($activitiesByDate, $days, $startDate, $endDate, $includeNotes): void
    {
        $formattedStart = Carbon::parse($startDate)->format('M j, Y');
        $formattedEnd = Carbon::parse($endDate)->format('M j, Y');

        echo "LifeBuffer.com Export - {$formattedStart} to {$formattedEnd}\n";
        echo str_repeat('=', 50) . "\n\n";

        // Generate date range
        $currentDate = Carbon::parse($startDate);
        $endDateCarbon = Carbon::parse($endDate);

        while ($currentDate <= $endDateCarbon) {
            $dateStr = $currentDate->format('Y-m-d');
            $formattedDate = $currentDate->format('l, F j, Y');

            echo "{$formattedDate}\n";
            echo str_repeat('-', strlen($formattedDate)) . "\n\n";

            // Add day notes if exists and notes are included
            if ($includeNotes && isset($days[$dateStr]) && !empty($days[$dateStr]->notes)) {
                echo "NOTES:\n";
                echo $days[$dateStr]->notes . "\n\n";
            }

            // Add activities
            if (isset($activitiesByDate[$dateStr])) {
                $activitiesByContext = $activitiesByDate[$dateStr]->groupBy('context.name');

                foreach ($activitiesByContext as $contextName => $activities) {
                    $contextIcon = $activities->first()->context->icon ?? '';
                    echo "{$contextIcon} {$contextName}:\n";

                    foreach ($activities as $activity) {
                        // Status
                        $status = match($activity->status) {
                            'done' => '[DONE]',
                            'in_progress' => '[IN PROGRESS]',
                            default => '[NEW]',
                        };

                        echo "  {$status} {$activity->title}";

                        // Add time if exists
                        if ($activity->time) {
                            $hours = floor($activity->time / 60);
                            $minutes = $activity->time % 60;
                            $timeStr = $hours > 0 ? "{$hours}h {$minutes}m" : "{$minutes}m";
                            echo " ({$timeStr})";
                        }

                        echo "\n";

                        // Add notes if requested and exists
                        if ($includeNotes && !empty($activity->notes)) {
                            echo "    Notes: {$activity->notes}\n";
                        }
                    }
                    echo "\n";
                }
            } else {
                echo "No activities for this day\n\n";
            }

            echo "\n";
            $currentDate->addDay();
        }
    }

    /**
     * Export data as CSV
     */
    private function exportCsv($activitiesByDate, $days, $startDate, $endDate, $includeNotes): void
    {
        // CSV header
        $headers = ['Date', 'Context', 'Status', 'Title', 'Time (minutes)'];
        if ($includeNotes) {
            $headers[] = 'Activity Notes';
            $headers[] = 'Day Notes';
        }

        // Output CSV header
        echo $this->csvRow($headers);

        // Generate date range
        $currentDate = Carbon::parse($startDate);
        $endDateCarbon = Carbon::parse($endDate);

        while ($currentDate <= $endDateCarbon) {
            $dateStr = $currentDate->format('Y-m-d');
            $dayNotes = ($includeNotes && isset($days[$dateStr])) ? $days[$dateStr]->notes : '';

            if (isset($activitiesByDate[$dateStr])) {
                foreach ($activitiesByDate[$dateStr] as $activity) {
                    $row = [
                        $dateStr,
                        $activity->context->name ?? '',
                        $activity->status,
                        $activity->title,
                        $activity->time ?? '0',
                    ];

                    if ($includeNotes) {
                        $row[] = $activity->notes ?? '';
                        $row[] = $dayNotes;
                    }

                    echo $this->csvRow($row);
                }
            } else {
                // Include empty row for days without activities
                $row = [
                    $dateStr,
                    '',
                    '',
                    'No activities',
                    '0',
                ];

                if ($includeNotes) {
                    $row[] = '';
                    $row[] = $dayNotes;
                }

                echo $this->csvRow($row);
            }

            $currentDate->addDay();
        }
    }

    /**
     * Convert array to CSV row
     */
    private function csvRow(array $fields): string
    {
        $handle = fopen('php://temp', 'r+');
        fputcsv($handle, $fields);
        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);
        return $csv;
    }
}
