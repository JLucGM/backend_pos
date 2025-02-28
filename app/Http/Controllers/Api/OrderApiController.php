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
            'client_id' => 'required|exists:clients,id',
            'payments_method_id' => 'required|exists:payments_methods,id',
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
            'client_id' => $request->client_id,
            'payments_method_id' => $request->payments_method_id,
        ]);

        // Crear los items de la orden
        foreach ($request->items as $item) {
            $product = Product::find($item['product_id']);
            if (!$product) {
                return response()->json(['error' => 'Product not found'], 404);
            }

            // Obtener el stock del producto
            $stock = $product->stocks()->first(); // Asumiendo que solo hay un stock por producto
            if (!$stock || $stock->quantity < $item['quantity']) {
                return response()->json(['error' => 'Not enough stock for product ' . $product->product_name], 400);
            }

            // Calcular el subtotal
            $subtotal = $product->product_price * $item['quantity'];

            // Crear el item de la orden
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'name_product' => $product->product_name,
                'price_product' => $product->product_price,
                'subtotal' => $subtotal,
                'quantity' => $item['quantity'],
            ]);

            // Restar la cantidad del stock
            $stock->quantity -= $item['quantity'];
            $stock->save(); // Guardar los cambios en el stock
        }

        return response()->json($order->load('orderItems'), 201);
    }
}
