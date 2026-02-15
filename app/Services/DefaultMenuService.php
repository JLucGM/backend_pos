<?php

namespace App\Services;

use App\Models\Company;
use App\Models\Menu;
use App\Models\MenuItem;
use Illuminate\Support\Facades\DB;

class DefaultMenuService
{
    /**
     * Crea los menús por defecto para una empresa: Principal y footer
     */
    public static function createForCompany(Company $company): Menu
    {
        return DB::transaction(function () use ($company) {
            // Crear el menú Principal
            $mainMenu = Menu::create([
                'company_id' => $company->id,
                'name' => 'Principal',
            ]);

            $mainMenuItems = [
                ['title' => 'Inicio', 'url' => '/inicio', 'order' => 0],
                ['title' => 'Tienda', 'url' => '/tienda', 'order' => 1],
            ];

            foreach ($mainMenuItems as $itemData) {
                MenuItem::create([
                    'menu_id' => $mainMenu->id,
                    'parent_id' => null,
                    'title' => $itemData['title'],
                    'url' => $itemData['url'],
                    'order' => $itemData['order'],
                ]);
            }

            // Crear el menú footer
            $footerMenu = Menu::create([
                'company_id' => $company->id,
                'name' => 'footer',
            ]);

            $footerMenuItems = [
                ['title' => 'Información de contacto', 'url' => '/informacion-de-contacto', 'order' => 0],
                ['title' => 'Politica de devoluciones y reembolso', 'url' => '/politica-de-devolucion-y-reembolso', 'order' => 1],
                ['title' => 'Politica de envio','url' => '/politicas-de-envio','order' => 2,],
                ['title' => 'Politica de privacidad','url' => '/politicas-de-privacidad','order' => 3,],
                ['title' => 'Terminos de servicio','url' => '/terminos-de-servicio','order' => 4,],
            ];

            foreach ($footerMenuItems as $itemData) {
                MenuItem::create([
                    'menu_id' => $footerMenu->id,
                    'parent_id' => null,
                    'title' => $itemData['title'],
                    'url' => $itemData['url'],
                    'order' => $itemData['order'],
                ]);
            }

            return $mainMenu; // para compatibilidad
        });
    }
}
