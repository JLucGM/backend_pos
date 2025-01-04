<?php

namespace Database\Seeders;

use App\Models\Country;
use Illuminate\Database\Seeder;

class CountriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $countries = [
            ['country_name' => 'Venezuela'],
            ['country_name' => 'República Dominicana'],
        ];
        
        foreach ($countries as $country) {
            Country::create($country);
        } 
    }
}
