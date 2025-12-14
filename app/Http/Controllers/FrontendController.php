<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Page;
use App\Models\Scopes\CompanyScope;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FrontendController extends Controller
{

    public function show(Request $request)
{
    // ... (Código de obtención de $company y $slug usando $request->route()
    // Si usaste la última versión que te di, ya no necesitas el $slug en los parámetros del método.

    $company = $request->attributes->get('company');
    $slug = $request->route('page_path');

    $query = $company->pages()
                     ->withoutGlobalScope(CompanyScope::class);
    
    if (is_null($slug)) {
        // Caso: RUTA RAÍZ (ej: pepsi.test/)
        $page = $query->where('is_homepage', true)->firstOrFail();
    } else {
        // Caso: HAY SLUG (ej: pepsi.test/tienda)
        $page = $query->where('slug', $slug)->firstOrFail();
    }
// dd($page);
    $themeSettings = $page->theme_settings ?? $company->theme_settings ?? [];
    return Inertia::render('Frontend/Index', compact('page', 'themeSettings'));
}
}
