<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => 'auth:api'], function () {
	Route::get('/user', function (Request $request) {
		return $request->user();
	});

	Route::post('/logout', function (Request $request) {
		$request->user()->token()->revoke();
		return response()->json(['message' => 'Successfully logged out']);
	});
});
