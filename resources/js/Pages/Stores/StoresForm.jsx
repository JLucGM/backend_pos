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
                <InputLabel htmlFor="name" value="Nombre" />
                <TextInput
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('name', e.target.value)}
                />
                <TextDescription>
                    Asegúrate de que sea claro y representativo de tu negocio.
                </TextDescription>
                <InputError message={errors.name} className="mt-2" />
            </div>
            <div>
                <InputLabel htmlFor="phone" value="Teléfono" />
                <TextInput
                    id="phone"
                    type="text"
                    name="phone"
                    value={data.phone}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('phone', e.target.value)}
                />
                {/* <TextDescription>
                    Asegúrate de que sea claro y representativo de tu negocio.
                </TextDescription> */}
                <InputError message={errors.phone} className="mt-2" />
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
                <InputLabel htmlFor="address" value="Dirección" />
                <TextInput
                    id="address"
                    type="text"
                    name="address"
                    value={data.address}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('address', e.target.value)}
                />
                <InputError message={errors.address} className="mt-2" />
            </div>

            <div className="flex items-center space-x-2">
                <InputLabel htmlFor="is_ecommerce_active" value="Tienda en línea activa" />
                <input
                    id="is_ecommerce_active"
                    type="checkbox"
                    name="is_ecommerce_active"
                    checked={data.is_ecommerce_active}
                    onChange={(e) => setData('is_ecommerce_active', e.target.checked)}
                    className="mt-1 block h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <InputError message={errors.is_ecommerce_active} className="mt-2" />
            </div>

            <div className="flex items-center space-x-2">
                <InputLabel htmlFor="allow_delivery" value="Permitir entrega a domicilio" />
                <input
                    id="allow_delivery"
                    type="checkbox"
                    name="allow_delivery"
                    checked={data.allow_delivery}
                    onChange={(e) => setData('allow_delivery', e.target.checked)}
                    className="mt-1 block h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <InputError message={errors.allow_delivery} className="mt-2" />
            </div>

            <div className="flex items-center space-x-2">
                <InputLabel htmlFor="allow_pickup" value="Permitir recogida en tienda" />
                <input
                    id="allow_pickup"
                    type="checkbox"
                    name="allow_pickup"
                    checked={data.allow_pickup}
                    onChange={(e) => setData('allow_pickup', e.target.checked)}
                    className="mt-1 block h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <InputError message={errors.allow_pickup} className="mt-2" />
            </div>

            <div className="flex items-center space-x-2">
                <InputLabel htmlFor="allow_shipping" value="Permitir envíos" />
                <input
                    id="allow_shipping"
                    type="checkbox"
                    name="allow_shipping"
                    checked={data.allow_shipping}
                    onChange={(e) => setData('allow_shipping', e.target.checked)}
                    className="mt-1 block h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <InputError message={errors.allow_shipping} className="mt-2" />
            </div>
        </>
    );
}