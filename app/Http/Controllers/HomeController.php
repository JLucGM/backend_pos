<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the SaaS landing page.
     */
    public function index(): Response
    {
        $subscriptionPlans = SubscriptionPlan::where('is_public', true)
            ->where('is_active', true)
            ->where('is_trial', false)
            ->orderBy('sort_order')
            ->orderBy('price')
            ->get();

        return Inertia::render('Welcome', [
            'subscriptionPlans' => $subscriptionPlans,
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }

    /**
     * Display the pricing comparison page.
     */
    public function pricing(): Response
    {
        $subscriptionPlans = SubscriptionPlan::where('is_public', true)
            ->where('is_active', true)
            ->where('is_trial', false)
            ->orderBy('sort_order')
            ->orderBy('price')
            ->get();

        return Inertia::render('Frontend/PricingComparison', [
            'subscriptionPlans' => $subscriptionPlans,
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }
}
