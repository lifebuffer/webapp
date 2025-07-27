<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ContextController;
use App\Http\Controllers\Api\TodayController;

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

	// Today endpoint
	Route::get('/today', [TodayController::class, 'index']);
});
