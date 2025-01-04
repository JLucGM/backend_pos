<?php

namespace Database\Seeders;

use App\Models\Estado;
use App\Models\Country;
use App\Models\State;
use App\Models\States;
use Illuminate\Database\Seeder;

class StatesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //Estados
        $estados = [
            // Crear los estados de Venezuela
            ['state_name' => 'Amazonas', 'country_id' => Country::where('country_name', 'Venezuela')->first()->id],
            ['state_name' => 'Anzoátegui', 'country_id' => Country::where('country_name', 'Venezuela')->first()->id],
            ['state_name' => 'Apure', 'country_id' => Country::where('country_name', 'Venezuela')->first()->id],
            ['state_name' => 'Aragua', 'country_id' => Country::where('country_name', 'Venezuela')->first()->id],
            ['state_name' => 'Barinas', 'country_id' => Country::where('country_name', 'Venezuela')->first()->id],
            ['state_name' => 'Bolívar', 'country_id' => Country::where('country_name', 'Venezuela')->first()->id],
            ['state_name' => 'Carabobo', 'country_id' => Country::where('country_name', 'Venezuela')->first()->id],
            ['state_name' => 'Cojedes', 'country_id' => Country::where('country_name', 'Venezuela')->first()->id],
            ['state_name' => 'Delta Amacuro', 'country_id' => Country::where('country_name', 'Venezuela')->first()->id],
            ['state_name' => 'Distrito Capital', 'country_id' => Country::where('country_name', 'Venezuela')->first()->id],
            ['state_name' => 'Falcón', 'country_id' => Country::where('country_name', 'Venezuela')->first()->id],
            ['state_name' => 'Guárico', 'country_id' => Country::where('country_name', 'Venezuela')->first()->id],
            ['state_name' => 'Lara', 'country_id' => Country::where('country_name', 'Venezuela')->first()->id],
            ['state_name' => 'Mérida', 'country_id' => Country::where('country_name', 'Venezuela')->first()->id],
            ['state_name' => 'Miranda', 'country_id' => Country::where('country_name', 'Venezuela')->first()->id],
            ['state_name' => 'Monagas', 'country_id' => Country::where('country_name', 'Venezuela')->first()->id],
            ['state_name' => 'Nueva Esparta', 'country_id' => Country::where('country_name', 'Venezuela')->first()->id],
            ['state_name' => 'Portuguesa', 'country_id' => Country::where('country_name', 'Venezuela')->first()->id],
            ['state_name' => 'Sucre', 'country_id' => Country::where('country_name', 'Venezuela')->first()->id],
            ['state_name' => 'Táchira', 'country_id' => Country::where('country_name', 'Venezuela')->first()->id],
            ['state_name' => 'Trujillo', 'country_id' => Country::where('country_name', 'Venezuela')->first()->id],
            ['state_name' => 'La Guaira', 'country_id' => Country::where('country_name', 'Venezuela')->first()->id],
            ['state_name' => 'Yaracuy', 'country_id' => Country::where('country_name', 'Venezuela')->first()->id],
            ['state_name' => 'Zulia', 'country_id' => Country::where('country_name', 'Venezuela')->first()->id],
            ['state_name' => 'Distrito Capital', 'country_id' => Country::where('country_name', 'Venezuela')->first()->id],
            ['state_name' => 'Dependencias Federales', 'country_id' => Country::where('country_name', 'Venezuela')->first()->id],

            // Crear los estados de República Dominicana
            ['state_name' => 'Azua', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'Bahoruco', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'Barahona', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'Dajabón', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'Duarte', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'El Seibo', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'Elías Piña', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'Espaillat', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'Hato Mayor', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'Hermanas Mirabal', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'Independencia', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'La Altagracia', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'La Romana', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'La Vega', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'María Trinidad Sánchez', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'Monseñor Nouel', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'Monte Cristi', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'Monte Plata', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'Pedernales', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'Peravia', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'Puerto Plata', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'Sánchez Ramírez', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'San Cristóbal', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'San José de Ocoa', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'San Juan', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'San Pedro de Macorís', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'Santiago', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'Santiago Rodríguez', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'Santo Domingo', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
            ['state_name' => 'Valverde', 'country_id' => Country::where('country_name', 'República Dominicana')->first()->id],
        ];


        foreach ($estados as $estado) {
            State::create($estado);
        }
    
    }
}
