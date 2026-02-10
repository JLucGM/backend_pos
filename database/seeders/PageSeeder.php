<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Page;
use App\Models\Theme;

class PageSeeder extends Seeder
{
    public function run()
    {
        // Obtener temas disponibles
        $temaAzul = Theme::where('slug', 'tema-azul')->first();
        $temaOscuro = Theme::where('slug', 'tema-oscuro')->first();
        $temaVerde = Theme::where('slug', 'tema-verde')->first();

        // Usar tema azul por defecto si no se encuentran otros
        $defaultTheme = $temaAzul ?? Theme::first();

        $pages = [
            // Páginas para Company 1 - Tema Azul
            [
                'title' => 'Inicio',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'page_type' => 'essential',
                'is_homepage' => true,
                'theme_id' => $defaultTheme?->id ?? 1,
                'uses_template' => true,
                'template_id' => 3,
                'company_id' => 1,
                'theme_settings' => null, // Usar configuración del tema base
            ],
            [
                'title' => 'Tienda',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'page_type' => 'essential',
                'theme_id' => $defaultTheme?->id ?? 1,
                'uses_template' => true,
                'template_id' => 3,
                'company_id' => 1,
                'theme_settings' => null,
            ],
            [
                'title' => 'Detalles del producto',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'page_type' => 'essential',
                'theme_id' => $defaultTheme?->id ?? 1,
                'uses_template' => true,
                'template_id' => 3,
                'company_id' => 1,
                'theme_settings' => null,
            ],
            [
                'title' => 'Carrito de compras',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'page_type' => 'essential',
                'theme_id' => $defaultTheme?->id ?? 1,
                'uses_template' => true,
                'template_id' => 3,
                'company_id' => 1,
                'theme_settings' => null,
            ],
            [
                'title' => 'Checkout',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'page_type' => 'essential',
                'theme_id' => $defaultTheme?->id ?? 1,
                'uses_template' => true,
                'template_id' => 3,
                'company_id' => 1,
                'theme_settings' => null,
            ],
            [
                'title' => 'Iniciar sesión',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'page_type' => 'essential',
                'theme_id' => $defaultTheme?->id ?? 1,
                'uses_template' => true,
                'template_id' => 3,
                'company_id' => 1,
                'theme_settings' => null,
            ],
            [
                'title' => 'Registrarse',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'page_type' => 'essential',
                'theme_id' => $defaultTheme?->id ?? 1,
                'uses_template' => true,
                'template_id' => 3,
                'company_id' => 1,
                'theme_settings' => null,
            ],
            [
                'title' => 'Perfil de usuario',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'page_type' => 'essential',
                'theme_id' => $defaultTheme?->id ?? 1,
                'uses_template' => true,
                'template_id' => 3,
                'company_id' => 1,
                'theme_settings' => null,
            ],
            [
                'title' => 'Pedidos',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'page_type' => 'essential',
                'theme_id' => $defaultTheme?->id ?? 1,
                'uses_template' => true,
                'template_id' => 3,
                'company_id' => 1,
                'theme_settings' => null,
            ],
            [
                'title' => 'Orden exitosa',
                'content' => '<p>Tu orden ha sido procesada exitosamente.</p>',
                'page_type' => 'essential',
                'theme_id' => $defaultTheme?->id ?? 1,
                'uses_template' => false,
                'template_id' => null,
                'layout' => json_encode([
                    [
                        'id' => 1,
                        'type' => 'success',
                        'content' => [
                            'title' => '¡Orden Exitosa!',
                            'subtitle' => 'Tu orden ha sido procesada correctamente',
                            'iconColor' => '#10b981',
                            'titleColor' => '#000000',
                            'titleSize' => '32px',
                            'subtitleColor' => '#666666',
                            'subtitleSize' => '18px',
                            'showContinueShoppingButton' => true,
                            'continueButtonText' => 'Continuar Comprando',
                            'showOrdersButton' => true,
                            'ordersButtonText' => 'Ver Mis Pedidos',
                            'additionalMessage' => 'Recibirás un email de confirmación con los detalles de tu pedido.'
                        ],
                        'styles' => [
                            'backgroundColor' => '#ffffff',
                            'paddingTop' => '40px',
                            'paddingRight' => '20px',
                            'paddingBottom' => '40px',
                            'paddingLeft' => '20px',
                            'maxWidth' => '1200px'
                        ]
                    ]
                ]),
                'company_id' => 1,
                'theme_settings' => null,
            ],
            [
                'title' => 'Politicas de privacidad',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'page_type' => 'policy',
                'is_editable' => true,
                'theme_id' => $defaultTheme?->id ?? 1,
                'company_id' => 1,
                'theme_settings' => null,
            ],
            [
                'title' => 'Terminos de servicio',
                'content' => '<p>Descuentos increíbles en productos seleccionados.</p>',
                'page_type' => 'policy',
                'is_editable' => true,
                'theme_id' => $defaultTheme?->id ?? 1,
                'company_id' => 1,
                'theme_settings' => null,
            ],
            [
                'title' => 'Politicas de envio',
                'content' => '<p>Descuentos increíbles en productos seleccionados.</p>',
                'page_type' => 'policy',
                'is_editable' => true,
                'theme_id' => $defaultTheme?->id ?? 1,
                'company_id' => 1,
                'theme_settings' => null,
            ],
            [
                'title' => 'Política de devolución y reembolso',
                'content' => '<p>Descuentos increíbles en productos seleccionados.</p>',
                'page_type' => 'policy',
                'is_editable' => true,
                'theme_id' => $defaultTheme?->id ?? 1,
                'company_id' => 1,
                'theme_settings' => null,
            ],
            [
                'title' => 'Información de contacto',
                'content' => '<p>Descuentos increíbles en productos seleccionados.</p>',
                'page_type' => 'policy',
                'is_editable' => true,
                'theme_id' => $defaultTheme?->id ?? 1,
                'company_id' => 1,
                'theme_settings' => null,
            ],
            [
                'title' => 'Bio',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'page_type' => 'link_bio',
                'theme_id' => $temaOscuro?->id ?? $defaultTheme?->id ?? 1,
                'uses_template' => true,
                'template_id' => 3,
                'company_id' => 1,
                'theme_settings' => null,
            ],


            // Páginas para Company 2 - Tema Oscuro (ejemplo de variación)
            [
                'title' => 'Inicio',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'page_type' => 'essential',
                'is_homepage' => true,
                'theme_id' => $temaOscuro?->id ?? $defaultTheme?->id ?? 1,
                'uses_template' => true,
                'template_id' => 3,
                'company_id' => 2,
                'theme_settings' => null,
            ],
            [
                'title' => 'Tienda',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'page_type' => 'essential',
                'theme_id' => $temaOscuro?->id ?? $defaultTheme?->id ?? 1,
                'uses_template' => true,
                'template_id' => 3,
                'company_id' => 2,
                'theme_settings' => null,
            ],
            [
                'title' => 'Detalles del producto',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'page_type' => 'essential',
                'theme_id' => $temaOscuro?->id ?? $defaultTheme?->id ?? 1,
                'uses_template' => true,
                'template_id' => 3,
                'company_id' => 2,
                'theme_settings' => null,
            ],
            [
                'title' => 'Carrito de compras',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'page_type' => 'essential',
                'theme_id' => $temaOscuro?->id ?? $defaultTheme?->id ?? 1,
                'uses_template' => true,
                'template_id' => 3,
                'company_id' => 2,
                'theme_settings' => null,
            ],
            [
                'title' => 'Checkout',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'page_type' => 'essential',
                'theme_id' => $temaOscuro?->id ?? $defaultTheme?->id ?? 1,
                'uses_template' => true,
                'template_id' => 3,
                'company_id' => 2,
                'theme_settings' => null,
            ],
            [
                'title' => 'Iniciar sesión',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'page_type' => 'essential',
                'theme_id' => $temaOscuro?->id ?? $defaultTheme?->id ?? 1,
                'uses_template' => true,
                'template_id' => 3,
                'company_id' => 2,
                'theme_settings' => null,
            ],
            [
                'title' => 'Registrarse',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'page_type' => 'essential',
                'theme_id' => $temaOscuro?->id ?? $defaultTheme?->id ?? 1,
                'uses_template' => true,
                'template_id' => 3,
                'company_id' => 2,
                'theme_settings' => null,
            ],
            [
                'title' => 'Perfil de usuario',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'page_type' => 'essential',
                'theme_id' => $temaOscuro?->id ?? $defaultTheme?->id ?? 1,
                'uses_template' => true,
                'template_id' => 3,
                'company_id' => 2,
                'theme_settings' => null,
            ],
            [
                'title' => 'Pedidos',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'page_type' => 'essential',
                'theme_id' => $temaOscuro?->id ?? $defaultTheme?->id ?? 1,
                'uses_template' => true,
                'template_id' => 3,
                'company_id' => 2,
                'theme_settings' => null,
            ],
            [
                'title' => 'Bio',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'page_type' => 'link_bio',
                'theme_id' => $temaOscuro?->id ?? $defaultTheme?->id ?? 1,
                'uses_template' => true,
                'template_id' => 3,
                'company_id' => 2,
                'theme_settings' => null,
            ],
            [
                'title' => 'Orden exitosa',
                'content' => '<p>Tu orden ha sido procesada exitosamente.</p>',
                'page_type' => 'essential',
                'theme_id' => $defaultTheme?->id ?? 1,
                'uses_template' => false,
                'template_id' => null,
                'layout' => json_encode([
                    [
                        'id' => 1,
                        'type' => 'success',
                        'content' => [
                            'title' => '¡Orden Exitosa!',
                            'subtitle' => 'Tu orden ha sido procesada correctamente',
                            'iconColor' => '#10b981',
                            'titleColor' => '#000000',
                            'titleSize' => '32px',
                            'subtitleColor' => '#666666',
                            'subtitleSize' => '18px',
                            'showContinueShoppingButton' => true,
                            'continueButtonText' => 'Continuar Comprando',
                            'showOrdersButton' => true,
                            'ordersButtonText' => 'Ver Mis Pedidos',
                            'additionalMessage' => 'Recibirás un email de confirmación con los detalles de tu pedido.'
                        ],
                        'styles' => [
                            'backgroundColor' => '#ffffff',
                            'paddingTop' => '40px',
                            'paddingRight' => '20px',
                            'paddingBottom' => '40px',
                            'paddingLeft' => '20px',
                            'maxWidth' => '1200px'
                        ]
                    ]
                ]),
                'company_id' => 2,
                'theme_settings' => null,
            ],
            [
                'title' => 'Politicas de privacidad',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'page_type' => 'policy',
                'is_editable' => true,
                'theme_id' => $temaOscuro?->id ?? $defaultTheme?->id ?? 1,
                'company_id' => 2,
                'theme_settings' => null,
            ],
            [
                'title' => 'Terminos de servicio',
                'content' => '<p>Descuentos increíbles en productos seleccionados.</p>',
                'page_type' => 'policy',
                'is_editable' => true,
                'theme_id' => $temaOscuro?->id ?? $defaultTheme?->id ?? 1,
                'company_id' => 2,
                'theme_settings' => null,
            ],
            [
                'title' => 'Politicas de envio',
                'content' => '<p>Descuentos increíbles en productos seleccionados.</p>',
                'page_type' => 'policy',
                'is_editable' => true,
                'theme_id' => $temaOscuro?->id ?? $defaultTheme?->id ?? 1,
                'company_id' => 2,
                'theme_settings' => null,
            ],
            [
                'title' => 'Política de devolución y reembolso',
                'content' => '<p>Descuentos increíbles en productos seleccionados.</p>',
                'page_type' => 'policy',
                'is_editable' => true,
                'theme_id' => $defaultTheme?->id ?? 1,
                'company_id' => 1,
                'theme_settings' => null,
            ],
            [
                'title' => 'Información de contacto',
                'content' => '<p>Descuentos increíbles en productos seleccionados.</p>',
                'page_type' => 'policy',
                'is_editable' => true,
                'theme_id' => $temaOscuro?->id ?? $defaultTheme?->id ?? 1,
                'company_id' => 2,
                'theme_settings' => null,
            ],
        ];

        foreach ($pages as $page) {
            // Buscar por título y compañía para evitar duplicados
            $searchKey = [
                'title' => $page['title'],
                'company_id' => $page['company_id'],
            ];

            // Crear o actualizar la página
            Page::updateOrCreate($searchKey, $page);
        }
    }
}
