<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Otorga poder total al usuario con el email configurado en el .env
        // Este usuario es el único Super Admin real y es inmutable desde la DB.
        Gate::before(function ($user, $ability) {
            return $user->email === env('SUPER_ADMIN_EMAIL') ? true : null;
        });
    }
}
