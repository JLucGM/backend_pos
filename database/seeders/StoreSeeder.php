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
                'store_name' => 'MyStore',
                'store_phone' => "04125549950",
                'store_direction' => "Calle 1, Av 2, Casa 3",
                'country_id' => Country::where('country_name', 'Venezuela')->first()->id,
                'state_id' => State::where('state_name', 'Amazonas')->first()->id,
                'city_id' => City::where('city_name', 'Puerto Ayacucho')->first()->id,
            ],            
        ];

        foreach ($stores as $storesData) {
            Store::create($storesData);
        }
    }
}
