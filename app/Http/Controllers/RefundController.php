<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Refund;
use App\Models\RefundItem;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RefundController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'reason' => 'nullable|string',
            'restock_items' => 'boolean',
            'refund_money' => 'boolean', // Nuevo: Para el checkbox
            'payment_method_id' => 'nullable|exists:payment_methods,id',
            'items' => 'array',
            'items.*.order_item_id' => 'required|exists:order_items,id',
            'items.*.quantity' => 'required|integer|min:0',
            'items.*.restock_action' => 'required|in:return_to_stock,discard,none',
        ]);

        // Forzar amount a 0 si no se reembolsa dinero
        if (!$validated['refund_money']) {
            $validated['amount'] = 0;
        }

        $orderId = OrderItem::find($validated['items'][0]['order_item_id'])->order_id;
        $order = Order::find($orderId);

        $refund = Refund::create([
            'order_id' => $orderId,
            'amount' => $validated['amount'],
            'reason' => $validated['reason'],
            'restock_items' => $validated['restock_items'],
            'user_id' => Auth::id(),
            'company_id' => $order->company_id ?? Auth::user()->company_id,
            'payment_method_id' => $validated['payment_method_id'] ?? null,
            'refunded_at' => now(),
        ]);

        $order->update(['status' => 'refunded']);

        $orderItems = OrderItem::whereIn('id', collect($validated['items'])->pluck('order_item_id'))
            ->with(['product', 'combination'])
            ->get()
            ->keyBy('id');

        foreach ($validated['items'] as $item) {
            if ($item['quantity'] > 0) {
                RefundItem::create([
                    'refund_id' => $refund->id,
                    'order_item_id' => $item['order_item_id'],
                    'quantity' => $item['quantity'],
                    'restock_action' => $item['restock_action'],
                ]);

                if ($validated['restock_items']) {
                    if ($item['restock_action'] === 'return_to_stock') {
                        $orderItem = $orderItems[$item['order_item_id']];
                        $product = $orderItem->product;
                        $combinationId = $orderItem->combination_id;

                        $stockQuery = $product->stocks();
                        if ($combinationId) {
                            $stockQuery->where('combination_id', $combinationId);
                        } else {
                            $stockQuery->whereNull('combination_id');
                        }

                        $stock = $stockQuery->first();

                        try {
                            if ($stock) {
                                $stock->increment('quantity', $item['quantity']);
                            } else {
                                $product->stocks()->create([
                                    'quantity' => $item['quantity'],
                                    'status' => 'available',
                                    'product_id' => $product->id,
                                    'combination_id' => $combinationId,
                                    'company_id' => $product->company_id,
                                ]);
                            }
                        } catch (\Exception $e) {
                            \Log::error('Error en restock: ' . $e->getMessage(), [
                                'order_item_id' => $item['order_item_id'],
                                'combination_id' => $combinationId,
                            ]);
                        }
                    } elseif ($item['restock_action'] === 'discard') {
                        \Log::info('Producto descartado en reembolso', [
                            'order_item_id' => $item['order_item_id'],
                            'quantity' => $item['quantity'],
                        ]);
                    }
                }
            }
        }

        return redirect()->back()->with('success', 'Reembolso registrado correctamente.');
    }
}
