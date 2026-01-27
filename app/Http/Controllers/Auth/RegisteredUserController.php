<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Setting;
use App\Models\SubscriptionPlan;
use App\Models\Subscription;
use App\Models\User;
use App\Services\DefaultMenuService; // <-- Agregar esta línea
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
        $subscriptionPlans = SubscriptionPlan::active()
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
            'company_phone' => 'nullable|string|max:20',
            'company_address' => 'nullable|string|max:255',
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
                'phone' => $request->company_phone,
                'address' => $request->company_address,
                'email' => $request->email,
                'is_trial' => true,
                'trial_ends_at' => Carbon::now()->addDays(14), // 14 días de prueba
            ]);

            // Crear configuración por defecto
            Setting::create([
                'company_id' => $company->id,
                'default_currency' => 'USD',
            ]);

            // Crear menú por defecto (exactamente como tu ejemplo)
            DefaultMenuService::createForCompany($company);

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
