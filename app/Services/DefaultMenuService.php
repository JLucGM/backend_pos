<?php

namespace App\Services;

use App\Models\Company;
use App\Models\Menu;
use App\Models\MenuItem;
use Illuminate\Support\Facades\DB;

class DefaultMenuService
{
    /**
     * Crea un menú por defecto para una empresa
     */
    public static function createForCompany(Company $company): Menu
    {
        return DB::transaction(function () use ($company) {
            // Crear el menú principal (exactamente como en tu ejemplo)
            $menu = Menu::create([
                'company_id' => $company->id,
                'name' => 'Principal',
            ]);

            // Crear los items del menú (exactamente como en tu ejemplo JSON)
            $menuItems = [
                [
                    'title' => 'Inicio',
                    'url' => '/inicio',
                    'order' => 0,
                ],
                [
                    'title' => 'Tienda',
                    'url' => '/tienda',
                    'order' => 1,
                ],
            ];

            foreach ($menuItems as $itemData) {
                MenuItem::create([
                    'menu_id' => $menu->id,
                    'parent_id' => null,
                    'title' => $itemData['title'],
                    'url' => $itemData['url'],
                    'order' => $itemData['order'],
                ]);
            }

            return $menu;
        });
    }
}