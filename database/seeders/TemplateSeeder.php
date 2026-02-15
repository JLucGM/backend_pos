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
            // Si no existe, lo creamos con settings por defecto (copiados de ThemeSeeder para tema-azul)
            $theme = Theme::create([
                'name' => 'Tema Azul',
                'slug' => 'tema-azul',
                'description' => 'Tema azul por defecto',
                'is_active' => true,
                'settings' => [
                    "background" => "#ffffff",
                    "heading" => "#0a0a0a",
                    "text" => "#0a0a0a",
                    "links" => "#0080ff",
                    "hover_links" => "#0066cc",
                    "borders" => "#f5f5f5",
                    "shadows" => "#0000001a",
                    "accent_color" => "#0066cc",
                    "muted_color" => "#6b7280",
                    "success_color" => "#10b981",
                    "warning_color" => "#f59e0b",
                    "danger_color" => "#ef4444",
                    "info_color" => "#3b82f6",
                    "spacing_unit" => "0.5rem",
                    "spacing_none" => "0",
                    "spacing_xxsmall" => "0.125rem",
                    "spacing_xsmall" => "0.25rem",
                    "spacing_small" => "0.5rem",
                    "spacing_medium" => "1rem",
                    "spacing_large" => "1.5rem",
                    "spacing_xlarge" => "2rem",
                    "spacing_2xlarge" => "2.5rem",
                    "spacing_3xlarge" => "3rem",
                    "spacing_4xlarge" => "4rem",
                    "border_radius_small" => "0.25rem",
                    "border_radius_medium" => "0.5rem",
                    "border_radius_large" => "1rem",
                    "border_radius_xlarge" => "2rem",
                    "border_radius_full" => "9999px",
                    "border_radius_circle" => "50%",
                    "border_radius_pill" => "9999px",
                    "border_thickness_none" => "0px",
                    "border_thickness_hairline" => "1px",
                    "border_thickness_thin" => "2px",
                    "border_thickness_medium" => "3px",
                    "border_thickness_thick" => "4px",
                    "border_thickness_xthick" => "6px",
                    "border_style_solid" => "solid",
                    "border_style_dashed" => "dashed",
                    "border_style_dotted" => "dotted",
                    "border_style_double" => "double",
                    "border_style_groove" => "groove",
                    "border_style_ridge" => "ridge",
                    "border_style_inset" => "inset",
                    "border_style_outset" => "outset",
                    "border_style_none" => "none",
                    "border_style_hidden" => "hidden",
                    "shadow_sm" => "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    "shadow_md" => "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    "shadow_lg" => "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    "shadow_xl" => "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                    "shadow_2xl" => "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    "opacity_0" => "0",
                    "opacity_25" => "0.25",
                    "opacity_50" => "0.5",
                    "opacity_75" => "0.75",
                    "opacity_100" => "1",
                    "default_border_style" => "solid",
                    "default_border_thickness" => "1px",
                    "default_border_radius" => "0.5rem",
                    "primary_button_background" => "#d6eaff",
                    "primary_button_text" => "#0a0a0a",
                    "primary_button_border" => "#d6eaff",
                    "primary_button_border_thickness" => "1px",
                    "primary_button_corner_radius" => "0.5rem",
                    "primary_button_text_case" => "default",
                    "primary_button_hover_background" => "#addeff",
                    "primary_button_hover_text" => "#0a0a0a",
                    "primary_button_hover_border" => "#addeff",
                    "primary_button_hover_border_thickness" => "1px",
                    "primary_button_focus_background" => "#85c2ff",
                    "primary_button_focus_text" => "#0a0a0a",
                    "primary_button_focus_border" => "#85c2ff",
                    "primary_button_focus_border_thickness" => "2px",
                    "secondary_button_background" => "#f5f5f5",
                    "secondary_button_text" => "#0a0a0a",
                    "secondary_button_border" => "#f5f5f5",
                    "secondary_button_border_thickness" => "1px",
                    "secondary_button_corner_radius" => "0.5rem",
                    "secondary_button_text_case" => "default",
                    "secondary_button_hover_background" => "#d6d6d6",
                    "secondary_button_hover_text" => "#0a0a0a",
                    "secondary_button_hover_border" => "#d6d6d6",
                    "secondary_button_hover_border_thickness" => "1px",
                    "secondary_button_focus_background" => "#b8b8b8",
                    "secondary_button_focus_text" => "#0a0a0a",
                    "secondary_button_focus_border" => "#b8b8b8",
                    "secondary_button_focus_border_thickness" => "2px",
                    "input_background" => "#ffffff",
                    "input_text" => "#0a0a0a",
                    "input_border" => "#f5f5f5",
                    "input_border_thickness" => "1px",
                    "input_corner_radius" => "0.375rem",
                    "input_hover_background" => "#ffffff",
                    "input_focus_background" => "#ffffff",
                    "input_focus_border" => "#d6eaff",
                    "body_font" => "'Arial', 'Helvetica', sans-serif",
                    "heading_font" => "'Arial', 'Helvetica', sans-serif",
                    "subheading_font" => "'Arial', 'Helvetica', sans-serif",
                    "accent_font" => "'Georgia', 'Times New Roman', serif",
                    "paragraph_font" => "body_font",
                    "paragraph_fontSize" => "16px",
                    "paragraph_fontWeight" => "normal",
                    "paragraph_lineHeight" => "1.6",
                    "paragraph_textTransform" => "none",
                    "heading1_font" => "heading_font",
                    "heading1_fontSize" => "2.5rem",
                    "heading1_fontWeight" => "bold",
                    "heading1_lineHeight" => "1.2",
                    "heading1_textTransform" => "none",
                    "heading2_font" => "heading_font",
                    "heading2_fontSize" => "2rem",
                    "heading2_fontWeight" => "bold",
                    "heading2_lineHeight" => "1.3",
                    "heading2_textTransform" => "none",
                    "heading3_font" => "heading_font",
                    "heading3_fontSize" => "1.75rem",
                    "heading3_fontWeight" => "bold",
                    "heading3_lineHeight" => "1.3",
                    "heading3_textTransform" => "none",
                    "heading4_font" => "heading_font",
                    "heading4_fontSize" => "1.5rem",
                    "heading4_fontWeight" => "bold",
                    "heading4_lineHeight" => "1.4",
                    "heading4_textTransform" => "none",
                    "heading5_font" => "heading_font",
                    "heading5_fontSize" => "1.25rem",
                    "heading5_fontWeight" => "bold",
                    "heading5_lineHeight" => "1.4",
                    "heading5_textTransform" => "none",
                    "heading6_font" => "heading_font",
                    "heading6_fontSize" => "1rem",
                    "heading6_fontWeight" => "bold",
                    "heading6_lineHeight" => "1.5",
                    "heading6_textTransform" => "none",
                    "primary_color" => "#d6eaff",
                    "foreground" => "#0a0a0a",
                    "secondary_color" => "#f5f5f5",
                    "font_family" => "'Arial', sans-serif",
                    "heading_font_family" => "'Arial', sans-serif",
                    "button_font_family" => "'Arial', sans-serif",
                    "input_font_family" => "'Arial', sans-serif",
                    "carousel_gapX" => "10px",
                    "carousel_gapY" => "10px",
                    "banner_containerHeight" => "400px",
                    "banner_paddingTop" => "20px",
                    "banner_paddingRight" => "20px",
                    "banner_paddingBottom" => "20px",
                    "banner_paddingLeft" => "20px",
                    "banner_innerContainerBackgroundOpacity" => "1",
                    "banner_innerContainerPaddingTop" => "20px",
                    "banner_innerContainerPaddingRight" => "20px",
                    "banner_innerContainerPaddingBottom" => "20px",
                    "banner_innerContainerPaddingLeft" => "20px",
                    "banner_innerContainerBorderRadius" => "0px",
                    "bento_backgroundColor" => "#ffffffff",
                    "bento_containerBorderRadius" => "0px",
                    "bento_gridGap" => "20px",
                    "container_borderRadius" => "0px",
                    "container_gap" => "0px",
                    "marquee_paddingTop" => "10px",
                    "marquee_paddingBottom" => "10px",
                    "marquee_fontSize" => "16px",
                    "marquee_fontWeight" => "normal",
                    "marquee_borderRadius" => "0px",
                    "divider_paddingTop" => "20px",
                    "divider_paddingBottom" => "20px",
                    "divider_lineWidth" => "1px",
                    "divider_lineLength" => "100%",
                    "divider_opacity" => "1",
                ]
            ]);
        }

        $settings = $this->getDefaultThemeSettings(); // Ahora $settings ya no se usa directamente para valores, pero lo mantenemos por si acaso
        $baseId = 1000000;

        $templates = [
            // Plantilla para página de inicio
            [
                'name' => 'Página de Inicio',
                'slug' => 'home-template',
                'description' => 'Plantilla para la página de inicio con banner, carrusel y separador',
                'layout_structure' => json_encode([
                    $this->createAnnouncementBar($baseId + 1),
                    $this->createBanner($baseId + 10),
                    $this->createCarousel($baseId + 20),
                    $this->createDivider($baseId + 30),
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
                    $this->createProductList($baseId + 40),
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
                    $this->createProductDetail($baseId + 50),
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
                    $this->createCart($baseId + 60),
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
                    $this->createCheckout($baseId + 70),
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
                    $this->createLogin($baseId + 80),
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
                    $this->createRegister($baseId + 90),
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
                    $this->createProfile($baseId + 100),
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
                    $this->createOrders($baseId + 110),
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
                    $this->createSuccess($baseId + 120),
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
                    $this->createLinkBio($baseId + 130),
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
                    $this->createPageContent($baseId + 140),
                ]),
                'is_global' => true,
                'theme_id' => $theme->id,
            ],
            // Plantilla básica (vacía, solo header y footer se añaden globalmente)
            [
                'name' => 'Página Básica',
                'slug' => 'basic-template',
                'description' => 'Plantilla vacía para personalizar completamente',
                'layout_structure' => json_encode([]),
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

    // ==================== MÉTODOS DE COMPONENTES ====================
    // Todos ellos ahora devuelven referencias "theme.clave" en lugar de valores concretos.
    // Los valores numéricos fijos (como paddings, gaps, etc.) se mantienen como números.

    private function createAnnouncementBar($id)
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
                            'color' => 'theme.text',
                            'textTransform' => 'none',
                            'fontType' => 'default'
                        ]
                    ]
                ]
            ],
            'styles' => [
                'backgroundColor' => 'theme.background',
                'paddingTop' => '15px',
                'paddingBottom' => '15px'
            ]
        ];
    }

    private function createBanner($id)
    {
        $titleId = $id + 1;
        $textId = $id + 2;
        return [
            'id' => $id,
            'type' => 'banner',
            'content' => [
                'containerHeight' => 'theme.banner_containerHeight',
                'containerWidth' => '100%',
                'marginTop' => '0px',
                'marginRight' => '0px',
                'marginBottom' => '0px',
                'marginLeft' => '0px',
                'paddingTop' => 'theme.banner_paddingTop',
                'paddingRight' => 'theme.banner_paddingRight',
                'paddingBottom' => 'theme.banner_paddingBottom',
                'paddingLeft' => 'theme.banner_paddingLeft',
                'backgroundColor' => 'theme.background',
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
                'innerContainerBackgroundOpacity' => 'theme.banner_innerContainerBackgroundOpacity',
                'innerContainerPaddingTop' => 'theme.banner_innerContainerPaddingTop',
                'innerContainerPaddingRight' => 'theme.banner_innerContainerPaddingRight',
                'innerContainerPaddingBottom' => 'theme.banner_innerContainerPaddingBottom',
                'innerContainerPaddingLeft' => 'theme.banner_innerContainerPaddingLeft',
                'innerContainerBorderRadius' => 'theme.banner_innerContainerBorderRadius',
                'innerContainerWidth' => 'auto',
                'innerContainerMaxWidth' => '800px',
                'children' => [
                    [
                        'id' => $titleId,
                        'type' => 'heading',
                        'content' => 'Título del Banner',
                        'styles' => [
                            'textStyle' => 'heading2',
                            'layout' => 'fill',
                            'alignment' => 'center',
                            'paddingTop' => '10px',
                            'paddingRight' => '10px',
                            'paddingBottom' => '10px',
                            'paddingLeft' => '10px',
                            'backgroundColor' => 'transparent',
                            'borderRadius' => 'theme.border_radius_small',
                            'color' => 'theme.heading'
                        ]
                    ],
                    [
                        'id' => $textId,
                        'type' => 'bannerText',
                        'content' => 'Texto descriptivo del banner',
                        'styles' => [
                            'layout' => 'fill',
                            'alignment' => 'center',
                            'background' => 'transparent',
                            'backgroundOpacity' => 'theme.opacity_100',
                            'borderRadius' => 'theme.border_radius_small',
                            'paddingTop' => '10px',
                            'paddingRight' => '10px',
                            'paddingBottom' => '10px',
                            'paddingLeft' => '10px',
                            'color' => 'theme.text',
                            'fontSize' => 'theme.paragraph_fontSize',
                            'fontWeight' => 'theme.paragraph_fontWeight'
                        ]
                    ]
                ]
            ],
            'styles' => []
        ];
    }

    private function createCarousel($id)
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
                'gapX' => 'theme.carousel_gapX',
                'gapY' => 'theme.carousel_gapY',
                'backgroundColor' => 'theme.background',
                'children' => [
                    [
                        'id' => $titleId,
                        'type' => 'carouselTitle',
                        'content' => 'Productos en Carrusel',
                        'styles' => [
                            'layout' => 'fit',
                            'alignment' => 'center',
                            'color' => 'theme.heading',
                            'fontSize' => 'theme.heading2_fontSize',
                            'fontWeight' => 'theme.heading2_fontWeight'
                        ]
                    ],
                    [
                        'id' => $cardId,
                        'type' => 'carouselCard',
                        'content' => [
                            'cardBorder' => 'none',
                            'cardBorderThickness' => 'theme.border_thickness_hairline',
                            'cardBorderOpacity' => 'theme.opacity_100',
                            'cardBorderRadius' => 'theme.border_radius_small',
                            'cardPaddingTop' => '10px',
                            'cardPaddingRight' => '10px',
                            'cardPaddingBottom' => '10px',
                            'cardPaddingLeft' => '10px',
                            'imageBorder' => 'none',
                            'imageBorderThickness' => 'theme.border_thickness_hairline',
                            'imageBorderOpacity' => 'theme.opacity_100',
                            'imageBorderRadius' => 'theme.border_radius_small',
                            'children' => [
                                [
                                    'id' => $imageId,
                                    'type' => 'carouselImage',
                                    'content' => '',
                                    'styles' => [
                                        'aspectRatio' => 'square',
                                        'imageBorder' => 'none',
                                        'imageBorderThickness' => 'theme.border_thickness_hairline',
                                        'imageBorderOpacity' => 'theme.opacity_100',
                                        'imageBorderRadius' => 'theme.border_radius_small'
                                    ]
                                ],
                                [
                                    'id' => $nameId,
                                    'type' => 'carouselName',
                                    'content' => '',
                                    'styles' => [
                                        'layout' => 'fit',
                                        'alignment' => 'left',
                                        'color' => 'theme.text',
                                        'fontSize' => 'theme.paragraph_fontSize',
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
                                        'color' => 'theme.text',
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

    private function createDivider($id)
    {
        return [
            'id' => $id,
            'type' => 'divider',
            'content' => '',
            'styles' => [
                'paddingTop' => 'theme.divider_paddingTop',
                'paddingBottom' => 'theme.divider_paddingBottom',
                'lineWidth' => 'theme.divider_lineWidth',
                'lineLength' => 'theme.divider_lineLength',
                'lineColor' => 'theme.borders',
                'opacity' => 'theme.divider_opacity',
            ]
        ];
    }

    private function createProductList($id)
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
                'gapX' => 'theme.carousel_gapX',
                'gapY' => 'theme.carousel_gapY',
                'backgroundColor' => 'theme.background',
                'limit' => 8,
                'children' => [
                    [
                        'id' => $titleId,
                        'type' => 'productTitle',
                        'content' => 'Lista de Productos',
                        'styles' => [
                            'layout' => 'fit',
                            'alignment' => 'center',
                            'color' => 'theme.heading',
                            'fontSize' => 'theme.heading2_fontSize',
                            'fontWeight' => 'theme.heading2_fontWeight'
                        ]
                    ],
                    [
                        'id' => $cardId,
                        'type' => 'productCard',
                        'content' => [
                            'cardBorder' => 'none',
                            'cardBorderThickness' => 'theme.border_thickness_hairline',
                            'cardBorderOpacity' => 'theme.opacity_100',
                            'cardBorderRadius' => 'theme.border_radius_small',
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
                                        'imageBorder' => 'theme.border_thickness_none',
                                        'imageBorderThickness' => 'theme.border_thickness_hairline',
                                        'imageBorderOpacity' => 'theme.opacity_100',
                                        'imageBorderRadius' => 'theme.border_radius_small'
                                    ]
                                ],
                                [
                                    'id' => $nameId,
                                    'type' => 'productName',
                                    'content' => '',
                                    'styles' => [
                                        'layout' => 'fit',
                                        'alignment' => 'left',
                                        'color' => 'theme.text',
                                        'fontSize' => 'theme.paragraph_fontSize',
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
                                        'color' => 'theme.text',
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
                            'borderRadius' => 'theme.border_radius_small',
                            'borderColor' => 'theme.borders',
                            'borderThickness' => 'theme.border_thickness_hairline',
                            'background' => 'theme.background'
                        ]
                    ],
                    [
                        'id' => $sortSelectId,
                        'type' => 'productListSortSelect',
                        'content' => [],
                        'styles' => [
                            'borderRadius' => 'theme.border_radius_small',
                            'borderColor' => 'theme.borders',
                            'borderThickness' => 'theme.border_thickness_hairline',
                            'background' => 'theme.background'
                        ]
                    ],
                    [
                        'id' => $paginationId,
                        'type' => 'productListPagination',
                        'content' => [],
                        'styles' => [
                            'borderRadius' => 'theme.border_radius_small',
                            'border' => 'theme.border_thickness_hairline solid',
                            'borderColor' => 'theme.borders',
                            'background' => 'theme.background'
                        ]
                    ]
                ]
            ],
            'styles' => [
                'backgroundColor' => 'theme.background',
                'paddingTop' => '20px',
                'paddingRight' => '20px',
                'paddingBottom' => '20px',
                'paddingLeft' => '20px'
            ]
        ];
    }

    private function createProductDetail($id)
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
                            'imageBorderThickness' => 'theme.border_thickness_hairline',
                            'imageBorderOpacity' => 'theme.opacity_100',
                            'imageBorderRadius' => 'theme.border_radius_small'
                        ]
                    ],
                    [
                        'id' => $nameId,
                        'type' => 'productDetailName',
                        'content' => '',
                        'styles' => [
                            'layout' => 'fit',
                            'alignment' => 'left',
                            'color' => 'theme.heading',
                            'fontSize' => 'theme.heading4_fontSize',
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
                            'color' => 'theme.text',
                            'fontSize' => 'theme.heading5_fontSize',
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
                            'color' => 'theme.text',
                            'fontSize' => 'theme.paragraph_fontSize',
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
                            'borderRadius' => 'theme.primary_button_corner_radius',
                            'backgroundColor' => 'theme.primary_button_background',
                            'color' => 'theme.primary_button_text'
                        ]
                    ],
                    [
                        'id' => $attributesId,
                        'type' => 'productDetailAttributes',
                        'content' => [
                            'title' => 'Opciones del Producto',
                        ],
                        'styles' => [
                            'titleColor' => 'theme.heading',
                            'titleSize' => '18px',
                            'labelColor' => 'theme.text',
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
                            'borderRadius' => 'theme.border_radius_small',
                            'borderWidth' => 'theme.border_thickness_hairline',
                            'inStockBgColor' => 'theme.success_color',
                            'inStockColor' => 'theme.success_color',
                            'outOfStockBgColor' => 'theme.danger_color',
                            'outOfStockColor' => 'theme.danger_color',
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
                            'labelColor' => 'theme.text',
                            'borderColor' => 'theme.borders',
                            'borderRadius' => 'theme.border_radius_medium',
                            'buttonColor' => 'theme.text',
                            'inputColor' => 'theme.text',
                        ]
                    ]
                ]
            ],
            'styles' => []
        ];
    }

    private function createCart($id)
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
                            'backgroundColor' => 'theme.background',
                            'padding' => '20px',
                            'borderRadius' => 'theme.border_radius_medium',
                            'titleSize' => 'theme.heading5_fontSize',
                            'titleColor' => 'theme.heading',
                            'imageSize' => '80px',
                            'rowPadding' => '16px',
                            'rowBorder' => '1px solid ' . 'theme.borders',
                            'buttonColor' => 'theme.danger_color',
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
                            'backgroundColor' => 'theme.background',
                            'padding' => '24px',
                            'borderWidth' => 'theme.border_thickness_hairline',
                            'borderRadius' => 'theme.border_radius_large',
                            'borderColor' => 'theme.borders',
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
                'backgroundColor' => 'theme.background',
                'gap' => '40px',
            ]
        ];
    }

    private function createCheckout($id)
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
                            'backgroundColor' => 'theme.background',
                            'padding' => '16px',
                            'borderRadius' => 'theme.border_radius_medium'
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
                            'backgroundColor' => 'theme.background',
                            'padding' => '24px',
                            'borderRadius' => 'theme.border_radius_medium',
                            'titleSize' => '20px',
                            'titleColor' => 'theme.heading',
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
                            'backgroundColor' => 'theme.background',
                            'padding' => '24px',
                            'borderRadius' => 'theme.border_radius_large',
                            'borderColor' => 'theme.borders',
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
                            'backgroundColor' => 'theme.background',
                            'padding' => '24px',
                            'borderRadius' => 'theme.border_radius_large',
                            'titleSize' => '20px',
                            'buttonBackgroundColor' => 'theme.primary_button_background',
                            'buttonColor' => 'theme.primary_button_text',
                            'buttonBorderRadius' => 'theme.primary_button_corner_radius'
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
                'backgroundColor' => 'theme.background',
                'gap' => '40px',
            ]
        ];
    }

    private function createLogin($id)
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
                'backgroundColor' => 'theme.background',
                'padding' => '32px',
                'borderRadius' => 'theme.border_radius_medium',
                'titleColor' => 'theme.heading',
                'titleSize' => 'theme.heading4_fontSize',
                'subtitleColor' => 'theme.text',
                'subtitleSize' => 'theme.paragraph_fontSize',
                'buttonBackgroundColor' => 'theme.primary_button_background',
                'buttonColor' => 'theme.primary_button_text',
                'buttonBorderRadius' => 'theme.primary_button_corner_radius',
                'maxWidth' => '400px',
                'margin' => '0 auto'
            ]
        ];
    }

    private function createRegister($id)
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
                'backgroundColor' => 'theme.background',
                'padding' => '32px',
                'borderRadius' => 'theme.border_radius_medium',
                'titleColor' => 'theme.heading',
                'titleSize' => 'theme.heading4_fontSize',
                'subtitleColor' => 'theme.text',
                'subtitleSize' => 'theme.paragraph_fontSize',
                'buttonBackgroundColor' => 'theme.secondary_button_background',
                'buttonColor' => 'theme.secondary_button_text',
                'buttonBorderRadius' => 'theme.secondary_button_corner_radius',
                'maxWidth' => '400px',
                'margin' => '0 auto'
            ]
        ];
    }

    private function createProfile($id)
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
                'backgroundColor' => 'theme.background',
                'paddingTop' => '40px',
                'paddingRight' => '20px',
                'paddingBottom' => '40px',
                'paddingLeft' => '20px',
                'maxWidth' => '1200px',
                'borderRadius' => 'theme.border_radius_small',
                'titleColor' => 'theme.heading',
                'titleSize' => 'theme.heading4_fontSize',
                'titleWeight' => 'bold',
                'titleAlignment' => 'left',
                'cardBackgroundColor' => 'theme.background',
                'cardBorderRadius' => 'theme.border_radius_medium',
                'cardBorder' => '1px solid ' . 'theme.borders',
                'cardPadding' => '24px'
            ]
        ];
    }

    private function createOrders($id)
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
                'backgroundColor' => 'theme.background',
                'paddingTop' => '40px',
                'paddingRight' => '20px',
                'paddingBottom' => '40px',
                'paddingLeft' => '20px',
                'maxWidth' => '1000px',
                'borderRadius' => 'theme.border_radius_small'
            ]
        ];
    }

    private function createSuccess($id)
    {
        return [
            'id' => $id,
            'type' => 'success',
            'content' => [
                'title' => '¡Orden Exitosa!',
                'subtitle' => 'Tu orden ha sido procesada correctamente',
                'iconColor' => '#10b981',
                'titleColor' => 'theme.heading',
                'titleSize' => 'theme.heading4_fontSize',
                'titleWeight' => 'bold',
                'subtitleColor' => 'theme.text',
                'subtitleSize' => 'theme.heading6_fontSize',
                'showContinueShoppingButton' => true,
                'continueButtonText' => 'Continuar Comprando',
                'continueButtonBg' => 'transparent',
                'continueButtonColor' => 'theme.text',
                'continueButtonBorder' => 'theme.borders',
                'showOrdersButton' => true,
                'ordersButtonText' => 'Ver Mis Pedidos',
                'ordersButtonBg' => 'theme.primary_button_background',
                'ordersButtonColor' => 'theme.primary_button_text',
                'additionalMessage' => '',
                'messageBackgroundColor' => 'theme.background',
                'messageTextColor' => 'theme.text'
            ],
            'styles' => [
                'backgroundColor' => 'theme.background',
                'paddingTop' => '40px',
                'paddingRight' => '20px',
                'paddingBottom' => '40px',
                'paddingLeft' => '20px',
                'maxWidth' => '1200px',
                'borderRadius' => 'theme.border_radius_small'
            ]
        ];
    }

    private function createLinkBio($id)
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
                'backgroundColor' => 'theme.background',
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
                            'color' => 'theme.heading',
                            'fontSize' => 'theme.heading1_fontSize',
                            'fontWeight' => 'theme.heading1_fontWeight',
                            'paddingBottom' => '20px'
                        ]
                    ],
                    [
                        'id' => $textId,
                        'type' => 'text',
                        'content' => 'Encuéntrame en todas mis redes sociales',
                        'styles' => [
                            'color' => 'theme.text',
                            'fontSize' => 'theme.paragraph_fontSize',
                            'fontWeight' => 'theme.paragraph_fontWeight',
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
                            'borderRadius' => 'theme.primary_button_corner_radius',
                            'backgroundColor' => 'theme.primary_button_background',
                            'color' => 'theme.primary_button_text'
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
                            'borderRadius' => 'theme.secondary_button_corner_radius',
                            'backgroundColor' => 'theme.secondary_button_background',
                            'color' => 'theme.secondary_button_text'
                        ]
                    ]
                ]
            ],
            'styles' => [
                'paddingTop' => '40px',
                'paddingRight' => '20px',
                'paddingBottom' => '40px',
                'paddingLeft' => '20px',
                'backgroundColor' => 'theme.background',
                'minHeight' => '600px'
            ]
        ];
    }

    private function createPageContent($id)
    {
        return [
            'id' => $id,
            'type' => 'pageContent',
            'content' => '<p>Contenido de la página. Haz clic para editar.</p>',
            'styles' => [
                'padding' => '20px',
                'fontFamily' => 'theme.body_font',
                'color' => 'theme.text',
                'backgroundColor' => 'theme.background'
            ]
        ];
    }
}
