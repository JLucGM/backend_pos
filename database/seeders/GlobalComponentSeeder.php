<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GlobalComponent;
use App\Models\Company;
use App\Models\Menu;
use App\Models\Theme;

class GlobalComponentSeeder extends Seeder
{
    public function run()
    {
        $companies = Company::all();

        if ($companies->isEmpty()) {
            $this->command->warn('No hay compañías, se saltará la creación de componentes globales.');
            return;
        }

        $theme = Theme::where('slug', 'tema-azul')->first();
        $settings = $theme ? $theme->settings : [];

        foreach ($companies as $company) {
            // Obtener el menú para el header (Principal)
            $headerMenu = Menu::where('company_id', $company->id)
                ->where('name', 'Principal')
                ->first();
            $headerMenuId = $headerMenu ? $headerMenu->id : null;

            if (!$headerMenu) {
                $this->command->warn("Compañía ID {$company->id}: No se encontró el menú 'Principal' para el header.");
            }

            // Obtener los dos menús para el footer
            $footerMenu = Menu::where('company_id', $company->id)
                ->where('name', 'footer')
                ->first();
            $footerMenuId = $footerMenu ? $footerMenu->id : null;

            $principalMenu = Menu::where('company_id', $company->id)
                ->where('name', 'Principal')
                ->first();
            $principalMenuId = $principalMenu ? $principalMenu->id : null;

            if (!$footerMenu) {
                $this->command->warn("Compañía ID {$company->id}: No se encontró el menú 'footer' para el footer.");
            }
            if (!$principalMenu) {
                $this->command->warn("Compañía ID {$company->id}: No se encontró el menú 'Principal' para el footer (se usará null).");
            }

            // Crear o actualizar componente de header
            GlobalComponent::updateOrCreate(
                [
                    'company_id' => $company->id,
                    'type' => 'header',
                ],
                [
                    'name' => 'Header Global',
                    'content' => $this->buildHeader($settings, $headerMenuId),
                    'is_active' => true,
                ]
            );

            // Crear o actualizar componente de footer (con dos menús)
            GlobalComponent::updateOrCreate(
                [
                    'company_id' => $company->id,
                    'type' => 'footer',
                ],
                [
                    'name' => 'Footer Global',
                    'content' => $this->buildFooter($footerMenuId, $principalMenuId),
                    'is_active' => true,
                ]
            );

            $this->command->info("Componentes globales creados/actualizados para compañía ID: {$company->id}");
        }
    }

    /**
     * Construye la estructura del header.
     */
    private function buildHeader($settings, $menuId)
    {
        $headerId = 2000000;
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
                            'iconColor' => 'theme.text',
                            'backgroundColor' => 'theme.muted_color',
                            'borderWidth' => $settings['border_thickness_none'] ?? '0px',
                            'borderStyle' => $settings['border_style_solid'] ?? 'solid',
                            'borderColor' => 'theme.muted_color',
                            'borderOpacity' => $settings['opacity_100'] ?? '1',
                            'borderRadius' => 'theme.border_radius_full',
                            'backgroundOpacity' => $settings['opacity_100'] ?? '1',
                            'width' => '36px',
                            'height' => '36px',
                            'padding' => '8px',
                            'fontSize' => '16px'
                        ]
                    ],
                    // profile y search se pueden agregar similarmente
                ],
                'children' => [
                    [
                        'id' => $logoId,
                        'type' => 'headerLogo',
                        'content' => 'Logo',
                        'styles' => [
                            'layout' => 'fit',
                            'fontSize' => 'theme.heading5_fontSize',
                            'fontWeight' => 'bold',
                            'color' => 'theme.heading',
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
                            'fontSize' => 'theme.heading6_fontSize',
                            'fontWeight' => 'normal',
                            'textTransform' => 'none',
                            'lineHeight' => 'normal',
                            'fontType' => 'default',
                            'color' => 'theme.text',
                            'buttonBackgroundColor' => 'transparent',
                            'backgroundColor' => 'transparent',
                            'borderWidth' => $settings['border_thickness_none'] ?? '0px',
                            'borderColor' => 'theme.borders',
                            'borderRadius' => 'theme.border_radius_none',
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
                'backgroundColor' => 'theme.background',
                'borderBottom' => '1px solid theme.borders'
            ]
        ];
    }

    /**
     * Construye la estructura del footer con dos menús.
     */
    private function buildFooter($menuFooterId, $menuPrincipalId)
    {
        $footerId = 3000000;
        $column1Id = $footerId + 1; // Columna de texto
        $column2Id = $footerId + 2; // Menú footer
        $column3Id = $footerId + 3; // Menú Principal

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
                    // Columna 1: información de contacto
                    [
                        'id' => $column1Id,
                        'type' => 'text',
                        'content' => "Dirección: Calle Principal 123\nTeléfono: (123) 456-7890\nEmail: info@empresa.com",
                        'styles' => [
                            'layout' => 'fit',
                            'color' => 'theme.text',
                            'fontSize' => 'theme.paragraph_fontSize',
                            'lineHeight' => 'theme.paragraph_lineHeight'
                        ]
                    ],
                    // Columna 2: menú Principal (Inicio, Tienda)
                    [
                        'id' => $column3Id,
                        'type' => 'footerMenu',
                        'content' => [
                            'menuId' => $menuPrincipalId,
                        ],
                        'styles' => [
                            'layout' => 'fit',
                            'display' => 'column',
                            'gap' => '8px',
                            'color' => 'theme.text',
                            'fontSize' => '14px',
                            'textTransform' => 'none'
                        ]
                    ],
                    // Columna 3: menú footer (información de contacto, políticas)
                    [
                        'id' => $column2Id,
                        'type' => 'footerMenu',
                        'content' => [
                            'menuId' => $menuFooterId,
                        ],
                        'styles' => [
                            'layout' => 'fit',
                            'display' => 'column',
                            'gap' => '8px',
                            'color' => 'theme.text',
                            'fontSize' => '14px',
                            'textTransform' => 'none'
                        ]
                    ],
                ]
            ],
            'styles' => [
                'backgroundColor' => 'theme.background',
                'paddingTop' => '40px',
                'paddingRight' => '20px',
                'paddingBottom' => '40px',
                'paddingLeft' => '20px'
            ]
        ];
    }
}