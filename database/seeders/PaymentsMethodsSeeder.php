<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaymentsMethodsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //'tax_name', 'tax_description', 'tax_rate'
        $paymetsMethods = [
            [
                'payment_method_name' => 'Efectivo',
            ],            
        ];

        foreach ($paymetsMethods as $paymetsMethodsData) {
            PaymentMethod::create($paymetsMethodsData);
        }
    }
}
