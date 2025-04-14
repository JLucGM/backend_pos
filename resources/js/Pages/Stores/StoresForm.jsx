import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Select from 'react-select';
import { customStyles } from '@/hooks/custom-select';
import { useEffect, useState } from 'react';
import TextDescription from '@/Components/TextDescription';

export default function StoresForm({ data, countries, states, cities, setData, errors }) {
    const [filteredStates, setFilteredStates] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);

    // Efecto para filtrar estados cuando cambia el país
    useEffect(() => {
        if (data.country_id) {
            const statesForCountry = states.filter(state => state.country_id === data.country_id);
            setFilteredStates(statesForCountry);

            // Si el state_id actual no está en los estados filtrados, reiniciar
            if (!statesForCountry.find(state => state.id === data.state_id)) {
                setData('state_id', null);
                setData('city_id', null); // Reiniciar ciudad si el estado no es válido
            }
        } else {
            setFilteredStates([]);
            setData('state_id', null);
            setData('city_id', null);
        }
    }, [data.country_id, states, setData]);

    // Efecto para filtrar ciudades cuando cambia el estado
    useEffect(() => {
        if (data.state_id) {
            const citiesForState = cities.filter(city => city.state_id === data.state_id);
            setFilteredCities(citiesForState);

            // Si el city_id actual no está en las ciudades filtradas, reiniciar
            if (!citiesForState.find(city => city.id === data.city_id)) {
                setData('city_id', null); // Reiniciar ciudad si no es válida
            }
        } else {
            setFilteredCities([]);
            setData('city_id', null);
        }
    }, [data.state_id, cities, setData]);

    return (
        <>
            <TextDescription>
                Estos datos podrían estar disponibles públicamente. No utilice su información personal.
            </TextDescription>
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
                <TextDescription>
                    Asegúrate de que sea claro y representativo de tu negocio.
                </TextDescription>
                <InputError message={errors.store_name} className="mt-2" />
            </div>
            <div>
                <InputLabel htmlFor="store_phone" value="Teléfono" />
                <TextInput
                    id="store_phone"
                    type="text"
                    name="store_phone"
                    value={data.store_phone}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('store_phone', e.target.value)}
                />
                {/* <TextDescription>
                    Asegúrate de que sea claro y representativo de tu negocio.
                </TextDescription> */}
                <InputError message={errors.store_phone} className="mt-2" />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <InputLabel htmlFor="country_id" value="Países" />
                    <Select
                        name="country_id"
                        id="country_id"
                        options={countries.map(country => ({ value: country.id, label: country.country_name }))}
                        value={countries.find(country => country.id === data.country_id) ? { value: data.country_id, label: countries.find(country => country.id === data.country_id).country_name } : null}
                        onChange={(selectedOption) => setData('country_id', selectedOption ? selectedOption.value : null)}
                        styles={customStyles}
                    />
                    <InputError message={errors.country_id} className="mt-2" /> {/* Cambia a 'country_id' */}
                </div>

                <div>
                    <InputLabel htmlFor="state_id" value="Estados" />
                    <Select
                        name="state_id"
                        id="state_id"
                        options={filteredStates.map(state => ({ value: state.id, label: state.state_name }))}
                        value={filteredStates.find(state => state.id === data.state_id) ? { value: data.state_id, label: filteredStates.find(state => state.id === data.state_id).state_name } : null}
                        onChange={(selectedOption) => setData('state_id', selectedOption ? selectedOption.value : null)}
                        styles={customStyles}
                    />
                    <InputError message={errors.state_id} className="mt-2" /> {/* Cambia a 'country_id' */}
                </div>

                <div>
                    <InputLabel htmlFor="city_id" value="Ciudades" />
                    <Select
                        name="city_id"
                        id="city_id"
                        options={filteredCities.map(city => ({ value: city.id, label: city.city_name }))}
                        value={filteredCities.find(city => city.id === data.city_id) ? { value: data.city_id, label: filteredCities.find(city => city.id === data.city_id).city_name } : null}
                        onChange={(selectedOption) => setData('city_id', selectedOption ? selectedOption.value : null)}
                        styles={customStyles}
                    />
                    <InputError message={errors.city_id} className="mt-2" /> {/* Cambia a 'country_id' */}
                </div>
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
        </>
    );
}