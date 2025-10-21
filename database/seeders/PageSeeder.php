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
                'title' => 'Politicas de privacidad',
                // 'slug' => 'pagina-principal',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                'is_default' => true,
                'theme_id' => $minimalista ? $minimalista->id : null,
                'company_id' => 1, // Asumiendo que tienes un owner con ID 1
            ],
            [
                'title' => 'Terminos de servicio',
                // 'slug' => 'ofertas-especiales',
                'content' => '<p>Descuentos increíbles en productos seleccionados.</p>',
                'is_default' => true,
                'theme_id' => $moderno ? $moderno->id : null,
                'company_id' => 1,
            ],
            [
                'title' => 'Politicas de envio',
                // 'slug' => 'ofertas-especiales',
                'content' => '<p>Descuentos increíbles en productos seleccionados.</p>',
                'is_default' => true,
                'theme_id' => $moderno ? $moderno->id : null,
                'company_id' => 1,
            ],
            [
                'title' => 'Información de contacto',
                // 'slug' => 'ofertas-especiales',
                'content' => '<p>Descuentos increíbles en productos seleccionados.</p>',
                'is_default' => true,
                'theme_id' => $moderno ? $moderno->id : null,
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
