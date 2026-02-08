<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Country;
use App\Models\State;
use App\Models\Store;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stores = [
            [
                'name' => 'MyStore',
                'phone' => "04125549950",
                'address' => "Calle 1, Av 2, Casa 3",
                'is_ecommerce_active' => true,
                'allow_delivery' => true,
                'allow_pickup' => true,
                'allow_shipping' => true,
                // 'is_active' => true,
                'country_id' => Country::where('country_name', 'Venezuela')->first()->id,
                'state_id' => State::where('state_name', 'Amazonas')->first()->id,
                'city_id' => City::where('city_name', 'Puerto Ayacucho')->first()->id,
                'company_id' => 1,
            ],            
            [
                'name' => 'tienda2',
                'phone' => "04125549950",
                'address' => "Calle 1, Av 2, Casa 3",
                'country_id' => Country::where('country_name', 'Venezuela')->first()->id,
                'state_id' => State::where('state_name', 'Amazonas')->first()->id,
                'city_id' => City::where('city_name', 'Puerto Ayacucho')->first()->id,
                'company_id' => 1,
            ],            
        ];

        foreach ($stores as $storesData) {
            Store::create($storesData);
        }
    }
}
