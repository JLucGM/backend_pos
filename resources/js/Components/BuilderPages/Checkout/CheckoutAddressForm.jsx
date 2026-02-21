import React, { useMemo, useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { toast } from 'sonner';
import Select from 'react-select';
import { customStyles as selectCustomStyles } from '@/hooks/custom-select';
import { getResolvedFont, resolveStyleValue } from '@/utils/themeUtils';

const CheckoutAddressForm = ({
    user,
    location,
    countries = [],
    states = [],
    cities = [],
    onCancel,
    onSuccess,
    themeWithDefaults,
    appliedTheme
}) => {
    const isEditing = !!location;

    // Helper para resolver valores del tema
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    const countryOptions = useMemo(() =>
        countries.map(c => ({ value: c.id, label: c.country_name })),
        [countries]
    );

    const [filteredStates, setFilteredStates] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        address_line_1: location?.address_line_1 || '',
        address_line_2: location?.address_line_2 || '',
        postal_code: location?.postal_code || '',
        phone_number: location?.phone_number || '',
        notes: location?.notes || '',
        country_id: location?.country_id || null,
        state_id: location?.state_id || null,
        city_id: location?.city_id || null,
        is_default: location?.is_default || false,
    });

    useEffect(() => {
        if (data.country_id) {
            const filtered = states.filter(s => s.country_id === data.country_id);
            setFilteredStates(filtered);
            if (!filtered.some(s => s.id === data.state_id)) {
                setData(prev => ({ ...prev, state_id: null, city_id: null }));
            }
        } else {
            setFilteredStates([]);
            setData(prev => ({ ...prev, state_id: null, city_id: null }));
        }
    }, [data.country_id, states]);

    useEffect(() => {
        if (data.state_id) {
            const filtered = cities.filter(c => c.state_id === data.state_id);
            setFilteredCities(filtered);
            if (!filtered.some(c => c.id === data.city_id)) {
                setData(prev => ({ ...prev, city_id: null }));
            }
        } else {
            setFilteredCities([]);
            setData(prev => ({ ...prev, city_id: null }));
        }
    }, [data.state_id, cities]);

    const stateOptions = useMemo(() =>
        filteredStates.map(s => ({ value: s.id, label: s.state_name })),
        [filteredStates]
    );

    const cityOptions = useMemo(() =>
        filteredCities.map(c => ({ value: c.id, label: c.city_name })),
        [filteredCities]
    );

    const handleSubmit = (e) => {
        e.preventDefault();

        const url = isEditing ? `/profile/addresses/${location.id}` : '/profile/addresses';
        const method = isEditing ? 'put' : 'post';

        if (method === 'put') {
            put(url, {
                onSuccess: () => {
                    toast.success('Dirección actualizada correctamente');
                    if (onSuccess) onSuccess();
                },
                onError: (err) => {
                    Object.values(err).forEach(msg => toast.error(msg));
                }
            });
        } else {
            post(url, {
                onSuccess: () => {
                    toast.success('Dirección agregada correctamente');
                    if (onSuccess) onSuccess();
                },
                onError: (err) => {
                    Object.values(err).forEach(msg => toast.error(msg));
                }
            });
        }
    };

    // Estilos del tema
    const labelStyles = {
        color: resolveValue(themeWithDefaults.text),
        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
        marginBottom: '4px',
        display: 'block'
    };

    const inputStyles = {
        backgroundColor: resolveValue(themeWithDefaults.input_background),
        color: resolveValue(themeWithDefaults.text),
        borderColor: resolveValue(themeWithDefaults.input_border),
        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
    };

    const primaryButtonStyles = {
        backgroundColor: resolveValue(themeWithDefaults.primary_button_background),
        color: resolveValue(themeWithDefaults.primary_button_text),
        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
    };

    const outlineButtonStyles = {
        borderColor: resolveValue(themeWithDefaults.borders),
        color: resolveValue(themeWithDefaults.text),
        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
    };

    const selectStyles = {
        ...selectCustomStyles,
        control: (base) => ({
            ...base,
            borderColor: resolveValue(themeWithDefaults.input_border),
            backgroundColor: resolveValue(themeWithDefaults.input_background),
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: resolveValue(themeWithDefaults.background),
        }),
        option: (base, { isFocused }) => ({
            ...base,
            backgroundColor: isFocused ? `${resolveValue(themeWithDefaults.primary_button_background)}20` : 'transparent',
            color: resolveValue(themeWithDefaults.text),
        }),
        singleValue: (base) => ({
            ...base,
            color: resolveValue(themeWithDefaults.text),
        }),
        input: (base) => ({
            ...base,
            color: resolveValue(themeWithDefaults.text),
        }),
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="address_line_1" style={labelStyles}>Dirección principal *</Label>
                    <Input
                        id="address_line_1"
                        value={data.address_line_1}
                        onChange={(e) => setData('address_line_1', e.target.value)}
                        required
                        style={inputStyles}
                    />
                    {errors.address_line_1 && <p className="text-red-500 text-xs mt-1">{errors.address_line_1}</p>}
                </div>
                <div>
                    <Label htmlFor="address_line_2" style={labelStyles}>Dirección secundaria</Label>
                    <Input
                        id="address_line_2"
                        value={data.address_line_2}
                        onChange={(e) => setData('address_line_2', e.target.value)}
                        style={inputStyles}
                    />
                </div>
                <div>
                    <Label htmlFor="postal_code" style={labelStyles}>Código postal</Label>
                    <Input
                        id="postal_code"
                        value={data.postal_code}
                        onChange={(e) => setData('postal_code', e.target.value)}
                        style={inputStyles}
                    />
                </div>
                <div>
                    <Label htmlFor="phone_number" style={labelStyles}>Teléfono</Label>
                    <Input
                        id="phone_number"
                        value={data.phone_number}
                        onChange={(e) => setData('phone_number', e.target.value)}
                        style={inputStyles}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <Label htmlFor="country_id" style={labelStyles}>País</Label>
                    <Select
                        options={countryOptions}
                        value={countryOptions.find(o => o.value === data.country_id)}
                        onChange={(val) => setData('country_id', val?.value || null)}
                        styles={selectStyles}
                        placeholder="País"
                    />
                </div>
                <div>
                    <Label htmlFor="state_id" style={labelStyles}>Estado</Label>
                    <Select
                        options={stateOptions}
                        value={stateOptions.find(o => o.value === data.state_id)}
                        onChange={(val) => setData('state_id', val?.value || null)}
                        styles={selectStyles}
                        placeholder="Estado"
                        isDisabled={!data.country_id}
                    />
                </div>
                <div>
                    <Label htmlFor="city_id" style={labelStyles}>Ciudad</Label>
                    <Select
                        options={cityOptions}
                        value={cityOptions.find(o => o.value === data.city_id)}
                        onChange={(val) => setData('city_id', val?.value || null)}
                        styles={selectStyles}
                        placeholder="Ciudad"
                        isDisabled={!data.state_id}
                    />
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="is_default"
                    checked={data.is_default}
                    onChange={(e) => setData('is_default', e.target.checked)}
                    style={{ accentColor: resolveValue(themeWithDefaults.primary_button_background) }}
                />
                <Label htmlFor="is_default" style={labelStyles}>Dirección principal</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} style={outlineButtonStyles}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={processing} style={primaryButtonStyles}>
                    {processing ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar')}
                </Button>
            </div>
        </form>
    );
};

export default CheckoutAddressForm;
