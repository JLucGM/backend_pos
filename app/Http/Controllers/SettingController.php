<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Currency;
use App\Models\Setting;
use App\Models\ShippingRate;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:admin.setting.index')->only('index');
        $this->middleware('can:admin.setting.edit')->only('update', 'updateSettings', 'updateCompany', 'updateMedia', 'updateShippingRates');
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $currencies = Currency::active()->orderBy('name')->get();

        $user = Auth::user();
        $setting = Setting::with('media', 'company', 'currency')->where('company_id', $user->company_id)->first();
        
        // Obtener o crear las relaciones de monedas para esta compañía
        $companyCurrencies = \App\Models\CompanyCurrency::with('currency')
            ->where('company_id', $user->company_id)
            ->get();

        if ($companyCurrencies->isEmpty()) {
            // Solo creamos la moneda base por defecto
            \App\Models\CompanyCurrency::create([
                'company_id' => $user->company_id,
                'currency_id' => $setting->currency_id,
                'exchange_rate' => 1.0,
                'is_active' => true,
                'is_base' => true
            ]);
            
            $companyCurrencies = \App\Models\CompanyCurrency::with('currency')
                ->where('company_id', $user->company_id)
                ->get();
        }

        return Inertia::render('Settings/Edit', compact('setting', 'currencies', 'companyCurrencies'));
    }

    public function currencies()
    {
        $currencies = Currency::active()->orderBy('name')->get();
        $user = Auth::user();
        $setting = Setting::with('company', 'currency')->where('company_id', $user->company_id)->first();
        $companyCurrencies = \App\Models\CompanyCurrency::with('currency')
            ->where('company_id', $user->company_id)
            ->get();

        return Inertia::render('Settings/Currencies', compact('setting', 'currencies', 'companyCurrencies'));
    }

    public function domain()
    {
        $user = Auth::user();
        $setting = Setting::with('company')->where('company_id', $user->company_id)->first();

        return Inertia::render('Settings/Domain', compact('setting'));
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

    public function updateGeneral(Request $request, Setting $setting)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|array',
            'favicon' => 'nullable|array',
            'logofooter' => 'nullable|array',
        ]);

        $user = Auth::user();
        if ($setting->company_id !== $user->company_id) {
            abort(403);
        }

        $setting->company->update(['name' => $request->name]);

        // Manejo de Media
        if ($request->hasFile('logo')) {
            $setting->clearMediaCollection('logo');
            $setting->addMultipleMediaFromRequest(['logo'])->each(fn($f) => $f->toMediaCollection('logo'));
        }
        if ($request->hasFile('favicon')) {
            $setting->clearMediaCollection('favicon');
            $setting->addMultipleMediaFromRequest(['favicon'])->each(fn($f) => $f->toMediaCollection('favicon'));
        }
        if ($request->hasFile('logofooter')) {
            $setting->clearMediaCollection('logofooter');
            $setting->addMultipleMediaFromRequest(['logofooter'])->each(fn($f) => $f->toMediaCollection('logofooter'));
        }

        return to_route('setting.index')->with('success', 'Información general actualizada');
    }

    public function updateCurrencies(Request $request, Setting $setting)
    {
        $request->validate([
            'currency_id' => 'required|exists:currencies,id',
            'selected_currencies' => 'required|array',
            'selected_currencies.*' => 'exists:currencies,id',
            'company_currencies' => 'nullable|array',
            'company_currencies.*.id' => 'nullable', // Permitir nulo para nuevas monedas
            'company_currencies.*.currency_id' => 'required|exists:currencies,id',
            'company_currencies.*.exchange_rate' => 'required|numeric|min:0',
        ]);

        $user = Auth::user();
        if ($setting->company_id !== $user->company_id) {
            abort(403);
        }

        $setting->update(['currency_id' => $request->currency_id]);

        $selectedIds = $request->input('selected_currencies', []);
        
        // Sincronizar monedas (eliminar las que ya no están)
        \App\Models\CompanyCurrency::where('company_id', $user->company_id)
            ->whereNotIn('currency_id', $selectedIds)->delete();

        // Actualizar o crear cada moneda enviada
        if ($request->has('company_currencies')) {
            foreach ($request->company_currencies as $currData) {
                $isBase = ($currData['currency_id'] == $request->currency_id);
                
                \App\Models\CompanyCurrency::updateOrCreate(
                    ['company_id' => $user->company_id, 'currency_id' => $currData['currency_id']],
                    [
                        'exchange_rate' => $isBase ? 1.0 : $currData['exchange_rate'],
                        'is_active' => true,
                        'is_base' => $isBase
                    ]
                );
            }
        }

        return to_route('setting.currencies')->with('success', 'Monedas y tasas de cambio actualizadas correctamente');
    }

    public function updateDomain(Request $request, Setting $setting)
    {
        $request->validate([
            'domain' => 'nullable|string|max:255|unique:companies,domain,' . $setting->company->id,
        ]);

        $user = Auth::user();
        if ($setting->company_id !== $user->company_id) {
            abort(403);
        }

        $setting->company->update(['domain' => $request->domain]);

        return to_route('setting.domain')->with('success', 'Dominio actualizado');
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
