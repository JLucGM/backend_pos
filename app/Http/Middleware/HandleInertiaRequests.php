<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? $user->load('company') : null,
                'roles' => $user ? $user->getRoleNames() : [],
                'permissions' => $user ? $user->getAllPermissions()->pluck('name') : [],
                'isSuperAdmin' => $user ? $user->isSuperAdmin() : false,
            ],
            'company' => $user?->company, // Compañía directamente
            'settings' => function () use ($request) {
                if ($request->user() && $request->user()->company_id) {
                    return Setting::with('currency')->where('company_id', $request->user()->company_id)->first();
                }
                return null;
            },
        'env' => [
            'SESSION_DOMAIN' => env('SESSION_DOMAIN', '.pos.test'),
            'APP_URL' => env('APP_URL'),
            'SUPER_ADMIN_EMAIL' => config('app.super_admin_email'),
        ],
        ];
    }
}
