<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ContextController;
use App\Http\Controllers\Api\TodayController;
use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\DayController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ExportController;

Route::group(['middleware' => 'auth:api'], function () {
	Route::get('/user', function (Request $request) {
		return $request->user();
	});

	Route::post('/logout', function (Request $request) {
		$request->user()->token()->revoke();
		return response()->json(['message' => 'Successfully logged out']);
	});

	// User profile management
	Route::get('/profile', [UserController::class, 'profile']);
	Route::put('/profile', [UserController::class, 'updateProfile']);
	Route::delete('/account', [UserController::class, 'deleteAccount']);

	// Context routes
	Route::apiResource('contexts', ContextController::class);

	// Activity routes
	Route::post('/activities', [ActivityController::class, 'store']);
	Route::put('/activities/{id}', [ActivityController::class, 'update']);
	Route::delete('/activities/{id}', [ActivityController::class, 'destroy']);

	// Day routes
	Route::put('/days/{date}', [DayController::class, 'update']);

	// Today endpoint
	Route::get('/today', [TodayController::class, 'index']);
	Route::get('/today/{date}', [TodayController::class, 'show']);
	Route::get('/recent', [TodayController::class, 'recent']);
	
	// Export endpoint
	Route::post('/export', [ExportController::class, 'export']);
});
