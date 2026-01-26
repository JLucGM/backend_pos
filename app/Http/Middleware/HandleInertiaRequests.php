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
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? $request->user()->load('roles') : null,
            ],
            'settings' => function () use ($request) {
                if ($request->user() && $request->user()->company_id) {
                    return Setting::with('currency')->where('company_id', $request->user()->company_id)->first();
                }
                return null;
            },
        //      'flash' => [
        //     'message' => fn () => $request->session()->get('message'),
        // ],
        'env' => [
            'SESSION_DOMAIN' => env('SESSION_DOMAIN', '.pos.test'),
            'APP_URL' => env('APP_URL'),
        ],
        // 'ziggy' => function () use ($request) {
        //     return array_merge((new Ziggy)->toArray(), [
        //         'location' => $request->url(),
        //     ]);
        // },
        ];
    }
}
