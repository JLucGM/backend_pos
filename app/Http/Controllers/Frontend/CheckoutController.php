<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\DeliveryLocation;
use App\Models\Order;
use App\Models\Discount;
use App\Models\GiftCard;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    // Validar código de descuento
    public function validateDiscount(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'company_id' => 'required|exists:companies,id',
            'cart_total' => 'required|numeric|min:0',
        ]);

        $discount = Discount::where('code', $request->code)
            ->where('company_id', $request->company_id)
            ->where('is_active', true)
            ->first();

        if (!$discount) {
            return response()->json([
                'valid' => false,
                'message' => 'Código de descuento no válido',
            ]);
        }

        // Validar fechas
        if ($discount->start_date && now()->lt($discount->start_date)) {
            return response()->json([
                'valid' => false,
                'message' => 'Este descuento no está disponible aún',
            ]);
        }

        if ($discount->end_date && now()->gt($discount->end_date)) {
            return response()->json([
                'valid' => false,
                'message' => 'Este descuento ha expirado',
            ]);
        }

        // Validar monto mínimo
        if ($discount->minimum_order_amount > 0 && 
            $request->cart_total < $discount->minimum_order_amount) {
            return response()->json([
                'valid' => false,
                'message' => sprintf('El monto mínimo para este descuento es %s', 
                    number_format($discount->minimum_order_amount, 2)),
            ]);
        }

        // Validar límite de uso
        if ($discount->usage_limit > 0 && 
            $discount->usages()->count() >= $discount->usage_limit) {
            return response()->json([
                'valid' => false,
                'message' => 'Este descuento ha alcanzado su límite de uso',
            ]);
        }

        return response()->json([
            'valid' => true,
            'discount' => [
                'id' => $discount->id,
                'name' => $discount->name,
                'code' => $discount->code,
                'discount_type' => $discount->discount_type,
                'value' => $discount->value,
                'applies_to' => $discount->applies_to,
            ],
        ]);
    }

    // Validar gift card
    public function validateGiftCard(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'company_id' => 'required|exists:companies,id',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $giftCard = GiftCard::where('code', $request->code)
            ->where('company_id', $request->company_id)
            ->where('is_active', true)
            ->first();

        if (!$giftCard) {
            return response()->json([
                'valid' => false,
                'message' => 'Gift Card no válida',
            ]);
        }

        // Validar que pertenezca al usuario
        if ($request->user_id && $giftCard->user_id != $request->user_id) {
            return response()->json([
                'valid' => false,
                'message' => 'Esta Gift Card no pertenece a tu cuenta',
            ]);
        }

        // Validar saldo
        if ($giftCard->current_balance <= 0) {
            return response()->json([
                'valid' => false,
                'message' => 'Esta Gift Card no tiene saldo disponible',
            ]);
        }

        // Validar fecha de expiración
        if ($giftCard->expiration_date && now()->gt($giftCard->expiration_date)) {
            return response()->json([
                'valid' => false,
                'message' => 'Esta Gift Card ha expirado',
            ]);
        }

        return response()->json([
            'valid' => true,
            'giftCard' => [
                'id' => $giftCard->id,
                'code' => $giftCard->code,
                'current_balance' => $giftCard->current_balance,
            ],
        ]);
    }

    // Procesar orden
    public function processOrder(Request $request)
    {
        try {
            $request->validate([
                'formData' => 'required|array',
                'cart_items' => 'required|array',
                'cart_total' => 'required|numeric|min:0',
                'company_id' => 'required|exists:companies,id',
                'selected_payment_method' => 'required',
                 'delivery_type' => 'required|in:delivery,pickup',
                 'user_id' => 'nullable|exists:users,id',
            ]);

            DB::beginTransaction();

            // Validar que el usuario existe y pertenece a la compañía
        $user = User::where('id', $request->user_id)
            ->where('company_id', $request->company_id)
            ->firstOrFail();

        // Validar dirección si es delivery
        if ($request->delivery_type === 'delivery') {
            $request->validate([
                'selected_address_id' => 'required|exists:delivery_locations,id',
            ]);

            // Verificar que la dirección pertenece al usuario
            $address = DeliveryLocation::where('id', $request->selected_address_id)
                ->where('user_id', $user->id)
                ->firstOrFail();
        }
        
            // Crear la orden similar al backend
            $orderData = [
                'status' => 'pending',
                'payment_status' => 'pending',
                'delivery_type' => $request->delivery_type,
                'subtotal' => $request->cart_total,
                'tax_amount' => $request->tax ?? 0,
                'total' => $request->order_total,
                'totaldiscounts' => $request->discounts ?? 0,
                'totalshipping' => $request->shipping ?? 0,
                'manual_discount_code' => $request->applied_discount_id ? $request->code : null,
                'manual_discount_amount' => $request->discounts ?? 0,
                'gift_card_amount' => $request->gift_card_amount ?? 0,
                'delivery_location_id' => $request->formData['delivery_location_id'] ?? null,
                'payments_method_id' => $request->selected_payment_method,
                'order_origin' => 'frontend',
                'user_id' => $request->user_id ?? Auth::id(),
                'company_id' => $request->company_id,
                'customer_name' => $request->formData['name'] ?? null,
                'customer_email' => $request->formData['email'],
                'customer_phone' => $request->formData['phone'],
                'customer_address' => $request->formData['address'],
                'customer_city' => $request->formData['city'],
                'customer_zip_code' => $request->formData['zipCode'],
                'customer_country' => $request->formData['country'],
                'notes' => $request->formData['notes'] ?? null,
            ];

            $order = Order::create($orderData);

            // Crear items de la orden
            foreach ($request->cart_items as $item) {
                $order->orderItems()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price_product' => $item['price'],
                    'subtotal' => $item['price'] * $item['quantity'],
                    'combination_id' => $item['combination_id'] ?? null,
                    'product_details' => json_encode($item['product_details'] ?? []),
                ]);
            }

            // Actualizar gift card si se usó
            if ($request->gift_card_amount > 0 && $request->applied_gift_card_id) {
                $giftCard = GiftCard::find($request->applied_gift_card_id);
                if ($giftCard) {
                    $giftCard->current_balance -= $request->gift_card_amount;
                    $giftCard->save();

                    // Registrar uso
                    \App\Models\GiftCardUsage::create([
                        'gift_card_id' => $giftCard->id,
                        'order_id' => $order->id,
                        'user_id' => $order->user_id,
                        'amount_used' => $request->gift_card_amount,
                    ]);
                }
            }

            // Registrar uso de descuento si se aplicó
            if ($request->applied_discount_id) {
                \App\Models\DiscountUsage::create([
                    'discount_id' => $request->applied_discount_id,
                    'order_id' => $order->id,
                    'user_id' => $order->user_id,
                    'discount_amount' => $request->discounts,
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'order_id' => $order->id,
                'message' => 'Orden creada exitosamente',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la orden: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Página de confirmación
    public function confirmation(Order $order)
    {
        // Verificar que la orden pertenezca al usuario
        if (Auth::id() !== $order->user_id) {
            abort(403);
        }

        return Inertia::render('Frontend/Checkout/Confirmation', [
            'order' => $order->load(['orderItems.product', 'paymentMethod', 'user']),
        ]);
    }
}