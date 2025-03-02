<?php

use App\Http\Controllers\AttributeController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CitiesController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CountriesController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StatesController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\StoreController;
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

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');
Route::middleware('auth')->prefix('dashboard')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
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
    
    Route::get('attributes', [AttributeController::class, 'index'])->name('attribute.index');
    Route::get('attributes/create', [AttributeController::class, 'create'])->name('attribute.create');
    Route::post('attributes', [AttributeController::class, 'store'])->name('attribute.store');
    Route::get('attributes/{attribute}/edit', [AttributeController::class, 'edit'])->name('attribute.edit');
    Route::post('attributes/{attribute}', [AttributeController::class, 'update'])->name('attribute.update');
    Route::delete('attributes/{attribute}', [AttributeController::class, 'destroy'])->name('attribute.destroy');
    
    Route::get('payments_methods', [PaymentMethodController::class, 'index'])->name('paymentmethod.index');
    Route::get('payments_methods/create', [PaymentMethodController::class, 'create'])->name('paymentmethod.create');
    Route::post('payments_methods', [PaymentMethodController::class, 'store'])->name('paymentmethod.store');
    Route::get('payments_methods/{payment_method}/edit', [PaymentMethodController::class, 'edit'])->name('paymentmethod.edit');
    Route::post('payments_methods/{payment_method}', [PaymentMethodController::class, 'update'])->name('paymentmethod.update');
    Route::delete('payments_methods/{payment_method}', [PaymentMethodController::class, 'destroy'])->name('paymentmethod.destroy');
    
    Route::get('clients', [ClientController::class, 'index'])->name('clients.index');
    Route::get('clients/create', [ClientController::class, 'create'])->name('clients.create');
    Route::post('clients', [ClientController::class, 'store'])->name('clients.store');
    Route::get('clients/{client}/edit', [ClientController::class, 'edit'])->name('clients.edit');
    Route::post('clients/{client}', [ClientController::class, 'update'])->name('clients.update');
    Route::delete('clients/{client}', [ClientController::class, 'destroy'])->name('clients.destroy');

    
    Route::get('countries', [CountriesController::class, 'index'])->name('countries.index');
    Route::get('countries/create', [CountriesController::class, 'create'])->name('countries.create');
    Route::post('countries', [CountriesController::class, 'store'])->name('countries.store');
    Route::get('countries/{country}/edit', [CountriesController::class, 'edit'])->name('countries.edit');
    Route::post('countries/{country}', [CountriesController::class, 'update'])->name('countries.update');
    Route::delete('countries/{country}', [CountriesController::class, 'destroy'])->name('countries.destroy');

    Route::get('states', [StatesController::class, 'index'])->name('states.index');
    Route::get('states/create', [StatesController::class, 'create'])->name('states.create');
    Route::post('states', [StatesController::class, 'store'])->name('states.store');
    Route::get('states/{state}/edit', [StatesController::class, 'edit'])->name('states.edit');
    Route::post('states/{state}', [StatesController::class, 'update'])->name('states.update');
    Route::delete('states/{state}', [StatesController::class, 'destroy'])->name('states.destroy');

    Route::get('cities', [CitiesController::class, 'index'])->name('cities.index');
    Route::get('cities/create', [CitiesController::class, 'create'])->name('cities.create');
    Route::post('cities', [CitiesController::class, 'store'])->name('cities.store');
    Route::get('cities/{city}/edit', [CitiesController::class, 'edit'])->name('cities.edit');
    Route::post('cities/{city}', [CitiesController::class, 'update'])->name('cities.update');
    Route::delete('cities/{city}', [CitiesController::class, 'destroy'])->name('cities.destroy');

    Route::get('stores', [StoreController::class, 'index'])->name('stores.index');
    Route::get('stores/create', [StoreController::class, 'create'])->name('stores.create');
    Route::post('stores', [StoreController::class, 'store'])->name('stores.store');
    Route::get('stores/{store}/edit', [StoreController::class, 'edit'])->name('stores.edit');
    Route::post('stores/{store}', [StoreController::class, 'update'])->name('stores.update');
    Route::delete('stores/{store}', [StoreController::class, 'destroy'])->name('stores.destroy');

    Route::get('products', [ProductController::class, 'index'])->name('products.index');
    Route::get('products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('products', [ProductController::class, 'store'])->name('products.store');
    Route::get('products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::post('products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
    Route::delete('/dashboard/products/{product}/images/{imageId}', [ProductController::class, 'destroyImage'])->name('products.images.destroy');
    
    Route::get('stocks', [StockController::class, 'index'])->name('stocks.index');
    Route::get('stocks/create', [StockController::class, 'create'])->name('stocks.create');
    Route::post('stocks', [StockController::class, 'store'])->name('stocks.store');
    
    
    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/{orders}/edit', [OrderController::class, 'edit'])->name('orders.edit');
    Route::post('orders/{orders}', [OrderController::class, 'update'])->name('orders.update');

});

require __DIR__.'/auth.php';
