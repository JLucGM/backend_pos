import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { useEffect, useMemo } from 'react';
import Select from 'react-select';
import { customStyles } from '@/hooks/custom-select';
import { DatePicker } from '@/Components/DatePicker';
import { mapToSelectOptions } from '@/utils/mapToSelectOptions';

export default function DiscountsForm({ data, products, categories, setData, errors, isEdit = false }) {
    const handleSelectChange = (selectedOptions, name) => {
        if (name === 'product_selections') {
            // Para products: Array de {product_id, combination_id}
            const values = selectedOptions ? selectedOptions.map(option => ({
                product_id: option.product_id,
                combination_id: option.combination_id
            })) : [];
            setData(name, values);
        } else {
            // Para category_ids: Array de IDs
            const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
            setData(name, values);
        }
    };

    const handleSingleSelectChange = (selectedOption, name) => {
        const value = selectedOption ? selectedOption.value : null;
        setData(name, value);
    };

    const categoryOptions = useMemo(() => mapToSelectOptions(categories, 'id', 'category_name'), [categories]);

    // Options flat: Simples + Variaciones individuales
    const productOptions = useMemo(() => {
        const options = [];

        products.forEach(product => {
            // Simple (sin combinations)
            if (!product.combinations || product.combinations.length === 0) {
                options.push({
                    value: `simple_${product.id}`,
                    label: `${product.product_name} - $${parseFloat(product.product_price).toFixed(2)}`,
                    product_id: product.id,
                    combination_id: null,
                });
            } else {
                // Variables: Cada combination individual
                product.combinations.forEach(comb => {
                    let attributes = '';
                    if (comb.combination_attribute_value && Array.isArray(comb.combination_attribute_value)) {
                        attributes = comb.combination_attribute_value.map(cav => 
                            `${cav.attribute_value.attribute.attribute_name}: ${cav.attribute_value.attribute_value_name}`
                        ).join(', ');
                        attributes = attributes ? ` - ${attributes}` : '';
                    }
                    const price = comb.combination_price ? ` - $${parseFloat(comb.combination_price).toFixed(2)}` : '';

                    options.push({
                        value: `comb_${comb.id}`,
                        label: `${product.product_name}${attributes}${price}`,
                        product_id: product.id,
                        combination_id: comb.id,
                    });
                });
            }
        });

        return options;
    }, [products]);

    // Value para product_selections (funciona en edit con datos cargados)
    const getProductSelectionsValue = () => {
        if (!data.product_selections || !Array.isArray(data.product_selections)) return [];
        return data.product_selections.map(sel => productOptions.find(opt => 
            opt.product_id === sel.product_id && opt.combination_id === sel.combination_id
        )).filter(Boolean);
    };

    const appliesToOptions = [
        { value: 'product', label: 'Producto' },
        { value: 'category', label: 'Categoría' },
        { value: 'order_total', label: 'Total del pedido' },
    ];

    const automaticOptions = [
        { value: true, label: 'Descuento Automático' },
        { value: false, label: 'Descuento por código' },
    ];

    const statusOptions = [
        { value: true, label: 'Activo' },
        { value: false, label: 'Inactivo' },
    ];

    const handleStatusChange = (selectedOption) => {
        setData('is_active', selectedOption.value);
    };

    // Limpia al cambiar applies_to (en edit, preserva si no cambia)
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
            <div className="mt-4">
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
                    className="mt-1 block w-full"
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
                        className="mt-1 block w-full"
                        onChange={e => setData('code', e.target.value)}
                    />
                    <InputError message={errors.code} className="mt-2" />
                </div>
            )}

            <div className="mt-4">
                <InputLabel htmlFor="description" value="Descripción" />
                <TextInput
                    id="description"
                    value={data.description}
                    className="mt-1 block w-full"
                    onChange={e => setData('description', e.target.value)}
                />
                <InputError message={errors.description} className="mt-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="mt-4">
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

                <div className="mt-4">
                    <InputLabel htmlFor="value" value="Valor" />
                    <TextInput
                        id="value"
                        value={data.value}
                        className="mt-1 block w-full"
                        onChange={e => setData('value', e.target.value)}
                    />
                    <InputError message={errors.value} className="mt-2" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="mt-4">
                    <InputLabel htmlFor="start_date" value="Fecha de inicio" />
                    <DatePicker
                        selectedDate={data.start_date ? new Date(data.start_date) : undefined}
                        onDateChange={date => setData('start_date', date)}
                    />
                    <InputError message={errors.start_date} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="end_date" value="Fecha de finalización" />
                    <DatePicker
                        selectedDate={data.end_date ? new Date(data.end_date) : undefined}
                        onDateChange={date => setData('end_date', date)}
                    />
                    <InputError message={errors.end_date} className="mt-2" />
                </div>
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="is_active" value="Estado" />
                <Select
                    id="is_active"
                    options={statusOptions}
                    value={statusOptions.find(opt => opt.value === data.is_active)}
                    onChange={handleStatusChange}
                    styles={customStyles}
                    placeholder="Seleccionar estado..."
                />
                <InputError message={errors.is_active} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="usage_limit" value="Límite de uso" />
                <TextInput
                    id="usage_limit"
                    type="number"
                    value={data.usage_limit}
                    className="mt-1 block w-full"
                    onChange={e => setData('usage_limit', e.target.value)}
                />
                <InputError message={errors.usage_limit} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="minimum_order_amount" value="Compra mínima" />
                <TextInput
                    id="minimum_order_amount"
                    type="number"
                    value={data.minimum_order_amount}
                    className="mt-1 block w-full"
                    onChange={e => setData('minimum_order_amount', e.target.value)}
                />
                <InputError message={errors.minimum_order_amount} className="mt-2" />
            </div>

            <div className="mt-4">
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
                    <InputLabel htmlFor="product_selections" value="Productos y Variaciones" />
                    <p className="text-sm text-gray-600 mb-2">Selecciona productos simples o variaciones específicas (cada variación se lista por separado).</p>
                    <Select
                        id="product_selections"
                        options={productOptions}
                        isMulti
                        value={getProductSelectionsValue()}
                        onChange={opts => handleSelectChange(opts, 'product_selections')}
                        styles={customStyles}
                        placeholder="Busca y selecciona (e.g., Pantalon - Talla S, Color Rojo - $10.00)..."
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
        </>
    );
}
