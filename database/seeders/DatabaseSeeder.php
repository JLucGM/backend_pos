<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call(RolesSeeder::class);
        $this->call(CategorySeeder::class);
        $this->call(TaxesSeeder::class);
        $this->call(CountriesSeeder::class);
        $this->call(StatesSeeder::class);
        $this->call(CitiesSeeder::class);
        $this->call(PaymentsMethodsSeeder::class);

        User::create([
            'name' => 'Jean Gouirand',
            'email' => 'elluc09@gmail.com',
            'password' => bcrypt('123456789'),
            'phone' => '0',
            'status' => '1',
            // 'avatar' => asset('img/profile/default.jpg'),
        ])->assignRole('super admin');
    }
}
