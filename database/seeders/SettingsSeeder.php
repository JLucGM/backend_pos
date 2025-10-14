<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Country;
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
        $settings = [
            [
                // 'app_name' => 'Mi empresa',
                'default_currency' => "bs",
                // 'admin_email' => "joedoe@example.com",
                // 'admin_phone' => "04125549950",
                // 'shipping_base_price' => "2.00",
                'company_id' => 1,
            ],            
        ];

        foreach ($settings as $settingsData) {
            Setting::create($settingsData);
        }
    }
}
