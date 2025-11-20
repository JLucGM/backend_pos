<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as RoutingController;
use Illuminate\Support\Facades\Auth;
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

        $page->load('theme');

        return Inertia::render('Pages/Edit', compact('page', 'role', 'permission'));
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
        $user = Auth::user();
        $companyId = $user->company_id;

        $products = Product::with('stocks', 'combinations.combinationAttributeValue.attributeValue.attribute', 'categories', 'media')
            ->where('company_id', $companyId)
            ->get();

        // Asegúrate de que el usuario tenga permisos para editar esta página (ej. verificar company_id)
        return Inertia::render('Pages/Builder', [
            'page' => $page,
            'products' => $products,
        ]);
    }

    public function updateLayout(Request $request, Page $page)
    {
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
}
