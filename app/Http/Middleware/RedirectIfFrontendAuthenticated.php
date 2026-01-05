<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfFrontendAuthenticated
{
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                // Obtener el dominio de sesión desde la configuración
                $sessionDomain = config('session.domain') ?: '.pos.test';
                
                // Si estamos en el dominio principal (pos.test), no es frontend
                $mainDomain = ltrim($sessionDomain, '.');
                if ($request->getHost() === $mainDomain) {
                    return $next($request);
                }
                
                // Si llegamos aquí, estamos en un frontend (subdominio o dominio personalizado)
                return redirect('/');
            }
        }

        return $next($request);
    }
}