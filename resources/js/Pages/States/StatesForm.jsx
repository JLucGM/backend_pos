import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function StatesForm({ data, setData, errors, countries }) {
    return (
        <>
            <div>
                <InputLabel htmlFor="state_name" value="Nombre" />
                <TextInput
                    id="state_name"
                    type="text"
                    name="state_name"
                    value={data.state_name}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('state_name', e.target.value)}
                />
                <InputError message={errors.state_name} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="country" value="País" />
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
        </>
    );
}