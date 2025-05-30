<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CompaniesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = [
            [
                'name' => 'Empresa 1',
                'email' => 'empresa1@example.com',
                'phone' => '123456789',
                'address' => 'Direccion 1',
            ],
        ];

        foreach ($companies as $companiesData) {
            Company::create($companiesData);
        }
    }
}
