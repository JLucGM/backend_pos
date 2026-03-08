<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use App\Models\Role; // Asegúrate de usar tu modelo personalizado de Role

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Los roles del sistema tienen company_id = NULL
        $rolAdmin = $this->findOrCreateRole('admin');
        $rolOwner = $this->findOrCreateRole('owner');
        $rolCustomerService = $this->findOrCreateRole('customer service');
        $rolClient = $this->findOrCreateRole('client');

        $this->createPermission('admin.dashboard.charts', 'Ver graficos del dashboard', [$rolAdmin]);

        $this->createPermission('admin.user.index', 'Ver lista de usuarios', [$rolAdmin, $rolOwner]);
        $this->createPermission('admin.user.create', 'Crear usuarios', [$rolAdmin, $rolOwner]);
        $this->createPermission('admin.user.edit', 'Editar usuarios', [$rolAdmin, $rolOwner]);
        $this->createPermission('admin.user.delete', 'Eliminar usuarios', [$rolAdmin, $rolOwner]);

        $this->createPermission('admin.tax.index', 'Ver lista de impuestos', [$rolAdmin, $rolOwner]);
        $this->createPermission('admin.tax.create', 'Crear impuestos', [$rolAdmin, $rolOwner]);
        $this->createPermission('admin.tax.edit', 'Editar impuestos', [$rolAdmin, $rolOwner]);
        $this->createPermission('admin.tax.delete', 'Eliminar impuestos', [$rolAdmin, $rolOwner]);

        // ✅ Permisos exclusivos de Super Admin (Sin roles asignados)
        $this->createPermission('admin.category.index', 'Ver lista de categorias');
        $this->createPermission('admin.category.create', 'Crear categorias');
        $this->createPermission('admin.category.edit', 'Editar categorias');
        $this->createPermission('admin.category.delete', 'Eliminar categorias');
        
        $this->createPermission('admin.attribute.index', 'Ver lista de atributo');
        $this->createPermission('admin.attribute.create', 'Crear atributo');
        $this->createPermission('admin.attribute.edit', 'Editar atributo');
        $this->createPermission('admin.attribute.delete', 'Eliminar atributo');

        $this->createPermission('admin.countries.index', 'Ver lista de paises');
        $this->createPermission('admin.countries.create', 'Crear paises');
        $this->createPermission('admin.countries.edit', 'Editar paises');
        $this->createPermission('admin.countries.delete', 'Eliminar paises');

        $this->createPermission('admin.states.index', 'Ver lista de estados');
        $this->createPermission('admin.states.create', 'Crear estados');
        $this->createPermission('admin.states.edit', 'Editar estados');
        $this->createPermission('admin.states.delete', 'Eliminar estados');

        $this->createPermission('admin.cities.index', 'Ver lista de ciudades');
        $this->createPermission('admin.cities.create', 'Crear ciudades');
        $this->createPermission('admin.cities.edit', 'Editar ciudades');
        $this->createPermission('admin.cities.delete', 'Eliminar ciudades');

        $this->createPermission('admin.subscriptionPlan.index', 'Ver lista de planes de suscripción');
        $this->createPermission('admin.subscriptionPlan.create', 'Crear planes de suscripción');
        $this->createPermission('admin.subscriptionPlan.edit', 'Editar planes de suscripción');
        $this->createPermission('admin.subscriptionPlan.delete', 'Eliminar planes de suscripción');
        
        // Permisos de Tenant
        $this->createPermission('admin.paymentmethod.index', 'Ver lista de metodos de pago', [$rolAdmin, $rolOwner]);
        $this->createPermission('admin.paymentmethod.create', 'Crear metodos de pago', [$rolAdmin, $rolOwner]);
        $this->createPermission('admin.paymentmethod.edit', 'Editar metodos de pago', [$rolAdmin, $rolOwner]);
        $this->createPermission('admin.paymentmethod.delete', 'Eliminar metodos de pago', [$rolAdmin, $rolOwner]);

        $this->createPermission('admin.client.index', 'Ver lista de clientes', [$rolAdmin, $rolOwner, $rolCustomerService]);
        $this->createPermission('admin.client.create', 'Crear clientes', [$rolAdmin, $rolOwner, $rolCustomerService]);
        $this->createPermission('admin.client.edit', 'Editar clientes', [$rolAdmin, $rolOwner, $rolCustomerService]);
        $this->createPermission('admin.client.delete', 'Eliminar clientes', [$rolAdmin, $rolOwner, $rolCustomerService]);
        
        $this->createPermission('admin.stores.index', 'Ver lista de tiendas', [$rolAdmin,  $rolOwner]);
        $this->createPermission('admin.stores.create', 'Crear tiendas', [$rolAdmin,  $rolOwner]);
        $this->createPermission('admin.stores.edit', 'Editar tiendas', [$rolAdmin,  $rolOwner]);
        $this->createPermission('admin.stores.delete', 'Eliminar tiendas', [$rolAdmin,  $rolOwner]);

        $this->createPermission('admin.products.index', 'Ver lista de productos', [$rolAdmin, $rolOwner]);
        $this->createPermission('admin.products.create', 'Crear productos', [$rolAdmin, $rolOwner]);
        $this->createPermission('admin.products.edit', 'Editar productos', [$rolAdmin, $rolOwner]);
        $this->createPermission('admin.products.delete', 'Eliminar productos', [$rolAdmin, $rolOwner]);

        $this->createPermission('admin.orders.index', 'Ver lista de ordenes', [$rolAdmin, $rolOwner, $rolCustomerService]);
        $this->createPermission('admin.orders.create', 'Crear ordenes', [$rolAdmin, $rolOwner, $rolCustomerService]);
        $this->createPermission('admin.orders.edit', 'Editar ordenes', [$rolAdmin, $rolOwner, $rolCustomerService]);
        $this->createPermission('admin.orders.delete', 'Eliminar ordenes', [$rolAdmin, $rolOwner]);

        $this->createPermission('admin.stocks.index', 'Ver lista de stock', [$rolAdmin, $rolOwner]);
        $this->createPermission('admin.stocks.create', 'Crear stock', [$rolAdmin, $rolOwner]);
        $this->createPermission('admin.stocks.delete', 'Eliminar stock', [$rolAdmin, $rolOwner]);

        $this->createPermission('admin.roles.index', 'Ver lista de roles', [$rolAdmin, $rolOwner]);
        $this->createPermission('admin.roles.create', 'Crear roles', [$rolAdmin, $rolOwner]);
        $this->createPermission('admin.roles.edit', 'Editar roles', [$rolAdmin, $rolOwner]);
        $this->createPermission('admin.roles.delete', 'Eliminar roles', [$rolAdmin, $rolOwner]);

        $this->createPermission('admin.discount.index', 'Ver lista de descuentos', [$rolAdmin, $rolOwner, $rolCustomerService]);
        $this->createPermission('admin.discount.create', 'Crear descuentos', [$rolAdmin, $rolOwner, $rolCustomerService]);
        $this->createPermission('admin.discount.edit', 'Editar descuentos', [$rolAdmin, $rolOwner, $rolCustomerService]);
        $this->createPermission('admin.discount.delete', 'Eliminar descuentos', [$rolAdmin, $rolOwner, $rolCustomerService]);

        $this->createPermission('admin.giftCards.index', 'Ver lista de tarjetas de regalo', [$rolAdmin, $rolOwner, $rolCustomerService]);
        $this->createPermission('admin.giftCards.create', 'Crear tarjetas de regalo', [$rolAdmin, $rolOwner, $rolCustomerService]);
        $this->createPermission('admin.giftCards.edit', 'Editar tarjetas de regalo', [$rolAdmin, $rolOwner, $rolCustomerService]);
        $this->createPermission('admin.giftCards.delete', 'Eliminar tarjetas de regalo', [$rolAdmin, $rolOwner, $rolCustomerService]);
        
        $this->createPermission('admin.shippingRate.index', 'Ver lista de tarifa de envio', [$rolAdmin,  $rolOwner]);
        $this->createPermission('admin.shippingRate.create', 'Crear tarifa de envio', [$rolAdmin,  $rolOwner]);
        $this->createPermission('admin.shippingRate.edit', 'Editar tarifa de envio', [$rolAdmin,  $rolOwner]);
        $this->createPermission('admin.shippingRate.delete', 'Eliminar tarifa de envio', [$rolAdmin,  $rolOwner]);
        
        $this->createPermission('admin.pages.index', 'Ver lista de paginas', [$rolAdmin,  $rolOwner]);
        $this->createPermission('admin.pages.create', 'Crear paginas', [$rolAdmin,  $rolOwner]);
        $this->createPermission('admin.pages.edit', 'Editar paginas', [$rolAdmin,  $rolOwner]);
        $this->createPermission('admin.pages.delete', 'Eliminar paginas', [$rolAdmin,  $rolOwner]);
        
        $this->createPermission('admin.menus.index', 'Ver lista de menus', [$rolAdmin,  $rolOwner]);
        $this->createPermission('admin.menus.create', 'Crear menus', [$rolAdmin,  $rolOwner]);
        $this->createPermission('admin.menus.edit', 'Editar menus', [$rolAdmin,  $rolOwner]);
        $this->createPermission('admin.menus.delete', 'Eliminar menus', [$rolAdmin,  $rolOwner]);

        $this->createPermission('admin.collections.index', 'Ver lista de colecciones', [$rolAdmin,  $rolOwner]);
        $this->createPermission('admin.collections.create', 'Crear colecciones', [$rolAdmin,  $rolOwner]);
        $this->createPermission('admin.collections.edit', 'Editar colecciones', [$rolAdmin,  $rolOwner]);
        $this->createPermission('admin.collections.delete', 'Eliminar colecciones', [$rolAdmin,  $rolOwner]);

        $this->createPermission('admin.inventory-transfers.index', 'Ver lista de transferencias', [$rolAdmin, $rolOwner]);
        $this->createPermission('admin.inventory-transfers.create', 'Crear transferencias', [$rolAdmin, $rolOwner]);
        $this->createPermission('admin.inventory-transfers.edit', 'Editar transferencias', [$rolAdmin, $rolOwner]);
        $this->createPermission('admin.inventory-transfers.delete', 'Eliminar transferencias', [$rolAdmin, $rolOwner]);

        $this->createPermission('admin.reports.index', 'Ver reportes', [$rolAdmin, $rolOwner]);

        $this->createPermission('admin.media.index', 'Ver libreria media', [$rolAdmin, $rolOwner]);
        $this->createPermission('admin.media.create', 'Crear libreria media', [$rolAdmin, $rolOwner]);
        $this->createPermission('admin.media.store', 'Guardar libreria media', [$rolAdmin, $rolOwner]);
        $this->createPermission('admin.media.delete', 'Eliminar libreria media', [$rolAdmin, $rolOwner]);

        $this->createPermission('admin.setting.index', 'Ver configuración', [$rolAdmin, $rolOwner]);
        $this->createPermission('admin.setting.edit', 'Editar configuración', [$rolAdmin, $rolOwner]);

        $this->createPermission('admin.subscriptions.index', 'Ver mis suscripciones', [$rolAdmin, $rolOwner]);
        $this->createPermission('admin.subscriptions.create', 'Contratar suscripciones', [$rolAdmin, $rolOwner]);
        $this->createPermission('admin.subscriptions.delete', 'Cancelar suscripciones', [$rolAdmin, $rolOwner]);
    }

    private function findOrCreateRole(string $name)
    {
        $role = Role::where('name', $name)->where('guard_name', 'web')->whereNull('company_id')->first();
        if (!$role) {
            $role = Role::create(['name' => $name, 'guard_name' => 'web', 'company_id' => null]);
        }
        if (empty($role->slug)) { $role->slug = null; $role->save(); }
        return $role;
    }

    private function createPermission(string $name, string $description, array $roles = [])
    {
        $permission = Permission::where('name', $name)->where('guard_name', 'web')->first();
        if (!$permission) {
            $permission = Permission::create(['name' => $name, 'guard_name' => 'web', 'description' => $description]);
        } else {
            $permission->description = $description;
            $permission->save();
        }
        // ✅ syncRoles ahora limpiará los roles si el array está vacío
        $roleNames = collect($roles)->map(fn($role) => $role->name)->toArray();
        $permission->syncRoles($roleNames);
        return $permission;
    }
}
