// src/utils/discountUtils.js

/**
 * Calcula el monto del descuento basado en el tipo (porcentaje o fijo).
 * Esta es tu función original, pero ahora como util pura (sin useCallback).
 * @param {Object} discount - Objeto de descuento con: discount_type ('percentage' o 'fixed'), value (número).
 * @param {number} price - Precio base por unidad.
 * @param {number} quantity - Cantidad de ítems (default: 1).
 * @returns {number} Monto total del descuento aplicado.
 */
export const calculateDiscount = (discount, price, quantity = 1) => {
    if (!discount) return 0;
    const subtotal = price * quantity;
    if (discount.discount_type === 'percentage') {
        return Math.min(subtotal * (discount.value / 100), subtotal);
    } else {
        return discount.value * quantity;
    }
};

/**
 * Verifica si un descuento es aplicable (activo y dentro de fechas válidas).
 * Extraída de la lógica repetida en tu código (e.g., en findApplicableDiscount y handleManualDiscountApply).
 * @param {Object} discount - Objeto de descuento con: is_active, start_date, end_date.
 * @returns {boolean} True si se puede aplicar.
 */
export const isDiscountApplicable = (discount) => {
    if (!discount || !discount.is_active) return false;
    
    const now = new Date();
    const startDate = discount.start_date ? new Date(discount.start_date) : null;
    const endDate = discount.end_date ? new Date(discount.end_date) : null;
    
    // Si no hay start_date, asume válido desde siempre; si no hay end_date, asume indefinido.
    const dateValid = (!startDate || startDate <= now) && (!endDate || endDate >= now);
    
    return dateValid;
};

/**
 * Calcula el precio por unidad después del descuento (mínimo 0).
 * Útil para evitar repetir Math.max(0, ...) en handleAddProduct y handleQuantityChange.
 * @param {Object} discount - Objeto de descuento.
 * @param {number} originalPrice - Precio original por unidad.
 * @param {number} quantity - Cantidad.
 * @returns {number} Precio descontado por unidad.
 */
export const calculateDiscountedPrice = (discount, originalPrice, quantity = 1) => {
    const discountAmount = calculateDiscount(discount, originalPrice, quantity);
    return Math.max(0, originalPrice - (discountAmount / quantity));
};

/**
 * Calcula el subtotal después del descuento.
 * Útil para subtotales en ítems.
 * @param {number} originalPrice - Precio original por unidad.
 * @param {number} quantity - Cantidad.
 * @param {Object} discount - Objeto de descuento.
 * @returns {number} Subtotal descontado.
 */
export const calculateDiscountedSubtotal = (originalPrice, quantity, discount) => {
    const originalSubtotal = originalPrice * quantity;
    const discountAmount = calculateDiscount(discount, originalPrice, quantity);
    return originalSubtotal - discountAmount;
};
