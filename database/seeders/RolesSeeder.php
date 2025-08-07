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
        $rolOwner = Role::create(['name' => 'owner', 'slug' => 'owner']);
        $rolCustomerService = Role::create(['name' => 'customer service', 'slug' => 'customer-service']);
        $rolClient = Role::create(['name' => 'client', 'slug' => 'client']);

        Permission::create(['name' => 'admin.dashboard.charts', 'description' => 'Ver graficos del dashboard'])->syncRoles([$rolSuperAdmin, $rolAdmin]);

        Permission::create(['name' => 'admin.user.index', 'description' => 'Ver lista de usuarios'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner]);
        Permission::create(['name' => 'admin.user.create', 'description' => 'Crear usuarios'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner]);
        Permission::create(['name' => 'admin.user.edit', 'description' => 'Editar usuarios'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner]);
        Permission::create(['name' => 'admin.user.delete', 'description' => 'Eliminar usuarios'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner]);

        Permission::create(['name' => 'admin.tax.index', 'description' => 'Ver lista de impuestos'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner]);
        Permission::create(['name' => 'admin.tax.create', 'description' => 'Crear impuestos'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner]);
        Permission::create(['name' => 'admin.tax.edit', 'description' => 'Editar impuestos'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner]);
        Permission::create(['name' => 'admin.tax.delete', 'description' => 'Eliminar impuestos'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner]);

        Permission::create(['name' => 'admin.category.index', 'description' => 'Ver lista de categorias'])->syncRoles([$rolSuperAdmin]);
        Permission::create(['name' => 'admin.category.create', 'description' => 'Crear categorias'])->syncRoles([$rolSuperAdmin]);
        Permission::create(['name' => 'admin.category.edit', 'description' => 'Editar categorias'])->syncRoles([$rolSuperAdmin]);
        Permission::create(['name' => 'admin.category.delete', 'description' => 'Eliminar categorias'])->syncRoles([$rolSuperAdmin]);
        
        Permission::create(['name' => 'admin.attribute.index', 'description' => 'Ver lista de atributo'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.attribute.create', 'description' => 'Crear atributo'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.attribute.edit', 'description' => 'Editar atributo'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        Permission::create(['name' => 'admin.attribute.delete', 'description' => 'Eliminar atributo'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        
        Permission::create(['name' => 'admin.paymentmethod.index', 'description' => 'Ver lista de metodos de pago'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner]);
        Permission::create(['name' => 'admin.paymentmethod.create', 'description' => 'Crear metodos de pago'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner]);
        Permission::create(['name' => 'admin.paymentmethod.edit', 'description' => 'Editar metodos de pago'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner]);
        Permission::create(['name' => 'admin.paymentmethod.delete', 'description' => 'Eliminar metodos de pago'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner]);

        Permission::create(['name' => 'admin.client.index', 'description' => 'Ver lista de clientes'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner, $rolCustomerService]);
        Permission::create(['name' => 'admin.client.create', 'description' => 'Crear clientes'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner, $rolCustomerService]);
        Permission::create(['name' => 'admin.client.edit', 'description' => 'Editar clientes'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner, $rolCustomerService]);
        Permission::create(['name' => 'admin.client.delete', 'description' => 'Eliminar clientes'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner, $rolCustomerService]);

        Permission::create(['name' => 'admin.countries.index', 'description' => 'Ver lista de paises'])->syncRoles([$rolSuperAdmin]);
        Permission::create(['name' => 'admin.countries.create', 'description' => 'Crear paises'])->syncRoles([$rolSuperAdmin]);
        Permission::create(['name' => 'admin.countries.edit', 'description' => 'Editar paises'])->syncRoles([$rolSuperAdmin]);
        Permission::create(['name' => 'admin.countries.delete', 'description' => 'Eliminar paises'])->syncRoles([$rolSuperAdmin]);

        Permission::create(['name' => 'admin.states.index', 'description' => 'Ver lista de estados'])->syncRoles([$rolSuperAdmin]);
        Permission::create(['name' => 'admin.states.create', 'description' => 'Crear estados'])->syncRoles([$rolSuperAdmin]);
        Permission::create(['name' => 'admin.states.edit', 'description' => 'Editar estados'])->syncRoles([$rolSuperAdmin]);
        Permission::create(['name' => 'admin.states.delete', 'description' => 'Eliminar estados'])->syncRoles([$rolSuperAdmin]);

        Permission::create(['name' => 'admin.cities.index', 'description' => 'Ver lista de estados'])->syncRoles([$rolSuperAdmin]);
        Permission::create(['name' => 'admin.cities.create', 'description' => 'Crear estados'])->syncRoles([$rolSuperAdmin]);
        Permission::create(['name' => 'admin.cities.edit', 'description' => 'Editar estados'])->syncRoles([$rolSuperAdmin]);
        Permission::create(['name' => 'admin.cities.delete', 'description' => 'Eliminar estados'])->syncRoles([$rolSuperAdmin]);
        
        // Permission::create(['name' => 'admin.stores.index', 'description' => 'Ver lista de tiendas'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        // Permission::create(['name' => 'admin.stores.create', 'description' => 'Crear tiendas'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        // Permission::create(['name' => 'admin.stores.edit', 'description' => 'Editar tiendas'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        // Permission::create(['name' => 'admin.stores.delete', 'description' => 'Eliminar tiendas'])->syncRoles([$rolSuperAdmin, $rolAdmin]);

        Permission::create(['name' => 'admin.products.index', 'description' => 'Ver lista de productos'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner]);
        Permission::create(['name' => 'admin.products.create', 'description' => 'Crear productos'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner]);
        Permission::create(['name' => 'admin.products.edit', 'description' => 'Editar productos'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner]);
        Permission::create(['name' => 'admin.products.delete', 'description' => 'Eliminar productos'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner]);

        Permission::create(['name' => 'admin.orders.index', 'description' => 'Ver lista de ordenes'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner, $rolCustomerService]);
        Permission::create(['name' => 'admin.orders.create', 'description' => 'Crear ordenes'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner, $rolCustomerService]);
        Permission::create(['name' => 'admin.orders.edit', 'description' => 'Editar ordenes'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner, $rolCustomerService]);
        // Permission::create(['name' => 'admin.orders.delete', 'description' => 'Eliminar ordenes'])->syncRoles([$rolSuperAdmin, $rolAdmin]);

        Permission::create(['name' => 'admin.stocks.index', 'description' => 'Ver lista de stock'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner]);
        Permission::create(['name' => 'admin.stocks.create', 'description' => 'Crear stock'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner]);
        // Permission::create(['name' => 'admin.products.edit', 'description' => 'Editar productos'])->syncRoles([$rolSuperAdmin, $rolAdmin]);
        // Permission::create(['name' => 'admin.products.delete', 'description' => 'Eliminar productos'])->syncRoles([$rolSuperAdmin, $rolAdmin]);

        Permission::create(['name' => 'admin.role.index', 'description' => 'Ver lista de roles'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner]);
        Permission::create(['name' => 'admin.role.create', 'description' => 'Crear roles'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner]);
        Permission::create(['name' => 'admin.role.edit', 'description' => 'Editar roles'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner]);
        Permission::create(['name' => 'admin.role.delete', 'description' => 'Eliminar roles'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner]);

        Permission::create(['name' => 'admin.discount.index', 'description' => 'Ver lista de descuentos'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner, $rolCustomerService]);
        Permission::create(['name' => 'admin.discount.create', 'description' => 'Crear descuentos'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner, $rolCustomerService]);
        Permission::create(['name' => 'admin.discount.edit', 'description' => 'Editar descuentos'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner, $rolCustomerService]);
        Permission::create(['name' => 'admin.discount.delete', 'description' => 'Eliminar descuentos'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner, $rolCustomerService]);

        Permission::create(['name' => 'admin.giftCards.index', 'description' => 'Ver lista de tarjetas de regalo'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner, $rolCustomerService]);
        Permission::create(['name' => 'admin.giftCards.create', 'description' => 'Crear tarjetas de regalo'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner, $rolCustomerService]);
        Permission::create(['name' => 'admin.giftCards.edit', 'description' => 'Editar tarjetas de regalo'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner, $rolCustomerService]);
        Permission::create(['name' => 'admin.giftCards.delete', 'description' => 'Eliminar tarjetas de regalo'])->syncRoles([$rolSuperAdmin, $rolAdmin, $rolOwner, $rolCustomerService]);

    }
}
