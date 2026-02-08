<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\ShippingRate\StoreRequest;
use App\Http\Requests\ShippingRate\UpdateRequest;
use App\Models\ShippingRate;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as RoutingController;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ShippingRateController extends RoutingController
{
    public function __construct()
    {
        $this->middleware('can:admin.shippingRate.index')->only('index');
        $this->middleware('can:admin.shippingRate.create')->only('create', 'store');
        $this->middleware('can:admin.shippingRate.edit')->only('edit', 'update');
        $this->middleware('can:admin.shippingRate.delete')->only('destroy');
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        // Obtener todas las tiendas de la compañía
        $stores = Store::where('company_id', $user->company_id)->get();

        // Obtener el store_id del request (si no hay, usar null para mostrar todas)
        $selectedStoreId = $request->input('store_id', null);

        // Obtener las tarifas de envío con sus relaciones
        $shippingRateQuery = ShippingRate::with('store')
            ->where('company_id', $user->company_id)
            ->when($selectedStoreId, function ($query) use ($selectedStoreId) {
                return $query->where('store_id', $selectedStoreId);
            });

        $shippingRate = $shippingRateQuery->get();

        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('ShippingRates/Index', compact(
            'shippingRate',
            'role',
            'permission',
            'stores',
            'selectedStoreId'
        ));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();
        $stores = Store::where('company_id', $user->company_id)->get();

        return Inertia::render('ShippingRates/Create', compact('stores'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $user = Auth::user();

        // Validar que la tienda pertenezca a la compañía
        $store = Store::where('id', $request->store_id)
            ->where('company_id', $user->company_id)
            ->firstOrFail();

        $data = $request->only('name', 'price', 'description', 'store_id');

        $shippingRate = ShippingRate::create($data + ['company_id' => Auth::user()->company_id]);

        return redirect()->route('shippingrate.edit', $shippingRate)->with('success', 'Tarifa de envío creada con éxito.');
        // return to_route('shippingrate.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(ShippingRate $shippingRate)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ShippingRate $shippingRate)
    {
        $user = Auth::user();

        // Verificar que la tarifa pertenezca a la compañía
        if ($shippingRate->company_id !== $user->company_id) {
            abort(403, 'No tienes permiso para esta operación.');
        }

        $stores = Store::where('company_id', $user->company_id)->get();

        return Inertia::render('ShippingRates/Edit', compact('shippingRate', 'stores'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, ShippingRate $shippingRate)
    {
        $user = Auth::user();

        // Verificar que la tarifa pertenezca a la compañía
        if ($shippingRate->company_id !== $user->company_id) {
            abort(403, 'No tienes permiso para esta operación.');
        }

        // Validar que la tienda pertenezca a la compañía
        if ($request->has('store_id')) {
            $store = Store::where('id', $request->store_id)
                ->where('company_id', $user->company_id)
                ->firstOrFail();
        }

        $data = $request->only('name', 'price', 'description', 'store_id');

        $shippingRate->update($data);

        return to_route('shippingrate.index')->with('success', 'Tarifa de envío actualizada con éxito.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ShippingRate $shippingRate)
    {
        $shippingRate->delete();
    }
}
