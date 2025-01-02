import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function CitiesForm({ data, states, setData, errors }) {
    return (
        <>
            <div>
                <InputLabel htmlFor="city_name" value="Nombre" />
                <TextInput
                    id="city_name"
                    type="text"
                    name="city_name"
                    value={data.city_name}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('city_name', e.target.value)}
                />
                <InputError message={errors.city_name} className="mt-2" />
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
        </>
    );
}