<?php

namespace App\Http\Controllers;

use App\Http\Requests\Products\StoreRequest;
use App\Http\Requests\Products\UpdateRequest;
use App\Models\Attribute;
use App\Models\AttributeValue;
use App\Models\Category;
use App\Models\Combination;
use App\Models\CombinationAttributeValue;
use App\Models\Product;
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
        $user = Auth::user();
        $product = Product::with('stocks', 'categories', 'media')->get();

        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('Products/Index', compact('product', 'role', 'permission'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();
        $categories = Category::all();
        $taxes = Tax::all();
        $stores = Store::where('company_id', $user->company_id)->get();

        return Inertia::render('Products/Create', compact('categories', 'taxes', 'stores'));
    }

    /**
     * Store a newly created resource in storage.s
     */
    public function store(StoreRequest $request)
    {
        // dd($request->all());
        $user = Auth::user();

        // Obtener todas las tiendas de la compañía
        $stores = Store::where('company_id', $user->company_id)->get();

        // Si no hay tiendas, usar una por defecto (la primera con ecommerce activo)
        if ($stores->isEmpty()) {
            return back()->withErrors('No hay tiendas configuradas para esta compañía.');
        }

        // Crear el producto
        $product = Product::create(array_merge(
            $request->only(
                'product_name',
                'product_description',
                'product_price',
                'product_price_discount',
                'is_active',
                'product_status_pos',
                'tax_id',
            ),
            ['company_id' => $user->company_id]
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
        $attributeValueMap = [];
        $attributeValueNames = [];

        if (!empty($request->attribute_names) && !empty($request->attribute_values)) {
            foreach ($request->attribute_names as $index => $attributeName) {
                if (!empty($attributeName)) {
                    // Buscar o crear el atributo
                    $attribute = Attribute::firstOrCreate(
                        ['attribute_name' => $attributeName],
                    );

                    // Crear los valores del atributo
                    if (isset($request->attribute_values[$index])) {
                        foreach ($request->attribute_values[$index] as $value) {
                            if (!empty($value)) {
                                // Buscar o crear el valor del atributo
                                $attributeValue = AttributeValue::firstOrCreate(
                                    ['attribute_value_name' => $value, 'attribute_id' => $attribute->id]
                                );

                                $attributeValueMap[$attribute->id][] = $attributeValue->id;
                                $attributeValueNames[$attributeValue->id] = $value;
                            }
                        }
                    }
                }
            }
        }

        // Preparar datos de combinaciones
        $incomingCombinationsData = [];
        if (is_array($request->prices)) {
            foreach ($request->prices as $comboData) {
                if (isset($comboData['_key'])) {
                    $incomingCombinationsData[$comboData['_key']] = $comboData;
                }
            }
        }

        // Generar combinaciones de valores de atributos
        if (!empty($attributeValueMap)) {
            $allAttributeValueIds = [];
            foreach ($attributeValueMap as $attributeId => $valueIds) {
                $allAttributeValueIds[] = $valueIds;
            }

            $combinations = $this->generateCombinations($allAttributeValueIds);

            // Guardar combinaciones y sus precios para cada tienda
            foreach ($combinations as $combinationIds) {
                $combinationKey = implode(", ", array_map(function ($id) use ($attributeValueNames) {
                    return $attributeValueNames[$id] ?? '';
                }, $combinationIds));

                $comboDetails = $incomingCombinationsData[$combinationKey] ?? [
                    'combination_price' => '0',
                    'stocks_by_store' => []
                ];

                // Obtener el precio base de la combinación
                $combinationPrice = $comboDetails['combination_price'] ?? '0';

                // Crear la combinación con el precio base
                $combinationModel = Combination::create([
                    'product_id' => $product->id,
                    'combination_price' => $combinationPrice,
                ]);

                // Guardar los valores de atributos de la combinación
                foreach ($combinationIds as $attributeValueId) {
                    CombinationAttributeValue::create([
                        'combination_id' => $combinationModel->id,
                        'attribute_value_id' => $attributeValueId,
                    ]);
                }

                // Crear stock para cada tienda CON SU PROPIO PRECIO
                foreach ($stores as $store) {
                    // Obtener datos específicos de esta combinación y tienda
                    $storeData = $comboDetails['stocks_by_store'][$store->id] ?? [
                        'price' => $combinationPrice, // Usar el precio base de la combinación como fallback
                        'stock' => '0',
                        'product_barcode' => null,
                        'product_sku' => null
                    ];

                    // Determinar qué precio usar: específico por tienda o precio base de la combinación
                    $storePrice = $storeData['price'] ?? $combinationPrice;

                    Stock::create([
                        'quantity' => $storeData['stock'] ?? '0',
                        'price' => $storePrice,
                        'product_id' => $product->id,
                        'combination_id' => $combinationModel->id,
                        'product_barcode' => $storeData['product_barcode'] ?? null,
                        'product_sku' => $storeData['product_sku'] ?? null,
                        'company_id' => $user->company_id,
                        'store_id' => $store->id,
                    ]);
                }
            }
        } else {
            // Producto simple: crear stock para cada tienda
            foreach ($stores as $store) {
                // Obtener datos específicos de esta tienda
                $storeData = $request->stores_data[$store->id] ?? [
                    'quantity' => $request->quantity ?? '0',
                    'product_barcode' => $request->product_barcode,
                    'product_sku' => $request->product_sku
                ];

                Stock::create([
                    'quantity' => $storeData['quantity'],
                    'product_id' => $product->id,
                    'product_barcode' => $storeData['product_barcode'],
                    'product_sku' => $storeData['product_sku'],
                    'company_id' => $user->company_id,
                    'store_id' => $store->id, // ¡AGREGAR STORE_ID!
                ]);
            }
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
        $user = Auth::user();
        if ($product->company_id !== $user->company_id) {
            abort(403, 'No tienes permiso para esta operación.');
        }

        // Obtener todas las tiendas de la compañía
        $stores = Store::where('company_id', $user->company_id)->get();

        // Cargar las relaciones necesarias, incluyendo las imágenes
        $product->load(
            'categories',
            'stocks.store', // Cargar relación con tienda
            'combinations.combinationAttributeValue.attributeValue.attribute',
            'media',
        );

        // Obtener la URL de la primera imagen de la colección 'products'
        $product->image_url = $product->getFirstMediaUrl('products');

        // Preparar datos de combinaciones con stocks por tienda
        $combinationsData = [];
        foreach ($product->combinations as $combination) {
            $stocksByStore = [];

            foreach ($stores as $store) {
                $stock = $product->stocks->where('store_id', $store->id)
                    ->where('combination_id', $combination->id)
                    ->first();

                $stocksByStore[$store->id] = [
                    'price' => $stock ? $stock->price : '0',
                    'stock' => $stock ? $stock->quantity : 0,
                    'product_barcode' => $stock ? $stock->product_barcode : '',
                    'product_sku' => $stock ? $stock->product_sku : '',
                ];
            }

            $combinationsData[] = [
                'id' => $combination->id,
                '_key' => 'existing_' . $combination->id,
                'combination_price' => $combination->combination_price,
                'stocks_by_store' => $stocksByStore,
                'combination_attribute_value' => $combination->combinationAttributeValue->map(function ($cav) {
                    return [
                        'attribute_value' => [
                            'attribute_value_name' => $cav->attributeValue->attribute_value_name,
                            'attribute' => [
                                'attribute_name' => $cav->attributeValue->attribute->attribute_name,
                            ]
                        ]
                    ];
                }),
            ];
        }

        $categories = Category::all();
        $taxes = Tax::all();

        return Inertia::render('Products/Edit', compact(
            'product',
            'categories',
            'taxes',
            'stores',
            'combinationsData'
        ));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Product $product)
    {
        $user = Auth::user();

        if ($product->company_id !== $user->company_id) {
            abort(403, 'No tienes permiso para esta operación.');
        }

        // Obtener todas las tiendas de la compañía
        $stores = Store::where('company_id', $user->company_id)->get();

        // Update product's main details
        $product->update($request->only(
            'product_name',
            'product_description',
            'product_price',
            'product_price_discount',
            'is_active',
            'product_status_pos',
            'tax_id',
        ));

        // Sync categories
        $product->categories()->sync($request->categories);

        // Handle image uploads
        if ($request->hasFile('images')) {
            $product->addMultipleMediaFromRequest(['images'])
                ->each(function ($fileAdder) {
                    $fileAdder->toMediaCollection('products');
                });
        }

        $attributeMap = []; // [attribute_name => attribute_id]
        $attributeValueNameToIdMap = []; // [attribute_value_name => attribute_value_id]

        $incomingAttributeNames = $request->input('attribute_names', []);
        $incomingAttributeValues = $request->input('attribute_values', []);

        $currentRequestAttributeIds = [];
        $currentRequestAttributeValueIds = [];

        foreach ($incomingAttributeNames as $index => $attributeName) {
            if (!empty($attributeName)) {
                $attribute = Attribute::firstOrCreate(
                    ['attribute_name' => $attributeName],
                );
                $attributeMap[$attributeName] = $attribute->id;
                $currentRequestAttributeIds[] = $attribute->id;

                if (isset($incomingAttributeValues[$index]) && is_array($incomingAttributeValues[$index])) {
                    foreach ($incomingAttributeValues[$index] as $value) {
                        if (!empty($value)) {
                            $attributeValue = AttributeValue::firstOrCreate(
                                ['attribute_value_name' => $value, 'attribute_id' => $attribute->id]
                            );
                            $attributeValueNameToIdMap[$value] = $attributeValue->id;
                            $currentRequestAttributeValueIds[] = $attributeValue->id;
                        }
                    }
                }
            }
        }

        $existingProductAttributeIds = $product->attributes ? $product->attributes->pluck('id') : collect();

        AttributeValue::whereIn('attribute_id', $existingProductAttributeIds)
            ->whereNotIn('id', $currentRequestAttributeValueIds)
            ->delete();

        Attribute::whereIn('id', $existingProductAttributeIds)
            ->whereNotIn('id', $currentRequestAttributeIds)
            ->doesntHave('attribute_values')
            ->delete();

        // --- Combination and Stock Management ---
        $processedCombinationIds = [];

        if (is_array($request->prices) && !empty($request->prices)) {
            // Product is now variable: delete simple stock and create/update combinations
            $product->stocks()->whereNull('combination_id')->delete();

            foreach ($request->prices as $comboData) {
                $combinationId = $comboData['id'] ?? null;
                $combinationKey = $comboData['_key'] ?? null;

                // Obtener stocks por tienda para esta combinación
                $stocksByStore = $comboData['stocks_by_store'] ?? [];

                $currentComboAttributeValueIds = [];
                if (isset($comboData['combination_attribute_value']) && is_array($comboData['combination_attribute_value'])) {
                    foreach ($comboData['combination_attribute_value'] as $attrValData) {
                        $attrValueName = $attrValData['attribute_value']['attribute_value_name'] ?? null;
                        if ($attrValueName && isset($attributeValueNameToIdMap[$attrValueName])) {
                            $currentComboAttributeValueIds[] = $attributeValueNameToIdMap[$attrValueName];
                        }
                    }
                }

                $combinationModel = null;
                if ($combinationId) {
                    $combinationModel = Combination::find($combinationId);
                }

                if (!$combinationModel && $combinationKey) {
                    // Buscar por clave
                    $combinationModel = $product->combinations()->where('id', str_replace('existing_', '', $combinationKey))->first();
                }

                if ($combinationModel) {
                    $combinationModel->update([
                        'combination_price' => $comboData['combination_price'] ?? '0',
                    ]);
                } else {
                    $combinationModel = Combination::create([
                        'product_id' => $product->id,
                        'combination_price' => $comboData['combination_price'] ?? '0',
                    ]);
                }

                $combinationModel->combinationAttributeValue()->delete();
                foreach ($currentComboAttributeValueIds as $attributeValueId) {
                    CombinationAttributeValue::create([
                        'combination_id' => $combinationModel->id,
                        'attribute_value_id' => $attributeValueId,
                    ]);
                }

                $processedCombinationIds[] = $combinationModel->id;

                // Crear o actualizar stock para cada tienda
                foreach ($stores as $store) {
                    $storeData = $stocksByStore[$store->id] ?? [
                        'price' => $comboData['combination_price'] ?? '0',
                        'stock' => '0',
                        'product_barcode' => null,
                        'product_sku' => null
                    ];

                    Stock::updateOrCreate(
                        [
                            'product_id' => $product->id,
                            'combination_id' => $combinationModel->id,
                            'store_id' => $store->id,
                            'company_id' => $user->company_id,
                        ],
                        [
                            'quantity' => $storeData['stock'] ?? '0',
                            'price' => $storeData['price'] ?? '0',
                            'product_barcode' => $storeData['product_barcode'] ?? null,
                            'product_sku' => $storeData['product_sku'] ?? null,
                            'company_id' => $user->company_id,
                        ]
                    );
                }
            }

            // Delete old combinations and stocks
            $product->combinations()->whereNotIn('id', $processedCombinationIds)->delete();
            $product->stocks()->whereNotNull('combination_id')->whereNotIn('combination_id', $processedCombinationIds)->delete();
        } else {
            // Product is now simple: delete all combinations and their stocks, keep/create simple stock
            $product->combinations()->delete();
            $product->stocks()->whereNotNull('combination_id')->delete();

            // Para cada tienda, crear o actualizar el stock simple
            foreach ($stores as $store) {
                $storeData = $request->stores_data[$store->id] ?? [
                    'quantity' => $request->quantity ?? '0',
                    'product_barcode' => $request->product_barcode ?? null,
                    'product_sku' => $request->product_sku ?? null
                ];

                // CORRECCIÓN: Asegurar que store_id se guarda
                Stock::updateOrCreate(
                    [
                        'product_id' => $product->id,
                        'combination_id' => null,
                        'store_id' => $store->id, // Agregar store_id a la búsqueda
                    ],
                    [
                        'quantity' => $storeData['quantity'] ?? '0',
                        'product_barcode' => $storeData['product_barcode'] ?? null,
                        'product_sku' => $storeData['product_sku'] ?? null,
                        'store_id' => $store->id, // Agregar store_id a los datos
                        'company_id' => $user->company_id,
                    ]
                );
            }
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
        $user = Auth::user();
        if ($product->company_id !== $user->company_id) {
            abort(403, 'No tienes permiso para esta operación.');
        }

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
            'combinations',
            'combinations.combinationAttributeValue', // Cargar valores de atributos de combinaciones
            'combinations.combinationAttributeValue.attributeValue', // Cargar valores de atributos relacionados
            'combinations.combinationAttributeValue.attributeValue.attribute', // Cargar atributos relacionados
            'media',
            'company'
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
