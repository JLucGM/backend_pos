import { generateCombinations } from "./generateCombinations";

/**
 * Calcula y fusiona combinaciones de atributos con precios existentes.
 * @param {Array} attributeNames - Nombres de atributos.
 * @param {Array} attributeValues - Valores de atributos.
 * @param {Array} currentPrices - Precios actuales.
 * @param {string} basePrice - Precio base del producto.
 * @returns {Object} - { newPricesArray, newStocksObj, newBarcodesObj, newSkusObj }
 */
export const calculateAndMergeCombinations = (attributeNames, attributeValues, currentPrices, basePrice) => {
    const generatedCombinations = generateCombinations(attributeNames, attributeValues);  // Asume que importas generateCombinations aquí
    const newPricesArray = [];
    const basePriceNum = parseFloat(basePrice) || 0;

    generatedCombinations.forEach(comboValues => {
        const comboKey = comboValues.join(", ");
        const existingCombination = currentPrices.find(existingCombo => {
            if (existingCombo.id && existingCombo.combination_attribute_value?.length > 0) {
                const existingAttrValues = existingCombo.combination_attribute_value
                    .map(attrVal => attrVal.attribute_value.attribute_value_name)
                    .sort();
                return JSON.stringify(comboValues.sort()) === JSON.stringify(existingAttrValues);
            }
            return existingCombo._key === comboKey;
        });

        if (existingCombination) {
            newPricesArray.push(existingCombination);
        } else {
            newPricesArray.push({
                id: null,
                combination_price: basePriceNum.toString(),
                stock: "0",
                product_barcode: "",
                product_sku: "",
                combination_attribute_value: comboValues.map((val, idx) => ({
                    attribute_value: {
                        attribute_value_name: val,
                        attribute: {
                            attribute_name: attributeNames[idx] || ''
                        }
                    }
                })),
                _key: comboKey
            });
        }
    });

    const newStocksObj = {};
    const newBarcodesObj = {};
    const newSkusObj = {};
    newPricesArray.forEach(combo => {
        const identifier = combo.id || combo._key;
        newStocksObj[identifier] = combo.stock;
        newBarcodesObj[identifier] = combo.product_barcode;
        newSkusObj[identifier] = combo.product_sku;
    });

    return { newPricesArray, newStocksObj, newBarcodesObj, newSkusObj };
};