<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Page;
use App\Models\Scopes\CompanyScope;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FrontendController extends Controller
{
    // Modificar el método show del FrontendController
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

        // Obtener productos activos con TODAS las relaciones necesarias
        $products = $company->products()
            ->where('is_active', true)
            ->with([
                'categories',
                'media',
                'stocks',
                'taxes',
                'combinations.combinationAttributeValue.attributeValue.attribute',
                'discounts'
            ])
            ->get()
            ->map(function ($product) {
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
            });

        // Datos del usuario autenticado (igual que antes)
        $userData = $this->getUserData();

        // Datos del checkout CON TODOS LOS DESCUENTOS
        $checkoutData = $this->getCheckoutData($company);

        // Datos de producto actual (si es página de detalles)
        $productData = $this->getProductData($company, $slug, $request);

        // Obtener TODOS los usuarios/clientes (similar al backend)
        // $usersData = $this->getAllUsersData($company);
        // dd($availableMenus);
        return Inertia::render('Frontend/Index', array_merge(
            [
                'page' => $page,
                'themeSettings' => $themeSettings,
                'availableMenus' => $availableMenus,
                'products' => $products,
                'companyId' => $company->id,
                'companyLogo' => $logoUrl,
                'companyFavicon' => $faviconUrl,
                'settings' => $setting, // Agregar settings con currency
                'countries' => $countries,
                'states' => $states,
                'cities' => $cities,
            ],
            $userData,
            $checkoutData,
            $productData,
            // $usersData
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
    private function getCheckoutData($company)
    {
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
            'shippingRates' => $company->shippingRates()
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
    private function getProductData($company, $slug, $request)
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
                'stocks',
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
}
