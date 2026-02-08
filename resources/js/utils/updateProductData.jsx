/**
 * Actualiza los datos de producto (precios, stocks, barcodes, skus) para un identificador específico.
 * @param {Object} data - Estado actual de datos.
 * @param {Function} setData - Función para actualizar estado.
 * @param {string} identifier - Identificador (e.g., 'default' o ID de combinación).
 * @param {Object} updates - Objeto con campos a actualizar.
 * @param {boolean} showAttributes - Si se muestran atributos.
 */
export const updateProductData = (data, setData, identifier, updates, showAttributes) => {
    if (!showAttributes) {
        // Para productos simples, actualiza el precio del producto
        setData('product_price', updates.combination_price || data.product_price || "0");
    } else {
        // Para productos con atributos, actualiza el array prices
        const updatedPrices = data.prices.map(combo =>
            (combo.id === identifier || combo._key === identifier)
                ? { ...combo, ...updates }
                : combo
        );
        setData('prices', updatedPrices);
    }
};