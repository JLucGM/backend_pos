<?php

namespace App\Http\Middleware;

use App\Models\Company;
use App\Services\CompanyManager;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IdentifyCompany
{
    public function handle(Request $request, Closure $next): Response
    {
        // dd("Middleware 'company' ejecutándose. Host:", $request->getHost());
        $host = $request->getHost();

        // 1. Intento de carga de la Compañía
        $company = Company::query()
            // Opción A: Búsqueda por Subdominio (pepsi.pos.test)
            // Si el host contiene ".pos.test", obtenemos el subdominio de la ruta.
            ->when(str_ends_with($host, '.pos.test'), function ($query) use ($request) {
                $subdomain = $request->route('subdomain'); // Capturado por la ruta {subdomain}
                return $query->where('subdomain', $subdomain);
            })
            // Opción B: Búsqueda por Dominio Propio (pepsi.test o mitienda.com)
            // Si no es un subdominio, asumimos que el Host completo es el dominio a buscar.
            ->when(!str_ends_with($host, '.pos.test'), function ($query) use ($host) {
                return $query->where('domain', $host); // Búsqueda en columna 'domain'
            })
            ->first();

        if (!$company) {
            // Si no se encuentra la compañía, abortamos 404
            abort(404, 'Compañía o Dominio no encontrado.');
        }

        // 2. Establecer el ID y adjuntar a la Request (como lo hacías)
        CompanyManager::setCompanyId($company->id); 
        $request->attributes->add(['company' => $company]);

        return $next($request);
    }
}
