<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GlobalComponent;
use App\Models\Company;
use App\Models\Menu; // Si existe el modelo Menu
use App\Models\Theme;

class GlobalComponentSeeder extends Seeder
{
    public function run()
    {
        // Obtener todas las compañías (asumiendo que existen)
        $companies = Company::all();

        if ($companies->isEmpty()) {
            $this->command->warn('No hay compañías, se saltará la creación de componentes globales.');
            return;
        }

        // Obtener el tema por defecto (tema-azul)
        $theme = Theme::where('slug', 'tema-azul')->first();
        $settings = $theme ? $theme->settings : [];

        foreach ($companies as $company) {
            // Obtener el primer menú de la compañía (si existe)
            $firstMenu = Menu::where('company_id', $company->id)->first();
            $menuId = $firstMenu ? $firstMenu->id : null;

            // Crear o actualizar header global
            GlobalComponent::updateOrCreate(
                [
                    'company_id' => $company->id,
                    'type' => 'header',
                ],
                [
                    'name' => 'Header Global',
                    'content' => $this->buildHeader($settings, $menuId),
                    'is_active' => true,
                ]
            );

            // Crear o actualizar footer global
            GlobalComponent::updateOrCreate(
                [
                    'company_id' => $company->id,
                    'type' => 'footer',
                ],
                [
                    'name' => 'Footer Global',
                    'content' => $this->buildFooter($settings, $menuId),
                    'is_active' => true,
                ]
            );

            $this->command->info("Componentes globales creados para compañía ID: {$company->id}");
        }
    }

    /**
     * Construye la estructura del header (igual que en handleAddComponent)
     */
    private function buildHeader($settings, $menuId)
    {
        $headerId = 2000000; // ID base para evitar colisiones
        $logoId = $headerId + 1;
        $menuComponentId = $headerId + 2;

        return [
            'id' => $headerId,
            'type' => 'header',
            'content' => [
                'logoPosition' => 'left',
                'sticky' => false,
                'fullWidth' => true,
                'height' => '70px',
                'buttons' => [
                    'showSearch' => true,
                    'buttonsGap' => '10px',
                    'cart' => [
                        'count' => '0',
                        'styles' => [
                            'iconColor' => $settings['text'] ?? '#0a0a0a',
                            'backgroundColor' => $settings['muted_color'] ?? '#f5f5f5',
                            'borderWidth' => $settings['border_thickness_none'] ?? '0px',
                            'borderStyle' => $settings['border_style_solid'] ?? 'solid',
                            'borderColor' => $settings['muted_color'] ?? '#f5f5f5',
                            'borderOpacity' => $settings['opacity_100'] ?? '1',
                            'borderRadius' => $settings['border_radius_full'] ?? '50%',
                            'backgroundOpacity' => $settings['opacity_100'] ?? '1',
                            'width' => '36px',
                            'height' => '36px',
                            'padding' => '8px',
                            'fontSize' => '16px'
                        ]
                    ],
                    'profile' => [
                        'styles' => [
                            'iconColor' => $settings['text'] ?? '#0a0a0a',
                            'backgroundColor' => $settings['muted_color'] ?? '#f5f5f5',
                            'borderWidth' => $settings['border_thickness_none'] ?? '0px',
                            'borderStyle' => $settings['border_style_solid'] ?? 'solid',
                            'borderColor' => $settings['muted_color'] ?? '#f5f5f5',
                            'borderOpacity' => $settings['opacity_100'] ?? '1',
                            'borderRadius' => $settings['border_radius_full'] ?? '50%',
                            'backgroundOpacity' => $settings['opacity_100'] ?? '1',
                            'width' => '36px',
                            'height' => '36px',
                            'padding' => '8px',
                            'fontSize' => '16px'
                        ]
                    ],
                    'search' => [
                        'styles' => [
                            'iconColor' => $settings['text'] ?? '#0a0a0a',
                            'backgroundColor' => 'transparent',
                            'borderWidth' => $settings['border_thickness_none'] ?? '0px',
                            'borderStyle' => $settings['border_style_solid'] ?? 'solid',
                            'borderColor' => $settings['muted_color'] ?? '#f5f5f5',
                            'borderOpacity' => $settings['opacity_100'] ?? '1',
                            'borderRadius' => $settings['border_radius_full'] ?? '50%',
                            'backgroundOpacity' => $settings['opacity_100'] ?? '1',
                            'width' => '36px',
                            'height' => '36px',
                            'padding' => '8px',
                            'fontSize' => '16px'
                        ]
                    ],
                ],
                'children' => [
                    [
                        'id' => $logoId,
                        'type' => 'headerLogo',
                        'content' => 'Logo',
                        'styles' => [
                            'layout' => 'fit',
                            'fontSize' => $settings['heading5_fontSize'] ?? '24px',
                            'fontWeight' => 'bold',
                            'color' => $settings['heading'] ?? '#0a0a0a',
                            'backgroundColor' => 'none',
                            'paddingTop' => '0px',
                            'paddingRight' => '0px',
                            'paddingBottom' => '0px',
                            'paddingLeft' => '0px'
                        ]
                    ],
                    [
                        'id' => $menuComponentId,
                        'type' => 'headerMenu',
                        'content' => [
                            'menuId' => $menuId,
                        ],
                        'styles' => [
                            'layout' => 'fit',
                            'display' => 'flex',
                            'gap' => '20px',
                            'fontSize' => $settings['heading6_fontSize'] ?? '16px',
                            'fontWeight' => 'normal',
                            'textTransform' => 'none',
                            'lineHeight' => 'normal',
                            'fontType' => 'default',
                            'color' => $settings['text'] ?? '#0a0a0a',
                            'buttonBackgroundColor' => 'transparent',
                            'backgroundColor' => 'transparent',
                            'borderWidth' => $settings['border_thickness_none'] ?? '0px',
                            'borderColor' => $settings['borders'] ?? '#f5f5f5',
                            'borderRadius' => $settings['border_radius_none'] ?? '0px',
                            'paddingTop' => '5px',
                            'paddingRight' => '10px',
                            'paddingBottom' => '5px',
                            'paddingLeft' => '10px'
                        ]
                    ]
                ]
            ],
            'styles' => [
                'paddingTop' => '20px',
                'paddingRight' => '20px',
                'paddingBottom' => '20px',
                'paddingLeft' => '20px',
                'backgroundColor' => $settings['background'] ?? '#ffffff',
                'borderBottom' => '1px solid ' . ($settings['borders'] ?? '#f5f5f5')
            ]
        ];
    }

    /**
     * Construye la estructura del footer (igual que en handleAddComponent)
     */
    private function buildFooter($settings, $menuId)
    {
        $footerId = 3000000;
        $column1Id = $footerId + 1;
        $column2Id = $footerId + 2;

        return [
            'id' => $footerId,
            'type' => 'footer',
            'content' => [
                'showCopyright' => true,
                'copyrightText' => '© ' . date('Y') . ' Mi Empresa. Todos los derechos reservados.',
                'columns' => 3,
                'layout' => 'grid',
                'showLogo' => false,
                'logoPosition' => 'left',
                'socialMedia' => [
                    'show' => false,
                    'facebook' => '',
                    'twitter' => '',
                    'instagram' => '',
                    'linkedin' => ''
                ],
                'children' => [
                    [
                        'id' => $column1Id,
                        'type' => 'text',
                        'content' => "Dirección: Calle Principal 123\nTeléfono: (123) 456-7890\nEmail: info@empresa.com",
                        'styles' => [
                            'layout' => 'fit',
                            'color' => $settings['text'] ?? '#0a0a0a',
                            'fontSize' => $settings['paragraph_fontSize'] ?? '14px',
                            'lineHeight' => $settings['paragraph_lineHeight'] ?? '1.6'
                        ]
                    ],
                    [
                        'id' => $column2Id,
                        'type' => 'footerMenu',
                        'content' => [
                            'menuId' => $menuId,
                        ],
                        'styles' => [
                            'layout' => 'fit',
                            'display' => 'column',
                            'gap' => '8px',
                            'color' => $settings['text'] ?? '#0a0a0a',
                            'fontSize' => '14px',
                            'textTransform' => 'none'
                        ]
                    ],
                ]
            ],
            'styles' => [
                'backgroundColor' => $settings['background'] ?? '#ffffff',
                'paddingTop' => '40px',
                'paddingRight' => '20px',
                'paddingBottom' => '40px',
                'paddingLeft' => '20px'
            ]
        ];
    }
}