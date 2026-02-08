<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Page;
use App\Models\Scopes\CompanyScope;
use App\Models\Setting;
use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FrontendController extends Controller
{
    public function show(Request $request)
    {
        $company = $request->attributes->get('company');
        $slug = $request->route('page_path');

        // Obtener settings con currency
        $setting = Setting::with('currency')->where('company_id', $company->id)->first();

        $logoUrl = null;
        if ($company->setting && $company->setting->getFirstMedia('logo')) {
            $logoUrl = $company->setting->getFirstMedia('logo')->getUrl();
        }

        // Obtener también favicon si lo necesitas
        $faviconUrl = null;
        if ($company->setting && $company->setting->getFirstMedia('favicon')) {
            $faviconUrl = $company->setting->getFirstMedia('favicon')->getUrl();
        }

        $query = $company->pages()
            ->withoutGlobalScope(CompanyScope::class);

        if (is_null($slug)) {
            $page = $query->where('is_homepage', true)->firstOrFail();
        } else {
            $page = $query->where('slug', $slug)->firstOrFail();
        }

        $themeSettings = $page->theme_settings ?? $company->theme_settings ?? [];

        // Cargar los menús
        $availableMenus = $company->menus()->with(['items' => function ($query) {
            $query->whereNull('parent_id')->orderBy('order')->with(['children' => function ($q) {
                $q->orderBy('order')->with(['children' => function ($subQ) {
                    $subQ->orderBy('order');
                }]);
            }]);
        }])->get()->toArray();

        // Obtener países, estados y ciudades para el ProfileComponent
        $countries = \App\Models\Country::all();
        $states = \App\Models\State::all();
        $cities = \App\Models\City::all();

        // AGREGAR: Obtener la tienda principal con e-commerce activo
        $mainStore = Store::where('company_id', $company->id)
            ->where('is_ecommerce_active', true)
            ->first();

        // Si no hay tienda con e-commerce activo, tomar la primera tienda
        if (!$mainStore) {
            $mainStore = Store::where('company_id', $company->id)->first();
        }

        // Obtener productos activos con relaciones y filtrar por stock en la tienda principal
        $products = $company->products()
            ->where('is_active', true)
            ->with([
                'categories',
                'media',
                'stocks' => function ($query) use ($mainStore) {
                    // Filtrar stocks solo de la tienda principal
                    if ($mainStore) {
                        $query->where('store_id', $mainStore->id);
                    }
                },
                'taxes',
                'combinations.combinationAttributeValue.attributeValue.attribute',
                'discounts'
            ])
            ->get()
            ->map(function ($product) use ($mainStore) {
                // Filtrar combinaciones que tengan stock en la tienda principal
                if ($product->combinations && $product->combinations->isNotEmpty() && $mainStore) {
                    $product->combinations = $product->combinations->filter(function ($combination) use ($mainStore) {
                        $stock = $combination->stocks->where('store_id', $mainStore->id)
                            ->where('quantity', '>', 0)
                            ->first();
                        return $stock !== null;
                    });
                }

                return [
                    'id' => $product->id,
                    'product_name' => $product->product_name,
                    'slug' => $product->slug,
                    'product_price' => $product->product_price,
                    'product_price_discount' => $product->product_price_discount,
                    'product_description' => $product->product_description,
                    'tax_id' => $product->tax_id,
                    'tax' => $product->taxes ? [
                        'id' => $product->taxes->id,
                        'tax_name' => $product->taxes->tax_name,
                        'tax_rate' => $product->taxes->tax_rate,
                        'slug' => $product->taxes->slug,
                    ] : null,
                    'categories' => $product->categories->map(function ($category) {
                        return [
                            'id' => $category->id,
                            'category_name' => $category->category_name,
                            'slug' => $category->slug,
                        ];
                    }),
                    'media' => $product->media->map(function ($media) {
                        return [
                            'id' => $media->id,
                            'original_url' => $media->original_url,
                            'thumb_url' => $media->getUrl('thumb')
                        ];
                    }),
                    'combinations' => $product->combinations->map(function ($combination) use ($mainStore) {
                        // Obtener stock de esta combinación en la tienda principal
                        $stock = null;
                        if ($mainStore && $combination->stocks) {
                            $stock = $combination->stocks->where('store_id', $mainStore->id)->first();
                        }

                        return [
                            'id' => $combination->id,
                            'price' => $combination->combination_price,
                            'stock' => $stock ? $stock->quantity : 0,
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
                    }),
                    'discounts' => $product->discounts->map(function ($discount) {
                        return [
                            'id' => $discount->id,
                            'name' => $discount->name,
                            'code' => $discount->code,
                            'discount_type' => $discount->discount_type,
                            'value' => $discount->value,
                            'applies_to' => $discount->applies_to,
                            'pivot' => [
                                'combination_id' => $discount->pivot->combination_id ?? null
                            ]
                        ];
                    })
                ];
            })
            // Filtrar productos que tengan stock en la tienda principal (ya sea simple o con combinaciones)
            ->filter(function ($product) use ($mainStore) {
                if (!$mainStore) return true;

                // Para productos simples, verificar stock
                if (empty($product['combinations'])) {
                    $stock = collect($product['stocks'])->where('store_id', $mainStore->id)
                        ->where('quantity', '>', 0)
                        ->first();
                    return $stock !== null;
                }

                // Para productos con combinaciones, verificar que al menos una combinación tenga stock
                return !empty($product['combinations']) && count($product['combinations']) > 0;
            })
            ->values();

        // Datos del usuario autenticado
        $userData = $this->getUserData();

        // Datos del checkout
        $checkoutData = $this->getCheckoutData($company, $mainStore);

        // Datos de producto actual (si es página de detalles)
        $productData = $this->getProductData($company, $slug, $request, $mainStore);
// dd($checkoutData);
        // AGREGAR: Pasar la tienda principal a la vista
        return Inertia::render('Frontend/Index', array_merge(
            [
                'page' => $page,
                'themeSettings' => $themeSettings,
                'availableMenus' => $availableMenus,
                'products' => $products,
                'companyId' => $company->id,
                'companyLogo' => $logoUrl,
                'companyFavicon' => $faviconUrl,
                'settings' => $setting,
                'countries' => $countries,
                'states' => $states,
                'cities' => $cities,
                'mainStore' => $mainStore ? [ // Pasar información de la tienda principal
                    'id' => $mainStore->id,
                    'store_name' => $mainStore->store_name,
                    'is_ecommerce_active' => $mainStore->is_ecommerce_active,
                    'address' => $mainStore->address,
                    'phone' => $mainStore->phone,
                    'email' => $mainStore->email,
                ] : null,
            ],
            $userData,
            $checkoutData,
            $productData
        ));
    }

    /**
     * Obtener todos los usuarios/clientes (solo para backend, en frontend solo cargamos el usuario actual)
     */
    private function getAllUsersData($company)
    {
        // En el frontend, solo necesitamos los usuarios si el usuario actual es admin
        // Pero para mantener consistencia con el backend, cargamos todos los usuarios
        // SOLO SI el usuario autenticado tiene permisos de admin

        if (!auth()->check() || !auth()->user()->can('admin.orders.create')) {
            // En frontend normal, no cargamos todos los usuarios
            return [
                'allUsers' => []
            ];
        }

        $users = \App\Models\User::with([
            'deliveryLocations',
            'giftCards' => function ($query) {
                $query->where('is_active', true);
            }
        ])
            ->where('is_active', true)
            ->whereHas('roles', function ($query) {
                $query->where('name', 'client');
            })
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'identification' => $user->identification,
                    'deliveryLocations' => $this->formatDeliveryLocations($user->deliveryLocations),
                    'giftCards' => $user->giftCards->map(function ($giftCard) {
                        return [
                            'id' => $giftCard->id,
                            'code' => $giftCard->code,
                            'initial_balance' => $giftCard->initial_balance,
                            'current_balance' => $giftCard->current_balance,
                            'expiration_date' => $giftCard->expiration_date,
                        ];
                    })
                ];
            });

        return [
            'allUsers' => $users
        ];
    }

    /**
     * Formatear direcciones de entrega
     */
    private function formatDeliveryLocations($locations)
    {
        return $locations->map(function ($location) {
            return [
                'id' => $location->id,
                'address_line_1' => $location->address_line_1,
                'address_line_2' => $location->address_line_2,
                'postal_code' => $location->postal_code,
                'phone_number' => $location->phone_number,
                'notes' => $location->notes,
                'is_default' => $location->is_default,
                'country' => $location->country ? $location->country->country_name : null,
                'state' => $location->state ? $location->state->state_name : null,
                'city' => $location->city ? $location->city->city_name : null,
                'full_address' => implode(', ', array_filter([
                    $location->address_line_1,
                    $location->address_line_2,
                    $location->city ? $location->city->city_name : null,
                    $location->state ? $location->state->state_name : null,
                    $location->country ? $location->country->country_name : null,
                    $location->postal_code
                ]))
            ];
        });
    }

    /**
     * Modificar getCheckoutData para incluir TODOS los descuentos (no solo order_total)
     */
   private function getCheckoutData($company, $mainStore = null)
{
    // Obtener tarifas de envío de la TIENDA específica si existe
    // Si no hay tienda, obtener de la compañía como fallback
    $shippingRatesQuery = $mainStore ? 
        $mainStore->shippingRate() : 
        $company->shippingRates();
    
    return [
        'paymentMethods' => $company->paymentMethods()
            ->where('is_active', true)
            ->get()
            ->map(function ($method) {
                return [
                    'id' => $method->id,
                    'name' => $method->payment_method_name,
                    'description' => $method->description,
                    'type' => $method->payment_type,
                    'icon' => $method->icon,
                ];
            }),
        'shippingRates' => $shippingRatesQuery
        ->where('is_active', true)
            ->get()
            ->map(function ($rate) {
                return [
                    'id' => $rate->id,
                    'name' => $rate->name,
                    'price' => $rate->price,
                    'description' => $rate->description,
                    'estimated_days' => $rate->estimated_days,
                ];
            }),
        'discounts' => $company->discounts()
            ->where('is_active', true)
            ->with(['products', 'categories'])
            ->withCount('usages')
            ->get()
            ->map(function ($discount) {
                return [
                    'id' => $discount->id,
                    'name' => $discount->name,
                    'code' => $discount->code,
                    'description' => $discount->description,
                    'discount_type' => $discount->discount_type,
                    'value' => $discount->value,
                    'applies_to' => $discount->applies_to,
                    'automatic' => $discount->automatic,
                    'minimum_order_amount' => $discount->minimum_order_amount,
                    'usage_limit' => $discount->usage_limit,
                    'usages_count' => $discount->usages_count,
                    'products' => $discount->products->map(function ($product) {
                        return [
                            'id' => $product->id,
                            'combination_id' => $product->pivot->combination_id ?? null
                        ];
                    }),
                    'categories' => $discount->categories->pluck('id')
                ];
            }),
    ];
}

    /**
     * Modificar getProductData para incluir TODAS las relaciones
     */
    private function getProductData($company, $slug, $request, $mainStore = null)
    {
        $isProductDetailPage = $slug === 'detalles-del-producto';

        if (!$isProductDetailPage) {
            return [
                'currentProduct' => null,
                'isProductDetailPage' => false,
            ];
        }

        $productSlug = $request->query('product');
        if (!$productSlug) {
            return [
                'currentProduct' => null,
                'isProductDetailPage' => true,
            ];
        }

        $currentProduct = $company->products()
            ->where('slug', $productSlug)
            ->with([
                'categories',
                'media',
                'stocks' => function ($query) use ($mainStore) {
                    // Filtrar stocks solo de la tienda principal
                    if ($mainStore) {
                        $query->where('store_id', $mainStore->id);
                    }
                },
                'taxes',
                'combinations.combinationAttributeValue.attributeValue.attribute',
                'discounts'
            ])
            ->first();

        if (!$currentProduct) {
            return [
                'currentProduct' => null,
                'isProductDetailPage' => true,
            ];
        }

        // Filtrar combinaciones que tengan stock en la tienda principal
        if ($currentProduct->combinations && $currentProduct->combinations->isNotEmpty() && $mainStore) {
            $currentProduct->combinations = $currentProduct->combinations->filter(function ($combination) use ($mainStore) {
                $stock = $combination->stocks->where('store_id', $mainStore->id)
                    ->where('quantity', '>', 0)
                    ->first();
                return $stock !== null;
            });
        }

        return [
            'currentProduct' => [
                'id' => $currentProduct->id,
                'product_name' => $currentProduct->product_name,
                'slug' => $currentProduct->slug,
                'product_price' => $currentProduct->product_price,
                'product_price_discount' => $currentProduct->product_price_discount,
                'product_description' => $currentProduct->product_description,
                'tax_id' => $currentProduct->tax_id,
                'tax' => $currentProduct->taxes ? [
                    'id' => $currentProduct->taxes->id,
                    'tax_name' => $currentProduct->taxes->tax_name,
                    'tax_rate' => $currentProduct->taxes->tax_rate,
                    'slug' => $currentProduct->taxes->slug,
                ] : null,
                'categories' => $currentProduct->categories->map(function ($category) {
                    return [
                        'id' => $category->id,
                        'category_name' => $category->category_name,
                        'slug' => $category->slug,
                    ];
                }),
                'media' => $currentProduct->media->map(function ($media) {
                    return [
                        'id' => $media->id,
                        'original_url' => $media->original_url,
                        'thumb_url' => $media->getUrl('thumb')
                    ];
                }),
                'combinations' => $currentProduct->combinations->map(function ($combination) use ($mainStore) {
                    // Obtener stock de esta combinación en la tienda principal
                    $stock = null;
                    if ($mainStore && $combination->stocks) {
                        $stock = $combination->stocks->where('store_id', $mainStore->id)->first();
                    }

                    return [
                        'id' => $combination->id,
                        'price' => $combination->combination_price,
                        'stock' => $stock ? $stock->quantity : 0,
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
                }),
                'discounts' => $currentProduct->discounts->map(function ($discount) {
                    return [
                        'id' => $discount->id,
                        'name' => $discount->name,
                        'code' => $discount->code,
                        'discount_type' => $discount->discount_type,
                        'value' => $discount->value,
                        'applies_to' => $discount->applies_to,
                        'pivot' => [
                            'combination_id' => $discount->pivot->combination_id ?? null
                        ]
                    ];
                })
            ],
            'isProductDetailPage' => true,
        ];
    }

    /**
     * Obtiene datos del usuario autenticado
     */
    private function getUserData()
    {
        if (!auth()->check()) {
            return [
                'currentUser' => null,
                'userDeliveryLocations' => [],
                'userGiftCards' => [],
                'userOrders' => [],
            ];
        }

        $user = auth()->user();

        return [
            'currentUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'identification' => $user->identification,
            ],
            'userDeliveryLocations' => $this->getUserDeliveryLocations($user),
            'userGiftCards' => $this->getUserGiftCards($user),
            'userOrders' => $this->getUserOrders($user),
        ];
    }

    /**
     * Obtiene direcciones de entrega del usuario
     */
    private function getUserDeliveryLocations($user)
    {
        return $user->deliveryLocations()
            ->with(['country', 'state', 'city'])
            ->get()
            ->map(function ($location) {
                return [
                    'id' => $location->id,
                    'address_line_1' => $location->address_line_1,
                    'address_line_2' => $location->address_line_2,
                    'postal_code' => $location->postal_code,
                    'phone_number' => $location->phone_number,
                    'notes' => $location->notes,
                    'is_default' => $location->is_default,
                    'country' => $location->country ? $location->country->country_name : null,
                    'state' => $location->state ? $location->state->state_name : null,
                    'city' => $location->city ? $location->city->city_name : null,
                    'full_address' => implode(', ', array_filter([
                        $location->address_line_1,
                        $location->address_line_2,
                        $location->city ? $location->city->city_name : null,
                        $location->state ? $location->state->state_name : null,
                        $location->country ? $location->country->country_name : null,
                        $location->postal_code
                    ]))
                ];
            });
    }

    /**
     * Obtiene gift cards activas del usuario
     */
    private function getUserGiftCards($user)
    {
        return $user->giftCards()
            ->where('is_active', true)
            ->where('current_balance', '>', 0)
            ->where('expiration_date', '>', now())
            ->get()
            ->map(function ($giftCard) {
                return [
                    'id' => $giftCard->id,
                    'code' => $giftCard->code,
                    'initial_balance' => $giftCard->initial_balance,
                    'current_balance' => $giftCard->current_balance,
                    'expiration_date' => $giftCard->expiration_date,
                ];
            });
    }

    /**
     * Obtiene las órdenes del usuario
     */
    private function getUserOrders($user)
    {
        return $user->orders()
            ->with([
                'items.product',
                'paymentMethod',
                'shippingRate',
                'deliveryLocation',
                // 'giftCardUsages'
            ])
            ->orderBy('created_at', 'desc')
            ->limit(10) // Limitar a las últimas 10 órdenes para performances
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'status' => $order->status,
                    'delivery_type' => $order->delivery_type,
                    'payment_status' => $order->payment_status,
                    'totaldiscounts' => $order->totaldiscounts,
                    'total' => $order->total,
                    'subtotal' => $order->subtotal,
                    'tax_amount' => $order->tax_amount,
                    'created_at' => $order->created_at->toISOString(),
                    'items' => $order->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'name_product' => $item->name_product,
                            'quantity' => $item->quantity,
                            'price_product' => $item->price_product,
                            'subtotal' => $item->subtotal,

                            'tax_amount' => $item->tax_amount,
                            'discount_amount' => $item->discount_amount,
                            'discounted_price' => $item->discounted_price,
                            'discounted_subtotal' => $item->discounted_subtotal,
                            'product_details' => $item->product_details,
                        ];
                    }),
                    'paymentMethod' => $order->paymentMethod ? [
                        'name' => $order->paymentMethod->payment_method_name
                    ] : null,
                    // 'giftCardUsages' => $order->giftCardUsages ? [
                    //     'amount_used' => $order->giftCardUsages->amount_used
                    // ] : null,
                    'shippingRate' => $order->shippingRate ? [
                        'name' => $order->shippingRate->name,
                        'price' => $order->shippingRate->price
                    ] : null,
                    'deliveryLocation' => $order->deliveryLocation ? [
                        'address_line_1'  => $order->deliveryLocation->address_line_1,
                        'address_line_2' => $order->deliveryLocation->address_line_2,
                        'postal_code' => $order->deliveryLocation->postal_code,
                        'phone_number' => $order->deliveryLocation->phone_number,
                        'notes' => $order->deliveryLocation->notes,
                        'is_default' => $order->deliveryLocation->is_default,
                        'country_id' => $order->deliveryLocation->country->country_name,
                        'state_id' => $order->deliveryLocation->state->state_name,
                        'city_id' => $order->deliveryLocation->city->city_name,
                    ] : null,
                ];
            });
    }
}
