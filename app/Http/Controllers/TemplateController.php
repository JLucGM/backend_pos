<?php

namespace App\Http\Controllers;

use App\Models\Template;
use App\Models\Theme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TemplateController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('can:admin.templates.index')->only('index');
    //     $this->middleware('can:admin.templates.create')->only('create', 'store');
    //     $this->middleware('can:admin.templates.edit')->only('edit', 'update');
    //     $this->middleware('can:admin.templates.delete')->only('destroy');
    // }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $companyId = $user->company_id;
        
        // Plantillas globales + de la compañía actual
        $templates = Template::where('is_global', true)
            ->orWhere('company_id', $companyId)
            ->with('theme')
            ->paginate(10);
            
        $themes = Theme::all();
        
        return Inertia::render('Templates/Index', [
            'templates' => $templates,
            'themes' => $themes
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $themes = Theme::all();
        return Inertia::render('Templates/Create', compact('themes'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'layout_structure' => 'nullable|json',
            'default_blocks' => 'nullable|json',
            'category' => 'nullable|string',
            'is_global' => 'boolean',
            'theme_id' => 'nullable|exists:themes,id'
        ]);

        $user = Auth::user();
        
        Template::create([
            ...$validated,
            'slug' => \Str::slug($validated['name']),
            'company_id' => $validated['is_global'] ? null : $user->company_id
        ]);

        return redirect()->route('templates.index')->with('success', 'Plantilla creada');
    }

    /**
     * Display the specified resource.
     */
    public function show(Template $template)
    {
        $template->load('theme', 'pages');
        return Inertia::render('Templates/Show', compact('template'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Template $template)
    {
        $themes = Theme::all();
        return Inertia::render('Templates/Edit', compact('template', 'themes'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Template $template)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'layout_structure' => 'nullable|json',
            'default_blocks' => 'nullable|json',
            'category' => 'nullable|string',
            'is_global' => 'boolean',
            'theme_id' => 'nullable|exists:themes,id'
        ]);

        $template->update([
            ...$validated,
            'slug' => \Str::slug($validated['name'])
        ]);

        return redirect()->route('templates.index')->with('success', 'Plantilla actualizada');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Template $template)
    {
        // Verificar que no esté en uso
        if ($template->pages()->count() > 0) {
            return back()->with('error', 'No se puede eliminar: hay páginas usando esta plantilla');
        }
        
        $template->delete();
        return back()->with('success', 'Plantilla eliminada');
    }
}