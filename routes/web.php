<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TaxController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->prefix('dashboard')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('users', [UserController::class, 'index'])->name('user.index');
    Route::get('users/create', [UserController::class, 'create'])->name('user.create');
    Route::post('users', [UserController::class, 'store'])->name('user.store');
    Route::get('users/{user}/edit', [UserController::class, 'edit'])->name('user.edit');
    Route::post('users/{user}', [UserController::class, 'update'])->name('user.update');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('user.destroy');
    
    Route::get('taxes', [TaxController::class, 'index'])->name('tax.index');
    Route::get('taxes/create', [TaxController::class, 'create'])->name('tax.create');
    Route::post('taxes', [TaxController::class, 'store'])->name('tax.store');
    Route::get('taxes/{tax}/edit', [TaxController::class, 'edit'])->name('tax.edit');
    Route::post('taxes/{tax}', [TaxController::class, 'update'])->name('tax.update');
    Route::delete('taxes/{tax}', [TaxController::class, 'destroy'])->name('tax.destroy');
    
    Route::get('categories', [CategoryController::class, 'index'])->name('category.index');
    Route::get('categories/create', [CategoryController::class, 'create'])->name('category.create');
    Route::post('categories', [CategoryController::class, 'store'])->name('category.store');
    Route::get('categories/{category}/edit', [CategoryController::class, 'edit'])->name('category.edit');
    Route::post('categories/{category}', [CategoryController::class, 'update'])->name('category.update');
    Route::delete('categories/{category}', [CategoryController::class, 'destroy'])->name('category.destroy');

});

require __DIR__.'/auth.php';
