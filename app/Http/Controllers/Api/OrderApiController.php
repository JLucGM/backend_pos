<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Combination;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderApiController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'client_id' => 'required|exists:clients,id',
            'payments_method_id' => 'required|exists:payments_methods,id',
            'totaldiscounts' => 'required|string',
            'subtotal' => 'required|string',
            'total' => 'required|string',
            'direction_delivery' => 'nullable|string',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.combination_id' => 'nullable|exists:combinations,id',
            'items.*.price' => 'required|numeric',
            'items.*.details' => 'nullable|array' // Validar que los detalles sean un arreglo
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $order = Order::create([
            'status' => 'Finalizado',
            'totaldiscounts' => $request->totaldiscounts,
            'subtotal' => $request->subtotal,
            'total' => $request->total,
            'direction_delivery' => $request->direction_delivery,
            'order_origin' => $request->order_origin,
            'client_id' => $request->client_id,
            'payments_method_id' => $request->payments_method_id,
        ]);

        foreach ($request->items as $item) {
            $product = Product::find($item['product_id']);
            if (!$product) {
                return response()->json(['error' => 'Product not found'], 404);
            }

            $combination = null;
            if (isset($item['combination_id'])) {
                $combination = Combination::find($item['combination_id']);
                if (!$combination) {
                    return response()->json(['error' => 'Combination not found'], 404);
                }
            }

            // Verificar el stock
            if ($combination) {
                $stock = $product->stocks()->where('combination_id', $combination->id)->first();
            } else {
                $stock = $product->stocks()->first();
            }

            if (!$stock || $stock->quantity < $item['quantity']) {
                return response()->json(['error' => 'Not enough stock for product ' . $product->product_name], 400);
            }

            $subtotal = $item['price'] * $item['quantity'];

            // Crear el registro en order_items sin product_id ni combination_id
            OrderItem::create([
                'order_id' => $order->id,
                'price_product' => $item['price'],
                'name_product' => $product->product_name,
                'subtotal' => $subtotal,
                'quantity' => $item['quantity'],
                'product_details' => isset($item['details']) ? json_encode($item['details']) : null // Guardar los detalles como JSON
            ]);

            // Actualizar el stock
            $stock->quantity -= $item['quantity'];
            $stock->save();
        }

        return response()->json($order->load('orderItems'), 201);
    }
}
