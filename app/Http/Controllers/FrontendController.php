<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Page;
use App\Models\Scopes\CompanyScope;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FrontendController extends Controller
{
    // FrontendController.php
    public function show(Request $request)
    {
        $company = $request->attributes->get('company');
        $slug = $request->route('page_path');

        $query = $company->pages()
            ->withoutGlobalScope(CompanyScope::class);

        if (is_null($slug)) {
            $page = $query->where('is_homepage', true)->firstOrFail();
        } else {
            $page = $query->where('slug', $slug)->firstOrFail();
        }

        $themeSettings = $page->theme_settings ?? $company->theme_settings ?? [];

        // Cargar los menús con sus ítems
        $availableMenus = $company->menus()->with(['items' => function ($query) {
            $query->whereNull('parent_id')->orderBy('order')->with(['children' => function ($q) {
                $q->orderBy('order')->with(['children' => function ($subQ) {
                    $subQ->orderBy('order');
                }]);
            }]);
        }])->get()->toArray();

        // OBTENER PRODUCTOS DE LA COMPAÑÍA
        $products = $company->products()
            ->with(['media', 'combinations.combinationAttributeValue.attributeValue.attribute', 'stocks'])
            ->where('is_active', true)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'product_name' => $product->product_name,
                    'slug' => $product->slug,
                    'product_price' => $product->product_price,
                    'product_price_discount' => $product->product_price_discount,
                    'product_description' => $product->product_description,
                    'media' => $product->media->map(function ($media) {
                        return [
                            'original_url' => $media->original_url,
                            'thumb_url' => $media->getUrl('thumb')
                        ];
                    }),
                    'combinations' => $product->combinations->map(function ($combination) {
                        return [
                            'id' => $combination->id,
                            'price' => $combination->combination_price,
                            'attribute_values' => $combination->combinationAttributeValue->map(function ($cav) {
                                return [
                                    'attribute_id' => $cav->attributeValue->attribute->id,
                                    'attribute_name' => $cav->attributeValue->attribute->attribute_name,
                                    'value_id' => $cav->attributeValue->id,
                                    'value_name' => $cav->attributeValue->attribute_value_name,
                                ];
                            })
                        ];
                    }),
                    'stocks' => $product->stocks->map(function ($stock) {
                        return [
                            'id' => $stock->id,
                            'quantity' => $stock->quantity,
                            'combination_id' => $stock->combination_id,
                            'barcode' => $stock->product_barcode,
                            'sku' => $stock->product_sku,
                        ];
                    })
                ];
            });

        // DETECTAR SI ES PÁGINA DE DETALLES DE PRODUCTO Y OBTENER PRODUCTO
        $currentProduct = null;
        $isProductDetailPage = false;

        // Verificar si la página actual es de detalles del producto
        // Puedes usar diferentes estrategias:
        // 1. Verificar por slug (como 'detalles-del-producto')
        // 2. Verificar por un campo en la página (como 'page_type')
        // 3. Verificar por contenido del layout

        if ($slug === 'detalles-del-producto' || $page->slug === 'detalles-del-producto') {
            $isProductDetailPage = true;

            // Obtener producto de la URL
            $productSlug = $request->query('product');

            if ($productSlug) {
                $currentProduct = $company->products()
                    ->where('slug', $productSlug)
                    ->with(['media', 'combinations.combinationAttributeValue.attributeValue.attribute', 'stocks'])
                    ->first();

                if ($currentProduct) {
                    $currentProduct = [
                        'id' => $currentProduct->id,
                        'product_name' => $currentProduct->product_name,
                        'slug' => $currentProduct->slug,
                        'product_price' => $currentProduct->product_price,
                        'product_price_discount' => $currentProduct->product_price_discount,
                        'product_description' => $currentProduct->product_description,
                        'media' => $currentProduct->media->map(function ($media) {
                            return [
                                'original_url' => $media->original_url,
                                'thumb_url' => $media->getUrl('thumb')
                            ];
                        }),
                        'combinations' => $currentProduct->combinations->map(function ($combination) {
                            return [
                                'id' => $combination->id,
                                'price' => $combination->combination_price,
                                'attribute_values' => $combination->combinationAttributeValue->map(function ($cav) {
                                    return [
                                        'attribute_id' => $cav->attributeValue->attribute->id,
                                        'attribute_name' => $cav->attributeValue->attribute->attribute_name,
                                        'value_id' => $cav->attributeValue->id,
                                        'value_name' => $cav->attributeValue->attribute_value_name,
                                    ];
                                })
                            ];
                        }),
                        'stocks' => $currentProduct->stocks->map(function ($stock) {
                            return [
                                'id' => $stock->id,
                                'quantity' => $stock->quantity,
                                'combination_id' => $stock->combination_id,
                                'barcode' => $stock->product_barcode,
                                'sku' => $stock->product_sku,
                            ];
                        })
                    ];
                }
            }
        }
        // dd($page);
        return Inertia::render('Frontend/Index', [
            'page' => $page,
            'themeSettings' => $themeSettings,
            'availableMenus' => $availableMenus,
            'products' => $products,
            'currentProduct' => $currentProduct,
            'isProductDetailPage' => $isProductDetailPage,
        ]);
    }
}
