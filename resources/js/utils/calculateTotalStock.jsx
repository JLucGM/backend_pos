/**
 * Calcula el stock total de todas las combinaciones de precios.
 * @param {Array} prices - Array de objetos de precios (cada uno con una propiedad 'stock').
 * @returns {number} - Stock total.
 */
export const calculateTotalStock = (prices) => {
    if (!prices || !Array.isArray(prices)) return 0;
    return prices.reduce((total, combo) => total + (parseFloat(combo.stock) || 0), 0);
};