import Select from 'react-select';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import DivSection from '@/Components/ui/div-section';
import { useState } from 'react';

export default function ProductsForm({ data, taxes, categories, stores, addAttribute, handleAttributeChange, setData, errors, handleAttributeValueChange, addAttributeValue, calculatePrices  }) {
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

    const customStyles = {
        control: (base, { isFocused }) => ({
            ...base,
            borderRadius: '30px',
            backgroundColor: isFocused ? 'gray-500' : 'gray-200', // Cambia el fondo del control
            borderColor: isFocused ? 'gray-500' : 'gray-200', // Cambia el borde del control
            '&:hover': {
                borderColor: 'gray-500', // Cambia el borde del control al pasar el mouse
            },
            '&.dark': {
                backgroundColor: 'gray-700', // Cambia el fondo del control en dark mode
                borderColor: 'gray-700', // Cambia el borde del control en dark mode
            },
        }),
        option: (base, { isSelected }) => ({
            ...base,
            backgroundColor: isSelected ? '#F7F7F7' : 'white', // Cambia el fondo de la opción seleccionada
            color: isSelected ? 'black' : 'black', // Cambia el color de la opción seleccionada
            '&.dark': {
                backgroundColor: isSelected ? 'gray-700' : 'gray-900', // Cambia el fondo de la opción seleccionada en dark mode
                color: isSelected ? 'white' : 'gray-300', // Cambia el color de la opción seleccionada en dark mode
            },
        }),
    };


    // 1. Crear estado para precios
    const [prices, setPrices] = useState({});

    // 2. Obtener combinaciones
    const combinations = calculatePrices();

    // 3. Manejar cambios en el input de precio
    const handlePriceChange = (combination, value) => {
        const numericValue = parseFloat(value);
        if (isNaN(numericValue) || numericValue < 0) {
            toast("Por favor, ingresa un precio válido.", {
                description: "El precio debe ser un número positivo.",
            });
            return;
        }
        
        // Actualiza el estado de prices
        setPrices(prevPrices => {
            const updatedPrices = {
                ...prevPrices,
                [combination]: numericValue
            };
            
            // Actualiza el campo prices en data
            setData('prices', updatedPrices); // Asegúrate de que esto esté aquí
            
            console.log(updatedPrices); // Imprime los precios actualizados
            return updatedPrices;
        });
    };

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

                <DivSection className='my-4'>
                    <p className=' font-semibold'>Atributos</p>
                    <div className='border border-gray-300 rounded-2xl mt-4 '>
                        {data.attribute_names.map((attribute, index) => (
                            <div key={index} className="mb-2 px-4 pt-4">
                                <InputLabel value="Atributos" />
                                <TextInput
                                    id={`attribute_name_${index}`}
                                    type="text"
                                    value={attribute}
                                    onChange={(e) => handleAttributeChange(index, e.target.value)}
                                    placeholder="Nombre del atributo"
                                />
                                <InputError message={errors.attribute_names?.[index]} />

                                {data.attribute_values[index]?.map((value, valueIndex) => (
                                    <div key={valueIndex} className="my-2">
                                        <InputLabel value="Valores" />
                                        <TextInput
                                            id={`attribute_value_${index}_${valueIndex}`}
                                            type="text"
                                            value={value}
                                            onChange={(e) => handleAttributeValueChange(index, valueIndex, e.target.value)}
                                            placeholder="Valor del atributo"
                                        />
                                        <InputError message={errors.attribute_values?.[index]?.[valueIndex]} />
                                    </div>
                                ))}

                                <Button variant="link" type="button" onClick={() => addAttributeValue(index)}>
                                    Agregar Valor
                                </Button>
                            </div>
                        ))}
                        <div className="border-t border-gray-300">
                            {data.attribute_names.length < 3 && (
                                <Button variant="link" type="button" onClick={addAttribute}>
                                    Agregar Atributo
                                </Button>
                            )}
                            {data.attribute_names.length >= 3 && (
                                <p className="text-red-500 text-sm mt-2">Has alcanzado el límite de 3 atributos.</p>
                            )}
                        </div>
                    </div>
                </DivSection>

                <DivSection className='my-4'>
                <h3 className="font-semibold">Combinaciones y Precios</h3>
                <ul>
    {Object.entries(combinations).map(([combination]) => (
        <li key={combination}>
            {combination}: 
            <input 
                type="number" 
                value={prices[combination] || ''} 
                onChange={(e) => handlePriceChange(combination, e.target.value)} 
                placeholder="Definir precio" 
            />
        </li>
    ))}
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
                            value={selectedCategories} // Establece el valor seleccionado
                            className="mt-1"
                            styles={customStyles}
                        />
                        <InputError message={errors.categories} />
                    </div>

                    <div>
                        <InputLabel htmlFor="quantity" value="Stock" />
                        <TextInput
                            id="quantity"
                            type="text"
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
                        <InputError message={errors.store_id} className="mt-2" /> {/* Cambia a 'store_id' */}
                    </div>
                </DivSection>
            </div>

        </>
    );
}