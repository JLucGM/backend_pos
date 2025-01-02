<?php

namespace App\Http\Controllers;

use App\Http\Requests\Cities\StoreRequest;
use App\Http\Requests\Cities\UpdateRequest;
use App\Models\City;
use App\Models\State;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CitiesController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:admin.cities.index')->only('index');
        $this->middleware('can:admin.cities.create')->only('create', 'store');
        $this->middleware('can:admin.cities.edit')->only('edit', 'update');
        $this->middleware('can:admin.cities.delete')->only('destroy');
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cities = City::with('state')->get();
        $state = State::all();

        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('Cities/Index', compact('cities', 'state', 'role', 'permission'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $state = State::all();

        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('Cities/Create', compact('state', 'role', 'permission'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //dd($request);
        $data = $request->only('city_name', 'state_id');

        City::create($data);

        return to_route('cities.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(City $cities)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(City $city)
    {
        $city->load('state');
        $states = State::all();

        return Inertia::render('Cities/Edit', compact('city', 'states'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, City $city)
    {
        $data = $request->only('city_name', 'state_id');

        $city->update($data);

        return to_route('cities.edit', $city);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(City $city)
    {
        $city->delete();
    }
}
