<?php

use App\Http\Controllers\AttributeController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CitiesController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CountriesController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\FrontendController;
use App\Http\Controllers\GiftCardController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RefundController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\ShippingRateController;
use App\Http\Controllers\StatesController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\TaxController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::domain('{subdomain}.pos.test')->middleware(['company'])->group(function () {
    // Cambiamos {slug?} por {page_path?} para claridad
    // Y lo pasamos vacío al controlador.
    Route::get('/{page_path?}', [FrontendController::class, 'show'])->name('subdomain.page');
});

Route::group([
    'domain' => '{domain}',
    'middleware' => ['company'],

    // AÑADIR LA RESTRICCIÓN 'where' AL ARRAY DE GRUPO
    // Esto evita el conflicto de array_merge
    'where' => ['domain' => '^(?!pos\.test$).+'],

], function () {
    // Si accedes a pepsi.test/tienda, {domain} será 'pepsi.test' y {page_path} será 'tienda'
    Route::get('/{page_path?}', [FrontendController::class, 'show'])->name('custom.page');
    Route::get('/detalles-del-producto', [FrontendController::class, 'productDetail'])->name('product.detail');
});



Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified', 'backend.company'])->name('dashboard');
Route::middleware(['auth', 'backend.company'])->prefix('dashboard')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('users', [UserController::class, 'index'])->name('user.index');
    Route::get('users/create', [UserController::class, 'create'])->name('user.create');
    Route::post('users', [UserController::class, 'store'])->name('user.store');
    Route::get('users/{user}/edit', [UserController::class, 'edit'])->name('user.edit');
    Route::post('users/{user}', [UserController::class, 'update'])->name('user.update');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('user.destroy');
    Route::post('/user/{user}/delivery-location', [UserController::class, 'storeDeliveryLocation'])->name('user.deliveryLocation.store');
    Route::put('/user/{user}/delivery-location/{deliveryLocation}', [UserController::class, 'updateDeliveryLocation'])->name('user.deliveryLocation.update');

    Route::get('clients', [ClientController::class, 'index'])->name('client.index');
    Route::get('clients/create', [ClientController::class, 'create'])->name('client.create');
    Route::post('clients', [ClientController::class, 'store'])->name('client.store');
    Route::get('clients/{client}/edit', [ClientController::class, 'edit'])->name('client.edit');
    Route::post('clients/{client}', [ClientController::class, 'update'])->name('client.update');
    Route::delete('clients/{client}', [ClientController::class, 'destroy'])->name('client.destroy');

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

    // Route::get('stores', [StoreController::class, 'index'])->name('stores.index');
    // Route::get('stores/create', [StoreController::class, 'create'])->name('stores.create');
    // Route::post('stores', [StoreController::class, 'store'])->name('stores.store');
    // Route::get('stores/{store}/edit', [StoreController::class, 'edit'])->name('stores.edit');
    // Route::post('stores/{store}', [StoreController::class, 'update'])->name('stores.update');
    // Route::delete('stores/{store}', [StoreController::class, 'destroy'])->name('stores.destroy');

    Route::get('products', [ProductController::class, 'index'])->name('products.index');
    Route::get('products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('products', [ProductController::class, 'store'])->name('products.store');
    Route::get('products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::post('products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
    Route::delete('/dashboard/products/{product}/images/{imageId}', [ProductController::class, 'destroyImage'])->name('products.images.destroy');
    Route::post('products/{product}/duplicate', [ProductController::class, 'duplicate'])->name('products.duplicate');

    Route::get('stocks', [StockController::class, 'index'])->name('stocks.index');
    Route::get('stocks/create', [StockController::class, 'create'])->name('stocks.create');
    Route::post('stocks', [StockController::class, 'store'])->name('stocks.store');
    Route::put('stocks/{stock}', [StockController::class, 'update'])->name('stocks.update');

    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/create', [OrderController::class, 'create'])->name('orders.create');
    Route::post('orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('orders/{orders}/edit', [OrderController::class, 'edit'])->name('orders.edit');
    Route::post('orders/{orders}', [OrderController::class, 'update'])->name('orders.update');
    Route::delete('orders/{orders}', [OrderController::class, 'destroy'])->name('orders.destroy');

    Route::get('discounts', [DiscountController::class, 'index'])->name('discounts.index');
    Route::get('discounts/create', [DiscountController::class, 'create'])->name('discounts.create');
    Route::post('discounts', [DiscountController::class, 'store'])->name('discounts.store');
    Route::get('discounts/{discount}/edit', [DiscountController::class, 'edit'])->name('discounts.edit');
    Route::post('discounts/{discount}', [DiscountController::class, 'update'])->name('discounts.update');
    Route::delete('discounts/{discount}', [DiscountController::class, 'destroy'])->name('discounts.destroy');
    
    Route::get('menus', [MenuController::class, 'index'])->name('menus.index');
    Route::get('menus/create', [MenuController::class, 'create'])->name('menus.create');
    Route::post('menus', [MenuController::class, 'store'])->name('menus.store');
    Route::get('menus/{menu}/edit', [MenuController::class, 'edit'])->name('menus.edit');
    Route::post('menus/{menu}', [MenuController::class, 'update'])->name('menus.update');
    Route::delete('menus/{menu}', [MenuController::class, 'destroy'])->name('menus.destroy');

    Route::get('gift-cards', [GiftCardController::class, 'index'])->name('giftCards.index');
    Route::get('gift-cards/create', [GiftCardController::class, 'create'])->name('giftCards.create');
    Route::post('gift-cards', [GiftCardController::class, 'store'])->name('giftCards.store');
    Route::get('gift-cards/{giftCard}/edit', [GiftCardController::class, 'edit'])->name('giftCards.edit');
    Route::post('gift-cards/{giftCard}', [GiftCardController::class, 'update'])->name('giftCards.update');
    Route::delete('gift-cards/{giftCard}', [GiftCardController::class, 'destroy'])->name('giftCards.destroy');
    Route::get('gift-cards', [GiftCardController::class, 'index'])->name('giftCards.index');

    Route::get('shipping-rates', [ShippingRateController::class, 'index'])->name('shippingrate.index');
    Route::get('shipping-rates/create', [ShippingRateController::class, 'create'])->name('shippingrate.create');
    Route::post('shipping-rates', [ShippingRateController::class, 'store'])->name('shippingrate.store');
    Route::get('shipping-rates/{shippingRate}/edit', [ShippingRateController::class, 'edit'])->name('shippingrate.edit');
    Route::post('shipping-rates/{shippingRate}', [ShippingRateController::class, 'update'])->name('shippingrate.update');
    Route::delete('shipping-rates/{shippingRate}', [ShippingRateController::class, 'destroy'])->name('shippingrate.destroy');

    Route::get('pages', [PageController::class, 'index'])->name('pages.index');
    Route::get('pages/create', [PageController::class, 'create'])->name('pages.create');
    Route::get('pages/{page}', [PageController::class, 'show'])->name('pages.show');
    Route::post('pages', [PageController::class, 'store'])->name('pages.store');
    Route::get('pages/{page}/edit', [PageController::class, 'edit'])->name('pages.edit');
    Route::post('pages/{page}', [PageController::class, 'update'])->name('pages.update');
    Route::delete('pages/{page}', [PageController::class, 'destroy'])->name('pages.destroy');
    Route::get('/pages/{page}/builder', [PageController::class, 'builder'])->name('pages.builder');
    Route::post('/pages/{page}/update-layout', [PageController::class, 'updateLayout'])->name('pages.updateLayout');
    Route::patch('/pages/{page}/theme', [PageController::class, 'updateTheme'])->name('pages.update-theme');
    Route::post('/pages/{page}/apply-template', [PageController::class, 'applyTemplate'])->name('pages.apply-template');
    Route::post('/pages/{page}/detach-template', [PageController::class, 'detachTemplate'])->name('pages.detach-template');
    Route::get('/pages/{page}/available-templates', [PageController::class, 'getAvailableTemplates'])->name('pages.available-templates');
    Route::post('/pages/{page}/copy-theme-settings', [PageController::class, 'copyThemeSettings'])->name('pages.copyThemeSettings');
    Route::post('/pages/{page}/update-theme-settings', [PageController::class, 'updateThemeSettings'])->name('pages.updateThemeSettings');
    Route::post('/pages/{page}/reset-theme-settings', [PageController::class, 'resetThemeSettings'])->name('pages.resetThemeSettings');

    Route::get('setting', [SettingController::class, 'index'])->name('setting.index');
    // Route::get('setting/{setting}/edit', [SettingController::class, 'edit'])->name('setting.edit');
    Route::post('setting/{setting}', [SettingController::class, 'update'])->name('setting.update');

    Route::get('/reports', [ReportController::class, 'index'])->name('reportes.index');

    Route::post('/refunds', [RefundController::class, 'store'])->name('refunds.store');
    Route::post('/orders/{order}/status', [OrderController::class, 'changeStatus'])->name('orders.changeStatus');
});

Route::get('/', function () {
    return Inertia::render('Welcome', [
        // 'canLogin' => Route::has('login'),
        // 'canRegister' => Route::has('register'),
        // 'laravelVersion' => Application::VERSION,
        // 'phpVersion' => PHP_VERSION,
    ]);
});

require __DIR__ . '/auth.php';
