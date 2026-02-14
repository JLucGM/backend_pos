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
                ['title' => 'Inicio', 'template_slug' => 'home-template', 'is_homepage' => true],
                ['title' => 'Tienda', 'template_slug' => 'shop-template'],
                ['title' => 'Detalles del producto', 'template_slug' => 'product-detail-template'],
                ['title' => 'Carrito de compras', 'template_slug' => 'cart-template'],
                ['title' => 'Checkout', 'template_slug' => 'checkout-template'],
                ['title' => 'Iniciar sesión', 'template_slug' => 'login-template'],
                ['title' => 'Registrarse', 'template_slug' => 'register-template'],
                ['title' => 'Perfil de usuario', 'template_slug' => 'profile-template'],
                ['title' => 'Pedidos', 'template_slug' => 'orders-template'],
                ['title' => 'Orden exitosa', 'template_slug' => 'success-template'],
                ['title' => 'Bio', 'template_slug' => 'link-bio-template'],
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
                ]);
            }

            // Páginas de políticas
            $policyPages = [
                'Políticas de privacidad',
                'Términos de servicio',
                'Políticas de envío',
                'Información de contacto',
                'Política de devolución y reembolso',
            ];

            $policyTemplate = $templates['policy-template'] ?? $templates['basic-template'] ?? null;
            foreach ($policyPages as $title) {
                Page::create([
                    'title' => $title,
                    'content' => '<p>Contenido de ' . $title . '</p>',
                    'page_type' => 'policy',
                    'is_editable' => true,
                    'is_published' => true,
                    'theme_id' => $defaultTheme?->id,
                    'uses_template' => true,
                    'template_id' => $policyTemplate?->id,
                    'layout' => $policyTemplate?->layout_structure,
                    'company_id' => $company->id,
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
}