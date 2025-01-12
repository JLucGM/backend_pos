<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categorias = [
            [
                'category_name' => 'Sin categoría',
            ],
            [
                'category_name' => 'Ropa',
            ],
            [
                'category_name' => 'Calzado',
            ],
            [
                'category_name' => 'Electrónica',
            ],
            [
                'category_name' => 'Hogar',
            ],
            [
                'category_name' => 'Belleza',
            ],
            [
                'category_name' => 'Alimentos',
            ],
            [
                'category_name' => 'Deportes',
            ],
            [
                'category_name' => 'Automotriz',
            ],
            [
                'category_name' => 'Juguetes',
            ],
            [
                'category_name' => 'Libros y papelería',
            ],
            // Agrega más categorías aquí
        ];

        foreach ($categorias as $categoriaData) {
            Category::create($categoriaData);
        }
    }
}