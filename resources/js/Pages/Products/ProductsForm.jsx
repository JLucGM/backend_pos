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

export default function ProductsForm({ data, categories, product = null, setData, errors }) {
    const animatedComponents = makeAnimated();
    const textAreaRef = useRef();
    const { delete: deleteImage } = useForm();
    const [showAttributes, setShowAttributes] = useState(false);
    const [localErrors, setLocalErrors] = useState({}); // New state for local validation errors

    // Options for category select input
    const categoryOptions = categories.map(category => ({
        value: category.id,
        label: category.category_name
    }));

    // Effect to determine if attributes section should be shown
    useEffect(() => {
        // Show attributes section if product has combinations (for edit)
        // or if attributes are already defined in data (e.g., after adding them in create)
        if (product && product.combinations.length > 0 || (data.attribute_names && data.attribute_names.length > 0)) {
            setShowAttributes(true);
        } else {
            // For new products or products without attributes, ensure it's false initially
            setShowAttributes(false);
        }
    }, [product, data.attribute_names]); // Depend on product and data.attribute_names

    // Effect to ensure data.prices is an array when attributes are enabled
    // This is crucial for the "Create" flow where data.prices might start as {} or a single item.
    useEffect(() => {
        // If attributes are now shown, and data.prices is not already an array
        // or it's an array but only contains the 'default' simple product entry,
        // reset it to an empty array so the combination logic can build it correctly.
        if (showAttributes && (!Array.isArray(data.prices) || (Array.isArray(data.prices) && data.prices.length === 1 && data.prices[0]?._key === 'default'))) {
            setData('prices', []);
        }
    }, [showAttributes]); // Run this effect when showAttributes changes

    // Function to generate all possible combinations of attribute values
    const generateCombinations = () => {
        const { attribute_names, attribute_values } = data;

        // Filter out attributes that have no name or no values
        const validAttributeData = attribute_names
            .map((name, index) => ({ name, values: attribute_values[index] || [] }))
            .filter(attr => attr.name && attr.name.trim() !== '' && attr.values.length > 0 && attr.values.every(val => val.trim() !== ''));

        if (validAttributeData.length === 0) {
            // If no valid attributes/values, return an array with an empty array
            // This represents a single "default" combination for simple products,
            // but this function is primarily used when attributes are present.
            return [[]];
        }

        const combinations = [];

        // Recursive function to generate combinations
        const generate = (prefix, index) => {
            if (index === validAttributeData.length) {
                combinations.push(prefix);
                return;
            }
            const currentAttributeValues = validAttributeData[index].values;
            for (const value of currentAttributeValues) {
                generate([...prefix, value], index + 1);
            }
        };

        generate([], 0);
        return combinations;
    };

    // Effect to calculate and merge combinations when attributes or base price change
    // This useEffect ONLY runs when showAttributes is true
    useEffect(() => {
        if (!showAttributes) {
            // If not showing attributes, this useEffect should not manage prices/stocks for combinations
            // The main product_price, quantity, barcode, sku fields will handle it.
            return;
        }

        const calculateAndMergeCombinations = () => {
            const generatedCombinations = generateCombinations();
            const newPricesArray = [];
            const basePrice = parseFloat(data.product_price) || 0;

            // Defensive check: Ensure data.prices is an array before attempting .find()
            const currentPrices = Array.isArray(data.prices) ? data.prices : [];

            generatedCombinations.forEach(comboValues => {
                const comboKey = comboValues.join(", "); // e.g., "rojo, pequeño" - used as a temporary identifier

                // Try to find an existing combination in the current `data.prices` array
                const existingCombinationInCurrentData = currentPrices.find(existingCombo => {
                    // For existing combinations from backend (with 'id'), compare their attribute values
                    if (existingCombo.id && existingCombo.combination_attribute_value && existingCombo.combination_attribute_value.length > 0) {
                        const existingComboAttrValues = existingCombo.combination_attribute_value
                            .map(attrVal => attrVal.attribute_value.attribute_value_name)
                            .sort(); // Sort for consistent comparison
                        return JSON.stringify(comboValues.sort()) === JSON.stringify(existingComboAttrValues);
                    }
                    // For newly generated combinations (that haven't been saved yet), compare by _key
                    return existingCombo._key === comboKey;
                });

                if (existingCombinationInCurrentData) {
                    // If an existing combination is found, use its data
                    newPricesArray.push(existingCombinationInCurrentData);
                } else {
                    // It's a brand new combination not seen before in current data
                    newPricesArray.push({
                        id: null, // New combination, no ID yet from backend
                        combination_price: basePrice.toString(), // Initialize with base price
                        stock: "0",
                        product_barcode: "",
                        product_sku: "",
                        // Reconstruct combination_attribute_value for display and eventual submission
                        combination_attribute_value: comboValues.map((val, idx) => ({
                            attribute_value: {
                                attribute_value_name: val,
                                attribute: {
                                    attribute_name: data.attribute_names[idx] || '' // Use attribute name from data
                                }
                            }
                        })),
                        _key: comboKey // Temporary key for new combinations
                    });
                }
            });

            // Update the form data with the new merged prices array
            setData('prices', newPricesArray);

            // Also update the separate stocks, barcodes, and skus objects for submission
            const newStocksObj = {};
            const newBarcodesObj = {};
            const newSkusObj = {};
            newPricesArray.forEach(combo => {
                const identifier = combo.id || combo._key; // Use ID if exists, else temporary key
                newStocksObj[identifier] = combo.stock;
                newBarcodesObj[identifier] = combo.product_barcode;
                newSkusObj[identifier] = combo.product_sku;
            });
            setData('stocks', newStocksObj);
            setData('barcodes', newBarcodesObj);
            setData('skus', newSkusObj);
        };

        // Only run if attributes are defined and not empty
        const hasValidAttributes = data.attribute_names && data.attribute_names.length > 0 &&
            data.attribute_values && data.attribute_values.every(arr => arr.length > 0 && arr.every(val => val.trim() !== ''));

        if (hasValidAttributes) {
            calculateAndMergeCombinations();
        }
        // If hasValidAttributes is false, this useEffect does nothing,
        // and the main product fields manage the price/stock.
    }, [data.attribute_names, data.attribute_values, data.product_price, showAttributes]); // Add showAttributes to dependencies

    // Handle category selection change
    const handleCategoryChange = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setData('categories', selectedValues);
    };

    // Add a new attribute input field
    const addAttribute = () => {
        if (data.attribute_names.length < 3) {
            setData('attribute_names', [...data.attribute_names, ""]);
            setData('attribute_values', [...data.attribute_values, [""]]);
            setShowAttributes(true); // Ensure attributes section is visible
        } else {
            toast("No puedes agregar más de 3 atributos.", {
                description: "Límite alcanzado.",
            });
        }
    };

    // Handle change for an attribute name
    const handleAttributeChange = (index, value) => {
        const newAttributes = [...data.attribute_names];
        newAttributes[index] = value;
        setData('attribute_names', newAttributes);
    };

    // Handle change for an attribute value
    const handleAttributeValueChange = (attributeIndex, valueIndex, value) => {
        const newValues = [...data.attribute_values];
        newValues[attributeIndex][valueIndex] = value;
        setData('attribute_values', newValues);
    };

    // Add a new attribute value input field for a specific attribute
    const addAttributeValue = (index) => {
        const newValues = [...data.attribute_values];
        newValues[index] = [...newValues[index], ""];
        setData('attribute_values', newValues);
    };

    // Handle price change for a specific combination or the main product price
    const handlePriceChange = (identifier, value) => {
        const numericValue = parseFloat(value);
        if (isNaN(numericValue) || numericValue < 0) {
            setLocalErrors(prevErrors => ({
                ...prevErrors,
                [`price_${identifier}`]: "Por favor, ingresa un precio válido (número positivo).",
            }));
            return;
        }
        setLocalErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[`price_${identifier}`];
            return newErrors;
        });

        if (!showAttributes) {
            // If not showing attributes, update the main product price
            setData('product_price', value);
            // Also update the single entry in the prices array for submission
            setData('prices', [{
                id: null,
                combination_price: value,
                stock: data.quantity || "0", // Use main quantity
                product_barcode: data.product_barcode || "", // Use main barcode
                product_sku: data.product_sku || "", // Use main sku
                combination_attribute_value: [],
                _key: 'default'
            }]);
        } else {
            // If showing attributes, update the specific combination price
            const updatedPrices = data.prices.map(combo =>
                (combo.id === identifier || combo._key === identifier)
                    ? { ...combo, combination_price: value }
                    : combo
            );
            setData('prices', updatedPrices);
        }
    };

    // Handle stock change for a specific combination or the main product stock
    const handleStockChange = (identifier, value) => {
        const numericValue = parseFloat(value);
        if (isNaN(numericValue) || numericValue < 0) {
            setLocalErrors(prevErrors => ({
                ...prevErrors,
                [`stock_${identifier}`]: "Por favor, ingresa un stock válido (número positivo).",
            }));
            return;
        }

        setLocalErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[`stock_${identifier}`];
            return newErrors;
        });

        if (!showAttributes) {
            // If not showing attributes, update the main product quantity
            setData('quantity', value);
            // Also update the single entry in the prices array and stocks object for submission
            setData('prices', [{
                id: null,
                combination_price: data.product_price || "0",
                stock: value,
                product_barcode: data.product_barcode || "",
                product_sku: data.product_sku || "",
                combination_attribute_value: [],
                _key: 'default'
            }]);
            setData('stocks', { 'default': value });
        } else {
            // Update the prices array (which holds stock for combinations)
            const updatedPrices = data.prices.map(combo =>
                (combo.id === identifier || combo._key === identifier)
                    ? { ...combo, stock: value }
                    : combo
            );
            setData('prices', updatedPrices);

            // Also update the separate stocks object for submission (if needed by backend)
            setData('stocks', {
                ...data.stocks,
                [identifier]: value
            });
        }
    };

    // Handle barcode change for a specific combination or the main product barcode
    const handleBarcodeChange = (identifier, value) => {
        if (!showAttributes) {
            setData('product_barcode', value);
            setData('prices', [{
                id: null,
                combination_price: data.product_price || "0",
                stock: data.quantity || "0",
                product_barcode: value,
                product_sku: data.product_sku || "",
                combination_attribute_value: [],
                _key: 'default'
            }]);
            setData('barcodes', { 'default': value });
        } else {
            const updatedPrices = data.prices.map(combo =>
                (combo.id === identifier || combo._key === identifier)
                    ? { ...combo, product_barcode: value }
                    : combo
            );
            setData('prices', updatedPrices);
            setData('barcodes', {
                ...data.barcodes,
                [identifier]: value
            });
        }
    };

    // Handle SKU change for a specific combination or the main product SKU
    const handleSkuChange = (identifier, value) => {
        if (!showAttributes) {
            setData('product_sku', value);
            setData('prices', [{
                id: null,
                combination_price: data.product_price || "0",
                stock: data.quantity || "0",
                product_barcode: data.product_barcode || "",
                product_sku: value,
                combination_attribute_value: [],
                _key: 'default'
            }]);
            setData('skus', { 'default': value });
        } else {
            const updatedPrices = data.prices.map(combo =>
                (combo.id === identifier || combo._key === identifier)
                    ? { ...combo, product_sku: value }
                    : combo
            );
            setData('prices', updatedPrices);
            setData('skus', {
                ...data.skus,
                [identifier]: value
            });
        }
    };

    // Handle image deletion
    const handleDeleteImage = (imageId) => {
        deleteImage(route('products.images.destroy', { product: product.id, imageId }), {
            onSuccess: () => {
                toast("Imagen eliminada con éxito.");
            },
            onError: (error) => {
                console.error("Error deleting image:", error);
                toast.error("Error al eliminar la imagen.");
            }
        });
    };

    // Remove an attribute and its values
    const removeAttribute = (index) => {
        const newAttributes = [...data.attribute_names];
        const newAttributeValues = [...data.attribute_values];

        newAttributes.splice(index, 1);
        newAttributeValues.splice(index, 1);

        setData('attribute_names', newAttributes);
        setData('attribute_values', newAttributeValues);

        // If no attributes remain, hide the attributes section
        if (newAttributes.length === 0) {
            setShowAttributes(false);
            // When no attributes, ensure prices/stocks revert to single product logic
            setData('prices', [{
                id: null,
                combination_price: data.product_price || "0",
                stock: data.quantity || "0",
                product_barcode: data.product_barcode || "",
                product_sku: data.product_sku || "",
                combination_attribute_value: [],
                _key: 'default'
            }]);
            setData('stocks', { 'default': data.quantity || "0" });
            setData('barcodes', { 'default': data.product_barcode || "" });
            setData('skus', { 'default': data.product_sku || "" });
        }
        // The useEffect for attribute changes will handle recalculating prices/stocks if attributes remain
    };

    // Remove a specific attribute value
    const removeAttributeValue = (attributeIndex, valueIndex) => {
        const newAttributeValues = [...data.attribute_values];
        newAttributeValues[attributeIndex].splice(valueIndex, 1);

        setData('attribute_values', newAttributeValues);
        // The useEffect for attribute changes will handle recalculating prices/stocks
    };

    // Options for product status select input
    const statusOptions = [
        { value: 0, label: 'Borrador' },
        { value: 1, label: 'Publicar' }
    ];

    // Calculate total stock from all combinations
    const calculateTotalStock = () => {
        if (!data.prices || !Array.isArray(data.prices)) return 0;
        return data.prices.reduce((total, combo) => total + (parseFloat(combo.stock) || 0), 0);
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
                            {product && product.media && product.media.length > 0 ? (
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

                {/* Section for simple product pricing and stock (when no attributes are active) */}
                {!showAttributes && (
                    <>
                        <DivSection className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <InputLabel htmlFor="product_price" value="Precio" />
                                <TextInput
                                    id="product_price"
                                    type="number"
                                    name="product_price"
                                    value={data.product_price}
                                    className="mt-1 block w-full"
                                    onChange={(e) => handlePriceChange('default', e.target.value)} // Use handlePriceChange for default
                                />
                                <InputError message={errors.product_price} />
                            </div>

                            <div>
                                <InputLabel htmlFor="product_price_discount" value="Precio de descuento" />
                                <TextInput
                                    id="product_price_discount"
                                    type="number"
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
                                    onChange={(e) => handleSkuChange('default', e.target.value)} // Use handleSkuChange for default
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
                                    onChange={(e) => handleBarcodeChange('default', e.target.value)} // Use handleBarcodeChange for default
                                />
                                <InputError message={errors.product_barcode} />
                            </div>

                            {/* Only show quantity for simple products when no attributes */}
                            <div>
                                <InputLabel htmlFor="quantity" value="Stock" />
                                <TextInput
                                    id="quantity"
                                    type="number"
                                    name="quantity"
                                    value={data.quantity}
                                    className="mt-1 block w-full"
                                    onChange={(e) => handleStockChange('default', e.target.value)} // Use handleStockChange for default
                                />
                                <InputError message={errors.quantity} />
                            </div>
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
                                            <div key={index} className="mb-4 p-2 border rounded-md">
                                                <div className="flex justify-between items-center mb-2">
                                                    <InputLabel htmlFor={`attribute_name_${index}`} value="Nombre del Atributo" />
                                                    <Button variant="link" type="button" onClick={() => removeAttribute(index)} className="text-red-600">
                                                        <TrashIcon className="size-4" /> Eliminar opción
                                                    </Button>
                                                </div>
                                                <TextInput
                                                    id={`attribute_name_${index}`}
                                                    type="text"
                                                    value={attributeName}
                                                    onChange={(e) => handleAttributeChange(index, e.target.value)}
                                                    placeholder="Nombre del atributo"
                                                    className="mb-2"
                                                />
                                                <InputError message={errors[`attribute_names.${index}`]} />

                                                <InputLabel htmlFor={`attribute_values_${index}`} value="Valores del Atributo (separados por coma)" />
                                                {data.attribute_values[index] && data.attribute_values[index].length > 0 && (
                                                    <div className="my-2">
                                                        {data.attribute_values[index].map((value, valueIndex) => (
                                                            <div key={valueIndex} className="mb-2 flex items-center space-x-2">
                                                                <TextInput
                                                                    type="text"
                                                                    value={value}
                                                                    onChange={(e) => handleAttributeValueChange(index, valueIndex, e.target.value)}
                                                                    placeholder={`Valor de ${attributeName}`}
                                                                    className="flex-grow"
                                                                />
                                                                <Button variant="link" type="button" onClick={() => removeAttributeValue(index, valueIndex)} className="text-red-600">
                                                                    <TrashIcon className="size-4" />
                                                                </Button>
                                                                <InputError message={errors[`attribute_values.${index}.${valueIndex}`]} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                <Button variant="link" type="button" onClick={() => addAttributeValue(index)} className="w-full justify-start">
                                                    <PlusCircle className="size-4 mr-1" /> Agregar Valor
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    {data.attribute_names.length < 3 ? (
                                        <Button className="w-full justify-start p-4" variant="link" size="sm" type="button" onClick={addAttribute}>
                                            <PlusCircle className="size-4 mr-1" />
                                            Agregar otro opción
                                        </Button>
                                    ) : (null)}
                                </>
                            )}
                            {!showAttributes && data.attribute_names.length < 3 ? (
                                <Button className="w-full justify-start p-4" variant="link" size="sm" type="button" onClick={() => setShowAttributes(true)}>
                                    <PlusCircle className="size-4 mr-1" />
                                    Agregar opción
                                </Button>
                            ) : (null)}
                        </div>
                    </div>

                    {/* Combinations Table - Only show if there are attribute values to form combinations */}
                    {showAttributes && data.prices && data.prices.length > 0 && data.prices[0].combination_attribute_value.length > 0 ? (
                        <Table>
                            <TableCaption>
                                Inventario total en la ubicación de la tienda: {calculateTotalStock()} disponibles
                            </TableCaption>
                            <TableHeader className="bg-gray-100 dark:bg-gray-800">
                                <TableRow>
                                    <TableHead className="w-[100px]">Combinaciones</TableHead>
                                    <TableHead>Precio</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Código de Barras</TableHead>
                                    <TableHead>SKU</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.prices.map((combinationObject) => {
                                    // Extract attribute value names for display
                                    const combinationDisplay = combinationObject.combination_attribute_value
                                        .map(attrVal => attrVal.attribute_value.attribute_value_name)
                                        .join(", ");

                                    // Use combinationObject.id as the key if it exists, otherwise use _key for new combinations
                                    const rowKey = combinationObject.id || combinationObject._key;

                                    return (
                                        <TableRow key={rowKey}>
                                            <TableCell>{combinationDisplay}</TableCell>
                                            <TableCell className="p-1">
                                                <TextInput
                                                    type="number"
                                                    value={combinationObject.combination_price}
                                                    onChange={(e) => handlePriceChange(rowKey, e.target.value)}
                                                />
                                                {localErrors[`price_${rowKey}`] && <InputError message={localErrors[`price_${rowKey}`]} />}
                                            </TableCell>
                                            <TableCell className="p-1">
                                                <TextInput
                                                    type="number"
                                                    value={combinationObject.stock}
                                                    onChange={(e) => handleStockChange(rowKey, e.target.value)}
                                                />
                                                {localErrors[`stock_${rowKey}`] && <InputError message={localErrors[`stock_${rowKey}`]} />}
                                            </TableCell>
                                            <TableCell className="p-1">
                                                <TextInput
                                                    type="text"
                                                    value={combinationObject.product_barcode || ''}
                                                    onChange={(e) => handleBarcodeChange(rowKey, e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell className="p-1">
                                                <TextInput
                                                    type="text"
                                                    value={combinationObject.product_sku || ''}
                                                    onChange={(e) => handleSkuChange(rowKey, e.target.value)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
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
            </div>
        </>
    );
}