<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientApiController;
use App\Http\Controllers\Api\OrderApiController;
use App\Http\Controllers\Api\ProductApiController;
use App\Http\Controllers\Api\PaymentMethodApiController;
use Illuminate\Support\Facades\Route;

// middleware auth
Route::middleware('auth:sanctum')->group(function () {
    Route::get('profile', [AuthController::class, 'profile']);
    Route::post('logout', [AuthController::class, 'logout']);

});

Route::get('client', [ClientApiController::class, 'show']);
Route::post('client', [ClientApiController::class, 'store']);

Route::get('payment-methods', [PaymentMethodApiController::class, 'show']);
Route::get('products', [ProductApiController::class, 'show']);
Route::post('orders', [OrderApiController::class, 'store']);

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
