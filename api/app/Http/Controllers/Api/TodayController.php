<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Context;
use App\Models\Day;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

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
}