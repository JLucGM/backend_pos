<?php

namespace Database\Seeders;

use App\Models\Tax;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TaxesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //'tax_name', 'tax_description', 'tax_rate'
        $categorias = [           
            [
                'tax_name' => 'IVA',
                'tax_description' => 'Impuesto al Valor Agregado',
                'tax_rate' => '16',
                'company_id' => 1,
            ],            
            [
                'tax_name' => 'IVA',
                'tax_description' => 'Impuesto al Valor Agregado',
                'tax_rate' => '16',
                'company_id' => 2,
            ],            
        ];

        foreach ($categorias as $categoriasData) {
            Tax::create($categoriasData);
        }
    }
}
