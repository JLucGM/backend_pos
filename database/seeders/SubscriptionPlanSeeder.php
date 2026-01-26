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
                'trial_days' => 14,
                'features' => [
                    'Gestión básica de productos',
                    'Panel de administración',
                    'Soporte por email',
                ],
                'limits' => [
                    'orders' => 0, // No puede crear órdenes
                    'products' => 10,
                    'users' => 1,
                    'storage' => 100, // MB
                ],
                'sort_order' => 1,
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
                'trial_days' => 0,
                'features' => [
                    'Hasta 100 órdenes por mes',
                    'Gestión completa de productos',
                    'Panel de administración',
                    'Soporte por email',
                    'Reportes básicos',
                ],
                'limits' => [
                    'orders' => 100,
                    'products' => 100,
                    'users' => 3,
                    'storage' => 1000, // MB
                ],
                'sort_order' => 2,
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
                'trial_days' => 0,
                'features' => [
                    'Hasta 500 órdenes por mes',
                    'Gestión completa de productos',
                    'Panel de administración avanzado',
                    'Soporte prioritario',
                    'Reportes avanzados',
                    'Integraciones con terceros',
                    'Múltiples usuarios',
                ],
                'limits' => [
                    'orders' => 500,
                    'products' => 500,
                    'users' => 10,
                    'storage' => 5000, // MB
                ],
                'sort_order' => 3,
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
                ],
                'limits' => [
                    'orders' => -1, // Ilimitado
                    'products' => -1, // Ilimitado
                    'users' => -1, // Ilimitado
                    'storage' => -1, // Ilimitado
                ],
                'sort_order' => 4,
            ],
        ];

        foreach ($plans as $plan) {
            SubscriptionPlan::create($plan);
        }
    }
}