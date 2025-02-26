import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import DivSection from '@/Components/ui/div-section';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { AlertCircleIcon, PlusCircle } from 'lucide-react';
import { Separator } from '@/Components/ui/separator';
import { customStyles } from '@/hooks/custom-select';
import { Input } from '@/Components/ui/input';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useForm } from '@inertiajs/react';
import Checkbox from '@/Components/Checkbox';
import TextAreaRich from '@/Components/ui/TextAreaRich';

export default function ProductsForm({ data, taxes, categories, stores, combinationsWithPrices = "", product = "", setData, errors }) {
    const animatedComponents = makeAnimated(); //Animacion de multiselect
    const textAreaRef = useRef(); // inicializacion de TextAreaRich
    const { delete: deleteImage } = useForm(); // Desestructura la función delete de useForm

    const categoryOptions = categories.map(category => ({
        value: category.id,
        label: category.category_name
    }));

    const [prices, setPrices] = useState({});
    // Inicializa el estado de precios con los valores existentes
    useEffect(() => {
        setPrices(combinationsWithPrices);
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
    useEffect(() => {
        const calculatePrices = () => {
            const combinations = generateCombinations();
            const prices = {};

            // Usa el precio base como valor por defecto
            const basePrice = parseFloat(data.product_price) || 0; // Asegúrate de que sea un número

            // Si combinationsWithPrices tiene valores, los usamos
            combinations.forEach(combination => {
                const key = combination.join(", "); // Formato de clave
                // Si hay un precio existente en combinationsWithPrices, lo usamos, de lo contrario, inicializamos en el precio base
                prices[key] = combinationsWithPrices[key] ? parseFloat(combinationsWithPrices[key]) : basePrice;
            });

            setPrices(prices); // Actualiza el estado de precios
            setData('prices', prices); // Guarda los precios en el estado de data
        };

        calculatePrices(); // Llama a la función para calcular precios
    }, [data.attribute_names, data.attribute_values, combinationsWithPrices, data.product_price]); // Dependencias

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

    // const selectedCategories = categoryOptions.filter(option => data.categories.includes(option.value));

    const handleDeleteImage = (imageId) => {
        if (confirm("¿Estás seguro de que deseas eliminar esta imagen?")) {
            deleteImage(route('products.images.destroy', { product: product.id, imageId }), {
                onSuccess: () => {
                    toast("Imagen eliminada con éxito.");
                },
                onError: () => {
                    toast.error("Error al eliminar la imagen.");
                }
            });
        }
    };

    const statusOptions = [
        { value: 0, label: 'Borrador' },
        { value: 1, label: 'Publicar' }
    ];

    return (
        <>
            <div className="col-span-full md:col-span-2">
                <DivSection className='space-y-4'>
                    <div>
                        <InputLabel htmlFor="product_name" value="Nombre" />
                        <TextInput
                            id="product_name"
                            type="text"
                            name="product_name"
                            value={data.product_name || ''}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={(e) => setData('product_name', e.target.value)}
                        />
                        <InputError message={errors.product_name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="product_description" value="Descripción" />
                        <TextAreaRich
                            initialValue={data.product_description || ''}
                            ref={textAreaRef}
                            name="product_description"
                            onChange={(newText) => setData('product_description', newText)}
                        />
                        <InputError message={errors.product_description} />
                    </div>

                    <div>
                        <InputLabel htmlFor="images" value="Media" />
                        <Input
                            id="images"
                            type="file"
                            name="images[]"
                            className="mt-1 block w-full"
                            onChange={(e) => setData('images', Array.from(e.target.files))} // Almacena todos los archivos
                            multiple
                        />
                        <InputError message={errors.images} className="mt-2" />
                    </div>

                    <div className="my-4">
                        <div className="flex flex-wrap">
                            {product.media && product.media.length > 0 ? (
                                product.media.map((image) => {
                                    return (
                                        <div key={image.id} className="relative mr-2 mb-2">
                                            <img
                                                src={image.original_url}
                                                alt={image.name}
                                                className="w-44 h-44 object-cover rounded-xl aspect-square"
                                            />
                                            <Button
                                                variant="link"
                                                onClick={() => handleDeleteImage(image.id)}
                                                type="button"
                                                className="text-red-600"
                                            >
                                                <TrashIcon className='size-5' /> Eliminar
                                            </Button>
                                        </div>
                                    );
                                }
                                )
                            ) : (null)
                            }
                        </div>
                    </div>

                    <div>
                        <InputLabel value="Categorías" />
                        <Select
                            isMulti
                            closeMenuOnSelect={false}
                            styles={customStyles}
                            options={categoryOptions}
                            onChange={handleCategoryChange}
                            components={animatedComponents}
                            value={categoryOptions.filter(option => data.categories.includes(option.value))}
                        />
                        <InputError message={errors.categories} />
                    </div>
                </DivSection>

                <DivSection className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                            value={data.product_price_discount || ''}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('product_price_discount', e.target.value)}
                        />
                        <InputError message={errors.product_price_discount} />
                    </div>
                    <div className="flex items-center">

                        <AlertCircleIcon />
                        <p className="ms-2 text-gray-500 text-sm">Recuerda colocar el impuesto al producto.</p>
                    </div>
                </DivSection>

                <DivSection className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <InputLabel htmlFor="product_sku" value="SKU (Stock Keeping Unit)" />
                        <TextInput
                            id="product_sku"
                            type="text"
                            name="product_sku"
                            value={data.product_sku || ''}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('product_sku', e.target.value)}
                        />
                        <InputError message={errors.product_sku} />
                    </div>

                    <div>
                        <InputLabel htmlFor="product_barcode" value="Código de barra (ISBN, UPC, etc.)" />
                        <TextInput
                            id="product_barcode"
                            type="text"
                            name="product_barcode"
                            value={data.product_barcode || ''}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('product_barcode', e.target.value)}
                        />
                        <InputError message={errors.product_barcode} />
                    </div>

                    <div className="flex items-center mt-4">
                        <Checkbox
                            // type="checkbox"
                            id="product_status_pos"
                            name="product_status_pos"
                            checked={data.product_status_pos === 1} // Marca el checkbox si el valor es 1
                            onChange={(e) => setData('product_status_pos', e.target.checked ? 1 : 0)} // Establece 1 si está marcado, 0 si no
                            className="mr-2" // Espaciado a la derecha
                        />
                        <InputLabel htmlFor="product_status_pos" value="Activar en POS" />
                    </div>
                    <InputError message={errors.product_status_pos} className="mt-2" />
                </DivSection>

                <DivSection className='space-y-4'>
                    <div className="border rounded-xl mb-4">
                        <div className="flex justify-between px-4 pt-4">
                            <p className='font-semibold'>Atributos</p>
                        </div>
                        <div className="p-4">
                            {data.attribute_names.map((attributeName, index) => (
                                <div key={index} className="mb-">
                                    <InputLabel value="Nombre de opción" />
                                    <TextInput
                                        type="text"
                                        value={attributeName} // Muestra el nombre del atributo
                                        onChange={(e) => handleAttributeChange(index, e.target.value)}
                                        placeholder="Nombre del atributo"
                                    />
                                    <InputError message={errors.attribute_names?.[index]} />

                                    <div className="my-2">

                                        {/* Renderiza los valores correspondientes a este atributo */}
                                        {Array.isArray(data.attribute_values[index]) && data.attribute_values[index].map((value, valueIndex) => (
                                            <div key={valueIndex} className="mb-2">
                                                <InputLabel value="Valor de opciones" />
                                                {/* <InputLabel value="Valor" /> */}
                                                <TextInput
                                                    type="text"
                                                    value={value} // Muestra el valor correspondiente
                                                    onChange={(e) => handleAttributeValueChange(index, valueIndex, e.target.value)}
                                                    placeholder={`Valor de ${attributeName}`} // Muestra el nombre del atributo en el placeholder
                                                />
                                                <InputError message={errors.attribute_values?.[index]?.[valueIndex]} />
                                            </div>
                                        ))}
                                    </div>

                                    <Button variant="link" type="button" onClick={() => addAttributeValue(index)}>
                                        Agregar Valor
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Separator />

                        {data.attribute_names.length < 3 ? (
                            <Button className="w-full justify-start" variant="link" size="sm" type="button" onClick={addAttribute}>
                                <PlusCircle className="size-4" />
                                Agregar opción
                            </Button>
                        ) : (
                            null
                        )}
                    </div>

                    {data.attribute_values.length >= 1 ? (
                        <Table >
                            <TableCaption>Lista de combinaciones.</TableCaption>
                            <TableHeader className="bg-gray-100">
                                <TableRow>
                                    <TableHead className="w-[100px]">Combinaciones</TableHead>
                                    <TableHead className="text-right">Precio</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(prices).map(([combination, price]) => {
                                    return (
                                        <TableRow key={combination}>
                                            <TableCell className="font-medium capitalize">{combination}</TableCell>
                                            <TableCell className="text-right">
                                                <TextInput
                                                    type="number"
                                                    value={price || ''} // Asegúrate de que el valor se muestre correctamente
                                                    onChange={(e) => handlePriceChange(combination, e.target.value)}
                                                    placeholder="Definir precio"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    ) : (
                        null
                    )}


                </DivSection>
            </div>

            <div className="col-span-full md:col-span-1">
                <DivSection className='space-y-4'>
                    <div className='md:col-span-2 lg:col-span-1'>
                        <InputLabel htmlFor="status" value="Publicar" />
                        <Select
                            name="status"
                            id="status"
                            options={statusOptions}
                            value={statusOptions.find(option => option.value === data.status)}
                            onChange={(selectedOption) => setData('status', selectedOption.value)}
                            styles={customStyles}
                        />
                        <InputError message={errors.status} className="mt-2" />
                    </div>
                </DivSection>

                <DivSection className='space-y-4'>
                    <div>
                        <InputLabel htmlFor="tax_id" value="Impuesto" />
                        <Select
                            name="tax_id"
                            id="tax_id"
                            options={taxes.map(tax => ({ value: tax.id, label: tax.tax_name }))}
                            value={taxes.length > 0 ? taxes.map(tax => ({ value: tax.id, label: tax.tax_name })).find(option => option.value === data.tax_id) : null}
                            onChange={(selectedOption) => setData('tax_id', selectedOption.value)}
                            styles={customStyles}
                        />
                        <InputError message={errors.tax_id} className="mt-2" />
                        <div className="flex items-center">

                            <AlertCircleIcon />
                            <p className="ms-2 text-gray-500 text-sm">Deje la opción "Sin impuesto" si colocara el precio con el impuesto agregado.</p>
                        </div>
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
                        <Select
                            name="store_id"
                            id="store"
                            options={stores.length > 0 ? stores.map(store => ({ value: store.id, label: store.store_name })) : []}
                            value={stores.length > 0 ? stores.map(store => ({ value: store.id, label: store.store_name })).find(option => option.value === data.store_id) : null}
                            onChange={(selectedOption) => setData('store_id', selectedOption ? selectedOption.value : null)}
                            styles={customStyles}
                        />
                        <InputError message={errors.store_id} className="mt-2" />
                    </div>
                </DivSection>
            </div>
        </>
    );
}