import { useEffect } from 'react';

/**
 * Hook para recalcular totales de orden (subtotal, tax, discounts, total).
 * @param {Object} data - Datos de la orden (order_items, subtotal, etc.).
 * @param {Object} appliedManualDiscount - De useDiscounts.
 * @param {number} orderTotalAutomaticDiscount - De useDiscounts.
 * @param {Function} setData - Actualiza totales.
 * @param {boolean} isEdit - Modo edición (opcional).
 * @returns {void} - Solo side-effect.
 */
export const useOrderTotals = (data, appliedManualDiscount, orderTotalAutomaticDiscount, setData, isEdit) => {
    useEffect(() => {
        // Función auxiliar para parsear números de forma segura
        const safeParseFloat = (value) => {
            const parsed = parseFloat(value);
            return isNaN(parsed) ? 0 : parsed;  // Si no es un número, devuelve 0
        };

        // Calcula subtotal de ítems con validación
        const itemsSubtotal = data.order_items.reduce((sum, item) => sum + safeParseFloat(item.subtotal), 0);
        const itemsTaxAmount = data.order_items.reduce((sum, item) => sum + safeParseFloat(item.tax_amount), 0);
        const itemsDiscounts = data.order_items.reduce((sum, item) => sum + safeParseFloat(item.discount_amount), 0);

        let manualDiscount = 0;
        if (appliedManualDiscount && appliedManualDiscount.applies_to === 'order_total') {
            manualDiscount = safeParseFloat(data.manual_discount_amount);
        }
        const orderTotalDiscount = safeParseFloat(orderTotalAutomaticDiscount);  // Asegura que sea un número
        const globalDiscounts = manualDiscount + orderTotalDiscount;

        const totalDiscounts = itemsDiscounts + globalDiscounts;
        const finalTotal = itemsSubtotal + itemsTaxAmount + safeParseFloat(data.totalshipping) - globalDiscounts;  // Usa safeParseFloat para totalshipping

        // Actualiza data con los nuevos valores
        setData(prevData => ({
            ...prevData,
            subtotal: itemsSubtotal,
            tax_amount: itemsTaxAmount,
            totaldiscounts: totalDiscounts,
            total: finalTotal,
            manual_discount_amount: manualDiscount,
        }));
    }, [data.order_items, data.totalshipping, appliedManualDiscount, orderTotalAutomaticDiscount, setData, isEdit]);
};
