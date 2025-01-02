<?php

namespace App\Http\Controllers;

use App\Http\Requests\States\StoreRequest;
use App\Http\Requests\States\UpdateRequest;
use App\Models\Countries;
use App\Models\Country;
use App\Models\State;
use App\Models\States;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StatesController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:admin.states.index')->only('index');
        $this->middleware('can:admin.states.create')->only('create', 'store');
        $this->middleware('can:admin.states.edit')->only('edit', 'update');
        $this->middleware('can:admin.states.delete')->only('destroy');
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $states = State::with('country')->get();
        $countries = Country::all();

        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('States/Index', compact('states', 'countries', 'role', 'permission'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $country = Country::all();

        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('States/Create', compact('country', 'role', 'permission'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        //dd($request);
        $data = $request->only('state_name', 'country_id');

        State::create($data);

        return to_route('states.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(State $states)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(State $state)
    {
        $state->load('country');
        $countries = Country::all();

        return Inertia::render('States/Edit', compact('state', 'countries'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, State $state)
    {
        $data = $request->only('state_name', 'country_id');

        $state->update($data);

        return to_route('states.edit', $state);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(State $state)
    {
        $state->delete();
    }
}
