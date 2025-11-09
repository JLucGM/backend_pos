// src/hooks/useDiscounts.js
import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import {
    calculateDiscount,
    calculateDiscountedPrice,
    calculateDiscountedSubtotal,
    isDiscountApplicable
} from '@/utils/discountUtils';

/**
 * Hook personalizado para manejar descuentos manuales y automáticos en órdenes.
 * @param {Object} data - Datos de la orden (subtotal, order_items, manual_discount_*).
 * @param {Array} discounts - Array de descuentos disponibles (ahora incluye usages_count).
 * @param {Function} setData - Función para actualizar data.
 * @returns {Object} Estados y funciones para descuentos.
 */
export const useDiscounts = (data, discounts, setData, products = []) => {
    const [manualDiscountCode, setManualDiscountCode] = useState(data.manual_discount_code || '');
    const [manualDiscountAmount, setManualDiscountAmount] = useState(parseFloat(data.manual_discount_amount) || 0);
    const [appliedManualDiscount, setAppliedManualDiscount] = useState(null);
    const [manualDiscountError, setManualDiscountError] = useState(''); // ← NUEVO: Estado para error local

    // Limpia error al cambiar código
    useEffect(() => {
        setManualDiscountError('');
    }, [manualDiscountCode]);

    // findApplicableDiscount (lógica para descuentos automáticos por producto/combination)
    const findApplicableDiscount = useCallback((productId, combinationId = null) => {
        const product = products.find(p => p.id === productId);
        if (!product || !product.discounts) return null;
        const activeDiscounts = product.discounts.filter(discount =>
            discount.automatic && isDiscountApplicable(discount)
        );
        return activeDiscounts.find(discount => {
            const pivotCombId = discount.pivot?.combination_id;
            if (combinationId !== null) {
                return pivotCombId === combinationId;
            } else {
                return pivotCombId === null;
            }
        });
    }, [products]);

    // handleManualDiscountApply (lógica completa para aplicar descuentos manuales, con validación de usage_limit)
    const handleManualDiscountApply = useCallback(async () => {
        if (!manualDiscountCode.trim()) return;

        setManualDiscountError(''); // Limpia error previo

        const manualDiscount = discounts.find(d =>
            d.code === manualDiscountCode.trim() &&
            !d.automatic &&
            isDiscountApplicable(d)
        );

        if (!manualDiscount) {
            setManualDiscountError('Código de descuento inválido.');
            setManualDiscountAmount(0);
            setAppliedManualDiscount(null);
            setData('manual_discount_code', null);
            setData('manual_discount_amount', 0);
            return;
        }

        // **NUEVO: Verifica usage_limit usando usages_count**
        if (manualDiscount.usage_limit && manualDiscount.usages_count >= manualDiscount.usage_limit) {
            setManualDiscountError('Código de descuento agotado.'); // ← Mensaje deseado
            setManualDiscountAmount(0);
            setAppliedManualDiscount(null);
            setData('manual_discount_code', null);
            setData('manual_discount_amount', 0);
            return;
        }

        // Verifica minimum_order_amount temprano
        if (manualDiscount.minimum_order_amount && data.subtotal < manualDiscount.minimum_order_amount) {
            setManualDiscountError(`Monto mínimo requerido: $${manualDiscount.minimum_order_amount}`);
            setManualDiscountAmount(0);
            setAppliedManualDiscount(null);
            setData('manual_discount_code', null);
            setData('manual_discount_amount', 0);
            return;
        }

        // Aplica el descuento según applies_to
        let totalManualDiscountAmount = 0;
        let appliedItems = [];
        if (manualDiscount.applies_to === 'order_total') {
            const discountAmount = calculateDiscount(manualDiscount, data.subtotal, 1);
            totalManualDiscountAmount = discountAmount;
            setManualDiscountAmount(totalManualDiscountAmount);
            setAppliedManualDiscount(manualDiscount);
            setData('manual_discount_code', manualDiscount.code);
            setData('manual_discount_amount', totalManualDiscountAmount);
            toast.success(`Descuento global aplicado: ${manualDiscount.name} - Ahorro: $${totalManualDiscountAmount.toFixed(2)}`);
        } else if (manualDiscount.applies_to === 'product') {
            if (!manualDiscount.products || manualDiscount.products.length === 0) {
                setManualDiscountError('Este descuento no tiene productos asociados.');
                return;
            }
            const eligibleProductIds = manualDiscount.products.map(p => p.id);
            const eligibleItems = data.order_items.filter(item => eligibleProductIds.includes(item.product_id));

            if (eligibleItems.length === 0) {
                setManualDiscountError('No hay productos elegibles en el carrito para este descuento.');
                return;
            }
            const updatedItems = data.order_items.map(item => {
                if (eligibleProductIds.includes(item.product_id)) {
                    const originalPrice = item.original_price || item.product_price || 0;
                    const itemDiscountAmount = calculateDiscount(manualDiscount, originalPrice, item.quantity);
                    const discountedPrice = calculateDiscountedPrice(manualDiscount, originalPrice, item.quantity);
                    const discountedSubtotal = calculateDiscountedSubtotal(originalPrice, item.quantity, manualDiscount);
                    const newTaxAmount = discountedSubtotal * (item.tax_rate / 100);
                    appliedItems.push({ product_id: item.product_id, combination_id: item.combination_id });

                    return {
                        ...item,
                        discount_id: manualDiscount.id,
                        discount_type: manualDiscount.discount_type,
                        manual_discount_id: manualDiscount.id,
                        discount_amount: itemDiscountAmount,
                        discounted_price: discountedPrice,
                        subtotal: discountedSubtotal,
                        tax_amount: newTaxAmount,
                    };
                }
                return item;
            });
            totalManualDiscountAmount = eligibleItems.reduce((sum, item) => sum + calculateDiscount(manualDiscount, item.original_price || item.product_price || 0, item.quantity), 0);
            setData('order_items', updatedItems);
            setManualDiscountAmount(totalManualDiscountAmount);
            setAppliedManualDiscount({ ...manualDiscount, applied_to: appliedItems });
            setData('manual_discount_code', manualDiscount.code);
            toast.success(`Descuento aplicado a ${eligibleItems.length} producto(s): ${manualDiscount.name} - Ahorro: $${totalManualDiscountAmount.toFixed(2)}`);
        } else if (manualDiscount.applies_to === 'category') {
            if (!manualDiscount.categories || manualDiscount.categories.length === 0) {
                setManualDiscountError('Este descuento no tiene categorías asociadas.');
                return;
            }

            const eligibleCategoryIds = manualDiscount.categories.map(c => c.id);
            const eligibleItems = data.order_items.filter(item => {
                return item.categories && item.categories.some(cat => eligibleCategoryIds.includes(cat.id));
            });
            if (eligibleItems.length === 0) {
                setManualDiscountError('No hay productos de categorías elegibles en el carrito para este descuento.');
                return;
            }
            const updatedItems = data.order_items.map(item => {
                if (item.categories && item.categories.some(cat => eligibleCategoryIds.includes(cat.id))) {
                    const originalPrice = item.original_price || item.product_price || 0;
                    const itemDiscountAmount = calculateDiscount(manualDiscount, originalPrice, item.quantity);
                    const discountedPrice = calculateDiscountedPrice(manualDiscount, originalPrice, item.quantity);
                    const discountedSubtotal = calculateDiscountedSubtotal(originalPrice, item.quantity, manualDiscount);
                    const newTaxAmount = discountedSubtotal * (item.tax_rate / 100);
                    appliedItems.push({ product_id: item.product_id, combination_id: item.combination_id });

                    return {
                        ...item,
                        discount_id: manualDiscount.id,
                        discount_type: manualDiscount.discount_type,
                        manual_discount_id: manualDiscount.id,
                        discount_amount: itemDiscountAmount,
                        discounted_price: discountedPrice,
                        subtotal: discountedSubtotal,
                        tax_amount: newTaxAmount,
                    };
                }
                return item;
            });
            totalManualDiscountAmount = eligibleItems.reduce((sum, item) => sum + calculateDiscount(manualDiscount, item.original_price || item.product_price || 0, item.quantity), 0);
            setData('order_items', updatedItems);
            setManualDiscountAmount(totalManualDiscountAmount);
            setAppliedManualDiscount({ ...manualDiscount, applied_to: appliedItems, type: 'category' });
            setData('manual_discount_code', manualDiscount.code);
            toast.success(`Descuento por categoría aplicado a ${eligibleItems.length} producto(s): ${manualDiscount.name} - Ahorro: $${totalManualDiscountAmount.toFixed(2)}`);
        }
    }, [manualDiscountCode, discounts, data.subtotal, data.order_items, setData]);

    // orderTotalAutomaticDiscount (descuento automático por total de orden)
    const orderTotalAutomaticDiscount = useMemo(() => {
        const activeOrderDiscounts = discounts.filter(d =>
            d.automatic &&
            d.applies_to === 'order_total' &&
            isDiscountApplicable(d)
        );
        let applicable = null;
        let maxValue = 0;
        activeOrderDiscounts.forEach(d => {
            if (d.minimum_order_amount && data.subtotal < d.minimum_order_amount) return;
            if (d.value > maxValue) {
                applicable = d;
                maxValue = d.value;
            }
        });
        return applicable ? calculateDiscount(applicable, data.subtotal, 1) : 0;
    }, [discounts, data.subtotal]);

    return {
        manualDiscountCode,
        setManualDiscountCode,
        manualDiscountAmount,
        appliedManualDiscount,
        handleManualDiscountApply,
        orderTotalAutomaticDiscount,
        findApplicableDiscount,
        manualDiscountError, // ← NUEVO: Devuelve el error para mostrarlo en el componente
    };
};
