<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:admin.client.index')->only('index');
        $this->middleware('can:admin.client.create')->only('create', 'store');
        $this->middleware('can:admin.client.edit')->only('edit', 'update');
        $this->middleware('can:admin.client.delete')->only('delete');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $client = Client::all();
        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('Clients/Index', compact('client','role','permission'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->only('client_name','client_identification','client_phone');

        Client::create($data); // Crear el nuevo usuario

        return to_route('clients.index'); // Redirigir a la lista de usuarios
    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $client)
    {
        $client->load('orders');

        // Contar la cantidad de órdenes
    $orderCount = $client->orders->count();
    // Sumar el total de las órdenes
    $orderTotal = $client->orders->sum('total');
    // dd($orderCount, $orderTotal);

        return Inertia::render('Clients/Edit', compact('client','orderCount','orderTotal'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Client $client)
    {
        $data = $request->only('client_name','client_identification','client_phone');

        $client->update($data); // Actualizar el usuario con los nuevos datos

        return to_route('clients.edit', $client); // Redirigir a la edición del usuario
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        $client->delete();

    }
}
