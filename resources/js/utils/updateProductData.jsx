/**
 * Actualiza los datos de producto (precios, stocks, barcodes, skus) para un identificador específico.
 * @param {Object} data - Estado actual de datos.
 * @param {Function} setData - Función para actualizar estado.
 * @param {string} identifier - Identificador (e.g., 'default' o ID de combinación).
 * @param {Object} updates - Objeto con campos a actualizar (e.g., { combination_price: '10', stock: '5' }).
 * @param {boolean} showAttributes - Si se muestran atributos (afecta cómo se actualiza).
 */
export const updateProductData = (data, setData, identifier, updates, showAttributes) => {
    if (!showAttributes) {
        // Para productos simples, actualiza el array prices con un solo objeto
        setData('prices', [{
            id: null,
            combination_price: updates.combination_price || data.product_price || "0",
            stock: updates.stock || data.quantity || "0",
            product_barcode: updates.product_barcode || data.product_barcode || "",
            product_sku: updates.product_sku || data.product_sku || "",
            combination_attribute_value: [],
            _key: 'default'
        }]);
        // Actualiza objetos separados si es necesario
        if (updates.stock !== undefined) setData('stocks', { 'default': updates.stock });
        if (updates.product_barcode !== undefined) setData('barcodes', { 'default': updates.product_barcode });
        if (updates.product_sku !== undefined) setData('skus', { 'default': updates.product_sku });
    } else {
        // Para productos con atributos, actualiza el array prices
        const updatedPrices = data.prices.map(combo =>
            (combo.id === identifier || combo._key === identifier)
                ? { ...combo, ...updates }
                : combo
        );
        setData('prices', updatedPrices);
        // Actualiza objetos separados
        if (updates.stock !== undefined) {
            setData('stocks', { ...data.stocks, [identifier]: updates.stock });
        }
        if (updates.product_barcode !== undefined) {
            setData('barcodes', { ...data.barcodes, [identifier]: updates.product_barcode });
        }
        if (updates.product_sku !== undefined) {
            setData('skus', { ...data.skus, [identifier]: updates.product_sku });
        }
    }
};