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

        // Permission::create(['name' => 'admin.role.index', 'description' => 'Ver lista de roles'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        // Permission::create(['name' => 'admin.role.create', 'description' => 'Crear roles'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        // Permission::create(['name' => 'admin.role.edit', 'description' => 'Editar roles'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        // Permission::create(['name' => 'admin.role.delete', 'description' => 'Eliminar roles'])->syncRoles([$rolSuperAdmin, $rolAdmin]);

    }
}
