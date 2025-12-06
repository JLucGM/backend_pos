<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
                'background' => '0 0% 100%', // Blanco
                'heading' => '0 0% 3.9%',    // Negro
                'text' => '0 0% 3.9%',       // Negro
                'links' => '209 100% 50%',   // Azul
                'hover_links' => '209 100% 40%', // Azul más oscuro
                'borders' => '0 0% 96.1%',   // Gris claro
                'shadows' => '0 0% 0% 0.1',  // Sombra suave

                // Primary Button - COMPLETO
                'primary_button_background' => '209 100% 92%', // Azul claro
                'primary_button_text' => '0 0% 3.9%',          // Negro
                'primary_button_border' => '209 100% 92%',     // Azul claro
                'primary_button_border_thickness' => '1px',    // Grosor del borde
                'primary_button_corner_radius' => '0.5rem',    // Radio de esquinas
                'primary_button_text_case' => 'default',       // default, uppercase, lowercase, capitalize
                
                // Primary Button Hover States
                'primary_button_hover_background' => '209 100% 84%', // Azul más oscuro
                'primary_button_hover_text' => '0 0% 3.9%',    // Negro
                'primary_button_hover_border' => '209 100% 84%', // Azul más oscuro
                'primary_button_hover_border_thickness' => '1px', // Grosor en hover
                
                // Primary Button Focus States
                'primary_button_focus_background' => '209 100% 76%',
                'primary_button_focus_text' => '0 0% 3.9%',
                'primary_button_focus_border' => '209 100% 76%',
                'primary_button_focus_border_thickness' => '2px',

                // Secondary Button - COMPLETO
                'secondary_button_background' => '0 0% 96.1%', // Gris claro
                'secondary_button_text' => '0 0% 3.9%',        // Negro
                'secondary_button_border' => '0 0% 96.1%',     // Gris claro
                'secondary_button_border_thickness' => '1px',  // Grosor del borde
                'secondary_button_corner_radius' => '0.5rem',  // Radio de esquinas
                'secondary_button_text_case' => 'default',     // default, uppercase, lowercase, capitalize
                
                // Secondary Button Hover States
                'secondary_button_hover_background' => '0 0% 84.1%', // Gris más oscuro
                'secondary_button_hover_text' => '0 0% 3.9%',  // Negro
                'secondary_button_hover_border' => '0 0% 84.1%', // Gris más oscuro
                'secondary_button_hover_border_thickness' => '1px', // Grosor en hover
                
                // Secondary Button Focus States
                'secondary_button_focus_background' => '0 0% 72.1%',
                'secondary_button_focus_text' => '0 0% 3.9%',
                'secondary_button_focus_border' => '0 0% 72.1%',
                'secondary_button_focus_border_thickness' => '2px',

                // Inputs
                'input_background' => '0 0% 100%',    // Blanco
                'input_text' => '0 0% 3.9%',         // Negro
                'input_border' => '0 0% 96.1%',      // Gris claro
                'input_hover_background' => '0 0% 100%', // Blanco
                'input_focus_background' => '0 0% 100%', // Blanco
                'input_focus_border' => '209 100% 92%', // Azul claro

                // Tipografía - Fonts
                'body_font' => 'Arial, Helvetica, sans-serif',
                'heading_font' => 'Arial, Helvetica, sans-serif',
                'subheading_font' => 'Arial, Helvetica, sans-serif',
                'accent_font' => 'Georgia, Times New Roman, serif',

                // Paragraph
                'paragraph_size' => '1rem',          // 16px
                'paragraph_line_height' => '1.6',    // 160%

                // Heading 1
                'heading1_font' => 'Arial, Helvetica, sans-serif',
                'heading1_size' => '2.5rem',         // 40px
                'heading1_line_height' => '1.2',
                'heading1_case' => 'normal',         // normal, uppercase, lowercase, capitalize

                // Heading 2
                'heading2_font' => 'Arial, Helvetica, sans-serif',
                'heading2_size' => '2rem',           // 32px
                'heading2_line_height' => '1.3',
                'heading2_case' => 'normal',

                // Heading 3
                'heading3_font' => 'Arial, Helvetica, sans-serif',
                'heading3_size' => '1.75rem',        // 28px
                'heading3_line_height' => '1.3',
                'heading3_case' => 'normal',

                // Heading 4
                'heading4_font' => 'Arial, Helvetica, sans-serif',
                'heading4_size' => '1.5rem',         // 24px
                'heading4_line_height' => '1.4',
                'heading4_case' => 'normal',

                // Heading 5
                'heading5_font' => 'Arial, Helvetica, sans-serif',
                'heading5_size' => '1.25rem',        // 20px
                'heading5_line_height' => '1.4',
                'heading5_case' => 'normal',

                // Heading 6
                'heading6_font' => 'Arial, Helvetica, sans-serif',
                'heading6_size' => '1rem',           // 16px
                'heading6_line_height' => '1.5',
                'heading6_case' => 'normal',

                // Bordes globales (para compatibilidad)
                'border_radius' => '0.5rem',
                'button_border_radius' => '0.5rem',
                'input_border_radius' => '0.375rem',

                // Espaciado
                'spacing_small' => '0.5rem',
                'spacing_medium' => '1rem',
                'spacing_large' => '2rem',

                // Para compatibilidad
                'primary_color' => '209 100% 92%', // Azul claro
                'foreground' => '0 0% 3.9%',       // Negro
                'secondary_color' => '0 0% 96.1%', // Gris claro
                'font_family' => 'Arial, sans-serif',
                'heading_font_family' => 'Arial, sans-serif',
                'button_font_family' => 'Arial, sans-serif',
                'input_font_family' => 'Arial, sans-serif',
            ],
        ]);

        // Tema 2: Tema Oscuro
        Theme::create([
            'name' => 'Tema Oscuro',
            'slug' => 'tema-oscuro',
            'description' => 'Tema con colores oscuros para modo nocturno.',
            'settings' => [
                'background' => '0 0% 7%',
                'heading' => '0 0% 98%',
                'text' => '0 0% 90%',
                'links' => '209 100% 70%',
                'hover_links' => '209 100% 85%',
                'borders' => '0 0% 20%',
                'shadows' => '0 0% 0% 0.5',

                // Primary Button - COMPLETO
                'primary_button_background' => '209 100% 30%',
                'primary_button_text' => '0 0% 98%',
                'primary_button_border' => '209 100% 30%',
                'primary_button_border_thickness' => '2px',
                'primary_button_corner_radius' => '0.5rem',
                'primary_button_text_case' => 'uppercase',
                
                'primary_button_hover_background' => '209 100% 40%',
                'primary_button_hover_text' => '0 0% 98%',
                'primary_button_hover_border' => '209 100% 40%',
                'primary_button_hover_border_thickness' => '2px',
                
                'primary_button_focus_background' => '209 100% 50%',
                'primary_button_focus_text' => '0 0% 98%',
                'primary_button_focus_border' => '209 100% 50%',
                'primary_button_focus_border_thickness' => '3px',

                // Secondary Button - COMPLETO
                'secondary_button_background' => '0 0% 20%',
                'secondary_button_text' => '0 0% 98%',
                'secondary_button_border' => '0 0% 30%',
                'secondary_button_border_thickness' => '2px',
                'secondary_button_corner_radius' => '0.5rem',
                'secondary_button_text_case' => 'uppercase',
                
                'secondary_button_hover_background' => '0 0% 30%',
                'secondary_button_hover_text' => '0 0% 98%',
                'secondary_button_hover_border' => '0 0% 40%',
                'secondary_button_hover_border_thickness' => '2px',
                
                'secondary_button_focus_background' => '0 0% 40%',
                'secondary_button_focus_text' => '0 0% 98%',
                'secondary_button_focus_border' => '0 0% 50%',
                'secondary_button_focus_border_thickness' => '3px',

                'input_background' => '0 0% 10%',
                'input_text' => '0 0% 90%',
                'input_border' => '0 0% 25%',
                'input_hover_background' => '0 0% 12%',
                'input_focus_background' => '0 0% 15%',
                'input_focus_border' => '209 100% 50%',

                // Tipografía - Fonts
                'body_font' => 'Segoe UI, Roboto, sans-serif',
                'heading_font' => 'Segoe UI, Roboto, sans-serif',
                'subheading_font' => 'Segoe UI, Roboto, sans-serif',
                'accent_font' => 'Consolas, monospace',

                // Paragraph
                'paragraph_size' => '1rem',
                'paragraph_line_height' => '1.7',

                // Heading 1
                'heading1_font' => 'Segoe UI, Roboto, sans-serif',
                'heading1_size' => '2.75rem',
                'heading1_line_height' => '1.1',
                'heading1_case' => 'uppercase',

                // Heading 2
                'heading2_font' => 'Segoe UI, Roboto, sans-serif',
                'heading2_size' => '2.25rem',
                'heading2_line_height' => '1.2',
                'heading2_case' => 'uppercase',

                // Heading 3
                'heading3_font' => 'Segoe UI, Roboto, sans-serif',
                'heading3_size' => '1.875rem',
                'heading3_line_height' => '1.3',
                'heading3_case' => 'normal',

                // Heading 4
                'heading4_font' => 'Segoe UI, Roboto, sans-serif',
                'heading4_size' => '1.625rem',
                'heading4_line_height' => '1.4',
                'heading4_case' => 'normal',

                // Heading 5
                'heading5_font' => 'Segoe UI, Roboto, sans-serif',
                'heading5_size' => '1.375rem',
                'heading5_line_height' => '1.4',
                'heading5_case' => 'normal',

                // Heading 6
                'heading6_font' => 'Segoe UI, Roboto, sans-serif',
                'heading6_size' => '1.125rem',
                'heading6_line_height' => '1.5',
                'heading6_case' => 'normal',

                'border_radius' => '0.5rem',
                'button_border_radius' => '0.5rem',
                'input_border_radius' => '0.375rem',

                'spacing_small' => '0.5rem',
                'spacing_medium' => '1rem',
                'spacing_large' => '2rem',

                'primary_color' => '209 100% 30%',
                'foreground' => '0 0% 98%',
                'secondary_color' => '0 0% 20%',
                'font_family' => 'Segoe UI, system-ui, sans-serif',
                'heading_font_family' => 'Segoe UI, system-ui, sans-serif',
                'button_font_family' => 'Segoe UI, system-ui, sans-serif',
                'input_font_family' => 'Segoe UI, system-ui, sans-serif',
            ],
        ]);

        // Tema 3: Tema Verde
        Theme::create([
            'name' => 'Tema Verde',
            'slug' => 'tema-verde',
            'description' => 'Tema con colores verdes para un look fresco.',
            'settings' => [
                'background' => '0 0% 100%',
                'heading' => '131 50% 20%',
                'text' => '131 30% 20%',
                'links' => '131 98% 40%',
                'hover_links' => '131 98% 30%',
                'borders' => '131 20% 85%',
                'shadows' => '131 30% 50% 0.1',

                // Primary Button - COMPLETO
                'primary_button_background' => '131 98% 84%',
                'primary_button_text' => '131 50% 20%',
                'primary_button_border' => '131 98% 84%',
                'primary_button_border_thickness' => '0px', // Sin borde
                'primary_button_corner_radius' => '1rem',   // Esquinas muy redondeadas
                'primary_button_text_case' => 'capitalize',
                
                'primary_button_hover_background' => '131 98% 74%',
                'primary_button_hover_text' => '131 50% 20%',
                'primary_button_hover_border' => '131 98% 74%',
                'primary_button_hover_border_thickness' => '0px',
                
                'primary_button_focus_background' => '131 98% 64%',
                'primary_button_focus_text' => '131 50% 20%',
                'primary_button_focus_border' => '131 98% 64%',
                'primary_button_focus_border_thickness' => '2px',

                // Secondary Button - COMPLETO
                'secondary_button_background' => '131 20% 95%',
                'secondary_button_text' => '131 50% 20%',
                'secondary_button_border' => '131 20% 85%',
                'secondary_button_border_thickness' => '2px',
                'secondary_button_corner_radius' => '0.75rem',
                'secondary_button_text_case' => 'default',
                
                'secondary_button_hover_background' => '131 20% 90%',
                'secondary_button_hover_text' => '131 50% 20%',
                'secondary_button_hover_border' => '131 20% 80%',
                'secondary_button_hover_border_thickness' => '2px',
                
                'secondary_button_focus_background' => '131 20% 85%',
                'secondary_button_focus_text' => '131 50% 20%',
                'secondary_button_focus_border' => '131 20% 75%',
                'secondary_button_focus_border_thickness' => '3px',

                'input_background' => '0 0% 100%',
                'input_text' => '131 30% 20%',
                'input_border' => '131 20% 85%',
                'input_hover_background' => '0 0% 98%',
                'input_focus_background' => '0 0% 100%',
                'input_focus_border' => '131 98% 60%',

                // Tipografía - Fonts
                'body_font' => 'Georgia, Times New Roman, serif',
                'heading_font' => 'Georgia, Times New Roman, serif',
                'subheading_font' => 'Georgia, Times New Roman, serif',
                'accent_font' => 'Arial, sans-serif',

                // Paragraph
                'paragraph_size' => '1.125rem',      // 18px
                'paragraph_line_height' => '1.8',

                // Heading 1
                'heading1_font' => 'Georgia, Times New Roman, serif',
                'heading1_size' => '3rem',
                'heading1_line_height' => '1.1',
                'heading1_case' => 'normal',

                // Heading 2
                'heading2_font' => 'Georgia, Times New Roman, serif',
                'heading2_size' => '2.5rem',
                'heading2_line_height' => '1.2',
                'heading2_case' => 'normal',

                // Heading 3
                'heading3_font' => 'Georgia, Times New Roman, serif',
                'heading3_size' => '2rem',
                'heading3_line_height' => '1.3',
                'heading3_case' => 'italic',

                // Heading 4
                'heading4_font' => 'Georgia, Times New Roman, serif',
                'heading4_size' => '1.75rem',
                'heading4_line_height' => '1.3',
                'heading4_case' => 'normal',

                // Heading 5
                'heading5_font' => 'Georgia, Times New Roman, serif',
                'heading5_size' => '1.5rem',
                'heading5_line_height' => '1.4',
                'heading5_case' => 'normal',

                // Heading 6
                'heading6_font' => 'Georgia, Times New Roman, serif',
                'heading6_size' => '1.25rem',
                'heading6_line_height' => '1.4',
                'heading6_case' => 'normal',

                'border_radius' => '0.75rem',
                'button_border_radius' => '0.75rem',
                'input_border_radius' => '0.5rem',

                'spacing_small' => '0.5rem',
                'spacing_medium' => '1rem',
                'spacing_large' => '2rem',

                'primary_color' => '131 98% 84%',
                'foreground' => '131 30% 20%',
                'secondary_color' => '131 20% 95%',
                'font_family' => 'Georgia, serif',
                'heading_font_family' => 'Georgia, serif',
                'button_font_family' => 'Georgia, serif',
                'input_font_family' => 'Georgia, serif',
            ],
        ]);
    }
}