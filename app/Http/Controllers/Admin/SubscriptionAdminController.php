<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use App\Models\Subscription;
use App\Models\SubscriptionPayment;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SubscriptionAdminController extends Controller
{
    /**
     * Mostrar dashboard de suscripciones
     */
    public function index()
    {
        $subscriptions = Subscription::with(['company', 'plan', 'payments'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $stats = [
            'total_subscriptions' => Subscription::count(),
            'active_subscriptions' => Subscription::where('status', 'active')->count(),
            'trial_subscriptions' => Subscription::where('status', 'trial')->count(),
            'monthly_revenue' => SubscriptionPayment::where('status', 'completed')
                ->whereMonth('created_at', now()->month)
                ->sum('amount'),
            'total_revenue' => SubscriptionPayment::where('status', 'completed')->sum('amount'),
        ];

        return Inertia::render('Admin/Subscriptions/Index', [
            'subscriptions' => $subscriptions,
            'stats' => $stats,
        ]);
    }

    /**
     * Mostrar detalles de una suscripción
     */
    public function show(Subscription $subscription)
    {
        $subscription->load(['company', 'plan', 'payments']);

        return Inertia::render('Admin/Subscriptions/Show', [
            'subscription' => $subscription,
        ]);
    }

    /**
     * Crear nueva suscripción manualmente
     */
    public function create()
    {
        $plans = SubscriptionPlan::active()->get();
        $companies = Company::orderBy('name')->get();

        return Inertia::render('Admin/Subscriptions/Create', [
            'plans' => $plans,
            'companies' => $companies,
        ]);
    }

    /**
     * Almacenar nueva suscripción
     */
    public function store(Request $request)
    {
        $isNewCompany = $request->input('creation_mode') === 'new';

        $rules = [
            'subscription_plan_id' => 'required|exists:subscription_plans,id',
            'billing_cycle' => 'required|in:monthly,yearly',
            'status' => 'required|in:active,inactive,trial,cancelled',
            'starts_at' => 'required|date',
            'ends_at' => 'required|date|after:starts_at',
        ];

        if ($isNewCompany) {
            $rules = array_merge($rules, [
                'owner_name' => 'required|string|max:255',
                'owner_email' => 'required|string|email|max:255|unique:users,email',
                'owner_password' => 'required|string|min:8',
                'company_name' => 'required|string|max:255|unique:companies,name',
                'subdomain' => 'required|string|max:255|unique:companies,subdomain',
            ]);
        } else {
            $rules['company_id'] = 'required|exists:companies,id';
        }

        $request->validate($rules);

        $subscription = \DB::transaction(function () use ($request, $isNewCompany) {
            $companyId = $request->company_id;

            if ($isNewCompany) {
                // 1. Crear Usuario Owner
                $user = \App\Models\User::create([
                    'name' => $request->owner_name,
                    'email' => $request->owner_email,
                    'password' => \Hash::make($request->owner_password),
                    'is_active' => 1,
                ]);

                // 2. Crear Empresa
                $company = Company::create([
                    'name' => $request->company_name,
                    'subdomain' => \Str::slug($request->subdomain),
                    'is_trial' => $request->status === 'trial',
                ]);

                // Asociar
                $user->company()->associate($company);
                $user->save();

                // Roles y servicios por defecto
                \App\Services\DefaultRoleService::createForCompany($company);
                $user->assignRole('owner');
                
                \App\Services\DefaultMenuService::createForCompany($company);
                \App\Services\DefaultPageService::createForCompany($company);
                \App\Services\DefaultGlobalComponentService::createForCompany($company);

                // Configuración básica y tienda
                $store = \App\Models\Store::create([
                    'name' => 'Tienda Principal',
                    'company_id' => $company->id,
                    'is_ecommerce_active' => true,
                ]);

                \App\Models\Setting::create([
                    'company_id' => $company->id,
                    'currency_id' => 1,
                ]);

                $companyId = $company->id;
            }

            // 3. Crear Suscripción
            $plan = SubscriptionPlan::find($request->subscription_plan_id);
            $amount = $plan->getPriceForCycle($request->billing_cycle);

            $subscription = Subscription::create([
                'company_id' => $companyId,
                'subscription_plan_id' => $request->subscription_plan_id,
                'status' => $request->status,
                'billing_cycle' => $request->billing_cycle,
                'amount' => $amount,
                'currency' => $plan->currency,
                'starts_at' => $request->starts_at,
                'ends_at' => $request->ends_at,
            ]);

            // Actualizar empresa con la suscripción actual
            $company = Company::find($companyId);
            $company->update([
                'current_subscription_id' => $subscription->id,
                'is_trial' => $request->status === 'trial',
            ]);

            return $subscription;
        });

        return redirect()->route('admin.subscriptions.index')
            ->with('message', 'Suscripción ' . ($isNewCompany ? 'y empresa ' : '') . 'creada exitosamente.');
    }

    /**
     * Actualizar estado de suscripción
     */
    public function updateStatus(Request $request, Subscription $subscription)
    {
        $request->validate([
            'status' => 'required|in:active,inactive,trial,cancelled,expired',
        ]);

        $subscription->update(['status' => $request->status]);

        // Actualizar empresa
        $company = $subscription->company;
        if ($request->status === 'active' || $request->status === 'trial') {
            $company->update([
                'current_subscription_id' => $subscription->id,
                'is_trial' => $request->status === 'trial',
            ]);
        } elseif ($request->status === 'cancelled' || $request->status === 'expired') {
            if ($company->current_subscription_id === $subscription->id) {
                $company->update([
                    'current_subscription_id' => null,
                    'is_trial' => false,
                ]);
            }
        }

        return back()->with('message', 'Estado de suscripción actualizado.');
    }

    /**
     * Aprobar pago pendiente
     */
    public function approvePayment(SubscriptionPayment $payment)
    {
        $payment->markAsCompleted();
        
        // Activar o renovar suscripción
        $subscription = $payment->subscription;
        $subscription->renew();
        
        // Actualizar empresa
        $company = $subscription->company;
        $company->update([
            'current_subscription_id' => $subscription->id,
            'is_trial' => false,
        ]);

        return back()->with('message', 'Pago aprobado y suscripción activada.');
    }

    /**
     * Rechazar pago pendiente
     */
    public function rejectPayment(SubscriptionPayment $payment)
    {
        $payment->markAsFailed();

        return back()->with('message', 'Pago rechazado.');
    }

    /**
     * Analytics de suscripciones
     */
    public function analytics()
    {
        // Suscripciones por mes (últimos 12 meses)
        $subscriptionsByMonth = Subscription::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->where('created_at', '>=', now()->subMonths(12))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Ingresos por mes
        $revenueByMonth = SubscriptionPayment::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, SUM(amount) as revenue')
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->subMonths(12))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Distribución por planes
        $planDistribution = Subscription::selectRaw('subscription_plan_id, COUNT(*) as count')
            ->with('plan')
            ->groupBy('subscription_plan_id')
            ->get();

        // Pagos pendientes
        $pendingPayments = SubscriptionPayment::with(['subscription.company', 'subscription.plan'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Subscriptions/Analytics', [
            'subscriptionsByMonth' => $subscriptionsByMonth,
            'revenueByMonth' => $revenueByMonth,
            'planDistribution' => $planDistribution,
            'pendingPayments' => $pendingPayments,
        ]);
    }
}