import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Select from 'react-select';
import { customStyles } from '@/hooks/custom-select';
import { mapToSelectOptions } from '@/utils/mapToSelectOptions';
import { useMemo } from 'react';

export default function CitiesForm({ data, states, setData, errors }) {
    const stateOptions = useMemo(() => mapToSelectOptions(states, 'id', 'state_name'), [states]);

    return (
        <>
            <div>
                <InputLabel htmlFor="city_name" value="Nombre" />
                <TextInput
                    id="city_name"
                    type="text"
                    name="city_name"
                    value={data.city_name}
                    className="block w-full"
                    isFocused={true}
                    onChange={(e) => setData('city_name', e.target.value)}
                />
                <InputError message={errors.city_name} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="state" value="Estados" />
                <Select
                    name="state_id"
                    id="state_id"
                    options={stateOptions}
                    value={stateOptions.find(option => option.value === data.state_id)}
                    onChange={(selectedOption) => setData('state_id', selectedOption.value)}
                    styles={customStyles}
                />
                <InputError message={errors.state_id} />
            </div>
        </>
    );
}