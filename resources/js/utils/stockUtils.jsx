/**
 * Calcula el stock disponible para un producto o combinación específica.
 * @param {Object} product - Producto con array 'stocks' (cada stock tiene combination_id y quantity).
 * @param {number|null} combinationId - ID de combinación (null para productos simples).
 * @returns {number} Stock disponible (0 si no hay o inválido).
 */
export const calculateStock = (product, combinationId = null, storeId = null) => {
    if (!product || !product.stocks) return 0;
    
    // Si no hay storeId especificado, sumar todos los stocks
    if (storeId === null) {
        const relevantStocks = product.stocks.filter(s => s.combination_id === combinationId);
        return relevantStocks.reduce((total, stock) => total + parseInt(stock.quantity || 0), 0);
    }
    
    // Si hay storeId, filtrar por store_id
    const stock = product.stocks.find(s => 
        s.combination_id === combinationId && 
        (storeId === null || s.store_id == storeId)
    );
    
    return stock ? parseInt(stock.quantity) : 0;
};
