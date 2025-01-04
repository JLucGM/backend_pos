<?php

namespace Database\Seeders;

use App\Models\Cities;
use App\Models\City;
use App\Models\Ciudades;
use App\Models\State;
use Illuminate\Database\Seeder;

class CitiesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Crear las ciudades de cada State
        $ciudades = [
            //Ciudades de Venezuela
            // Amazonas
            ['city_name' => 'Puerto Ayacucho', 'state_id' => State::where('state_name', 'Amazonas')->first()->id],
            ['city_name' => 'San Fernando de Atabapo', 'state_id' => State::where('state_name', 'Amazonas')->first()->id],
            ['city_name' => 'La Esmeralda', 'state_id' => State::where('state_name', 'Amazonas')->first()->id],
            ['city_name' => 'Maroa', 'state_id' => State::where('state_name', 'Amazonas')->first()->id],
            ['city_name' => 'Isla Ratón', 'state_id' => State::where('state_name', 'Amazonas')->first()->id],
            ['city_name' => 'San Juan de Manapiare', 'state_id' => State::where('state_name', 'Amazonas')->first()->id],
            ['city_name' => 'San Carlos de Río Negro', 'state_id' => State::where('state_name', 'Amazonas')->first()->id],

            // Anzoátegui
            ['city_name' => 'Barcelona', 'state_id' => State::where('state_name', 'Anzoátegui')->first()->id],
            ['city_name' => 'Puerto La Cruz', 'state_id' => State::where('state_name', 'Anzoátegui')->first()->id],
            ['city_name' => 'Lechería', 'state_id' => State::where('state_name', 'Anzoátegui')->first()->id],
            ['city_name' => 'El Tigre', 'state_id' => State::where('state_name', 'Anzoátegui')->first()->id],
            ['city_name' => 'Anaco', 'state_id' => State::where('state_name', 'Anzoátegui')->first()->id],
            ['city_name' => 'Puerto Píritu', 'state_id' => State::where('state_name', 'Anzoátegui')->first()->id],
            ['city_name' => 'Cantaura', 'state_id' => State::where('state_name', 'Anzoátegui')->first()->id],
            ['city_name' => 'San José de Guanipa', 'state_id' => State::where('state_name', 'Anzoátegui')->first()->id],
            ['city_name' => 'Guanta ', 'state_id' => State::where('state_name', 'Anzoátegui')->first()->id],
            ['city_name' => 'Pariaguan ', 'state_id' => State::where('state_name', 'Anzoátegui')->first()->id],
            ['city_name' => 'Aragua De Barcelona', 'state_id' => State::where('state_name', 'Anzoátegui')->first()->id],
            ['city_name' => 'Clarines ', 'state_id' => State::where('state_name', 'Anzoátegui')->first()->id],
            ['city_name' => 'Ciudad Orinoco', 'state_id' => State::where('state_name', 'Anzoátegui')->first()->id],
            ['city_name' => 'San Mateo', 'state_id' => State::where('state_name', 'Anzoátegui')->first()->id],
            ['city_name' => 'Onoto ', 'state_id' => State::where('state_name', 'Anzoátegui')->first()->id],
            ['city_name' => 'Valle de Guanape', 'state_id' => State::where('state_name', 'Anzoátegui')->first()->id],
            ['city_name' => 'El Chaparro', 'state_id' => State::where('state_name', 'Anzoátegui')->first()->id],
            ['city_name' => 'Boca de Uchire', 'state_id' => State::where('state_name', 'Anzoátegui')->first()->id],

            // Apure
            ['city_name' => 'San Fernando de Apure', 'state_id' => State::where('state_name', 'Apure')->first()->id],
            ['city_name' => 'Achaguas', 'state_id' => State::where('state_name', 'Apure')->first()->id],
            ['city_name' => 'Biruaca', 'state_id' => State::where('state_name', 'Apure')->first()->id],
            ['city_name' => 'Guasdualito', 'state_id' => State::where('state_name', 'Apure')->first()->id],
            ['city_name' => 'Bruzual', 'state_id' => State::where('state_name', 'Apure')->first()->id],

            // Aragua
            ['city_name' => 'San Mateo', 'state_id' => State::where('state_name', 'Aragua')->first()->id],
            ['city_name' => 'Camatagua', 'state_id' => State::where('state_name', 'Aragua')->first()->id],
            ['city_name' => 'Santa Rita', 'state_id' => State::where('state_name', 'Aragua')->first()->id],
            ['city_name' => 'Maracay', 'state_id' => State::where('state_name', 'Aragua')->first()->id],
            ['city_name' => 'Santa Cruz', 'state_id' => State::where('state_name', 'Aragua')->first()->id],
            ['city_name' => 'La Victoria', 'state_id' => State::where('state_name', 'Aragua')->first()->id],
            ['city_name' => 'El Consejo', 'state_id' => State::where('state_name', 'Aragua')->first()->id],
            ['city_name' => 'Palo Negro', 'state_id' => State::where('state_name', 'Aragua')->first()->id],
            ['city_name' => 'El Limón', 'state_id' => State::where('state_name', 'Aragua')->first()->id],
            ['city_name' => 'Ocumare de la Costa', 'state_id' => State::where('state_name', 'Aragua')->first()->id],
            ['city_name' => 'San Casimiro', 'state_id' => State::where('state_name', 'Aragua')->first()->id],
            ['city_name' => 'San Sebastián', 'state_id' => State::where('state_name', 'Aragua')->first()->id],
            ['city_name' => 'Turmero', 'state_id' => State::where('state_name', 'Aragua')->first()->id],
            ['city_name' => 'Las Tejerías', 'state_id' => State::where('state_name', 'Aragua')->first()->id],
            ['city_name' => 'Cagua', 'state_id' => State::where('state_name', 'Aragua')->first()->id],
            ['city_name' => 'Colonia Tovar', 'state_id' => State::where('state_name', 'Aragua')->first()->id],
            ['city_name' => 'Barbacoas', 'state_id' => State::where('state_name', 'Aragua')->first()->id],
            ['city_name' => 'Villa de Cura', 'state_id' => State::where('state_name', 'Aragua')->first()->id],

            // Barinas
            ['city_name' => 'Barinas', 'state_id' => State::where('state_name', 'Barinas')->first()->id],
            ['city_name' => 'Socopó', 'state_id' => State::where('state_name', 'Barinas')->first()->id],
            ['city_name' => 'Barinas', 'state_id' => State::where('state_name', 'Barinas')->first()->id],
            ['city_name' => 'Ciudad Bolivia', 'state_id' => State::where('state_name', 'Barinas')->first()->id],
            ['city_name' => 'Barinitas', 'state_id' => State::where('state_name', 'Barinas')->first()->id],
            ['city_name' => 'Santa Bárbara', 'state_id' => State::where('state_name', 'Barinas')->first()->id],
            ['city_name' => 'Sabaneta', 'state_id' => State::where('state_name', 'Barinas')->first()->id],
            ['city_name' => 'Barrancas', 'state_id' => State::where('state_name', 'Barinas')->first()->id],
            ['city_name' => 'Obispos', 'state_id' => State::where('state_name', 'Barinas')->first()->id],
            ['city_name' => 'Los Guasimitos', 'state_id' => State::where('state_name', 'Barinas')->first()->id],
            ['city_name' => 'Libertad', 'state_id' => State::where('state_name', 'Barinas')->first()->id],
            ['city_name' => 'Arauquita', 'state_id' => State::where('state_name', 'Barinas')->first()->id],
            ['city_name' => 'Las Casitas del Vegón de Nutrias', 'state_id' => State::where('state_name', 'Barinas')->first()->id],
            ['city_name' => 'La Caramuca	', 'state_id' => State::where('state_name', 'Barinas')->first()->id],
            ['city_name' => 'Arismendi', 'state_id' => State::where('state_name', 'Barinas')->first()->id],
            ['city_name' => 'Quebrada Seca', 'state_id' => State::where('state_name', 'Barinas')->first()->id],
            ['city_name' => 'Dolores', 'state_id' => State::where('state_name', 'Barinas')->first()->id],
            ['city_name' => 'Chameta', 'state_id' => State::where('state_name', 'Barinas')->first()->id],
            ['city_name' => 'La Mula	', 'state_id' => State::where('state_name', 'Barinas')->first()->id],
            ['city_name' => 'La Luz	', 'state_id' => State::where('state_name', 'Barinas')->first()->id],
            ['city_name' => 'Curbatí', 'state_id' => State::where('state_name', 'Barinas')->first()->id],
            ['city_name' => 'Bum-Bum	', 'state_id' => State::where('state_name', 'Barinas')->first()->id],
            ['city_name' => 'San Silvestre	', 'state_id' => State::where('state_name', 'Barinas')->first()->id],

            // Bolívar
            ['city_name' => 'Ciudad Guayana ', 'state_id' => State::where('state_name', 'Bolívar')->first()->id],
            ['city_name' => 'Ciudad Bolívar', 'state_id' => State::where('state_name', 'Bolívar')->first()->id],
            ['city_name' => 'Puerto Ordaz', 'state_id' => State::where('state_name', 'Bolívar')->first()->id],
            ['city_name' => 'Upata', 'state_id' => State::where('state_name', 'Bolívar')->first()->id],
            ['city_name' => 'Caicara del Orinoco', 'state_id' => State::where('state_name', 'Bolívar')->first()->id],
            ['city_name' => 'Ciudad Piar', 'state_id' => State::where('state_name', 'Bolívar')->first()->id],
            ['city_name' => 'El Callao', 'state_id' => State::where('state_name', 'Bolívar')->first()->id],
            ['city_name' => 'El Dorado', 'state_id' => State::where('state_name', 'Bolívar')->first()->id],
            ['city_name' => 'Maripa', 'state_id' => State::where('state_name', 'Bolívar')->first()->id],
            ['city_name' => 'Santa Elena de Uairén', 'state_id' => State::where('state_name', 'Bolívar')->first()->id],
            ['city_name' => 'Tumeremo', 'state_id' => State::where('state_name', 'Bolívar')->first()->id],
            ['city_name' => 'Guasipati', 'state_id' => State::where('state_name', 'Bolívar')->first()->id],
            ['city_name' => 'El Palmar', 'state_id' => State::where('state_name', 'Bolívar')->first()->id],

            // Carabobo
            ['city_name' => 'Valencia', 'state_id' => State::where('state_name', 'Carabobo')->first()->id],
            ['city_name' => 'Puerto Cabello', 'state_id' => State::where('state_name', 'Carabobo')->first()->id],
            ['city_name' => 'Naguanagua', 'state_id' => State::where('state_name', 'Carabobo')->first()->id],
            ['city_name' => 'Tocuyito', 'state_id' => State::where('state_name', 'Carabobo')->first()->id],
            ['city_name' => 'Guacara', 'state_id' => State::where('state_name', 'Carabobo')->first()->id],
            ['city_name' => 'Mariara', 'state_id' => State::where('state_name', 'Carabobo')->first()->id],
            ['city_name' => 'Bejuma', 'state_id' => State::where('state_name', 'Carabobo')->first()->id],
            ['city_name' => 'Morón', 'state_id' => State::where('state_name', 'Carabobo')->first()->id],
            ['city_name' => 'San Joaquín ', 'state_id' => State::where('state_name', 'Carabobo')->first()->id],
            ['city_name' => 'Güigüe', 'state_id' => State::where('state_name', 'Carabobo')->first()->id],

            // Cojedes
            ['city_name' => 'San Carlos', 'state_id' => State::where('state_name', 'Cojedes')->first()->id],
            ['city_name' => 'Tinaquillo', 'state_id' => State::where('state_name', 'Cojedes')->first()->id],
            ['city_name' => 'Tinaco', 'state_id' => State::where('state_name', 'Cojedes')->first()->id],
            ['city_name' => 'Las Vegas', 'state_id' => State::where('state_name', 'Cojedes')->first()->id],
            ['city_name' => 'El Pao', 'state_id' => State::where('state_name', 'Cojedes')->first()->id],
            ['city_name' => 'Macapo', 'state_id' => State::where('state_name', 'Cojedes')->first()->id],

            // Delta Amacuro
            ['city_name' => 'Tucupita', 'state_id' => State::where('state_name', 'Delta Amacuro')->first()->id],
            ['city_name' => 'Sierra Imataca', 'state_id' => State::where('state_name', 'Delta Amacuro')->first()->id],
            ['city_name' => 'Pedernales', 'state_id' => State::where('state_name', 'Delta Amacuro')->first()->id],
            ['city_name' => 'Curiapo', 'state_id' => State::where('state_name', 'Delta Amacuro')->first()->id],

            // Distrito Capital
            ['city_name' => 'Baruta', 'state_id' => State::where('state_name', 'Distrito Capital')->first()->id],
            ['city_name' => ' El Hatillo', 'state_id' => State::where('state_name', 'Distrito Capital')->first()->id],
            ['city_name' => 'Sucre', 'state_id' => State::where('state_name', 'Distrito Capital')->first()->id],
            ['city_name' => 'Curiapo', 'state_id' => State::where('state_name', 'Distrito Capital')->first()->id],

            // Falcón
            ['city_name' => 'Coro', 'state_id' => State::where('state_name', 'Falcón')->first()->id],
            ['city_name' => 'Punto Fijo', 'state_id' => State::where('state_name', 'Falcón')->first()->id],
            ['city_name' => 'Churuguara', 'state_id' => State::where('state_name', 'Falcón')->first()->id],
            ['city_name' => 'Tucacas', 'state_id' => State::where('state_name', 'Falcón')->first()->id],
            ['city_name' => 'Judibana', 'state_id' => State::where('state_name', 'Falcón')->first()->id],
            ['city_name' => 'Santa Ana de Coro', 'state_id' => State::where('state_name', 'Falcón')->first()->id],
            ['city_name' => 'La Vela de Coro', 'state_id' => State::where('state_name', 'Falcón')->first()->id],
            ['city_name' => 'Chichiriviche', 'state_id' => State::where('state_name', 'Falcón')->first()->id],
            ['city_name' => 'Adícora', 'state_id' => State::where('state_name', 'Falcón')->first()->id],
            ['city_name' => 'Cumarebo', 'state_id' => State::where('state_name', 'Falcón')->first()->id],
            ['city_name' => 'Dabajuro', 'state_id' => State::where('state_name', 'Falcón')->first()->id],
            ['city_name' => 'San Juan de Los Cayos', 'state_id' => State::where('state_name', 'Falcón')->first()->id],
            ['city_name' => 'Santa Cruz de Bucarat', 'state_id' => State::where('state_name', 'Falcón')->first()->id],
            ['city_name' => 'Tocopero', 'state_id' => State::where('state_name', 'Falcón')->first()->id],
            ['city_name' => 'Capatárida', 'state_id' => State::where('state_name', 'Falcón')->first()->id],

            // Guárico
            ['city_name' => 'San Juan de Los Morros', 'state_id' => State::where('state_name', 'Guárico')->first()->id],
            ['city_name' => 'Valle de la Pascua', 'state_id' => State::where('state_name', 'Guárico')->first()->id],
            ['city_name' => 'Calabozo', 'state_id' => State::where('state_name', 'Guárico')->first()->id],
            ['city_name' => 'Zaraza', 'state_id' => State::where('state_name', 'Guárico')->first()->id],
            ['city_name' => 'Altagracia de Orituco', 'state_id' => State::where('state_name', 'Guárico')->first()->id],

            // Lara
            ['city_name' => 'Barquisimeto', 'state_id' => State::where('state_name', 'Lara')->first()->id],
            ['city_name' => 'Carora', 'state_id' => State::where('state_name', 'Lara')->first()->id],
            ['city_name' => 'El Tocuyo', 'state_id' => State::where('state_name', 'Lara')->first()->id],
            ['city_name' => 'Quibor', 'state_id' => State::where('state_name', 'Lara')->first()->id],
            ['city_name' => 'Cabudare', 'state_id' => State::where('state_name', 'Lara')->first()->id],

            // Mérida
            ['city_name' => 'Mérida', 'state_id' => State::where('state_name', 'Mérida')->first()->id],
            ['city_name' => 'El Vigia', 'state_id' => State::where('state_name', 'Mérida')->first()->id],
            ['city_name' => 'Ejido', 'state_id' => State::where('state_name', 'Mérida')->first()->id],
            ['city_name' => 'Lagunllas', 'state_id' => State::where('state_name', 'Mérida')->first()->id],
            ['city_name' => 'Tovar', 'state_id' => State::where('state_name', 'Mérida')->first()->id],

            // Miranda
            ['city_name' => 'Los Teques', 'state_id' => State::where('state_name', 'Miranda')->first()->id],
            ['city_name' => 'Guatire', 'state_id' => State::where('state_name', 'Miranda')->first()->id],
            ['city_name' => 'Guarenas', 'state_id' => State::where('state_name', 'Miranda')->first()->id],
            ['city_name' => 'Cúa,', 'state_id' => State::where('state_name', 'Miranda')->first()->id],
            ['city_name' => 'Santa Teresa del Tuy', 'state_id' => State::where('state_name', 'Miranda')->first()->id],
            ['city_name' => 'San Francisco de Yare', 'state_id' => State::where('state_name', 'Miranda')->first()->id],
            ['city_name' => 'Caucagua', 'state_id' => State::where('state_name', 'Miranda')->first()->id],
            ['city_name' => 'San Antonio de Los Altos', 'state_id' => State::where('state_name', 'Miranda')->first()->id],
            ['city_name' => 'Santa Lucía', 'state_id' => State::where('state_name', 'Miranda')->first()->id],
            ['city_name' => 'Higuerote', 'state_id' => State::where('state_name', 'Miranda')->first()->id],
            ['city_name' => 'Río Chico', 'state_id' => State::where('state_name', 'Miranda')->first()->id],

            // Monagas
            ['city_name' => 'Punta de Mata,', 'state_id' => State::where('state_name', 'Monagas')->first()->id],
            ['city_name' => 'Caripe', 'state_id' => State::where('state_name', 'Monagas')->first()->id],
            ['city_name' => 'Caripito', 'state_id' => State::where('state_name', 'Monagas')->first()->id],
            ['city_name' => 'Maturín', 'state_id' => State::where('state_name', 'Monagas')->first()->id],
            ['city_name' => 'Temblador', 'state_id' => State::where('state_name', 'Monagas')->first()->id],

            // Nueva Esparta
            ['city_name' => 'La Asunción', 'state_id' => State::where('state_name', 'Nueva Esparta')->first()->id],
            ['city_name' => 'Porlamar', 'state_id' => State::where('state_name', 'Nueva Esparta')->first()->id],
            ['city_name' => 'Juan Griego', 'state_id' => State::where('state_name', 'Nueva Esparta')->first()->id],
            ['city_name' => 'Punta de Piedras', 'state_id' => State::where('state_name', 'Nueva Esparta')->first()->id],
            ['city_name' => 'Pampatar', 'state_id' => State::where('state_name', 'Nueva Esparta')->first()->id],
            ['city_name' => 'San Juan Bautista', 'state_id' => State::where('state_name', 'Nueva Esparta')->first()->id],
            ['city_name' => 'El Valle del Espíritu Santo', 'state_id' => State::where('state_name', 'Nueva Esparta')->first()->id],

            // Portuguesa
            ['city_name' => 'Guanare', 'state_id' => State::where('state_name', 'Portuguesa')->first()->id],
            ['city_name' => 'Acarigua', 'state_id' => State::where('state_name', 'Portuguesa')->first()->id],
            ['city_name' => 'Araure', 'state_id' => State::where('state_name', 'Portuguesa')->first()->id],

            // Sucre
            ['city_name' => 'Cumaná', 'state_id' => State::where('state_name', 'Sucre')->first()->id],
            ['city_name' => 'Carúpano', 'state_id' => State::where('state_name', 'Sucre')->first()->id],
            ['city_name' => 'Cariaco', 'state_id' => State::where('state_name', 'Sucre')->first()->id],

            // Táchira
            ['city_name' => 'San Cristóbal', 'state_id' => State::where('state_name', 'Táchira')->first()->id],
            ['city_name' => 'Táriba,', 'state_id' => State::where('state_name', 'Táchira')->first()->id],
            ['city_name' => 'Rubio', 'state_id' => State::where('state_name', 'Táchira')->first()->id],
            ['city_name' => 'La Grita', 'state_id' => State::where('state_name', 'Táchira')->first()->id],
            ['city_name' => 'San Antonio del Táchira', 'state_id' => State::where('state_name', 'Táchira')->first()->id],
            ['city_name' => 'La Fría', 'state_id' => State::where('state_name', 'Táchira')->first()->id],
            ['city_name' => 'Santa Ana del Táchira', 'state_id' => State::where('state_name', 'Táchira')->first()->id],
            ['city_name' => 'Capacho Nuevo', 'state_id' => State::where('state_name', 'Táchira')->first()->id],
            ['city_name' => 'San Juan de Colón', 'state_id' => State::where('state_name', 'Táchira')->first()->id],
            ['city_name' => 'Cordero', 'state_id' => State::where('state_name', 'Táchira')->first()->id],
            ['city_name' => 'Capacho Viejo', 'state_id' => State::where('state_name', 'Táchira')->first()->id],

            // Trujillo
            ['city_name' => 'Trujillo', 'state_id' => State::where('state_name', 'Trujillo')->first()->id],
            ['city_name' => 'Valera', 'state_id' => State::where('state_name', 'Trujillo')->first()->id],
            ['city_name' => 'Boconó', 'state_id' => State::where('state_name', 'Trujillo')->first()->id],
            ['city_name' => 'Carvajal', 'state_id' => State::where('state_name', 'Trujillo')->first()->id],

            // La Guaira
            ['city_name' => 'La Guaira', 'state_id' => State::where('state_name', 'La Guaira')->first()->id],
            ['city_name' => 'Caraballeda', 'state_id' => State::where('state_name', 'La Guaira')->first()->id],
            ['city_name' => 'Catia La Mar', 'state_id' => State::where('state_name', 'La Guaira')->first()->id],
            ['city_name' => 'Macuto', 'state_id' => State::where('state_name', 'La Guaira')->first()->id],
            ['city_name' => 'Maiquetía', 'state_id' => State::where('state_name', 'La Guaira')->first()->id],

            // Yaracuy
            ['city_name' => 'San Felipe', 'state_id' => State::where('state_name', 'Yaracuy')->first()->id],
            ['city_name' => 'Independencia', 'state_id' => State::where('state_name', 'Yaracuy')->first()->id],
            ['city_name' => 'Chivacoa', 'state_id' => State::where('state_name', 'Yaracuy')->first()->id],
            ['city_name' => 'Nirgua', 'state_id' => State::where('state_name', 'Yaracuy')->first()->id],
            ['city_name' => 'Cocorote', 'state_id' => State::where('state_name', 'Yaracuy')->first()->id],
            ['city_name' => 'Urachiche', 'state_id' => State::where('state_name', 'Yaracuy')->first()->id],

            // Zulia
            ['city_name' => 'Maracaibo', 'state_id' => State::where('state_name', 'Zulia')->first()->id],
            ['city_name' => 'San Francisco', 'state_id' => State::where('state_name', 'Zulia')->first()->id],
            ['city_name' => 'Cabimas', 'state_id' => State::where('state_name', 'Zulia')->first()->id],
            ['city_name' => 'Ciudad Ojeda', 'state_id' => State::where('state_name', 'Zulia')->first()->id],
            ['city_name' => 'Santa Bárbara del Zulia', 'state_id' => State::where('state_name', 'Zulia')->first()->id],
            ['city_name' => 'Rosario de Perijá', 'state_id' => State::where('state_name', 'Zulia')->first()->id],
            ['city_name' => 'Machiques', 'state_id' => State::where('state_name', 'Zulia')->first()->id],
            ['city_name' => 'La Concepción', 'state_id' => State::where('state_name', 'Zulia')->first()->id],
            ['city_name' => 'Los Puertos de Altagracia', 'state_id' => State::where('state_name', 'Zulia')->first()->id],

            //Ciudades de Republica Dominicana
            // Azua
            ['city_name' => 'Azua de Compostela', 'state_id' => State::where('state_name', 'Azua')->first()->id],
            ['city_name' => 'Estebanía', 'state_id' => State::where('state_name', 'Azua')->first()->id],
            ['city_name' => 'Guayabal', 'state_id' => State::where('state_name', 'Azua')->first()->id],
            ['city_name' => 'Las Charcas', 'state_id' => State::where('state_name', 'Azua')->first()->id],
            ['city_name' => 'Las Yayas de Viajama', 'state_id' => State::where('state_name', 'Azua')->first()->id],
            ['city_name' => 'Padre Las Casas', 'state_id' => State::where('state_name', 'Azua')->first()->id],
            ['city_name' => 'Peralta', 'state_id' => State::where('state_name', 'Azua')->first()->id],
            ['city_name' => 'Pueblo Viejo', 'state_id' => State::where('state_name', 'Azua')->first()->id],
            ['city_name' => 'Sabana Yegua', 'state_id' => State::where('state_name', 'Azua')->first()->id],
            ['city_name' => 'Tábara Arriba', 'state_id' => State::where('state_name', 'Azua')->first()->id],

            // Bahoruco
            ['city_name' => 'Neiba', 'state_id' => State::where('state_name', 'Bahoruco')->first()->id],
            ['city_name' => 'Galván', 'state_id' => State::where('state_name', 'Bahoruco')->first()->id],
            ['city_name' => 'Los Ríos', 'state_id' => State::where('state_name', 'Bahoruco')->first()->id],
            ['city_name' => 'Tamayo', 'state_id' => State::where('state_name', 'Bahoruco')->first()->id],
            ['city_name' => 'Uvilla', 'state_id' => State::where('state_name', 'Bahoruco')->first()->id],
            ['city_name' => 'Mella', 'state_id' => State::where('state_name', 'Bahoruco')->first()->id],
            ['city_name' => 'El Palmar', 'state_id' => State::where('state_name', 'Bahoruco')->first()->id],
            ['city_name' => 'Monserrat', 'state_id' => State::where('state_name', 'Bahoruco')->first()->id],

            // Barahona
            ['city_name' => 'Barahona', 'state_id' => State::where('state_name', 'Barahona')->first()->id],
            ['city_name' => 'Cabral', 'state_id' => State::where('state_name', 'Barahona')->first()->id],
            ['city_name' => 'El Peñón', 'state_id' => State::where('state_name', 'Barahona')->first()->id],
            ['city_name' => 'Enriquillo', 'state_id' => State::where('state_name', 'Barahona')->first()->id],
            ['city_name' => 'Fundación', 'state_id' => State::where('state_name', 'Barahona')->first()->id],
            ['city_name' => 'Jaquimeyes', 'state_id' => State::where('state_name', 'Barahona')->first()->id],
            ['city_name' => 'La Ciénaga', 'state_id' => State::where('state_name', 'Barahona')->first()->id],
            ['city_name' => 'Las Salinas', 'state_id' => State::where('state_name', 'Barahona')->first()->id],
            ['city_name' => 'Paraíso', 'state_id' => State::where('state_name', 'Barahona')->first()->id],
            ['city_name' => 'Pescadería', 'state_id' => State::where('state_name', 'Barahona')->first()->id],
            ['city_name' => 'Vicente Noble', 'state_id' => State::where('state_name', 'Barahona')->first()->id],

            // Dajabón
            ['city_name' => 'Dajabón', 'state_id' => State::where('state_name', 'Dajabón')->first()->id],
            ['city_name' => 'El Pino', 'state_id' => State::where('state_name', 'Dajabón')->first()->id],
            ['city_name' => 'Loma de Cabrera', 'state_id' => State::where('state_name', 'Dajabón')->first()->id],
            ['city_name' => 'Partido', 'state_id' => State::where('state_name', 'Dajabón')->first()->id],
            ['city_name' => 'Restauración', 'state_id' => State::where('state_name', 'Dajabón')->first()->id],

            // Duarte
            ['city_name' => 'San Francisco de Macorís', 'state_id' => State::where('state_name', 'Duarte')->first()->id],
            ['city_name' => 'Arenoso', 'state_id' => State::where('state_name', 'Duarte')->first()->id],
            ['city_name' => 'Castillo', 'state_id' => State::where('state_name', 'Duarte')->first()->id],
            ['city_name' => 'Eugenio María de Hostos', 'state_id' => State::where('state_name', 'Duarte')->first()->id],
            ['city_name' => 'Las Guáranas', 'state_id' => State::where('state_name', 'Duarte')->first()->id],
            ['city_name' => 'Pimentel', 'state_id' => State::where('state_name', 'Duarte')->first()->id],
            ['city_name' => 'San Luis', 'state_id' => State::where('state_name', 'Duarte')->first()->id],

            // El Seibo
            ['city_name' => 'El Seibo', 'state_id' => State::where('state_name', 'El Seibo')->first()->id],
            ['city_name' => 'Miches', 'state_id' => State::where('state_name', 'El Seibo')->first()->id],
            ['city_name' => 'Santa Cruz de El Seibo', 'state_id' => State::where('state_name', 'El Seibo')->first()->id],

            // Elías Piña
            ['city_name' => 'Comendador', 'state_id' => State::where('state_name', 'Elías Piña')->first()->id],
            ['city_name' => 'Bánica', 'state_id' => State::where('state_name', 'Elías Piña')->first()->id],
            ['city_name' => 'El Llano', 'state_id' => State::where('state_name', 'Elías Piña')->first()->id],
            ['city_name' => 'Hondo Valle', 'state_id' => State::where('state_name', 'Elías Piña')->first()->id],
            ['city_name' => 'Juan Santiago', 'state_id' => State::where('state_name', 'Elías Piña')->first()->id],

            // Espaillat
            ['city_name' => 'Moca', 'state_id' => State::where('state_name', 'Espaillat')->first()->id],
            ['city_name' => 'Cayetano Germosén', 'state_id' => State::where('state_name', 'Espaillat')->first()->id],
            ['city_name' => 'Gaspar Hernández', 'state_id' => State::where('state_name', 'Espaillat')->first()->id],
            ['city_name' => 'Jamao al Norte', 'state_id' => State::where('state_name', 'Espaillat')->first()->id],

            // Hato Mayor
            ['city_name' => 'Hato Mayor del Rey', 'state_id' => State::where('state_name', 'Hato Mayor')->first()->id],
            ['city_name' => 'El Valle', 'state_id' => State::where('state_name', 'Hato Mayor')->first()->id],
            ['city_name' => 'Sabana de la Mar', 'state_id' => State::where('state_name', 'Hato Mayor')->first()->id],
            ['city_name' => 'Yerba Buena', 'state_id' => State::where('state_name', 'Hato Mayor')->first()->id],

            // Hermanas Mirabal
            ['city_name' => 'Salcedo', 'state_id' => State::where('state_name', 'Hermanas Mirabal')->first()->id],
            ['city_name' => 'Tenares', 'state_id' => State::where('state_name', 'Hermanas Mirabal')->first()->id],
            ['city_name' => 'Villa Tapia', 'state_id' => State::where('state_name', 'Hermanas Mirabal')->first()->id],

            // Independencia
            ['city_name' => 'Jimaní', 'state_id' => State::where('state_name', 'Independencia')->first()->id],
            ['city_name' => 'Duvergé', 'state_id' => State::where('state_name', 'Independencia')->first()->id],
            ['city_name' => 'La Descubierta', 'state_id' => State::where('state_name', 'Independencia')->first()->id],
            ['city_name' => 'Mella', 'state_id' => State::where('state_name', 'Independencia')->first()->id],

            // La Altagracia
            ['city_name' => 'Higüey', 'state_id' => State::where('state_name', 'La Altagracia')->first()->id],
            ['city_name' => 'La Otra Banda', 'state_id' => State::where('state_name', 'La Altagracia')->first()->id],
            ['city_name' => 'Boca de Yuma', 'state_id' => State::where('state_name', 'La Altagracia')->first()->id],
            ['city_name' => 'San Rafael del Yuma', 'state_id' => State::where('state_name', 'La Altagracia')->first()->id],

            // La Romana
            ['city_name' => 'La Romana', 'state_id' => State::where('state_name', 'La Romana')->first()->id],
            ['city_name' => 'Guaymate', 'state_id' => State::where('state_name', 'La Romana')->first()->id],
            ['city_name' => 'La Caleta', 'state_id' => State::where('state_name', 'La Romana')->first()->id],
            ['city_name' => 'Villa Hermosa', 'state_id' => State::where('state_name', 'La Romana')->first()->id],

            // La Vega
            ['city_name' => 'La Vega', 'state_id' => State::where('state_name', 'La Vega')->first()->id],
            ['city_name' => 'Concepción de La Vega', 'state_id' => State::where('state_name', 'La Vega')->first()->id],
            ['city_name' => 'Jarabacoa', 'state_id' => State::where('state_name', 'La Vega')->first()->id],
            ['city_name' => 'Jima Abajo', 'state_id' => State::where('state_name', 'La Vega')->first()->id],

            // María Trinidad Sánchez
            ['city_name' => 'Nagua', 'state_id' => State::where('state_name', 'María Trinidad Sánchez')->first()->id],
            ['city_name' => 'Cabrera', 'state_id' => State::where('state_name', 'María Trinidad Sánchez')->first()->id],
            ['city_name' => 'El Factor', 'state_id' => State::where('state_name', 'María Trinidad Sánchez')->first()->id],
            ['city_name' => 'Río San Juan', 'state_id' => State::where('state_name', 'María Trinidad Sánchez')->first()->id],

            // Monseñor Nouel
            ['city_name' => 'Bonao', 'state_id' => State::where('state_name', 'Monseñor Nouel')->first()->id],
            ['city_name' => 'Maimón', 'state_id' => State::where('state_name', 'Monseñor Nouel')->first()->id],
            ['city_name' => 'Piedra Blanca', 'state_id' => State::where('state_name', 'Monseñor Nouel')->first()->id],
            ['city_name' => 'Sabana del Puerto', 'state_id' => State::where('state_name', 'Monseñor Nouel')->first()->id],

            // Monte Cristi
            ['city_name' => 'San Fernando de Monte Cristi', 'state_id' => State::where('state_name', 'Monte Cristi')->first()->id],
            ['city_name' => 'Castañuelas', 'state_id' => State::where('state_name', 'Monte Cristi')->first()->id],
            ['city_name' => 'Guayubín', 'state_id' => State::where('state_name', 'Monte Cristi')->first()->id],
            ['city_name' => 'Las Matas de Santa Cruz', 'state_id' => State::where('state_name', 'Monte Cristi')->first()->id],

            // Monte Plata
            ['city_name' => 'Monte Plata', 'state_id' => State::where('state_name', 'Monte Plata')->first()->id],
            ['city_name' => 'Bayaguana', 'state_id' => State::where('state_name', 'Monte Plata')->first()->id],
            ['city_name' => 'Peralvillo', 'state_id' => State::where('state_name', 'Monte Plata')->first()->id],
            ['city_name' => 'Yamasá', 'state_id' => State::where('state_name', 'Monte Plata')->first()->id],

            // Pedernales
            ['city_name' => 'Pedernales', 'state_id' => State::where('state_name', 'Pedernales')->first()->id],
            ['city_name' => 'Juancho', 'state_id' => State::where('state_name', 'Pedernales')->first()->id],
            ['city_name' => 'José Francisco Peña Gómez', 'state_id' => State::where('state_name', 'Pedernales')->first()->id],

            // Peravia
            ['city_name' => 'Baní', 'state_id' => State::where('state_name', 'Peravia')->first()->id],
            ['city_name' => 'Nizao', 'state_id' => State::where('state_name', 'Peravia')->first()->id],
            ['city_name' => 'Matanzas', 'state_id' => State::where('state_name', 'Peravia')->first()->id],
            ['city_name' => 'Sabana Grande de Palenque', 'state_id' => State::where('state_name', 'Peravia')->first()->id],

            // Puerto Plata
            ['city_name' => 'Puerto Plata', 'state_id' => State::where('state_name', 'Puerto Plata')->first()->id],
            ['city_name' => 'Altamira', 'state_id' => State::where('state_name', 'Puerto Plata')->first()->id],
            ['city_name' => 'Guananico', 'state_id' => State::where('state_name', 'Puerto Plata')->first()->id],
            ['city_name' => 'Imbert', 'state_id' => State::where('state_name', 'Puerto Plata')->first()->id],

            // Sánchez Ramírez
            ['city_name' => 'Cotuí', 'state_id' => State::where('state_name', 'Sánchez Ramírez')->first()->id],
            ['city_name' => 'Cevicos', 'state_id' => State::where('state_name', 'Sánchez Ramírez')->first()->id],
            ['city_name' => 'La Mata', 'state_id' => State::where('state_name', 'Sánchez Ramírez')->first()->id],
            ['city_name' => 'Fantino', 'state_id' => State::where('state_name', 'Sánchez Ramírez')->first()->id],

            // San Cristóbal
            ['city_name' => 'San Cristóbal', 'state_id' => State::where('state_name', 'San Cristóbal')->first()->id],
            ['city_name' => 'Bajos de Haina', 'state_id' => State::where('state_name', 'San Cristóbal')->first()->id],
            ['city_name' => 'San Gregorio de Nigua', 'state_id' => State::where('state_name', 'San Cristóbal')->first()->id],
            ['city_name' => 'Yaguate', 'state_id' => State::where('state_name', 'San Cristóbal')->first()->id],

            // San José de Ocoa
            ['city_name' => 'San José de Ocoa', 'state_id' => State::where('state_name', 'San José de Ocoa')->first()->id],
            ['city_name' => 'Rancho Arriba', 'state_id' => State::where('state_name', 'San José de Ocoa')->first()->id],
            ['city_name' => 'Sabana Larga', 'state_id' => State::where('state_name', 'San José de Ocoa')->first()->id],

            // San Juan
            ['city_name' => 'San Juan de la Maguana', 'state_id' => State::where('state_name', 'San Juan')->first()->id],
            ['city_name' => 'El Cercado', 'state_id' => State::where('state_name', 'San Juan')->first()->id],
            ['city_name' => 'Juan de Herrera', 'state_id' => State::where('state_name', 'San Juan')->first()->id],
            ['city_name' => 'Las Matas de Farfán', 'state_id' => State::where('state_name', 'San Juan')->first()->id],

            // San Pedro de Macorís
            ['city_name' => 'San Pedro de Macorís', 'state_id' => State::where('state_name', 'San Pedro de Macorís')->first()->id],
            ['city_name' => 'Consuelo', 'state_id' => State::where('state_name', 'San Pedro de Macorís')->first()->id],
            ['city_name' => 'Guayabo', 'state_id' => State::where('state_name', 'San Pedro de Macorís')->first()->id],
            ['city_name' => 'Quisqueya', 'state_id' => State::where('state_name', 'San Pedro de Macorís')->first()->id],

            // Santiago
            ['city_name' => 'Santiago de los Caballeros', 'state_id' => State::where('state_name', 'Santiago')->first()->id],
            ['city_name' => 'Bisonó', 'state_id' => State::where('state_name', 'Santiago')->first()->id],
            ['city_name' => 'Jánico', 'state_id' => State::where('state_name', 'Santiago')->first()->id],
            ['city_name' => 'San José de las Matas', 'state_id' => State::where('state_name', 'Santiago')->first()->id],

            // Santiago Rodríguez
            ['city_name' => 'San Ignacio de Sabaneta', 'state_id' => State::where('state_name', 'Santiago Rodríguez')->first()->id],
            ['city_name' => 'Monción', 'state_id' => State::where('state_name', 'Santiago Rodríguez')->first()->id],
            ['city_name' => 'Villa Los Almácigos', 'state_id' => State::where('state_name', 'Santiago Rodríguez')->first()->id],

            // Santo Domingo
            ['city_name' => 'Santo Domingo Este', 'state_id' => State::where('state_name', 'Santo Domingo')->first()->id],
            ['city_name' => 'Santo Domingo Norte', 'state_id' => State::where('state_name', 'Santo Domingo')->first()->id],
            ['city_name' => 'Santo Domingo Oeste', 'state_id' => State::where('state_name', 'Santo Domingo')->first()->id],
            ['city_name' => 'Boca Chica', 'state_id' => State::where('state_name', 'Santo Domingo')->first()->id],

            // Valverde
            ['city_name' => 'Mao', 'state_id' => State::where('state_name', 'Valverde')->first()->id],
            ['city_name' => 'Esperanza', 'state_id' => State::where('state_name', 'Valverde')->first()->id],
            ['city_name' => 'Laguna Salada', 'state_id' => State::where('state_name', 'Valverde')->first()->id],
        ];

        foreach ($ciudades as $ciudad) {
            City::create($ciudad);
        }
    }
}
