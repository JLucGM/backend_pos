<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Theme;

class ThemeSeeder extends Seeder
{
    public function run()
    {
        $themes = [
            [
                'name' => 'Minimalista',
                'slug' => 'minimalista',
                'description' => 'Tema limpio y sencillo, ideal para tiendas con diseño minimalista.',
                'settings' => json_encode([
                    'primary_color' => '#333333',
                    'secondary_color' => '#777777',
                    'font_family' => 'Arial, sans-serif',
                ]),
            ],
            [
                'name' => 'Moderno',
                'slug' => 'moderno',
                'description' => 'Tema con diseño moderno y colores vibrantes.',
                'settings' => json_encode([
                    'primary_color' => '#0055ff',
                    'secondary_color' => '#00ccff',
                    'font_family' => '"Roboto", sans-serif',
                ]),
            ],
            [
                'name' => 'Clásico',
                'slug' => 'clasico',
                'description' => 'Tema con estilo clásico y elegante.',
                'settings' => json_encode([
                    'primary_color' => '#222222',
                    'secondary_color' => '#aaaaaa',
                    'font_family' => '"Times New Roman", serif',
                ]),
            ],
        ];

        foreach ($themes as $theme) {
            Theme::updateOrCreate(
                ['slug' => $theme['slug']],
                $theme
            );
        }
    }
}
