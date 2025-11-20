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
                'primary' => '209 100% 92%', // Azul claro (info)
                'background' => '0 0% 100%', // Blanco
                'foreground' => '0 0% 3.9%', // Negro
                'secondary' => '0 0% 96.1%', // Gris claro
                'fontFamily' => 'Arial, sans-serif',
                'borderRadius' => '0.5rem',
            ],
        ]);

        // Tema 2: Tema Oscuro
        Theme::create([
            'name' => 'Tema Oscuro',
            'slug' => 'tema-oscuro',
            'description' => 'Tema con colores oscuros para modo nocturno.',
            'settings' => [
                'primary' => '0 0% 98%', // Blanco
                'background' => '0 0% 3.9%', // Negro
                'foreground' => '0 0% 98%', // Blanco
                'secondary' => '0 0% 14.9%', // Gris oscuro
                'fontFamily' => 'Helvetica, sans-serif',
                'borderRadius' => '0.25rem',
            ],
        ]);

        // Tema 3: Tema Verde
        Theme::create([
            'name' => 'Tema Verde',
            'slug' => 'tema-verde',
            'description' => 'Tema con colores verdes para un look fresco.',
            'settings' => [
                'primary' => '131 98% 84%', // Verde claro (success)
                'background' => '0 0% 100%', // Blanco
                'foreground' => '0 0% 3.9%', // Negro
                'secondary' => '0 0% 96.1%', // Gris claro
                'fontFamily' => 'Georgia, serif',
                'borderRadius' => '0.75rem',
            ],
        ]);
    }
}
