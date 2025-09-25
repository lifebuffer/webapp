<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Day;
use App\Services\MeetingPreparationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class MeetingController extends Controller
{
    /**
     * Prepare meeting notes from activities
     */
    public function prepare(Request $request): JsonResponse
    {
        $user = $request->user();

        // Validate request
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date_format:Y-m-d',
            'end_date' => 'required|date_format:Y-m-d|after_or_equal:start_date',
            'context_ids' => 'required|array|min:1',
            'context_ids.*' => 'integer|exists:contexts,id',
            'meeting_type' => 'nullable|in:manager_1on1,team_update,project_review',
            'include_time' => 'nullable|boolean',
            'include_notes' => 'nullable|boolean',
            'group_by_context' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $contextIds = $request->input('context_ids');
        $meetingType = $request->input('meeting_type', 'manager_1on1');
        $includeTime = $request->boolean('include_time', true);
        $includeNotes = $request->boolean('include_notes', true);
        $groupByContext = $request->boolean('group_by_context', false);

        try {
            // Verify user owns all requested contexts
            $userContextIds = $user->contexts()
                ->whereIn('id', $contextIds)
                ->pluck('id')
                ->toArray();

            if (count($userContextIds) !== count($contextIds)) {
                return response()->json([
                    'error' => 'Unauthorized access to contexts'
                ], 403);
            }

            // Get activities within date range and contexts
            $activities = Activity::where('user_id', $user->id)
                ->whereBetween('date', [$startDate, $endDate])
                ->whereIn('context_id', $contextIds)
                ->with('context')
                ->orderBy('date', 'asc')
                ->orderBy('created_at', 'asc')
                ->get();

            // Get days within date range for notes if needed
            $days = null;
            if ($includeNotes) {
                $days = Day::where('user_id', $user->id)
                    ->whereBetween('date', [$startDate, $endDate])
                    ->whereNotNull('notes')
                    ->where('notes', '!=', '')
                    ->orderBy('date', 'asc')
                    ->get();
            }

            Log::info('Preparing meeting notes', [
                'user_id' => $user->id,
                'date_range' => "$startDate to $endDate",
                'activities_count' => $activities->count(),
                'contexts' => count($contextIds),
            ]);

            // Prepare meeting notes using the service
            $meetingService = app(MeetingPreparationService::class);
            $meetingNotes = $meetingService->prepare(
                $activities,
                $days,
                [
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'meeting_type' => $meetingType,
                    'include_time' => $includeTime,
                    'include_notes' => $includeNotes,
                    'group_by_context' => $groupByContext,
                ]
            );

            // Calculate total time
            $totalTimeMinutes = $activities->sum('time') ?? 0;

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => 'meeting_' . uniqid(),
                    'generated_at' => Carbon::now()->toIso8601String(),
                    'date_range' => [
                        'start' => $startDate,
                        'end' => $endDate,
                    ],
                    'total_activities' => $activities->count(),
                    'total_time_minutes' => $totalTimeMinutes,
                    'notes' => $meetingNotes,
                    'metadata' => [
                        'contexts_included' => $activities->pluck('context.name')->unique()->filter()->values(),
                        'activities_processed' => $activities->count(),
                        'meeting_type' => $meetingType,
                    ],
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Meeting preparation failed', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'Failed to prepare meeting notes. Please try again.',
                'debug_message' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}