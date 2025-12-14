<?php

namespace App\Http\Middleware;

use App\Services\CompanyManager;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class SetBackendCompany
{
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Verificar si el usuario está autenticado y tiene una compañía asociada
        if (Auth::check() && Auth::user()->company_id) {
            
            // 2. Establecer el ID de la compañía en el CompanyManager
            CompanyManager::setCompanyId(Auth::user()->company_id);
        }

        return $next($request);
    }
}