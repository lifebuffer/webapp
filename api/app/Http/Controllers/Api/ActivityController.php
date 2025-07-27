<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ActivityController extends Controller
{
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