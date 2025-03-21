<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $setting = Setting::with('media')->first();
        // $currencies = Currency::all();
        
        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('Settings/Edit', compact('setting', 'role', 'permission'));
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Setting $setting)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Setting $setting)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Setting $setting)
    {
        $data = $request->only(
            'app_name',
            'default_currency',
            'admin_email',
            'admin_phone',
            'shipping_base_price',
        );

        // Actualizar los ajustes
        $setting->update($data); // Asegúrate de que $data contiene las rutas correctas

        // if ($request->hasFile('logo')) {
        //     $setting->addMultipleMediaFromRequest(['logo'])
        //         ->each(function ($fileAdder) {
        //             $fileAdder->toMediaCollection('setting');
        //         });
        // }

        return to_route('setting.index', $setting);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Setting $setting)
    {
        //
    }
}
