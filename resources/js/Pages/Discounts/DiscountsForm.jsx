import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { customStyles } from '@/hooks/custom-select';
import { useSelectOptions } from '@/hooks/useSelectOptions';
import { Calendar } from '@/Components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from '@/Components/ui/button';
import DivSection from '@/Components/ui/div-section';

export default function DiscountsForm({ data, products, categories, setData, errors, isEdit = false }) {

    const { statusOptions, productOptions, categoryOptions, appliesToOptions, automaticOptions } = useSelectOptions(categories, [], products);  // taxes vacío si no las usas

    // Estado local para el rango de fechas
    const [dateRange, setDateRange] = useState({
        from: data.start_date ? new Date(data.start_date) : undefined,
        to: data.end_date ? new Date(data.end_date) : undefined,
    });
    // Sincroniza dateRange con data.start_date y data.end_date
    useEffect(() => {
        setData('start_date', dateRange.from ? dateRange.from.toISOString().split('T')[0] : null);  // Formato YYYY-MM-DD
        setData('end_date', dateRange.to ? dateRange.to.toISOString().split('T')[0] : null);
    }, [dateRange, setData]);
    // Inicializa dateRange cuando data cambie (útil en modo edición)
    useEffect(() => {
        setDateRange({
            from: data.start_date ? new Date(data.start_date) : undefined,
            to: data.end_date ? new Date(data.end_date) : undefined,
        });
    }, [data.start_date, data.end_date]);

    const handleSelectChange = (selectedOptions, name) => {
        if (name === 'product_selections') {
            const values = selectedOptions ? selectedOptions.map(option => ({
                product_id: option.product_id,
                combination_id: option.combination_id
            })) : [];
            setData(name, values);
        } else {
            const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
            setData(name, values);
        }
    };
    const handleSingleSelectChange = (selectedOption, name) => {
        const value = selectedOption ? selectedOption.value : null;
        setData(name, value);
    };

    const getProductSelectionsValue = () => {
        if (!data.product_selections || !Array.isArray(data.product_selections)) return [];
        return data.product_selections.map(sel => productOptions.find(opt =>
            opt.product_id === sel.product_id && opt.combination_id === sel.combination_id
        )).filter(Boolean);
    };

    useEffect(() => {
        if (data.applies_to === 'product') {
            setData('category_ids', []);
        } else if (data.applies_to === 'category') {
            setData('product_selections', []);
        } else {
            setData('product_selections', []);
            setData('category_ids', []);
        }
    }, [data.applies_to, setData]);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="col-span-1 md:col-span-2">
                    <DivSection>
                        <div className="mb-4">
                            <InputLabel htmlFor="automatic">Método</InputLabel>
                            <Select
                                id="automatic"
                                options={automaticOptions}
                                value={automaticOptions.find(opt => opt.value === data.automatic)}
                                onChange={opt => setData('automatic', opt.value)}
                                styles={customStyles}
                            />
                            <InputError message={errors.automatic} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="name" value="Nombre" />
                            <TextInput
                                id="name"
                                value={data.name}
                                className="block w-full"
                                isFocused={!isEdit}
                                onChange={e => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        {!data.automatic && (
                            <div>
                                <InputLabel htmlFor="code" value="Código" />
                                <TextInput
                                    id="code"
                                    value={data.code}
                                    className="block w-full"
                                    onChange={e => setData('code', e.target.value)}
                                />
                                {/* <InputLabel htmlFor="code" value="Los clientes deben introducir este código al finalizar la compra." className='text-gray-200 text-sm'/> */}
                                <InputError message={errors.code} className="mt-2" />
                            </div>
                        )}

                        <div className="mb-4">
                            <InputLabel htmlFor="description" value="Descripción" />
                            <TextInput
                                id="description"
                                value={data.description}
                                className="block w-full"
                                onChange={e => setData('description', e.target.value)}
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>
                        </DivSection>
                        <DivSection>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="mb-4">
                                <InputLabel htmlFor="discount_type" value="Tipo de descuento" />
                                <Select
                                    id="discount_type"
                                    options={[
                                        { value: 'percentage', label: 'Porcentaje' },
                                        { value: 'fixed_amount', label: 'Monto fijo' },
                                    ]}
                                    value={{ value: data.discount_type, label: data.discount_type === 'percentage' ? 'Porcentaje' : 'Monto fijo' }}
                                    onChange={opt => setData('discount_type', opt.value)}
                                    styles={customStyles}
                                />
                                <InputError message={errors.discount_type} className="mt-2" />
                            </div>

                            <div className="mb-4">
                                <InputLabel htmlFor="value" value="Valor" />
                                <TextInput
                                    id="value"
                                    value={data.value}
                                    className="block w-full"
                                    onChange={e => setData('value', e.target.value)}
                                />
                                <InputError message={errors.value} className="mt-2" />
                            </div>
                        </div>
<div className="mb-4">
                            <InputLabel htmlFor="applies_to" value="Aplica a" />
                            <Select
                                id="applies_to"
                                options={appliesToOptions}
                                value={appliesToOptions.find(opt => opt.value === data.applies_to)}
                                onChange={opt => handleSingleSelectChange(opt, 'applies_to')}
                                styles={customStyles}
                            />
                            <InputError message={errors.applies_to} className="mt-2" />
                        </div>

                        {data.applies_to === 'product' && (
                            <div className="mt-4">
                                <InputLabel htmlFor="product_selections" value="Productos" />
                                <Select
                                    id="product_selections"
                                    options={productOptions}
                                    isMulti
                                    value={getProductSelectionsValue()}
                                    onChange={opts => handleSelectChange(opts, 'product_selections')}
                                    styles={customStyles}
                                    placeholder="Selecciona productos..."
                                />
                                <InputError message={errors.product_selections} className="mt-2" />
                            </div>
                        )}

                        {data.applies_to === 'category' && (
                            <div className="mt-4">
                                <InputLabel htmlFor="category_ids" value="Categorías" />
                                <Select
                                    id="category_ids"
                                    options={categoryOptions}
                                    isMulti
                                    value={data.category_ids.map(id => categoryOptions.find(opt => opt.value === id))}
                                    onChange={opts => handleSelectChange(opts, 'category_ids')}
                                    styles={customStyles}
                                    placeholder="Selecciona categorías..."
                                />
                                <InputError message={errors.category_ids} className="mt-2" />
                            </div>
                        )}
                        </DivSection>
                        <DivSection>
                        <div className="mb-4">
                            <InputLabel value="Rango de fechas (Inicio - Fin)" />
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        {dateRange.from ? (
                                            dateRange.to ? (
                                                `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                                            ) : (
                                                dateRange.from.toLocaleDateString()
                                            )
                                        ) : (
                                            "Seleccionar rango de fechas"
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="range"
                                        selected={dateRange}
                                        onSelect={setDateRange}
                                        numberOfMonths={2}
                                        initialFocus  // Foco automático en el calendario al abrir
                                    />
                                </PopoverContent>
                            </Popover>
                            <InputError message={errors.start_date || errors.end_date} className="mt-2" />
                        </div>



                        <div className="mt-4">
                            <InputLabel htmlFor="usage_limit" value="Límite de uso" />
                            <TextInput
                                id="usage_limit"
                                type="number"
                                value={data.usage_limit}
                                className="block w-full"
                                onChange={e => setData('usage_limit', e.target.value)}
                            />
                            <InputError message={errors.usage_limit} className="mt-2" />
                        </div>

                        <div className="mb-4">
                            <InputLabel htmlFor="minimum_order_amount" value="Compra mínima" />
                            <TextInput
                                id="minimum_order_amount"
                                type="number"
                                value={data.minimum_order_amount}
                                className="block w-full"
                                onChange={e => setData('minimum_order_amount', e.target.value)}
                            />
                            <InputError message={errors.minimum_order_amount} className="mt-2" />
                        </div>

                        
                    </DivSection>
                </div>

                <div className="">
                    <DivSection>

                        <InputLabel htmlFor="is_active" value="Estado" />
                        <Select
                            options={statusOptions}
                            name="is_active"
                            value={statusOptions.find(option => option.value === Number(data.is_active))}
                            onChange={(selectedOption) => setData('is_active', selectedOption.value)}
                            styles={customStyles} // si usas estilos personalizados
                            className="mt-1"
                        />
                        <InputError message={errors.is_active} className="mt-2" />
                    </DivSection>
                </div>

            </div>
        </>
    );
}
