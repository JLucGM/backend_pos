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
        $categories = Category::all();
        $taxes = Tax::all();

        return Inertia::render('Products/Create', compact('categories', 'taxes'));
    }

    /**
     * Store a newly created resource in storage.s
     */
    public function store(StoreRequest $request)
    {
        $user = Auth::user();

        // Crear el producto
        $product = Product::create(array_merge(
            $request->only(
                'product_name',
                'product_description',
                'product_price',
                'product_price_discount',
                'status',
                'product_status_pos',
                'tax_id', // Asegúrate de que 'tax_id' esté en el formulario y sea opcional
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
        $attributeValueMap = []; // Mapa para almacenar los IDs de los valores de atributos organizados por atributo
        $attributeValueNames = []; // Mapa para almacenar los nombres de los valores de atributos (ID a Nombre)

        if (!empty($request->attribute_names) && !empty($request->attribute_values)) {
            foreach ($request->attribute_names as $index => $attributeName) {
                if (!empty($attributeName)) { // Verifica que el nombre del atributo no esté vacío
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

                                // Agregar el ID y el nombre del valor de atributo al mapa
                                $attributeValueMap[$attribute->id][] = $attributeValue->id; // Mapeo de atributo_id a valor_id
                                $attributeValueNames[$attributeValue->id] = $value; // Mapeo de valor_id a nombre
                            }
                        }
                    }
                }
            }
        }

        // Prepare a lookup map for incoming combination data (prices, stocks, barcodes, skus)
        // This is the key change to correctly access the data from the frontend's 'prices' array.
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
            // Flatten attributeValueMap to get all attribute value IDs for combination generation
            $allAttributeValueIds = [];
            foreach ($attributeValueMap as $attributeId => $valueIds) {
                $allAttributeValueIds[] = $valueIds;
            }

            // Generate combinations of attribute value IDs
            $combinations = $this->generateCombinations($allAttributeValueIds);

            // Guardar combinaciones y sus precios
            foreach ($combinations as $combinationIds) {
                // Generate the key using the names of the attribute values for lookup
                $combinationKey = implode(", ", array_map(function ($id) use ($attributeValueNames) {
                    return $attributeValueNames[$id] ?? ''; // Map the ID to the name, default to empty string if not found
                }, $combinationIds));

                // Get the specific combination data from the prepared map
                $comboDetails = $incomingCombinationsData[$combinationKey] ?? [
                    'combination_price' => '0',
                    'stock' => '0',
                    'product_barcode' => null,
                    'product_sku' => null
                ];

                // Crear la combinación
                $combinationModel = Combination::create([
                    'product_id' => $product->id,
                    'combination_price' => $comboDetails['combination_price'], // Correctly get price
                ]);

                // Guardar los valores de atributos de la combinación
                foreach ($combinationIds as $attributeValueId) {
                    CombinationAttributeValue::create([
                        'combination_id' => $combinationModel->id,
                        'attribute_value_id' => $attributeValueId,
                    ]);
                }

                // Crear el stock para la combinación
                Stock::create([
                    'quantity' => $comboDetails['stock'], // Correctly get stock
                    'product_id' => $product->id,
                    'combination_id' => $combinationModel->id, // Relacionar el stock con la combinación
                    'product_barcode' => $comboDetails['product_barcode'], // Correctly get barcode
                    'product_sku' => $comboDetails['product_sku'], // Correctly get SKU
                    'company_id' => $user->company_id, // Asegúrate de que el stock esté asociado a la empresa
                ]);
            }
        } else {
            // Si no hay combinaciones (producto simple), crear un stock para el producto
            Stock::create([
                'quantity' => $request->quantity,
                'product_id' => $product->id,
                'product_barcode' => $request->product_barcode, // Guardar el barcode en stock
                'product_sku' => $request->product_sku, // Guardar el SKU en stock
                'company_id' => $user->company_id, // Asegúrate de que el stock esté asociado a la empresa
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
        $user = Auth::user();
        if ($product->company_id !== $user->company_id) {
            abort(403, 'No tienes permiso para esta operación.');
        }

        // Cargar las relaciones necesarias, incluyendo las imágenes
        $product->load(
            'categories',
            'stocks',
            'combinations',
            'combinations.combinationAttributeValue', // Cargar valores de atributos de combinaciones
            'combinations.combinationAttributeValue.attributeValue', // Cargar valores de atributos relacionados
            'combinations.combinationAttributeValue.attributeValue.attribute', // Cargar atributos relacionados
            'media',
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

        $categories = Category::all();
        $taxes = Tax::all();

        return Inertia::render('Products/Edit', compact('product', 'categories', 'combinationsWithPrices', 'taxes'));
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

        // Update product's main details
        $product->update($request->only(
            'product_name',
            'product_description',
            'product_price',
            'product_price_discount',
            'status',
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

        // --- Attribute and Attribute Value Management ---
        $attributeMap = []; // [attribute_name => attribute_id]
        $attributeValueNameToIdMap = []; // [attribute_value_name => attribute_value_id]

        // Process incoming attribute names and values
        $incomingAttributeNames = $request->input('attribute_names', []);
        $incomingAttributeValues = $request->input('attribute_values', []);

        // Collect IDs of attributes and attribute values that are in the current request
        $currentRequestAttributeIds = [];
        $currentRequestAttributeValueIds = [];

        foreach ($incomingAttributeNames as $index => $attributeName) {
            if (!empty($attributeName)) {
                // Find or create the attribute
                $attribute = Attribute::firstOrCreate(
                    ['attribute_name' => $attributeName],
                );
                $attributeMap[$attributeName] = $attribute->id;
                $currentRequestAttributeIds[] = $attribute->id;

                if (isset($incomingAttributeValues[$index]) && is_array($incomingAttributeValues[$index])) {
                    foreach ($incomingAttributeValues[$index] as $value) {
                        if (!empty($value)) {
                            // Find or create the attribute value
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

        // Get existing attribute IDs for the product, safely handling null attributes
        $existingProductAttributeIds = $product->attributes ? $product->attributes->pluck('id') : collect();

        // Delete attribute values not in the current request
        AttributeValue::whereIn('attribute_id', $existingProductAttributeIds)
            ->whereNotIn('id', $currentRequestAttributeValueIds)
            ->delete();

        // Then, delete attributes not in the current request (only if they have no remaining values)
        Attribute::whereIn('id', $existingProductAttributeIds)
            ->whereNotIn('id', $currentRequestAttributeIds)
            ->doesntHave('attribute_values') // Only delete if no associated values
            ->delete();


        // --- Combination and Stock Management ---
        $processedCombinationIds = []; // To track combinations that were processed in this request

        if (is_array($request->prices) && !empty($request->prices)) {
            // Product has combinations
            foreach ($request->prices as $comboData) {
                $combinationId = $comboData['id'] ?? null;
                $combinationPrice = $comboData['combination_price'] ?? '0';
                $stockQuantity = $comboData['stock'] ?? '0';
                $productBarcode = $comboData['product_barcode'] ?? null;
                $productSku = $comboData['product_sku'] ?? null;

                // Determine attribute value IDs for this combination from incoming data
                $currentComboAttributeValueIds = [];
                if (isset($comboData['combination_attribute_value']) && is_array($comboData['combination_attribute_value'])) {
                    foreach ($comboData['combination_attribute_value'] as $attrValData) {
                        $attrValueName = $attrValData['attribute_value']['attribute_value_name'] ?? null;
                        if ($attrValueName && isset($attributeValueNameToIdMap[$attrValueName])) {
                            $currentComboAttributeValueIds[] = $attributeValueNameToIdMap[$attrValueName];
                        }
                    }
                }

                // Find or create the combination
                $combinationModel = null;
                if ($combinationId) {
                    $combinationModel = Combination::find($combinationId);
                }

                if (!$combinationModel && !empty($currentComboAttributeValueIds)) {
                    // If no ID or not found by ID, try to find by its attribute values
                    $combinationModel = $product->combinations()->whereHas('combinationAttributeValue', function ($query) use ($currentComboAttributeValueIds) {
                        $query->whereIn('attribute_value_id', $currentComboAttributeValueIds);
                    }, '=', count($currentComboAttributeValueIds))
                        ->first();
                }

                if ($combinationModel) {
                    // Update existing combination
                    $combinationModel->update([
                        'combination_price' => $combinationPrice,
                    ]);
                } else {
                    // Create new combination
                    $combinationModel = Combination::create([
                        'product_id' => $product->id,
                        'combination_price' => $combinationPrice,
                    ]);
                }

                // --- Correct way to "sync" CombinationAttributeValue for HasMany relationship ---
                // First, delete existing CombinationAttributeValue records for this combination
                $combinationModel->combinationAttributeValue()->delete();
                // Then, create new ones based on the current data
                foreach ($currentComboAttributeValueIds as $attributeValueId) {
                    CombinationAttributeValue::create([
                        'combination_id' => $combinationModel->id,
                        'attribute_value_id' => $attributeValueId,
                    ]);
                }
                // --- End of fix for sync() ---

                // Track processed combination ID
                $processedCombinationIds[] = $combinationModel->id;

                // Handle stock for this combination (update or create)
                Stock::updateOrCreate(
                    [
                        'product_id' => $product->id,
                        'combination_id' => $combinationModel->id,
                    ],
                    [
                        'quantity' => $stockQuantity,
                        'product_barcode' => $productBarcode,
                        'product_sku' => $productSku,
                    ]
                );
            }

            // Delete combinations and their stocks that are no longer in the request
            $product->combinations()->whereNotIn('id', $processedCombinationIds)->delete();
            $product->stocks()->whereNotNull('combination_id')->whereNotIn('combination_id', $processedCombinationIds)->delete();
        } else {
            // Product is now a simple product (no combinations or all removed)
            // Delete all existing combinations and their associated stocks for this product
            $product->combinations()->delete();
            $product->stocks()->whereNotNull('combination_id')->delete();

            // Update or create the single stock entry for the simple product
            Stock::updateOrCreate(
                [
                    'product_id' => $product->id,
                    'combination_id' => null, // For simple products, combination_id is null
                ],
                [
                    'quantity' => $request->quantity,
                    'product_barcode' => $request->product_barcode,
                    'product_sku' => $request->product_sku,
                ]
            );
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
