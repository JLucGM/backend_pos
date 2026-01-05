<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureUserIsClient
{
    public function handle(Request $request, Closure $next)
    {
        // Verificar que el usuario esté autenticado
        if (!Auth::check()) {
            $company = $request->attributes->get('company');

            // Redirigir al login de clientes
            if (str_ends_with($request->getHost(), '.pos.test')) {
                // Para subdominio
                return redirect()->route('frontend.login', ['subdomain' => $company->subdomain]);
            } else {
                // Para dominio personalizado
                return redirect()->route('frontend.login.custom', ['domain' => $company->domain]);
            }
        }

        // Verificar que el usuario tenga rol de cliente
        $user = Auth::user();
        if (!$user->hasRole('client')) {
            abort(403, 'No tienes permiso para acceder a esta página.');
        }

        // Verificar que el cliente pertenezca a la compañía actual
        $company = $request->attributes->get('company');
        if ($user->company_id !== $company->id) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            if (str_ends_with($request->getHost(), '.pos.test')) {
                return redirect()->route('frontend.login', ['subdomain' => $company->subdomain]);
            } else {
                return redirect()->route('frontend.login.custom', ['domain' => $company->domain]);
            }
        }

        return $next($request);
    }
}
