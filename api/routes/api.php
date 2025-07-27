<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ContextController;
use App\Http\Controllers\Api\TodayController;
use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\DayController;

Route::group(['middleware' => 'auth:api'], function () {
	Route::get('/user', function (Request $request) {
		return $request->user();
	});

	Route::post('/logout', function (Request $request) {
		$request->user()->token()->revoke();
		return response()->json(['message' => 'Successfully logged out']);
	});

	// Context routes
	Route::apiResource('contexts', ContextController::class);

	// Activity routes
	Route::put('/activities/{id}', [ActivityController::class, 'update']);

	// Day routes
	Route::put('/days/{date}', [DayController::class, 'update']);

	// Today endpoint
	Route::get('/today', [TodayController::class, 'index']);
	Route::get('/today/{date}', [TodayController::class, 'show']);
	Route::get('/recent', [TodayController::class, 'recent']);
});
