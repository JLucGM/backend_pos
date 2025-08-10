<?php

namespace App\Http\Controllers;

use App\Http\Requests\Orders\StoreRequest;
use App\Http\Requests\Orders\UpdateRequest;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        // Verificar si el usuario tiene permisos para crear órdenes
        if (!$userAuth->can('admin.orders.create')) {
            abort(403, 'No tienes permiso para crear órdenes.');
        }

        $paymentMethods = PaymentMethod::all();
        $users = User::with('deliveryLocations')->where('company_id', $userAuth->company_id)->where('status', 1)->get();
        // Carga productos con sus categorías, combinaciones y medios (imágenes)
        $products = Product::with(
            'categories',
            'combinations',
            'media',
            'stocks',
            'combinations',
            'combinations.combinationAttributeValue', // Cargar valores de atributos de combinaciones
            'combinations.combinationAttributeValue.attributeValue', // Cargar valores de atributos relacionados
            'combinations.combinationAttributeValue.attributeValue.attribute', // Cargar atributos relacionados
        )->get();

        return Inertia::render('Orders/Create', compact('paymentMethods', 'products', 'users'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        // dd($request->all());
        $userAuth = Auth::user();

        // Asegúrate de que la company_id coincida con la del usuario autenticado
        if ($userAuth->company_id !== $request->input('company_id', $userAuth->company_id)) {
            abort(403, 'No tienes permiso para esta operación.');
        }

        // Crea la Orden principal
        $order = Order::create([
            'status' => $request['status'],
            'total' => $request['total'],
            'subtotal' => $request['subtotal'],
            'totaldiscounts' => $request['totaldiscounts'] ?? 0, // Por defecto 0 si no se proporciona
            'delivery_location_id' => $request['delivery_location_id'], // Guarda el delivery_location_id
            'payments_method_id' => $request['payments_method_id'],
            'order_origin' => $request['order_origin'],
            'user_id' => $request['user_id'], // Asigna el usuario autenticado como creador de la orden
            'company_id' => $userAuth->company_id, // Asigna la company_id del usuario
        ]);

        // Crea los OrderItems asociados a la orden
        foreach ($request['order_items'] as $itemData) {
            $order->orderItems()->create([
                'product_id' => $itemData['product_id'],
                'name_product' => $itemData['name_product'],
                'price_product' => $itemData['product_price'], // Precio efectivo
                'quantity' => $itemData['quantity'],
                'subtotal' => $itemData['subtotal'],
                'combination_id' => $itemData['combination_id'] ?? null, // Guarda combination_id si existe
                'product_details' => $itemData['product_details'],
                // NOTA: 'original_display_price' no se guarda directamente en OrderItem
                // si no tienes una columna específica para ello.
                // Si necesitas persistir el precio original, deberías añadir una columna
                // como 'original_price_product' a tu tabla 'order_items'.
            ]);
        }

        return redirect()->route('orders.edit', $order)->with('success', 'Orden creada con éxito.');
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
        $orders->load('user', 'orderItems', 'paymentMethod', 'deliveryLocation'); // Cargas relaciones de la orden
        // Carga todos los productos con sus stocks y combinaciones
        // Asegúrate de que las relaciones 'stocks', 'combinations', 'combinationAttributeValue', 'attributeValue'
        // estén cargadas para que el frontend pueda acceder a ellas.
        $products = Product::with(
            'categories',
            'combinations',
            'media',
            'stocks',
            'combinations',
            'combinations.combinationAttributeValue', // Cargar valores de atributos de combinaciones
            'combinations.combinationAttributeValue.attributeValue', // Cargar valores de atributos relacionados
            'combinations.combinationAttributeValue.attributeValue.attribute', // Cargar atributos relacionados
        )
            ->where('company_id', Auth::user()->company_id)
            ->get();

        // Carga todos los usuarios
        $users = User::all(); // Puedes filtrar por rol si solo necesitas clientes, por ejemplo: User::where('role', 'client')->get();

        $paymentMethods = PaymentMethod::all();

        return Inertia::render('Orders/Edit', [
            'orders' => $orders,
            'paymentMethods' => $paymentMethods,
            'products' => $products, // ¡Ahora se pasan los productos!
            'users' => $users,       // ¡Ahora se pasan los usuarios!
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Order $orders)
    {
        $user = Auth::user();
        if ($orders->company_id !== $user->company_id) {
            abort(403, 'No tienes permiso para esta operación.');
        }

        // Update the main Order record
        $orders->update([
            'status' => $request('status'),
            'total' => $request('total'),
            'subtotal' => $request('subtotal'),
            'totaldiscounts' => $request('totaldiscounts') ?? 0,
            'direction_delivery' => $request('direction_delivery'),
            'payments_method_id' => $request('payments_method_id'),
            'user_id' => $request('user_id') ?? $orders->user_id, // Usar el valor existente si no se envía
        ]);

        // --- Synchronize Order Items ---
        $incomingOrderItems = collect($request('order_items'));
        $existingOrderItemIds = $orders->orderItems->pluck('id');

        // IDs de los items que deben permanecer (del frontend y existen en DB)
        $itemsToKeepIds = $incomingOrderItems->filter(function ($item) {
            // Un item existente tendrá un ID numérico (no contiene guiones como un UUID)
            return isset($item['id']) && !str_contains($item['id'], '-');
        })->pluck('id');

        // Eliminar items que ya no están en la solicitud
        $orders->orderItems()->whereNotIn('id', $itemsToKeepIds)->delete();

        // Crear o actualizar items de la orden
        foreach ($incomingOrderItems as $itemData) {
            // Si el item tiene un ID y no es un UUID temporal, es un item existente
            if (isset($itemData['id']) && !str_contains($itemData['id'], '-')) {
                // Item existente: Buscar y actualizar
                $orderItem = OrderItem::find($itemData['id']);
                if ($orderItem) {
                    $orderItem->update([
                        'product_id' => $itemData['product_id'] ?? $orderItem->product_id, // Usar valor existente si no se envía
                        'combination_id' => $itemData['combination_id'] ?? $orderItem->combination_id, // Usar valor existente si no se envía
                        'name_product' => $itemData['name_product'] ?? $orderItem->name_product, // Usar valor existente si no se envía
                        'price_product' => $itemData['product_price'] ?? $orderItem->price_product, // Usar valor existente si no se envía
                        'subtotal' => $itemData['subtotal'] ?? $orderItem->subtotal, // Usar valor existente si no se envía
                        'quantity' => $itemData['quantity'] ?? $orderItem->quantity, // Usar valor existente si no se envía
                        'product_details' => $itemData['product_details'] ?? $orderItem->product_details, // Usar valor existente si no se envía
                    ]);
                }
            } else {
                // Nuevo item: Crear
                // Para nuevos items, los campos requeridos deben estar presentes desde el frontend
                $orders->orderItems()->create([
                    'product_id' => $itemData['product_id'],
                    'combination_id' => $itemData['combination_id'] ?? null,
                    'name_product' => $itemData['name_product'],
                    'price_product' => $itemData['product_price'],
                    'subtotal' => $itemData['subtotal'],
                    'quantity' => $itemData['quantity'],
                    'product_details' => $itemData['product_details'] ?? null,
                ]);
            }
        }

        return redirect()->route('orders.edit', $orders)->with('success', 'Orden actualizada con éxito.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
