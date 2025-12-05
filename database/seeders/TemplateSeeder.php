<?php

namespace Database\Seeders;

use App\Models\Template;
use App\Models\Theme;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    public function run()
    {
        $temaAzul = Theme::where('slug', 'tema-azul')->first();

        // Comprobar si el tema existe antes de continuar
        if (!$temaAzul) {
            // Si el tema no existe, lo creamos
            $temaAzul = Theme::create([
                'name' => 'Tema Azul',
                'slug' => 'tema-azul',
                'description' => 'Tema azul por defecto',
                'is_active' => true
            ]);
        }

        $templates = [
            [
                'name' => 'Página de Contacto',
                'slug' => 'contacto-template',
                'description' => 'Plantilla para página de contacto con formulario y mapa',
                'layout_structure' => json_encode([
                    [
                        "id" => 1764866108758,
                        "type" => "banner",
                        "content" => [
                            "containerHeight" => "400px",
                            "containerWidth" => "100%",
                            "marginTop" => "0px",
                            "marginRight" => "0px",
                            "marginBottom" => "0px",
                            "marginLeft" => "0px",
                            "paddingTop" => "20px",
                            "paddingRight" => "20px",
                            "paddingBottom" => "20px",
                            "paddingLeft" => "20px",
                            "backgroundColor" => "#ffffff",
                            "backgroundImage" => "https:\/\/images.unsplash.com\/photo-1506744038136-46273834b3fb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                            "backgroundVideo" => null,
                            "backgroundSize" => "cover",
                            "backgroundPosition" => "center center",
                            "containerVerticalPosition" => "center",
                            "containerHorizontalPosition" => "center",
                            "contentDirection" => "vertical",
                            "children" => [
                                [
                                    "id" => 1764866108759,
                                    "type" => "bannerTitle",
                                    "content" => "Titulo del Banner",
                                    "styles" => [
                                        "layout" => "fit",
                                        "alignment" => "center",
                                        "background" => "transparent",
                                        "backgroundOpacity" => "1",
                                        "borderRadius" => "0px",
                                        "paddingTop" => "10px",
                                        "paddingRight" => "10px",
                                        "paddingBottom" => "10px",
                                        "paddingLeft" => "10px",
                                        "color" => "#000000",
                                        "fontSize" => "32px",
                                        "fontWeight" => "bold"
                                    ]
                                ],
                                [
                                    "id" => 1764866108760,
                                    "type" => "bannerText",
                                    "content" => "Texto descriptivo del banner",
                                    "styles" => [
                                        "layout" => "fit",
                                        "alignment" => "center",
                                        "background" => "transparent",
                                        "backgroundOpacity" => "1",
                                        "borderRadius" => "0px",
                                        "paddingTop" => "10px",
                                        "paddingRight" => "10px",
                                        "paddingBottom" => "10px",
                                        "paddingLeft" => "10px",
                                        "color" => "#000000",
                                        "fontSize" => "16px",
                                        "fontWeight" => "normal"
                                    ]
                                ]
                            ]
                        ],
                        "styles" => []
                    ],
                    [
                        'id' => 'container_1',
                        'type' => 'container',
                        'content' => [ // ARRAY, no objeto con children
                            [
                                'id' => 'form_1',
                                'type' => 'form',
                                'formType' => 'contact'
                            ],
                            [
                                'id' => 'map_1',
                                'type' => 'map',
                                'location' => 'default'
                            ]
                        ]
                    ]
                ]),
                'is_global' => true,
                'theme_id' => $temaAzul->id
            ],
            [
                'name' => 'Página de Productos',
                'slug' => 'productos-template',
                'description' => 'Plantilla para mostrar productos en grid',
                'layout_structure' => json_encode([
                    [
                        'id' => 'productGrid_1',
                        'type' => 'productGrid',
                        'content' => [
                            'columns' => 3,
                            'gap' => '20px',
                            'showFilters' => true,
                            'children' => [] // Agregar children si tu componente lo espera
                        ]
                    ]
                ]),
                'is_global' => true,
                'theme_id' => $temaAzul->id
            ],
            [
                'name' => 'Simple Page',
                'slug' => 'simple-page',
                'description' => 'Plantilla de pagina vacia para personalizar',
                // 'layout_structure' => [["id"=>1764878822740,"type"=>"container","content"=>[],"styles"=>[]]],
                'is_global' => true,
                'theme_id' => $temaAzul->id
            ]
        ];

        foreach ($templates as $template) {
            Template::create($template);
        }
    }
}
