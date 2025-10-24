import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { calculateAndMergeCombinations } from '@/utils/calculateAndMergeCombinations';
import { addNewAttribute, removeAttributeByIndex } from '@/utils/attributeUtils';
import { resetToSimpleProduct } from '@/utils/resetToSimpleProduct';

export const useProductAttributes = (data, setData, product) => {
    const [showAttributes, setShowAttributes] = useState(false);

    // Inicializar showAttributes basado en el producto existente
    useEffect(() => {
        if (product && product.combinations.length > 0) {
            setShowAttributes(true);
            // console.log(showAttributes)
        }
    }, [product]);

    // Resetear precios cuando se activan atributos
    useEffect(() => {
        if (showAttributes) {
            // Limpiar campos simples cuando se activan atributos (modo variable)
            setData('product_price', '0');
            setData('product_price_discount', '');
            setData('quantity', '0');
            setData('product_sku', '');
            setData('product_barcode', '');
            setData('prices', []);  // Ya estaba, pero lo mantenemos
        } else {
            // Limpiar combinaciones cuando se desactivan atributos (modo simple)
            setData('prices', []);
            setData('attribute_names', []);
            setData('attribute_values', []);
        }
    }, [showAttributes, setData]);

    // Calcular y fusionar combinaciones cuando cambian atributos o precio base
    useEffect(() => {
        if (!showAttributes) return;
        const currentPrices = Array.isArray(data.prices) ? data.prices : [];
        const { newPricesArray, newStocksObj, newBarcodesObj, newSkusObj } = calculateAndMergeCombinations(
            data.attribute_names,
            data.attribute_values,
            currentPrices,
            data.product_price
        );
        setData('prices', newPricesArray);
        setData('stocks', newStocksObj);
        setData('barcodes', newBarcodesObj);
        setData('skus', newSkusObj);
    }, [data.attribute_names, data.attribute_values, data.product_price, showAttributes, setData]);


    // Handlers para atributos
    const addAttribute = () => {
        try {
            const { newNames, newValues } = addNewAttribute(data.attribute_names, data.attribute_values);
            setData('attribute_names', newNames);
            setData('attribute_values', newValues);
            setShowAttributes(true);
        } catch (error) {
            toast(error.message, { description: "Límite alcanzado." });
        }
    };

    const removeAttribute = (index) => {
        const { newNames, newValues } = removeAttributeByIndex(data.attribute_names, data.attribute_values, index);
        setData('attribute_names', newNames);
        setData('attribute_values', newValues);
        if (newNames.length === 0) {
            setShowAttributes(false);
            resetToSimpleProduct(data, setData);
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
        newValues[index] = [...newValues[index], ""];
        setData('attribute_values', newValues);
    };

    const removeAttributeValue = (attributeIndex, valueIndex) => {
        const newAttributeValues = [...data.attribute_values];
        newAttributeValues[attributeIndex].splice(valueIndex, 1);
        setData('attribute_values', newAttributeValues);
    };

    return {
        showAttributes,
        setShowAttributes,
        addAttribute,
        removeAttribute,
        handleAttributeChange,
        handleAttributeValueChange,
        addAttributeValue,
        removeAttributeValue,
    };
};