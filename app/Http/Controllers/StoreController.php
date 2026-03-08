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
     * Display a listing of the resource.
     */
    public function index()
    {
        // El CompanyScope se encarga de filtrar por la compañía del usuario logueado
        $stores = Store::all();
        $countries = Country::all();
        $states = State::all();
        $cities = City::all();

        return Inertia::render('Stores/Index', compact('stores', 'countries', 'states', 'cities'));
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
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'is_ecommerce_active' => 'boolean',
            'allow_delivery' => 'boolean',
            'allow_pickup' => 'boolean',
            'allow_shipping' => 'boolean',
            'country_id' => 'required|exists:countries,id',
            'state_id' => 'required|exists:states,id',
            'city_id' => 'required|exists:cities,id',
        ]);

        $user = Auth::user();
        
        // Asignar company_id solo si el usuario tiene uno (para tenancy)
        if ($user->company_id) {
            $data['company_id'] = $user->company_id;
        }

        // Si se está creando un store con is_ecommerce_active = true
        if (!empty($data['is_ecommerce_active'])) {
            // Desactivar ecommerce en las otras tiendas de la misma compañía
            Store::where('company_id', $user->company_id)
                ->update(['is_ecommerce_active' => false]);
        }

        // Crear la nueva tienda
        Store::create($data);

        return to_route('stores.index')->with('success', 'Tienda creada con éxito.');
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
        // Verificar si el store pertenece a la misma compañía (aunque el scope ya filtra, por seguridad)
        $user = Auth::user();
        if ($user->company_id && $store->company_id !== $user->company_id) {
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
        $user = Auth::user();
        if ($user->company_id && $store->company_id !== $user->company_id) {
            abort(403, 'No tienes permiso para esta operación.');
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'is_ecommerce_active' => 'boolean',
            'allow_delivery' => 'boolean',
            'allow_pickup' => 'boolean',
            'allow_shipping' => 'boolean',
            'country_id' => 'required|exists:countries,id',
            'state_id' => 'required|exists:states,id',
            'city_id' => 'required|exists:cities,id',
        ]);

        // Si se está actualizando a is_ecommerce_active = true
        if (!empty($data['is_ecommerce_active'])) {
            // Desactivar ecommerce en las otras tiendas de la misma compañía
            Store::where('company_id', $user->company_id)
                ->where('id', '!=', $store->id)
                ->update(['is_ecommerce_active' => false]);
        }

        $store->update($data);

        return to_route('stores.edit', $store)->with('success', 'Tienda actualizada con éxito.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Store $store)
    {
        $user = Auth::user();
        if ($user->company_id && $store->company_id !== $user->company_id) {
            abort(403, 'No tienes permiso para esta operación.');
        }

        $store->delete();
        return to_route('stores.index')->with('success', 'Tienda eliminada con éxito.');
    }
}
