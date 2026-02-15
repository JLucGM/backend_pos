<?php

namespace App\Services;

use App\Models\Company;
use App\Models\GlobalComponent;
use App\Models\Theme;
use App\Models\Menu;

class DefaultGlobalComponentService
{
    public static function createForCompany(Company $company): void
    {
        // Obtener los menús de la empresa
        $mainMenu = Menu::where('company_id', $company->id)->where('name', 'Principal')->first();
        $footerMenu = Menu::where('company_id', $company->id)->where('name', 'footer')->first();

        $mainMenuId = $mainMenu?->id;
        $footerMenuId = $footerMenu?->id;

        // Header (usa el menú Principal)
        GlobalComponent::updateOrCreate(
            ['company_id' => $company->id, 'type' => 'header'],
            [
                'name' => 'Header Global',
                'content' => self::buildHeader($mainMenuId),
                'is_active' => true,
            ]
        );

        // Footer (usa ambos menús)
        GlobalComponent::updateOrCreate(
            ['company_id' => $company->id, 'type' => 'footer'],
            [
                'name' => 'Footer Global',
                'content' => self::buildFooter($footerMenuId, $mainMenuId),
                'is_active' => true,
            ]
        );
    }

    private static function buildHeader($menuId)
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
                            'borderWidth' => 'theme.border_thickness_none',
                            'borderStyle' => 'theme.border_style_solid',
                            'borderColor' => 'theme.muted_color',
                            'borderOpacity' => 'theme.opacity_100',
                            'borderRadius' => 'theme.border_radius_full',
                            'backgroundOpacity' => 'theme.opacity_100',
                            'width' => '36px',
                            'height' => '36px',
                            'padding' => '8px',
                            'fontSize' => '16px'
                        ]
                    ],
                    'profile' => [
                        'styles' => [
                            'iconColor' => 'theme.text',
                            'backgroundColor' => 'theme.muted_color',
                            'borderWidth' => 'theme.border_thickness_none',
                            'borderStyle' => 'theme.border_style_solid',
                            'borderColor' => 'theme.muted_color',
                            'borderOpacity' => 'theme.opacity_100',
                            'borderRadius' => 'theme.border_radius_full',
                            'backgroundOpacity' => 'theme.opacity_100',
                            'width' => '36px',
                            'height' => '36px',
                            'padding' => '8px',
                            'fontSize' => '16px'
                        ]
                    ],
                    'search' => [
                        'styles' => [
                            'iconColor' => 'theme.text',
                            'backgroundColor' => 'transparent',
                            'borderWidth' => 'theme.border_thickness_none',
                            'borderStyle' => 'theme.border_style_solid',
                            'borderColor' => 'theme.muted_color',
                            'borderOpacity' => 'theme.opacity_100',
                            'borderRadius' => 'theme.border_radius_full',
                            'backgroundOpacity' => 'theme.opacity_100',
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
                        'content' => ['menuId' => $menuId],
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
                            'borderWidth' => 'theme.border_thickness_none',
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

    private static function buildFooter($menuFooterId, $menuPrincipalId)
    {
        $footerId = 3000000;
        $column1Id = $footerId + 1;  // Columna de texto
        $column2Id = $footerId + 2;  // Menú footer
        $column3Id = $footerId + 3;  // Menú Principal

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
                'socialMedia' => ['show' => false, 'facebook' => '', 'twitter' => '', 'instagram' => '', 'linkedin' => ''],
                'children' => [
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
                    [
                        'id' => $column2Id,
                        'type' => 'footerMenu',
                        'content' => ['menuId' => $menuPrincipalId],
                        'styles' => [
                            'layout' => 'fit',
                            'display' => 'column',
                            'gap' => '8px',
                            'color' => 'theme.text',
                            'fontSize' => '14px',
                            'textTransform' => 'none'
                        ]
                    ],
                    [
                        'id' => $column3Id,
                        'type' => 'footerMenu',
                        'content' => ['menuId' => $menuFooterId],
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