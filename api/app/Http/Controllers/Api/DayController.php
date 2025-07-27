<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Day;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class DayController extends Controller
{
    /**
     * Update the specified day.
     */
    public function update(Request $request, string $date): JsonResponse
    {
        $user = $request->user();
        
        // Validate date format
        $validator = Validator::make(['date' => $date], [
            'date' => 'required|date_format:Y-m-d',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Invalid date format'], 400);
        }

        // Find or create the day for the user
        $day = Day::firstOrCreate(
            [
                'user_id' => $user->id,
                'date' => $date,
            ],
            [
                'notes' => '',
                'summary' => '',
            ]
        );

        // Authorize the action
        $this->authorize('update', $day);

        // Validate the request data
        $validator = Validator::make($request->all(), [
            'notes' => 'sometimes|nullable|string',
            'summary' => 'sometimes|nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update only the provided fields
        $updateData = [];
        
        if ($request->has('notes')) {
            $updateData['notes'] = $request->input('notes');
        }
        if ($request->has('summary')) {
            $updateData['summary'] = $request->input('summary');
        }

        $day->update($updateData);

        return response()->json($day);
    }
}