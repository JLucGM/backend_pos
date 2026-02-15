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

        // Eliminar todos los menús existentes para la empresa 1 (y sus ítems)
        $menus = Menu::where('company_id', 1)->get();
        foreach ($menus as $menu) {
            MenuItem::where('menu_id', $menu->id)->delete();
            $menu->delete();
            $this->command->info("Menú '{$menu->name}' eliminado (ID: {$menu->id})");
        }

        // Crear el menú Principal
        $menuPrincipal = Menu::create([
            'company_id' => 1,
            'name' => 'Principal',
        ]);
        $this->command->info("Menú 'Principal' creado con ID: {$menuPrincipal->id}");

        // Ítems del menú Principal
        $itemsPrincipal = [
            [
                'title' => 'Inicio',
                'url' => '/inicio',
                'order' => 0,
                'parent_id' => null,
            ],
            [
                'title' => 'Tienda',
                'url' => '/tienda',
                'order' => 1,
                'parent_id' => null,
            ],
        ];

        foreach ($itemsPrincipal as $itemData) {
            $itemData['menu_id'] = $menuPrincipal->id;
            MenuItem::create($itemData);
            $this->command->info("Ítem '{$itemData['title']}' creado en menú Principal");
        }

        // Crear el menú Footer
        $menuFooter = Menu::create([
            'company_id' => 1,
            'name' => 'footer',   // tal como lo solicitaste
        ]);
        $this->command->info("Menú 'footer' creado con ID: {$menuFooter->id}");

        // Ítems del menú Footer (según tu estructura)
        $itemsFooter = [
            [
                'title' => 'Información de contacto',
                'url' => '/informacion-de-contacto',
                'order' => 0,
                'parent_id' => null,
            ],
            [
                'title' => 'Politica de devoluciones y reembolso',
                'url' => '/politica-de-devolucion-y-reembolso',
                'order' => 1,
                'parent_id' => null,
            ],
            [
                'title' => 'Politica de envio',
                'url' => '/politicas-de-envio',
                'order' => 2,
                'parent_id' => null,
            ],
            [
                'title' => 'Politica de privacidad',
                'url' => '/politicas-de-privacidad',
                'order' => 3,
                'parent_id' => null,
            ],
            [
                'title' => 'Terminos de servicio',
                'url' => '/terminos-de-servicio',
                'order' => 4,
                'parent_id' => null,
            ],
        ];

        foreach ($itemsFooter as $itemData) {
            $itemData['menu_id'] = $menuFooter->id;
            MenuItem::create($itemData);
            $this->command->info("Ítem '{$itemData['title']}' creado en menú footer");
        }

        $this->command->info('Seeder ejecutado correctamente. Menús Principal y footer creados.');

        // Mostrar resumen
        $this->command->table(
            ['ID', 'Nombre', 'Empresa ID', 'Cantidad de ítems'],
            [
                [
                    $menuPrincipal->id,
                    $menuPrincipal->name,
                    $menuPrincipal->company_id,
                    MenuItem::where('menu_id', $menuPrincipal->id)->count()
                ],
                [
                    $menuFooter->id,
                    $menuFooter->name,
                    $menuFooter->company_id,
                    MenuItem::where('menu_id', $menuFooter->id)->count()
                ]
            ]
        );
    }
}