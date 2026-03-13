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
            'currency' => function () use ($request) {
                // Prioridad 1: Atributo 'company' del middleware IdentifyCompany (Frontend)
                // Prioridad 2: Usuario autenticado (Dashboard/Builder)
                $company = $request->attributes->get('company') ?: $request->user()?->company;
                $companyId = $company?->id;
                
                if (!$companyId) return null;

                $activeCurrencies = \App\Models\CompanyCurrency::with('currency')
                    ->where('company_id', $companyId)
                    ->where('is_active', true)
                    ->get();

                $selectedId = session('selected_currency_id');
                $selected = $activeCurrencies->where('currency_id', $selectedId)->first() 
                    ?? $activeCurrencies->where('is_base', true)->first();

                return [
                    'active_currencies' => $activeCurrencies->map(fn($cc) => [
                        'id' => $cc->currency_id,
                        'code' => $cc->currency->code,
                        'symbol' => $cc->currency->symbol,
                        'exchange_rate' => (float) $cc->exchange_rate,
                        'is_base' => $cc->is_base,
                    ])->values(),
                    'selected' => $selected ? [
                        'id' => $selected->currency_id,
                        'code' => $selected->currency->code,
                        'symbol' => $selected->currency->symbol,
                        'exchange_rate' => (float) $selected->exchange_rate,
                        'is_base' => (bool) $selected->is_base,
                    ] : null,
                ];
            },
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
