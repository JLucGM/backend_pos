<?php

namespace Database\Seeders;

use App\Models\Template;
use App\Models\Theme;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    /**
     * Genera un ID único para componentes (similar a Date.now() en JS)
     */
    private function generateComponentId($base, $offset)
    {
        return $base + $offset;
    }

    /**
     * Obtiene los settings del tema por defecto (tema-azul)
     */
    private function getDefaultThemeSettings()
    {
        $theme = Theme::where('slug', 'tema-azul')->first();
        return $theme ? $theme->settings : [];
    }

    public function run()
    {
        $theme = Theme::where('slug', 'tema-azul')->first();
        if (!$theme) {
            $theme = Theme::create([
                'name' => 'Tema Azul',
                'slug' => 'tema-azul',
                'description' => 'Tema azul por defecto',
                'is_active' => true,
                'settings' => [] // Puedes poner settings por defecto si no existen
            ]);
        }

        $settings = $this->getDefaultThemeSettings();
        $baseId = 1000000; // Base para IDs de componentes (suficientemente grande)

        $templates = [
            // Plantilla para página de inicio
            [
                'name' => 'Página de Inicio',
                'slug' => 'home-template',
                'description' => 'Plantilla para la página de inicio con banner, carrusel y separador',
                'layout_structure' => json_encode([
                    $this->createAnnouncementBar($baseId + 1, $settings),
                    $this->createBanner($baseId + 10, $settings),
                    $this->createCarousel($baseId + 20, $settings),
                    $this->createDivider($baseId + 30, $settings),
                ]),
                'is_global' => true,
                'theme_id' => $theme->id,
            ],
            // Plantilla para tienda (lista de productos)
            [
                'name' => 'Tienda',
                'slug' => 'shop-template',
                'description' => 'Plantilla para la página de tienda con lista de productos',
                'layout_structure' => json_encode([
                    $this->createProductList($baseId + 40, $settings),
                ]),
                'is_global' => true,
                'theme_id' => $theme->id,
            ],
            // Plantilla para detalles de producto
            [
                'name' => 'Detalles del Producto',
                'slug' => 'product-detail-template',
                'description' => 'Plantilla para la página de detalles de producto',
                'layout_structure' => json_encode([
                    $this->createProductDetail($baseId + 50, $settings),
                ]),
                'is_global' => true,
                'theme_id' => $theme->id,
            ],
            // Plantilla para carrito
            [
                'name' => 'Carrito de Compras',
                'slug' => 'cart-template',
                'description' => 'Plantilla para la página de carrito',
                'layout_structure' => json_encode([
                    $this->createCart($baseId + 60, $settings),
                ]),
                'is_global' => true,
                'theme_id' => $theme->id,
            ],
            // Plantilla para checkout
            [
                'name' => 'Checkout',
                'slug' => 'checkout-template',
                'description' => 'Plantilla para la página de checkout',
                'layout_structure' => json_encode([
                    $this->createCheckout($baseId + 70, $settings),
                ]),
                'is_global' => true,
                'theme_id' => $theme->id,
            ],
            // Plantilla para iniciar sesión
            [
                'name' => 'Iniciar Sesión',
                'slug' => 'login-template',
                'description' => 'Plantilla para la página de inicio de sesión',
                'layout_structure' => json_encode([
                    $this->createLogin($baseId + 80, $settings),
                ]),
                'is_global' => true,
                'theme_id' => $theme->id,
            ],
            // Plantilla para registrarse
            [
                'name' => 'Registrarse',
                'slug' => 'register-template',
                'description' => 'Plantilla para la página de registro',
                'layout_structure' => json_encode([
                    $this->createRegister($baseId + 90, $settings),
                ]),
                'is_global' => true,
                'theme_id' => $theme->id,
            ],
            // Plantilla para perfil de usuario
            [
                'name' => 'Perfil de Usuario',
                'slug' => 'profile-template',
                'description' => 'Plantilla para la página de perfil',
                'layout_structure' => json_encode([
                    $this->createProfile($baseId + 100, $settings),
                ]),
                'is_global' => true,
                'theme_id' => $theme->id,
            ],
            // Plantilla para pedidos
            [
                'name' => 'Pedidos',
                'slug' => 'orders-template',
                'description' => 'Plantilla para la página de pedidos',
                'layout_structure' => json_encode([
                    $this->createOrders($baseId + 110, $settings),
                ]),
                'is_global' => true,
                'theme_id' => $theme->id,
            ],
            // Plantilla para orden exitosa
            [
                'name' => 'Orden Exitosa',
                'slug' => 'success-template',
                'description' => 'Plantilla para la página de orden exitosa',
                'layout_structure' => json_encode([
                    $this->createSuccess($baseId + 120, $settings),
                ]),
                'is_global' => true,
                'theme_id' => $theme->id,
            ],
            // Plantilla para Link Bio
            [
                'name' => 'Link Bio',
                'slug' => 'link-bio-template',
                'description' => 'Plantilla para página de link bio',
                'layout_structure' => json_encode([
                    $this->createLinkBio($baseId + 130, $settings),
                ]),
                'is_global' => true,
                'theme_id' => $theme->id,
            ],
            // Plantilla para páginas de políticas (policy) - contiene pageContent
            [
                'name' => 'Página de Política',
                'slug' => 'policy-template',
                'description' => 'Plantilla para páginas de políticas con editor de contenido',
                'layout_structure' => json_encode([
                    $this->createPageContent($baseId + 140, $settings),
                ]),
                'is_global' => true,
                'theme_id' => $theme->id,
            ],
            // Plantilla básica (vacía, solo header y footer se añaden globalmente)
            [
                'name' => 'Página Básica',
                'slug' => 'basic-template',
                'description' => 'Plantilla vacía para personalizar completamente',
                'layout_structure' => json_encode([]), // Sin componentes iniciales
                'is_global' => true,
                'theme_id' => $theme->id,
            ],
        ];

        foreach ($templates as $template) {
            Template::updateOrCreate(
                ['slug' => $template['slug']],
                $template
            );
        }
    }

    // Métodos auxiliares para crear cada tipo de componente (igual que en handleAddComponent)

    private function createAnnouncementBar($id, $settings)
    {
        $announcementId = $id + 1;
        return [
            'id' => $id,
            'type' => 'announcementBar',
            'content' => [
                'autoplayTime' => 5,
                'children' => [
                    [
                        'id' => $announcementId,
                        'type' => 'announcement',
                        'content' => [
                            'text' => 'Nuevo anuncio - Haz clic para editar',
                            'navigationUrl' => ''
                        ],
                        'styles' => [
                            'fontSize' => '14px',
                            'fontWeight' => 'normal',
                            'color' => $settings['text'] ?? '#0a0a0a',
                            'textTransform' => 'none',
                            'fontType' => 'default'
                        ]
                    ]
                ]
            ],
            'styles' => [
                'backgroundColor' => $settings['background'] ?? '#ffffff',
                'paddingTop' => '15px',
                'paddingBottom' => '15px'
            ]
        ];
    }

    private function createBanner($id, $settings)
    {
        $titleId = $id + 1;
        $textId = $id + 2;
        return [
            'id' => $id,
            'type' => 'banner',
            'content' => [
                'containerHeight' => $settings['banner_containerHeight'] ?? '400px',
                'containerWidth' => '100%',
                'marginTop' => '0px',
                'marginRight' => '0px',
                'marginBottom' => '0px',
                'marginLeft' => '0px',
                'paddingTop' => $settings['banner_paddingTop'] ?? '20px',
                'paddingRight' => $settings['banner_paddingRight'] ?? '20px',
                'paddingBottom' => $settings['banner_paddingBottom'] ?? '20px',
                'paddingLeft' => $settings['banner_paddingLeft'] ?? '20px',
                'backgroundColor' => $settings['background'] ?? 'transparent',
                'backgroundImage' => null,
                'backgroundVideo' => null,
                'backgroundSize' => 'cover',
                'backgroundPosition' => 'center center',
                'containerVerticalPosition' => 'center',
                'containerHorizontalPosition' => 'center',
                'contentDirection' => 'vertical',
                'innerContainerShow' => true,
                'innerContainerHasBackground' => true,
                'innerContainerBackgroundColor' => 'transparent',
                'innerContainerBackgroundOpacity' => $settings['banner_innerContainerBackgroundOpacity'] ?? '1',
                'innerContainerPaddingTop' => $settings['banner_innerContainerPaddingTop'] ?? '20px',
                'innerContainerPaddingRight' => $settings['banner_innerContainerPaddingRight'] ?? '20px',
                'innerContainerPaddingBottom' => $settings['banner_innerContainerPaddingBottom'] ?? '20px',
                'innerContainerPaddingLeft' => $settings['banner_innerContainerPaddingLeft'] ?? '20px',
                'innerContainerBorderRadius' => $settings['banner_innerContainerBorderRadius'] ?? '0px',
                'innerContainerWidth' => 'auto',
                'innerContainerMaxWidth' => '800px',
                'children' => [
                    [
                        'id' => $titleId,
                        'type' => 'heading',
                        'content' => 'Título del Banner',
                        'styles' => [
                            'textStyle' => 'heading2',
                            'layout' => 'fit',
                            'alignment' => 'center',
                            'paddingTop' => '10px',
                            'paddingRight' => '10px',
                            'paddingBottom' => '10px',
                            'paddingLeft' => '10px',
                            'backgroundColor' => 'transparent',
                            'borderRadius' => $settings['border_radius_small'] ?? '0px',
                            'color' => $settings['heading'] ?? '#0a0a0a'
                        ]
                    ],
                    [
                        'id' => $textId,
                        'type' => 'bannerText',
                        'content' => 'Texto descriptivo del banner',
                        'styles' => [
                            'layout' => 'fit',
                            'alignment' => 'center',
                            'background' => 'transparent',
                            'backgroundOpacity' => $settings['opacity_100'] ?? '1',
                            'borderRadius' => $settings['border_radius_small'] ?? '0px',
                            'paddingTop' => '10px',
                            'paddingRight' => '10px',
                            'paddingBottom' => '10px',
                            'paddingLeft' => '10px',
                            'color' => $settings['text'] ?? '#0a0a0a',
                            'fontSize' => $settings['paragraph_fontSize'] ?? '16px',
                            'fontWeight' => $settings['paragraph_fontWeight'] ?? 'normal'
                        ]
                    ]
                ]
            ],
            'styles' => []
        ];
    }

    private function createCarousel($id, $settings)
    {
        $titleId = $id + 1;
        $cardId = $id + 2;
        $imageId = $id + 3;
        $nameId = $id + 4;
        $priceId = $id + 5;

        return [
            'id' => $id,
            'type' => 'carousel',
            'content' => [
                'limit' => 5,
                'slidesToShow' => 3,
                'gapX' => $settings['carousel_gapX'] ?? '10px',
                'gapY' => $settings['carousel_gapY'] ?? '10px',
                'backgroundColor' => $settings['background'] ?? '#ffffff',
                'children' => [
                    [
                        'id' => $titleId,
                        'type' => 'carouselTitle',
                        'content' => 'Productos en Carrusel',
                        'styles' => [
                            'layout' => 'fit',
                            'alignment' => 'center',
                            'color' => $settings['heading'] ?? '#0a0a0a',
                            'fontSize' => $settings['heading2_fontSize'] ?? '24px',
                            'fontWeight' => $settings['heading2_fontWeight'] ?? 'bold'
                        ]
                    ],
                    [
                        'id' => $cardId,
                        'type' => 'carouselCard',
                        'content' => [
                            'cardBorder' => 'none',
                            'cardBorderThickness' => $settings['border_thickness_hairline'] ?? '1px',
                            'cardBorderOpacity' => $settings['opacity_100'] ?? '1',
                            'cardBorderRadius' => $settings['border_radius_small'] ?? '0px',
                            'cardPaddingTop' => '10px',
                            'cardPaddingRight' => '10px',
                            'cardPaddingBottom' => '10px',
                            'cardPaddingLeft' => '10px',
                            'imageBorder' => 'none',
                            'imageBorderThickness' => $settings['border_thickness_hairline'] ?? '1px',
                            'imageBorderOpacity' => $settings['opacity_100'] ?? '1',
                            'imageBorderRadius' => $settings['border_radius_small'] ?? '0px',
                            'children' => [
                                [
                                    'id' => $imageId,
                                    'type' => 'carouselImage',
                                    'content' => '',
                                    'styles' => [
                                        'aspectRatio' => 'square',
                                        'imageBorder' => 'none',
                                        'imageBorderThickness' => $settings['border_thickness_hairline'] ?? '1px',
                                        'imageBorderOpacity' => $settings['opacity_100'] ?? '1',
                                        'imageBorderRadius' => $settings['border_radius_small'] ?? '0px'
                                    ]
                                ],
                                [
                                    'id' => $nameId,
                                    'type' => 'carouselName',
                                    'content' => '',
                                    'styles' => [
                                        'layout' => 'fit',
                                        'alignment' => 'left',
                                        'color' => $settings['text'] ?? '#0a0a0a',
                                        'fontSize' => $settings['paragraph_fontSize'] ?? '16px',
                                        'fontWeight' => '600'
                                    ]
                                ],
                                [
                                    'id' => $priceId,
                                    'type' => 'carouselPrice',
                                    'content' => '',
                                    'styles' => [
                                        'layout' => 'fit',
                                        'alignment' => 'left',
                                        'color' => $settings['text'] ?? '#0a0a0a',
                                        'fontSize' => '14px',
                                        'fontWeight' => 'normal'
                                    ]
                                ]
                            ]
                        ],
                        'styles' => []
                    ]
                ]
            ],
            'styles' => []
        ];
    }

    private function createDivider($id, $settings)
    {
        return [
            'id' => $id,
            'type' => 'divider',
            'content' => '',
            'styles' => [
                'paddingTop' => $settings['divider_paddingTop'] ?? '20px',
                'paddingBottom' => $settings['divider_paddingBottom'] ?? '20px',
                'lineWidth' => $settings['divider_lineWidth'] ?? '1px',
                'lineLength' => $settings['divider_lineLength'] ?? '100%',
                'lineColor' => $settings['borders'] ?? '#f5f5f5',
                'opacity' => $settings['divider_opacity'] ?? '1',
            ]
        ];
    }

    private function createProductList($id, $settings)
    {
        $listId = $id;
        $titleId = $id + 1;
        $cardId = $id + 2;
        $imageId = $id + 3;
        $nameId = $id + 4;
        $priceId = $id + 5;
        $paginationId = $id + 6;
        $priceFilterId = $id + 7;
        $sortSelectId = $id + 8;

        return [
            'id' => $listId,
            'type' => 'productList',
            'content' => [
                'columns' => 3,
                'gapX' => $settings['carousel_gapX'] ?? '10px',
                'gapY' => $settings['carousel_gapY'] ?? '10px',
                'backgroundColor' => $settings['background'] ?? '#ffffff',
                'limit' => 8,
                'children' => [
                    [
                        'id' => $titleId,
                        'type' => 'productTitle',
                        'content' => 'Lista de Productos',
                        'styles' => [
                            'layout' => 'fit',
                            'alignment' => 'center',
                            'color' => $settings['heading'] ?? '#0a0a0a',
                            'fontSize' => $settings['heading2_fontSize'] ?? '24px',
                            'fontWeight' => $settings['heading2_fontWeight'] ?? 'bold'
                        ]
                    ],
                    [
                        'id' => $cardId,
                        'type' => 'productCard',
                        'content' => [
                            'cardBorder' => 'none',
                            'cardBorderThickness' => $settings['border_thickness_hairline'] ?? '1px',
                            'cardBorderOpacity' => $settings['opacity_100'] ?? '1',
                            'cardBorderRadius' => $settings['border_radius_small'] ?? '0px',
                            'cardPaddingTop' => '0px',
                            'cardPaddingRight' => '0px',
                            'cardPaddingBottom' => '0px',
                            'cardPaddingLeft' => '0px',
                            'children' => [
                                [
                                    'id' => $imageId,
                                    'type' => 'productImage',
                                    'content' => '',
                                    'styles' => [
                                        'aspectRatio' => 'square',
                                        'imageBorder' => $settings['border_thickness_none'] ?? 'none',
                                        'imageBorderThickness' => $settings['border_thickness_hairline'] ?? '1px',
                                        'imageBorderOpacity' => $settings['opacity_100'] ?? '1',
                                        'imageBorderRadius' => $settings['border_radius_small'] ?? '0px'
                                    ]
                                ],
                                [
                                    'id' => $nameId,
                                    'type' => 'productName',
                                    'content' => '',
                                    'styles' => [
                                        'layout' => 'fit',
                                        'alignment' => 'left',
                                        'color' => $settings['text'] ?? '#0a0a0a',
                                        'fontSize' => $settings['paragraph_fontSize'] ?? '16px',
                                        'fontWeight' => '600'
                                    ]
                                ],
                                [
                                    'id' => $priceId,
                                    'type' => 'productPrice',
                                    'content' => '',
                                    'styles' => [
                                        'layout' => 'fit',
                                        'alignment' => 'left',
                                        'color' => $settings['text'] ?? '#0a0a0a',
                                        'fontSize' => '14px',
                                        'fontWeight' => 'normal'
                                    ]
                                ]
                            ]
                        ],
                        'styles' => []
                    ],
                    [
                        'id' => $priceFilterId,
                        'type' => 'productListPriceFilter',
                        'content' => [],
                        'styles' => [
                            'borderRadius' => $settings['border_radius_small'] ?? '4px',
                            'borderColor' => $settings['borders'] ?? '#ccc',
                            'borderThickness' => $settings['border_thickness_hairline'] ?? '1px',
                            'background' => $settings['background'] ?? '#fff'
                        ]
                    ],
                    [
                        'id' => $sortSelectId,
                        'type' => 'productListSortSelect',
                        'content' => [],
                        'styles' => [
                            'borderRadius' => $settings['border_radius_small'] ?? '4px',
                            'borderColor' => $settings['borders'] ?? '#ccc',
                            'borderThickness' => $settings['border_thickness_hairline'] ?? '1px',
                            'background' => $settings['background'] ?? '#fff'
                        ]
                    ],
                    [
                        'id' => $paginationId,
                        'type' => 'productListPagination',
                        'content' => [],
                        'styles' => [
                            'borderRadius' => $settings['border_radius_small'] ?? '4px',
                            'border' => ($settings['border_thickness_hairline'] ?? '1px') . ' solid',
                            'borderColor' => $settings['borders'] ?? '#000',
                            'background' => $settings['background'] ?? '#fff'
                        ]
                    ]
                ]
            ],
            'styles' => [
                'backgroundColor' => $settings['background'] ?? '#ffffff',
                'paddingTop' => '20px',
                'paddingRight' => '20px',
                'paddingBottom' => '20px',
                'paddingLeft' => '20px'
            ]
        ];
    }

    private function createProductDetail($id, $settings)
    {
        $productDetailId = $id;
        $imageId = $id + 1;
        $nameId = $id + 2;
        $priceId = $id + 3;
        $descriptionId = $id + 4;
        $buttonId = $id + 5;
        $attributesId = $id + 6;
        $stockId = $id + 7;
        $quantityId = $id + 8;

        return [
            'id' => $productDetailId,
            'type' => 'productDetail',
            'content' => [
                'children' => [
                    [
                        'id' => $imageId,
                        'type' => 'productDetailImage',
                        'content' => '',
                        'styles' => [
                            'aspectRatio' => 'square',
                            'imageBorder' => 'none',
                            'imageBorderThickness' => $settings['border_thickness_hairline'] ?? '1px',
                            'imageBorderOpacity' => $settings['opacity_100'] ?? '1',
                            'imageBorderRadius' => $settings['border_radius_small'] ?? '0px'
                        ]
                    ],
                    [
                        'id' => $nameId,
                        'type' => 'productDetailName',
                        'content' => '',
                        'styles' => [
                            'layout' => 'fit',
                            'alignment' => 'left',
                            'color' => $settings['heading'] ?? '#0a0a0a',
                            'fontSize' => $settings['heading4_fontSize'] ?? '32px',
                            'fontWeight' => 'bold'
                        ]
                    ],
                    [
                        'id' => $priceId,
                        'type' => 'productDetailPrice',
                        'content' => '',
                        'styles' => [
                            'layout' => 'fit',
                            'alignment' => 'left',
                            'color' => $settings['text'] ?? '#0a0a0a',
                            'fontSize' => $settings['heading5_fontSize'] ?? '24px',
                            'fontWeight' => 'normal'
                        ]
                    ],
                    [
                        'id' => $descriptionId,
                        'type' => 'productDetailDescription',
                        'content' => '',
                        'styles' => [
                            'layout' => 'fit',
                            'alignment' => 'left',
                            'color' => $settings['text'] ?? '#0a0a0a',
                            'fontSize' => $settings['paragraph_fontSize'] ?? '16px',
                            'fontWeight' => 'normal'
                        ]
                    ],
                    [
                        'id' => $buttonId,
                        'type' => 'button',
                        'content' => 'Agregar al carrito',
                        'styles' => [
                            'buttonType' => 'primary',
                            'layout' => 'fit',
                            'paddingTop' => '10px',
                            'paddingRight' => '10px',
                            'paddingBottom' => '10px',
                            'paddingLeft' => '10px',
                            'borderRadius' => $settings['primary_button_corner_radius'] ?? '4px',
                            'backgroundColor' => $settings['primary_button_background'] ?? '#d6eaff',
                            'color' => $settings['primary_button_text'] ?? '#0a0a0a'
                        ]
                    ],
                    [
                        'id' => $attributesId,
                        'type' => 'productDetailAttributes',
                        'content' => [
                            'title' => 'Opciones del Producto',
                        ],
                        'styles' => [
                            'titleColor' => $settings['heading'] ?? '#0a0a0a',
                            'titleSize' => '18px',
                            'labelColor' => $settings['text'] ?? '#0a0a0a',
                            'labelSize' => '14px',
                        ]
                    ],
                    [
                        'id' => $stockId,
                        'type' => 'productDetailStock',
                        'content' => [
                            'inStockText' => 'En stock',
                            'lowStockText' => 'Pocas unidades',
                            'outOfStockText' => 'Agotado',
                            'showSku' => true,
                        ],
                        'styles' => [
                            'padding' => '12px 16px',
                            'borderRadius' => $settings['border_radius_small'] ?? '8px',
                            'borderWidth' => $settings['border_thickness_hairline'] ?? '1px',
                            'inStockBgColor' => $settings['success_color'] ?? '#dcfce7',
                            'inStockColor' => $settings['success_color'] ? '#166534' : '#166534',
                            'outOfStockBgColor' => $settings['danger_color'] ?? '#fee2e2',
                            'outOfStockColor' => $settings['danger_color'] ? '#991b1b' : '#991b1b',
                        ]
                    ],
                    [
                        'id' => $quantityId,
                        'type' => 'quantitySelector',
                        'content' => [
                            'label' => 'Cantidad:',
                            'showMax' => true,
                        ],
                        'styles' => [
                            'labelColor' => $settings['text'] ?? '#0a0a0a',
                            'borderColor' => $settings['borders'] ?? '#f5f5f5',
                            'borderRadius' => $settings['border_radius_medium'] ?? '6px',
                            'buttonColor' => $settings['text'] ?? '#0a0a0a',
                            'inputColor' => $settings['text'] ?? '#0a0a0a',
                        ]
                    ]
                ]
            ],
            'styles' => []
        ];
    }

    private function createCart($id, $settings)
    {
        $cartId = $id;
        $itemsId = $id + 1;
        $summaryId = $id + 2;

        return [
            'id' => $cartId,
            'type' => 'cart',
            'content' => [
                'children' => [
                    [
                        'id' => $itemsId,
                        'type' => 'cartItems',
                        'content' => [
                            'title' => 'Tu carrito',
                            'emptyMessage' => 'Tu carrito está vacío',
                            'showImage' => true,
                            'showCombination' => true,
                            'showStock' => true,
                        ],
                        'styles' => [
                            'backgroundColor' => $settings['background'] ?? '#ffffff',
                            'padding' => '20px',
                            'borderRadius' => $settings['border_radius_medium'] ?? '12px',
                            'titleSize' => $settings['heading5_fontSize'] ?? '24px',
                            'titleColor' => $settings['heading'] ?? '#0a0a0a',
                            'imageSize' => '80px',
                            'rowPadding' => '16px',
                            'rowBorder' => '1px solid ' . ($settings['borders'] ?? '#f5f5f5'),
                            'buttonColor' => $settings['danger_color'] ?? '#dc2626',
                        ]
                    ],
                    [
                        'id' => $summaryId,
                        'type' => 'cartSummary',
                        'content' => [
                            'title' => 'Resumen del pedido',
                            'showSubtotal' => true,
                            'showShipping' => true,
                            'showTax' => true,
                            'showDiscount' => true,
                            'shippingText' => 'Envío',
                            'taxText' => 'Impuestos',
                            'checkoutButtonText' => 'Proceder al pago',
                        ],
                        'styles' => [
                            'backgroundColor' => $settings['background'] ?? '#ffffff',
                            'padding' => '24px',
                            'borderWidth' => $settings['border_thickness_hairline'] ?? '1px',
                            'borderRadius' => $settings['border_radius_large'] ?? '12px',
                            'borderColor' => $settings['borders'] ?? '#f5f5f5',
                            'titleSize' => '20px',
                            'totalFontSize' => '24px',
                        ]
                    ],
                ]
            ],
            'styles' => [
                'layoutType' => 'grid',
                'maxWidth' => '1200px',
                'paddingTop' => '40px',
                'paddingRight' => '20px',
                'paddingBottom' => '40px',
                'paddingLeft' => '20px',
                'backgroundColor' => $settings['background'] ?? '#ffffff',
                'gap' => '40px',
            ]
        ];
    }

    private function createCheckout($id, $settings)
    {
        $checkoutId = $id;
        $discountGiftCardId = $id + 1;
        $customerInfoId = $id + 2;
        $summaryId = $id + 3;
        $paymentId = $id + 4;

        return [
            'id' => $checkoutId,
            'type' => 'checkout',
            'content' => [
                'showAuthSection' => true,
                'showDiscountSection' => true,
                'children' => [
                    [
                        'id' => $discountGiftCardId,
                        'type' => 'checkoutDiscountGiftCard',
                        'content' => [
                            'title' => 'Descuentos y Gift Cards',
                        ],
                        'styles' => [
                            'backgroundColor' => $settings['background'] ?? '#ffffff',
                            'padding' => '16px',
                            'borderRadius' => $settings['border_radius_medium'] ?? '8px'
                        ]
                    ],
                    [
                        'id' => $customerInfoId,
                        'type' => 'customerInfo',
                        'content' => [
                            'title' => 'Información del Cliente',
                            'showAddressSelector' => true,
                            'showShippingMethods' => true,
                            'showPaymentMethodsPreview' => true
                        ],
                        'styles' => [
                            'backgroundColor' => $settings['background'] ?? '#ffffff',
                            'padding' => '24px',
                            'borderRadius' => $settings['border_radius_medium'] ?? '12px',
                            'titleSize' => '20px',
                            'titleColor' => $settings['heading'] ?? '#0a0a0a',
                        ]
                    ],
                    [
                        'id' => $summaryId,
                        'type' => 'checkoutSummary',
                        'content' => [
                            'title' => 'Resumen del Pedido',
                            'showSubtotal' => true,
                            'showShipping' => true,
                            'showTax' => true,
                            'showDiscount' => true,
                            'showOrderTotal' => true,
                            'shippingText' => 'Envío',
                            'taxText' => 'Impuestos',
                            'totalText' => 'Total'
                        ],
                        'styles' => [
                            'backgroundColor' => $settings['background'] ?? '#ffffff',
                            'padding' => '24px',
                            'borderRadius' => $settings['border_radius_large'] ?? '12px',
                            'borderColor' => $settings['borders'] ?? '#f5f5f5',
                            'titleSize' => '20px',
                            'totalFontSize' => '24px',
                        ]
                    ],
                    [
                        'id' => $paymentId,
                        'type' => 'checkoutPayment',
                        'content' => [
                            'title' => 'Método de Pago',
                            'paymentMethods' => [
                                ['id' => 'cash', 'name' => 'Efectivo', 'description' => 'Paga al recibir'],
                                ['id' => 'card', 'name' => 'Tarjeta de Crédito/Débito', 'description' => 'Pago seguro en línea'],
                                ['id' => 'transfer', 'name' => 'Transferencia Bancaria', 'description' => 'Depósito bancario']
                            ],
                            'showTerms' => true,
                            'termsText' => 'Acepto los términos y condiciones',
                            'buttonText' => 'Realizar Pedido'
                        ],
                        'styles' => [
                            'backgroundColor' => $settings['background'] ?? '#ffffff',
                            'padding' => '24px',
                            'borderRadius' => $settings['border_radius_large'] ?? '12px',
                            'titleSize' => '20px',
                            'buttonBackgroundColor' => $settings['primary_button_background'] ?? '#d6eaff',
                            'buttonColor' => $settings['primary_button_text'] ?? '#0a0a0a',
                            'buttonBorderRadius' => $settings['primary_button_corner_radius'] ?? '8px'
                        ]
                    ]
                ]
            ],
            'styles' => [
                'layoutType' => 'compact',
                'maxWidth' => '1200px',
                'paddingTop' => '40px',
                'paddingRight' => '20px',
                'paddingBottom' => '40px',
                'paddingLeft' => '20px',
                'backgroundColor' => $settings['background'] ?? '#ffffff',
                'gap' => '40px',
            ]
        ];
    }

    private function createLogin($id, $settings)
    {
        return [
            'id' => $id,
            'type' => 'login',
            'content' => [
                'title' => 'Iniciar Sesión',
                'subtitle' => 'Ingresa a tu cuenta',
                'showEmail' => true,
                'showPassword' => true,
                'showRemember' => false,
                'rememberText' => 'Recordarme',
                'buttonText' => 'Iniciar Sesión',
                'showForgotPassword' => true,
                'forgotPasswordText' => '¿Olvidaste tu contraseña?',
                'showRegisterLink' => true,
                'registerText' => '¿No tienes una cuenta?',
                'registerUrl' => '/registrarse'
            ],
            'styles' => [
                'layout' => 'vertical',
                'backgroundColor' => $settings['background'] ?? '#ffffff',
                'padding' => '32px',
                'borderRadius' => $settings['border_radius_medium'] ?? '12px',
                'titleColor' => $settings['heading'] ?? '#0a0a0a',
                'titleSize' => $settings['heading4_fontSize'] ?? '28px',
                'subtitleColor' => $settings['text'] ?? '#0a0a0a',
                'subtitleSize' => $settings['paragraph_fontSize'] ?? '16px',
                'buttonBackgroundColor' => $settings['primary_button_background'] ?? '#d6eaff',
                'buttonColor' => $settings['primary_button_text'] ?? '#0a0a0a',
                'buttonBorderRadius' => $settings['primary_button_corner_radius'] ?? '8px',
                'maxWidth' => '400px',
                'margin' => '0 auto'
            ]
        ];
    }

    private function createRegister($id, $settings)
    {
        return [
            'id' => $id,
            'type' => 'register',
            'content' => [
                'title' => 'Crear Cuenta',
                'subtitle' => 'Regístrate para empezar a comprar',
                'showName' => true,
                'showEmail' => true,
                'showPhone' => false,
                'showPassword' => true,
                'showConfirmPassword' => true,
                'showTerms' => true,
                'termsText' => 'Acepto los términos y condiciones',
                'buttonText' => 'Crear Cuenta',
                'showLoginLink' => true,
                'loginText' => '¿Ya tienes una cuenta?',
                'loginUrl' => '/iniciar-sesion'
            ],
            'styles' => [
                'layout' => 'vertical',
                'backgroundColor' => $settings['background'] ?? '#ffffff',
                'padding' => '32px',
                'borderRadius' => $settings['border_radius_medium'] ?? '12px',
                'titleColor' => $settings['heading'] ?? '#0a0a0a',
                'titleSize' => $settings['heading4_fontSize'] ?? '28px',
                'subtitleColor' => $settings['text'] ?? '#0a0a0a',
                'subtitleSize' => $settings['paragraph_fontSize'] ?? '16px',
                'buttonBackgroundColor' => $settings['secondary_button_background'] ?? '#f5f5f5',
                'buttonColor' => $settings['secondary_button_text'] ?? '#0a0a0a',
                'buttonBorderRadius' => $settings['secondary_button_corner_radius'] ?? '8px',
                'maxWidth' => '400px',
                'margin' => '0 auto'
            ]
        ];
    }

    private function createProfile($id, $settings)
    {
        return [
            'id' => $id,
            'type' => 'profile',
            'content' => [
                'title' => 'Mi Perfil',
                'personalInfoTitle' => 'Información Personal',
                'addressesTitle' => 'Direcciones de Envío',
                'giftCardsTitle' => 'Mis Gift Cards',
                'loginRequiredTitle' => 'Inicia sesión para ver tu perfil',
                'loginRequiredMessage' => 'Necesitas iniciar sesión para acceder a tu perfil y gestionar tus datos.',
                'loginButtonText' => 'Iniciar Sesión',
                'layoutType' => 'tabs'
            ],
            'styles' => [
                'backgroundColor' => $settings['background'] ?? '#ffffff',
                'paddingTop' => '40px',
                'paddingRight' => '20px',
                'paddingBottom' => '40px',
                'paddingLeft' => '20px',
                'maxWidth' => '1200px',
                'borderRadius' => $settings['border_radius_small'] ?? '0px',
                'titleColor' => $settings['heading'] ?? '#0a0a0a',
                'titleSize' => $settings['heading4_fontSize'] ?? '32px',
                'titleWeight' => 'bold',
                'titleAlignment' => 'left',
                'cardBackgroundColor' => $settings['background'] ?? '#ffffff',
                'cardBorderRadius' => $settings['border_radius_medium'] ?? '12px',
                'cardBorder' => '1px solid ' . ($settings['borders'] ?? '#f5f5f5'),
                'cardPadding' => '24px'
            ]
        ];
    }

    private function createOrders($id, $settings)
    {
        return [
            'id' => $id,
            'type' => 'orders',
            'content' => [
                'title' => 'Mis Pedidos',
                'subtitle' => '',
                'emptyTitle' => 'No tienes pedidos aún',
                'emptyMessage' => 'Cuando realices tu primer pedido, aparecerá aquí.',
                'shopButtonText' => 'Ir a la tienda',
                'ordersPerPage' => 10,
                'sortOrder' => 'desc',
                'showOrderStatus' => true,
                'showOrderDate' => true,
                'showOrderTotal' => true,
                'showItemCount' => true,
                'allowExpandDetails' => true
            ],
            'styles' => [
                'backgroundColor' => $settings['background'] ?? '#ffffff',
                'paddingTop' => '40px',
                'paddingRight' => '20px',
                'paddingBottom' => '40px',
                'paddingLeft' => '20px',
                'maxWidth' => '1000px',
                'borderRadius' => $settings['border_radius_small'] ?? '0px'
            ]
        ];
    }

    private function createSuccess($id, $settings)
    {
        return [
            'id' => $id,
            'type' => 'success',
            'content' => [
                'title' => '¡Orden Exitosa!',
                'subtitle' => 'Tu orden ha sido procesada correctamente',
                'iconColor' => '#10b981',
                'titleColor' => $settings['heading'] ?? '#0a0a0a',
                'titleSize' => $settings['heading4_fontSize'] ?? '32px',
                'titleWeight' => 'bold',
                'subtitleColor' => $settings['text'] ?? '#0a0a0a',
                'subtitleSize' => $settings['heading6_fontSize'] ?? '18px',
                'showContinueShoppingButton' => true,
                'continueButtonText' => 'Continuar Comprando',
                'continueButtonBg' => 'transparent',
                'continueButtonColor' => $settings['text'] ?? '#0a0a0a',
                'continueButtonBorder' => $settings['borders'] ?? '#f5f5f5',
                'showOrdersButton' => true,
                'ordersButtonText' => 'Ver Mis Pedidos',
                'ordersButtonBg' => $settings['primary_button_background'] ?? '#d6eaff',
                'ordersButtonColor' => $settings['primary_button_text'] ?? '#0a0a0a',
                'additionalMessage' => '',
                'messageBackgroundColor' => $settings['background'] ?? '#ffffff',
                'messageTextColor' => $settings['text'] ?? '#0a0a0a'
            ],
            'styles' => [
                'backgroundColor' => $settings['background'] ?? '#ffffff',
                'paddingTop' => '40px',
                'paddingRight' => '20px',
                'paddingBottom' => '40px',
                'paddingLeft' => '20px',
                'maxWidth' => '1200px',
                'borderRadius' => $settings['border_radius_small'] ?? '0px'
            ]
        ];
    }

    private function createLinkBio($id, $settings)
    {
        $linkBioId = $id;
        $headingId = $id + 1;
        $button1Id = $id + 2;
        $button2Id = $id + 3;
        $textId = $id + 4;

        return [
            'id' => $linkBioId,
            'type' => 'linkBio',
            'content' => [
                'backgroundType' => 'color',
                'backgroundColor' => $settings['background'] ?? '#ffffff',
                'maxWidth' => '400',
                'buttonsGap' => '16',
                'alignment' => 'center',
                'children' => [
                    [
                        'id' => $headingId,
                        'type' => 'heading',
                        'content' => 'Mis Enlaces',
                        'styles' => [
                            'textStyle' => 'heading1',
                            'layout' => 'fit',
                            'alignment' => 'center',
                            'color' => $settings['heading'] ?? '#0a0a0a',
                            'fontSize' => $settings['heading1_fontSize'] ?? '32px',
                            'fontWeight' => $settings['heading1_fontWeight'] ?? 'bold',
                            'paddingBottom' => '20px'
                        ]
                    ],
                    [
                        'id' => $textId,
                        'type' => 'text',
                        'content' => 'Encuéntrame en todas mis redes sociales',
                        'styles' => [
                            'color' => $settings['text'] ?? '#0a0a0a',
                            'fontSize' => $settings['paragraph_fontSize'] ?? '16px',
                            'fontWeight' => $settings['paragraph_fontWeight'] ?? 'normal',
                            'textAlign' => 'center',
                            'paddingBottom' => '10px'
                        ]
                    ],
                    [
                        'id' => $button1Id,
                        'type' => 'button',
                        'content' => 'Mi Sitio Web',
                        'styles' => [
                            'buttonType' => 'primary',
                            'layout' => 'fill',
                            'buttonUrl' => 'https://ejemplo.com',
                            'buttonText' => 'Visita mi sitio',
                            'paddingTop' => '12px',
                            'paddingBottom' => '12px',
                            'paddingLeft' => '24px',
                            'paddingRight' => '24px',
                            'borderRadius' => $settings['primary_button_corner_radius'] ?? '8px',
                            'backgroundColor' => $settings['primary_button_background'] ?? '#d6eaff',
                            'color' => $settings['primary_button_text'] ?? '#0a0a0a'
                        ]
                    ],
                    [
                        'id' => $button2Id,
                        'type' => 'button',
                        'content' => 'Instagram',
                        'styles' => [
                            'buttonType' => 'secondary',
                            'layout' => 'fill',
                            'buttonUrl' => 'https://instagram.com/usuario',
                            'buttonText' => 'Sígueme en Instagram',
                            'paddingTop' => '12px',
                            'paddingBottom' => '12px',
                            'paddingLeft' => '24px',
                            'paddingRight' => '24px',
                            'borderRadius' => $settings['secondary_button_corner_radius'] ?? '8px',
                            'backgroundColor' => $settings['secondary_button_background'] ?? '#f5f5f5',
                            'color' => $settings['secondary_button_text'] ?? '#0a0a0a'
                        ]
                    ]
                ]
            ],
            'styles' => [
                'paddingTop' => '40px',
                'paddingRight' => '20px',
                'paddingBottom' => '40px',
                'paddingLeft' => '20px',
                'backgroundColor' => $settings['background'] ?? '#ffffff',
                'minHeight' => '600px'
            ]
        ];
    }

    private function createPageContent($id, $settings)
    {
        return [
            'id' => $id,
            'type' => 'pageContent',
            'content' => '<p>Contenido de la página. Haz clic para editar.</p>',
            'styles' => [
                'padding' => '20px',
                'fontFamily' => $settings['body_font'] ?? 'inherit',
                'color' => $settings['text'] ?? '#0a0a0a'
            ]
        ];
    }
}