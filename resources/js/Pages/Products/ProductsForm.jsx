import Select from 'react-select';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import DivSection from '@/Components/ui/div-section';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function ProductsForm({ data, taxes, categories, stores, combinationsWithPrices = "", setData, errors }) {
    const categoryOptions = categories.map(category => ({
        value: category.id,
        label: category.category_name
    }));

    const [prices, setPrices] = useState({});
    // Inicializa el estado de precios con los valores existentes
    useEffect(() => {
        setPrices(combinationsWithPrices);
        // console.log("Combinaciones con precios antes de la asignación:", combinationsWithPrices);
    }, [combinationsWithPrices]);

    

    const handleCategoryChange = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setData('categories', selectedValues);
    };

    const addAttribute = () => {
        if (data.attribute_names.length < 3) {
            setData('attribute_names', [...data.attribute_names, ""]);
            setData('attribute_values', [...data.attribute_values, [""]]);
        } else {
            toast("No puedes agregar más de 3 atributos.", {
                description: "Límite alcanzado.",
            });
        }
    };

    const handleAttributeChange = (index, value) => {
        const newAttributes = [...data.attribute_names];
        newAttributes[index] = value;
        setData('attribute_names', newAttributes);
    };

    const handleAttributeValueChange = (attributeIndex, valueIndex, value) => {
        const newValues = [...data.attribute_values];
        newValues[attributeIndex][valueIndex] = value;
        setData('attribute_values', newValues);
    };

    const addAttributeValue = (index) => {
        const newValues = [...data.attribute_values];
        newValues[index].push("");
        setData('attribute_values', newValues);
    };

    // Calcular combinaciones y precios
    // Calcular combinaciones y precios
    useEffect(() => {
        const calculatePrices = () => {
            const combinations = generateCombinations();
            const prices = {};

            // Si combinationsWithPrices tiene valores, los usamos
            combinations.forEach(combination => {
                const key = combination.join(", "); // Formato de clave
                // Si hay un precio existente en combinationsWithPrices, lo usamos, de lo contrario, inicializamos en 0
                prices[key] = combinationsWithPrices[key] ? parseFloat(combinationsWithPrices[key]) : 0;
            });

            setPrices(prices); // Actualiza el estado de precios
            setData('prices', prices); // Guarda los precios en el estado de data
        };

        calculatePrices(); // Llama a la función para calcular precios
    }, [data.attribute_names, data.attribute_values, combinationsWithPrices]); // Dependencias

    const generateCombinations = () => {
        const { attribute_names, attribute_values } = data;
        const combinations = [];

        const generate = (prefix, index) => {
            if (index === attribute_names.length) {
                combinations.push(prefix);
                return;
            }
            for (const value of attribute_values[index]) {
                generate([...prefix, value], index + 1);
            }
        };

        generate([], 0);
        return combinations;
    };

    const handlePriceChange = (combination, value) => {
        const numericValue = parseFloat(value);
        // console.log("Cambio de precio para combinación:", combination, "Nuevo valor:", numericValue); // Agrega este log
        if (isNaN(numericValue) || numericValue < 0) {
            toast("Por favor, ingresa un precio válido.", {
                description: "El precio debe ser un número positivo.",
            });
            return;
        }

        setPrices(prevPrices => {
            const updatedPrices = {
                ...prevPrices,
                [combination]: numericValue
            };
            setData('prices', updatedPrices); // Actualiza el campo prices en data
            return updatedPrices; // Devuelve el nuevo estado
        });
    };

    const selectedCategories = categoryOptions.filter(option => data.categories.includes(option.value));
    // console.log("Current Prices State:", prices);
    // console.log(combinationsWithPrices)
    return (
        <>
            <div className="col-span-1 md:col-span-2 ">
                <DivSection>
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
                        <InputLabel htmlFor="product_price_discount" value="Precio de descuento" />
                        <TextInput
                            id="product_price_discount"
                            type="text"
                            name="product_price_discount"
                            value={data.product_price_discount}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('product_price_discount', e.target.value)}
                        />
                        <InputError message={errors.product_price_discount} />
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
                            className="border-gray-300 w-full dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-3xl border shadow-sm"
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
                </DivSection>

                <DivSection>
                    <p className='font-semibold'>Atributos</p>
                    {data.attribute_names.map((attributeName, index) => (
                        <div key={index} className="mb-2">
                            <InputLabel value="Atributo" />
                            <TextInput
                                type="text"
                                value={attributeName} // Muestra el nombre del atributo
                                onChange={(e) => handleAttributeChange(index, e.target.value)}
                                placeholder="Nombre del atributo"
                            />
                            <InputError message={errors.attribute_names?.[index]} />

                            {/* Renderiza los valores correspondientes a este atributo */}
                            {Array.isArray(data.attribute_values[index]) && data.attribute_values[index].map((value, valueIndex) => (
                                <div key={valueIndex} className="my-2">
                                    <InputLabel value="Valor" />
                                    <TextInput
                                        type="text"
                                        value={value} // Muestra el valor correspondiente
                                        onChange={(e) => handleAttributeValueChange(index, valueIndex, e.target.value)}
                                        placeholder={`Valor de ${attributeName}`} // Muestra el nombre del atributo en el placeholder
                                    />
                                    <InputError message={errors.attribute_values?.[index]?.[valueIndex]} />
                                </div>
                            ))}

                            <Button variant="link" type="button" onClick={() => addAttributeValue(index)}>
                                Agregar Valor
                            </Button>
                        </div>
                    ))}
                    <Button variant="link" type="button" onClick={addAttribute}>
                        Agregar Atributo
                    </Button>
                </DivSection>

                <DivSection>
                    <h3 className="font-semibold">Combinaciones y Precios</h3>
                    <ul>
                        {Object.entries(prices).map(([combination, price]) => {
                            // console.log(prices); // Verifica el precio aquí
                            return (
                                <li key={combination}>
                                    {combination}:
                                    <input
                                        type="number"
                                        value={price || ''} // Asegúrate de que el valor se muestre correctamente
                                        onChange={(e) => handlePriceChange(combination, e.target.value)}
                                        placeholder="Definir precio"
                                    />
                                </li>
                            );
                        })}
                    </ul>
                </DivSection>
            </div>

            <div className="col-span-1 sm:col-span-1">
                <DivSection>
                    <div className='md:col-span-2 lg:col-span-1'>
                        <InputLabel htmlFor="status" value="Publicar" />
                        <select
                            name="status"
                            id="status"
                            value={data.status}
                            className="border-gray-300 w-full dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-full shadow-sm"
                            onChange={(e) => setData('status', e.target.value)}
                        >
                            <option value={0}>Borrador</option>
                            <option value={1}>Publicar</option>
                        </select>
                        <InputError message={errors.status} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel value="Categorías" />
                        <Select
                            isMulti
                            options={categoryOptions}
                            onChange={handleCategoryChange}
                            value={categoryOptions.filter(option => data.categories.includes(option.value))}
                        />
                        <InputError message={errors.categories} />
                    </div>

                    <div>
                        <InputLabel htmlFor="quantity" value="Stock" />
                        <TextInput
                            id="quantity"
                            type="number"
                            name="quantity"
                            value={data.quantity}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('quantity', e.target.value)}
                        />
                        <InputError message={errors.quantity} />
                    </div>

                    <div>
                        <InputLabel htmlFor="store" value="Tiendas" />
                        <select
                            name="store_id"
                            id="store"
                            className="border-gray-300 w-full dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-3xl shadow-sm"
                            value={data.store_id}
                            onChange={(e) => setData('store_id', parseInt(e.target.value))}
                        >
                            {stores.length === 0 ? (
                                <option value="" disabled>
                                    No hay tiendas disponibles
                                </option>
                            ) : (
                                stores.map((store) => (
                                    <option value={store.id} key={store.id}>
                                        {store.store_name}
                                    </option>
                                ))
                            )}
                        </select>
                        <InputError message={errors.store_id} className="mt-2" />
                    </div>
                </DivSection>
            </div>
        </>
    );
}