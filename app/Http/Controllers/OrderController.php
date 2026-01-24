<?php

namespace App\Http\Controllers;

use App\Http\Requests\Orders\StoreRequest;
use App\Http\Requests\Orders\UpdateRequest;
use App\Models\Discount;
use App\Models\DiscountUsage;
use App\Models\GiftCard;
use App\Models\GiftCardUsage;
use App\Models\Order;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\ShippingRate;
use App\Models\Store;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userAuth = Auth::user();
        $orders = Order::with('user')->where('company_id', $userAuth->company_id)->get();

        $role = $userAuth->getRoleNames();
        $permission = $userAuth->getAllPermissions();

        return Inertia::render('Orders/Index', compact('orders', 'role', 'permission'));
    }

    /**
     * Show the form for creating a new resource.
     */

    public function create()
    {
        $userAuth = Auth::user();

        if (!$userAuth->can('admin.orders.create')) {
            abort(403, 'No tienes permiso para crear órdenes.');
        }

        $paymentMethods = PaymentMethod::where('is_active', true)->get();

        // Cargar usuarios clientes activos, con sus deliveryLocations y giftcards activas
        $users = User::with([
            'deliveryLocations',
            'giftCards' => function ($query) {
                $query->where('is_active', true); // Solo giftcards activas
            }
        ])
            ->where('is_active', true)
            ->whereHas('roles', function ($query) {
                $query->where('name', 'client');
            })
            ->get();

        // Cargar productos, descuentos, etc. (sin cambios)
        $products = Product::with(
            'categories',
            'media',
            'stocks',
            'taxes',
            'combinations.combinationAttributeValue.attributeValue.attribute',
            'discounts'
        )->get();

        $discounts = Discount::with(['products', 'categories'])
            ->withCount('usages')
            ->active()
            ->get();

        $shippingRates = ShippingRate::all();

        return Inertia::render('Orders/Create', compact('paymentMethods', 'products', 'users', 'discounts', 'shippingRates'));
    }

    /**
     * Store a newly created order in storage.
     */

    public function store(StoreRequest $request)
    {
        // dd($request->all());
        $userAuth = Auth::user();

        if ($userAuth->company_id !== $request->input('company_id', $userAuth->company_id)) {
            abort(403, 'No tienes permiso para esta operación.');
        }

        // DEBUG: Log para ver qué llega
        \Log::info('Order request received:', [
            'order_items_count' => count($request['order_items'] ?? []),
            'order_items' => $request['order_items'] ?? [],
            'user_id' => $request->user_id,
            'company_id' => $userAuth->company_id
        ]);

        // Cargar descuentos activos
        $discounts = Discount::where('is_active', true)
            ->where(function ($query) use ($userAuth) {
                $query->whereNull('company_id')
                    ->orWhere('company_id', $userAuth->company_id);
            })
            ->with(['products:id,product_name', 'categories:id,category_name'])
            ->get();

        // Validar giftcard
        $giftCardId = $request->input('gift_card_id');
        $giftCardAmount = $request->input('gift_card_amount', 0);
        $appliedGiftCard = null;
        if ($giftCardId && $giftCardAmount > 0) {
            $giftCard = GiftCard::find($giftCardId);
            if (!$giftCard || !$giftCard->is_active || $giftCard->user_id !== $request->user_id || $giftCard->current_balance < $giftCardAmount || now() > $giftCard->expiration_date) {
                throw ValidationException::withMessages(['gift_card' => 'Giftcard inválida o insuficiente.']);
            }
            $appliedGiftCard = $giftCard;
        }

        // Pre-calcular descuentos y totales
        $orderItemsData = $request['order_items'] ?? [];
        $totalDiscounts = 0;
        $subtotalPostDiscount = 0;
        $taxAmount = 0;
        $subtotalPreDiscount = 0;

        // DEBUG: Log inicial
        \Log::info('Iniciando procesamiento de items:', ['count' => count($orderItemsData)]);

        foreach ($orderItemsData as $index => &$itemData) {
            \Log::info("Procesando ítem {$index}:", $itemData);

            // Mapeo de campos
            if (isset($itemData['product_price'])) {
                $itemData['price_product'] = $itemData['product_price'];
                unset($itemData['product_price']);
            }

            $productId = $itemData['product_id'];
            $combinationId = $itemData['combination_id'] ?? null;
            $quantity = $itemData['quantity'];

            \Log::info("Buscando producto:", [
                'product_id' => $productId,
                'combination_id' => $combinationId,
                'company_id' => $userAuth->company_id
            ]);

            // CORRECCIÓN IMPORTANTE: Buscar producto CON combinaciones y stocks
            $product = Product::with([
                'categories',
                'discounts:id,name,discount_type,value,applies_to',
                'taxes',
                'stocks',
                'combinations' // Asegurar que cargue combinaciones
            ])
                ->where('company_id', $userAuth->company_id)
                ->find($productId);

            if (!$product) {
                \Log::error('Producto no encontrado:', [
                    'product_id' => $productId,
                    'company_id' => $userAuth->company_id
                ]);
                throw ValidationException::withMessages(['order_items' => 'Producto no encontrado: ' . $productId]);
            }

            \Log::info('Producto encontrado:', [
                'id' => $product->id,
                'name' => $product->product_name,
                'has_combinations' => $product->combinations ? $product->combinations->count() : 0,
                'stocks_count' => $product->stocks ? $product->stocks->count() : 0
            ]);

            // Validar stock por combination_id
            $stock = $this->getProductStock($product, $combinationId);

            \Log::info('Stock verificado:', [
                'product_id' => $productId,
                'combination_id' => $combinationId,
                'stock' => $stock,
                'quantity' => $quantity
            ]);

            if ($stock < $quantity) {
                $varName = $combinationId ? ' (variación ID: ' . $combinationId . ')' : '';
                throw ValidationException::withMessages(['order_items' => 'Stock insuficiente para: ' . $product->product_name . $varName]);
            }

            // Determinar precios
            $productOriginalPrice = (float) $product->product_price;
            $productDiscountedPrice = $product->product_price_discount && $product->product_price_discount > 0
                ? (float) $product->product_price_discount
                : $productOriginalPrice;

            $hasDirectDiscount = false;
            $directDiscountAmount = 0;

            // CORRECCIÓN: Para productos CON combinación, usar el precio de la combinación
            if ($combinationId && $product->combinations) {
                $combination = $product->combinations->firstWhere('id', $combinationId);
                if ($combination) {
                    $productOriginalPrice = (float) $combination->combination_price;
                    $productDiscountedPrice = $productOriginalPrice; // Las combinaciones no tienen descuento directo
                    \Log::info('Usando precio de combinación:', [
                        'combination_id' => $combinationId,
                        'price' => $productOriginalPrice
                    ]);
                }
            } elseif (is_null($combinationId) && $product->product_price_discount && $product->product_price_discount > 0) {
                // Solo productos simples sin combinación pueden tener descuento directo
                $hasDirectDiscount = true;
                $directDiscountAmount = ($productOriginalPrice - $productDiscountedPrice) * $quantity;
                \Log::info('Descuento directo aplicado:', [
                    'original' => $productOriginalPrice,
                    'discounted' => $productDiscountedPrice,
                    'amount' => $directDiscountAmount
                ]);
            }

            $basePrice = $productOriginalPrice;
            $effectivePrice = $productDiscountedPrice;

            $itemData['price_product'] = $basePrice;

            $originalSubtotal = $effectivePrice * $quantity;
            $subtotalPreDiscount += $originalSubtotal;

            \Log::info('Cálculos preliminares:', [
                'originalSubtotal' => $originalSubtotal,
                'subtotalPreDiscount_acumulado' => $subtotalPreDiscount
            ]);

            // Solo buscar descuento automático si NO hay manual_discount_id
            $isManualItem = isset($itemData['manual_discount_id']) && $itemData['manual_discount_id'];

            if (!$isManualItem) {
                $applicableDiscount = $this->findApplicableDiscount($product, $combinationId, $quantity, $subtotalPreDiscount, $discounts);

                \Log::info('Descuento automático encontrado:', [
                    'applicable' => $applicableDiscount ? $applicableDiscount->id : null,
                    'has_direct_discount' => $hasDirectDiscount
                ]);

                if ($applicableDiscount) {
                    if ($applicableDiscount->usage_limit && $applicableDiscount->usages()->count() >= $applicableDiscount->usage_limit) {
                        throw ValidationException::withMessages(['order_items' => 'Descuento automático agotado para: ' . $product->product_name]);
                    }

                    $discountAmountPerItem = $this->calculateDiscount($applicableDiscount, $effectivePrice, $quantity);
                    $totalDiscountForItem = $directDiscountAmount + $discountAmountPerItem;

                    $discountedPrice = max(0, $effectivePrice - ($discountAmountPerItem / $quantity));
                    $discountedSubtotal = $originalSubtotal - $discountAmountPerItem;

                    $itemData['discount_id'] = $applicableDiscount->id;
                    $itemData['discount_type'] = $applicableDiscount->discount_type;
                    $itemData['discount_amount'] = $totalDiscountForItem;
                    $itemData['discounted_price'] = $discountedPrice;
                    $itemData['subtotal'] = $discountedSubtotal;
                    $itemData['product_details'] = $itemData['product_details'] ?? null;

                    $totalDiscounts += $totalDiscountForItem;
                    $subtotalPostDiscount += $discountedSubtotal;

                    $itemData['applied_discount_id'] = $applicableDiscount->id;
                    $itemData['applied_discount_amount'] = $discountAmountPerItem;

                    \Log::info('Descuento automático aplicado:', [
                        'discount_amount' => $discountAmountPerItem,
                        'totalDiscountForItem' => $totalDiscountForItem,
                        'discountedSubtotal' => $discountedSubtotal
                    ]);
                } else {
                    // No hay descuento automático
                    $itemData['discount_id'] = null;
                    $itemData['discount_type'] = null;
                    $itemData['discount_amount'] = $directDiscountAmount;
                    $itemData['discounted_price'] = $effectivePrice;
                    $itemData['subtotal'] = $originalSubtotal;

                    $totalDiscounts += $directDiscountAmount;
                    $subtotalPostDiscount += $originalSubtotal;

                    \Log::info('Sin descuento automático:', [
                        'directDiscountAmount' => $directDiscountAmount,
                        'subtotalPostDiscount_acumulado' => $subtotalPostDiscount
                    ]);
                }
            } else {
                // Descuento manual del frontend
                $manualDiscount = $discounts->find($itemData['manual_discount_id']);
                if (!$manualDiscount || $manualDiscount->automatic) {
                    throw ValidationException::withMessages(['order_items' => 'Descuento manual inválido para ítem: ' . $product->product_name]);
                }
                if ($manualDiscount->usage_limit && $manualDiscount->usages()->count() >= $manualDiscount->usage_limit) {
                    throw ValidationException::withMessages(['order_items' => 'Descuento manual agotado para ítem: ' . $product->product_name]);
                }

                $expectedSubtotal = ($effectivePrice * $quantity) - $itemData['discount_amount'];
                if (abs($itemData['subtotal'] - $expectedSubtotal) > 0.01) {
                    throw ValidationException::withMessages(['order_items' => 'Valores de descuento inconsistentes para ítem: ' . $product->product_name]);
                }

                $totalDiscountForItem = $directDiscountAmount + $itemData['discount_amount'];

                $totalDiscounts += $totalDiscountForItem;
                $subtotalPostDiscount += $itemData['subtotal'];

                $itemData['discount_amount'] = $totalDiscountForItem;
                $itemData['applied_discount_id'] = $manualDiscount->id;
                $itemData['applied_discount_amount'] = $itemData['discount_amount'];
            }

            // Calcular impuestos
            $taxRate = $product->taxes ? $product->taxes->tax_rate / 100 : 0;
            // CORRECCIÓN: Recalcular tax_amount basado en el subtotal actualizado
            $itemData['tax_amount'] = $itemData['subtotal'] * $taxRate;
            $taxAmount += $itemData['tax_amount'];

            \Log::info('Cálculos finales del ítem:', [
                'subtotal' => $itemData['subtotal'],
                'tax_rate' => $taxRate,
                'tax_amount' => $itemData['tax_amount'],
                'tax_amount_acumulado' => $taxAmount
            ]);
        }

        \Log::info('Totales después de procesar todos los items:', [
            'subtotalPreDiscount' => $subtotalPreDiscount,
            'subtotalPostDiscount' => $subtotalPostDiscount,
            'totalDiscounts' => $totalDiscounts,
            'taxAmount' => $taxAmount,
            'order_items_final' => $orderItemsData
        ]);

        // Descuento order_total automático
        $orderTotalDiscount = $this->calculateOrderTotalDiscount($subtotalPostDiscount, $discounts);
        $appliedOrderDiscount = null;
        if ($orderTotalDiscount > 0) {
            $appliedOrderDiscount = $discounts->where('applies_to', 'order_total')->where('automatic', true)->first();
            if ($appliedOrderDiscount && $appliedOrderDiscount->usage_limit && $appliedOrderDiscount->usages()->count() >= $appliedOrderDiscount->usage_limit) {
                throw ValidationException::withMessages(['order_items' => 'Descuento automático global agotado.']);
            }
        }

        // Descuento manual global
        $manualDiscountCode = $request['manual_discount_code'] ?? null;
        $manualDiscountAmount = $request['manual_discount_amount'] ?? 0;
        $manualError = null;
        $appliedManualDiscount = null;

        if ($manualDiscountCode) {
            $manualDiscount = $discounts->firstWhere('code', $manualDiscountCode);
            if ($manualDiscount && !$manualDiscount->automatic) {
                if (in_array($manualDiscount->applies_to, ['product', 'category', 'order_total'])) {
                    if ($manualDiscount->usage_limit && $manualDiscount->usages()->count() >= $manualDiscount->usage_limit) {
                        throw ValidationException::withMessages(['manual_discount_code' => 'Código de descuento agotado.']);
                    } elseif ($this->isDiscountValid($manualDiscount, $subtotalPreDiscount)) {
                        $appliedManualDiscount = $manualDiscount;
                        if ($manualDiscount->applies_to === 'order_total') {
                            $calculatedAmount = $this->calculateDiscount($manualDiscount, $subtotalPostDiscount, 1);
                            $manualDiscountAmount = max(0, $calculatedAmount);
                        }
                    } else {
                        throw ValidationException::withMessages(['manual_discount_code' => 'Código de descuento inválido.']);
                    }
                } else {
                    throw ValidationException::withMessages(['manual_discount_code' => 'Tipo de descuento no soportado.']);
                }
            } else {
                throw ValidationException::withMessages(['manual_discount_code' => 'Código de descuento no encontrado.']);
            }
        }

        // Si manual es por 'product' o 'category'
        if ($manualDiscountCode && isset($manualDiscount) && $manualDiscount && in_array($manualDiscount->applies_to, ['product', 'category'])) {
            \Log::info('Aplicando descuento manual por producto/categoría:', [
                'discount_id' => $manualDiscount->id,
                'applies_to' => $manualDiscount->applies_to
            ]);

            foreach ($orderItemsData as &$itemData) {
                $isManualItem = isset($itemData['manual_discount_id']) && $itemData['manual_discount_id'];
                if (!$isManualItem) {
                    $product = Product::with('taxes')->find($itemData['product_id']);
                    $combinationId = $itemData['combination_id'] ?? null;

                    if ($this->isManualApplicableToItem($manualDiscount, $itemData, $product, $combinationId)) {
                        if ($manualDiscount->usage_limit && $manualDiscount->usages()->count() >= $manualDiscount->usage_limit) {
                            throw ValidationException::withMessages(['order_items' => 'Descuento manual agotado para ítem: ' . $product->product_name]);
                        }

                        $taxRate = $product->taxes ? $product->taxes->tax_rate / 100 : 0;
                        $effectivePrice = $itemData['discounted_price'];
                        $itemManualDiscountAmount = $this->calculateDiscount($manualDiscount, $effectivePrice, $itemData['quantity']);

                        $itemData['discount_amount'] += $itemManualDiscountAmount;
                        $itemData['subtotal'] -= $itemManualDiscountAmount;
                        $itemData['discounted_price'] = max(0, $effectivePrice - ($itemManualDiscountAmount / $itemData['quantity']));
                        $itemData['tax_amount'] = $itemData['subtotal'] * $taxRate;

                        $totalDiscounts += $itemManualDiscountAmount;
                        $subtotalPostDiscount -= $itemManualDiscountAmount;

                        \Log::info('Descuento manual aplicado a ítem:', [
                            'product_id' => $itemData['product_id'],
                            'discount_amount' => $itemManualDiscountAmount,
                            'nuevo_subtotal' => $itemData['subtotal'],
                            'nuevo_tax' => $itemData['tax_amount']
                        ]);
                    }
                }
            }

            // Recalcular taxAmount total
            $taxAmount = 0;
            foreach ($orderItemsData as $itemData) {
                $taxAmount += $itemData['tax_amount'];
            }

            $manualDiscountAmount = 0;
            $appliedManualDiscount = $manualDiscount;
        }

        // Obtener shipping
        $shippingRateId = $request->input('shipping_rate_id');
        $totalShipping = 0;
        if ($shippingRateId) {
            $shippingRate = ShippingRate::find($shippingRateId);
            if ($shippingRate) {
                $totalShipping = $shippingRate->price;
            }
        }

        // Cálculo final
        $finalSubtotal = $subtotalPostDiscount;
        $finalTotal = $finalSubtotal + $taxAmount - $orderTotalDiscount - $manualDiscountAmount - $giftCardAmount + $totalShipping;
        $grandTotalDiscounts = $totalDiscounts + $manualDiscountAmount + $giftCardAmount;

        // DEBUG: Log de cálculos finales
        \Log::info('Cálculos finales del backend:', [
            'finalSubtotal' => $finalSubtotal,
            'taxAmount' => $taxAmount,
            'orderTotalDiscount' => $orderTotalDiscount,
            'manualDiscountAmount' => $manualDiscountAmount,
            'giftCardAmount' => $giftCardAmount,
            'totalShipping' => $totalShipping,
            'finalTotal' => $finalTotal,
            'grandTotalDiscounts' => $grandTotalDiscounts,
            'order_items_count' => count($orderItemsData)
        ]);

        // Validar consistencia con frontend
        $frontendSubtotal = (float) $request['subtotal'];
        $frontendTax = (float) $request['tax_amount'];
        $frontendTotal = (float) $request['total'];

        $backendSubtotal = round($finalSubtotal, 2);
        $backendTax = round($taxAmount, 2);
        $backendTotal = round($finalTotal, 2);

        \Log::info('Comparación frontend vs backend:', [
            'frontend' => [
                'subtotal' => $frontendSubtotal,
                'tax' => $frontendTax,
                'total' => $frontendTotal,
            ],
            'backend' => [
                'subtotal' => $backendSubtotal,
                'tax' => $backendTax,
                'total' => $backendTotal,
            ]
        ]);

        if (
            abs($frontendSubtotal - $backendSubtotal) > 0.01 ||
            abs($frontendTax - $backendTax) > 0.01 ||
            abs($frontendTotal - $backendTotal) > 0.01
        ) {

            throw ValidationException::withMessages([
                'order' => "Los cálculos no coinciden. Frontend: Subtotal=$$frontendSubtotal, Tax=$$frontendTax, Total=$$frontendTotal. Backend: Subtotal=$$backendSubtotal, Tax=$$backendTax, Total=$$backendTotal."
            ]);
        }
// dd($request['delivery_location_id']);
        // Crear orden
        $order = DB::transaction(function () use ($orderItemsData, $finalSubtotal, $taxAmount, $finalTotal, $grandTotalDiscounts, $request, $userAuth, $manualDiscountCode, $manualDiscountAmount, $shippingRateId, $totalShipping, $appliedOrderDiscount, $appliedManualDiscount, $orderTotalDiscount, $appliedGiftCard, $giftCardAmount, $giftCardId) {
            $order = Order::create([
                'status' => $request['status'],
                'payment_status' => $request['payments_method_id'] ? 'paid' : 'pending',
                'delivery_type' => $request['delivery_type'] ?? 'delivery',
                'tax_amount' => $taxAmount,
                'subtotal' => $finalSubtotal,
                'total' => $finalTotal,
                'totaldiscounts' => $grandTotalDiscounts,
                'manual_discount_code' => $manualDiscountCode,
                'manual_discount_amount' => $manualDiscountAmount,
                'delivery_location_id' => $request['delivery_location_id'],
                'payments_method_id' => $request['payments_method_id'],
                'order_origin' => $request['order_origin'],
                'user_id' => $request['user_id'],
                'company_id' => $userAuth->company_id,
                'shipping_rate_id' => $shippingRateId,
                'totalshipping' => $totalShipping,
                'gift_card_id' => $giftCardId,
                'gift_card_amount' => $giftCardAmount,
            ]);

            \Log::info('Orden creada:', ['order_id' => $order->id]);

            foreach ($orderItemsData as $itemData) {
                $order->orderItems()->create($itemData);

                if (isset($itemData['applied_discount_id'])) {
                    DiscountUsage::create([
                        'discount_id' => $itemData['applied_discount_id'],
                        'order_id' => $order->id,
                        'user_id' => $order->user_id,
                        'discount_amount' => $itemData['applied_discount_amount'],
                    ]);
                }
            }

            if ($appliedOrderDiscount) {
                DiscountUsage::create([
                    'discount_id' => $appliedOrderDiscount->id,
                    'order_id' => $order->id,
                    'user_id' => $order->user_id,
                    'discount_amount' => $orderTotalDiscount,
                ]);
            }

            if ($appliedManualDiscount && $appliedManualDiscount->applies_to === 'order_total') {
                DiscountUsage::create([
                    'discount_id' => $appliedManualDiscount->id,
                    'order_id' => $order->id,
                    'user_id' => $order->user_id,
                    'discount_amount' => $manualDiscountAmount,
                ]);
            }

            if ($appliedGiftCard) {
                $appliedGiftCard->update([
                    'current_balance' => $appliedGiftCard->current_balance - $giftCardAmount,
                ]);

                GiftCardUsage::create([
                    'gift_card_id' => $appliedGiftCard->id,
                    'order_id' => $order->id,
                    'user_id' => $order->user_id,
                    'amount_used' => $giftCardAmount,
                ]);
            }

            // Decrementar stock
            foreach ($orderItemsData as $itemData) {
                $product = Product::find($itemData['product_id']);
                if ($product) {
                    $this->decrementStock($product, $itemData['quantity'], $itemData['combination_id'] ?? null);
                }
            }

            return $order;
        });

        $redirect = redirect()->route('orders.edit', $order)->with('success', 'Orden creada con éxito.');
        if ($manualError) {
            $redirect = $redirect->with('error', $manualError);
        }
        return $redirect;
    }


    // Encontrar descuento automático aplicable con match combination_id en pivot
    private function findApplicableDiscount($product, $combinationId, $quantity, $currentSubtotal, $discounts)
    {
        $activeAutomaticDiscounts = $discounts->filter(function ($d) {
            return $d->automatic && $d->is_active &&
                (!$d->start_date || Carbon::parse($d->start_date)->lte(now())) &&
                (!$d->end_date || Carbon::parse($d->end_date)->gte(now()));
        });

        $applicable = null;
        $maxValue = 0;

        // Prioridad 1: Descuentos directos del producto (match combination_id en pivot)
        if ($product->discounts && $product->discounts->isNotEmpty()) {
            $directDiscounts = $product->discounts->filter(function ($d) use ($activeAutomaticDiscounts, $combinationId) {
                $isActiveAuto = $activeAutomaticDiscounts->contains('id', $d->id);
                if (!$isActiveAuto || $d->applies_to !== 'product') return false;

                // Match combination_id en pivot
                $pivotCombId = $d->pivot?->combination_id;
                if ($combinationId !== null) {
                    return $pivotCombId === $combinationId; // Variable: exacto
                } else {
                    return $pivotCombId === null; // Simple: null
                }
            });

            if ($directDiscounts->isNotEmpty()) {
                $applicable = $directDiscounts->sortByDesc('value')->first();
                $maxValue = $applicable->value ?? 0;
            }
        }

        // Prioridad 2: Descuentos por categoría (sin combination_id, aplica a todo el product)
        if (!$applicable && $product->categories->isNotEmpty()) {
            foreach ($product->categories as $cat) {
                if ($cat->discounts && $cat->discounts->isNotEmpty()) {
                    $catDiscounts = $cat->discounts->filter(function ($d) use ($activeAutomaticDiscounts) {
                        $isActiveAuto = $activeAutomaticDiscounts->contains('id', $d->id);
                        return $isActiveAuto && $d->applies_to === 'category';
                    });

                    if ($catDiscounts->isNotEmpty()) {
                        $bestCat = $catDiscounts->sortByDesc('value')->first();
                        if (($bestCat->value ?? 0) > $maxValue) {
                            $applicable = $bestCat;
                            $maxValue = $bestCat->value ?? 0;
                        }
                    }
                }
            }
        }

        // Validar minimum_order_amount
        if ($applicable && $applicable->minimum_order_amount && $currentSubtotal < $applicable->minimum_order_amount) {
            $applicable = null;
        }

        return $applicable;
    }

    // Calcular monto de descuento (porcentaje o fijo)
    private function calculateDiscount($discount, $price, $quantity = 1)
    {
        if (!$discount) return 0;
        $subtotal = $price * $quantity;
        if ($discount->discount_type === 'percentage') {
            return min($subtotal * ($discount->value / 100), $subtotal);
        } else {
            return ($discount->value ?? 0) * $quantity;
        }
    }

    // Descuento order_total automático
    private function calculateOrderTotalDiscount($subtotal, $discounts)
    {
        $activeOrderDiscounts = $discounts->filter(function ($d) use ($subtotal) {
            return $d->automatic && $d->applies_to === 'order_total' && $d->is_active &&
                (!$d->start_date || Carbon::parse($d->start_date)->lte(now())) &&
                (!$d->end_date || Carbon::parse($d->end_date)->gte(now())) &&
                (!$d->minimum_order_amount || $subtotal >= $d->minimum_order_amount);
        });

        $best = $activeOrderDiscounts->sortByDesc('value')->first();
        return $best ? $this->calculateDiscount($best, $subtotal, 1) : 0;
    }

    // Validar descuento (fechas, mínimo, etc.)
    private function isDiscountValid($discount, $subtotal)
    {
        return $discount->is_active &&
            (!$discount->start_date || Carbon::parse($discount->start_date)->lte(now())) &&
            (!$discount->end_date || Carbon::parse($discount->end_date)->gte(now())) &&
            (!$discount->minimum_order_amount || $subtotal >= $discount->minimum_order_amount);
    }

    // Para manual por 'product' o 'category' (match combination_id si aplica)
    private function isManualApplicableToItem($manualDiscount, $itemData, $product, $combinationId = null)
    {
        if ($manualDiscount->applies_to === 'category') {
            // Por cat: Chequea si product.categories contiene alguna de manualDiscount.categories
            return $product->categories->pluck('id')->intersect($manualDiscount->categories->pluck('id'))->isNotEmpty();
        } elseif ($manualDiscount->applies_to === 'product') {
            // Por product: Chequea si product.id en manualDiscount.products
            $isProductMatch = $manualDiscount->products->contains('id', $itemData['product_id']);
            if (!$isProductMatch) return false;

            // Si variable, match combination_id en pivot
            if ($combinationId !== null) {
                $pivotMatch = $manualDiscount->products->firstWhere('id', $itemData['product_id']);
                return $pivotMatch && $pivotMatch->pivot?->combination_id === $combinationId;
            }
            // Simple: match si pivot null
            return true;
        }
        return false;
    }

    // Obtener stock del producto por combination_id
    private function getProductStock($product, $combinationId = null)
    {
        if (!$product->stocks || $product->stocks->isEmpty()) return 0;
        $stock = $product->stocks->firstWhere('combination_id', $combinationId);
        return $stock ? (int) $stock->quantity : 0;
    }

    // Decrementar stock por combination_id
    private function decrementStock($product, $quantity, $combinationId = null)
    {
        $stock = $product->stocks->firstWhere('combination_id', $combinationId);
        if ($stock) {
            $stock->decrement('quantity', $quantity);
        }
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
        $userAuth = Auth::user();

        if ($orders->company_id !== $userAuth->company_id) {
            abort(403, 'No tienes permiso para esta operación.');
        }

        // Carga las relaciones necesarias para la orden
        $orders->load('user', 'orderItems.product.taxes', 'paymentMethod', 'deliveryLocation');

        // FIX: Carga descuentos activos (como en store, para recálculos en frontend)
        $discounts = Discount::where('is_active', true)
            ->withCount('usages')
            ->with(['products', 'categories'])
            ->get();

        // Carga todos los productos con sus stocks y combinaciones
        $products = Product::with(
            'categories',
            'media',
            'stocks',
            'taxes',
            'combinations.combinationAttributeValue.attributeValue.attribute',
            'discounts' // FIX: Carga descuentos del producto para frontend
        )
            ->get();

        // MODIFICADO: Carga usuarios con giftCards activas (igual que en create)
        $users = User::with([
            'deliveryLocations',
            'giftCards' => function ($query) {
                $query->where('is_active', true); // Solo giftcards activas
            }
        ])
            ->where('is_active', true)
            ->whereHas('roles', function ($query) {
                $query->where('name', 'client');
            })
            ->get();

        $paymentMethods = PaymentMethod::all(); // Asume modelo PaymentMethod
        $shippingRates = ShippingRate::all();  // <-- Agrega esto para pasar a la vista

        $appliedGiftCard = null;
        if ($orders->giftCardUsages->isNotEmpty()) {
            $usage = $orders->giftCardUsages->first(); // Asume una por orden
            $giftCard = $usage->giftCard; // Carga la gift card relacionada
            $appliedGiftCard = [
                'id' => $giftCard->id,
                'code' => $giftCard->code,
                'amount_used' => $usage->amount_used,
            ];
        }

        return Inertia::render('Orders/Edit', [
            'orders' => $orders,
            'appliedGiftCard' => $appliedGiftCard, // NUEVO: Pasa datos de gift card aplicada
            'shippingRates' => $shippingRates,
            'paymentMethods' => $paymentMethods,
            'products' => $products,
            'users' => $users,
            'discounts' => $discounts, // FIX: Pasa discounts para OrdersForm
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    // public function update(UpdateRequest $request, Order $orders)
    // {
    //     $userAuth = Auth::user();
    //     if ($orders->company_id !== $userAuth->company_id) {
    //         abort(403, 'No tienes permiso para esta operación.');
    //     }

    //     // FIX: Carga descuentos (como en store)
    //     $discounts = Discount::where('is_active', true)
    //         ->where(function ($query) use ($userAuth) {
    //             $query->whereNull('company_id')
    //                 ->orWhere('company_id', $userAuth->company_id);
    //         })
    //         ->with(['products:id,product_name', 'categories:id,category_name'])
    //         ->get();

    //     // Pre-calcular como en store
    //     $orderItemsData = $request['order_items'] ?? [];
    //     $totalDiscounts = 0;
    //     $subtotalPostDiscount = 0;
    //     $taxAmount = 0;
    //     $subtotalPreDiscount = 0;

    //     // FIX: Track stock changes y IDs para delete
    //     $existingItems = $orders->orderItems->keyBy('id'); // <-- Definida aquí
    //     $stockChanges = []; // [item_id => delta_quantity]
    //     $sentIds = collect(); // Para delete no enviados

    //     // Validar y recalcular descuentos por ítem (igual que store)
    //     foreach ($orderItemsData as &$itemData) {
    //         // FIX: Mapeo consistente (siempre, como store)
    //         if (isset($itemData['product_price'])) {
    //             $itemData['price_product'] = $itemData['product_price'];
    //             unset($itemData['product_price']);
    //         }

    //         $productId = $itemData['product_id'];
    //         $combinationId = $itemData['combination_id'] ?? null;
    //         $quantity = $itemData['quantity'];

    //         $product = Product::with('categories', 'discounts:id,name,discount_type,value,applies_to', 'taxes', 'stocks')
    //             ->where('company_id', $userAuth->company_id)
    //             ->find($productId);
    //         if (!$product) {
    //             throw ValidationException::withMessages(['order_items' => 'Producto no encontrado: ' . $productId]);
    //         }

    //         // FIX: Track stock change (solo si item existente)
    //         $itemId = $itemData['id'] ?? null;
    //         if ($itemId && is_numeric($itemId) && $existingItems->has($itemId)) { // <-- Usa $existingItems aquí (fuera de closure)
    //             $existingItem = $existingItems[$itemId];
    //             $deltaQuantity = $quantity - $existingItem->quantity;
    //             $stockChanges[$itemId] = $deltaQuantity; // >0: decrementa, <0: incrementa
    //             $sentIds->push($itemId);
    //         }

    //         // Validar stock actual (después de change)
    //         $currentStock = $this->getProductStock($product, $combinationId);
    //         if ($currentStock < $quantity) {
    //             $varName = $combinationId ? ' (variación ID: ' . $combinationId . ')' : '';
    //             throw ValidationException::withMessages(['order_items' => 'Stock insuficiente para: ' . $product->product_name . $varName]);
    //         }

    //         $originalPrice = $itemData['price_product'] ?? $product->product_price; // Fallback a DB si no envía
    //         $originalSubtotal = $originalPrice * $quantity;
    //         $subtotalPreDiscount += $originalSubtotal;

    //         // Encontrar descuento (preserva si discount_id ya set, sino recalcula auto)
    //         $applicableDiscount = null;
    //         if (empty($itemData['discount_id'])) { // Solo recalcula si no preservado
    //             $applicableDiscount = $this->findApplicableDiscount($product, $combinationId, $quantity, $subtotalPreDiscount, $discounts);
    //         } else {
    //             // Preserva guardado (busca por ID)
    //             $applicableDiscount = $discounts->find($itemData['discount_id']);
    //         }

    //         if ($applicableDiscount) {
    //             $discountAmountPerItem = $this->calculateDiscount($applicableDiscount, $originalPrice, $quantity);
    //             $discountedPrice = max(0, $originalPrice - ($discountAmountPerItem / $quantity));
    //             $discountedSubtotal = $originalSubtotal - $discountAmountPerItem;

    //             $itemData['discount_id'] = $applicableDiscount->id;
    //             $itemData['discount_type'] = $applicableDiscount->discount_type;
    //             $itemData['discount_amount'] = $discountAmountPerItem;
    //             $itemData['discounted_price'] = $discountedPrice;
    //             $itemData['subtotal'] = $discountedSubtotal;
    //         } else {
    //             // Respeta frontend/DB si no auto
    //             $itemData['discount_id'] = $itemData['discount_id'] ?? null;
    //             $itemData['discount_type'] = $itemData['discount_type'] ?? null;
    //             $itemData['discount_amount'] = $itemData['discount_amount'] ?? 0;
    //             $itemData['discounted_price'] = $originalPrice - (($itemData['discount_amount'] ?? 0) / $quantity);
    //             $itemData['subtotal'] = $originalSubtotal - ($itemData['discount_amount'] ?? 0);
    //         }

    //         $totalDiscounts += $itemData['discount_amount'] ?? 0;
    //         $subtotalPostDiscount += $itemData['subtotal'];

    //         // Tax post-descuento
    //         $taxRate = $product->taxes ? $product->taxes->tax_rate / 100 : 0;
    //         $itemData['tax_rate'] = $taxRate * 100;
    //         $itemData['tax_amount'] = $itemData['subtotal'] * $taxRate;
    //         $taxAmount += $itemData['tax_amount'];

    //         // FIX: Para nuevos, setea order_id (crucial para create)
    //         if (!$itemId || !is_numeric($itemId)) {
    //             $itemData['order_id'] = $orders->id; // Setea relación
    //         }
    //     }

    //     // Order total auto + manual (igual que store)
    //     $orderTotalDiscount = $this->calculateOrderTotalDiscount($subtotalPreDiscount, $discounts);
    //     $totalDiscounts += $orderTotalDiscount;

    //     $manualDiscountCode = $request['manual_discount_code'] ?? null;
    //     $manualDiscountAmount = $request['manual_discount_amount'] ?? 0;
    //     $manualError = null;
    //     if ($manualDiscountCode) {
    //         $manualDiscount = $discounts->firstWhere('code', $manualDiscountCode);
    //         if ($manualDiscount && !$manualDiscount->automatic && $manualDiscount->applies_to === 'order_total') {
    //             if ($this->isDiscountValid($manualDiscount, $subtotalPreDiscount)) {
    //                 $manualDiscountAmount = $this->calculateDiscount($manualDiscount, $subtotalPreDiscount, 1);
    //             } else {
    //                 $manualError = 'Código inválido (fechas/mínimo).';
    //             }
    //         } else {
    //             $manualError = 'Código no válido.';
    //         }
    //     }

    //     // Si manual es por 'product' o 'category', aplica a items (igual que store)
    //     if ($manualDiscountCode && isset($manualDiscount) && $manualDiscount && in_array($manualDiscount->applies_to, ['product', 'category'])) {
    //         foreach ($orderItemsData as &$itemData) {
    //             $product = Product::find($itemData['product_id']);
    //             $combinationId = $itemData['combination_id'] ?? null;
    //             if ($this->isManualApplicableToItem($manualDiscount, $itemData, $product, $combinationId)) {
    //                 $itemDiscountAmount = $this->calculateDiscount($manualDiscount, $itemData['price_product'], $itemData['quantity']);
    //                 $itemData['discount_amount'] += $itemDiscountAmount;
    //                 $itemData['subtotal'] -= $itemDiscountAmount;
    //                 $itemData['discounted_price'] = max(0, $itemData['discounted_price'] - ($itemDiscountAmount / $itemData['quantity']));
    //                 $totalDiscounts += $itemDiscountAmount;
    //                 $subtotalPostDiscount -= $itemDiscountAmount;
    //                 $itemData['tax_amount'] = $itemData['subtotal'] * ($product->taxes ? $product->taxes->tax_rate / 100 : 0);
    //             }
    //         }
    //         $manualDiscountAmount = 0;
    //         $taxAmount = collect($orderItemsData)->sum(fn($i) => $i['tax_amount']);
    //     }

    //     // NUEVO: Lógica para gift cards (similar a store)
    //     $giftCardId = $request->input('gift_card_id');
    //     $giftCardAmount = $request->input('gift_card_amount', 0);
    //     $appliedGiftCard = null;
    //     if ($giftCardId && $giftCardAmount > 0) {
    //         $giftCard = GiftCard::find($giftCardId);
    //         if (!$giftCard || !$giftCard->is_active || $giftCard->user_id !== $request->user_id || $giftCard->current_balance < $giftCardAmount || now() > $giftCard->expiration_date) {
    //             throw ValidationException::withMessages(['gift_card' => 'Giftcard inválida o insuficiente.']);
    //         }
    //         $appliedGiftCard = $giftCard;
    //     }

    //     $shippingRateId = $request->input('shipping_rate_id');
    //     $totalShipping = 0;
    //     if ($shippingRateId) {
    //         $shippingRate = ShippingRate::find($shippingRateId);
    //         if ($shippingRate) {
    //             $totalShipping = $shippingRate->price;
    //         }
    //     }

    //     $finalSubtotal = $subtotalPostDiscount;
    //     $finalTotal = $finalSubtotal + $taxAmount - $orderTotalDiscount - $manualDiscountAmount - $giftCardAmount + $totalShipping;  // NUEVO: Resta giftCardAmount
    //     $grandTotalDiscounts = $totalDiscounts + $manualDiscountAmount + $giftCardAmount;  // NUEVO: Incluye giftCardAmount en totaldiscounts

    //     // Update con transacción – FIX: Agrega $existingItems y $sentIds en use()
    //     $orders = DB::transaction(function () use ($orderItemsData, $finalSubtotal, $shippingRateId, $totalShipping, $taxAmount, $finalTotal, $grandTotalDiscounts, $request, $orders, $stockChanges, $sentIds, $existingItems, $manualDiscountCode, $manualDiscountAmount, $appliedGiftCard, $giftCardAmount, $giftCardId) { // NUEVO: Agrega appliedGiftCard, giftCardAmount, giftCardId
    //         try {
    //             // Update orden principal
    //             $orders->update([
    //                 'status' => $request['status'],
    //                 'payment_status' => $request['payments_method_id'] ? 'paid' : 'pending',
    //                 'delivery_type' => $request['delivery_type'],
    //                 'tax_amount' => $taxAmount,
    //                 'total' => $finalTotal,
    //                 'subtotal' => $finalSubtotal,
    //                 'totaldiscounts' => $grandTotalDiscounts,
    //                 'manual_discount_code' => $manualDiscountCode,
    //                 'manual_discount_amount' => $manualDiscountAmount,
    //                 'payments_method_id' => $request['payments_method_id'],
    //                 'user_id' => $request['user_id'] ?? $orders->user_id,
    //                 'delivery_location_id' => $request['delivery_location_id'],
    //                 'shipping_rate_id' => $shippingRateId,
    //                 'totalshipping' => $totalShipping,
    //             ]);
    //             Log::info('Order updated: ID=' . $orders->id . ', total=' . $finalTotal); // Debug

    //             // FIX: Lógica separada para update vs create (resuelve no guardar nuevos)
    //             foreach ($orderItemsData as $itemData) {
    //                 $itemId = $itemData['id'] ?? null;
    //                 if ($itemId && is_numeric($itemId) && $existingItems->has($itemId)) { // <-- Ahora $existingItems disponible
    //                     // Update existente
    //                     $orderItem = $orders->orderItems()->find($itemId);
    //                     if ($orderItem) {
    //                         $orderItem->update($itemData); // Usa recalculado
    //                         Log::info("Updated item ID {$itemId}: quantity={$itemData['quantity']}, subtotal={$itemData['subtotal']}"); // Debug
    //                     }
    //                 } else {
    //                     // Create nuevo (sin ID)
    //                     $newItem = $orders->orderItems()->create($itemData); // order_id ya seteado arriba
    //                     Log::info("Created new item ID {$newItem->id}: product_id={$itemData['product_id']}, subtotal={$itemData['subtotal']}"); // Debug
    //                 }
    //             }

    //             // FIX: Delete items no enviados (si frontend quita rows) – Usa $sentIds y $existingItems
    //             $dbIds = $existingItems->keys(); // IDs de DB
    //             $toDelete = $dbIds->diff($sentIds); // Diferencia: no enviados
    //             if ($toDelete->isNotEmpty()) {
    //                 $orders->orderItems()->whereIn('id', $toDelete)->delete();
    //                 Log::info('Deleted items: ' . $toDelete->implode(', ')); // Debug
    //                 // Opcional: Incrementa stock para deleted
    //                 // $deleted = OrderItem::whereIn('id', $toDelete)->get();
    //                 // foreach ($deleted as $del) { $this->incrementStock($del->product, $del->quantity, $del->combination_id); }
    //             }

    //             // FIX: Manejo stock changes (después de updates/creates) – Usa $stockChanges y $existingItems
    //             foreach ($stockChanges as $itemId => $delta) {
    //                 if ($delta !== 0) {
    //                     $item = $existingItems->get($itemId); // Usa $existingItems (disponible ahora)
    //                     if ($item) {
    //                         $product = $item->product;
    //                         $combinationId = $item->combination_id;
    //                         if ($delta > 0) {
    //                             // Quantity subió: decrementa diferencia
    //                             $this->decrementStock($product, $delta, $combinationId);
    //                         } else {
    //                             // Quantity bajó: incrementa diferencia (libera stock)
    //                             $stock = $product->stocks->firstWhere('combination_id', $combinationId);
    //                             if ($stock) {
    //                                 $stock->increment('quantity', abs($delta));
    //                             }
    //                         }
    //                         Log::info("Stock adjusted for item {$itemId}: delta={$delta}"); // Debug
    //                     }
    //                 }
    //             }

    //             // Para nuevos: Decrementa stock full quantity
    //             foreach ($orderItemsData as $itemData) {
    //                 if (!($itemData['id'] ?? null) || !is_numeric($itemData['id'])) { // Nuevo
    //                     $product = Product::find($itemData['product_id']);
    //                     if ($product) {
    //                         $this->decrementStock($product, $itemData['quantity'], $itemData['combination_id'] ?? null);
    //                         Log::info("Stock decremented for new item: product_id={$itemData['product_id']}, quantity={$itemData['quantity']}"); // Debug
    //                     }
    //                 }
    //             }

    //             // NUEVO: Manejo de gift card
    //             if ($appliedGiftCard) {
    //                 // Si había una gift card anterior, revierte su balance
    //                 $previousUsage = $orders->giftCardUsages->first();
    //                 if ($previousUsage && $previousUsage->gift_card_id !== $giftCardId) {
    //                     $previousGiftCard = $previousUsage->giftCard;
    //                     $previousGiftCard->update([
    //                         'current_balance' => $previousGiftCard->current_balance + $previousUsage->amount_used,
    //                     ]);
    //                     $previousUsage->delete(); // Elimina uso anterior
    //                 }

    //                 // Aplica nueva gift card
    //                 $appliedGiftCard->update([
    //                     'current_balance' => $appliedGiftCard->current_balance - $giftCardAmount,
    //                 ]);

    //                 // Crea o actualiza GiftCardUsage
    //                 GiftCardUsage::updateOrCreate(
    //                     ['order_id' => $orders->id],
    //                     [
    //                         'gift_card_id' => $giftCardId,
    //                         'amount_used' => $giftCardAmount,
    //                     ]
    //                 );
    //             } else {
    //                 // Si no hay gift card nueva, revierte cualquier anterior
    //                 $previousUsage = $orders->giftCardUsages->first();
    //                 if ($previousUsage) {
    //                     $previousGiftCard = $previousUsage->giftCard;
    //                     $previousGiftCard->update([
    //                         'current_balance' => $previousGiftCard->current_balance + $previousUsage->amount_used,
    //                     ]);
    //                     $previousUsage->delete();
    //                 }
    //             }

    //             return $orders->fresh(['orderItems.product', 'giftCardUsages']); // NUEVO: Recarga con giftCardUsages
    //         } catch (\Exception $e) {
    //             Log::error('Error in update transaction: ' . $e->getMessage()); // Debug error
    //             throw $e; // Re-throw para rollback
    //         }
    //     });

    //     // $redirect = redirect()->route('orders.edit', $orders)->with('success', 'Orden actualizada con éxito.');
    //     // if ($manualError) {
    //     //     $redirect = $redirect->with('error', $manualError);
    //     // }
    //     return redirect()->route('orders.edit', $orders)->with('success', 'Orden actualizada con éxito.');
    // }

    public function update(UpdateRequest $request, Order $orders)
    {
        $userAuth = Auth::user();
        if ($orders->company_id !== $userAuth->company_id) {
            abort(403, 'No tienes permiso para esta operación.');
        }

        // FIX: Carga descuentos (como en store)
        $discounts = Discount::where('is_active', true)
            ->where(function ($query) use ($userAuth) {
                $query->whereNull('company_id')
                    ->orWhere('company_id', $userAuth->company_id);
            })
            ->with(['products:id,product_name', 'categories:id,category_name'])
            ->get();

        // Pre-calcular como en store
        $orderItemsData = $request['order_items'] ?? [];
        $totalDiscounts = 0;
        $subtotalPostDiscount = 0;
        $taxAmount = 0;
        $subtotalPreDiscount = 0;

        // FIX: Track stock changes y IDs para delete
        $existingItems = $orders->orderItems->keyBy('id'); // <-- Definida aquí
        $stockChanges = []; // [item_id => delta_quantity]
        $sentIds = collect(); // Para delete no enviados

        // Validar y recalcular descuentos por ítem (igual que store)
        foreach ($orderItemsData as &$itemData) {
            // FIX: Mapeo consistente (siempre, como store)
            if (isset($itemData['product_price'])) {
                $itemData['price_product'] = $itemData['product_price'];
                unset($itemData['product_price']);
            }

            $productId = $itemData['product_id'];
            $combinationId = $itemData['combination_id'] ?? null;
            $quantity = $itemData['quantity'];

            // CORRECCIÓN: Cargar combinaciones como en store
            $product = Product::with([
                'categories',
                'discounts:id,name,discount_type,value,applies_to',
                'taxes',
                'stocks',
                'combinations' // Añadido para manejar combinaciones
            ])
                ->where('company_id', $userAuth->company_id)
                ->find($productId);

            if (!$product) {
                throw ValidationException::withMessages(['order_items' => 'Producto no encontrado: ' . $productId]);
            }

            // FIX: Track stock change (solo si item existente)
            $itemId = $itemData['id'] ?? null;
            if ($itemId && is_numeric($itemId) && $existingItems->has($itemId)) { // <-- Usa $existingItems aquí (fuera de closure)
                $existingItem = $existingItems[$itemId];
                $deltaQuantity = $quantity - $existingItem->quantity;
                $stockChanges[$itemId] = $deltaQuantity; // >0: decrementa, <0: incrementa
                $sentIds->push($itemId);
            }

            // **CORRECCIÓN IMPORTANTE: Determinar el precio base correcto (igual que en store)**
            $productOriginalPrice = (float) $product->product_price;
            $productDiscountedPrice = $product->product_price_discount && $product->product_price_discount > 0
                ? (float) $product->product_price_discount
                : $productOriginalPrice;

            $hasDirectDiscount = false;
            $directDiscountAmount = 0;

            // CORRECCIÓN: Para productos CON combinación, usar el precio de la combinación
            if ($combinationId && $product->combinations) {
                $combination = $product->combinations->firstWhere('id', $combinationId);
                if ($combination) {
                    $productOriginalPrice = (float) $combination->combination_price;
                    $productDiscountedPrice = $productOriginalPrice; // Las combinaciones no tienen descuento directo

                    Log::info('Usando precio de combinación en update:', [
                        'combination_id' => $combinationId,
                        'price' => $productOriginalPrice
                    ]);
                }
            } elseif (is_null($combinationId) && $product->product_price_discount && $product->product_price_discount > 0) {
                // Solo productos simples sin combinación pueden tener descuento directo
                $hasDirectDiscount = true;
                $directDiscountAmount = ($productOriginalPrice - $productDiscountedPrice) * $quantity;

                Log::info('Descuento directo aplicado en update:', [
                    'original' => $productOriginalPrice,
                    'discounted' => $productDiscountedPrice,
                    'amount' => $directDiscountAmount
                ]);
            }

            $basePrice = $productOriginalPrice;
            $effectivePrice = $productDiscountedPrice;

            // **IMPORTANTE: Actualizar el price_product con el precio original**
            $itemData['price_product'] = $basePrice; // Guarda el precio original

            $originalSubtotal = $effectivePrice * $quantity; // Usa el precio con descuento directo para cálculos
            $subtotalPreDiscount += $originalSubtotal;

            // Validar stock actual (después de change)
            $currentStock = $this->getProductStock($product, $combinationId);
            if ($currentStock < $quantity) {
                $varName = $combinationId ? ' (variación ID: ' . $combinationId . ')' : '';
                throw ValidationException::withMessages(['order_items' => 'Stock insuficiente para: ' . $product->product_name . $varName]);
            }

            // MODIFICADO: Solo buscar/aplicar descuento automático si NO hay manual_discount_id (evita duplicación)
            $isManualItem = isset($itemData['manual_discount_id']) && $itemData['manual_discount_id'];

            if (!$isManualItem) {
                // Encontrar descuento automático aplicable con match combination_id
                $applicableDiscount = $this->findApplicableDiscount($product, $combinationId, $quantity, $subtotalPreDiscount, $discounts);

                if ($applicableDiscount) {
                    // **NUEVO: Validar usage_limit antes de aplicar**
                    if ($applicableDiscount->usage_limit && $applicableDiscount->usages()->count() >= $applicableDiscount->usage_limit) {
                        throw ValidationException::withMessages(['order_items' => 'Descuento automático agotado para: ' . $product->product_name]);
                    }

                    // **CORRECCIÓN: Calcular descuento automático sobre el precio con descuento directo (si aplica)**
                    $discountAmountPerItem = $this->calculateDiscount($applicableDiscount, $effectivePrice, $quantity);
                    $totalDiscountForItem = $directDiscountAmount + $discountAmountPerItem;

                    $discountedPrice = max(0, $effectivePrice - ($discountAmountPerItem / $quantity));
                    $discountedSubtotal = $originalSubtotal - $discountAmountPerItem;

                    $itemData['discount_id'] = $applicableDiscount->id;
                    $itemData['discount_type'] = $applicableDiscount->discount_type;
                    $itemData['discount_amount'] = $totalDiscountForItem; // Incluye descuento directo + automático
                    $itemData['discounted_price'] = $discountedPrice;
                    $itemData['subtotal'] = $discountedSubtotal;

                    $totalDiscounts += $totalDiscountForItem;
                    $subtotalPostDiscount += $discountedSubtotal;

                    // **NUEVO: Marca descuento aplicado para registrar uso**
                    $itemData['applied_discount_id'] = $applicableDiscount->id;
                    $itemData['applied_discount_amount'] = $discountAmountPerItem;
                } else {
                    // No hay descuento automático, solo descuento directo (si aplica)
                    $itemData['discount_id'] = null;
                    $itemData['discount_type'] = null;
                    $itemData['discount_amount'] = $directDiscountAmount; // Solo descuento directo
                    $itemData['discounted_price'] = $effectivePrice;
                    $itemData['subtotal'] = $originalSubtotal;

                    $totalDiscounts += $directDiscountAmount;
                    $subtotalPostDiscount += $originalSubtotal;
                }
            } else {
                // MODIFICADO: Respeta valores manuales del frontend (valida consistencia básica, no recalcula)
                $manualDiscount = $discounts->find($itemData['manual_discount_id']);
                if (!$manualDiscount || $manualDiscount->automatic) {
                    throw ValidationException::withMessages(['order_items' => 'Descuento manual inválido para ítem: ' . $product->product_name]);
                }
                if ($manualDiscount->usage_limit && $manualDiscount->usages()->count() >= $manualDiscount->usage_limit) {
                    throw ValidationException::withMessages(['order_items' => 'Descuento manual agotado para ítem: ' . $product->product_name]);
                }

                // **CORRECCIÓN: El descuento manual se calcula sobre el precio con descuento directo**
                $expectedSubtotal = ($effectivePrice * $quantity) - $itemData['discount_amount'];
                if (abs($itemData['subtotal'] - $expectedSubtotal) > 0.01) { // Tolerancia para floats
                    throw ValidationException::withMessages(['order_items' => 'Valores de descuento inconsistentes para ítem: ' . $product->product_name]);
                }

                // **CORRECCIÓN: El totalDiscount incluye descuento directo + descuento manual**
                $totalDiscountForItem = $directDiscountAmount + $itemData['discount_amount'];

                $totalDiscounts += $totalDiscountForItem;
                $subtotalPostDiscount += $itemData['subtotal'];

                // **CORRECCIÓN: Actualizar el discount_amount en itemData para incluir descuento directo**
                $itemData['discount_amount'] = $totalDiscountForItem;

                // Marca para registro de uso (solo el descuento manual)
                $itemData['applied_discount_id'] = $manualDiscount->id;
                $itemData['applied_discount_amount'] = $itemData['discount_amount'];
            }

            // **CORRECCIÓN IMPORTANTE: Recalcular tax_amount DESPUÉS de determinar el subtotal final**
            $taxRate = $product->taxes ? $product->taxes->tax_rate / 100 : 0;
            // $itemData['subtotal'] ya es el subtotal después de descuentos
            $itemData['tax_amount'] = $itemData['subtotal'] * $taxRate;
            $itemData['tax_rate'] = $taxRate * 100; // Guardar como porcentaje
            $taxAmount += $itemData['tax_amount'];

            // FIX: Para nuevos, setea order_id (crucial para create)
            if (!$itemId || !is_numeric($itemId)) {
                $itemData['order_id'] = $orders->id; // Setea relación
            }
        }

        // Order total auto + manual (igual que store)
        $orderTotalDiscount = $this->calculateOrderTotalDiscount($subtotalPostDiscount, $discounts);
        $appliedOrderDiscount = null;
        if ($orderTotalDiscount > 0) {
            $appliedOrderDiscount = $discounts->where('applies_to', 'order_total')->where('automatic', true)->first();
            if ($appliedOrderDiscount && $appliedOrderDiscount->usage_limit && $appliedOrderDiscount->usages()->count() >= $appliedOrderDiscount->usage_limit) {
                throw ValidationException::withMessages(['order_items' => 'Descuento automático global agotado.']);
            }
        }
        $totalDiscounts += $orderTotalDiscount;

        $manualDiscountCode = $request['manual_discount_code'] ?? null;
        $manualDiscountAmount = $request['manual_discount_amount'] ?? 0;
        $manualError = null;
        if ($manualDiscountCode) {
            $manualDiscount = $discounts->firstWhere('code', $manualDiscountCode);
            if ($manualDiscount && !$manualDiscount->automatic && $manualDiscount->applies_to === 'order_total') {
                if ($this->isDiscountValid($manualDiscount, $subtotalPreDiscount)) {
                    $manualDiscountAmount = $this->calculateDiscount($manualDiscount, $subtotalPostDiscount, 1);
                } else {
                    $manualError = 'Código inválido (fechas/mínimo).';
                }
            } else {
                $manualError = 'Código no válido.';
            }
        }

        // Si manual es por 'product' o 'category', aplica a items (igual que store)
        if ($manualDiscountCode && isset($manualDiscount) && $manualDiscount && in_array($manualDiscount->applies_to, ['product', 'category'])) {
            foreach ($orderItemsData as &$itemData) {
                $product = Product::find($itemData['product_id']);
                $combinationId = $itemData['combination_id'] ?? null;
                if ($this->isManualApplicableToItem($manualDiscount, $itemData, $product, $combinationId)) {
                    // **CORRECCIÓN: Calcular descuento manual sobre el precio efectivo (con descuento directo si aplica)**
                    $effectivePrice = $itemData['discounted_price']; // Precio actual del ítem
                    $itemManualDiscountAmount = $this->calculateDiscount($manualDiscount, $effectivePrice, $itemData['quantity']);

                    // Sumar al descuento existente
                    $itemData['discount_amount'] += $itemManualDiscountAmount;
                    $itemData['subtotal'] -= $itemManualDiscountAmount;
                    $itemData['discounted_price'] = max(0, $itemData['discounted_price'] - ($itemManualDiscountAmount / $itemData['quantity']));
                    $totalDiscounts += $itemManualDiscountAmount;
                    $subtotalPostDiscount -= $itemManualDiscountAmount;

                    // **CORRECCIÓN: Recalcular impuesto para este ítem después de aplicar el descuento manual**
                    $taxRate = $product->taxes ? $product->taxes->tax_rate / 100 : 0;
                    $itemData['tax_amount'] = $itemData['subtotal'] * $taxRate;
                }
            }
            $manualDiscountAmount = 0;
            $taxAmount = collect($orderItemsData)->sum(fn($i) => $i['tax_amount']);
        }

        // NUEVO: Lógica para gift cards (similar a store)
        $giftCardId = $request->input('gift_card_id');
        $giftCardAmount = $request->input('gift_card_amount', 0);
        $appliedGiftCard = null;
        if ($giftCardId && $giftCardAmount > 0) {
            $giftCard = GiftCard::find($giftCardId);
            if (!$giftCard || !$giftCard->is_active || $giftCard->user_id !== $request->user_id || $giftCard->current_balance < $giftCardAmount || now() > $giftCard->expiration_date) {
                throw ValidationException::withMessages(['gift_card' => 'Giftcard inválida o insuficiente.']);
            }
            $appliedGiftCard = $giftCard;
        }

        $shippingRateId = $request->input('shipping_rate_id');
        $totalShipping = 0;
        if ($shippingRateId) {
            $shippingRate = ShippingRate::find($shippingRateId);
            if ($shippingRate) {
                $totalShipping = $shippingRate->price;
            }
        }

        $finalSubtotal = $subtotalPostDiscount;
        $finalTotal = $finalSubtotal + $taxAmount - $orderTotalDiscount - $manualDiscountAmount - $giftCardAmount + $totalShipping;  // NUEVO: Resta giftCardAmount
        $grandTotalDiscounts = $totalDiscounts + $manualDiscountAmount + $giftCardAmount;  // NUEVO: Incluye giftCardAmount en totaldiscounts

        // Update con transacción – FIX: Agrega $existingItems y $sentIds en use()
        $orders = DB::transaction(function () use ($orderItemsData, $finalSubtotal, $shippingRateId, $totalShipping, $taxAmount, $finalTotal, $grandTotalDiscounts, $request, $orders, $stockChanges, $sentIds, $existingItems, $manualDiscountCode, $manualDiscountAmount, $appliedGiftCard, $giftCardAmount, $giftCardId, $orderTotalDiscount, $appliedOrderDiscount) {
            try {
                // Update orden principal
                $orders->update([
                    'status' => $request['status'],
                    'payment_status' => $request['payments_method_id'] ? 'paid' : 'pending',
                    'delivery_type' => $request['delivery_type'],
                    'tax_amount' => $taxAmount,
                    'total' => $finalTotal,
                    'subtotal' => $finalSubtotal,
                    'totaldiscounts' => $grandTotalDiscounts,
                    'manual_discount_code' => $manualDiscountCode,
                    'manual_discount_amount' => $manualDiscountAmount,
                    'payments_method_id' => $request['payments_method_id'],
                    'user_id' => $request['user_id'] ?? $orders->user_id,
                    'delivery_location_id' => $request['delivery_location_id'],
                    'shipping_rate_id' => $shippingRateId,
                    'totalshipping' => $totalShipping,
                    'gift_card_id' => $giftCardId,
                    'gift_card_amount' => $giftCardAmount,
                ]);
                Log::info('Order updated: ID=' . $orders->id . ', total=' . $finalTotal); // Debug

                // FIX: Lógica separada para update vs create (resuelve no guardar nuevos)
                foreach ($orderItemsData as $itemData) {
                    $itemId = $itemData['id'] ?? null;
                    if ($itemId && is_numeric($itemId) && $existingItems->has($itemId)) { // <-- Ahora $existingItems disponible
                        // Update existente
                        $orderItem = $orders->orderItems()->find($itemId);
                        if ($orderItem) {
                            $orderItem->update($itemData); // Usa recalculado
                            Log::info("Updated item ID {$itemId}: quantity={$itemData['quantity']}, subtotal={$itemData['subtotal']}"); // Debug

                            // **NUEVO: Registrar uso por ítem si hay descuento aplicado (similar a store)**
                            if (isset($itemData['applied_discount_id'])) {
                                // Eliminar usos anteriores para este ítem
                                DiscountUsage::where('order_id', $orders->id)
                                    ->where('discount_id', $itemData['applied_discount_id'])
                                    ->delete();

                                // Crear nuevo uso
                                DiscountUsage::create([
                                    'discount_id' => $itemData['applied_discount_id'],
                                    'order_id' => $orders->id,
                                    'user_id' => $orders->user_id,
                                    'discount_amount' => $itemData['applied_discount_amount'],
                                ]);
                            }
                        }
                    } else {
                        // Create nuevo (sin ID)
                        $newItem = $orders->orderItems()->create($itemData); // order_id ya seteado arriba
                        Log::info("Created new item ID {$newItem->id}: product_id={$itemData['product_id']}, subtotal={$itemData['subtotal']}"); // Debug

                        // **NUEVO: Registrar uso por ítem si hay descuento aplicado**
                        if (isset($itemData['applied_discount_id'])) {
                            DiscountUsage::create([
                                'discount_id' => $itemData['applied_discount_id'],
                                'order_id' => $orders->id,
                                'user_id' => $orders->user_id,
                                'discount_amount' => $itemData['applied_discount_amount'],
                            ]);
                        }
                    }
                }

                // **NUEVO: Registrar uso para descuento global automático**
                if ($appliedOrderDiscount) {
                    // Eliminar usos anteriores para este descuento global
                    DiscountUsage::where('order_id', $orders->id)
                        ->where('discount_id', $appliedOrderDiscount->id)
                        ->delete();

                    DiscountUsage::create([
                        'discount_id' => $appliedOrderDiscount->id,
                        'order_id' => $orders->id,
                        'user_id' => $orders->user_id,
                        'discount_amount' => $orderTotalDiscount,
                    ]);
                }

                // FIX: Delete items no enviados (si frontend quita rows) – Usa $sentIds y $existingItems
                $dbIds = $existingItems->keys(); // IDs de DB
                $toDelete = $dbIds->diff($sentIds); // Diferencia: no enviados
                if ($toDelete->isNotEmpty()) {
                    // Incrementar stock para items eliminados
                    foreach ($toDelete as $deleteId) {
                        $item = $existingItems->get($deleteId);
                        if ($item) {
                            $product = Product::find($item->product_id);
                            if ($product) {
                                $this->incrementStock($product, $item->quantity, $item->combination_id);
                                Log::info("Stock incremented for deleted item {$deleteId}: product_id={$item->product_id}, quantity={$item->quantity}");
                            }
                        }
                    }

                    $orders->orderItems()->whereIn('id', $toDelete)->delete();
                    Log::info('Deleted items: ' . $toDelete->implode(', ')); // Debug
                }

                // FIX: Manejo stock changes (después de updates/creates) – Usa $stockChanges y $existingItems
                foreach ($stockChanges as $itemId => $delta) {
                    if ($delta !== 0) {
                        $item = $existingItems->get($itemId); // Usa $existingItems (disponible ahora)
                        if ($item) {
                            $product = $item->product;
                            $combinationId = $item->combination_id;
                            if ($delta > 0) {
                                // Quantity subió: decrementa diferencia
                                $this->decrementStock($product, $delta, $combinationId);
                                Log::info("Stock decremented for item {$itemId}: delta={$delta}");
                            } else {
                                // Quantity bajó: incrementa diferencia (libera stock)
                                $this->incrementStock($product, abs($delta), $combinationId);
                                Log::info("Stock incremented for item {$itemId}: delta={$delta}");
                            }
                        }
                    }
                }

                // Para nuevos: Decrementa stock full quantity
                foreach ($orderItemsData as $itemData) {
                    if (!($itemData['id'] ?? null) || !is_numeric($itemData['id'])) { // Nuevo
                        $product = Product::find($itemData['product_id']);
                        if ($product) {
                            $this->decrementStock($product, $itemData['quantity'], $itemData['combination_id'] ?? null);
                            Log::info("Stock decremented for new item: product_id={$itemData['product_id']}, quantity={$itemData['quantity']}"); // Debug
                        }
                    }
                }

                // NUEVO: Manejo de gift card
                if ($appliedGiftCard) {
                    // Si había una gift card anterior, revierte su balance
                    $previousUsage = $orders->giftCardUsages->first();
                    if ($previousUsage && $previousUsage->gift_card_id !== $giftCardId) {
                        $previousGiftCard = $previousUsage->giftCard;
                        $previousGiftCard->update([
                            'current_balance' => $previousGiftCard->current_balance + $previousUsage->amount_used,
                        ]);
                        $previousUsage->delete(); // Elimina uso anterior
                    }

                    // Aplica nueva gift card
                    $appliedGiftCard->update([
                        'current_balance' => $appliedGiftCard->current_balance - $giftCardAmount,
                    ]);

                    // Crea o actualiza GiftCardUsage
                    GiftCardUsage::updateOrCreate(
                        ['order_id' => $orders->id],
                        [
                            'gift_card_id' => $giftCardId,
                            'amount_used' => $giftCardAmount,
                        ]
                    );
                } else {
                    // Si no hay gift card nueva, revierte cualquier anterior
                    $previousUsage = $orders->giftCardUsages->first();
                    if ($previousUsage) {
                        $previousGiftCard = $previousUsage->giftCard;
                        $previousGiftCard->update([
                            'current_balance' => $previousGiftCard->current_balance + $previousUsage->amount_used,
                        ]);
                        $previousUsage->delete();
                    }
                }

                return $orders->fresh(['orderItems.product', 'giftCardUsages']); // NUEVO: Recarga con giftCardUsages
            } catch (\Exception $e) {
                Log::error('Error in update transaction: ' . $e->getMessage()); // Debug error
                throw $e; // Re-throw para rollback
            }
        });

        // $redirect = redirect()->route('orders.edit', $orders)->with('success', 'Orden actualizada con éxito.');
        // if ($manualError) {
        //     $redirect = $redirect->with('error', $manualError);
        // }
        return redirect()->route('orders.edit', $orders)->with('success', 'Orden actualizada con éxito.');
    }

    // Añade este método auxiliar si no lo tienes
    private function incrementStock($product, $quantity, $combinationId = null)
    {
        $stock = $product->stocks->firstWhere('combination_id', $combinationId);
        if ($stock) {
            $stock->increment('quantity', $quantity);
        }
    }

    public function changeStatus(Request $request, Order $order)
    {
        // Validar el status entrante (agrega 'delivered' y 'completed')
        $request->validate([
            'status' => 'required|in:processing,shipped,delivered,completed,cancelled',
        ]);

        // Verificar permisos
        $userAuth = Auth::user();
        if ($order->company_id !== $userAuth->company_id) {
            abort(403, 'No tienes permiso para esta operación.');
        }

        $newStatus = $request->input('status');
        $currentStatus = $order->status;

        // Validaciones de flujo de status (agrega para 'delivered' y 'completed')
        if ($newStatus === 'processing' && $currentStatus !== 'pending') {
            return response()->json(['error' => 'Solo puedes cambiar a processing desde pending.'], 400);
        }
        if ($newStatus === 'shipped' && $currentStatus !== 'processing') {
            return response()->json(['error' => 'Solo puedes cambiar a shipped desde processing.'], 400);
        }
        if ($newStatus === 'delivered' && $currentStatus !== 'shipped') {
            return response()->json(['error' => 'Solo puedes cambiar a delivered desde shipped.'], 400);
        }
        if ($newStatus === 'completed' && $currentStatus !== 'delivered') {
            return response()->json(['error' => 'Solo puedes cambiar a completed desde delivered.'], 400);
        }
        if ($newStatus === 'cancelled' && in_array($currentStatus, ['refunded'])) {
            return response()->json(['error' => 'No puedes cancelar una orden refunded.'], 400);
        }

        // Actualizar el status
        $order->update(['status' => $newStatus]);

        // return redirect()->back()->with('success', 'Estado de la orden actualizado a ' . $newStatus . '.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
