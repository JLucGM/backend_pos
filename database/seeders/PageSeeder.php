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
                'title' => 'Tienda',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                // 'layout' => json_encode([
                //     [[
                //         ["id"=>1764879462706,"type"=>"product","content"=>["columns"=>3,"gapX"=>"10px","gapY"=>"10px","backgroundColor"=>"#ffffff","limit"=>8,"children"=>[["id"=>1764879462707,"type"=>"productTitle","content"=>"Productos Destacados","styles"=>["layout"=>"fit","alignment"=>"center","color"=>"#000000","fontSize"=>"24px","fontWeight"=>"bold"]],["id"=>1764879462708,"type"=>"productCard","content"=>["cardBorder"=>"none","cardBorderThickness"=>"1px","cardBorderOpacity"=>"1","cardBorderRadius"=>"0px","cardPaddingTop"=>"0px","cardPaddingRight"=>"0px","cardPaddingBottom"=>"0px","cardPaddingLeft"=>"0px","children"=>[["id"=>1764879462709,"type"=>"productImage","content"=>"","styles"=>["aspectRatio"=>"square","imageBorder"=>"none","imageBorderThickness"=>"1px","imageBorderOpacity"=>"1","imageBorderRadius"=>"0px"]],["id"=>1764879462710,"type"=>"productName","content"=>"","styles"=>["layout"=>"fit","alignment"=>"left","color"=>"#000000","fontSize"=>"16px","fontWeight"=>"600"]],["id"=>1764879462711,"type"=>"productPrice","content"=>"","styles"=>["layout"=>"fit","alignment"=>"left","color"=>"#666666","fontSize"=>"14px","fontWeight"=>"normal"]]]],"styles"=>[]]]],"styles"=>[]]
                //     ]]
                // ]),
                'is_default' => true,
                'theme_id' => 1,
                'uses_template' => true,
                'template_id' => 3,
                'company_id' => 1, // Asumiendo que tienes un owner con ID 1
            ],
            [
                'title' => 'Politicas de privacidad',
                'content' => '<p>Explora nuestros productos destacados.</p>',
                // 'layout' => json_encode([
                //     [[
                //         "id" => 1764870895545,
                //         "type" => "pageContent",
                //         "content" => null,
                //         "styles" => []
                //     ]]
                // ]),
                'is_default' => true,
                'theme_id' => 1,
                'company_id' => 1, // Asumiendo que tienes un owner con ID 1
            ],
            [
                'title' => 'Terminos de servicio',
                'content' => '<p>Descuentos increíbles en productos seleccionados.</p>',
                // 'layout' => json_encode([
                //     [[
                //         "id" => 1764870895545,
                //         "type" => "pageContent",
                //         "content" => null,
                //         "styles" => []
                //     ]]
                // ]),
                'is_default' => true,
                'theme_id' => 1,
                'company_id' => 1,
            ],
            [
                'title' => 'Politicas de envio',
                'content' => '<p>Descuentos increíbles en productos seleccionados.</p>',
                // 'layout' => json_encode([
                //     [[
                //         "id" => 1764870895545,
                //         "type" => "pageContent",
                //         "content" => null,
                //         "styles" => []
                //     ]]
                // ]),
                'is_default' => true,
                'theme_id' => 1,
                'company_id' => 1,
            ],
            [
                'title' => 'Información de contacto',
                'content' => '<p>Descuentos increíbles en productos seleccionados.</p>',
                // 'layout' => json_encode([
                //     [[
                //         "id" => 1764870895545,
                //         "type" => "pageContent",
                //         "content" => null,
                //         "styles" => []
                //     ]]
                // ]),
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
