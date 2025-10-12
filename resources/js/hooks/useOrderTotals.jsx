// src/hooks/useOrderTotals.js
import { useEffect } from 'react';

/**
 * Hook para recalcular totales de orden (subtotal, tax, discounts, total).
 * @param {Object} data - Datos de la orden (order_items, subtotal, etc.).
 * @param {Object} appliedManualDiscount - De useDiscounts.
 * @param {number} orderTotalAutomaticDiscount - De useDiscounts.
 * @param {Function} setData - Actualiza totales.
 * @param {boolean} isEdit - Modo edición (opcional, para lógica futura).
 * @returns {void} - Solo side-effect (actualiza data via setData).
 */
export const useOrderTotals = (data, appliedManualDiscount, orderTotalAutomaticDiscount, setData, isEdit) => {
    useEffect(() => {
        const itemsSubtotal = data.order_items.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0);
        const itemsTaxAmount = data.order_items.reduce((sum, item) => sum + parseFloat(item.tax_amount || 0), 0);
        const itemsDiscounts = data.order_items.reduce((sum, item) => sum + parseFloat(item.discount_amount || 0), 0);

        let manualDiscount = 0;
        if (appliedManualDiscount && appliedManualDiscount.applies_to === 'order_total') {
            manualDiscount = parseFloat(data.manual_discount_amount || 0);
        }
        const orderTotalDiscount = orderTotalAutomaticDiscount;
        const globalDiscounts = manualDiscount + orderTotalDiscount;

        const totalDiscounts = itemsDiscounts + globalDiscounts;
        const finalTotal = itemsSubtotal + itemsTaxAmount - globalDiscounts;

        setData(prevData => ({
            ...prevData,
            subtotal: itemsSubtotal,
            tax_amount: itemsTaxAmount,
            totaldiscounts: totalDiscounts,
            total: finalTotal,
            manual_discount_amount: manualDiscount,
        }));
    }, [data.order_items, appliedManualDiscount, orderTotalAutomaticDiscount, setData, isEdit]);
};
