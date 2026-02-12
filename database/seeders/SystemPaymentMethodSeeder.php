<?php

namespace Database\Seeders;

use App\Models\SystemPaymentMethod;
use Illuminate\Database\Seeder;

class SystemPaymentMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $methods = [
            [
                'name' => 'PayPal',
                'slug' => 'paypal',
                'type' => 'paypal',
                'description' => 'Paga de forma segura con tu cuenta PayPal (proceso manual)',
                'instructions' => "1. Envía el pago a: pagos@tuempresa.com\n2. Usa como referencia tu ID de suscripción\n3. Anota el número de transacción en el formulario\n4. Espera confirmación (24-48 horas)",
                'bank_info' => json_encode([
                    'email' => 'pagos@tuempresa.com',
                ]),
                'icon' => 'credit-card',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Stripe (Tarjeta)',
                'slug' => 'stripe',
                'type' => 'stripe',
                'description' => 'Pago con tarjeta de crédito/débito (proceso manual)',
                'instructions' => "Por favor contacta a soporte@tuempresa.com para procesar tu pago con tarjeta.\nTe enviaremos un enlace de pago seguro.",
                'bank_info' => json_encode([
                    'contact_email' => 'soporte@tuempresa.com',
                ]),
                'icon' => 'credit-card',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Pago Móvil',
                'slug' => 'mobile-payment',
                'type' => 'mobile_payment',
                'description' => 'Transferencia mediante pago móvil bancario',
                'instructions' => "1. Realiza el pago móvil a los datos indicados\n2. Incluye el número de referencia en el formulario\n3. Adjunta el comprobante si es posible\n4. La activación toma 24-48 horas",
                'bank_info' => json_encode([
                    'bank_name' => 'Banco de Venezuela',
                    'phone' => '0414-123-4567',
                    'holder_id' => 'V-12.345.678',
                    'holder_name' => 'Tu Empresa SaaS C.A.',
                    'account_type' => 'Cuenta Corriente',
                ]),
                'icon' => 'smartphone',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Transferencia Bancaria',
                'slug' => 'bank-transfer',
                'type' => 'bank_transfer',
                'description' => 'Transferencia directa a nuestra cuenta bancaria',
                'instructions' => "1. Realiza la transferencia a la cuenta indicada\n2. Incluye el número de referencia en el formulario\n3. Adjunta el comprobante si es posible\n4. La activación toma 24-48 horas",
                'bank_info' => json_encode([
                    'bank_name' => 'Banco de Venezuela',
                    'account_number' => '0102-1234-5678-9012',
                    'account_type' => 'Cuenta Corriente',
                    'holder_name' => 'Tu Empresa SaaS C.A.',
                    'rif' => 'J-12345678-9',
                ]),
                'icon' => 'building',
                'is_active' => true,
                'sort_order' => 4,
            ],
        ];

        foreach ($methods as $method) {
            SystemPaymentMethod::updateOrCreate(
                ['slug' => $method['slug']],
                $method
            );
        }
    }
}
