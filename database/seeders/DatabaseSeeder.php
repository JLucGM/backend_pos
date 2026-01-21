<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call(CompaniesSeeder::class);
        $this->call(RolesSeeder::class);
        $this->call(CurrencySeeder::class);
        $this->call(CategorySeeder::class);
        $this->call(TaxesSeeder::class);
        $this->call(CountriesSeeder::class);
        $this->call(StatesSeeder::class);
        $this->call(CitiesSeeder::class);
        $this->call(PaymentsMethodsSeeder::class);
        $this->call(StoreSeeder::class);
        $this->call(SettingsSeeder::class);
        $this->call(ThemeSeeder::class);
        $this->call(TemplateSeeder::class);
        $this->call(PageSeeder::class);

        DB::table('shipping_rates')->insert([
            'name' => 'Estandar',
            'slug' => "estandar",
            'price' => 2.00,
            'description' => 'Envío básico a zonas locales',
            'company_id' => 1, // ID de una empresa de prueba
            'created_at' => now(),
            'updated_at' => now(),
        ]);


        User::create([
            'name' => 'Jean Gouirand',
            'email' => 'elluc09@gmail.com',
            'password' => bcrypt('123456789'),
            'phone' => '04121234567',
            'is_active' => '1',
            'company_id' => 1,
            // 'avatar' => asset('img/profile/default.jpg'),
        ])->assignRole('super admin');
        User::create([
            'name' => 'Edduar Villegas',
            'email' => 'pepsi@gmail.com',
            'password' => bcrypt('123456789'),
            'phone' => '04121234567',
            'is_active' => '1',
            'company_id' => 2,
            // 'avatar' => asset('img/profile/default.jpg'),
        ])->assignRole('super admin');
        User::create([
            'name' => 'Cliente',
            'email' => 'cliente@example.com',
            'password' => bcrypt('123456789'),
            'phone' => '04121234567',
            'is_active' => '1',
            'company_id' => 1,
            // 'avatar' => asset('img/profile/default.jpg'),
        ])->assignRole('client');
    }
}
