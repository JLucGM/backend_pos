<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSubscription
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $feature = null): Response
    {
        $user = auth()->user();
        
        if (!$user || !$user->company) {
            return redirect()->route('login');
        }

        // Los super admins no necesitan suscripción
        if ($user->hasRole('super admin')) {
            return $next($request);
        }

        $company = $user->company;

        // Si está en período de prueba y no ha expirado, permitir acceso limitado
        if ($company->onTrial()) {
            // Si se especifica una característica, verificar si está permitida en trial
            if ($feature && !$this->isFeatureAllowedInTrial($feature)) {
                return redirect()->route('subscriptions.index')
                    ->with('error', 'Esta funcionalidad requiere una suscripción activa.');
            }
            
            return $next($request);
        }

        // Si el trial ha expirado y no tiene suscripción activa
        if ($company->trialExpired() && !$company->hasActiveSubscription()) {
            return redirect()->route('subscriptions.index')
                ->with('error', 'Tu período de prueba ha expirado. Selecciona un plan para continuar.');
        }

        // Si no tiene suscripción activa
        if (!$company->hasActiveSubscription()) {
            return redirect()->route('subscriptions.index')
                ->with('error', 'Necesitas una suscripción activa para acceder a esta funcionalidad.');
        }

        // Si se especifica una característica, verificar límites
        if ($feature && !$this->checkFeatureLimit($company, $feature)) {
            return redirect()->back()
                ->with('error', 'Has alcanzado el límite de tu plan actual. Considera actualizar tu suscripción.');
        }

        return $next($request);
    }

    /**
     * Verificar si una característica está permitida en el período de prueba
     */
    private function isFeatureAllowedInTrial(string $feature): bool
    {
        $trialAllowedFeatures = [
            'products.create',
            'products.edit',
            'users.create',
            'dashboard.view',
        ];

        $trialBlockedFeatures = [
            'orders.create',
            'orders.edit',
            'payments.process',
        ];

        return in_array($feature, $trialAllowedFeatures) && 
               !in_array($feature, $trialBlockedFeatures);
    }

    /**
     * Verificar límites de características según el plan
     */
    private function checkFeatureLimit($company, string $feature): bool
    {
        switch ($feature) {
            case 'orders.create':
                $limit = $company->getSubscriptionLimit('orders');
                if ($limit === 0) return false; // No permitido
                if ($limit === -1) return true; // Ilimitado
                
                $currentCount = $company->orders()->count();
                return $currentCount < $limit;

            case 'products.create':
                $limit = $company->getSubscriptionLimit('products');
                if ($limit === -1) return true; // Ilimitado
                
                $currentCount = $company->products()->count();
                return $currentCount < $limit;

            case 'users.create':
                $limit = $company->getSubscriptionLimit('users');
                if ($limit === -1) return true; // Ilimitado
                
                $currentCount = $company->users()->count();
                return $currentCount < $limit;

            default:
                return true;
        }
    }
}