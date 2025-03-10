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
            ['category_name' => 'Sin categoría',],
            ['category_name' => 'Alimentos',],
            ['category_name' => 'Automotriz',],
            ['category_name' => 'Articulos para animales y mascotas',],
            ['category_name' => 'Articulos deportivos',],
            ['category_name' => 'Arte y entretenimiento',],
            ['category_name' => 'Bebé y niño pequeño',],
            ['category_name' => 'Salud y belleza',],
            ['category_name' => 'Cámaras y óptica',],
            ['category_name' => 'Calzado',],
            ['category_name' => 'Equipaje y bolsos',],
            ['category_name' => 'Ropa y accesorios',],
            ['category_name' => 'Electrónica',],
            ['category_name' => 'Hogar',],
            ['category_name' => 'Deportes',],
            ['category_name' => 'Juguetes',],
            ['category_name' => 'Material de oficina',],
            ['category_name' => 'Muebles',],
            ['category_name' => 'Hardware',],
            ['category_name' => 'Software',],
            ['category_name' => 'Libros y papelería',],
            ['category_name' => 'Vehículos y repuestos',],
        ];

        foreach ($categorias as $categoriaData) {
            Category::create($categoriaData);
        }
    }
}