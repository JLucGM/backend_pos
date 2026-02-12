<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionPlan;
use App\Models\Subscription;
use App\Models\SubscriptionPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    /**
     * Mostrar los planes de suscripción
     */
    public function index()
    {
        $plans = SubscriptionPlan::active()
            ->where('is_public', true)
            ->orderBy('sort_order')
            ->orderBy('price')
            ->get();

        $user = Auth::user();
        $currentCompany = $user->company;
        $currentSubscription = $currentCompany->currentSubscription;

        return Inertia::render('Subscriptions/Index', [
            'plans' => $plans,
            'currentSubscription' => $currentSubscription,
            'company' => $currentCompany,
        ]);
    }

    /**
     * Seleccionar un plan de suscripción
     */
    public function selectPlan(Request $request, SubscriptionPlan $plan)
    {
        $request->validate([
            'billing_cycle' => 'required|in:monthly,yearly',
        ]);

        $user = Auth::user();
        $company = $user->company;
        $billingCycle = $request->billing_cycle;
        $amount = $plan->getPriceForCycle($billingCycle);

        // Si es un plan de prueba, activarlo inmediatamente
        if ($plan->is_trial) {
            // Cancelar suscripción actual si existe
            if ($company->currentSubscription) {
                $company->currentSubscription->cancel();
            }

            $subscription = Subscription::create([
                'company_id' => $company->id,
                'subscription_plan_id' => $plan->id,
                'status' => 'trial',
                'billing_cycle' => $billingCycle,
                'amount' => 0,
                'currency' => $plan->currency,
                'starts_at' => now(),
                'ends_at' => now()->addDays($plan->trial_days),
                'trial_ends_at' => now()->addDays($plan->trial_days),
            ]);

            // Actualizar empresa
            $company->update([
                'current_subscription_id' => $subscription->id,
                'is_trial' => true,
                'trial_ends_at' => now()->addDays($plan->trial_days),
            ]);

            return redirect()->route('subscriptions.index')
                ->with('message', 'Plan de prueba activado exitosamente.');
        }

        // Para planes de pago, crear suscripción inactiva y redirigir a pago
        $subscription = Subscription::create([
            'company_id' => $company->id,
            'subscription_plan_id' => $plan->id,
            'status' => 'inactive', // Se activará cuando se complete el pago
            'billing_cycle' => $billingCycle,
            'amount' => $amount,
            'currency' => $plan->currency,
            'starts_at' => now(),
            'ends_at' => $billingCycle === 'yearly' ? now()->addYear() : now()->addMonth(),
        ]);

        return redirect()->route('subscriptions.payment', $subscription);
    }

    /**
     * Mostrar página de pago
     */
    public function payment(Subscription $subscription)
    {
        $user = Auth::user();
        
        // Verificar que la suscripción pertenece a la empresa del usuario
        if ($subscription->company_id !== $user->company_id) {
            abort(403);
        }

        return Inertia::render('Subscriptions/Payment', [
            'subscription' => $subscription->load('plan'),
            'paymentMethods' => [
                'paypal' => true,
                'stripe' => true,
                'offline' => true,
            ],
        ]);
    }

    /**
     * Procesar pago
     */
    public function processPayment(Request $request, Subscription $subscription)
    {
        $request->validate([
            'payment_method' => 'required|in:paypal,stripe,offline',
            'notes' => 'nullable|string|max:1000',
        ]);

        $user = Auth::user();
        
        // Verificar que la suscripción pertenece a la empresa del usuario
        if ($subscription->company_id !== $user->company_id) {
            abort(403);
        }

        // Crear registro de pago
        $payment = SubscriptionPayment::create([
            'subscription_id' => $subscription->id,
            'company_id' => $subscription->company_id,
            'payment_method' => $request->payment_method,
            'amount' => $subscription->amount,
            'currency' => $subscription->currency,
            'status' => $request->payment_method === 'offline' ? 'pending' : 'pending',
            'notes' => $request->notes,
        ]);

        // Procesar según el método de pago
        switch ($request->payment_method) {
            case 'paypal':
                return $this->processPayPalPayment($payment);
            case 'stripe':
                return $this->processStripePayment($payment);
            case 'offline':
                return $this->processOfflinePayment($payment);
        }
    }

    /**
     * Procesar pago con PayPal
     */
    private function processPayPalPayment(SubscriptionPayment $payment)
    {
        // Aquí integrarías con PayPal API
        // Por ahora, simulamos el proceso
        
        return redirect()->route('subscriptions.payment.success', $payment)
            ->with('message', 'Redirigiendo a PayPal...');
    }

    /**
     * Procesar pago con Stripe
     */
    private function processStripePayment(SubscriptionPayment $payment)
    {
        // Aquí integrarías con Stripe API
        // Por ahora, simulamos el proceso
        
        return redirect()->route('subscriptions.payment.success', $payment)
            ->with('message', 'Redirigiendo a Stripe...');
    }

    /**
     * Procesar pago offline
     */
    private function processOfflinePayment(SubscriptionPayment $payment)
    {
        return redirect()->route('subscriptions.payment.pending', $payment)
            ->with('message', 'Tu pago está siendo procesado. Te notificaremos cuando sea confirmado.');
    }

    /**
     * Página de éxito del pago
     */
    public function paymentSuccess(SubscriptionPayment $payment)
    {
        // Marcar pago como completado (esto normalmente se haría desde webhook)
        $payment->markAsCompleted();
        
        // Activar suscripción
        $subscription = $payment->subscription;
        $subscription->update(['status' => 'active']);
        
        // Actualizar empresa
        $company = $subscription->company;
        $company->update([
            'current_subscription_id' => $subscription->id,
            'is_trial' => false,
        ]);

        return Inertia::render('Subscriptions/Success', [
            'payment' => $payment->load('subscription.plan'),
        ]);
    }

    /**
     * Página de pago pendiente
     */
    public function paymentPending(SubscriptionPayment $payment)
    {
        return Inertia::render('Subscriptions/Pending', [
            'payment' => $payment->load('subscription.plan'),
        ]);
    }

    /**
     * Historial de pagos
     */
    public function payments()
    {
        $user = Auth::user();
        $company = $user->company;
        
        $payments = $company->subscriptionPayments()
            ->with('subscription.plan')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Subscriptions/Payments', [
            'payments' => $payments,
        ]);
    }

    /**
     * Cancelar suscripción
     */
    public function cancel(Subscription $subscription)
    {
        $user = Auth::user();
        
        // Verificar que la suscripción pertenece a la empresa del usuario
        if ($subscription->company_id !== $user->company_id) {
            abort(403);
        }

        $subscription->cancel();

        return redirect()->route('subscriptions.index')
            ->with('message', 'Tu suscripción ha sido cancelada.');
    }
}