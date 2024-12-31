<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $rolSuperAdmin = Role::create(['name' => 'super admin', 'slug' => 'super-admin']);
        $rolAdmin = Role::create(['name' => 'admin', 'slug' => 'admin']);

        Permission::create(['name' => 'admin.dashboard.charts', 'description' => 'Ver graficos del dashboard'])->syncRoles([$rolSuperAdmin, $rolAdmin]);

        Permission::create(['name' => 'admin.user.index', 'description' => 'Ver lista de usuarios'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.user.create', 'description' => 'Crear usuarios'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.user.edit', 'description' => 'Editar usuarios'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.user.delete', 'description' => 'Eliminar usuarios'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        
        Permission::create(['name' => 'admin.tax.index', 'description' => 'Ver lista de impuestos'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.tax.create', 'description' => 'Crear impuestos'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.tax.edit', 'description' => 'Editar impuestos'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.tax.delete', 'description' => 'Eliminar impuestos'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        
        Permission::create(['name' => 'admin.category.index', 'description' => 'Ver lista de categorias'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.category.create', 'description' => 'Crear categorias'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.category.edit', 'description' => 'Editar categorias'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.category.delete', 'description' => 'Eliminar categorias'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        
        Permission::create(['name' => 'admin.attribute.index', 'description' => 'Ver lista de atributo'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.attribute.create', 'description' => 'Crear atributo'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.attribute.edit', 'description' => 'Editar atributo'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.attribute.delete', 'description' => 'Eliminar atributo'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        
        Permission::create(['name' => 'admin.paymentmethod.index', 'description' => 'Ver lista de metodos de pago'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.paymentmethod.create', 'description' => 'Crear metodos de pago'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.paymentmethod.edit', 'description' => 'Editar metodos de pago'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.paymentmethod.delete', 'description' => 'Eliminar metodos de pago'])->syncRoles([$rolSuperAdmin, $rolAdmin]);

        // Permission::create(['name' => 'admin.role.index', 'description' => 'Ver lista de roles'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        // Permission::create(['name' => 'admin.role.create', 'description' => 'Crear roles'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        // Permission::create(['name' => 'admin.role.edit', 'description' => 'Editar roles'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        // Permission::create(['name' => 'admin.role.delete', 'description' => 'Eliminar roles'])->syncRoles([$rolSuperAdmin, $rolAdmin]);

    }
}
