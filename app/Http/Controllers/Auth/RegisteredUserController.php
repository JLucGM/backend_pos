<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\PaymentMethod;
use App\Models\Setting;
use App\Models\ShippingRate;
use App\Models\Store;
use App\Models\SubscriptionPlan;
use App\Models\Subscription;
use App\Models\Tax;
use App\Models\User;
use App\Services\DefaultMenuService; // <-- Agregar esta línea
use App\Services\DefaultPageService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        $subscriptionPlans = SubscriptionPlan::where('is_public', true)->active()
            ->orderBy('sort_order')
            ->orderBy('price')
            ->get();

        return Inertia::render('Auth/Register', [
            'subscriptionPlans' => $subscriptionPlans,
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // Validaciones necesarias
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'avatar' => 'nullable|image|max:2048',
            'company_name' => 'required|string|max:255|unique:companies,name',
            'selected_plan_id' => 'nullable|exists:subscription_plans,id',
            'billing_cycle' => 'nullable|in:monthly,yearly',
        ]);

        // Usar transacción para asegurar consistencia
        DB::transaction(function () use ($request) {
            // Creación del usuario
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'is_active' => 1,
            ]);

            // Guardar avatar si se ha subido
            if ($request->hasFile('avatar')) {
                $user->addMediaFromRequest('avatar')->toMediaCollection('avatars');
            }

            // Crear la empresa con configuración de prueba por defecto
            $company = Company::create([
                'name' => $request->company_name,
                'is_trial' => true,
                'trial_ends_at' => Carbon::now()->addDays(14), // 14 días de prueba
            ]);

            $store = Store::create([
                'name' => 'Default Store',
                'company_id' => $company->id,
                'is_ecommerce_active' => true,
                'allow_delivery' => true,
                'allow_pickup' => true,
                'allow_shipping' => true
            ]);

            // Crear configuración por defecto
            Setting::create([
                'company_id' => $company->id,
                'currency_id' => 1,
            ]);

            ShippingRate::create([
                'name' => 'Tarifa Estándar',
                'company_id' => $company->id,
                'store_id' => $store->id,
                'is_active' => true,
                'price' => 0.00,
                'description' => 'Tarifa estándar para envíos locales.',
            ]);

            PaymentMethod::create([
                'payment_method_name' => 'Efectivo',
                'company_id' => $company->id,
                'is_active' => true,
                'description' => 'Método de pago en efectivo para transacciones presenciales.',
            ]);

            Tax::create([
                'tax_name' => 'IVA',
                'company_id' => $company->id,
                // 'is_active' => true,
                'tax_rate' => 16.00,
                'tax_description' => 'Impuesto sobre el valor agregado del producto.',
            ]);

            // Crear menú por defecto (exactamente como tu ejemplo)
            DefaultMenuService::createForCompany($company);

            // Crear páginas por defecto para la empresa <-- Agregar esta línead
            DefaultPageService::createForCompany($company);

            // Asociar la empresa al usuario
            $user->company()->associate($company);
            $user->save();

            // Asignar rol de admin
            $user->assignRole('admin');
        });

        // Obtener el usuario creado para login y eventos
        $user = User::where('email', $request->email)->first();

        // Manejar suscripción si se seleccionó un plan
        if ($request->selected_plan_id) {
            $plan = SubscriptionPlan::find($request->selected_plan_id);
            $billingCycle = $request->billing_cycle ?? 'monthly';

            if ($plan) {
                $company = $user->company;

                // Si es un plan de prueba, activarlo inmediatamente
                if ($plan->is_trial) {
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

                    $company->update([
                        'current_subscription_id' => $subscription->id,
                        'trial_ends_at' => now()->addDays($plan->trial_days),
                    ]);
                } else {
                    // Para planes de pago, crear suscripción inactiva y redirigir a pago
                    $amount = $plan->getPriceForCycle($billingCycle);

                    $subscription = Subscription::create([
                        'company_id' => $company->id,
                        'subscription_plan_id' => $plan->id,
                        'status' => 'inactive',
                        'billing_cycle' => $billingCycle,
                        'amount' => $amount,
                        'currency' => $plan->currency,
                        'starts_at' => now(),
                        'ends_at' => $billingCycle === 'yearly' ? now()->addYear() : now()->addMonth(),
                    ]);

                    event(new Registered($user));
                    Auth::login($user);

                    // Redirigir directamente al pago
                    return redirect()->route('subscriptions.payment', $subscription)
                        ->with('message', 'Cuenta creada exitosamente. Completa el pago para activar tu suscripción.');
                }
            }
        }

        event(new Registered($user));
        Auth::login($user);

        return redirect(route('dashboard', absolute: false))
            ->with('message', 'Cuenta creada exitosamente. Tienes 14 días de prueba gratuita.');
    }
}
