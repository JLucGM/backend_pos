<?php

namespace App\Http\Controllers;

use App\Models\Attribute;
use App\Models\AttributeValue;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\Tax;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
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

        return Inertia::render('Products/Create', compact('taxes', 'categories'));
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
            'attribute_names' => 'required|array',
            'attribute_names.*' => 'string|max:255',
            'attribute_values' => 'required|array',
            'attribute_values.*' => 'array',
            'attribute_values.*.*' => 'string|max:255', // Cada valor de atributo debe ser una cadena
        ]);

        // Crear el producto
        $product = Product::create($request->only('product_name', 'product_description', 'product_price', 'tax_id'));

        // Asociar las categorías al producto
        $product->categories()->attach($request->categories);

        // Crear atributos y sus valores
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

        return to_route('products.index')->with('success', 'Producto creado con éxito.');
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
        $product->load(['tax', 'categories', 'attributes.attribute_values']);

        $taxes = Tax::all();
        $categories = Category::all();

        return Inertia::render('Products/Edit', compact('product', 'taxes', 'categories'));
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
            'attribute_names' => 'nullable|array',
            'attribute_names.*' => 'nullable|string|max:255',
            'attribute_values' => 'nullable|array',
            'attribute_values.*' => 'nullable|array',
            'attribute_values.*.*' => 'nullable|string|max:255', // Cada valor de atributo debe ser una cadena
        ]);

        // Extraer los datos del producto
        $data = $request->only('product_name', 'product_description', 'product_price', 'tax_id');

        // Actualizar el producto
        $product->update($data);

        // Actualizar las categorías asociadas
        $product->categories()->sync($request->categories); // Sincroniza las categorías

        // Actualizar los atributos
        if (!empty($request->attribute_names)) {
            // Primero, eliminamos las asociaciones en product_attributes
            foreach ($product->attributes as $attribute) {
                // Eliminar las asociaciones de product_attributes
                ProductAttribute::where('attribute_id', $attribute->id)->delete();
                // Eliminar los valores de atributo
                $attribute->attribute_values()->delete();
            }

            // Luego, eliminamos los atributos existentes
            $product->attributes()->delete();

            // Crear y asociar los nuevos atributos y sus valores
            foreach ($request->attribute_names as $index => $attributeName) {
                if (!empty($attributeName)) { // Asegúrate de que el atributo no esté vacío
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
        }

        return to_route('products.index')->with('success', 'Producto actualizado con éxito.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // Eliminar las relaciones en la tabla pivote
        $product->categories()->detach(); // Esto elimina las relaciones en product_categories

        // Ahora puedes eliminar el producto
        $product->delete();

        return to_route('products.index')->with('success', 'Producto eliminado con éxito.');
    }
}
