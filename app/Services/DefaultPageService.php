<?php

namespace App\Services;

use App\Models\Company;
use App\Models\Page;
use App\Models\Template;
use App\Models\Theme;
use Illuminate\Support\Facades\DB;

class DefaultPageService
{
    public static function createForCompany(Company $company): void
    {
        DB::transaction(function () use ($company) {
            $defaultTheme = Theme::where('slug', 'tema-azul')->first() ?? Theme::first();
            $templates = self::getTemplatesBySlug();

            // Páginas esenciales (con template específico)
            $essentialPages = [
                ['title' => 'Inicio', 'template_slug' => 'home-template', 'is_homepage' => true, 'meta_description' => 'Página principal de nuestra tienda online. Descubre nuestros productos y ofertas especiales.'],
                ['title' => 'Tienda', 'template_slug' => 'shop-template', 'meta_description' => 'Explora nuestro catálogo completo de productos. Encuentra lo que buscas con facilidad.'],
                ['title' => 'Detalles del producto', 'template_slug' => 'product-detail-template', 'meta_description' => 'Información detallada del producto seleccionado. Especificaciones, precios y disponibilidad.'],
                ['title' => 'Carrito de compras', 'template_slug' => 'cart-template', 'meta_description' => 'Revisa los productos en tu carrito antes de proceder al checkout.'],
                ['title' => 'Checkout', 'template_slug' => 'checkout-template', 'meta_description' => 'Completa tu compra de forma segura. Proceso de pago rápido y confiable.'],
                ['title' => 'Iniciar sesión', 'template_slug' => 'login-template', 'meta_description' => 'Accede a tu cuenta para gestionar tus pedidos y información personal.'],
                ['title' => 'Registrarse', 'template_slug' => 'register-template', 'meta_description' => 'Crea una nueva cuenta para disfrutar de todos nuestros servicios.'],
                ['title' => 'Perfil de usuario', 'template_slug' => 'profile-template', 'meta_description' => 'Administra tu perfil, direcciones y preferencias de cuenta.'],
                ['title' => 'Pedidos', 'template_slug' => 'orders-template', 'meta_description' => 'Consulta el historial y estado de todos tus pedidos.'],
                ['title' => 'Orden exitosa', 'template_slug' => 'success-template', 'meta_description' => 'Confirmación de pedido exitoso. Detalles de tu compra y próximos pasos.'],
                ['title' => 'Bio', 'template_slug' => 'link-bio-template', 'meta_description' => 'Enlaces y redes sociales. Conecta con nosotros en todas las plataformas.'],
            ];

            foreach ($essentialPages as $data) {
                $template = $templates[$data['template_slug']] ?? $templates['basic-template'] ?? null;
                Page::create([
                    'title' => $data['title'],
                    'content' => '<p>Contenido de ' . $data['title'] . '</p>',
                    'page_type' => 'essential',
                    'is_homepage' => $data['is_homepage'] ?? false,
                    'is_editable' => true,
                    'is_published' => true,
                    'theme_id' => $defaultTheme?->id,
                    'uses_template' => true,
                    'template_id' => $template?->id,
                    'layout' => $template?->layout_structure,
                    'company_id' => $company->id,
                    'meta_title' => $data['title'],
                    'meta_description' => $data['meta_description'] ?? 'Contenido de ' . $data['title'],
                    'meta_keywords' => self::generateKeywords($data['title']),
                ]);
            }

            // Páginas de políticas
            $policyPages = [
                ['title' => 'Políticas de privacidad', 'description' => 'Información sobre cómo protegemos y utilizamos tus datos personales.'],
                ['title' => 'Términos de servicio', 'description' => 'Condiciones y términos de uso de nuestros servicios.'],
                ['title' => 'Políticas de envío', 'description' => 'Información sobre nuestros métodos y tiempos de envío.'],
                ['title' => 'Información de contacto', 'description' => 'Formas de contactarnos y ubicación de nuestras oficinas.'],
                ['title' => 'Política de devolución y reembolso', 'description' => 'Procedimientos para devoluciones y reembolsos de productos.'],
            ];

            $policyTemplate = $templates['policy-template'] ?? $templates['basic-template'] ?? null;
            foreach ($policyPages as $pageData) {
                Page::create([
                    'title' => $pageData['title'],
                    'content' => '<p>Contenido de ' . $pageData['title'] . '</p>',
                    'page_type' => 'policy',
                    'is_editable' => true,
                    'is_published' => true,
                    'theme_id' => $defaultTheme?->id,
                    'uses_template' => true,
                    'template_id' => $policyTemplate?->id,
                    'layout' => $policyTemplate?->layout_structure,
                    'company_id' => $company->id,
                    'meta_title' => $pageData['title'],
                    'meta_description' => $pageData['description'],
                    'meta_keywords' => self::generateKeywords($pageData['title']),
                ]);
            }
        });
    }

    private static function getTemplatesBySlug(): array
    {
        $slugs = [
            'home-template',
            'shop-template',
            'product-detail-template',
            'cart-template',
            'checkout-template',
            'login-template',
            'register-template',
            'profile-template',
            'orders-template',
            'success-template',
            'link-bio-template',
            'policy-template',
            'basic-template',
        ];
        return Template::whereIn('slug', $slugs)->get()->keyBy('slug')->all();
    }

    private static function generateKeywords(string $title): array
    {
        $stopWords = [
            'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al', 'del', 'los', 'las',
            'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'
        ];

        return array_values(array_filter(
            array_unique(
                array_map('strtolower', 
                    preg_split('/\s+/', preg_replace('/[^\w\s]/', '', $title))
                )
            ),
            fn($word) => strlen($word) > 2 && !in_array($word, $stopWords)
        ));
    }
}