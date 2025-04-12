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
    public function index(Request $request)
    {
        $orders = Order::with('orderItems', 'client','user', 'paymentMethod')
        ->get();

        return response()->json($orders);
    }

    public function show($id)
    {
        $order = Order::with('orderItems', 'client','user', 'paymentMethod')->find($id);

        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        return response()->json($order);
    }

    // public function destroy($id)
    // {
    //     $order = Order::find($id);

    //     if (!$order) {
    //         return response()->json(['error' => 'Order not found'], 404);
    //     }

    //     // Eliminar los items de la orden
    //     foreach ($order->orderItems as $item) {
    //         $item->delete();
    //     }

    //     // Eliminar la orden
    //     $order->delete();

    //     return response()->json(['message' => 'Order deleted successfully']);
    // }
    // public function update(Request $request, $id)
    // {
    //     $order = Order::find($id);

    //     if (!$order) {
    //         return response()->json(['error' => 'Order not found'], 404);
    //     }

    //     $validator = Validator::make($request->all(), [
    //         'status' => 'required|string',
    //         'totaldiscounts' => 'required|string',
    //         'subtotal' => 'required|string',
    //         'total' => 'required|string',
    //         'direction_delivery' => 'nullable|string',
    //         'order_origin' => 'nullable|string',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json($validator->errors(), 422);
    //     }

    //     $order->update($request->all());

    //     return response()->json($order);
    // }
    // public function updateStatus(Request $request, $id)
    // {
    //     $order = Order::find($id);

    //     if (!$order) {
    //         return response()->json(['error' => 'Order not found'], 404);
    //     }

    //     $validator = Validator::make($request->all(), [
    //         'status' => 'required|string',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json($validator->errors(), 422);
    //     }

    //     $order->update($request->only('status'));

    //     return response()->json($order);
    // }
    // public function updateOrderItem(Request $request, $id)
    // {
    //     $orderItem = OrderItem::find($id);

    //     if (!$orderItem) {
    //         return response()->json(['error' => 'Order item not found'], 404);
    //     }

    //     $validator = Validator::make($request->all(), [
    //         'quantity' => 'required|integer|min:1',
    //         'price_product' => 'required|numeric',
    //         'product_details' => 'nullable|array'
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json($validator->errors(), 422);
    //     }

    //     $orderItem->update($request->all());

    //     return response()->json($orderItem);
    // }
    // public function destroyOrderItem($id)
    // {
    //     $orderItem = OrderItem::find($id);

    //     if (!$orderItem) {
    //         return response()->json(['error' => 'Order item not found'], 404);
    //     }

    //     $orderItem->delete();

    //     return response()->json(['message' => 'Order item deleted successfully']);
    // }
    // public function storeOrderItem(Request $request)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'order_id' => 'required|exists:orders,id',
    //         'product_id' => 'required|exists:products,id',
    //         'quantity' => 'required|integer|min:1',
    //         'price_product' => 'required|numeric',
    //         'product_details' => 'nullable|array'
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json($validator->errors(), 422);
    //     }

    //     $orderItem = OrderItem::create($request->all());

    //     return response()->json($orderItem, 201);
    // }

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
    
    public function storeUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
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
            'user_id' => $request->user_id,
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
