<?php

use App\Http\Controllers\Api\{AuthController,ClientApiController};
// use App\Http\Controllers\Api\ClientApiController;
use App\Http\Controllers\Api\ProductApiController;
use Illuminate\Support\Facades\Route;

// middleware auth
Route::middleware('auth:sanctum')->group(function () {
    Route::get('profile', [AuthController::class, 'profile']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('login', [AuthController::class, 'login']);

    Route::get('products', [ProductApiController::class, 'products']);
    Route::post('client', [ClientApiController::class, 'store']);
});
Route::get('client', [ClientApiController::class, 'show']);


Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
