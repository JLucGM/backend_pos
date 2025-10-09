<?php

namespace App\Http\Controllers;

use App\Http\Requests\Orders\StoreRequest;
use App\Http\Requests\Orders\UpdateRequest;
use App\Models\Discount;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PaymentMethod;
use App\Models\Product;
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
        $users = User::with('deliveryLocations')->where('company_id', $userAuth->company_id)->where('status', 1)->get();

        // Cargar productos con relaciones existentes + categorías y descuentos
        $products = Product::with(
            'categories',
            'combinations',
            'media',
            'stocks',
            'taxes',
            'combinations.combinationAttributeValue.attributeValue.attribute',
            'discounts' // Nuevo: descuentos directos del producto
        )->where('company_id', $userAuth->company_id)->get(); // Filtrar por compañía

        // Nuevo: Cargar descuentos activos y automáticos para la compañía
        $discounts = Discount::with(['products', 'categories']) // Cargar relaciones pivote
            ->active() // Usa el scope que definiste
            ->get();

        return Inertia::render('Orders/Create', compact('paymentMethods', 'products', 'users', 'discounts'));
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
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
            ->with(['products', 'categories'])
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

            $product = Product::with('categories', 'discounts', 'taxes', 'stocks')
                ->where('company_id', $userAuth->company_id)
                ->find($itemData['product_id']);
            if (!$product) {
                throw ValidationException::withMessages(['order_items' => 'Producto no encontrado: ' . ($itemData['product_id'] ?? 'ID desconocido')]);
            }

            // Validar stock
            $stock = $this->getProductStock($product, $itemData['combination_id'] ?? null);
            if ($stock < $itemData['quantity']) {
                throw ValidationException::withMessages(['order_items' => 'Stock insuficiente para: ' . $product->product_name]);
            }

            $originalPrice = $itemData['price_product'];
            $quantity = $itemData['quantity'];
            $originalSubtotal = $originalPrice * $quantity;
            $subtotalPreDiscount += $originalSubtotal;

            // Encontrar descuento automático aplicable
            $applicableDiscount = $this->findApplicableDiscount($product, $quantity, $subtotalPreDiscount, $discounts);

            if ($applicableDiscount) {
                $discountAmountPerItem = $this->calculateDiscount($applicableDiscount, $originalPrice, $quantity);
                $discountedPrice = max(0, $originalPrice - ($discountAmountPerItem / $quantity));
                $discountedSubtotal = $originalSubtotal - $discountAmountPerItem;

                $itemData['discount_id'] = $applicableDiscount->id;
                $itemData['discount_type'] = $applicableDiscount->discount_type;
                $itemData['discount_amount'] = $discountAmountPerItem;
                $itemData['discounted_price'] = $discountedPrice;
                $itemData['subtotal'] = $discountedSubtotal;

                $totalDiscounts += $discountAmountPerItem;
                $subtotalPostDiscount += $discountedSubtotal;
            } else {
                $itemData['discount_id'] = $itemData['discount_id'] ?? null;
                $itemData['discount_type'] = $itemData['discount_type'] ?? null;
                $itemData['discount_amount'] = $itemData['discount_amount'] ?? 0;
                $itemData['discounted_price'] = $originalPrice - (($itemData['discount_amount'] ?? 0) / $quantity);
                $itemData['subtotal'] = $originalSubtotal - ($itemData['discount_amount'] ?? 0);
                $totalDiscounts += $itemData['discount_amount'] ?? 0;
                $subtotalPostDiscount += $itemData['subtotal'];
            }

            // Recalcular tax_amount
            $taxRate = $product->taxes ? $product->taxes->tax_rate / 100 : 0;
            $itemData['tax_rate'] = $taxRate * 100;
            $itemData['tax_amount'] = $itemData['subtotal'] * $taxRate;
            $taxAmount += $itemData['tax_amount'];
        }

        // Descuento order_total automático
        $orderTotalDiscount = $this->calculateOrderTotalDiscount($subtotalPreDiscount, $discounts);
        $totalDiscounts += $orderTotalDiscount;

        // SOLUCIÓN PERMANENTE: Descuento manual global - Valida pero fallback a 0 + message si inválido (no throw)
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

        // Cálculo final
        $finalSubtotal = $subtotalPostDiscount;
        $finalTotal = $finalSubtotal + $taxAmount - $orderTotalDiscount - $manualDiscountAmount;
        $grandTotalDiscounts = $totalDiscounts + $manualDiscountAmount;

        // Crear orden
        $order = DB::transaction(function () use ($orderItemsData, $finalSubtotal, $taxAmount, $finalTotal, $grandTotalDiscounts, $request, $userAuth, $manualDiscountCode, $manualDiscountAmount) {
            $order = Order::create([
                'status' => $request['status'],
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
            ]);

            foreach ($orderItemsData as $itemData) {
                $order->orderItems()->create($itemData);
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

        // Redirect con success + error si manual inválido (siempre crea el pedido)
        $redirect = redirect()->route('orders.edit', $order)->with('success', 'Orden creada con éxito.');
        if ($manualError) {
            $redirect = $redirect->with('error', $manualError);
        }
        return $redirect;
    }

    // Helper para encontrar descuento automático aplicable (prioridad: directo > categoría)
    private function findApplicableDiscount($product, $quantity, $currentSubtotal, $discounts)
    {
        $activeAutomaticDiscounts = $discounts->filter(function ($d) {
            return $d->automatic && $d->is_active &&
                (!$d->start_date || Carbon::parse($d->start_date)->lte(now())) &&
                (!$d->end_date || Carbon::parse($d->end_date)->gte(now()));
        });

        $applicable = null;
        $maxValue = 0;

        // Prioridad 1: Descuentos directos del producto
        $directDiscounts = $activeAutomaticDiscounts->filter(function ($d) use ($product) {
            return $d->applies_to === 'product' && $product->discounts->contains('id', $d->id);
        });
        if ($directDiscounts->isNotEmpty()) {
            $applicable = $directDiscounts->sortByDesc('value')->first();
            $maxValue = $applicable->value ?? 0;
        }

        // Prioridad 2: Descuentos por categoría
        if (!$applicable && $product->categories->isNotEmpty()) {
            foreach ($product->categories as $cat) {
                $catDiscounts = $activeAutomaticDiscounts->filter(function ($d) use ($cat) {
                    return $d->applies_to === 'category' && $cat->discounts->contains('id', $d->id);
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

        // Validar minimum_order_amount
        if ($applicable && $applicable->minimum_order_amount && $currentSubtotal < $applicable->minimum_order_amount) {
            $applicable = null;
        }

        return $applicable;
    }

    // Helper para calcular monto de descuento (porcentaje o fijo)
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

    // Helper para descuento order_total automático
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

    // Helper para validar descuento (fechas, mínimo, etc.)
    private function isDiscountValid($discount, $subtotal)
    {
        return $discount->is_active &&
            (!$discount->start_date || Carbon::parse($discount->start_date)->lte(now())) &&
            (!$discount->end_date || Carbon::parse($discount->end_date)->gte(now())) &&
            (!$discount->minimum_order_amount || $subtotal >= $discount->minimum_order_amount);
    }

    // Helper para obtener stock del producto
    private function getProductStock($product, $combinationId = null)
    {
        if (!$product->stocks || $product->stocks->isEmpty()) return 0;
        $stock = $product->stocks->firstWhere('combination_id', $combinationId);
        return $stock ? (int) $stock->quantity : 0;
    }

    // Helper para decrementar stock (al crear orden)
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
            ->where('company_id', Auth::user()->company_id)
            ->get();

        // Carga todos los usuarios
        $users = User::all(); // Filtra por rol si necesitas: ->where('role', 'client')

        $paymentMethods = PaymentMethod::all(); // Asume modelo PaymentMethod

        return Inertia::render('Orders/Edit', [
            'orders' => $orders,
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
            ->with(['products', 'categories'])
            ->get();

        // Pre-calcular como en store
        $orderItemsData = $request['order_items'] ?? [];
        $totalDiscounts = 0;
        $subtotalPostDiscount = 0;
        $taxAmount = 0;
        $subtotalPreDiscount = 0;

        // Validar y recalcular descuentos por ítem (igual que store)
        foreach ($orderItemsData as &$itemData) {
            // Mapeo de campos
            if (isset($itemData['product_price'])) {
                $itemData['price_product'] = $itemData['product_price'];
                unset($itemData['product_price']);
            }

            $product = Product::with('categories', 'discounts', 'taxes', 'stocks')
                ->where('company_id', $userAuth->company_id)
                ->find($itemData['product_id']);
            if (!$product) {
                throw ValidationException::withMessages(['order_items' => 'Producto no encontrado.']);
            }

            // Validar stock
            $stock = $this->getProductStock($product, $itemData['combination_id'] ?? null);
            if ($stock < $itemData['quantity']) {
                throw ValidationException::withMessages(['order_items' => 'Stock insuficiente.']);
            }

            $originalPrice = $itemData['price_product'];
            $quantity = $itemData['quantity'];
            $originalSubtotal = $originalPrice * $quantity;
            $subtotalPreDiscount += $originalSubtotal;

            $applicableDiscount = $this->findApplicableDiscount($product, $quantity, $subtotalPreDiscount, $discounts);

            if ($applicableDiscount) {
                $discountAmountPerItem = $this->calculateDiscount($applicableDiscount, $originalPrice, $quantity);
                $discountedPrice = max(0, $originalPrice - ($discountAmountPerItem / $quantity));
                $discountedSubtotal = $originalSubtotal - $discountAmountPerItem;

                $itemData['discount_id'] = $applicableDiscount->id;
                $itemData['discount_type'] = $applicableDiscount->discount_type;
                $itemData['discount_amount'] = $discountAmountPerItem;
                $itemData['discounted_price'] = $discountedPrice;
                $itemData['subtotal'] = $discountedSubtotal;

                $totalDiscounts += $discountAmountPerItem;
                $subtotalPostDiscount += $discountedSubtotal;
            } else {
                $itemData['discount_id'] = $itemData['discount_id'] ?? null;
                $itemData['discount_amount'] = $itemData['discount_amount'] ?? 0;
                $itemData['discounted_price'] = $originalPrice;
                $itemData['subtotal'] = $originalSubtotal - ($itemData['discount_amount'] ?? 0);
                $totalDiscounts += $itemData['discount_amount'] ?? 0;
                $subtotalPostDiscount += $itemData['subtotal'];
            }

            // Tax
            $taxRate = $product->taxes ? $product->taxes->tax_rate / 100 : 0;
            $itemData['tax_rate'] = $taxRate * 100;
            $itemData['tax_amount'] = $itemData['subtotal'] * $taxRate;
            $taxAmount += $itemData['tax_amount'];
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

        $finalSubtotal = $subtotalPostDiscount;
        $finalTotal = $finalSubtotal + $taxAmount - $orderTotalDiscount - $manualDiscountAmount;
        $grandTotalDiscounts = $totalDiscounts + $manualDiscountAmount;

        // Update con transacción (integra tu lógica de delete/update/create)
        $orders = DB::transaction(function () use ($orderItemsData, $finalSubtotal, $taxAmount, $finalTotal, $grandTotalDiscounts, $request, $orders, $manualDiscountCode, $manualDiscountAmount, $manualError) {
            // Update orden principal
            $orders->update([
                'status' => $request['status'],
                'tax_amount' => $taxAmount,
                'subtotal' => $finalSubtotal,
                'total' => $finalTotal,
                'totaldiscounts' => $grandTotalDiscounts,
                'manual_discount_code' => $manualDiscountCode,
                'manual_discount_amount' => $manualDiscountAmount,
                'payments_method_id' => $request['payments_method_id'],
                'user_id' => $request['user_id'] ?? $orders->user_id,
                // direction_delivery si aplica
            ]);

            // Tu lógica de ítems (delete + update/create)
            $incomingOrderItems = collect($request['order_items']);
            $itemsToKeepIds = $incomingOrderItems->filter(function ($item) {
                return isset($item['id']) && !str_contains($item['id'], '-');
            })->pluck('id');

            $orders->orderItems()->whereNotIn('id', $itemsToKeepIds)->delete();

            foreach ($incomingOrderItems as $itemData) {
                if (isset($itemData['id']) && !str_contains($itemData['id'], '-')) {
                    // Update existing
                    $orderItem = OrderItem::find($itemData['id']);
                    if ($orderItem) {
                        $orderItem->update($itemData); // Usa $itemData recalculado
                    }
                } else {
                    // Create new
                    $orders->orderItems()->create($itemData);
                }
            }

            // Incrementa stock para ítems removidos (opcional, reverso de store)
            // Implementa si necesitas

            return $orders->fresh(); // Recarga para response
        });

        $redirect = redirect()->route('orders.edit', $orders)->with('success', 'Orden actualizada con éxito.');
        if ($manualError) {
            $redirect = $redirect->with('error', $manualError);
        }
        return $redirect;
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
