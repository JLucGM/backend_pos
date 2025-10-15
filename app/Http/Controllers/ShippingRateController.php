<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\ShippingRate\StoreRequest;
use App\Http\Requests\ShippingRate\UpdateRequest;
use App\Models\ShippingRate;
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
    public function index()
    {
        $shippingRate = ShippingRate::all();
        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('ShippingRates/Index', compact('shippingRate', 'role', 'permission'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ShippingRates/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $data = $request->only('name', 'price', 'description');

        ShippingRate::create($data + ['company_id' => Auth::user()->company_id]);

        return to_route('shippingrate.index');
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
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('ShippingRates/Edit', compact('shippingRate', 'role', 'permission'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, ShippingRate $shippingRate)
    {
        $data = $request->only('name', 'price', 'description');

        $shippingRate->update($data);

        return to_route('shippingrate.edit', $shippingRate);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ShippingRate $shippingRate)
    {
        $shippingRate->delete();
    }
}
