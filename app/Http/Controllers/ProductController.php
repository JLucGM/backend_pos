<?php

namespace App\Http\Controllers;

use App\Models\Attribute;
use App\Models\AttributeValue;
use App\Models\Category;
use App\Models\Combination;
use App\Models\CombinationAttributeValue;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\ProductAttributeCombination;
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
        $product = Product::with('tax', 'stocks', 'categories')->get();


        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('Products/Index', compact('product', 'role', 'permission'));
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
        // Validar los datos de entrada
        $request->validate([
            'product_name' => 'required|string|max:255',
            'product_description' => 'nullable|string',
            'product_price' => 'required|numeric',
            'tax_id' => 'required|exists:taxes,id',
            'categories' => 'required|array',
            'categories.*' => 'exists:categories,id',
            'attribute_names' => 'nullable|array|max:3',
            'attribute_names.*' => 'nullable|string|max:255',
            'attribute_values' => 'nullable|array',
            'attribute_values.*' => 'nullable|array',
            'attribute_values.*.*' => 'nullable|string|max:255',
            'prices' => 'nullable|array',
            'quantity' => 'required|integer|min:0',
            'store_id' => 'required|exists:stores,id',
        ]);

        // Crear el producto
        $product = Product::create($request->only(
            'product_name',
            'product_description',
            'product_price',
            'product_price_discount',
            'status',
            'tax_id',
            'quantity',
            'store_id',
        ));

        // Asociar las categorías al producto
        $product->categories()->attach($request->categories);

        // Crear atributos y sus valores
        $attributeValueMap = []; // Mapa para almacenar los IDs de los valores de atributos organizados por atributo
        $attributeValueNames = []; // Mapa para almacenar los nombres de los valores de atributos

        if (!empty($request->attribute_names) && !empty($request->attribute_values)) {
            foreach ($request->attribute_names as $index => $attributeName) {
                // Crear el atributo
                $attribute = Attribute::create(['attribute_name' => $attributeName]);

                // Crear los valores del atributo
                foreach ($request->attribute_values[$index] as $value) {
                    if (!empty($value)) {
                        $attributeValue = AttributeValue::create([
                            'attribute_value_name' => $value,
                            'attribute_id' => $attribute->id,
                        ]);

                        // Agregar el ID y el nombre del valor de atributo al mapa
                        $attributeValueMap[$index][] = $attributeValue->id; // Mapeo de valor a ID
                        $attributeValueNames[$attributeValue->id] = $value; // Mapeo de ID a nombre
                    }
                }
            }
        }

        // Crear el stock del producto
        Stock::create([
            'quantity' => $request->quantity,
            'product_id' => $product->id,
            'store_id' => $request->store_id,
        ]);

        // Generar combinaciones de valores de atributos
        $combinations = $this->generateCombinations($attributeValueMap);

        // Guardar combinaciones y sus precios
        foreach ($combinations as $combination) {
            // Generar la clave usando los nombres de los atributos
            $combinationKey = implode(", ", array_map(function ($id) use ($attributeValueNames) {
                return $attributeValueNames[$id]; // Mapea el ID al nombre
            }, $combination));

            // Obtener el precio de la combinación
            $price = $request->prices[$combinationKey] ?? 0;

            // Depuración
            // \Log::info("Combination Key: $combinationKey, Price: $price");

            // Crear la combinación
            $combinationModel = Combination::create([
                'product_id' => $product->id,
                'combination_price' => $price,
            ]);

            // Guardar los valores de atributos de la combinación
            foreach ($combination as $attributeValueId) {
                CombinationAttributeValue::create([
                    'combination_id' => $combinationModel->id,
                    'attribute_value_id' => $attributeValueId,
                ]);
            }
        }

        return to_route('products.edit', $product->slug)->with('success', 'Producto creado con éxito.');
        // return to_route('products.index')->with('success', 'Producto creado con éxito.');
    }

    // Método para generar combinaciones
    private function generateCombinations($attributeValueMap)
    {
        $combinations = [];
        $values = array_values($attributeValueMap);

        $this->combine($values, $combinations, [], 0);
        return $combinations;
    }

    private function combine($arrays, &$combinations, $current, $index)
    {
        // Si hemos alcanzado el final de los arrays, agregamos la combinación actual
        if ($index === count($arrays)) {
            $combinations[] = $current;
            return;
        }

        // Iteramos sobre los valores del array actual
        foreach ($arrays[$index] as $value) {
            // Llamamos recursivamente a combine, agregando el valor actual a la combinación
            $this->combine($arrays, $combinations, array_merge($current, [$value]), $index + 1);
        }
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
        // Cargar las relaciones necesarias
        // $product->load(['tax', 'categories', 'stocks', 'combinations.attributeValues.attributeValue.attribute']);
        $product->load([
            'tax',
            'categories',
            'stocks',
            'combinations', // Cargar combinaciones
            'combinations.combinationAttributeValue', // Cargar valores de atributos de combinaciones
            'combinations.combinationAttributeValue.attributeValue', // Cargar valores de atributos relacionados
            'combinations.combinationAttributeValue.attributeValue.attribute' // Cargar atributos relacionados
        ]);

        $combinationsWithPrices = $product->combinations->mapWithKeys(function ($combination) {
            return [$combination->combinationAttributeValue->pluck('attributeValue.attribute_value_name')->join(', ') => $combination->combination_price];
        });

        // dd($combinationsWithPrices);
        $taxes = Tax::all();
        $categories = Category::all();
        $stores = Store::all();

        return Inertia::render('Products/Edit', compact('product', 'taxes', 'categories', 'stores', 'combinationsWithPrices'));
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
            'product_price_discount' => 'nullable|numeric',
            'tax_id' => 'required|exists:taxes,id',
            'categories' => 'required|array',
            'categories.*' => 'exists:categories,id',
            'quantity' => 'required|integer|min:0',
            'attribute_names' => 'nullable|array',
            'attribute_names.*' => 'nullable|string|max:255',
            'attribute_values' => 'nullable|array',
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
        ]);

        // Primero, eliminar las combinaciones existentes
        foreach ($product->combinations as $combination) {
            // Eliminar los valores de atributos asociados a la combinación
            $combination->combinationAttributeValue()->delete(); // Eliminar valores de atributos

            // Luego, eliminar la combinación
            $combination->delete();
        }

        // Obtener atributos existentes
        $existingAttributes = Attribute::with('attribute_values')->get()->keyBy('id');

        // Crear o actualizar atributos y sus valores
        $attributeValueMap = []; // Mapa para almacenar los IDs de los valores de atributos organizados por atributo
        $attributeValueNames = []; // Mapa para almacenar los nombres de los valores de atributos

        foreach ($request->attribute_names as $index => $attributeName) {
            // Verificar si el atributo ya existe
            $attribute = Attribute::firstOrCreate(
                ['attribute_name' => $attributeName],
                ['attribute_name' => $attributeName] // Puedes agregar más campos si es necesario
            );

            // Crear o actualizar los valores del atributo
            foreach ($request->attribute_values[$index] as $value) {
                if (!empty($value)) {
                    // Verificar si el valor de atributo ya existe
                    $attributeValue = AttributeValue::firstOrCreate(
                        ['attribute_value_name' => $value, 'attribute_id' => $attribute->id],
                        ['attribute_value_name' => $value] // Puedes agregar más campos si es necesario
                    );

                    // Agregar el ID y el nombre del valor de atributo al mapa
                    $attributeValueMap[$index][] = $attributeValue->id; // Mapeo de valor a ID
                    $attributeValueNames[$attributeValue->id] = $value; // Mapeo de ID a nombre
                }
            }
        }

        // Eliminar atributos que no están en la solicitud
        foreach ($existingAttributes as $existingAttribute) {
            if (!in_array($existingAttribute->attribute_name, $request->attribute_names)) {
                $existingAttribute->delete();
            }
        }

        // Generar combinaciones de valores de atributos
        $combinations = $this->generateCombinations($attributeValueMap);

        // Guardar combinaciones y sus precios
        foreach ($combinations as $combination) {
            // Generar la clave usando los nombres de los atributos
            $combinationKey = implode(", ", array_map(function ($id) use ($attributeValueNames) {
                return $attributeValueNames[$id]; // Mapea el ID al nombre
            }, $combination));

            // Obtener el precio de la combinación
            $price = $request->prices[$combinationKey] ?? 0;

            // Crear la combinación
            $combinationModel = Combination::create([
                'product_id' => $product->id,
                'combination_price' => $price,
            ]);

            // Guardar los valores de atributos de la combinación
            foreach ($combination as $attributeValueId) {
                CombinationAttributeValue::create([
                    'combination_id' => $combinationModel->id,
                    'attribute_value_id' => $attributeValueId,
                ]);
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
