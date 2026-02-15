<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Theme;

class ThemeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Tema 1: Tema Azul (inspirado en tu app.css)
        Theme::create([
            'name' => 'Tema Azul',
            'slug' => 'tema-azul',
            'description' => 'Tema con colores azules y neutros.',
            'settings' => [
                // Colores generales de la página
                'background' => '#ffffff', // 0 0% 100%
                'heading' => '#0a0a0a',    // 0 0% 3.9%
                'text' => '#0a0a0a',       // 0 0% 3.9%
                'links' => '#0080ff',   // 209 100% 50%
                'hover_links' => '#0066cc', // 209 100% 40%
                'borders' => '#f5f5f5',   // 0 0% 96.1%
                'shadows' => '#0000001a',  // 0 0% 0% 0.1

                // Colores adicionales
                'accent_color' => '#0066cc',
                'muted_color' => '#6b7280',
                'success_color' => '#10b981',
                'warning_color' => '#f59e0b',
                'danger_color' => '#ef4444',
                'info_color' => '#3b82f6',

                // Sistema de espaciado completo
                'spacing_unit' => '0.5rem',
                'spacing_none' => '0',
                'spacing_xxsmall' => '0.125rem',
                'spacing_xsmall' => '0.25rem',
                'spacing_small' => '0.5rem',
                'spacing_medium' => '1rem',
                'spacing_large' => '1.5rem',
                'spacing_xlarge' => '2rem',
                'spacing_2xlarge' => '2.5rem',
                'spacing_3xlarge' => '3rem',
                'spacing_4xlarge' => '4rem',

                // Border radius
                'border_radius_small' => '0.25rem',
                'border_radius_medium' => '0.5rem',
                'border_radius_large' => '1rem',
                'border_radius_xlarge' => '2rem',
                'border_radius_full' => '9999px',
                'border_radius_circle' => '50%',
                'border_radius_pill' => '9999px',

                // Border thickness
                'border_thickness_none' => '0px',
                'border_thickness_hairline' => '1px',
                'border_thickness_thin' => '2px',
                'border_thickness_medium' => '3px',
                'border_thickness_thick' => '4px',
                'border_thickness_xthick' => '6px',

                // Border style
                'border_style_solid' => 'solid',
                'border_style_dashed' => 'dashed',
                'border_style_dotted' => 'dotted',
                'border_style_double' => 'double',
                'border_style_groove' => 'groove',
                'border_style_ridge' => 'ridge',
                'border_style_inset' => 'inset',
                'border_style_outset' => 'outset',
                'border_style_none' => 'none',
                'border_style_hidden' => 'hidden',

                // Shadows
                'shadow_sm' => '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                'shadow_md' => '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                'shadow_lg' => '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                'shadow_xl' => '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                'shadow_2xl' => '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

                // Opacidad
                'opacity_0' => '0',
                'opacity_25' => '0.25',
                'opacity_50' => '0.5',
                'opacity_75' => '0.75',
                'opacity_100' => '1',

                // Default border styles (para componentes)
                'default_border_style' => 'solid',
                'default_border_thickness' => '1px',
                'default_border_radius' => '0.5rem',

                // Primary Button - COMPLETO
                'primary_button_background' => '#d6eaff', // 209 100% 92%
                'primary_button_text' => '#0a0a0a',          // 0 0% 3.9%
                'primary_button_border' => '#d6eaff',     // 209 100% 92%
                'primary_button_border_thickness' => '1px',    // Grosor del borde
                'primary_button_corner_radius' => '0.5rem',    // Radio de esquinas
                'primary_button_text_case' => 'default',       // default, uppercase, lowercase, capitalize

                // Primary Button Hover States
                'primary_button_hover_background' => '#addeff', // 209 100% 84%
                'primary_button_hover_text' => '#0a0a0a',    // 0 0% 3.9%
                'primary_button_hover_border' => '#addeff', // 209 100% 84%
                'primary_button_hover_border_thickness' => '1px', // Grosor en hover

                // Primary Button Focus States
                'primary_button_focus_background' => '#85c2ff', // 209 100% 76%
                'primary_button_focus_text' => '#0a0a0a',
                'primary_button_focus_border' => '#85c2ff',
                'primary_button_focus_border_thickness' => '2px',

                // Secondary Button - COMPLETO
                'secondary_button_background' => '#f5f5f5', // 0 0% 96.1%
                'secondary_button_text' => '#0a0a0a',        // 0 0% 3.9%
                'secondary_button_border' => '#f5f5f5',     // 0 0% 96.1%
                'secondary_button_border_thickness' => '1px',  // Grosor del borde
                'secondary_button_corner_radius' => '0.5rem',  // Radio de esquinas
                'secondary_button_text_case' => 'default',     // default, uppercase, lowercase, capitalize

                // Secondary Button Hover States
                'secondary_button_hover_background' => '#d6d6d6', // 0 0% 84.1%
                'secondary_button_hover_text' => '#0a0a0a',  // 0 0% 3.9%
                'secondary_button_hover_border' => '#d6d6d6', // 0 0% 84.1%
                'secondary_button_hover_border_thickness' => '1px', // Grosor en hover

                // Secondary Button Focus States
                'secondary_button_focus_background' => '#b8b8b8', // 0 0% 72.1%
                'secondary_button_focus_text' => '#0a0a0a',
                'secondary_button_focus_border' => '#b8b8b8',
                'secondary_button_focus_border_thickness' => '2px',

                // Inputs
                'input_background' => '#ffffff',    // 0 0% 100%
                'input_text' => '#0a0a0a',         // 0 0% 3.9%
                'input_border' => '#f5f5f5',      // 0 0% 96.1%
                'input_border_thickness' => '1px',   // Grosor del borde
                'input_corner_radius' => '0.375rem', // Radio de esquinas
                'input_hover_background' => '#ffffff', // 0 0% 100%
                'input_focus_background' => '#ffffff', // 0 0% 100%
                'input_focus_border' => '#d6eaff', // 209 100% 92%

                // Tipografía - Fonts
                'body_font' => "'Arial', 'Helvetica', sans-serif",
                'heading_font' => "'Arial', 'Helvetica', sans-serif",
                'subheading_font' => "'Arial', 'Helvetica', sans-serif",
                'accent_font' => "'Georgia', 'Times New Roman', serif",

                // Párrafo
                'paragraph_font' => 'body_font',
                'paragraph_fontSize' => '16px',          // 16px
                'paragraph_fontWeight' => 'normal',
                'paragraph_lineHeight' => '1.6',    // 160%
                'paragraph_textTransform' => 'none',

                // Heading 1
                'heading1_font' => 'heading_font',
                'heading1_fontSize' => '2.5rem',         // 40px
                'heading1_fontWeight' => 'bold',
                'heading1_lineHeight' => '1.2',
                'heading1_textTransform' => 'none',         // normal, uppercase, lowercase, capitalize

                // Heading 2
                'heading2_font' => 'heading_font',
                'heading2_fontSize' => '2rem',           // 32px
                'heading2_fontWeight' => 'bold',
                'heading2_lineHeight' => '1.3',
                'heading2_textTransform' => 'none',

                // Heading 3
                'heading3_font' => 'heading_font',
                'heading3_fontSize' => '1.75rem',        // 28px
                'heading3_fontWeight' => 'bold',
                'heading3_lineHeight' => '1.3',
                'heading3_textTransform' => 'none',

                // Heading 4
                'heading4_font' => 'heading_font',
                'heading4_fontSize' => '1.5rem',         // 24px
                'heading4_fontWeight' => 'bold',
                'heading4_lineHeight' => '1.4',
                'heading4_textTransform' => 'none',

                // Heading 5
                'heading5_font' => 'heading_font',
                'heading5_fontSize' => '1.25rem',        // 20px
                'heading5_fontWeight' => 'bold',
                'heading5_lineHeight' => '1.4',
                'heading5_textTransform' => 'none',

                // Heading 6
                'heading6_font' => 'heading_font',
                'heading6_fontSize' => '1rem',           // 16px
                'heading6_fontWeight' => 'bold',
                'heading6_lineHeight' => '1.5',
                'heading6_textTransform' => 'none',

                // Para compatibilidad
                'primary_color' => '#d6eaff', // 209 100% 92%
                'foreground' => '#0a0a0a',       // 0 0% 3.9%
                'secondary_color' => '#f5f5f5', // 0 0% 96.1%
                'font_family' => "'Arial', sans-serif",
                'heading_font_family' => "'Arial', sans-serif",
                'button_font_family' => "'Arial', sans-serif",
                'input_font_family' => "'Arial', sans-serif",

                // Carousel Component
                'carousel_gapX' => '10px',
                'carousel_gapY' => '10px',

                // Banner Component
                'banner_containerHeight' => '400px',
                'banner_paddingTop' => '20px',
                'banner_paddingRight' => '20px',
                'banner_paddingBottom' => '20px',
                'banner_paddingLeft' => '20px',


                'banner_innerContainerBackgroundOpacity' => '1',
                'banner_innerContainerPaddingTop' => '20px',
                'banner_innerContainerPaddingRight' => '20px',
                'banner_innerContainerPaddingBottom' => '20px',
                'banner_innerContainerPaddingLeft' => '20px',
                'banner_innerContainerBorderRadius' => '0px',

                // Bento Component
                'bento_backgroundColor' => '#ffffffff',
                'bento_containerBorderRadius' => '0px',
                'bento_gridGap' => '20px',

                // Container Component
                'container_borderRadius' => '0px',
                'container_gap' => '0px',

                // Marquee Component
                'marquee_paddingTop' => '10px',
                'marquee_paddingBottom' => '10px',
                'marquee_fontSize' => '16px',
                'marquee_fontWeight' => 'normal',


                'marquee_borderRadius' => '0px',

                // Divider Component
                'divider_paddingTop' => '20px',
                'divider_paddingBottom' => '20px',
                'divider_lineWidth' => '1px',
                'divider_lineLength' => '100%',

                'divider_opacity' => '1',
            ],
        ]);

        // Tema 2: Tema Oscuro
        Theme::create([
            'name' => 'Tema Oscuro',
            'slug' => 'tema-oscuro',
            'description' => 'Tema con colores oscuros para modo nocturno.',
            'settings' => [
                'background' => '#121212', // 0 0% 7%
                'heading' => '#fafafa', // 0 0% 98%
                'text' => '#e6e6e6', // 0 0% 90%
                'links' => '#66b3ff', // 209 100% 70%
                'hover_links' => '#b3d9ff', // 209 100% 85%
                'borders' => '#333333', // 0 0% 20%
                'shadows' => '#00000080', // 0 0% 0% 0.5

                // Colores adicionales
                'accent_color' => '#66b3ff',
                'muted_color' => '#9ca3af',
                'success_color' => '#34d399',
                'warning_color' => '#fbbf24',
                'danger_color' => '#f87171',
                'info_color' => '#60a5fa',

                // Sistema de espaciado completo
                'spacing_unit' => '0.5rem',
                'spacing_none' => '0',
                'spacing_xxsmall' => '0.125rem',
                'spacing_xsmall' => '0.25rem',
                'spacing_small' => '0.5rem',
                'spacing_medium' => '1rem',
                'spacing_large' => '1.5rem',
                'spacing_xlarge' => '2rem',
                'spacing_2xlarge' => '2.5rem',
                'spacing_3xlarge' => '3rem',
                'spacing_4xlarge' => '4rem',

                // Border radius
                'border_radius_small' => '0.25rem',
                'border_radius_medium' => '0.5rem',
                'border_radius_large' => '1rem',
                'border_radius_xlarge' => '2rem',
                'border_radius_full' => '9999px',
                'border_radius_circle' => '50%',
                'border_radius_pill' => '9999px',

                // Border thickness
                'border_thickness_none' => '0px',
                'border_thickness_hairline' => '1px',
                'border_thickness_thin' => '2px',
                'border_thickness_medium' => '3px',
                'border_thickness_thick' => '4px',
                'border_thickness_xthick' => '6px',

                // Border style
                'border_style_solid' => 'solid',
                'border_style_dashed' => 'dashed',
                'border_style_dotted' => 'dotted',
                'border_style_double' => 'double',
                'border_style_groove' => 'groove',
                'border_style_ridge' => 'ridge',
                'border_style_inset' => 'inset',
                'border_style_outset' => 'outset',
                'border_style_none' => 'none',
                'border_style_hidden' => 'hidden',

                // Shadows
                'shadow_sm' => '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
                'shadow_md' => '0 4px 6px -1px rgba(0, 0, 0, 0.6)',
                'shadow_lg' => '0 10px 15px -3px rgba(0, 0, 0, 0.7)',
                'shadow_xl' => '0 20px 25px -5px rgba(0, 0, 0, 0.8)',
                'shadow_2xl' => '0 25px 50px -12px rgba(0, 0, 0, 0.9)',

                // Opacidad
                'opacity_0' => '0',
                'opacity_25' => '0.25',
                'opacity_50' => '0.5',
                'opacity_75' => '0.75',
                'opacity_100' => '1',

                // Default border styles (para componentes)
                'default_border_style' => 'solid',
                'default_border_thickness' => '2px', // Más grueso en tema oscuro
                'default_border_radius' => '0.375rem', // Menos redondeado

                // Primary Button - COMPLETO
                'primary_button_background' => '#004d99', // 209 100% 30%
                'primary_button_text' => '#fafafa', // 0 0% 98%
                'primary_button_border' => '#004d99', // 209 100% 30%
                'primary_button_border_thickness' => '2px',
                'primary_button_corner_radius' => '0.5rem',
                'primary_button_text_case' => 'uppercase',

                'primary_button_hover_background' => '#0066cc', // 209 100% 40%
                'primary_button_hover_text' => '#fafafa', // 0 0% 98%
                'primary_button_hover_border' => '#0066cc', // 209 100% 40%
                'primary_button_hover_border_thickness' => '2px',

                'primary_button_focus_background' => '#0080ff', // 209 100% 50%
                'primary_button_focus_text' => '#fafafa', // 0 0% 98%
                'primary_button_focus_border' => '#0080ff', // 209 100% 50%
                'primary_button_focus_border_thickness' => '3px',

                // Secondary Button - COMPLETO
                'secondary_button_background' => '#333333', // 0 0% 20%
                'secondary_button_text' => '#fafafa', // 0 0% 98%
                'secondary_button_border' => '#4d4d4d', // 0 0% 30%
                'secondary_button_border_thickness' => '2px',
                'secondary_button_corner_radius' => '0.5rem',
                'secondary_button_text_case' => 'uppercase',

                'secondary_button_hover_background' => '#4d4d4d', // 0 0% 30%
                'secondary_button_hover_text' => '#fafafa', // 0 0% 98%
                'secondary_button_hover_border' => '#666666', // 0 0% 40%
                'secondary_button_hover_border_thickness' => '2px',

                'secondary_button_focus_background' => '#666666', // 0 0% 40%
                'secondary_button_focus_text' => '#fafafa', // 0 0% 98%
                'secondary_button_focus_border' => '#808080', // 0 0% 50%
                'secondary_button_focus_border_thickness' => '3px',

                'input_background' => '#1a1a1a', // 0 0% 10%
                'input_text' => '#e6e6e6', // 0 0% 90%
                'input_border' => '#404040', // 0 0% 25%
                'input_border_thickness' => '1px',
                'input_corner_radius' => '0.375rem',
                'input_hover_background' => '#1f1f1f', // 0 0% 12%
                'input_focus_background' => '#262626', // 0 0% 15%
                'input_focus_border' => '#0080ff', // 209 100% 50%

                // Tipografía - Fonts
                'body_font' => "'Segoe UI', 'Roboto', sans-serif",
                'heading_font' => "'Segoe UI', 'Roboto', sans-serif",
                'subheading_font' => "'Segoe UI', 'Roboto', sans-serif",
                'accent_font' => "'Consolas', monospace",

                // Párrafo
                'paragraph_font' => 'body_font',
                'paragraph_fontSize' => '16px',
                'paragraph_fontWeight' => 'normal',
                'paragraph_lineHeight' => '1.7',
                'paragraph_textTransform' => 'none',

                // Heading 1
                'heading1_font' => 'heading_font',
                'heading1_fontSize' => '2.75rem',
                'heading1_fontWeight' => 'bold',
                'heading1_lineHeight' => '1.1',
                'heading1_textTransform' => 'uppercase',

                // Heading 2
                'heading2_font' => 'heading_font',
                'heading2_fontSize' => '2.25rem',
                'heading2_fontWeight' => 'bold',
                'heading2_lineHeight' => '1.2',
                'heading2_textTransform' => 'uppercase',

                // Heading 3
                'heading3_font' => 'heading_font',
                'heading3_fontSize' => '1.875rem',
                'heading3_fontWeight' => 'bold',
                'heading3_lineHeight' => '1.3',
                'heading3_textTransform' => 'none',

                // Heading 4
                'heading4_font' => 'heading_font',
                'heading4_fontSize' => '1.625rem',
                'heading4_fontWeight' => 'bold',
                'heading4_lineHeight' => '1.4',
                'heading4_textTransform' => 'none',

                // Heading 5
                'heading5_font' => 'heading_font',
                'heading5_fontSize' => '1.375rem',
                'heading5_fontWeight' => 'bold',
                'heading5_lineHeight' => '1.4',
                'heading5_textTransform' => 'none',

                // Heading 6
                'heading6_font' => 'heading_font',
                'heading6_fontSize' => '1.125rem',
                'heading6_fontWeight' => 'bold',
                'heading6_lineHeight' => '1.5',
                'heading6_textTransform' => 'none',

                'primary_color' => '#004d99',
                'foreground' => '#fafafa',
                'secondary_color' => '#333333',
                'font_family' => "'Segoe UI', system-ui, sans-serif",
                'heading_font_family' => "'Segoe UI', system-ui, sans-serif",
                'button_font_family' => "'Segoe UI', system-ui, sans-serif",
                'input_font_family' => "'Segoe UI', system-ui, sans-serif",

                // Carousel Component
                'carousel_backgroundColor' => '#1a1a1a',
                'carousel_gapX' => '10px',
                'carousel_gapY' => '10px',

                // Banner Component
                'banner_containerHeight' => '400px',
                'banner_paddingTop' => '20px',
                'banner_paddingRight' => '20px',
                'banner_paddingBottom' => '20px',
                'banner_paddingLeft' => '20px',
                'banner_backgroundColor' => 'transparent',
                'banner_innerContainerBackgroundColor' => 'transparent',
                'banner_innerContainerBackgroundOpacity' => '1',
                'banner_innerContainerPaddingTop' => '20px',
                'banner_innerContainerPaddingRight' => '20px',
                'banner_innerContainerPaddingBottom' => '20px',
                'banner_innerContainerPaddingLeft' => '20px',
                'banner_innerContainerBorderRadius' => '0px',

                // Bento Component
                'bento_backgroundColor' => '#121212',
                'bento_containerBorderRadius' => '0px',
                'bento_gridGap' => '20px',

                // Container Component
                'container_backgroundColor' => 'transparent',
                'container_borderRadius' => '0px',
                'container_gap' => '0px',

                // Marquee Component
                'marquee_paddingTop' => '10px',
                'marquee_paddingBottom' => '10px',
                'marquee_fontSize' => '16px',
                'marquee_fontWeight' => 'normal',
                'marquee_color' => '#e6e6e6',
                'marquee_backgroundColor' => 'transparent',
                'marquee_borderRadius' => '0px',

                // Divider Component
                'divider_paddingTop' => '20px',
                'divider_paddingBottom' => '20px',
                'divider_lineWidth' => '1px',
                'divider_lineLength' => '100%',
                'divider_lineColor' => '#333333',
                'divider_opacity' => '1',
            ],
        ]);

        // Tema 3: Tema Verde
        Theme::create([
            'name' => 'Tema Verde',
            'slug' => 'tema-verde',
            'description' => 'Tema con colores verdes para un look fresco.',
            'settings' => [
                'background' => '#ffffff',
                'heading' => '#1a4d26', // 131 50% 20%
                'text' => '#24422e',    // 131 30% 20%
                'links' => '#02ca45',   // 131 98% 40%
                'hover_links' => '#029834', // 131 98% 30%
                'borders' => '#cfebd5',   // 131 20% 85%
                'shadows' => '#40bf6a1a', // 131 30% 50% 0.1

                // Colores adicionales
                'accent_color' => '#10b981',
                'muted_color' => '#84a98c',
                'success_color' => '#02ca45',
                'warning_color' => '#eab308',
                'danger_color' => '#ef4444',
                'info_color' => '#0ea5e9',

                // Sistema de espaciado completo
                'spacing_unit' => '0.5rem',
                'spacing_none' => '0',
                'spacing_xxsmall' => '0.125rem',
                'spacing_xsmall' => '0.25rem',
                'spacing_small' => '0.5rem',
                'spacing_medium' => '1rem',
                'spacing_large' => '1.5rem',
                'spacing_xlarge' => '2rem',
                'spacing_2xlarge' => '2.5rem',
                'spacing_3xlarge' => '3rem',
                'spacing_4xlarge' => '4rem',

                // Border radius
                'border_radius_small' => '0.5rem', // Más redondeado desde el inicio
                'border_radius_medium' => '1rem',   // Más orgánico
                'border_radius_large' => '1.5rem',
                'border_radius_xlarge' => '2rem',
                'border_radius_full' => '9999px',
                'border_radius_circle' => '50%',
                'border_radius_pill' => '9999px',

                // Border thickness
                'border_thickness_none' => '0px',
                'border_thickness_hairline' => '1px',
                'border_thickness_thin' => '2px',
                'border_thickness_medium' => '3px',
                'border_thickness_thick' => '4px',
                'border_thickness_xthick' => '6px',

                // Border style
                'border_style_solid' => 'solid',
                'border_style_dashed' => 'dashed',
                'border_style_dotted' => 'dotted',
                'border_style_double' => 'double',
                'border_style_groove' => 'groove',
                'border_style_ridge' => 'ridge',
                'border_style_inset' => 'inset',
                'border_style_outset' => 'outset',
                'border_style_none' => 'none',
                'border_style_hidden' => 'hidden',

                // Shadows
                'shadow_sm' => '0 1px 2px 0 rgba(64, 191, 106, 0.1)',
                'shadow_md' => '0 4px 6px -1px rgba(64, 191, 106, 0.15)',
                'shadow_lg' => '0 10px 15px -3px rgba(64, 191, 106, 0.2)',
                'shadow_xl' => '0 20px 25px -5px rgba(64, 191, 106, 0.25)',
                'shadow_2xl' => '0 25px 50px -12px rgba(64, 191, 106, 0.3)',

                // Opacidad
                'opacity_0' => '0',
                'opacity_25' => '0.25',
                'opacity_50' => '0.5',
                'opacity_75' => '0.75',
                'opacity_100' => '1',

                // Default border styles (para componentes)
                'default_border_style' => 'solid',
                'default_border_thickness' => '2px', // Un poco más grueso
                'default_border_radius' => '1rem',   // Más redondeado (estilo orgánico)

                // Primary Button - COMPLETO
                'primary_button_background' => '#aefaca', // 131 98% 84%
                'primary_button_text' => '#1a4d26',       // 131 50% 20%
                'primary_button_border' => '#aefaca',     // 131 98% 84%
                'primary_button_border_thickness' => '0px', // Sin borde
                'primary_button_corner_radius' => '1rem',   // Esquinas muy redondeadas
                'primary_button_text_case' => 'capitalize',

                'primary_button_hover_background' => '#7cf7a8', // 131 98% 74%
                'primary_button_hover_text' => '#1a4d26',       // 131 50% 20%
                'primary_button_hover_border' => '#7cf7a8',     // 131 98% 74%
                'primary_button_hover_border_thickness' => '0px',

                'primary_button_focus_background' => '#4af486', // 131 98% 64%
                'primary_button_focus_text' => '#1a4d26',
                'primary_button_focus_border' => '#4af486',
                'primary_button_focus_border_thickness' => '2px',

                // Secondary Button - COMPLETO
                'secondary_button_background' => '#f0f7f2', // 131 20% 95%
                'secondary_button_text' => '#1a4d26',       // 131 50% 20%
                'secondary_button_border' => '#cfebd5',     // 131 20% 85%
                'secondary_button_border_thickness' => '2px',
                'secondary_button_corner_radius' => '0.75rem',
                'secondary_button_text_case' => 'default',

                'secondary_button_hover_background' => '#e0f0e4', // 131 20% 90%
                'secondary_button_hover_text' => '#1a4d26',       // 131 50% 20%
                'secondary_button_hover_border' => '#bfdec8',     // 131 20% 80%
                'secondary_button_hover_border_thickness' => '2px',

                'secondary_button_focus_background' => '#cfebd5', // 131 20% 85%
                'secondary_button_focus_text' => '#1a4d26',
                'secondary_button_focus_border' => '#add6bc',     // 131 20% 75%
                'secondary_button_focus_border_thickness' => '3px',

                'input_background' => '#ffffff',
                'input_text' => '#24422e',
                'input_border' => '#cfebd5',
                'input_border_thickness' => '1px',
                'input_corner_radius' => '0.5rem',
                'input_hover_background' => '#fafdff', // 0 0% 98%
                'input_focus_background' => '#ffffff',
                'input_focus_border' => '#36ed73', // 131 98% 60%

                // Tipografía - Fonts
                'body_font' => "'Georgia', 'Times New Roman', serif",
                'heading_font' => "'Georgia', 'Times New Roman', serif",
                'subheading_font' => "'Georgia', 'Times New Roman', serif",
                'accent_font' => "'Arial', sans-serif",

                // Párrafo
                'paragraph_font' => 'body_font',
                'paragraph_fontSize' => '18px',      // 18px
                'paragraph_fontWeight' => 'normal',
                'paragraph_lineHeight' => '1.8',
                'paragraph_textTransform' => 'none',

                // Heading 1
                'heading1_font' => 'heading_font',
                'heading1_fontSize' => '3rem',
                'heading1_fontWeight' => 'bold',
                'heading1_lineHeight' => '1.1',
                'heading1_textTransform' => 'none',

                // Heading 2
                'heading2_font' => 'heading_font',
                'heading2_fontSize' => '2.5rem',
                'heading2_fontWeight' => 'bold',
                'heading2_lineHeight' => '1.2',
                'heading2_textTransform' => 'none',

                // Heading 3
                'heading3_font' => 'heading_font',
                'heading3_fontSize' => '2rem',
                'heading3_fontWeight' => 'bold',
                'heading3_lineHeight' => '1.3',
                'heading3_textTransform' => 'none',

                // Heading 4
                'heading4_font' => 'heading_font',
                'heading4_fontSize' => '1.75rem',
                'heading4_fontWeight' => 'bold',
                'heading4_lineHeight' => '1.3',
                'heading4_textTransform' => 'none',

                // Heading 5
                'heading5_font' => 'heading_font',
                'heading5_fontSize' => '1.5rem',
                'heading5_fontWeight' => 'bold',
                'heading5_lineHeight' => '1.4',
                'heading5_textTransform' => 'none',

                // Heading 6
                'heading6_font' => 'heading_font',
                'heading6_fontSize' => '1.25rem',
                'heading6_fontWeight' => 'bold',
                'heading6_lineHeight' => '1.4',
                'heading6_textTransform' => 'none',

                'primary_color' => '#aefaca',
                'foreground' => '#24422e',
                'secondary_color' => '#f0f7f2',
                'font_family' => "'Georgia', serif",
                'heading_font_family' => "'Georgia', serif",
                'button_font_family' => "'Georgia', serif",
                'input_font_family' => "'Georgia', serif",

                // Carousel Component
                'carousel_backgroundColor' => '#ffffff',
                'carousel_gapX' => '10px',
                'carousel_gapY' => '10px',

                // Banner Component
                'banner_containerHeight' => '400px',
                'banner_paddingTop' => '20px',
                'banner_paddingRight' => '20px',
                'banner_paddingBottom' => '20px',
                'banner_paddingLeft' => '20px',
                'banner_backgroundColor' => 'transparent',
                'banner_innerContainerBackgroundColor' => 'transparent',
                'banner_innerContainerBackgroundOpacity' => '1',
                'banner_innerContainerPaddingTop' => '20px',
                'banner_innerContainerPaddingRight' => '20px',
                'banner_innerContainerPaddingBottom' => '20px',
                'banner_innerContainerPaddingLeft' => '20px',
                'banner_innerContainerBorderRadius' => '0px',

                // Bento Component
                'bento_backgroundColor' => '#ffffff',
                'bento_containerBorderRadius' => '0px',
                'bento_gridGap' => '20px',

                // Container Component
                'container_backgroundColor' => 'transparent',
                'container_borderRadius' => '0px',
                'container_gap' => '0px',

                // Marquee Component
                'marquee_paddingTop' => '10px',
                'marquee_paddingBottom' => '10px',
                'marquee_fontSize' => '18px',
                'marquee_fontWeight' => 'normal',
                'marquee_color' => '#1e5a2e',
                'marquee_backgroundColor' => 'transparent',
                'marquee_borderRadius' => '0px',

                // Divider Component
                'divider_paddingTop' => '20px',
                'divider_paddingBottom' => '20px',
                'divider_lineWidth' => '1px',
                'divider_lineLength' => '100%',
                'divider_lineColor' => '#84cc96',
                'divider_opacity' => '1',
            ],
        ]);
    }
}
