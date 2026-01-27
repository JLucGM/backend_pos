<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Verificar si la empresa con id=1 existe
        if (!DB::table('companies')->where('id', 1)->exists()) {
            $this->command->error('La empresa con ID 1 no existe. Primero crea una empresa.');
            return;
        }

        // Verificar si ya existe un menú para esta empresa
        $existingMenu = Menu::where('company_id', 1)->first();
        
        if ($existingMenu) {
            $this->command->warn('Ya existe un menú para la empresa con ID 1. Eliminando menú existente...');
            
            // Eliminar items del menú primero
            MenuItem::where('menu_id', $existingMenu->id)->delete();
            // Eliminar el menú
            $existingMenu->delete();
        }

        // Crear el menú principal (exactamente como en tu ejemplo)
        $menu = Menu::create([
            'company_id' => 1,
            'name' => 'Principal',
        ]);

        $this->command->info("Menú creado con ID: {$menu->id}");

        // Crear los items del menú (exactamente como en tu ejemplo JSON)
        $menuItems = [
            [
                'menu_id' => $menu->id,
                'parent_id' => null,
                'title' => 'Inicio',
                'url' => '/inicio',
                'order' => 0,
            ],
            [
                'menu_id' => $menu->id,
                'parent_id' => null,
                'title' => 'Tienda',
                'url' => '/tienda',
                'order' => 1,
            ],
        ];

        foreach ($menuItems as $item) {
            MenuItem::create($item);
            $this->command->info("Item creado: {$item['title']}");
        }

        $this->command->info('Menú creado exitosamente para la empresa con ID 1');
        
        // Mostrar resumen
        $this->command->table(
            ['ID', 'Menú', 'Empresa ID', 'Items'],
            [
                [
                    $menu->id,
                    $menu->name,
                    $menu->company_id,
                    MenuItem::where('menu_id', $menu->id)->count()
                ]
            ]
        );
    }
}