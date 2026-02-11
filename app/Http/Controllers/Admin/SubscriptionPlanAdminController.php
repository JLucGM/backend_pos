<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\StoreSubscriptionPlanRequest;
use App\Http\Requests\Admin\UpdateSubscriptionPlanRequest;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SubscriptionPlanAdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:admin.subscriptionPlan.index')->only('index');
        $this->middleware('can:admin.subscriptionPlan.create')->only('create', 'store');
        $this->middleware('can:admin.subscriptionPlan.edit')->only('edit', 'update');
        $this->middleware('can:admin.subscriptionPlan.delete')->only('destroy');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        $subscriptionPlan = SubscriptionPlan::orderBy('sort_order')->get();

        return Inertia::render('Admin/SubscriptionPlans/Index', compact('role', 'permission', 'subscriptionPlan'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/SubscriptionPlans/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSubscriptionPlanRequest $request)
    {
        $validated = $request->validated();

        $subscriptionPlan = SubscriptionPlan::create($validated);

        return to_route('admin.subscriptionPlan.edit', $subscriptionPlan)->with('success', 'Plan de suscripción creado con éxito.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SubscriptionPlan $subscriptionPlan)
    {
        return Inertia::render('Admin/SubscriptionPlans/Edit', compact('subscriptionPlan'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSubscriptionPlanRequest $request, SubscriptionPlan $subscriptionPlan)
    {
        $validated = $request->validated();

        $subscriptionPlan->update($validated);

        return to_route('admin.subscriptionPlan.edit', $subscriptionPlan)->with('success', 'Plan de suscripción actualizado con éxito.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SubscriptionPlan $subscriptionPlan)
    {
        $subscriptionPlan->delete();

        return to_route('admin.subscriptionPlan.index')->with('success', 'Plan de suscripción eliminado con éxito.');
    }
}
