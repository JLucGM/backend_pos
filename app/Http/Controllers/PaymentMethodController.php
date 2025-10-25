<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaymentMethods\StoreRequest;
use App\Http\Requests\PaymentMethods\UpdateRequest;
use App\Models\PaymentMethod;
use App\Models\PaymentMethodDetail;
use App\Models\Store;
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

        return Inertia::render('PaymentsMethods/Index', compact('paymentmethod', 'role', 'permission'));
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
    public function store(StoreRequest $request)
    {

        // Crear el nuevo método de pago
        $paymentMethod = PaymentMethod::create($request->validated() + [
            'company_id' => Auth::user()->company_id, // Asignar la empresa del usuario autenticado
        ]);

        // Redirigir a la lista de métodos de pago
        return to_route('paymentmethod.edit', $paymentMethod);
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
        return Inertia::render('PaymentsMethods/Edit', compact('payment_method'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, PaymentMethod $payment_method)
    {
        // Actualizar el método de pago
        $payment_method->update($request->validated() + [
            'company_id' => Auth::user()->company_id, // Asignar la empresa del usuario autenticado
        ]);

        // Redirigir a la lista de métodos de pago o a la vista de edición
        return to_route('paymentmethod.edit', $payment_method);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PaymentMethod $payment_method)
    {
        // Eliminar los registros dependientes
        $payment_method->delete(); // Asegúrate de tener la relación definida en el modelo

        return to_route('paymentmethod.index')->with('success', 'Método de pago eliminado con éxito.');
    }
}
