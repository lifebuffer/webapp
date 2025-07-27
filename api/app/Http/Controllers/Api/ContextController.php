<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Context;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ContextController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $contexts = $request->user()->contexts()
            ->orderBy('name')
            ->get();

        return response()->json($contexts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:10',
        ]);

        $context = $request->user()->contexts()->create($validated);

        return response()->json($context, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Context $context): JsonResponse
    {
        // Ensure the user owns the context
        if ($context->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($context->load('activities'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Context $context): JsonResponse
    {
        // Ensure the user owns the context
        if ($context->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'icon' => 'nullable|string|max:10',
        ]);

        $context->update($validated);

        return response()->json($context);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Context $context): JsonResponse
    {
        // Ensure the user owns the context
        if ($context->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $context->delete();

        return response()->json(null, 204);
    }
}
