<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Country;
use App\Models\State;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StoreController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:admin.stores.index')->only('index');
        $this->middleware('can:admin.stores.create')->only('create', 'store');
        $this->middleware('can:admin.stores.edit')->only('edit', 'update');
        $this->middleware('can:admin.stores.delete')->only('delete');
    }

    /**
     * Display a listing of the resource.d
     */
    public function index()
    {
        $user = Auth::user();

        $stores = Store::where('company_id', $user->company_id)->get();
        $countries = Country::all();
        $states = State::all();
        $cities = City::all();

        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('Stores/Index', compact('stores', 'countries', 'states', 'cities', 'role', 'permission'));
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
        $request->validate([
            'store_name' => 'required|string|max:255',
            'store_phone' => 'required|string|max:255',
            'store_direction' => 'required|string|max:255',
            'country_id' => 'required|exists:countries,id',
            'state_id' => 'required|exists:states,id',
            'city_id' => 'required|exists:cities,id',
        ]);

        $user = Auth::user();

        // Asegúrate de que el modelo Store tenga un campo company_id
        $data = $request->only('store_name', 'store_phone', 'store_direction', 'country_id', 'state_id', 'city_id');

        // Agregar el company_id del usuario logueado
        $data['company_id'] = $user->company_id; // Asignar el company_id del usuario

        // Crear la nueva tienda
        Store::create($data);

        return to_route('stores.index'); // Redirigir a la lista de tiendas
    }


    /**
     * Display the specified resource.
     */
    public function show(Store $store)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Store $store)
    {
        // Verificar si el store pertenece a la misma company_id que el usuario logueado
        $user = Auth::user();
        if ($store->company_id !== $user->company_id) {
            abort(403, 'No tienes permiso para esta operación.');
        }

        $countries = Country::all();
        $states = State::all();
        $cities = City::all();

        return Inertia::render('Stores/Edit', compact('store', 'countries', 'states', 'cities'));
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Store $store)
    {
        // Verificar si el store pertenece a la misma company_id que el usuario logueado
        $user = Auth::user();
        if ($store->company_id !== $user->company_id) {
            abort(403, 'No tienes permiso para esta operación.');
        }

        $request->validate([
            'store_name' => 'required|string|max:255',
            'store_phone' => 'required|string|max:255',
            'store_direction' => 'required|string|max:255',
            'country_id' => 'required|exists:countries,id',
            'state_id' => 'required|exists:states,id',
            'city_id' => 'required|exists:cities,id',
        ]);

        $data = $request->only('store_name', 'store_phone', 'store_direction', 'country_id', 'state_id', 'city_id');

        $store->update($data); // Actualizar la tienda con los nuevos datos

        return to_route('stores.edit', $store); // Redirigir a la edición de la tienda
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Store $store)
    {
        // Verificar si el store pertenece a la misma company_id que el usuario logueado
        $user = Auth::user();
        if ($store->company_id !== $user->company_id) {
            abort(403, 'No tienes permiso para esta operación.');
        }

        $store->delete();
    }
}
