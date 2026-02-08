import { generateCombinations } from "./generateCombinations";

/**
 * Calcula y fusiona combinaciones de atributos con precios existentes.
 * @param {Array} attributeNames - Nombres de atributos.
 * @param {Array} attributeValues - Valores de atributos.
 * @param {Array} currentPrices - Precios actuales.
 * @param {string} basePrice - Precio base del producto.
 * @param {Array} stores - Lista de tiendas.
 * @returns {Object} - { newPricesArray, newStocksObj, newBarcodesObj, newSkusObj }
 */

export const calculateAndMergeCombinations = (attributeNames, attributeValues, currentPrices, basePrice, stores = []) => {
    const generatedCombinations = generateCombinations(attributeNames, attributeValues);
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
            // Inicializar stocks_by_store para cada tienda
            const stocksByStore = {};
            stores.forEach(store => {
                stocksByStore[store.id] = {
                    stock: "0",
                    product_barcode: "",
                    product_sku: ""
                };
            });

            newPricesArray.push({
                id: null,
                combination_price: basePriceNum.toString(), // Cada combinación inicia con el precio base
                stocks_by_store: stocksByStore,
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

    return { newPricesArray };
};