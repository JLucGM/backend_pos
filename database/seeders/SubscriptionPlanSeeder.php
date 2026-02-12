<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SubscriptionPlan;

class SubscriptionPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Prueba Gratuita',
                'slug' => 'trial',
                'description' => 'Prueba gratuita por 14 días con funcionalidades limitadas',
                'price' => 0.00,
                'yearly_price' => 0.00,
                'currency' => 'USD',
                'is_active' => true,
                'is_trial' => true,
                'is_featured' => false,
                'is_public' => true,
                'trial_days' => 1,
                'features' => [
                    'Gestión básica de productos',
                    'Panel de administración',
                    'Soporte por email',
                ],
                'limits' => [
                    'staff_users' => 1,
                    'stores' => 1,
                    'pages' => 0,
                    'can_customize_pages' => true,
                    'can_manage_menus' => true,
                ],
                'sort_order' => 1,
            ],
            [
                'name' => 'Emprendedor',
                'slug' => 'emprendedor',
                'description' => 'Plan económico para emprendedores que están comenzando',
                'price' => 9.99,
                'yearly_price' => 99.99,
                'currency' => 'USD',
                'is_active' => true,
                'is_trial' => false,
                'is_featured' => false,
                'is_public' => true,
                'trial_days' => 0,
                'features' => [
                    'Hasta 3 páginas personalizadas',
                    '1 usuario staff',
                    '1 tienda',
                    'Soporte por email',
                    'Reportes básicos',
                ],
                'limits' => [
                    'staff_users' => 1,
                    'stores' => 1,
                    'pages' => 3,
                    'can_customize_pages' => false,
                    'can_manage_menus' => false,
                ],
                'sort_order' => 2,
            ],
            [
                'name' => 'Básico',
                'slug' => 'basic',
                'description' => 'Plan básico para pequeños negocios',
                'price' => 29.99,
                'yearly_price' => 299.99, // 2 meses gratis
                'currency' => 'USD',
                'is_active' => true,
                'is_trial' => false,
                'is_featured' => false,
                'is_public' => true,
                'trial_days' => 0,
                'features' => [
                    'Hasta 100 órdenes por mes',
                    'Gestión completa de productos',
                    'Panel de administración',
                    'Soporte por email',
                    'Reportes básicos',
                ],
                'limits' => [
                    'staff_users' => 3,
                    'stores' => 1,
                    'pages' => 5,
                    'can_customize_pages' => true,
                    'can_manage_menus' => true,
                ],
                'sort_order' => 3,
            ],
            [
                'name' => 'Profesional',
                'slug' => 'professional',
                'description' => 'Plan profesional para negocios en crecimiento',
                'price' => 59.99,
                'yearly_price' => 599.99, // 2 meses gratis
                'currency' => 'USD',
                'is_active' => true,
                'is_trial' => false,
                'is_featured' => true, // Plan destacado
                'is_public' => true,
                'trial_days' => 0,
                'features' => [
                    'Hasta 500 órdenes por mes',
                    'Gestión completa de productos',
                    'Panel de administración avanzado',
                    'Soporte prioritario',
                    'Reportes avanzados',
                    'Integraciones con terceros',
                    'Múltiples usuarios',
                    'Personalización completa de páginas',
                    'Gestión de menús',
                ],
                'limits' => [
                    'staff_users' => 10,
                    'stores' => 3,
                    'pages' => 15,
                    'can_customize_pages' => true,
                    'can_manage_menus' => true,
                ],
                'sort_order' => 4,
            ],
            [
                'name' => 'Empresarial',
                'slug' => 'enterprise',
                'description' => 'Plan empresarial para grandes organizaciones',
                'price' => 99.99,
                'yearly_price' => 999.99, // 2 meses gratis
                'currency' => 'USD',
                'is_active' => true,
                'is_trial' => false,
                'is_featured' => false,
                'is_public' => true,
                'trial_days' => 0,
                'features' => [
                    'Órdenes ilimitadas',
                    'Productos ilimitados',
                    'Panel de administración completo',
                    'Soporte 24/7',
                    'Reportes personalizados',
                    'Integraciones avanzadas',
                    'Usuarios ilimitados',
                    'API completa',
                    'Personalización avanzada',
                    'Acceso completo al Builder',
                    'Gestión avanzada de menús',
                ],
                'limits' => [
                    'staff_users' => -1,
                    'stores' => -1,
                    'pages' => -1,
                    'can_customize_pages' => true,
                    'can_manage_menus' => true,
                ],
                'sort_order' => 5,
            ],
        ];

        foreach ($plans as $plan) {
            SubscriptionPlan::create($plan);
        }
    }
}