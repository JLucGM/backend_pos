<?php

namespace App\Http\Controllers;

use App\Models\Tax;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TaxController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth');

        $this->middleware('can:admin.user.index')->only('index');
        $this->middleware('can:admin.user.create')->only('create', 'store');
        $this->middleware('can:admin.user.edit')->only('edit', 'update');
        $this->middleware('can:admin.user.delete')->only('delete');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $taxes = Tax::all();
        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('Taxes/Index', compact('taxes','role','permission'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Taxes/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->only('name', 'description', 'tax_rate');

        Tax::create($data); // Crear el nuevo usuario

        return to_route('tax.index'); // Redirigir a la lista de usuarios
    }

    /**
     * Display the specified resource.
     */
    public function show(Tax $tax)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tax $tax)
    {
        return Inertia::render('Taxes/Edit', compact('tax'));

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tax $tax)
    {
        $data = $request->only('name', 'description', 'tax_rate');

        $tax->update($data); // Actualizar el usuario con los nuevos datos

        return to_route('tax.edit', $tax); // Redirigir a la edición del usuario
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tax $tax)
    {
        $tax->delete();
    }
}
