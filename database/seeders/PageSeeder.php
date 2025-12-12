<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Page;
use App\Models\Theme;

class PageSeeder extends Seeder
{
    public function run()
    {
        // Obtener algunos temas para asignar a las páginas
        $minimalista = Theme::where('slug', 'minimalista')->first();
        $moderno = Theme::where('slug', 'moderno')->first();

        $pages = [
            [
                'title' => 'Inicio',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'is_default' => true,
                'theme_id' => 1,
                'uses_template' => true,
                'template_id' => 3,
                'company_id' => 1, // Asumiendo que tienes un owner con ID 1
            ],
            [
                'title' => 'Tienda',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'is_default' => true,
                'theme_id' => 1,
                'uses_template' => true,
                'template_id' => 3,
                'company_id' => 1, // Asumiendo que tienes un owner con ID 1
            ],
            [
                'title' => 'Detalles del producto',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'is_default' => true,
                'theme_id' => 1,
                'uses_template' => true,
                'template_id' => 3,
                'company_id' => 1, // Asumiendo que tienes un owner con ID 1
            ],
            [
                'title' => 'Carrito de compras',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'is_default' => true,
                'theme_id' => 1,
                'uses_template' => true,
                'template_id' => 3,
                'company_id' => 1, // Asumiendo que tienes un owner con ID 1
            ],
            [
                'title' => 'Checkout',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'is_default' => true,
                'theme_id' => 1,
                'uses_template' => true,
                'template_id' => 3,
                'company_id' => 1, // Asumiendo que tienes un owner con ID 1
            ],
            [
                'title' => 'Politicas de privacidad',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                
                'is_default' => true,
                'theme_id' => 1,
                'company_id' => 1, // Asumiendo que tienes un owner con ID 1
            ],
            [
                'title' => 'Terminos de servicio',
                'content' => '<p>Descuentos increíbles en productos seleccionados.</p>',
                'is_default' => true,
                'theme_id' => 1,
                'company_id' => 1,
            ],
            [
                'title' => 'Politicas de envio',
                'content' => '<p>Descuentos increíbles en productos seleccionados.</p>',
                'is_default' => true,
                'theme_id' => 1,
                'company_id' => 1,
            ],
            [
                'title' => 'Información de contacto',
                'content' => '<p>Descuentos increíbles en productos seleccionados.</p>',
                'is_default' => true,
                'theme_id' => 1,
                'company_id' => 1,
            ],
        ];

        foreach ($pages as $page) {
            Page::updateOrCreate(
                // ['slug' => $page['slug']],
                $page
            );
        }
    }
}
