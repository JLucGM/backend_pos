/**
 * Calcula el stock disponible para un producto o combinación específica.
 * @param {Object} product - Producto con array 'stocks' (cada stock tiene combination_id y quantity).
 * @param {number|null} combinationId - ID de combinación (null para productos simples).
 * @returns {number} Stock disponible (0 si no hay o inválido).
 */
export const calculateStock = (product, combinationId = null) => {
    if (!product.stocks || product.stocks.length === 0) return 0;

    if (combinationId !== null) {
        const stockEntry = product.stocks.find(s => s.combination_id === combinationId);
        return stockEntry ? parseInt(stockEntry.quantity) : 0;
    } else {
        const stockEntry = product.stocks.find(s => s.combination_id === null);
        return stockEntry ? parseInt(stockEntry.quantity) : 0;
    }
};
