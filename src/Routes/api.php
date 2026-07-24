<?php

use Illuminate\Support\Facades\Route;
use Zerp\RealEstate\Http\Controllers\Api\DashboardApiController;
use Zerp\RealEstate\Http\Controllers\Api\PropertyApiController;
use Zerp\RealEstate\Http\Controllers\Api\PropertyViewingApiController;

Route::prefix('api')->middleware(['api.json'])->group(function () {
    Route::group(['middleware' => ['auth:sanctum'], 'prefix' => 'real-estate'], function () {
        // Dashboard
        Route::get('dashboard', [DashboardApiController::class, 'index']);

        // Properties / Listings
        Route::apiResource('properties', PropertyApiController::class);

        // Viewings
        Route::apiResource('viewings', PropertyViewingApiController::class);
    });
});
