<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderApiController extends Controller
{
    public function store(Request $request)
{
    // Validar la solicitud
    $validator = Validator::make($request->all(), [
        'user_id' => 'required|exists:users,id',
        'payments_method_id' => 'required|exists:payments_methods,id', // Cambiado aquí
        'total' => 'required|string',
        'direction_delivery' => 'nullable|string',
        'items' => 'required|array',
        'items.*.product_id' => 'required|exists:products,id',
        'items.*.quantity' => 'required|integer|min:1',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 422);
    }

    // Crear la orden
    $order = Order::create([
        'status' => 'Finalizado',
        'total' => $request->total,
        'direction_delivery' => $request->direction_delivery,
        'user_id' => $request->user_id,
        'payments_method_id' => $request->payments_method_id,
    ]);

    // Crear los items de la orden
    foreach ($request->items as $item) {
        $product = Product::find($item['product_id']);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        $subtotal = $product->product_price * $item['quantity'];

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $item['product_id'],
            'name_product' => $product->product_name,
            'price_product' => $product->product_price,
            'subtotal' => $subtotal,
            'quantity' => $item['quantity'],
        ]);
    }

    return response()->json($order->load('orderItems'), 201);
}
}
