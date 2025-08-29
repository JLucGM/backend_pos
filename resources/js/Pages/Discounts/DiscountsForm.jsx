import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { useEffect, useMemo } from 'react';
import Select from 'react-select';
import { customStyles } from '@/hooks/custom-select';
import { DatePicker } from '@/Components/DatePicker';
import { mapToSelectOptions } from '@/utils/mapToSelectOptions';

export default function DiscountsForm({ data, products, categories, setData, errors }) {
    const handleSelectChange = (selectedOptions, name) => {
        const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setData(name, values);
    };

    const handleSingleSelectChange = (selectedOption, name) => {
        const value = selectedOption ? selectedOption.value : null;
        setData(name, value);
    };

    const categoryOptions = useMemo(() => mapToSelectOptions(categories, 'id', 'category_name'), [categories]);
    const productOptions = useMemo(() => mapToSelectOptions(products, 'id', 'product_name'), [products]);

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
        setData('is_active', selectedOption ? selectedOption.value : null);
    };

    // Efecto para limpiar los IDs de productos o categorías si se cambia la opción de aplicación
    useEffect(() => {
        if (data.applies_to === 'product') {
            setData('category_ids', []); // Limpiar categorías si se selecciona producto
        } else if (data.applies_to === 'category') {
            setData('product_ids', []); // Limpiar productos si se selecciona categoría
        }
    }, [data.applies_to, setData]);

    return (
        <>
            <div className="mt-4">
                <InputLabel htmlFor="automatic">Método</InputLabel>
                <Select
                    id="automatic"
                    name="automatic"
                    options={automaticOptions}
                    value={automaticOptions.find(option => option.value === data.automatic)}
                    onChange={(selectedOption) => setData('automatic', selectedOption.value)}
                    className="mt-1 block w-full"
                    styles={customStyles}
                />
                <InputError message={errors.automatic} className="mt-2" />
            </div>

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
                <InputError message={errors.name} className="mt-2" />
            </div>

            {/* Condición para mostrar el campo de código solo si no es automático */}
            {!data.automatic && (
                <div>
                    <InputLabel htmlFor="code" value="Código" />
                    <TextInput
                        id="code"
                        type="text"
                        name="code"
                        value={data.code}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData('code', e.target.value)}
                    />
                    <InputError message={errors.code} className="mt-2" />
                </div>
            )}

            <div className="mt-4">
                <InputLabel htmlFor="description" value="Descripción" />
                <TextInput
                    id="description"
                    type="text"
                    name="description"
                    value={data.description}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('description', e.target.value)}
                />
                <InputError message={errors.description} className="mt-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="mt-4">
                    <InputLabel htmlFor="discount_type" value="Tipo de descuento" />
                    <Select
                        id="discount_type"
                        name="discount_type"
                        styles={customStyles}
                        options={[
                            { value: 'percentage', label: 'Porcentaje' },
                            { value: 'fixed_amount', label: 'Monto fijo' },
                        ]}
                        value={{ value: data.discount_type, label: data.discount_type === 'percentage' ? 'Porcentaje' : 'Monto fijo' }}
                        onChange={(option) => setData('discount_type', option.value)}
                        className="mt-1 block w-full"
                    />
                    <InputError message={errors.discount_type} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="value" value="Valor" />
                    <TextInput
                        id="value"
                        type="text"
                        name="value"
                        value={data.value}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('value', e.target.value)}
                    />
                    <InputError message={errors.value} className="mt-2" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="mt-4">
                    <InputLabel htmlFor="start_date" value="Fecha de inicio" />
                    <DatePicker
                        selectedDate={data.start_date ? new Date(data.start_date) : undefined}
                        onDateChange={(date) => setData('start_date', date)}
                    />
                    <InputError message={errors.start_date} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="end_date" value="Fecha de finalización" />
                    <DatePicker
                        selectedDate={data.end_date ? new Date(data.end_date) : undefined}
                        onDateChange={(date) => setData('end_date', date)}
                    />
                    <InputError message={errors.end_date} className="mt-2" />
                </div>
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="is_active" value="Estado" />
                <Select
                    id="is_active"
                    name="is_active"
                    options={statusOptions}
                    value={statusOptions.find(option => option.value === data.is_active)} // Asegúrate de que esto esté correcto
                    onChange={handleStatusChange}
                    styles={customStyles}
                    placeholder="Seleccionar estado..."
                    isClearable={false}
                />
                <InputError message={errors.is_active} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="usage_limit" value="Límite de uso" />
                <TextInput
                    id="usage_limit"
                    type="number"
                    name="usage_limit"
                    value={data.usage_limit}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('usage_limit', e.target.value)}
                />
                <InputError message={errors.usage_limit} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="minimum_order_amount" value="Compra mínima" />
                <TextInput
                    id="minimum_order_amount"
                    type="number"
                    name="minimum_order_amount"
                    value={data.minimum_order_amount}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('minimum_order_amount', e.target.value)}
                />
                <InputError message={errors.minimum_order_amount} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="applies_to" value="Aplica a" />
                <Select
                    id="applies_to"
                    name="applies_to"
                    options={appliesToOptions}
                    value={appliesToOptions.find(option => option.value === data.applies_to)}
                    onChange={(selectedOption) => handleSingleSelectChange(selectedOption, 'applies_to')}
                    className="mt-1 block w-full"
                    styles={customStyles}
                />
                <InputError message={errors.applies_to} className="mt-2" />
            </div>

            {data.applies_to === 'product' && (
                <div className="mt-4">
                    <InputLabel htmlFor="product_ids" value="Productos" />
                    <Select
                        id="product_ids"
                        name="product_ids"
                        options={productOptions}
                        isMulti
                        value={data.product_ids.map(id => productOptions.find(option => option.value === id))}
                        onChange={(selectedOptions) => handleSelectChange(selectedOptions, 'product_ids')}
                        className="mt-1 block w-full"
                        styles={customStyles}
                    />
                    <InputError message={errors.product_ids} className="mt-2" />
                </div>
            )}

            {data.applies_to === 'category' && (
                <div className="mt-4">
                    <InputLabel htmlFor="category_ids" value="Categorías" />
                    <Select
                        id="category_ids"
                        name="category_ids"
                        options={categoryOptions}
                        isMulti
                        value={data.category_ids.map(id => categoryOptions.find(option => option.value === id))}
                        onChange={(selectedOptions) => handleSelectChange(selectedOptions, 'category_ids')}
                        className="mt-1 block w-full"
                        styles={customStyles}
                    />
                    <InputError message={errors.category_ids} className="mt-2" />
                </div>
            )}
        </>
    );
}
