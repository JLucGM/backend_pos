/**
 * Calcula el stock total para una tienda específica
 */
export const calculateStoreTotalStock = (prices, storeId) => {
    if (!prices || !Array.isArray(prices)) return 0;
    
    return prices.reduce((total, combo) => {
        const storeStock = combo.stocks_by_store?.[storeId]?.stock || 0;
        return total + parseInt(storeStock || 0);
    }, 0);
};

/**
 * Calcula el stock total para todas las tiendas (para compatibilidad)
 */
export const calculateTotalStock = (prices) => {
    if (!prices || !Array.isArray(prices)) return 0;
    
    let total = 0;
    prices.forEach(combo => {
        // Sumar stocks de todas las tiendas para esta combinación
        if (combo.stocks_by_store) {
            Object.values(combo.stocks_by_store).forEach(storeData => {
                total += parseInt(storeData.stock || 0);
            });
        }
    });
    return total;
};

export const calculateStock = (product, combinationId = null, storeId = null) => {
    if (!product || !product.stocks) return 0;
    
    const stock = product.stocks.find(s => 
        s.combination_id === combinationId && 
        (storeId === null || s.store_id == storeId) // Filtrar por storeId si se proporciona
    );
    
    return stock ? parseInt(stock.quantity) : 0;
};