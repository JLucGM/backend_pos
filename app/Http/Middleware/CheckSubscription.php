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
        // Características permitidas en trial
        $trialAllowedFeatures = [
            'dashboard.view',
            'products.view',
            'products.edit',
        ];

        // Características BLOQUEADAS en trial
        $trialBlockedFeatures = [
            'orders.create',     // Backend
            'orders.edit',
            'checkout.process',  // Frontend
            'checkout.access',   // Acceso a página Checkout
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
            case 'staff_users.create':
                $limit = $company->getSubscriptionLimit('staff_users');
                if ($limit === 0) return false;
                if ($limit === -1) return true;
                
                // Contar SOLO usuarios staff (excluir clientes)
                $currentCount = $company->users()
                    ->whereHas('roles', function($query) {
                        $query->whereNotIn('name', ['client']);
                    })
                    ->count();
                return $currentCount < $limit;

            case 'stores.create':
                $limit = $company->getSubscriptionLimit('stores');
                if ($limit === 0) return false;
                if ($limit === -1) return true;
                
                $currentCount = $company->stores()->count();
                return $currentCount < $limit;

            case 'pages.create':
                $limit = $company->getSubscriptionLimit('pages');
                if ($limit === 0) return false;
                if ($limit === -1) return true;
                
                // Contar SOLO páginas personalizadas (excluir 'essential')
                $currentCount = $company->pages()
                    ->where('page_type', '!=', 'essential')
                    ->count();
                return $currentCount < $limit;

            case 'orders.create':
            case 'orders.edit':
                // En período de prueba, NO permitir órdenes
                if ($company->onTrial()) {
                    return false;
                }
                // En planes pagos, permitir órdenes ilimitadas
                return true;

            case 'products.create':
                // Productos siempre permitidos (sin límite)
                return true;

            default:
                return true;
        }
    }
}