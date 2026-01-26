<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
                // \App\Http\Middleware\DebugRouteSelection::class,
        ]);
        $middleware->alias([
            'company' => \App\Http\Middleware\IdentifyCompany::class,
            'backend.company' => \App\Http\Middleware\SetBackendCompany::class,
            'client' => \App\Http\Middleware\EnsureUserIsClient::class,
            'frontend.guest' => \App\Http\Middleware\RedirectIfFrontendAuthenticated::class,
            'subscription' => \App\Http\Middleware\CheckSubscription::class,
            'role' => \Spatie\Permission\Middlewares\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middlewares\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middlewares\RoleOrPermissionMiddleware::class,
            'super.admin' => \App\Http\Middleware\CheckSuperAdmin::class,
        ]);
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
