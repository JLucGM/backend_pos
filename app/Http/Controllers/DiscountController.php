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
        $products = Product::with('combinations.combinationAttributeValue.attributeValue.attribute')->get();
        $categories = Category::all();

        return Inertia::render('Discounts/Create', compact('products', 'categories'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $user = Auth::user();

        // Usa validated() para obtener datos validados (incluye product_selections)
        $data = $request->validated();
        $data['company_id'] = $user->company_id;
        // Crear el nuevo descuento
        $discount = Discount::create($data);
        // Relacionar productos o categorías según applies_to
        if ($data['applies_to'] === 'product') {
            $selections = $data['product_selections'] ?? []; // Array de {product_id, combination_id}
            foreach ($selections as $selection) {
                // Attach cada selección en pivot (combination_id nullable)
                $discount->products()->attach($selection['product_id'], [
                    'combination_id' => $selection['combination_id'], // null para simples, ID para variables
                ]);
            }
        } elseif ($data['applies_to'] === 'category') {
            // Original: Attach categorías
            $discount->categories()->attach($request->input('category_ids', []));
        }
        // Para 'order_total': No necesita relacionar

        return to_route('discounts.index')->with('success', 'Descuento creado con éxito.');
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
        // Cargar relaciones con pivot para products (combination_id)
        $discount->load([
            'products:id,product_name', // Solo campos necesarios
            'categories:id,category_name'
        ]);

        // Fetch products con combinations para options en form
        $products = Product::with([
            'combinations:id,product_id,combination_price',
            'combinations.combinationAttributeValue:id,combination_id,attribute_value_id',
            'combinations.combinationAttributeValue.attributeValue:id,attribute_value_name,attribute_id',
            'combinations.combinationAttributeValue.attributeValue.attribute:id,attribute_name'
        ])->get(); // Carga completa para labels en select (de tu JSON structure)

        $categories = Category::all();

        return Inertia::render('Discounts/Edit', compact('discount', 'products', 'categories'));
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Discount $discount)
    {
        // Obtener los datos de la solicitud (usa validated para incluir selections)
        $data = $request->validated();
        $data['company_id'] = Auth::user()->company_id; // Si aplica

        // Verificar si applies_to ha cambiado
        if ($discount->applies_to !== $data['applies_to']) {
            // Detach relaciones antiguas
            if ($discount->applies_to === 'category') {
                $discount->categories()->detach();
            } elseif ($discount->applies_to === 'product') {
                $discount->products()->detach();
            }
        }

        // Actualizar el descuento
        $discount->update($data);

        // Actualizar relaciones
        if ($data['applies_to'] === 'product') {
            // NUEVO: Sync para product_selections (array de {product_id, combination_id})
            $selections = $data['product_selections'] ?? [];
            $pivotData = collect($selections)->mapWithKeys(function ($selection) {
                return [$selection['product_id'] => ['combination_id' => $selection['combination_id']]];
            })->toArray(); // {product_id: ['combination_id' => value]} – maneja múltiples por product_id

            $discount->products()->sync($pivotData); // Sync: Detacha viejos, ata nuevos con pivot
        } elseif ($data['applies_to'] === 'category') {
            // Original: Sync categorías
            $discount->categories()->sync($request->input('category_ids', []));
        }
        // Para 'order_total': Nada

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
