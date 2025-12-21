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

    // App/Http/Controllers/FrontendController.php
public function show(Request $request)
{
    $company = $request->attributes->get('company');
    $slug = $request->route('page_path');

    $query = $company->pages()
                     ->withoutGlobalScope(CompanyScope::class);
    
    if (is_null($slug)) {
        $page = $query->where('is_homepage', true)->firstOrFail();
    } else {
        $page = $query->where('slug', $slug)->firstOrFail();
    }

    $themeSettings = $page->theme_settings ?? $company->theme_settings ?? [];
    
    // Cargar los menús con sus ítems y sub-ítems de forma recursiva
    $availableMenus = $company->menus()->with(['items' => function ($query) {
        // Cargar los ítems de primer nivel y sus hijos anidados
        $query->whereNull('parent_id')->orderBy('order')->with(['children' => function ($q) {
            $q->orderBy('order')->with(['children' => function ($subQ) {
                $subQ->orderBy('order');
            }]);
        }]);
    }])->get()->toArray();

    return Inertia::render('Frontend/Index', [
        'page' => $page,
        'themeSettings' => $themeSettings,
        'availableMenus' => $availableMenus
    ]);
}
}
