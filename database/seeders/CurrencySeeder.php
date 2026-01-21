<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Currency;

class CurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $currencies = [
            // Monedas principales
            ['code' => 'USD', 'name' => 'US Dollar', 'symbol' => '$', 'country' => 'United States'],
            ['code' => 'EUR', 'name' => 'Euro', 'symbol' => '€', 'country' => 'European Union'],
            ['code' => 'GBP', 'name' => 'British Pound', 'symbol' => '£', 'country' => 'United Kingdom'],
            ['code' => 'JPY', 'name' => 'Japanese Yen', 'symbol' => '¥', 'country' => 'Japan'],
            ['code' => 'CAD', 'name' => 'Canadian Dollar', 'symbol' => 'C$', 'country' => 'Canada'],
            ['code' => 'AUD', 'name' => 'Australian Dollar', 'symbol' => 'A$', 'country' => 'Australia'],
            ['code' => 'CHF', 'name' => 'Swiss Franc', 'symbol' => 'CHF', 'country' => 'Switzerland'],
            ['code' => 'CNY', 'name' => 'Chinese Yuan', 'symbol' => '¥', 'country' => 'China'],
            
            // Monedas de América Latina
            ['code' => 'MXN', 'name' => 'Mexican Peso', 'symbol' => '$', 'country' => 'Mexico'],
            ['code' => 'BRL', 'name' => 'Brazilian Real', 'symbol' => 'R$', 'country' => 'Brazil'],
            ['code' => 'ARS', 'name' => 'Argentine Peso', 'symbol' => '$', 'country' => 'Argentina'],
            ['code' => 'CLP', 'name' => 'Chilean Peso', 'symbol' => '$', 'country' => 'Chile'],
            ['code' => 'COP', 'name' => 'Colombian Peso', 'symbol' => '$', 'country' => 'Colombia'],
            ['code' => 'PEN', 'name' => 'Peruvian Sol', 'symbol' => 'S/', 'country' => 'Peru'],
            ['code' => 'UYU', 'name' => 'Uruguayan Peso', 'symbol' => '$U', 'country' => 'Uruguay'],
            ['code' => 'VES', 'name' => 'Venezuelan Bolívar', 'symbol' => 'Bs.', 'country' => 'Venezuela'],
            ['code' => 'BOB', 'name' => 'Bolivian Boliviano', 'symbol' => 'Bs', 'country' => 'Bolivia'],
            ['code' => 'PYG', 'name' => 'Paraguayan Guaraní', 'symbol' => '₲', 'country' => 'Paraguay'],
            ['code' => 'ECU', 'name' => 'US Dollar (Ecuador)', 'symbol' => '$', 'country' => 'Ecuador'],
            
            // Otras monedas importantes
            ['code' => 'INR', 'name' => 'Indian Rupee', 'symbol' => '₹', 'country' => 'India'],
            ['code' => 'KRW', 'name' => 'South Korean Won', 'symbol' => '₩', 'country' => 'South Korea'],
            ['code' => 'SGD', 'name' => 'Singapore Dollar', 'symbol' => 'S$', 'country' => 'Singapore'],
            ['code' => 'HKD', 'name' => 'Hong Kong Dollar', 'symbol' => 'HK$', 'country' => 'Hong Kong'],
            ['code' => 'NZD', 'name' => 'New Zealand Dollar', 'symbol' => 'NZ$', 'country' => 'New Zealand'],
            ['code' => 'SEK', 'name' => 'Swedish Krona', 'symbol' => 'kr', 'country' => 'Sweden'],
            ['code' => 'NOK', 'name' => 'Norwegian Krone', 'symbol' => 'kr', 'country' => 'Norway'],
            ['code' => 'DKK', 'name' => 'Danish Krone', 'symbol' => 'kr', 'country' => 'Denmark'],
            ['code' => 'PLN', 'name' => 'Polish Złoty', 'symbol' => 'zł', 'country' => 'Poland'],
            ['code' => 'CZK', 'name' => 'Czech Koruna', 'symbol' => 'Kč', 'country' => 'Czech Republic'],
            ['code' => 'HUF', 'name' => 'Hungarian Forint', 'symbol' => 'Ft', 'country' => 'Hungary'],
            ['code' => 'RUB', 'name' => 'Russian Ruble', 'symbol' => '₽', 'country' => 'Russia'],
            ['code' => 'TRY', 'name' => 'Turkish Lira', 'symbol' => '₺', 'country' => 'Turkey'],
            ['code' => 'ZAR', 'name' => 'South African Rand', 'symbol' => 'R', 'country' => 'South Africa'],
            ['code' => 'THB', 'name' => 'Thai Baht', 'symbol' => '฿', 'country' => 'Thailand'],
            ['code' => 'MYR', 'name' => 'Malaysian Ringgit', 'symbol' => 'RM', 'country' => 'Malaysia'],
            ['code' => 'IDR', 'name' => 'Indonesian Rupiah', 'symbol' => 'Rp', 'country' => 'Indonesia'],
            ['code' => 'PHP', 'name' => 'Philippine Peso', 'symbol' => '₱', 'country' => 'Philippines'],
            ['code' => 'VND', 'name' => 'Vietnamese Dong', 'symbol' => '₫', 'country' => 'Vietnam'],
        ];

        foreach ($currencies as $currency) {
            Currency::create($currency);
        }
    }
}