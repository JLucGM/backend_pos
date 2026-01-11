<?php
// app/Http\Controllers\Frontend\CheckoutController.php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Discount;
use App\Models\DiscountUsage;
use App\Models\GiftCard;
use App\Models\GiftCardUsage;
use App\Models\ShippingRate;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class CheckoutController extends Controller
{
    /**
     * Procesar el checkout y crear la orden completa
     */
    public function processOrder(Request $request)
    {
        // dd($request->all());
        DB::beginTransaction();

        try {
            // Validar datos básicos
            $validator = Validator::make($request->all(), [
                'cart_items' => 'required|array|min:1',
                'cart_items.*.product_id' => 'required|integer|exists:products,id',
                'cart_items.*.product_name' => 'required|string',
                'cart_items.*.quantity' => 'required|integer|min:1',
                'cart_items.*.price' => 'required|numeric|min:0',
                'cart_items.*.original_price' => 'required|numeric|min:0',
                'cart_items.*.combination_id' => 'nullable|integer',
                'cart_items.*.discount_amount' => 'required|numeric|min:0',
                'cart_items.*.discount_type' => 'nullable|string',
                'cart_items.*.tax_rate' => 'required|numeric|min:0',
                'cart_items.*.tax_amount' => 'required|numeric|min:0',
                
                'user_info' => 'required|array',
                'user_info.user_id' => 'required|integer|exists:users,id',
                'user_info.delivery_location_id' => 'nullable|integer|exists:delivery_locations,id',
                
                'shipping_info' => 'required|array',
                'shipping_info.delivery_type' => 'required|in:delivery,pickup',
                'shipping_info.shipping_rate_id' => 'nullable|integer|exists:shipping_rates,id',
                
                'payment_info' => 'required|array',
                'payment_info.payment_method_id' => 'required|exists:payments_methods,id',
                
                'discounts' => 'nullable|array',
                'discounts.*.code' => 'required|string',
                'discounts.*.id' => 'nullable|integer',
                'discounts.*.amount' => 'required|numeric|min:0',
                
                'gift_card' => 'nullable|array',
                'gift_card.id' => 'nullable|integer|exists:gift_cards,id',
                'gift_card.code' => 'nullable|string',
                'gift_card.amount_used' => 'nullable|numeric|min:0',
                
                'totals' => 'required|array',
                'totals.subtotal' => 'required|numeric|min:0',
                'totals.shipping' => 'required|numeric|min:0',
                'totals.tax' => 'required|numeric|min:0',
                'totals.total' => 'required|numeric|min:0',
                'totals.automatic_discounts' => 'required|numeric|min:0',
                'totals.manual_discounts' => 'required|numeric|min:0',
                'totals.gift_card_amount' => 'required|numeric|min:0',
                
                'company_id' => 'required|integer|exists:companies,id',
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }

            $validated = $validator->validated();
            $user = Auth::user();

            if (!$user || $user->id != $validated['user_info']['user_id']) {
                throw new \Exception('Usuario no autenticado o no coincide');
            }

            // ==================== VALIDACIONES Y PREPARACIÓN ====================

            // 1. Validar stock de todos los productos
            $stockErrors = [];
            foreach ($validated['cart_items'] as $item) {
                $product = Product::find($item['product_id']);
                if (!$product) {
                    $stockErrors[] = "Producto ID {$item['product_id']} no encontrado";
                    continue;
                }

                $stock = $this->getProductStock($product, $item['combination_id'] ?? null);
                if ($stock < $item['quantity']) {
                    $stockErrors[] = "Stock insuficiente para {$item['product_name']}. Disponible: {$stock}, Solicitado: {$item['quantity']}";
                }
            }

            if (!empty($stockErrors)) {
                throw new \Exception(implode(', ', $stockErrors));
            }

            // 2. Validar gift card si se aplica
            $giftCard = null;
            $giftCardAmountUsed = 0;
            if (!empty($validated['gift_card']['id'])) {
                $giftCard = GiftCard::find($validated['gift_card']['id']);
                
                if (!$giftCard) {
                    throw new \Exception('Gift Card no encontrada');
                }

                if ($giftCard->user_id != $user->id) {
                    throw new \Exception('Esta Gift Card no pertenece al usuario actual');
                }

                if (!$giftCard->is_active) {
                    throw new \Exception('Gift Card inactiva');
                }

                if ($giftCard->current_balance < $validated['gift_card']['amount_used']) {
                    throw new \Exception('Saldo insuficiente en la Gift Card');
                }

                if ($giftCard->expiration_date && Carbon::parse($giftCard->expiration_date)->isPast()) {
                    throw new \Exception('Gift Card expirada');
                }

                $giftCardAmountUsed = $validated['gift_card']['amount_used'];
            }

            // 3. Validar descuentos manuales si se aplican
            $appliedDiscounts = [];
            if (!empty($validated['discounts'])) {
                foreach ($validated['discounts'] as $discountData) {
                    $discount = null;
                    
                    if (isset($discountData['id'])) {
                        $discount = Discount::find($discountData['id']);
                    } elseif (isset($discountData['code'])) {
                        $discount = Discount::where('code', $discountData['code'])
                            ->where('company_id', $validated['company_id'])
                            ->first();
                    }
                    
                    if (!$discount) {
                        throw new \Exception('Descuento no válido: ' . ($discountData['code'] ?? 'Desconocido'));
                    }

                    if (!$discount->is_active) {
                        throw new \Exception('Descuento inactivo: ' . $discount->code);
                    }

                    // Validar fechas
                    if ($discount->start_date && Carbon::parse($discount->start_date)->isFuture()) {
                        throw new \Exception('Descuento no disponible aún: ' . $discount->code);
                    }

                    if ($discount->end_date && Carbon::parse($discount->end_date)->isPast()) {
                        throw new \Exception('Descuento expirado: ' . $discount->code);
                    }

                    // Validar límite de usos
                    if ($discount->usage_limit && $discount->usages()->count() >= $discount->usage_limit) {
                        throw new \Exception('Descuento agotado: ' . $discount->code);
                    }

                    // Validar mínimo de orden para descuentos automáticos
                    if ($discount->automatic && $discount->minimum_order_amount > $validated['totals']['subtotal']) {
                        continue; // No aplicar pero no es error
                    }

                    $appliedDiscounts[] = [
                        'discount' => $discount,
                        'amount' => $discountData['amount']
                    ];
                }
            }

            // 4. Obtener tarifa de envío
            $shippingRate = null;
            $shippingAmount = 0;
            if ($validated['shipping_info']['delivery_type'] === 'delivery' && 
                !empty($validated['shipping_info']['shipping_rate_id'])) {
                $shippingRate = ShippingRate::find($validated['shipping_info']['shipping_rate_id']);
                if ($shippingRate) {
                    $shippingAmount = $shippingRate->price;
                }
            }

            // ==================== CREAR LA ORDEN ====================

            // Calcular total de descuentos
            $totalDiscounts = $validated['totals']['automatic_discounts'] + 
                             $validated['totals']['manual_discounts'];

            // Preparar datos de la orden
            $orderData = [
                'status' => 'pending',
                'payment_status' => 'pending', // Se actualizará cuando se procese el pago
                'delivery_type' => $validated['shipping_info']['delivery_type'],
                'subtotal' => $validated['totals']['subtotal'],
                'tax_amount' => $validated['totals']['tax'],
                'total' => $validated['totals']['total'],
                'totaldiscounts' => $totalDiscounts,
                'manual_discount_amount' => $validated['totals']['manual_discounts'],
                'manual_discount_code' => !empty($validated['discounts']) ? 
                    implode(', ', array_column($validated['discounts'], 'code')) : null,
                'delivery_location_id' => $validated['user_info']['delivery_location_id'] ?? null,
                'payments_method_id' => $validated['payment_info']['payment_method_id'],
                'user_id' => $user->id,
                'company_id' => $validated['company_id'],
                'order_origin' => 'web',
                'shipping_rate_id' => $validated['shipping_info']['shipping_rate_id'] ?? null,
                'totalshipping' => $shippingAmount,
                'gift_card_id' => $giftCard->id ?? null,
                'gift_card_amount' => $giftCardAmountUsed,
                'notes' => $request->input('notes', null),
                'order_number' => $this->generateOrderNumber($validated['company_id']),
            ];

            // Crear la orden
            $order = Order::create($orderData);

            // ==================== CREAR ITEMS DE LA ORDEN ====================

            foreach ($validated['cart_items'] as $item) {
                $product = Product::with('taxes')->find($item['product_id']);
                
                // Determinar precio unitario después de descuentos
                $unitPrice = $item['price'];
                $originalUnitPrice = $item['original_price'];
                $itemDiscountAmount = $item['discount_amount'];
                
                // Buscar descuento aplicado a este producto (si es manual)
                $itemDiscount = null;
                if (!empty($appliedDiscounts) && isset($item['discount_type']) && 
                    $item['discount_type'] === 'manual') {
                    foreach ($appliedDiscounts as $appliedDiscount) {
                        // Verificar si este descuento aplica a este producto
                        if ($this->discountAppliesToProduct($appliedDiscount['discount'], $product, $item['combination_id'] ?? null)) {
                            $itemDiscount = $appliedDiscount['discount'];
                            break;
                        }
                    }
                }

                // Preparar datos del item
                $orderItemData = [
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'combination_id' => $item['combination_id'] ?? null,
                    'quantity' => $item['quantity'],
                    'price_product' => $originalUnitPrice,
                    'discounted_price' => $unitPrice,
                    'discount_amount' => $itemDiscountAmount,
                    'discount_id' => $itemDiscount->id ?? null,
                    'discount_type' => $item['discount_type'] ?? null,
                    'subtotal' => $unitPrice * $item['quantity'],
                    'tax_amount' => $item['tax_amount'] ?? ($unitPrice * $item['quantity'] * ($item['tax_rate'] / 100)),
                    'tax_rate' => $item['tax_rate'],
                    'name_product' => $item['product_name'],
                    'product_details' => json_encode([
                        'product_name' => $item['product_name'],
                        'combination_name' => $item['combination_name'] ?? null,
                        'image' => $item['image'] ?? null,
                        'sku' => $product->sku ?? null,
                        'weight' => $product->weight ?? null,
                        'dimensions' => $product->dimensions ?? null,
                    ]),
                ];

                $orderItem = $order->orderItems()->create($orderItemData);

                // Actualizar stock
                $this->updateProductStock($product, $item['quantity'], $item['combination_id'] ?? null);

                // Registrar uso de descuento por item si aplica
                if ($itemDiscount) {
                    DiscountUsage::create([
                        'discount_id' => $itemDiscount->id,
                        'order_id' => $order->id,
                        'order_item_id' => $orderItem->id,
                        'user_id' => $user->id,
                        'discount_amount' => $itemDiscountAmount,
                        'applied_to_type' => 'product',
                        'applied_to_id' => $product->id,
                    ]);
                }
            }

            // ==================== APLICAR GIFT CARD ====================

            if ($giftCard) {
                // Actualizar saldo de la gift card
                $giftCard->update([
                    'current_balance' => $giftCard->current_balance - $giftCardAmountUsed,
                    'last_used_at' => now(),
                ]);

                // Registrar uso de gift card
                GiftCardUsage::create([
                    'gift_card_id' => $giftCard->id,
                    'order_id' => $order->id,
                    'user_id' => $user->id,
                    'amount_used' => $giftCardAmountUsed,
                    'remaining_balance' => $giftCard->current_balance,
                ]);
            }

            // ==================== REGISTRAR DESCUENTOS GLOBALES ====================

            foreach ($appliedDiscounts as $appliedDiscountData) {
                $discount = $appliedDiscountData['discount'];
                $amount = $appliedDiscountData['amount'];
                
                // Solo registrar si no es un descuento por producto (ya se registró por item)
                if ($discount->applies_to !== 'product') {
                    DiscountUsage::create([
                        'discount_id' => $discount->id,
                        'order_id' => $order->id,
                        'user_id' => $user->id,
                        'discount_amount' => $amount,
                        'applied_to_type' => $discount->applies_to,
                        'applied_to_id' => null,
                    ]);
                }
            }

            // ==================== LIMPIAR CARRITO (OPCIONAL) ====================

            // Aquí podrías limpiar el carrito del usuario si guardas en base de datos
            // Si usas localStorage, el frontend se encargará

            DB::commit();

            // ==================== ENVIAR NOTIFICACIONES ====================

            // Opcional: Enviar email de confirmación
            $this->sendOrderConfirmationEmail($order, $user);

            // ==================== RESPUESTA DE ÉXITO ====================

            return response()->json([
                'success' => true,
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'message' => 'Orden creada exitosamente',
                'order' => [
                    'id' => $order->id,
                    'number' => $order->order_number,
                    'status' => $order->status,
                    'total' => $order->total,
                    'created_at' => $order->created_at->format('d/m/Y H:i'),
                ],
                // Redirigir a página de éxito o detalle de orden
                // 'redirect_url' => '/checkout/success/' . $order->id,
            ]);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error al procesar orden: ' . $e->getMessage());
            \Log::error('Trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la orden: ' . $e->getMessage(),
                'error_details' => config('app.debug') ? $e->getTraceAsString() : null
            ], 500);
        }
    }

    /**
     * Verificar si un descuento aplica a un producto específico
     */
    private function discountAppliesToProduct($discount, $product, $combinationId = null)
    {
        if ($discount->applies_to === 'product') {
            // Verificar productos específicos
            if ($discount->products->contains($product->id)) {
                // Si el descuento tiene combinación específica, verificarla
                if ($combinationId && $discount->pivot && $discount->pivot->combination_id) {
                    return $discount->pivot->combination_id == $combinationId;
                }
                return true;
            }
            return false;
        } elseif ($discount->applies_to === 'category') {
            // Verificar categorías
            $productCategoryIds = $product->categories->pluck('id')->toArray();
            $discountCategoryIds = $discount->categories->pluck('id')->toArray();
            
            return !empty(array_intersect($productCategoryIds, $discountCategoryIds));
        }
        
        return false;
    }

    /**
     * Obtener stock del producto
     */
    private function getProductStock($product, $combinationId = null)
    {
        if ($combinationId) {
            $stock = $product->stocks()->where('combination_id', $combinationId)->first();
            return $stock ? $stock->quantity : 0;
        } else {
            $stock = $product->stocks()->whereNull('combination_id')->first();
            return $stock ? $stock->quantity : 0;
        }
    }

    /**
     * Actualizar stock del producto
     */
    private function updateProductStock($product, $quantity, $combinationId = null)
    {
        if ($combinationId) {
            $stock = $product->stocks()->where('combination_id', $combinationId)->first();
            if ($stock) {
                $stock->decrement('quantity', $quantity);
                // Opcional: registrar movimiento de stock
                $this->recordStockMovement($product, $stock, $quantity, 'sale', $combinationId);
            }
        } else {
            $stock = $product->stocks()->whereNull('combination_id')->first();
            if ($stock) {
                $stock->decrement('quantity', $quantity);
                // Opcional: registrar movimiento de stock
                $this->recordStockMovement($product, $stock, $quantity, 'sale');
            }
        }
    }

    /**
     * Registrar movimiento de stock (opcional)
     */
    private function recordStockMovement($product, $stock, $quantity, $type, $combinationId = null)
    {
        // Opcional: Si tienes tabla stock_movements
        // StockMovement::create([...])
    }

    /**
     * Generar número de orden único
     */
    private function generateOrderNumber($companyId)
    {
        $prefix = 'ORD';
        $year = date('Y');
        $month = date('m');
        
        // Contar órdenes del mes actual
        $count = Order::where('company_id', $companyId)
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->count();
        
        $sequential = str_pad($count + 1, 4, '0', STR_PAD_LEFT);
        
        return "{$prefix}-{$year}{$month}-{$sequential}";
    }

    /**
     * Enviar email de confirmación (opcional)
     */
    private function sendOrderConfirmationEmail($order, $user)
    {
        // Implementar envío de email
        // Mail::to($user->email)->send(new OrderConfirmationMail($order));
    }

    /**
     * Página de éxito después del checkout
     */
    public function checkoutSuccess($orderId)
    {
        $order = Order::with(['orderItems.product', 'paymentMethod', 'shippingRate', 'user'])
            ->where('user_id', Auth::id())
            ->findOrFail($orderId);

        return inertia('Frontend/Checkout/Success', [
            'order' => $order,
            'company_id' => $order->company_id,
        ]);
    }
}