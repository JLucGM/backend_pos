<?php

namespace App\Services;

use App\Models\Company;
use App\Models\Role;
use App\Models\Permission;

class DefaultRoleService
{
    /**
     * Crea los roles por defecto para una nueva compañía.
     * Sincronizado con los nombres de RolesSeeder.
     */
    public static function createForCompany(Company $company)
    {
        // 1. Rol admin (Administrador de la empresa)
        $adminRole = Role::create([
            'name' => 'admin',
            'company_id' => $company->id,
            'guard_name' => 'web'
        ]);
        $adminPermissions = Permission::where('name', 'NOT LIKE', 'admin.subscriptions%')
            ->where('name', 'NOT LIKE', 'admin.subscriptionPlan%')
            ->where('name', 'NOT LIKE', 'admin.countries%')
            ->where('name', 'NOT LIKE', 'admin.states%')
            ->where('name', 'NOT LIKE', 'admin.cities%')
            ->get();
        $adminRole->syncPermissions($adminPermissions);

        // 2. Rol customer service (Vendedor / Atención al cliente)
        $staffRole = Role::create([
            'name' => 'customer service',
            'company_id' => $company->id,
            'guard_name' => 'web'
        ]);
        $staffPermissions = Permission::whereIn('name', [
            'admin.orders.index', 'admin.orders.create', 'admin.orders.edit',
            'admin.products.index',
            'admin.client.index', 'admin.client.create'
        ])->get();
        $staffRole->syncPermissions($staffPermissions);

        // 3. Rol client (Para los clientes de la tienda del tenant)
        $clientRole = Role::create([
            'name' => 'client',
            'company_id' => $company->id,
            'guard_name' => 'web'
        ]);
        // Los clientes usualmente no tienen permisos de administración, 
        // pero creamos el rol por si el tenant quiere asignarles accesos específicos.
    }
}
