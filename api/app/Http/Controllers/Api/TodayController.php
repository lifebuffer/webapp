<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Context;
use App\Models\Day;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class TodayController extends Controller
{
    /**
     * Get today's data including activities, day model, and contexts
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $today = Carbon::today();

        // Get or create today's day model
        $day = Day::firstOrCreate(
            [
                'user_id' => $user->id,
                'date' => $today->toDateString(),
            ],
            [
                'notes' => '',
                'summary' => '',
            ]
        );

        // Get today's activities
        $activities = Activity::where('user_id', $user->id)
            ->where('date', $today->toDateString())
            ->with('context')
            ->orderBy('created_at', 'asc')
            ->get();

        // Get all user contexts
        $contexts = Context::where('user_id', $user->id)
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'day' => $day,
            'activities' => $activities,
            'contexts' => $contexts,
        ]);
    }

    /**
     * Get data for a specific date
     */
    public function show(Request $request, string $date): JsonResponse
    {
        // Validate date format
        $validator = Validator::make(['date' => $date], [
            'date' => 'required|date_format:Y-m-d',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Invalid date format'], 400);
        }

        $user = $request->user();
        $targetDate = Carbon::parse($date);

        // Get or create the day model for the specified date
        $day = Day::firstOrCreate(
            [
                'user_id' => $user->id,
                'date' => $targetDate->toDateString(),
            ],
            [
                'notes' => '',
                'summary' => '',
            ]
        );

        // Get activities for the specified date
        $activities = Activity::where('user_id', $user->id)
            ->where('date', $targetDate->toDateString())
            ->with('context')
            ->orderBy('created_at', 'asc')
            ->get();

        // Get all user contexts
        $contexts = Context::where('user_id', $user->id)
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'day' => $day,
            'activities' => $activities,
            'contexts' => $contexts,
        ]);
    }

    /**
     * Get data for the last 35 days
     */
    public function recent(Request $request): JsonResponse
    {
        $user = $request->user();
        $endDate = Carbon::today();
        $startDate = Carbon::today()->subDays(34); // 35 days including today

        // Get or create day models for the date range
        $days = [];
        $currentDate = $startDate->copy();
        
        while ($currentDate <= $endDate) {
            $day = Day::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'date' => $currentDate->toDateString(),
                ],
                [
                    'notes' => '',
                    'summary' => '',
                ]
            );
            $days[] = $day;
            $currentDate->addDay();
        }

        // Get all activities for the date range
        $activities = Activity::where('user_id', $user->id)
            ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
            ->with('context')
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'asc')
            ->get();

        // Get all user contexts
        $contexts = Context::where('user_id', $user->id)
            ->orderBy('name', 'asc')
            ->get();

        // Group activities by date
        $activitiesByDate = $activities->groupBy('date');

        // Build response with days and their activities
        $daysWithActivities = collect($days)->map(function ($day) use ($activitiesByDate) {
            return [
                'day' => $day,
                'activities' => $activitiesByDate->get($day->date, collect())->values(),
            ];
        });

        return response()->json([
            'days' => $daysWithActivities,
            'contexts' => $contexts,
        ]);
    }
}