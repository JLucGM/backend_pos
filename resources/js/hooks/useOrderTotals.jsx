// src/hooks/useOrderTotals.js
import { useEffect } from 'react';

/**
 * Hook para recalcular totales de orden (subtotal, tax, discounts, total).
 * @param {Object} data - Datos de la orden (order_items, subtotal, etc.).
 * @param {Object} appliedManualDiscount - De useDiscounts.
 * @param {number} orderTotalAutomaticDiscount - De useDiscounts.
 * @param {number} giftCardAmount - Monto de gift card aplicada.
 * @param {Function} setData - Actualiza totales.
 * @returns {void} - Solo side-effect.
 */
export const useOrderTotals = (data, appliedManualDiscount, orderTotalAutomaticDiscount, giftCardAmount, setData) => {
    useEffect(() => {
        // Función auxiliar para parsear números de forma segura
        const safeParseFloat = (value) => {
            const parsed = parseFloat(value);
            return isNaN(parsed) ? 0 : parsed;
        };

        // Calcula subtotal de ítems con validación
        const itemsSubtotal = data.order_items.reduce((sum, item) => sum + safeParseFloat(item.subtotal), 0);
        const itemsTaxAmount = data.order_items.reduce((sum, item) => sum + safeParseFloat(item.tax_amount), 0);
        const itemsDiscounts = data.order_items.reduce((sum, item) => sum + safeParseFloat(item.discount_amount), 0);

        let manualDiscount = 0;
        if (appliedManualDiscount && appliedManualDiscount.applies_to === 'order_total') {
            manualDiscount = safeParseFloat(data.manual_discount_amount);
        }
        const orderTotalDiscount = safeParseFloat(orderTotalAutomaticDiscount);
        const globalDiscounts = manualDiscount + orderTotalDiscount;

        const totalDiscounts = itemsDiscounts + globalDiscounts + safeParseFloat(giftCardAmount); // Incluye gift card como descuento
        const finalTotal = itemsSubtotal + itemsTaxAmount + safeParseFloat(data.totalshipping) - globalDiscounts - safeParseFloat(giftCardAmount); // Resta gift card del total

        // Actualiza data con los nuevos valores
        setData(prevData => ({
            ...prevData,
            subtotal: itemsSubtotal,
            tax_amount: itemsTaxAmount,
            totaldiscounts: totalDiscounts,
            total: finalTotal,
            manual_discount_amount: manualDiscount,
            gift_card_amount: safeParseFloat(giftCardAmount), // Asegura que se actualice
        }));
    }, [data.order_items, data.totalshipping, appliedManualDiscount, orderTotalAutomaticDiscount, giftCardAmount, setData]);
};