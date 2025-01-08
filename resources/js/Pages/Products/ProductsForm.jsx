import Select from 'react-select';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Button, buttonVariants } from '@/Components/ui/button';
import { Link } from '@inertiajs/react';

export default function ProductsForm({ data, taxes, categories, addAttribute, handleAttributeChange, setData, errors, handleAttributeValueChange, addAttributeValue }) {
    // Mapeamos las categorías para que sean compatibles con react-select
    const categoryOptions = categories.map(category => ({
        value: category.id,
        label: category.category_name
    }));

    // Función para manejar el cambio en el select
    const handleCategoryChange = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setData('categories', selectedValues);
    };

    // Mapeamos las categorías seleccionadas para react-select
    const selectedCategories = categoryOptions.filter(option => data.categories.includes(option.value));

    return (
        <>
            <div>
                <InputLabel htmlFor="product_name" value="Nombre" />
                <TextInput
                    id="product_name"
                    type="text"
                    name="product_name"
                    value={data.product_name}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('product_name', e.target.value)}
                />
                <InputError message={errors.product_name} />
            </div>
            <div>
                <InputLabel htmlFor="product_price" value="Precio" />
                <TextInput
                    id="product_price"
                    type="text"
                    name="product_price"
                    value={data.product_price}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('product_price', e.target.value)}
                />
                <InputError message={errors.product_price} />
            </div>
            <div>
                <InputLabel htmlFor="product_description" value="Descripción" />
                <TextInput
                    id="product_description"
                    type="text"
                    name="product_description"
                    value={data.product_description}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('product_description', e.target.value)}
                />
                <InputError message={errors.product_description} />
            </div>

            <div>
                <InputLabel htmlFor="tax_id" value="Impuesto" />
                <select
                    name="tax_id"
                    id="tax_id"
                    className="border-gray-300 w-full dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-3xl shadow-sm"
                    value={data.tax_id}
                    onChange={(e) => setData('tax_id', parseInt(e.target.value))}
                >
                    {taxes.map((tax) => (
                        <option value={tax.id} key={tax.id}>
                            {tax.tax_name}
                        </option>
                    ))}
                </select>
                <InputError message={errors.tax_id} className="mt-2" />
            </div>

            <div>
                <InputLabel value="Categorías" />
                <Select
                    isMulti
                    options={categoryOptions}
                    onChange={handleCategoryChange}
                    value={selectedCategories} // Establece el valor seleccionado
                    className="mt-1"
                />
                <InputError message={errors.categories} />
            </div>

            <div>
                <InputLabel value="Atributos" />
                {data.attribute_names.map((attribute, index) => (
                    <div key={index} className="mb-4">
                        <TextInput
                            id={`attribute_name_${index}`}
                            type="text"
                            value={attribute}
                            onChange={(e) => handleAttributeChange(index, e.target.value)}
                            placeholder="Nombre del atributo"
                        />
                        <InputError message={errors.attribute_names?.[index]} />

                        <InputLabel value="Valores" />
                        {data.attribute_values[index]?.map((value, valueIndex) => (
                            <div key={valueIndex} className="flex items-center mb-2 w-full">
                                <TextInput
                                    id={`attribute_value_${index}_${valueIndex}`}
                                    type="text"
                                    value={value}
                                    onChange={(e) => handleAttributeValueChange(index, valueIndex, e.target.value)}
                                    placeholder="Valor del atributo"
                                    className="w-full"
                                />
                                <InputError message={errors.attribute_values?.[index]?.[valueIndex]} />
                            </div>
                        ))}

                        <Button  type="button" onClick={() => addAttributeValue(index)}>
                            Agregar Valor
                        </Button>
                    </div>
                ))}
                <Button variant="link" type="button" onClick={addAttribute}>
                    Agregar Atributo
                </Button>

            </div>

        </>
    );
}