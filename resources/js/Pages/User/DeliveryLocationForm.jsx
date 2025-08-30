import { useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import Select from 'react-select';
import { customStyles } from '@/hooks/custom-select';
import { Textarea } from '@/Components/ui/textarea';
import { toast } from 'sonner';
import { useEffect, useMemo, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Checkbox from '@/Components/Checkbox';
import { mapToSelectOptions } from '@/utils/mapToSelectOptions';

export default function DeliveryLocationForm({ user, location, countries, states, cities, onCancel, onSuccess }) {
    
    const [filteredStates, setFilteredStates] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const isEditing = location && location.id;
    const countryOptions = useMemo(() => mapToSelectOptions(countries, 'id', 'country_name'), [countries]);
    const stateOptions = useMemo(() => mapToSelectOptions(filteredStates, 'id', 'state_name'), [filteredStates]);
    const cityOptions = useMemo(() => mapToSelectOptions(filteredCities, 'id', 'city_name'), [filteredCities]);

    const { data, setData, post, put, errors, processing, reset } = useForm({
        address_line_1: location?.address_line_1 || '',
        address_line_2: location?.address_line_2 || '',
        postal_code: location?.postal_code || '',
        phone_number: location?.phone_number || '',
        notes: location?.notes || '',
        country_id: location?.country_id || null, // Usar null como valor por defecto para los selects
        state_id: location?.state_id || null,
        city_id: location?.city_id || null,
        is_default: !!location?.is_default,
    });

    useEffect(() => {
        if (data.country_id) {
            const statesForCountry = states.filter(state => state.country_id === data.country_id);
            setFilteredStates(statesForCountry);

            if (!statesForCountry.some(state => state.id === data.state_id)) {
                setData(data => ({ ...data, state_id: null, city_id: null }));
            }
        } else {
            setFilteredStates([]);
            setData(data => ({ ...data, state_id: null, city_id: null }));
        }
    }, [data.country_id, states]);

    useEffect(() => {
        if (data.state_id) {
            const citiesForState = cities.filter(city => city.state_id === data.state_id);
            setFilteredCities(citiesForState);

            if (!citiesForState.some(city => city.id === data.city_id)) {
                setData(data => ({ ...data, city_id: null }));
            }
        } else {
            setFilteredCities([]);
            setData(data => ({ ...data, city_id: null }));
        }
    }, [data.state_id, cities]);


    const handleSubmit = (e) => {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Dirección ${isEditing ? 'actualizada' : 'creada'} con éxito.`);
                if (onSuccess) onSuccess();
                if (!isEditing) reset();
            },
            onError: (formErrors) => {
                toast.error(`Error al ${isEditing ? 'actualizar' : 'crear'} la dirección.`);
                console.error(formErrors);
            },
        };

        if (isEditing) {
            put(route('user.deliveryLocation.update', { user: user.slug, deliveryLocation: location.id }), options);
        } else {
            post(route('user.deliveryLocation.store', { user: user.slug }), options);
        }
    };

    return (

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Línea de Dirección 1 */}
                <div>
                    <InputLabel htmlFor={`address_line_1_${location?.id || 'new'}`} value="Dirección" />
                    <Input
                        id={`address_line_1_${location?.id || 'new'}`}
                        value={data.address_line_1}
                        onChange={(e) => setData('address_line_1', e.target.value)}
                    />
                    <InputError message={errors.address_line_1} className="mt-2" />
                </div>
                {/* Apartamento */}
                <div>
                    <InputLabel htmlFor={`address_line_2_${location?.id || 'new'}`} value="Apartamento, suite, etc." />
                    <Input
                        id={`address_line_2_${location?.id || 'new'}`}
                        value={data.address_line_2}
                        onChange={(e) => setData('address_line_2', e.target.value)}
                    />
                    <InputError message={errors.address_line_2} className="mt-2" />
                </div>
                {/* Código Postal */}
                <div>
                    <InputLabel htmlFor={`postal_code_${location?.id || 'new'}`} value="Código Postal" />
                    <Input
                        id={`postal_code_${location?.id || 'new'}`}
                        value={data.postal_code}
                        onChange={(e) => setData('postal_code', e.target.value)}
                    />
                    <InputError message={errors.postal_code} className="mt-2" />
                </div>
                {/* Número de Teléfono */}
                <div>
                    <InputLabel htmlFor={`phone_number_${location?.id || 'new'}`} value="Teléfono" />
                    <Input
                        id={`phone_number_${location?.id || 'new'}`}
                        value={data.phone_number}
                        onChange={(e) => setData('phone_number', e.target.value)}
                    />
                    <InputError message={errors.phone_number} className="mt-2" />
                </div>
            </div>
            {/* País, Estado, Ciudad s*/}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <InputLabel htmlFor="country_id" value="País" />
                    <Select
                        name="country_id"
                        id="country_id"
                        options={countryOptions}
                        value={countryOptions.find(option => option.value === data.country_id)}
                        onChange={(selectedOption) => setData('country_id', selectedOption.value)}
                        styles={customStyles}
                    />
                    <InputError message={errors.country_id} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="state_id" value="Estado" />
                    <Select
                        name="state_id"
                        id="state_id"
                        options={stateOptions}
                        value={stateOptions.find(option => option.value === data.state_id)}
                        onChange={(selectedOption) => setData('state_id', selectedOption.value)}
                        styles={customStyles}
                    />
                    <InputError message={errors.state_id} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="city_id" value="Ciudad" />
                    <Select
                        name="city_id"
                        id="city_id"
                        options={cityOptions}
                        value={cityOptions.find(option => option.value === data.city_id)}
                        onChange={(selectedOption) => setData('city_id', selectedOption.value)}
                        styles={customStyles}
                    />
                    <InputError message={errors.city_id} className="mt-2" />
                </div>
            </div>
            {/* Notas */}
            <div>
                <InputLabel htmlFor={`notes_${location?.id || 'new'}`} value="Notas Adicionales" />
                <Textarea
                    id={`notes_${location?.id || 'new'}`}
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                />
                <InputError message={errors.notes} className="mt-2" />
            </div>

            {/* Checkbox para dirección por defecto */}
            <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                    id={`is_default_${location?.id || 'new'}`}
                    checked={data.is_default}
                    onChange={(e) => setData('is_default', e.target.checked)} // Cambia onCheckedChange a onChange
                />

                <label
                    htmlFor={`is_default_${location?.id || 'new'}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Marcar como dirección de envío por defecto
                </label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
                <Button type="submit" disabled={processing}>
                    {processing ? 'Guardando...' : 'Guardar Dirección'}
                </Button>
            </div>
        </form>
    );
}