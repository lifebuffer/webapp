<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Get the authenticated user's profile.
     */
    public function profile(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

    /**
     * Update the authenticated user's profile.
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $updateData = [
            'name' => $request->input('name'),
            'email' => $request->input('email'),
        ];

        // Only update password if provided
        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->input('password'));
        }

        $user->update($updateData);

        return response()->json($user);
    }

    /**
     * Delete the authenticated user's account.
     */
    public function deleteAccount(Request $request): JsonResponse
    {
        $user = $request->user();

        // Validate password confirmation for account deletion
        $validator = Validator::make($request->all(), [
            'password' => 'required|string',
            'confirmation' => 'required|string|in:DELETE',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Verify password
        if (!Hash::check($request->input('password'), $user->password)) {
            return response()->json(['error' => 'Invalid password'], 422);
        }

        // Revoke all tokens
        $user->tokens()->delete();

        // Soft delete or hard delete the user
        $user->days()->forceDelete();
        $user->activities()->forceDelete();
        $user->contexts()->forceDelete();
        $user->forceDelete();

        return response()->json(['message' => 'Account deleted successfully'], 200);
    }
}
