<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Country;
use App\Models\Currency;
use App\Models\Setting;
use App\Models\State;
use App\Models\Store;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener la moneda USD como predeterminada
        $usdCurrency = Currency::where('code', 'USD')->first();
        
        $settings = [
            [
                'currency_id' => $usdCurrency ? $usdCurrency->id : null,
                'company_id' => 1,
            ],            
            [
                'currency_id' => $usdCurrency ? $usdCurrency->id : null,
                'company_id' => 2,
            ],            
        ];

        foreach ($settings as $settingsData) {
            Setting::create($settingsData);
        }
    }
}
