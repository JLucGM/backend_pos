import React, { useEffect, useRef } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import DivSection from '@/Components/ui/div-section';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { PlusCircle } from 'lucide-react';
import { customStyles } from '@/hooks/custom-select';
import { Input } from '@/Components/ui/input';
import { TrashIcon } from '@heroicons/react/24/outline';
import Checkbox from '@/Components/Checkbox';
import TextAreaRich from '@/Components/ui/TextAreaRich';
import { calculateTotalStock } from '@/utils/calculateTotalStock';
import { useProductAttributes } from '@/hooks/useProductAttributes';  // Nuevo import
import { useSelectOptions } from '@/hooks/useSelectOptions';
import { useImageManagement } from '@/hooks/useImageManagement';
import { useLocalErrors } from '@/hooks/useLocalErrors';
import { useProductDataHandlers } from '@/hooks/useProductDataHandlers';
import ProductBasicInfo from '@/Components/Products/ProductBasicInfo';
import ProductPricing from '@/Components/Products/ProductPricing';
import AttributeSection from '@/Components/Products/AttributeSection';
import ProductSettings from '@/Components/Products/ProductSettings';

export default function ProductsForm({ data, categories, taxes, product = null, setData, errors }) {
    console.log('Rendering ProductsForm with showAttributes:', product && product.combinations.length > 0);
    const { categoryOptions, taxOptions, statusOptions } = useSelectOptions(categories, taxes);

    const {
        showAttributes,
        setShowAttributes,
        addAttribute,
        removeAttribute,
        handleAttributeChange,
        handleAttributeValueChange,
        addAttributeValue,
        removeAttributeValue,
    } = useProductAttributes(data, setData, product);

    // Handle category selection change
    const handleCategoryChange = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setData('categories', selectedValues);
    };

    const { localErrors, validateAndSetError } = useLocalErrors();
    const { handlePriceChange, handleStockChange, handleBarcodeChange, handleSkuChange } = useProductDataHandlers(data, setData, showAttributes, validateAndSetError);

    const { handleDeleteImage } = useImageManagement(product);

    // Agrega este useEffect para poblar data.prices desde product.combinations en edit
    useEffect(() => {
        if (product && product.combinations && product.combinations.length > 0) {
            // Transforma combinations en prices
            const pricesFromCombinations = product.combinations.map((combination) => {
                // Obtén stock relacionado
                const stock = product.stocks ? product.stocks.find(s => s.combination_id === combination.id) : null;

                // Construye combination_attribute_value
                const combinationAttributeValue = combination.combination_attribute_value.map((cav) => ({
                    attribute_value: {
                        attribute_value_name: cav.attribute_value.attribute_value_name,
                    },
                }));

                return {
                    id: combination.id,
                    _key: 'existing_' + combination.id,
                    combination_price: combination.combination_price,
                    stock: stock ? stock.quantity : 0,
                    product_barcode: stock ? stock.product_barcode : '',
                    product_sku: stock ? stock.product_sku : '',
                    combination_attribute_value: combinationAttributeValue,
                };
            });

            setData('prices', pricesFromCombinations);

            // Pobla attribute_names y attribute_values desde combinations
            const attributeNames = [];
            const attributeValues = [];

            product.combinations.forEach((combination) => {
                combination.combination_attribute_value.forEach((cav, index) => {
                    if (!attributeNames.includes(cav.attribute_value.attribute.attribute_name)) {
                        attributeNames.push(cav.attribute_value.attribute.attribute_name);
                        attributeValues.push([cav.attribute_value.attribute_value_name]);
                    } else {
                        const attrIndex = attributeNames.indexOf(cav.attribute_value.attribute.attribute_name);
                        if (!attributeValues[attrIndex].includes(cav.attribute_value.attribute_value_name)) {
                            attributeValues[attrIndex].push(cav.attribute_value.attribute_value_name);
                        }
                    }
                });
            });

            setData('attribute_names', attributeNames);
            setData('attribute_values', attributeValues);
        }
    }, [product, setData]);
    return (
        <>
            <div className="col-span-full md:col-span-2">
                <ProductBasicInfo
                    data={data}
                    setData={setData}
                    errors={errors}
                    categoryOptions={categoryOptions}
                    handleCategoryChange={handleCategoryChange}
                    handleDeleteImage={handleDeleteImage}
                    product={product}
                />

                {/* Section for simple product pricing and stock (when no attributes are active) */}
                {!showAttributes && (
                    <ProductPricing
                        data={data}
                        setData={setData}
                        errors={errors}
                        handlePriceChange={handlePriceChange}
                        handleSkuChange={handleSkuChange}
                        handleBarcodeChange={handleBarcodeChange}
                        handleStockChange={handleStockChange}
                    />
                )}

                <AttributeSection
                    data={data}
                    errors={errors}
                    showAttributes={showAttributes}
                    setShowAttributes={setShowAttributes}
                    addAttribute={addAttribute}
                    removeAttribute={removeAttribute}
                    handleAttributeChange={handleAttributeChange}
                    handleAttributeValueChange={handleAttributeValueChange}
                    addAttributeValue={addAttributeValue}
                    removeAttributeValue={removeAttributeValue}
                    handlePriceChange={handlePriceChange}
                    handleStockChange={handleStockChange}
                    handleBarcodeChange={handleBarcodeChange}
                    handleSkuChange={handleSkuChange}
                    localErrors={localErrors}
                    setData={setData}
                />
            </div>

            <div className="col-span-full md:col-span-1">
                <ProductSettings
                    data={data}
                    setData={setData}
                    errors={errors}
                    statusOptions={statusOptions}
                    taxOptions={taxOptions}
                />
            </div>
        </>
    );
}