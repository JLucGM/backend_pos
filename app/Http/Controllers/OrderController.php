<?php

namespace App\Http\Controllers;

use App\Http\Requests\Orders\StoreRequest;
use App\Http\Requests\Orders\UpdateRequest;
use App\Models\Discount;
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

        // dd($orders);
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

        $paymentMethods = PaymentMethod::all();
        $users = User::with('deliveryLocations')->where('company_id', $userAuth->company_id)->where('is_active', true)->get();

        // Cargar TODOS los productos con relaciones completas (sin límites – como original)
        $products = Product::with(
            'categories', // Completo: todos los campos de categories
            'combinations', // Completo: todas combinations con precios
            'media', // Completo: todas las medias
            'stocks', // Completo: todos los stocks por combination_id
            'taxes', // Completo: todos los taxes
            'combinations.combinationAttributeValue.attributeValue.attribute', // Anidado completo para labels de variaciones
            'discounts' // Completo: descuentos con pivot full (combination_id)
        )
            // ->where('company_id', $userAuth->company_id)
            ->get(); // Filtrar por compañía – TODOS los productos de la compañía van

        // Cargar TODOS los descuentos activos (con relaciones completas, filtrado por compañía)
        $discounts = Discount::with([
            'products', // Completo: todos los products relacionados (con pivot combination_id)
            'categories' // Completo: todas las categories
        ])
            // ->where('company_id', $userAuth->company_id) // Filtrar por compañía (agrega consistencia; remueve si no quieres)
            ->active() // Scope: is_active=true, fechas válidas
            ->get(); // TODOS los descuentos activos van

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

        // Cargar descuentos activos (automáticos y manuales) - Filtra por company_id si multi-tenant
        $discounts = Discount::where('is_active', true)
            ->where(function ($query) use ($userAuth) {
                $query->whereNull('company_id')
                    ->orWhere('company_id', $userAuth->company_id);
            })
            ->with(['products:id,product_name', 'categories:id,category_name']) // Limita para perf, incluye pivot si modelo tiene withPivot
            ->get();

        // Pre-calcular descuentos y totales (basado en order_items del request)
        $orderItemsData = $request['order_items'] ?? [];
        $totalDiscounts = 0;
        $subtotalPostDiscount = 0;
        $taxAmount = 0;
        $subtotalPreDiscount = 0;

        // Validar y recalcular descuentos por ítem (automáticos + respeta manuales del frontend)
        foreach ($orderItemsData as &$itemData) {
            // Mapeo de campos para coincidir con modelo OrderItem
            if (isset($itemData['product_price'])) {
                $itemData['price_product'] = $itemData['product_price'];
                unset($itemData['product_price']);
            }

            $productId = $itemData['product_id'];
            $combinationId = $itemData['combination_id'] ?? null; // Para variables
            $quantity = $itemData['quantity'];

            $product = Product::with('categories', 'discounts:id,name,discount_type,value,applies_to', 'taxes', 'stocks')
                ->where('company_id', $userAuth->company_id)
                ->find($productId);
            if (!$product) {
                throw ValidationException::withMessages(['order_items' => 'Producto no encontrado: ' . $productId]);
            }

            // Validar stock por combination_id
            $stock = $this->getProductStock($product, $combinationId);
            if ($stock < $quantity) {
                $varName = $combinationId ? ' (variación ID: ' . $combinationId . ')' : '';
                throw ValidationException::withMessages(['order_items' => 'Stock insuficiente para: ' . $product->product_name . $varName]);
            }

            $originalPrice = $itemData['price_product']; // De frontend (combination o base)
            $originalSubtotal = $originalPrice * $quantity;
            $subtotalPreDiscount += $originalSubtotal;

            // Encontrar descuento automático aplicable con match combination_id
            $applicableDiscount = $this->findApplicableDiscount($product, $combinationId, $quantity, $subtotalPreDiscount, $discounts);

            if ($applicableDiscount) {
                $discountAmountPerItem = $this->calculateDiscount($applicableDiscount, $originalPrice, $quantity);
                $discountedPrice = max(0, $originalPrice - ($discountAmountPerItem / $quantity));
                $discountedSubtotal = $originalSubtotal - $discountAmountPerItem;

                $itemData['discount_id'] = $applicableDiscount->id;
                $itemData['discount_type'] = $applicableDiscount->discount_type;
                $itemData['discount_amount'] = $discountAmountPerItem;
                $itemData['discounted_price'] = $discountedPrice;
                $itemData['subtotal'] = $discountedSubtotal;
                // Guarda detalles si frontend envía (atributos para variables)
                $itemData['product_details'] = $itemData['product_details'] ?? null;

                $totalDiscounts += $discountAmountPerItem;
                $subtotalPostDiscount += $discountedSubtotal;
            } else {
                // Respeta manual/frontend si no auto
                $itemData['discount_id'] = $itemData['discount_id'] ?? null;
                $itemData['discount_type'] = $itemData['discount_type'] ?? null;
                $itemData['discount_amount'] = $itemData['discount_amount'] ?? 0;
                $itemData['discounted_price'] = $originalPrice - (($itemData['discount_amount'] ?? 0) / $quantity);
                $itemData['subtotal'] = $originalSubtotal - ($itemData['discount_amount'] ?? 0);
                $totalDiscounts += $itemData['discount_amount'] ?? 0;
                $subtotalPostDiscount += $itemData['subtotal'];
            }

            // Recalcular tax_amount post-descuento
            $taxRate = $product->taxes ? $product->taxes->tax_rate / 100 : 0;
            $itemData['tax_amount'] = $itemData['subtotal'] * $taxRate;
            $taxAmount += $itemData['tax_amount'];
        }

        // Descuento order_total automático
        $orderTotalDiscount = $this->calculateOrderTotalDiscount($subtotalPreDiscount, $discounts);
        $totalDiscounts += $orderTotalDiscount;

        // Descuento manual global - Valida pero fallback a 0 + message si inválido (no throw)
        $manualDiscountCode = $request['manual_discount_code'] ?? null;
        $manualDiscountAmount = $request['manual_discount_amount'] ?? 0; // Base: Siempre fallback del request
        $manualError = null; // Para message en redirect

        if ($manualDiscountCode) {
            $manualDiscount = $discounts->firstWhere('code', $manualDiscountCode);
            if ($manualDiscount && !$manualDiscount->automatic && $manualDiscount->applies_to === 'order_total') {
                if ($this->isDiscountValid($manualDiscount, $subtotalPreDiscount)) {
                    $calculatedAmount = $this->calculateDiscount($manualDiscount, $subtotalPreDiscount, 1);
                    $manualDiscountAmount = max(0, $calculatedAmount); // Sobrescribe con calculado si válido
                    // Opcional: Decrementa usage_limit si trackeas
                    // $manualDiscount->decrement('usage_limit');
                } else {
                    $manualError = 'Código de descuento inválido o no aplicable (verifica fechas o monto mínimo).';
                    Log::warning("Manual discount inválido por validación para código: {$manualDiscountCode}");
                }
            } else {
                $manualError = 'Código de descuento no encontrado o no válido (debe ser un cupón manual global).';
                Log::warning("Manual discount no encontrado o no cumple condiciones para código: {$manualDiscountCode}");
            }
        }

        // Si manual es por 'product' o 'category', aplica a items eligible con match combination_id
        if ($manualDiscountCode && isset($manualDiscount) && $manualDiscount && in_array($manualDiscount->applies_to, ['product', 'category'])) {
            foreach ($orderItemsData as &$itemData) {
                $product = Product::find($itemData['product_id']); // Re-fetch si necesitas
                $combinationId = $itemData['combination_id'] ?? null;
                if ($this->isManualApplicableToItem($manualDiscount, $itemData, $product, $combinationId)) {
                    $itemDiscountAmount = $this->calculateDiscount($manualDiscount, $itemData['price_product'], $itemData['quantity']);
                    $itemData['discount_amount'] += $itemDiscountAmount; // Suma a auto
                    $itemData['subtotal'] -= $itemDiscountAmount;
                    $itemData['discounted_price'] = max(0, $itemData['discounted_price'] - ($itemDiscountAmount / $itemData['quantity']));
                    $totalDiscounts += $itemDiscountAmount;
                    $subtotalPostDiscount -= $itemDiscountAmount;
                    $itemData['tax_amount'] = $itemData['subtotal'] * ($product->taxes ? $product->taxes->tax_rate / 100 : 0); // Recalcula tax
                }
            }
            $manualDiscountAmount = 0; // No global para product/cat
            $taxAmount = collect($orderItemsData)->sum(fn($i) => $i['tax_amount']); // Re-sum tax
        }

        // Obtener el shipping_rate_id del request
        $shippingRateId = $request->input('shipping_rate_id');
        $totalShipping = 0;  // Inicializa el monto de envío
        if ($shippingRateId) {
            $shippingRate = ShippingRate::find($shippingRateId);  // Obtén la tarifa de la base de datos
            if ($shippingRate) {
                $totalShipping = $shippingRate->price;  // Asume que hay un campo 'price' en la tabla shipping_rates
            }
        }
        // dd($totalShipping);
        // Cálculo final
        $finalSubtotal = $subtotalPostDiscount;
        $finalTotal = $finalSubtotal + $taxAmount - $orderTotalDiscount - $manualDiscountAmount + $totalShipping;  // Suma el costo de envío
        $grandTotalDiscounts = $totalDiscounts + $manualDiscountAmount;

        // Crear orden
        $order = DB::transaction(function () use ($orderItemsData, $finalSubtotal, $taxAmount, $finalTotal, $grandTotalDiscounts, $request, $userAuth, $manualDiscountCode, $manualDiscountAmount, $shippingRateId, $totalShipping) {
            $order = Order::create([
                'status' => $request['status'],
                'payment_status' => $request['payments_method_id'] ? 'paid' : 'pending', // Cambia aquí
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
                'shipping_rate_id' => $shippingRateId,  // Guarda el ID de la tarifa
                'totalshipping' => $totalShipping,
            ]);

            foreach ($orderItemsData as $itemData) {
                $order->orderItems()->create($itemData); // Guarda combination_id, discount_amount, etc.
            }

            // Decrementar stock por combination_id
            foreach ($orderItemsData as $itemData) {
                $product = Product::find($itemData['product_id']);
                if ($product) {
                    $this->decrementStock($product, $itemData['quantity'], $itemData['combination_id'] ?? null);
                }
            }

            return $order;
        });

        // Redirect con success + error si manual inválido (siempre crea el pedido)
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
            ->where(function ($query) use ($userAuth) {
                $query->whereNull('company_id')
                    ->orWhere('company_id', $userAuth->company_id);
            })
            ->with(['products', 'categories'])
            ->get();

        // Carga todos los productos con sus stocks y combinaciones
        $products = Product::with(
            'categories',
            'combinations',
            'media',
            'stocks',
            'taxes',
            'combinations.combinationAttributeValue',
            'combinations.combinationAttributeValue.attributeValue',
            'combinations.combinationAttributeValue.attributeValue.attribute',
            'discounts' // FIX: Carga descuentos del producto para frontend
        )
            // ->where('company_id', Auth::user()->company_id)
            ->get();

        // Carga todos los usuarios
        $users = User::with('deliveryLocations')->get(); // Filtra por rol si necesitas: ->where('role', 'client')

        $paymentMethods = PaymentMethod::all(); // Asume modelo PaymentMethod
        $shippingRates = ShippingRate::all();  // <-- Agrega esto para pasar a la vista

        return Inertia::render('Orders/Edit', [
            'orders' => $orders,
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

            $product = Product::with('categories', 'discounts:id,name,discount_type,value,applies_to', 'taxes', 'stocks')
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

            // Validar stock actual (después de change)
            $currentStock = $this->getProductStock($product, $combinationId);
            if ($currentStock < $quantity) {
                $varName = $combinationId ? ' (variación ID: ' . $combinationId . ')' : '';
                throw ValidationException::withMessages(['order_items' => 'Stock insuficiente para: ' . $product->product_name . $varName]);
            }

            $originalPrice = $itemData['price_product'] ?? $product->product_price; // Fallback a DB si no envía
            $originalSubtotal = $originalPrice * $quantity;
            $subtotalPreDiscount += $originalSubtotal;

            // Encontrar descuento (preserva si discount_id ya set, sino recalcula auto)
            $applicableDiscount = null;
            if (empty($itemData['discount_id'])) { // Solo recalcula si no preservado
                $applicableDiscount = $this->findApplicableDiscount($product, $combinationId, $quantity, $subtotalPreDiscount, $discounts);
            } else {
                // Preserva guardado (busca por ID)
                $applicableDiscount = $discounts->find($itemData['discount_id']);
            }

            if ($applicableDiscount) {
                $discountAmountPerItem = $this->calculateDiscount($applicableDiscount, $originalPrice, $quantity);
                $discountedPrice = max(0, $originalPrice - ($discountAmountPerItem / $quantity));
                $discountedSubtotal = $originalSubtotal - $discountAmountPerItem;

                $itemData['discount_id'] = $applicableDiscount->id;
                $itemData['discount_type'] = $applicableDiscount->discount_type;
                $itemData['discount_amount'] = $discountAmountPerItem;
                $itemData['discounted_price'] = $discountedPrice;
                $itemData['subtotal'] = $discountedSubtotal;
            } else {
                // Respeta frontend/DB si no auto
                $itemData['discount_id'] = $itemData['discount_id'] ?? null;
                $itemData['discount_type'] = $itemData['discount_type'] ?? null;
                $itemData['discount_amount'] = $itemData['discount_amount'] ?? 0;
                $itemData['discounted_price'] = $originalPrice - (($itemData['discount_amount'] ?? 0) / $quantity);
                $itemData['subtotal'] = $originalSubtotal - ($itemData['discount_amount'] ?? 0);
            }

            $totalDiscounts += $itemData['discount_amount'] ?? 0;
            $subtotalPostDiscount += $itemData['subtotal'];

            // Tax post-descuento
            $taxRate = $product->taxes ? $product->taxes->tax_rate / 100 : 0;
            $itemData['tax_rate'] = $taxRate * 100;
            $itemData['tax_amount'] = $itemData['subtotal'] * $taxRate;
            $taxAmount += $itemData['tax_amount'];

            // FIX: Para nuevos, setea order_id (crucial para create)
            if (!$itemId || !is_numeric($itemId)) {
                $itemData['order_id'] = $orders->id; // Setea relación
            }
        }

        // Order total auto + manual (igual que store)
        $orderTotalDiscount = $this->calculateOrderTotalDiscount($subtotalPreDiscount, $discounts);
        $totalDiscounts += $orderTotalDiscount;

        $manualDiscountCode = $request['manual_discount_code'] ?? null;
        $manualDiscountAmount = $request['manual_discount_amount'] ?? 0;
        $manualError = null;
        if ($manualDiscountCode) {
            $manualDiscount = $discounts->firstWhere('code', $manualDiscountCode);
            if ($manualDiscount && !$manualDiscount->automatic && $manualDiscount->applies_to === 'order_total') {
                if ($this->isDiscountValid($manualDiscount, $subtotalPreDiscount)) {
                    $manualDiscountAmount = $this->calculateDiscount($manualDiscount, $subtotalPreDiscount, 1);
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
                    $itemDiscountAmount = $this->calculateDiscount($manualDiscount, $itemData['price_product'], $itemData['quantity']);
                    $itemData['discount_amount'] += $itemDiscountAmount;
                    $itemData['subtotal'] -= $itemDiscountAmount;
                    $itemData['discounted_price'] = max(0, $itemData['discounted_price'] - ($itemDiscountAmount / $itemData['quantity']));
                    $totalDiscounts += $itemDiscountAmount;
                    $subtotalPostDiscount -= $itemDiscountAmount;
                    $itemData['tax_amount'] = $itemData['subtotal'] * ($product->taxes ? $product->taxes->tax_rate / 100 : 0);
                }
            }
            $manualDiscountAmount = 0;
            $taxAmount = collect($orderItemsData)->sum(fn($i) => $i['tax_amount']);
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
        $finalTotal = $finalSubtotal + $taxAmount - $orderTotalDiscount - $manualDiscountAmount + $totalShipping;  // Incluye totalShipping
        $grandTotalDiscounts = $totalDiscounts + $manualDiscountAmount;

        // Update con transacción – FIX: Agrega $existingItems y $sentIds en use()
        $orders = DB::transaction(function () use ($orderItemsData, $finalSubtotal, $shippingRateId, $totalShipping, $taxAmount, $finalTotal, $grandTotalDiscounts, $request, $orders, $stockChanges, $sentIds, $existingItems, $manualDiscountCode, $manualDiscountAmount) { // <-- FIX: Agrega $existingItems aquí
            try {
                // Update orden principal
                $orders->update([
                    'status' => $request['status'],
                    'payment_status' => $request['payments_method_id'] ? 'paid' : 'pending',
                    'delivery_type' => $request['delivery_type'],
                    'tax_amount' => $taxAmount,
                    'subtotal' => $finalSubtotal,
                    'total' => $finalTotal,
                    'totaldiscounts' => $grandTotalDiscounts,
                    'manual_discount_code' => $manualDiscountCode,
                    'manual_discount_amount' => $manualDiscountAmount,
                    'payments_method_id' => $request['payments_method_id'],
                    'user_id' => $request['user_id'] ?? $orders->user_id,
                    'delivery_location_id' => $request['delivery_location_id'],
                    'shipping_rate_id' => $shippingRateId,
                    'totalshipping' => $totalShipping,
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
                        }
                    } else {
                        // Create nuevo (sin ID)
                        $newItem = $orders->orderItems()->create($itemData); // order_id ya seteado arriba
                        Log::info("Created new item ID {$newItem->id}: product_id={$itemData['product_id']}, subtotal={$itemData['subtotal']}"); // Debug
                    }
                }

                // FIX: Delete items no enviados (si frontend quita rows) – Usa $sentIds y $existingItems
                $dbIds = $existingItems->keys(); // IDs de DB
                $toDelete = $dbIds->diff($sentIds); // Diferencia: no enviados
                if ($toDelete->isNotEmpty()) {
                    $orders->orderItems()->whereIn('id', $toDelete)->delete();
                    Log::info('Deleted items: ' . $toDelete->implode(', ')); // Debug
                    // Opcional: Incrementa stock para deleted
                    // $deleted = OrderItem::whereIn('id', $toDelete)->get();
                    // foreach ($deleted as $del) { $this->incrementStock($del->product, $del->quantity, $del->combination_id); }
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
                            } else {
                                // Quantity bajó: incrementa diferencia (libera stock)
                                $stock = $product->stocks->firstWhere('combination_id', $combinationId);
                                if ($stock) {
                                    $stock->increment('quantity', abs($delta));
                                }
                            }
                            Log::info("Stock adjusted for item {$itemId}: delta={$delta}"); // Debug
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

                return $orders->fresh(['orderItems.product']); // Recarga con items para response
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
