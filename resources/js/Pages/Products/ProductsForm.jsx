import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import DivSection from '@/Components/ui/div-section';
import { toast } from 'sonner';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { PlusCircle } from 'lucide-react';
import { customStyles } from '@/hooks/custom-select';
import { Input } from '@/Components/ui/input';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useForm } from '@inertiajs/react';
import Checkbox from '@/Components/Checkbox';
import TextAreaRich from '@/Components/ui/TextAreaRich';

export default function ProductsForm({ data, taxes, categories, stores, combinationsWithPrices = "", product = "", setData, errors }) {
    const animatedComponents = makeAnimated();
    const textAreaRef = useRef();
    const { delete: deleteImage } = useForm();
    const [stocks, setStocks] = useState({});
    const [prices, setPrices] = useState({});
    const [showAttributes, setShowAttributes] = useState(false);
    const [localErrors, setLocalErrors] = useState({}); // Nuevo estado para errores locales

    const categoryOptions = categories.map(category => ({
        value: category.id,
        label: category.category_name
    }));

    useEffect(() => {
        setPrices(combinationsWithPrices);
        setStocks(prevStocks => {
            const newStocks = { ...prevStocks };
            if (combinationsWithPrices) {
                for (const key in combinationsWithPrices) {
                    newStocks[key] = combinationsWithPrices[key].stock || 0;
                }
            }
            return newStocks;
        });
    }, [combinationsWithPrices]);

    useEffect(() => {
        if (product && data.attribute_names.length > 0) {
            setShowAttributes(true);
        }
    }, [data.attribute_names, product]);

    const handleCategoryChange = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setData('categories', selectedValues);
    };

    const addAttribute = () => {
        if (data.attribute_names.length < 3) {
            setData('attribute_names', [...data.attribute_names, ""]);
            setData('attribute_values', [...data.attribute_values, [""]]);
            setShowAttributes(true);
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
        newValues[index] = [...newValues[index], ""]; // Asegura que no se muta el estado directamente
        setData('attribute_values', newValues);
    };

    useEffect(() => {
        const calculatePricesAndStocks = () => {
            const combinations = generateCombinations();
            const newPrices = {};
            const newStocks = {};
            const basePrice = parseFloat(data.product_price) || 0;

            combinations.forEach(combination => {
                const key = combination.join(", ");
                newPrices[key] = combinationsWithPrices[key] ? parseFloat(combinationsWithPrices[key].price) : basePrice;
                newStocks[key] = stocks[key] || 0; // Mantiene el stock existente o lo inicializa en 0
            });

            setPrices(newPrices);
            setStocks(newStocks);
            setData('prices', newPrices);
            setData('stocks', newStocks);
        };

        if (data.attribute_names.length > 0 && data.attribute_values.length > 0) {
            calculatePricesAndStocks();
        } else {
            // Si no hay atributos, inicializa los precios y stocks con el precio base.
            const basePriceOnly = { 'default': parseFloat(data.product_price) || 0 };
            setPrices(basePriceOnly);
            setData('prices', basePriceOnly);
            setData('stocks', { 'default': 0 });
        }
    }, [data.attribute_names, data.attribute_values, combinationsWithPrices, data.product_price]);

    const generateCombinations = () => {
        const { attribute_names, attribute_values } = data;
        if (!attribute_names || attribute_names.length === 0) return [[]]; // Maneja el caso sin atributos

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
        if (isNaN(numericValue) || numericValue < 0) {
            setLocalErrors(prevErrors => ({
                ...prevErrors,
                [`price_${combination}`]: "Por favor, ingresa un precio válido (número positivo).",
            }));
            return;
        }
        setLocalErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[`price_${combination}`];
            return newErrors;
        });

        setPrices(prevPrices => ({
            ...prevPrices,
            [combination]: numericValue
        }));

        setData('prices', {
            ...data.prices,
            [combination]: numericValue
        });
    };

    const handleStockChange = (combination, value) => {
        const numericValue = parseFloat(value);
        if (isNaN(numericValue) || numericValue < 0) {
            setLocalErrors(prevErrors => ({
                ...prevErrors,
                [`stock_${combination}`]: "Por favor, ingresa un stock válido (número positivo).",
            }));
            return;
        }

        setLocalErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[`stock_${combination}`];
            return newErrors;
        });

        setStocks(prevStocks => ({
            ...prevStocks,
            [combination]: numericValue
        }));

        setData('stocks', {
            ...data.stocks,
            [combination]: numericValue
        });
    };

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

    const removeAttribute = (index) => {
        const newAttributes = [...data.attribute_names];
        const newAttributeValues = [...data.attribute_values];

        newAttributes.splice(index, 1);
        newAttributeValues.splice(index, 1);

        setData('attribute_names', newAttributes);
        setData('attribute_values', newAttributeValues);

        if (newAttributes.length === 0) {
            setShowAttributes(false);
            setData('prices', { 'default': parseFloat(data.product_price) || 0 });
            setData('stocks', { 'default': 0 });
        } else {
            const combinations = generateCombinations(newAttributes, newAttributeValues);
            const newPrices = {};
            const newStocks = {};
            const basePrice = parseFloat(data.product_price) || 0;

            combinations.forEach(combination => {
                const key = combination.join(", ");
                newPrices[key] = prices[key] || basePrice; // Usa el precio existente o el precio base
                newStocks[key] = stocks[key] || 0;
            });

            setPrices(newPrices);
            setStocks(newStocks);
            setData('prices', newPrices);
            setData('stocks', newStocks);
        }
    };

    const removeAttributeValue = (attributeIndex, valueIndex) => {
        const newAttributeValues = [...data.attribute_values];
        newAttributeValues[attributeIndex].splice(valueIndex, 1);

        setData('attribute_values', newAttributeValues);

        const combinations = generateCombinations();
        const newPrices = {};
        const newStocks = {};
        const basePrice = parseFloat(data.product_price) || 0;

        combinations.forEach(combination => {
            const key = combination.join(", ");
            newPrices[key] = prices[key] || basePrice; // Mantiene precios
            newStocks[key] = stocks[key] || 0;  // Mantiene stocks
        });

        setPrices(newPrices);
        setStocks(newStocks);
        setData('prices', newPrices);
        setData('stocks', newStocks);
    };

    const handleBarcodeChange = (combination, value) => {
        setData('barcodes', {
            ...data.barcodes,
            [combination]: value
        });
    };

    const handleSkuChange = (combination, value) => {
        setData('skus', {
            ...data.skus,
            [combination]: value
        });
    };

    const statusOptions = [
        { value: 0, label: 'Borrador' },
        { value: 1, label: 'Publicar' }
    ];

    const calculateTotalStock = () => {
        if (!data.stocks) return 0;
        return Object.values(data.stocks).reduce((total, stock) => total + (parseFloat(stock) || 0), 0);
    };

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
                            onChange={(e) => setData('images', Array.from(e.target.files))}
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
                                })
                            ) : (null)}
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

                {!showAttributes && (
                    <>
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
                                    className="mt-1 block w-full uppercase"
                                    onChange={(e) => setData('product_barcode', e.target.value)}
                                />
                                <InputError message={errors.product_barcode} />
                            </div>

                            {!showAttributes && (
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
                            )}

                        </DivSection>
                    </>
                )}

                <DivSection className='space-y-4'>
                    <div className="borders rounded-xl mb-4">
                        <div className="flex justify-between px-4 pt-4">
                            <p className='font-semibold'>Opciones</p>
                        </div>
                        <div className="border rounded-xl mb-4">
                            {showAttributes && (
                                <>
                                    <div className="p-4">
                                        {data.attribute_names.map((attributeName, index) => (
                                            <div key={index}>
                                                <TextInput
                                                    type="text"
                                                    value={attributeName}
                                                    onChange={(e) => handleAttributeChange(index, e.target.value)}
                                                    placeholder="Nombre del atributo"
                                                />
                                                <InputError message={errors.attribute_names?.[index]} />

                                                {data.attribute_values[index] && data.attribute_values[index].length > 0 && (
                                                    <div className="my-2">
                                                        {data.attribute_values[index].map((value, valueIndex) => (
                                                            <div key={valueIndex} className="mb-2 flex justify-between items-center">
                                                                <TextInput
                                                                    type="text"
                                                                    value={value}
                                                                    onChange={(e) => handleAttributeValueChange(index, valueIndex, e.target.value)}
                                                                    placeholder={`Valor de ${attributeName}`}
                                                                />
                                                                <Button variant="link" type="button" onClick={() => removeAttributeValue(index, valueIndex)}>
                                                                    <TrashIcon className="size-4" />
                                                                </Button>
                                                                <InputError message={errors.attribute_values?.[index]?.[valueIndex]} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-center">
                                                    <Button variant="link" type="button" onClick={() => addAttributeValue(index)}>
                                                        Agregar Valor
                                                    </Button>
                                                    <Button variant="link" type="button" onClick={() => removeAttribute(index)}>
                                                        Eliminar opción
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {data.attribute_names.length < 3 ? (
                                        <Button className="w-full justify-start" variant="link" size="sm" type="button" onClick={addAttribute}>
                                            <PlusCircle className="size-4" />
                                            Agregar otro opción
                                        </Button>
                                    ) : (null)}
                                </>
                            )}
                            {!showAttributes && data.attribute_names.length < 3 ? (
                                <Button className="w-full justify-start" variant="link" size="sm" type="button" onClick={() => setShowAttributes(true)}>
                                    <PlusCircle className="size-4" />
                                    Agregar opción
                                </Button>
                            ) : (null)}
                        </div>
                    </div>

                    {data.attribute_values.some(values => values.length > 0) ? (
                        <Table>
                            <TableCaption>
                                Inventario total en la ubicación de la tienda: {calculateTotalStock()} disponibles
                            </TableCaption>
                            <TableHeader className="bg-gray-100">
                                <TableRow>
                                    <TableHead className="w-[100px]">Combinaciones</TableHead>
                                    <TableHead>
                                        Precio
                                    </TableHead>
                                    <TableHead>
                                        Stock
                                    </TableHead>
                                    <TableHead>
                                        Código de Barras
                                    </TableHead>
                                    <TableHead>
                                        SKU
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(prices).map(([combination, price]) => {
                                    return (
                                        <TableRow key={combination}>
                                            <TableCell>{combination}</TableCell>
                                            <TableCell className="p-1">
                                                <TextInput
                                                    type="number"
                                                    value={price || ''}
                                                    onChange={(e) => handlePriceChange(combination, e.target.value)}
                                                />
                                                {localErrors[`price_${combination}`] && (
                                                    <InputError message={localErrors[`price_${combination}`]} />
                                                )}
                                            </TableCell>
                                            <TableCell className="p-1">
                                                <TextInput
                                                    type="number"
                                                    value={data.stocks[combination] || ''}
                                                    onChange={(e) => handleStockChange(combination, e.target.value)}
                                                />
                                                {localErrors[`stock_${combination}`] && (
                                                    <InputError message={localErrors[`stock_${combination}`]} />
                                                )}
                                            </TableCell>
                                            <TableCell className="p-1">
                                                <TextInput
                                                    type="text"
                                                    value={data.barcodes[combination] || ''}
                                                    onChange={(e) => handleBarcodeChange(combination, e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell className="p-1">
                                                <TextInput
                                                    type="text"
                                                    value={data.skus[combination] || ''}
                                                    onChange={(e) => handleSkuChange(combination, e.target.value)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    ) : null}
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

                    <div className="flex items-center mt-4">
                        <Checkbox
                            id="product_status_pos"
                            name="product_status_pos"
                            checked={data.product_status_pos === 1}
                            onChange={(e) => setData('product_status_pos', e.target.checked ? 1 : 0)}
                            className="mr-2"
                        />
                        <InputLabel htmlFor="product_status_pos" value="Activar en POS" />
                    </div>
                    <InputError message={errors.product_status_pos} className="mt-2" />
                </DivSection>

                {/*<DivSection className='space-y-4'>
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
                            <AlertCircle />
                            <p className="ms-2 text-gray-500 text-sm">Deje la opción "Sin impuesto" si colocara el precio con el impuesto agregado. </p>
                            <p className="ms-2 text-gray-500 text-sm">Si coloca un producto sin impuesto, se recomienda colocarlo en todos los productos. </p>
                        </div>
                    </div> 
                 
                </DivSection>*/}

            </div>
        </>
    );
}