<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Page;
use App\Models\Product;
use App\Models\Store;
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
        $pages = Page::where('page_type',  'custom')
            // ->where('page_type', '!=', 'policy')

            ->get();

        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('Pages/Index', compact('pages', 'role', 'permission'));
    }

    public function indexPolicy()
    {
        $pages = Page::where('page_type', 'policy')
            ->get();

        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('Pages/Policy', compact('pages', 'role', 'permission'));
    }

    public function themes()
    {
        $user = Auth::user();
        $themes = Theme::all();
        $currentThemeId = Page::where('company_id', $user->company_id)->first()?->theme_id;
        $homepage = Page::where('company_id', Auth::user()->company_id)
            ->where('is_homepage', true) // Si tienes este campo
            ->orWhere('slug', 'inicio') // O si usas slug específico
            ->orWhere('slug', 'home')
            ->orWhere('slug', 'index')
            ->first();

        $biopage = Page::where('company_id', Auth::user()->company_id)
            ->where('page_type', 'link_bio') // Si tienes este campo
            ->first();

        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('Pages/Themes', compact('themes', 'currentThemeId', 'homepage', 'biopage', 'role', 'permission'));
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
            [
                'company_id' => $user->company_id,
                'page_type' => 'custom',
                'is_deletable' => true,
                'is_editable' => true,

            ]
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

        // Obtener la tienda principal (con e-commerce activo)
        $mainStore = Store::where('company_id', $companyId)
            ->where('is_ecommerce_active', true)
            ->first();

        // Si no hay tienda principal, obtenemos la primera tienda como fallback
        if (!$mainStore) {
            $mainStore = Store::where('company_id', $companyId)->first();
        }

        // Filtrar productos que tengan stock en la tienda principal
        $products = Product::with([
            'stocks' => function ($query) use ($mainStore) {
                // Filtrar stocks solo de la tienda principal
                if ($mainStore) {
                    $query->where('store_id', $mainStore->id);
                }
            },
            'combinations.combinationAttributeValue.attributeValue.attribute',
            'categories',
            'media'
        ])
            ->where('company_id', $companyId)
            ->where('is_active', true)
            // Solo productos que tengan stock en la tienda principal
            ->whereHas('stocks', function ($query) use ($mainStore) {
                if ($mainStore) {
                    $query->where('store_id', $mainStore->id)
                        ->where('quantity', '>', 0);
                }
            })
            ->get();

        // Filtrar las combinaciones que también tengan stock en la tienda principal
        $products = $products->map(function ($product) use ($mainStore) {
            // Filtrar combinaciones que tengan stock en la tienda principal
            if ($product->combinations) {
                $product->combinations = $product->combinations->filter(function ($combination) use ($mainStore) {
                    if ($mainStore) {
                        $stock = $combination->stocks->where('store_id', $mainStore->id)
                            ->where('quantity', '>', 0)
                            ->first();
                        return $stock !== null;
                    }
                    return true;
                });
            }

            return $product;
        });

        $availableTemplates = Template::where('is_global', true)
            ->orWhere('company_id', $companyId)
            ->with('theme')
            ->get();

        $themes = Theme::all();

        $page->load('template.theme', 'theme', 'company.setting.media', 'company.setting.currency');

        $dynamicPages = $page->company->pages()
            ->select('title', 'slug', 'id')
            // ->where('is_published', true)
            ->get()
            ->map(function ($pageItem) {
                return [
                    'id' => $pageItem->id,
                    'title' => $pageItem->title,
                    'slug' => $pageItem->slug,
                ];
            });

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

        // Obtener países, estados y ciudades para el ProfileComponent
        $countries = \App\Models\Country::all();
        $states = \App\Models\State::all();
        $cities = \App\Models\City::all();

                // ----- 1. Imágenes de productos -----
    $productImages = [];
    foreach ($products as $product) {
        foreach ($product->media as $media) {
            $productImages[] = [
                'id'               => 'product-' . $product->id . '-' . $media->id,
                'src'              => $media->original_url ?? $media->url,
                'alt'              => $product->product_name,
                'product_id'       => $product->id,
                'media_id'         => $media->id,
                'is_from_product'  => true,
                'is_page_image'    => false,
                'product_name'     => $product->product_name,
            ];
        }
    }

    // ----- 2. Imágenes de la página (colección 'page_images') -----
    $pageImages = $page->getMedia('page_images')->map(function ($media) {
        return [
            'id'              => 'page-' . $media->id,
            'src'             => $media->getUrl(),
            'alt'             => $media->name,
            'media_id'        => $media->id,
            'is_from_product' => false,
            'is_page_image'   => true,
        ];
    })->toArray();

    // ----- 3. Unificar (puedes ordenar como quieras) -----
    $allImages = array_merge($pageImages, $productImages);

        return Inertia::render('Pages/Builder', [
            'page' => $page,
            'products' => $products,
            'availableTemplates' => $availableTemplates,
            'themes' => $themes,
            'pageThemeSettings' => $pageThemeSettings,
            'availableMenus' => $availableMenus,
            'companyLogo' => $logoUrl,
            'dynamicPages' => $dynamicPages,
            'countries' => $countries,
            'states' => $states,
            'cities' => $cities,
            'mainStore' => $mainStore, // Pasar también la tienda principal a la vista por si se necesita
            'allImages' => $allImages,
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
        // Copiar configuración del tema a todas las páginas de la compañía
        $allPages = Page::where('company_id', $page->company_id)->get();
        $count = 0;

        foreach ($allPages as $companyPage) {
            if ($companyPage->theme && !$companyPage->theme_settings) {
                $companyPage->theme_settings = $companyPage->theme->settings;
                $companyPage->save();
                $count++;
            }
        }

        return response()->json([
            'success' => true,
            'message' => "Configuración del tema copiada para {$count} páginas de la compañía",
            'theme_settings' => $page->theme ? $page->theme->settings : null
        ]);
    }

    public function updateThemeSettings(Request $request, Page $page)
    {
        $request->validate([
            'theme_settings' => 'required|array'
        ]);

        // Verificar que primero se haya copiado la configuración
        if (!$page->theme_settings && $page->theme) {
            // Si no tiene configuración personalizada, copiar primero el tema original
            $this->copyThemeSettingsToAll($page);
        }

        // Obtener todas las páginas de la misma compañía
        $allPages = Page::where('company_id', $page->company_id)->get();

        foreach ($allPages as $companyPage) {
            // Solo actualizar páginas que tengan configuración personalizada
            if ($companyPage->theme_settings) {
                $companyPage->theme_settings = $request->theme_settings;
                $companyPage->save();

                // Limpiar caché individual si usas caché
                Cache::forget("page_theme_settings_{$companyPage->id}");
            }
        }

        // return response()->json([
        //     'success' => true,
        //     'message' => 'Configuraciones del tema actualizadas para todas las páginas de la compañía'
        // ]);
    }

    private function copyThemeSettingsToAll(Page $page)
    {
        // Obtener todas las páginas de la misma compañía
        $allPages = Page::where('company_id', $page->company_id)->get();

        foreach ($allPages as $companyPage) {
            if ($companyPage->theme && !$companyPage->theme_settings) {
                // Copiar configuración del tema original si existe
                $companyPage->theme_settings = $companyPage->theme->settings;
                $companyPage->save();
            }
        }
    }

    public function resetThemeSettings(Page $page)
    {
        // Restablecer todas las páginas de la compañía
        Page::where('company_id', $page->company_id)
            ->update(['theme_settings' => null]);

        // return response()->json([
        //     'success' => true,
        //     'message' => 'Configuraciones del tema restablecidas para todas las páginas de la compañía'
        // ]);
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
    public function updateCompanyTheme(Request $request)
    {
        $request->validate([
            'theme_id' => 'required|exists:themes,id'
        ]);

        $user = Auth::user();

        Page::where('company_id', $user->company_id)
            ->update(['theme_id' => $request->theme_id]);

        return back()->with('success', 'Tema actualizado para todas las páginas');
    }

    // En PageController.php (dentro de la clase)

/**
 * Obtener todas las imágenes de la página (productos + página)
 */
public function getPageImages(Page $page)
{
    // Imágenes de la colección 'page_images' de la página
    $pageMedia = $page->getMedia('page_images')->map(function ($media) {
        return [
            'id' => $media->id,
            'src' => $media->getUrl(),
            'alt' => $media->name,
            'media_id' => $media->id,
            'is_from_product' => false,
            'is_page_image' => true,
        ];
    });

    // Imágenes de productos (ya se pasan en el builder)
    // Las combinaremos en el frontend

    return response()->json($pageMedia); // Opcional, pero no usaremos Axios
}

/**
 * Subir una imagen directamente a la página
 */
public function uploadImage(Request $request, Page $page)
{
    $request->validate([
        'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB máx
    ]);

    try {
        $media = $page->addMedia($request->file('image'))
            ->usingFileName($request->file('image')->hashName())
            ->withCustomProperties(['uploaded_via' => 'builder'])
            ->toMediaCollection('page_images');

        // Retornar respuesta Inertia con el nuevo medio
        return back()->with([
            'success' => 'Imagen subida correctamente',
            'new_page_image' => [
                'id' => $media->id,
                'src' => $media->getUrl(),
                'alt' => $media->name,
                'media_id' => $media->id,
                'is_from_product' => false,
                'is_page_image' => true,
            ]
        ]);
    } catch (\Exception $e) {
        return back()->withErrors(['upload' => 'Error al subir la imagen: ' . $e->getMessage()]);
    }
}

/**
 * Eliminar una imagen de la página
 */
public function deleteImage(Page $page, $mediaId)
{
    $media = $page->media()->find($mediaId);

    if (!$media) {
        return back()->withErrors(['delete' => 'La imagen no existe']);
    }

    try {
        $media->delete();
        return back()->with('success', 'Imagen eliminada correctamente');
    } catch (\Exception $e) {
        return back()->withErrors(['delete' => 'Error al eliminar la imagen: ' . $e->getMessage()]);
    }
}
}
