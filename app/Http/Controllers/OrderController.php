<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::with('user')->get();
        
        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();
        
        // dd($orders, $role, $permission);
        return Inertia::render('Orders/Index', compact('orders', 'role', 'permission'));
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
    public function show(Order $orders)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $orders)
    {
        $orders->load('user','orderItems','paymentMethod');
        $paymentMethods = PaymentMethod::all();
        // dd($orders->load('user'));

        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('Orders/Edit', compact('orders', 'paymentMethods', 'role', 'permission'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $orders)
    {
        // dd($request->all());
        // Validar los datos del formulario
        $request->validate([
            'status' => 'required|string|max:255',
            'total' => 'required|numeric',
            'direction_delivery' => 'required|string|max:255',
            'payments_method_id' => 'required|exists:payments_methods,id', // Asegúrate de que este campo exista
            'user_id' => 'required|exists:users,id', // Asegúrate de que este campo exista
            // Agrega más validaciones según sea necesario
        ]);

        // Actualizar la orden
        $orders->update($request->only(['status', 'total', 'direction_delivery', 'payments_method_id', 'user_id']));


        // Actualizar los elementos de la orden si se envían
        // if ($request->has('order_items')) {
        //     foreach ($request->order_items as $item) {
        //         $orderItem = OrderItem::find($item['id']);
        //         if ($orderItem) {
        //             $orderItem->update([
        //                 'name_product' => $item['name_product'],
        //                 'price_product' => $item['price_product'],
        //                 'subtotal' => $item['subtotal'],
        //                 'quantity' => $item['quantity'],
        //                 'product_id' => $item['product_id'],
        //             ]);
        //         }
        //     }
        // }

        // Redirigir o devolver una respuesta
        return redirect()->route('orders.index')->with('success', 'Orden actualizada con éxito.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
