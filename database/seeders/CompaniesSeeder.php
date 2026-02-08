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
                'name' => 'My Store',
                // 'email' => 'mystore@example.com',
                // 'phone' => '123456789',
                // 'address' => 'Direccion 1',
                'subdomain' => 'my-store',
                'domain' => 'mystore.test',
            ],
            [
                'name' => 'Pepsi',
                // 'email' => 'pepsi@example.com',
                // 'phone' => '123456789',
                // 'address' => 'Direccion 1',
                'subdomain' => 'pepsi',
                'domain' => 'pepsi.test',
            ],
        ];

        foreach ($companies as $companiesData) {
            Company::create($companiesData);
        }
    }
}
