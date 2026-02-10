<?php

namespace App\Services;

use App\Models\Company;
use App\Models\Page;
use App\Models\Theme;
use Illuminate\Support\Facades\DB;

class DefaultPageService
{
    /**
     * Crea páginas por defecto para una empresa
     */
    public static function createForCompany(Company $company): void
    {
        DB::transaction(function () use ($company) {
            // Obtener el tema por defecto (tema-azul)
            $defaultTheme = Theme::where('slug', 'tema-azul')->first();

            // Si no existe, usar el primero disponible
            if (!$defaultTheme) {
                $defaultTheme = Theme::first();
            }

            // Definir las páginas por defecto
            $pages = [
                [
                    'title' => 'Inicio',
                    'content' => '<p>Bienvenido a nuestra tienda en línea. Aquí encontrarás los mejores productos.</p>',
                    'page_type' => 'essential',
                    'is_homepage' => true,
                    'theme_id' => $defaultTheme?->id ?? null,
                    'uses_template' => true,
                    'template_id' => 3,
                    'company_id' => $company->id,
                    'theme_settings' => null,
                ],
                [
                    'title' => 'Tienda',
                    'content' => '<p>Explora nuestra amplia selección de productos.</p>',
                    'page_type' => 'essential',
                    'theme_id' => $defaultTheme?->id ?? null,
                    'uses_template' => true,
                    'template_id' => 3,
                    'company_id' => $company->id,
                    'theme_settings' => null,
                ],
                [
                    'title' => 'Detalles del producto',
                    'content' => '<p>Detalles completos de cada producto.</p>',
                    'page_type' => 'essential',
                    'theme_id' => $defaultTheme?->id ?? null,
                    'uses_template' => true,
                    'template_id' => 3,
                    'company_id' => $company->id,
                    'theme_settings' => null,
                ],
                [
                    'title' => 'Carrito de compras',
                    'content' => '<p>Tu carrito de compras está vacío.</p>',
                    'page_type' => 'essential',
                    'theme_id' => $defaultTheme?->id ?? null,
                    'uses_template' => true,
                    'template_id' => 3,
                    'company_id' => $company->id,
                    'theme_settings' => null,
                ],
                [
                    'title' => 'Checkout',
                    'content' => '<p>Completa tu información de envío y pago.</p>',
                    'page_type' => 'essential',
                    'theme_id' => $defaultTheme?->id ?? null,
                    'uses_template' => true,
                    'template_id' => 3,
                    'company_id' => $company->id,
                    'theme_settings' => null,
                ],
                [
                    'title' => 'Iniciar sesión',
                    'content' => '<p>Inicia sesión en tu cuenta.</p>',
                    'page_type' => 'essential',
                    'theme_id' => $defaultTheme?->id ?? null,
                    'uses_template' => true,
                    'template_id' => 3,
                    'company_id' => $company->id,
                    'theme_settings' => null,
                ],
                [
                    'title' => 'Registrarse',
                    'content' => '<p>Crea una nueva cuenta.</p>',
                    'page_type' => 'essential',
                    'theme_id' => $defaultTheme?->id ?? null,
                    'uses_template' => true,
                    'template_id' => 3,
                    'company_id' => $company->id,
                    'theme_settings' => null,
                ],
                [
                    'title' => 'Perfil de usuario',
                    'content' => '<p>Gestiona tu perfil y preferencias.</p>',
                    'page_type' => 'essential',
                    'theme_id' => $defaultTheme?->id ?? null,
                    'uses_template' => true,
                    'template_id' => 3,
                    'company_id' => $company->id,
                    'theme_settings' => null,
                ],
                [
                    'title' => 'Pedidos',
                    'content' => '<p>Revisa el historial de tus pedidos.</p>',
                    'page_type' => 'essential',
                    'theme_id' => $defaultTheme?->id ?? null,
                    'uses_template' => true,
                    'template_id' => 3,
                    'company_id' => $company->id,
                    'theme_settings' => null,
                ],
                [
                    'title' => 'Políticas de privacidad',
                    'content' => '<p>Nuestras políticas de privacidad y protección de datos.</p>',
                    'page_type' => 'policy',
                    'is_editable' => true,
                    'theme_id' => $defaultTheme?->id ?? null,
                    'company_id' => $company->id,
                    'theme_settings' => null,
                ],
                [
                    'title' => 'Términos de servicio',
                    'content' => '<p>Los términos y condiciones de nuestro servicio.</p>',
                    'page_type' => 'policy',
                    'is_editable' => true,
                    'theme_id' => $defaultTheme?->id ?? null,
                    'company_id' => $company->id,
                    'theme_settings' => null,
                ],
                [
                    'title' => 'Políticas de envío',
                    'content' => '<p>Información sobre nuestras políticas de envío y entregas.</p>',
                    'page_type' => 'policy',
                    'is_editable' => true,
                    'theme_id' => $defaultTheme?->id ?? null,
                    'company_id' => $company->id,
                    'theme_settings' => null,
                ],
                [
                    'title' => 'Información de contacto',
                    'content' => '<p>Contáctanos para cualquier consulta o soporte.</p>',
                    'page_type' => 'policy',
                    'is_editable' => true,
                    'theme_id' => $defaultTheme?->id ?? null,
                    'company_id' => $company->id,
                    'theme_settings' => null,
                ],
                [
                    'title' => 'Política de devolución y reembolso',
                    'content' => '<p>Descuentos increíbles en productos seleccionados.</p>',
                    'page_type' => 'policy',
                    'is_editable' => true,
                    'theme_id' => $defaultTheme?->id ?? null,
                    'company_id' => $company->id,
                    'theme_settings' => null,
                ],
                [
                'title' => 'Bio',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'page_type' => 'link_bio',
                'theme_id' => $temaOscuro?->id ?? $defaultTheme?->id ?? null,
                'uses_template' => true,
                'template_id' => null,
                'company_id' => $company->id,
                'theme_settings' => null,
            ],
                [
                    'title' => 'Orden exitosa',
                    'content' => '<p>Tu orden ha sido procesada exitosamente.</p>',
                    'page_type' => 'essential',
                    'theme_id' => $defaultTheme?->id ?? null,
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
                    'company_id' => $company->id,
                    'theme_settings' => null,
                ],
            ];

            foreach ($pages as $pageData) {
                Page::create($pageData);
            }
        });
    }
}
