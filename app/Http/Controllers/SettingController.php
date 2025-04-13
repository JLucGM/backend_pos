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
        $setting->update($data);

        // Verificar si se ha subido un nuevo logo
        if ($request->hasFile('logo')) {
            // Eliminar la imagen anterior de la colección 'logo'
            $setting->clearMediaCollection('logo');

            // Agregar la nueva imagen a la colección 'logo'
            $setting->addMultipleMediaFromRequest(['logo'])
                ->each(function ($fileAdder) {
                    $fileAdder->toMediaCollection('logo');
                });
        }

        // Verificar si se ha subido un nuevo favicon
        if ($request->hasFile('favicon')) {
            // Eliminar la imagen anterior de la colección 'favicon'
            $setting->clearMediaCollection('favicon');

            // Agregar la nueva imagen a la colección 'favicon'
            $setting->addMultipleMediaFromRequest(['favicon'])
                ->each(function ($fileAdder) {
                    $fileAdder->toMediaCollection('favicon');
                });
        }

        // Verificar si se ha subido un nuevo logofooter
        if ($request->hasFile('logofooter')) {
            // Eliminar la imagen anterior de la colección 'logofooter'
            $setting->clearMediaCollection('logofooter');

            // Agregar la nueva imagen a la colección 'logofooter'
            $setting->addMultipleMediaFromRequest(['logofooter'])
                ->each(function ($fileAdder) {
                    $fileAdder->toMediaCollection('logofooter');
                });
        }

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
