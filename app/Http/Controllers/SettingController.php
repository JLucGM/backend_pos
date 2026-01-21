<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Currency;
use App\Models\Setting;
use App\Models\ShippingRate;
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
        $currencies = Currency::active()->orderBy('name')->get();

        $user = Auth::user();
        $setting = Setting::with('media', 'company', 'currency')->where('company_id', $user->company_id)->first();

        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('Settings/Edit', compact('setting', 'currencies', 'role', 'permission'));
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
        // dd($request->all());
        // Validar los datos de entrada
        $request->validate([
            'currency_id' => 'required|exists:currencies,id',
            'name' => 'required|string|max:255', // Validación para el nombre de la compañía
            'email' => 'required|email|max:255', // Validación para el correo de la compañía
            'phone' => 'required|string|max:255', // Validación para el teléfono de la compañía
            'address' => 'required|string|max:255', // Validación para la dirección de la compañía
        ]);

        $user = Auth::user();
        if ($setting->company_id !== $user->company_id) {
            abort(403, 'No tienes permiso para esta operación.');
        }

        // Actualizar los ajustes
        $setting->update($request->only(
            'currency_id',
        ));
        // Actualizar los campos de la compañía
        $company = $setting->company; // Obtener la compañía asociada
        $company->update($request->only(
            'name',
            'email',
            'phone',
            'address'
        ));

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

    public function updateSettings(Request $request, Setting $setting)
    {
        $user = Auth::user();
        if ($setting->company_id !== $user->company_id) {
            abort(403);
        }
        $request->validate([
            'default_currency' => 'required|string|max:255',
            // Agrega otros campos de settings si es necesario
        ]);
        $setting->update($request->only('default_currency' /*, otros campos */));
        return response()->json(['message' => 'Settings actualizados exitosamente']);
    }

    public function updateCompany(Request $request, Company $company)
    {
        $user = Auth::user();
        if ($company->id !== $user->company_id) {
            abort(403);
        }
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:255',
            'address' => 'required|string|max:255',
        ]);
        $company->update($request->only('name', 'email', 'phone', 'address'));
        return response()->json(['message' => 'Compañía actualizada exitosamente']);
    }

     public function updateMedia(Request $request, Setting $setting)
    {
        $user = Auth::user();
        if ($setting->company_id !== $user->company_id) {
            abort(403);
        }
        if ($request->hasFile('logo')) {
            $setting->clearMediaCollection('logo');
            $setting->addMediaFromRequest('logo')->toMediaCollection('logo');
        }
        if ($request->hasFile('favicon')) {
            $setting->clearMediaCollection('favicon');
            $setting->addMediaFromRequest('favicon')->toMediaCollection('favicon');
        }
        if ($request->hasFile('logofooter')) {
            $setting->clearMediaCollection('logofooter');
            $setting->addMediaFromRequest('logofooter')->toMediaCollection('logofooter');
        }
        return response()->json(['message' => 'Media actualizada exitosamente']);
    }

    public function updateShippingRates(Request $request)
    {
        $user = Auth::user();
        // Valida y actualiza solo los shipping_rates de la compañía
        $request->validate([
            'shipping_rate_id' => 'required|exists:shipping_rates,id',
            'price' => 'required|numeric',
            // Otros campos
        ]);
        $shippingRate = ShippingRate::where('id', $request->shipping_rate_id)
            ->where('company_id', $user->company_id)
            ->firstOrFail();
        $shippingRate->update($request->only('price' /*, otros campos */));
        return response()->json(['message' => 'Tarifas de envío actualizadas exitosamente']);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Setting $setting)
    {
        //
    }
}
