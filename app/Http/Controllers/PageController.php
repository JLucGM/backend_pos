<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Page;
use App\Models\Product;
use App\Models\Template;
use App\Models\Theme;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as RoutingController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class PageController extends RoutingController
{
    public function __construct()
    {
        $this->middleware('can:admin.pages.index')->only('index');
        $this->middleware('can:admin.pages.create')->only('create', 'store');
        $this->middleware('can:admin.pages.edit')->only('edit', 'update');
        $this->middleware('can:admin.pages.delete')->only('destroy');
    }
    /**
     * Display a listing of the resource.s
     */
    public function index()
    {
        $pages = Page::all();

        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('Pages/Index', compact('pages', 'role', 'permission'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();
        // dd('create pages');
        return Inertia::render('Pages/Create', compact('role', 'permission'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        Page::create(array_merge(
            $request->only(
                'title',
                'content',
                // 'is_default',
                'is_published',
                // 'is_homepage',
            ),
            ['company_id' => $user->company_id]
        ));

        return to_route('pages.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Page $page)
    {
        $page->load('theme');

        $user = Auth::user();
        $companyId = $user->company_id;

        $products = Product::with('stocks', 'combinations.combinationAttributeValue.attributeValue.attribute', 'categories', 'media')
            ->where('company_id', $companyId)
            ->get();


        return Inertia::render('Pages/Show', compact('page', 'products'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Page $page)
    {
        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        $page->load('theme', 'template.theme');

        // Obtener templates disponibles para esta empresa
        $availableTemplates = Template::where('is_global', true)
            ->orWhere('company_id', $user->company_id)
            ->with('theme')
            ->get();

        return Inertia::render('Pages/Edit', compact('page', 'role', 'permission', 'availableTemplates'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Page $page)
    {
        $data = $request->only(
            'title',
            'content',
            // 'is_default',
            'is_published',
            // 'is_homepage',
            // 'sort_order',
        );

        $page->update($data);
        // dd($page);
        return to_route('pages.edit', $page);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Page $page)
    {
        $page->delete();
    }

    public function builder(Page $page)
    {
        // dd('builder', $page);
        $user = Auth::user();
        $companyId = $user->company_id;

        $products = Product::with('stocks', 'combinations.combinationAttributeValue.attributeValue.attribute', 'categories', 'media')
            ->where('company_id', $companyId)
            ->where('is_active', true)
            ->get();

        $availableTemplates = Template::where('is_global', true)
            ->orWhere('company_id', $companyId)
            ->with('theme')
            ->get();

        $themes = Theme::all();

        $page->load('template.theme', 'theme', 'company.setting.media');
        
        $logoUrl = null;
    if ($page->company->setting && $page->company->setting->getFirstMedia('logo')) {
        $logoUrl = $page->company->setting->getFirstMedia('logo')->getUrl();
    }
        // dd($logoUrl);
        // Obtener configuración del tema (personalizada o del tema original)
        $pageThemeSettings = $this->getPageThemeSettings($page);

        $availableMenus = Menu::where('company_id', $companyId)
            ->with(['items.children' => function ($query) {
                $query->orderBy('order', 'asc');
            }])
            ->get()->toArray();

        return Inertia::render('Pages/Builder', [
            'page' => $page,
            'products' => $products,
            'availableTemplates' => $availableTemplates,
            'themes' => $themes,
            'pageThemeSettings' => $pageThemeSettings,
            'availableMenus' => $availableMenus,
            'companyLogo' => $logoUrl,
        ]);
    }

    private function getPageThemeSettings($page)
    {
        // Si la página tiene configuraciones personalizadas, usarlas
        if ($page->theme_settings && is_array($page->theme_settings) && !empty($page->theme_settings)) {
            return $page->theme_settings;
        }

        // Si no, obtener del tema aplicado
        $appliedTheme = $this->getAppliedTheme($page, Theme::all());
        return $appliedTheme->settings ?? [];
    }

    private function getAppliedTheme($page, $themes)
    {
        // Misma lógica que ya tienes
        if ($page->theme_id && $page->theme) {
            return $page->theme;
        }

        if ($page->uses_template && $page->template && $page->template->theme) {
            return $page->template->theme;
        }

        if ($page->company?->default_theme_id) {
            $companyDefaultTheme = $themes->find($page->company->default_theme_id);
            if ($companyDefaultTheme) {
                return $companyDefaultTheme;
            }
        }

        return $themes->where('slug', 'tema-azul')->first() ?? $themes->first();
    }

    public function updateLayout(Request $request, Page $page)
    {
        // dd($request->all(), $page);
        $request->validate([
            'layout' => 'required|json', // Valida que sea JSON
        ]);

        $layout = json_decode($request->layout, true);
        if (!is_array($layout)) {
            return back()->withErrors(['layout' => 'El layout debe ser un array válido.']);
        }

        // Sanitiza el contenido (ej. para prevenir XSS en texto)
        foreach ($layout as &$component) {
            if (isset($component['content']) && is_string($component['content'])) {
                $component['content'] = strip_tags($component['content']); // Remueve HTML potencialmente peligroso
            }
            // Si es array (contenedor), no sanitizar aquí (puedes recursivamente sanitizar sub-componentes si quieres)
            if (isset($component['content']) && is_array($component['content'])) {
                foreach ($component['content'] as &$subComponent) {
                    if (isset($subComponent['content']) && is_string($subComponent['content'])) {
                        $subComponent['content'] = strip_tags($subComponent['content']);
                    }
                }
            }
        }


        $page->update([
            'layout' => json_encode($layout),
        ]);

        return redirect()->back()->with('success', 'Layout actualizado correctamente.');
    }

    /**
     * Aplicar una plantilla a una página.
     */
    public function applyTemplate(Request $request, Page $page)
    {
        // dd($request->all());
        $request->validate([
            'template_id' => 'required|exists:templates,id',
            'keep_custom_theme' => 'boolean|nullable'
        ]);

        $template = Template::find($request->template_id);

        // Verificar permisos (plantilla global o de la misma compañía)
        if (!$template->is_global && $template->company_id != $page->company_id) {
            abort(403, 'No tienes acceso a esta plantilla');
        }

        // Aplicar plantilla
        $page->update([
            'template_id' => $template->id,
            'uses_template' => true,
            // Solo actualizar tema si no se quiere mantener el personalizado
            'theme_id' => $request->keep_custom_theme ? $page->theme_id : $template->theme_id,
            'layout' => $template->layout_structure ?? $page->layout
        ]);

        return back()->with('success', 'Plantilla aplicada correctamente');
    }

    /**
     * Remover plantilla de una página.
     */
    public function detachTemplate(Page $page)
    {
        $page->update([
            'template_id' => null,
            'uses_template' => false,
            'template_overrides' => null
            // theme_id se mantiene (puede ser personalizado)
        ]);

        return back()->with('success', 'Plantilla removida');
    }

    /**
     * Actualizar tema de una página.
     */
    public function updateTheme(Request $request, Page $page)
    {
        $request->validate([
            'theme_id' => 'nullable|exists:themes,id'
        ]);

        $page->update(['theme_id' => $request->theme_id]);

        return back()->with('success', 'Tema actualizado');
    }

    /**
     * Obtener plantillas disponibles para una página.
     */
    public function getAvailableTemplates(Page $page)
    {
        $templates = Template::where('is_global', true)
            ->orWhere('company_id', $page->company_id)
            ->with('theme')
            ->get();

        return response()->json($templates);
    }

    // En PageController.php
    public function copyThemeSettings(Page $page)
    {
        if (!$page->theme) {
            return back()->with('error', 'La página no tiene un tema asignado');
        }

        // Copiar configuración del tema a la página
        $page->theme_settings = $page->theme->settings;
        $page->save();

        return response()->json([
            'success' => true,
            'message' => 'Configuración del tema copiada para personalización',
            'theme_settings' => $page->theme_settings
        ]);
    }

    public function updateThemeSettings(Request $request, Page $page)
    {
        $request->validate([
            'theme_settings' => 'required|array'
        ]);

        // Verificar que primero se haya copiado la configuración
        if (!$page->theme_settings && $page->theme) {
            return response()->json([
                'error' => true,
                'message' => 'Debes copiar la configuración del tema primero',
                'needs_copy' => true
            ], 400);
        }

        $page->theme_settings = $request->theme_settings;
        $page->save();

        // Limpiar caché si usas caché
        Cache::forget("page_theme_settings_{$page->id}");

        // return response()->json([
        //     'success' => true,
        //     'message' => 'Configuraciones del tema actualizadas'
        // ]);
    }

    public function resetThemeSettings(Page $page)
    {
        $page->theme_settings = null;
        $page->save();

        return response()->json([
            'success' => true,
            'message' => 'Configuraciones del tema restablecidas al tema original'
        ]);
    }

    // En PageController.php
public function copyImage(Request $request, Page $page)
{
    $request->validate([
        'product_id' => 'required|exists:products,id',
        'media_id' => 'nullable|exists:media,id'
    ]);

    $product = Product::find($request->product_id);
    
    try {
        $media = $page->copyImageFromProduct($product, $request->media_id);
        
        return response()->json([
            'success' => true,
            'image_url' => $media->getUrl(),
            'media_id' => $media->id
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error al copiar la imagen: ' . $e->getMessage()
        ], 500);
    }
}
}
