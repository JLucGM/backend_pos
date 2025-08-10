<?php

namespace App\Http\Controllers;

use App\Http\Requests\Discounts\StoreRequest;
use App\Http\Requests\Discounts\UpdateRequest;
use App\Models\Category;
use App\Models\Discount;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DiscountController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:admin.discount.index')->only('index');
        $this->middleware('can:admin.discount.create')->only('create', 'store');
        $this->middleware('can:admin.discount.edit')->only('edit', 'update');
        $this->middleware('can:admin.discount.delete')->only('delete');
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $discounts = Discount::all();
        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('Discounts/Index', compact('discounts', 'role', 'permission'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $products = Product::all();
        $categories = Category::all();

        return Inertia::render('Discounts/Create', compact('products', 'categories'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $user = Auth::user();
        // dd($request->all()); // Para depurar y ver los datos recibidos

        $data = $request->only('name', 'description', 'discount_type', 'value', 'applies_to', 'start_date', 'end_date', 'minimum_order_amount', 'usage_limit', 'code', 'is_active', 'automatic');
        $data['company_id'] = $user->company_id;

        // Crear el nuevo descuento
        $discount = Discount::create($data);

        // Relacionar productos o categorías según la opción seleccionada
        if ($data['applies_to'] === 'product') {
            $discount->products()->attach($request->input('product_ids', []));
        } elseif ($data['applies_to'] === 'category') {
            $discount->categories()->attach($request->input('category_ids', []));
        }

        return to_route('discounts.index'); // Redirigir a la lista de descuentos
    }


    /**
     * Display the specified resource.
     */
    public function show(Discount $discount)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Discount $discount)
    {
        $discount->load('products', 'categories'); // Cargar relaciones de productos y categorías
        $products = Product::all();
        $categories = Category::all();

        return Inertia::render('Discounts/Edit', compact('discount', 'products', 'categories'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Discount $discount)
    {
        // Obtener los datos de la solicitud
        $data = $request->only('name', 'description', 'discount_type', 'value', 'applies_to', 'start_date', 'end_date', 'minimum_order_amount', 'usage_limit', 'code', 'is_active', 'automatic');

        // Verificar si el valor de applies_to ha cambiado
        if ($discount->applies_to !== $data['applies_to']) {
            // Si el valor ha cambiado, eliminar las relaciones existentes
            if ($discount->applies_to === 'category') {
                $discount->categories()->detach(); // Eliminar relaciones de categorías
            } elseif ($discount->applies_to === 'product') {
                $discount->products()->detach(); // Eliminar relaciones de productos
            }
        }

        // Actualizar el descuento
        $discount->update($data);

        // Actualizar las relaciones de productos y categorías
        if ($data['applies_to'] === 'product') {
            // Si aplica a productos, adjuntar los productos seleccionados
            $discount->products()->sync($request->input('product_ids', []));
        } elseif ($data['applies_to'] === 'category') {
            // Si aplica a categorías, adjuntar las categorías seleccionadas
            $discount->categories()->sync($request->input('category_ids', []));
        }

        return to_route('discounts.edit', $discount)->with('success', 'Descuento actualizado con éxito.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Discount $discount)
    {
        // Eliminar el descuento
        $discount->products()->detach(); // Desvincular productos asociados
        $discount->categories()->detach(); // Desvincular categorías asociadas
        $discount->delete(); // Eliminar el descuento

        return to_route('discounts.index'); // Redirigir a la lista de descuentos
    }
}
