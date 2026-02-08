import React, { useEffect } from 'react';
import ProductBasicInfo from '@/Components/Products/ProductBasicInfo';
import ProductPricing from '@/Components/Products/ProductPricing';
import AttributeSection from '@/Components/Products/AttributeSection';
import ProductSettings from '@/Components/Products/ProductSettings';
import { useSelectOptions } from '@/hooks/useSelectOptions';
import { useProductAttributes } from '@/hooks/useProductAttributes';
import { useLocalErrors } from '@/hooks/useLocalErrors';
import { useProductDataHandlers } from '@/hooks/useProductDataHandlers';
import { useImageManagement } from '@/hooks/useImageManagement';

export default function ProductsForm({ data, categories, taxes, stores, product = null, setData, errors }) {
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
    } = useProductAttributes(data, setData, product, stores);

    const handleCategoryChange = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setData('categories', selectedValues);
    };

    const { localErrors, validateAndSetError } = useLocalErrors();
    const {
        handlePriceChange,
        handleCombinationStoreStockChange,
        handleCombinationStoreBarcodeChange,
        handleCombinationStoreSkuChange,
        handleSimpleProductChange,
        handleSimpleStoreStockChange,
        handleSimpleStoreSkuChange,
        handleSimpleStoreBarcodeChange
    } = useProductDataHandlers(data, setData, showAttributes, validateAndSetError, stores);

    const { handleDeleteImage } = useImageManagement(product);

    // Poblar datos del producto existente para edición
    useEffect(() => {
        if (product && product.combinations && product.combinations.length > 0) {
                    // console.log('Producto con combinaciones cargado desde el controlador');
            // Transformar combinaciones en prices con datos por tienda
            const pricesFromCombinations = product.combinations.map((combination) => {
                // Obtener stocks relacionados por tienda
                const stocksByStore = {};
                product.stocks?.forEach(stock => {
                    if (stock.combination_id === combination.id) {
                        stocksByStore[stock.store_id] = {
                            stock: stock.quantity,
                            product_barcode: stock.product_barcode,
                            product_sku: stock.product_sku
                        };
                    }
                });

                const combinationAttributeValue = combination.combination_attribute_value.map((cav) => ({
                    attribute_value: {
                        attribute_value_name: cav.attribute_value.attribute_value_name,
                    },
                }));

                return {
                    id: combination.id,
                    _key: 'existing_' + combination.id,
                    combination_price: combination.combination_price,
                    stocks_by_store: stocksByStore,
                    combination_attribute_value: combinationAttributeValue,
                };
            });

            setData('prices', pricesFromCombinations);

            // Poblar attribute_names y attribute_values
            const attributeNames = [];
            const attributeValues = [];

            product.combinations.forEach((combination) => {
                combination.combination_attribute_value.forEach((cav) => {
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

                {!showAttributes && (
                    <ProductPricing
                        data={data}
                        setData={setData}
                        errors={errors}
                        handleSimpleProductChange={handleSimpleProductChange}
                        handleSimpleStoreStockChange={handleSimpleStoreStockChange}
                        handleSimpleStoreSkuChange={handleSimpleStoreSkuChange}
                        handleSimpleStoreBarcodeChange={handleSimpleStoreBarcodeChange}
                        stores={stores}
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
                    handleCombinationStoreStockChange={handleCombinationStoreStockChange}
                    handleCombinationStoreBarcodeChange={handleCombinationStoreBarcodeChange}
                    handleCombinationStoreSkuChange={handleCombinationStoreSkuChange}
                    localErrors={localErrors}
                    setData={setData}
                    stores={stores}
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