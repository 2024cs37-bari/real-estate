<?php

use Illuminate\Support\Facades\Route;
use Zerp\RealEstate\Http\Controllers\AmenityController;
use Zerp\RealEstate\Http\Controllers\DashboardController;
use Zerp\RealEstate\Http\Controllers\PropertyController;
use Zerp\RealEstate\Http\Controllers\PropertyTypeController;
use Zerp\RealEstate\Http\Controllers\PropertyViewingController;

Route::middleware(['web', 'auth', 'verified', 'PlanModuleCheck:RealEstate'])->group(function () {
    Route::get('/dashboard/real-estate', [DashboardController::class, 'index'])->name('real-estate.index');

    Route::resource('real-estate/properties', PropertyController::class)->names('real-estate.properties');

    Route::prefix('real-estate/viewings')->name('real-estate.viewings.')->group(function () {
        Route::get('/', [PropertyViewingController::class, 'index'])->name('index');
        Route::post('/', [PropertyViewingController::class, 'store'])->name('store');
        Route::put('/{viewing}', [PropertyViewingController::class, 'update'])->name('update');
        Route::delete('/{viewing}', [PropertyViewingController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('real-estate/property-types')->name('real-estate.property-types.')->group(function () {
        Route::get('/', [PropertyTypeController::class, 'index'])->name('index');
        Route::post('/', [PropertyTypeController::class, 'store'])->name('store');
        Route::put('/{propertyType}', [PropertyTypeController::class, 'update'])->name('update');
        Route::delete('/{propertyType}', [PropertyTypeController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('real-estate/amenities')->name('real-estate.amenities.')->group(function () {
        Route::get('/', [AmenityController::class, 'index'])->name('index');
        Route::post('/', [AmenityController::class, 'store'])->name('store');
        Route::put('/{amenity}', [AmenityController::class, 'update'])->name('update');
        Route::delete('/{amenity}', [AmenityController::class, 'destroy'])->name('destroy');
    });
});
