<?php

namespace App\Http\Controllers;

use App\Models\Attribute;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AttributeController extends Controller
{

    public function __construct()
    {

        $this->middleware('can:admin.attribute.index')->only('index');
        $this->middleware('can:admin.attribute.create')->only('create', 'store');
        $this->middleware('can:admin.attribute.edit')->only('edit', 'update');
        $this->middleware('can:admin.attribute.delete')->only('delete');
    }
    
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $attribute = Attribute::all();
        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('Attributes/Index', compact('attribute','role','permission'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Attributes/Create');

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->only('attribute_name');

        Attribute::create($data); // Crear el nuevo usuario

        return to_route('attribute.index'); // Redirigir a la lista de usuarios
    }

    /**
     * Display the specified resource.
     */
    public function show(Attribute $attribute)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Attribute $attribute)
    {
        return Inertia::render('Attributes/Edit', compact('attribute'));

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Attribute $attribute)
    {
        $data = $request->only('attribute_name');

        $attribute->update($data); // Actualizar el usuario con los nuevos datos

        return to_route('attribute.edit', $attribute); // Redirigir a la edición del usuario
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attribute $attribute)
    {
        $attribute->delete();
    }
}
