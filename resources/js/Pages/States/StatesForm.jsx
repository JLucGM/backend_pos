import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Select from 'react-select';
import { customStyles } from '@/hooks/custom-select';
import { mapToSelectOptions } from '@/utils/mapToSelectOptions';
import { useMemo } from 'react';

export default function StatesForm({ data, setData, errors, countries }) {

    const countryOptions = useMemo(() => mapToSelectOptions(countries, 'id', 'country_name'), [countries]);

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
                <Select
                    name="country_id"
                    id="country_id"
                    options={countryOptions}
                    value={countryOptions.find(option => option.value === data.country_id)}
                    onChange={(selectedOption) => setData('country_id', selectedOption.value)}
                    styles={customStyles}
                />
                <InputError message={errors.country_id} className="mt-2" /> {/* Cambia a 'country_id' */}
            </div>
        </>
    );
}