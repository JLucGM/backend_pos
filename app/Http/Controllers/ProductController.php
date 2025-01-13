<?php

namespace App\Http\Controllers;

use App\Models\Attribute;
use App\Models\AttributeValue;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\Stock;
use App\Models\Store;
use App\Models\Tax;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:admin.products.index')->only('index');
        $this->middleware('can:admin.products.create')->only('create', 'store');
        $this->middleware('can:admin.products.edit')->only('edit', 'update');
        $this->middleware('can:admin.products.delete')->only('delete');
    }
    /**
     * Display a listing of the resource.s
     */
    public function index()
    {
        $product = Product::all();
        $taxes = Tax::all();
        $categories = Category::all();

        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('Products/Index', compact('product', 'taxes', 'categories', 'role', 'permission'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $taxes = Tax::all();
        $categories = Category::all();
        $stores = Store::all();

        return Inertia::render('Products/Create', compact('taxes', 'categories', 'stores'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());
        // Validar los datos de entrada
        $request->validate([
            'product_name' => 'required|string|max:255',
            'product_description' => 'nullable|string',
            'product_price' => 'required|numeric',
            'tax_id' => 'required|exists:taxes,id',
            'categories' => 'required|array',
            'categories.*' => 'exists:categories,id',
            'attribute_names' => 'nullable|array|max:3', // Cambiar a nullable
            'attribute_names.*' => 'nullable|string|max:255', // Cambiar a nullable
            'attribute_values' => 'nullable|array', // Cambiar a nullable
            'attribute_values.*' => 'nullable|array', // Cambiar a nullable
            'attribute_values.*.*' => 'nullable|string|max:255', // Cambiar a nullable

            'quantity' => 'required|integer|min:0', // Validar la cantidad
            'store_id' => 'required|exists:stores,id', // Validar el ID de la tienda
        ]);

        // Crear el producto
        $product = Product::create(
            $request->only(
                'product_name',
                'product_description',
                'product_price',
                'product_price_discount',
                'status',
                'tax_id',
                'quantity',
                'store_id',
            )
        );

        // Asociar las categorías al producto
        $product->categories()->attach($request->categories);

        // Crear atributos y sus valores solo si se proporcionan
        if (!empty($request->attribute_names) && !empty($request->attribute_values)) {
            foreach ($request->attribute_names as $index => $attributeName) {
                // Crear el atributo
                $attribute = Attribute::create(['attribute_name' => $attributeName]);

                // Crear los valores del atributo
                foreach ($request->attribute_values[$index] as $value) {
                    if (!empty($value)) { // Asegúrate de que el valor no esté vacío
                        $attributeValue = AttributeValue::create([
                            'attribute_value_name' => $value,
                            'attribute_id' => $attribute->id,
                        ]);

                        // Asociar el atributo y el valor al producto
                        ProductAttribute::create([
                            'product_id' => $product->id,
                            'attribute_id' => $attribute->id,
                            'attribute_value_id' => $attributeValue->id,
                        ]);
                    }
                }
            }
        }

        // Crear el stock del producto
        Stock::create([
            'quantity' => $request->quantity,
            // 'status' => 1, // Puedes establecer un valor predeterminado para el estado
            'product_id' => $product->id,
            'store_id' => $request->store_id,
        ]);

        return to_route('products.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $product->load(['tax', 'categories', 'stocks', 'attributes.attribute_values']);

        $taxes = Tax::all();
        $categories = Category::all();
        $stores = Store::all();

        return Inertia::render('Products/Edit', compact('product', 'taxes', 'categories', 'stores'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        // Validar los datos de entrada
        $request->validate([
            'product_name' => 'required|string|max:255',
            'product_description' => 'nullable|string',
            'product_price' => 'required|numeric',
            'tax_id' => 'required|exists:taxes,id',
            'categories' => 'required|array',
            'categories.*' => 'exists:categories,id',
            'quantity' => 'required|integer|min:0', // Validar la cantidad de stock
            'attribute_names' => 'nullable|array',
            'attribute_names.*' => 'nullable|string|max:255',
            'attribute_values' => 'nullable|array',
            'attribute_values.*' => 'nullable|array',
            'attribute_values.*.*' => 'nullable|string|max:255',
        ]);

        // Extraer los datos del producto
        $data = $request->only('product_name', 'product_description', 'product_price', 'product_price_discount', 'status', 'tax_id');

        // Actualizar el producto
        $product->update($data);

        // Actualizar las categorías asociadas
        $product->categories()->sync($request->categories);

        // Actualizar el stock
        $product->stocks()->update([
            'quantity' => $request->quantity,
            'store_id' => $request->store_id,
        ]); // Actualiza la cantidad de stock

        // Actualizar los atributos
        if (!empty($request->attribute_names)) {
            // Primero, eliminamos las asociaciones en product_attributes
            foreach ($product->attributes as $attribute) {
                ProductAttribute::where('attribute_id', $attribute->id)->delete();
                $attribute->attribute_values()->delete();
            }

            $product->attributes()->delete();

            foreach ($request->attribute_names as $index => $attributeName) {
                if (!empty($attributeName)) {
                    $attribute = Attribute::create(['attribute_name' => $attributeName]);

                    foreach ($request->attribute_values[$index] as $value) {
                        if (!empty($value)) {
                            $attributeValue = AttributeValue::create([
                                'attribute_value_name' => $value,
                                'attribute_id' => $attribute->id,
                            ]);

                            ProductAttribute::create([
                                'product_id' => $product->id,
                                'attribute_id' => $attribute->id,
                                'attribute_value_id' => $attributeValue->id,
                            ]);
                        }
                    }
                }
            }
        }

        return to_route('products.index')->with('success', 'Producto actualizado con éxito.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // Iniciar una transacción
        DB::transaction(function () use ($product) {
            // Eliminar los registros de stock asociados al producto
            $product->stocks()->delete(); // Elimina todos los registros de stock relacionados

            // Obtener todos los atributos asociados al producto
            $attributes = $product->attributes()->with('attribute_values')->get();

            // Eliminar las relaciones en la tabla pivote product_attributes
            $product->attributes()->detach(); // Esto elimina las relaciones en product_attributes

            // Eliminar los valores de atributo y los atributos
            foreach ($attributes as $attribute) {
                // Eliminar los valores de atributo asociados
                $attributeValueIds = $attribute->attribute_values()->pluck('id'); // Obtener los IDs de los valores de atributo
                $attribute->attribute_values()->delete(); // Elimina los valores de atributo
                $attribute->delete(); // Elimina el atributo
            }

            // Eliminar las relaciones en la tabla pivote product_categories
            $product->categories()->detach(); // Esto elimina las relaciones en product_categories

            // Ahora puedes eliminar el producto
            $product->delete();
        });

        return to_route('products.index')->with('success', 'Producto eliminado con éxito.');
    }
}
