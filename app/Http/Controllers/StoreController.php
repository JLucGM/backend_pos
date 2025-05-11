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
        $stores = Store::all();
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

        $data = $request->only('store_name', 'store_phone', 'store_direction', 'country_id', 'state_id', 'city_id');

        Store::create($data); // Crear el nuevo usuario

        return to_route('stores.index'); // Redirigir a la lista de usuarios
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
        $countries = Country::all();
        $states = State::all();
        $cities = City::all();

        return Inertia::render('Stores/Edit', compact('store','countries', 'states', 'cities'));

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Store $store)
    {
        $request->validate([
            'store_name' => 'required|string|max:255',
            'store_phone' => 'required|string|max:255',
            'store_direction' => 'required|string|max:255',
            'country_id' => 'required|exists:countries,id',
            'state_id' => 'required|exists:states,id',
            'city_id' => 'required|exists:cities,id',
        ]);
        
        $data = $request->only('store_name', 'store_phone', 'store_direction', 'country_id', 'state_id', 'city_id');

        $store->update($data); // Actualizar el usuario con los nuevos datos

        return to_route('stores.edit', $store); // Redirigir a la edición del usuario
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Store $store)
    {
        $store->delete();
    }
}
