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
        $product = Product::with('tax', 'stocks', 'categories','media')->get();


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
     * Store a newly created resource in storage.s
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
            'stocks' => 'nullable|array', // Asegúrate de validar el stock
            'quantity' => 'required|integer|min:0',
            'store_id' => 'required|exists:stores,id',
            'product_barcode' => 'nullable|string|max:255', // Validación para el barcode
            'product_sku' => 'nullable|string|max:255', // Validación para el SKU
        ]);

        // Crear el producto
        $product = Product::create($request->only(
            'product_name',
            'product_description',
            'product_price',
            'product_price_discount',
            'status',
            'tax_id',
            'product_status_pos',
        ));

        // Asociar las categorías al producto
        $product->categories()->attach($request->categories);

        // Manejar la carga de imágenes
        if ($request->hasFile('images')) {
            $product->addMultipleMediaFromRequest(['images'])
                ->each(function ($fileAdder) {
                    $fileAdder->toMediaCollection('products');
                });
        }

        // Crear atributos y sus valores
        $attributeValueMap = []; // Mapa para almacenar los IDs de los valores de atributos organizados por atributo
        $attributeValueNames = []; // Mapa para almacenar los nombres de los valores de atributos

        if (!empty($request->attribute_names) && !empty($request->attribute_values)) {
            foreach ($request->attribute_names as $index => $attributeName) {
                if (!empty($attributeName)) { // Verifica que el nombre del atributo no esté vacío
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
        }

        // Generar combinaciones de valores de atributos
        if (!empty($attributeValueMap)) {
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
                    // 'product_barcode' => $request->barcodes[$combinationKey] ?? null, // Guardar en combinaciones
                    // 'product_sku' => $request->skus[$combinationKey] ?? null, // Guardar en combinaciones
                ]);

                // Guardar los valores de atributos de la combinación
                foreach ($combination as $attributeValueId) {
                    CombinationAttributeValue::create([
                        'combination_id' => $combinationModel->id,
                        'attribute_value_id' => $attributeValueId,
                    ]);
                }

                // Crear el stock para la combinación
                $stockQuantity = $request->stocks[$combinationKey] ?? 0; // Obtener el stock para esta combinación
                Stock::create([
                    'quantity' => $stockQuantity,
                    'product_id' => $product->id,
                    'store_id' => $request->store_id,
                    'combination_id' => $combinationModel->id, // Relacionar el stock con la combinación
                    'product_barcode' => $request->barcodes[$combinationKey] ?? null, // Guardar en stock
                    'product_sku' => $request->skus[$combinationKey] ?? null, // Guardar en stock
                ]);
            }
        } else {
            // Si no hay combinaciones, crear un stock para el producto
            Stock::create([
                'quantity' => $request->quantity,
                'product_id' => $product->id,
                'store_id' => $request->store_id,
                'product_barcode' => $request->product_barcode, // Guardar el barcode en stock
                'product_sku' => $request->product_sku, // Guardar el SKU en stock
            ]);
        }

        return to_route('products.edit', $product->slug)->with('success', 'Producto creado con éxito.');
    }

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
        // Cargar las relaciones necesarias, incluyendo las imágenes
        $product->load(
            'tax',
            'categories',
            'stocks',
            'combinations',
            'combinations.combinationAttributeValue', // Cargar valores de atributos de combinaciones
            'combinations.combinationAttributeValue.attributeValue', // Cargar valores de atributos relacionados
            'combinations.combinationAttributeValue.attributeValue.attribute', // Cargar atributos relacionados
            'media'
        );

        // dd($product);

        // Obtener la URL de la primera imagen de la colección 'products'
        $product->image_url = $product->getFirstMediaUrl('products'); // Asegúrate de que 'products' sea el nombre de la colección

        // Obtener combinaciones con precios y stock
        $combinationsWithPrices = $product->combinations->mapWithKeys(function ($combination) use ($product) {
            // Obtener el stock correspondiente a la combinación
            $stock = $product->stocks->where('combination_id', $combination->id)->first();
            $stockQuantity = $stock ? $stock->quantity : 0; // Si no hay stock, asignar 0

            // Crear la clave de combinación y devolver el precio y el stock
            return [
                $combination->combinationAttributeValue->pluck('attributeValue.attribute_value_name')->join(', ') => [
                    'price' => $combination->combination_price,
                    'stock' => $stockQuantity,
                    'product_barcode' => $stock ? $stock->product_barcode : '', // Obtener el barcode
                    'product_sku' => $stock ? $stock->product_sku : '', // Obtener el SKU
                ]
            ];
        });

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
            'store_id' => 'required|exists:stores,id', // Asegúrate de validar el store_id
        ]);

        // Extraer los datos del producto
        $data = $request->only(
            'product_name',
            'product_description',
            'product_price',
            'product_price_discount',
            'status',
            'tax_id',
            'product_status_pos'
        );

        // Actualizar el producto
        $product->update($data);

        // Actualizar las categorías asociadas
        $product->categories()->sync($request->categories);

        // Proporcionar valores predeterminados para attribute_names y attribute_values
        $attributeNames = $request->input('attribute_names', []);
        $attributeValues = $request->input('attribute_values', []);

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

        foreach ($attributeNames as $index => $attributeName) {
            // Verificar si el atributo ya existe
            $attribute = Attribute::firstOrCreate(
                ['attribute_name' => $attributeName],
                ['attribute_name' => $attributeName] // Puedes agregar más campos si es necesario
            );

            // Crear o actualizar los valores del atributo
            foreach ($attributeValues[$index] as $value) {
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
            if (!in_array($existingAttribute->attribute_name, $attributeNames)) {
                // Solo eliminar si no hay valores asociados
                if ($existingAttribute->attribute_values->isEmpty()) {
                    $existingAttribute->delete();
                }
            }
        }

        // Solo generar combinaciones si hay atributos y valores
        if (!empty($attributeValueMap)) {
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
                    // 'product_barcode' => $request->barcodes[$combinationKey] ?? null, // Guardar el barcode
                    // 'product_sku' => $request->skus[$combinationKey] ?? null, // Guardar el SKU
                ]);

                // Guardar los valores de atributos de la combinación
                foreach ($combination as $attributeValueId) {
                    CombinationAttributeValue::create([
                        'combination_id' => $combinationModel->id,
                        'attribute_value_id' => $attributeValueId,
                    ]);
                }

                // Actualizar el stock de la combinación
                $stockQuantity = $request->stocks[$combinationKey] ?? 0; // Obtener el stock de la combinación
                Stock::updateOrCreate(
                    [
                        'combination_id' => $combinationModel->id,
                        'product_id' => $product->id,
                        'store_id' => $request->store_id, // Asegúrate de que el stock esté relacionado con la tienda
                    ],
                    [
                        'quantity' => $stockQuantity,
                        'product_barcode' => $request->barcodes[$combinationKey] ?? null, // Guardar el barcode en stock
                        'product_sku' => $request->skus[$combinationKey] ?? null, // Guardar el SKU en stock
                    ]
                );
            }
        } else {
            // Si no hay combinaciones, crear un stock para el producto
            Stock::updateOrCreate(
                [
                    'product_id' => $product->id,
                    'store_id' => $request->store_id, // Asegúrate de que el stock esté relacionado con la tienda
                    'combination_id' => null, // No hay combinación
                ],
                [
                    'quantity' => $request->quantity,
                    'product_barcode' => $request->product_barcode, // Guardar el barcode en stock
                    'product_sku' => $request->product_sku, // Guardar el SKU en stock
                ]
            );
        }

        if ($request->hasFile('images')) {
            $product->addMultipleMediaFromRequest(['images'])
                ->each(function ($fileAdder) {
                    $fileAdder->toMediaCollection('products');
                });
        }

        return to_route('products.edit', $product->slug)->with('success', 'Producto actualizado con éxito.');
    }

    public function destroyImage($productId, $imageId)
    {
        // Buscar el producto por su ID
        $product = Product::findOrFail($productId);

        // Buscar la imagen en la colección de medios del producto
        $mediaItem = $product->getMedia('products')->find($imageId); // Asegúrate de que 'images' sea el nombre de tu colección

        // Verificar si la imagen existe
        if ($mediaItem) {
            // Eliminar la imagen
            $mediaItem->delete();

            // Retornar una respuesta exitosa
            // return response()->json(['message' => 'Imagen eliminada con éxito.'], 200);
        }

        // Si la imagen no se encuentra, retornar un error 404
        // return response()->json(['message' => 'Imagen no encontrada.'], 404);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        DB::transaction(function () use ($product) {

            $product->categories()->detach();
            $product->stocks()->delete();
            // 1. Eliminar combinaciones asociadas
            $combinations = $product->combinations()->with('combinationAttributeValue')->get();

            foreach ($combinations as $combination) {
                // 2. Eliminar los valores de atributo asociados
                foreach ($combination->combinationAttributeValue as $combinationAttributeValue) {
                    $combinationAttributeValue->delete();
                }

                // 3. Eliminar la combinación
                $combination->delete();
            }

            // 4. Eliminar el producto
            $product->delete();

            // 5. Eliminar atributos y valores que no están en uso
            // $attributeValues = AttributeValue::whereIn('id', $combinations->pluck('combinationAttributeValue.*.attribute_value_id'))->get();

            $attributeValues = AttributeValue::whereIn('id', $combinations->flatMap(function ($combination) {
                return $combination->combinationAttributeValue->pluck('attribute_value_id');
            }))->get();

            foreach ($attributeValues as $attributeValue) {
                // Eliminar el valor de atributo
                $attributeValue->delete();

                // Verificar si el atributo tiene otros valores asociados
                $attribute = $attributeValue->attribute;
                if ($attribute->attribute_values()->count() === 0) {
                    // Si no hay más valores, eliminar el atributo
                    $attribute->delete();
                }
            }
        });

        return to_route('products.index')->with('success', 'Producto eliminado con éxito.');
    }


    public function duplicate($product)
    {
        // Obtener el producto original con todas sus relaciones
        $originalProduct = Product::with([
            'categories',
            'stocks',
            'combinations.combinationAttributeValue.attributeValue',
            'media'
        ])->findOrFail($product);

        // Crear una copia del producto
        $newProduct = $originalProduct->replicate();
        $newProduct->product_name = $originalProduct->product_name . ' (Copia)';
        $newProduct->slug = null; // Asegúrate de que el slug sea único
        $newProduct->save();

        // Duplicar las categorías asociadas
        $newProduct->categories()->attach($originalProduct->categories->pluck('id'));

        // Duplicar los stocks que no están asociados a combinaciones
        foreach ($originalProduct->stocks as $stock) {
            if ($stock->combination_id === null) {
                $newStock = $stock->replicate();
                $newStock->product_id = $newProduct->id;
                $newStock->save();
            }
        }

        // Duplicar las combinaciones y sus valores de atributos
        foreach ($originalProduct->combinations as $combination) {
            $newCombination = $combination->replicate();
            $newCombination->product_id = $newProduct->id;
            $newCombination->save();

            foreach ($combination->combinationAttributeValue as $combinationAttributeValue) {
                $newCombinationAttributeValue = $combinationAttributeValue->replicate();
                $newCombinationAttributeValue->combination_id = $newCombination->id;
                $newCombinationAttributeValue->save();
            }

            // Duplicar el stock de la combinación
            $originalStock = $originalProduct->stocks->where('combination_id', $combination->id)->first();
            if ($originalStock) {
                $newStock = $originalStock->replicate();
                $newStock->product_id = $newProduct->id;
                $newStock->combination_id = $newCombination->id;
                $newStock->save();
            }
        }

        // Duplicar las imágenes asociadas
        foreach ($originalProduct->getMedia('products') as $mediaItem) {
            $newProduct->addMedia($mediaItem->getPath())
                ->preservingOriginal()
                ->toMediaCollection('products');
        }

        return to_route('products.edit', $newProduct->slug)->with('success', 'Producto duplicado con éxito.');
    }
}
