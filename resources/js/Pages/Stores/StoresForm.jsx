import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function CategoriesForm({ data, countries, states, cities, setData, errors }) {
    return (
        <>
            <div>
                <InputLabel htmlFor="store_name" value="Nombre" />
                <TextInput
                    id="store_name"
                    type="text"
                    name="store_name"
                    value={data.store_name}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('store_name', e.target.value)}
                />
                <InputError message={errors.store_name} className="mt-2" />
            </div>
            <div>
                <InputLabel htmlFor="store_phone" value="Telefono" />
                <TextInput
                    id="store_phone"
                    type="text"
                    name="store_phone"
                    value={data.store_phone}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('store_phone', e.target.value)}
                />
                <InputError message={errors.store_phone} className="mt-2" />
            </div>
            <div>
                <InputLabel htmlFor="store_direction" value="Dirección" />
                <TextInput
                    id="store_direction"
                    type="text"
                    name="store_direction"
                    value={data.store_direction}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('store_direction', e.target.value)}
                />
                <InputError message={errors.store_direction} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="country" value="Países" />
                <select
                    name="country_id"
                    id="country"
                    className="border-gray-300 w-full dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-3xl shadow-sm"
                    value={data.country_id}
                    onChange={(e) => setData('country_id', parseInt(e.target.value))}
                >
                    {countries.map((country) => (
                        <option value={country.id} key={country.id}>
                            {country.country_name}
                        </option>
                    ))}
                </select>
                <InputError message={errors.country_id} className="mt-2" /> {/* Cambia a 'country_id' */}
            </div>

            <div>
                <InputLabel htmlFor="state" value="Estados" />
                <select
                    name="state_id"
                    id="state"
                    className="border-gray-300 w-full dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-3xl shadow-sm"
                    value={data.state_id}
                    onChange={(e) => setData('state_id', parseInt(e.target.value))}
                >
                    {states.map((state) => (
                        <option value={state.id} key={state.id}>
                            {state.state_name}
                        </option>
                    ))}
                </select>
                <InputError message={errors.state_id} className="mt-2" /> {/* Cambia a 'country_id' */}
            </div>

            <div>
                <InputLabel htmlFor="city_id" value="ciudades" />
                <select
                    name="city_id"
                    id="city_id"
                    className="border-gray-300 w-full dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-3xl shadow-sm"
                    value={data.city_id}
                    onChange={(e) => setData('city_id', parseInt(e.target.value))}
                >
                    {cities.map((city) => (
                        <option value={city.id} key={city.id}>
                            {city.city_name}
                        </option>
                    ))}
                </select>
                <InputError message={errors.city_id} className="mt-2" /> {/* Cambia a 'country_id' */}
            </div>
        </>
    );
}