<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethod;
use App\Models\PaymentMethodDetail;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentMethodController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:admin.paymentmethod.index')->only('index');
        $this->middleware('can:admin.paymentmethod.create')->only('create', 'store');
        $this->middleware('can:admin.paymentmethod.edit')->only('edit', 'update');
        $this->middleware('can:admin.paymentmethod.delete')->only('delete');
    }
    
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $paymentmethod = PaymentMethod::all();
        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('PaymentsMethods/Index', compact('paymentmethod','role','permission'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('PaymentsMethods/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    // Validar los datos de entrada
    $request->validate([
        'payment_method_name' => 'required|string|max:255',
        'payment_details' => 'nullable|array', // Cambiado a nullable
        'payment_details.*.data_type' => 'nullable|string|max:255', // Cambiado a nullable
        'payment_details.*.value' => 'nullable|string|max:255', // Cambiado a nullable
    ]);

    // Crear el nuevo método de pago
    $paymentMethod = PaymentMethod::create([
        'payment_method_name' => $request->payment_method_name,
        // 'slug' => Str::slug($request->payment_method_name), // Generar un slug si es necesario
    ]);

    // Crear los detalles del método de pago solo si existen
    if ($request->payment_details) {
        foreach ($request->payment_details as $detail) {
            PaymentMethodDetail::create([
                'payments_method_details_data_types' => $detail['data_type'],
                'payments_method_details_value' => $detail['value'],
                'payments_method_id' => $paymentMethod->id, // Asociar el detalle con el método de pago recién creado
            ]);
        }
    }

    // Redirigir a la lista de métodos de pago
    return to_route('paymentmethod.index');
}

    /**
     * Display the specified resource.
     */
    public function show(PaymentMethod $payment_method)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PaymentMethod $payment_method)
{
    // Cargar los detalles del método de pago
    $payment_method->load('details'); // Asegúrate de que la relación esté definida en el modelo
    return Inertia::render('PaymentsMethods/Edit', compact('payment_method'));
}

/**
 * Update the specified resource in storage.
 */
public function update(Request $request, PaymentMethod $payment_method)
{
    // Validar los datos de entrada
    $request->validate([
        'payment_method_name' => 'required|string|max:255',
        'payment_details' => 'nullable|array', // Cambiado a nullable
        'payment_details.*.data_type' => 'nullable|string|max:255', // Cambiado a nullable
        'payment_details.*.value' => 'nullable|string|max:255', // Cambiado a nullable
    ]);

    // Actualizar el método de pago
    $payment_method->update([
        'payment_method_name' => $request->payment_method_name,
    ]);

    // Eliminar los detalles existentes
    $payment_method->details()->delete();

    // Crear los nuevos detalles del método de pago solo si existen
    if ($request->payment_details) {
        foreach ($request->payment_details as $detail) {
            PaymentMethodDetail::create([
                'payments_method_details_data_types' => $detail['data_type'],
                'payments_method_details_value' => $detail['value'],
                'payments_method_id' => $payment_method->id, // Asociar el detalle con el método de pago
            ]);
        }
    }

    // Redirigir a la lista de métodos de pago o a la vista de edición
    return to_route('paymentmethod.edit', $payment_method);
}



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PaymentMethod $payment_method)
{
    // Eliminar los registros dependientes
    $payment_method->details()->delete(); // Asegúrate de tener la relación definida en el modelo

    // Ahora eliminar el método de pago
    $payment_method->delete();
}
}
