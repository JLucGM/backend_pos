// src/hooks/useDiscountsAndGiftCards.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import {
    calculateDiscount,
    calculateDiscountedPrice,
    calculateDiscountedSubtotal,
    isDiscountApplicable
} from '@/utils/discountUtils';

/**
 * Hook unificado para manejar descuentos manuales y gift cards en órdenes.
 * @param {Object} data - Datos de la orden.
 * @param {Array} discounts - Descuentos disponibles.
 * @param {Array} users - Lista completa de usuarios (para acceder a gift_cards).
 * @param {Object} selectedUser - Usuario seleccionado del select (con value y label).
 * @param {Array} products - Productos para descuentos.
 * @param {Function} setData - Actualiza data.
 * @param {Object} appliedGiftCard - Datos de gift card aplicada en edición (opcional).
 * @returns {Object} Estados y funciones.
 */
export const useDiscountsAndGiftCards = (data, discounts, users, selectedUser, products, setData, appliedGiftCard = null) => {
    // NUEVO: Inicializa code con el código de la gift card aplicada si existe
    const [code, setCode] = useState(() => {
        if (appliedGiftCard) {
            return appliedGiftCard.code;
        }
        return data.manual_discount_code || '';
    });
    const [appliedDiscount, setAppliedDiscount] = useState(null);
    const [appliedGiftCardHook, setAppliedGiftCardHook] = useState(null);
    const [error, setError] = useState('');

    // Limpia error al cambiar código
    useEffect(() => {
        setError('');
    }, [code]);

    // Obtén el usuario completo usando selectedUser.value
    const fullUser = useMemo(() => {
        return users.find(u => u.id === selectedUser?.value) || null;
    }, [users, selectedUser]);

    // findApplicableDiscount (de useDiscounts)
    const findApplicableDiscount = useCallback((productId, combinationId = null) => {
        const product = products.find(p => p.id === productId);
        if (!product || !product.discounts) return null;
        const activeDiscounts = product.discounts.filter(discount =>
            discount.automatic && isDiscountApplicable(discount)
        );
        return activeDiscounts.find(discount => {
            const pivotCombId = discount.pivot?.combination_id;
            if (combinationId !== null) {
                return pivotCombId === combination_id;
            } else {
                return pivotCombId === null;
            }
        });
    }, [products]);

    // orderTotalAutomaticDiscount (de useDiscounts)
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

    // handleApply: Intenta descuento primero, luego gift card
    const handleApply = useCallback(async () => {
        if (!code.trim()) return;
        setError('');

        // 1. Intenta aplicar como descuento
        const manualDiscount = discounts.find(d =>
            d.code === code.trim() &&
            !d.automatic &&
            isDiscountApplicable(d)
        );

        if (manualDiscount) {
            // **NUEVO: Verifica usage_limit usando usages_count**
            if (manualDiscount.usage_limit && manualDiscount.usages_count >= manualDiscount.usage_limit) {
                const errorMsg = 'Código de descuento agotado.';
                setError(errorMsg);
                toast.error(errorMsg);
                setAppliedDiscount(null);
                setData('manual_discount_code', null);
                setData('manual_discount_amount', 0);
                return;
            }

            // Verifica minimum_order_amount temprano
            if (manualDiscount.minimum_order_amount && data.subtotal < manualDiscount.minimum_order_amount) {
                const errorMsg = `Monto mínimo requerido: $${manualDiscount.minimum_order_amount}`;
                setError(errorMsg);
                toast.error(errorMsg);
                setAppliedDiscount(null);
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
                setData('manual_discount_code', manualDiscount.code);
                setData('manual_discount_amount', totalManualDiscountAmount);
                setAppliedDiscount(manualDiscount);
                toast.success(`Descuento global aplicado: ${manualDiscount.name} - Ahorro: $${totalManualDiscountAmount.toFixed(2)}`);
            } else if (manualDiscount.applies_to === 'product') {
                if (!manualDiscount.products || manualDiscount.products.length === 0) {
                    const errorMsg = 'Este descuento no tiene productos asociados.';
                    setError(errorMsg);
                    toast.error(errorMsg);
                    setAppliedDiscount(null);
                    setData('manual_discount_code', null);
                    setData('manual_discount_amount', 0);
                    return;
                }
                // FIX: Mapea productos con combination_id si existe
                const eligibleProducts = manualDiscount.products.map(p => ({
                    product_id: p.id,
                    combination_id: p.pivot?.combination_id || null
                }));
                const eligibleItems = data.order_items.filter(item => {
                    return eligibleProducts.some(ep => 
                        ep.product_id === item.product_id && 
                        (ep.combination_id === null || ep.combination_id === item.combination_id)
                    );
                });

                if (eligibleItems.length === 0) {
                    // FIX: Si no hay productos elegibles, no aplica nada (sin error)
                    setAppliedDiscount(null);
                    setData('manual_discount_code', null);
                    setData('manual_discount_amount', 0);
                    return;
                }
                const updatedItems = data.order_items.map(item => {
                    const isEligible = eligibleProducts.some(ep => 
                        ep.product_id === item.product_id && 
                        (ep.combination_id === null || ep.combination_id === item.combination_id)
                    );
                    if (isEligible) {
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
                setData('manual_discount_code', manualDiscount.code);
                setAppliedDiscount({ ...manualDiscount, applied_to: appliedItems });
                toast.success(`Descuento aplicado a ${eligibleItems.length} producto(s): ${manualDiscount.name} - Ahorro: $${totalManualDiscountAmount.toFixed(2)}`);
            } else if (manualDiscount.applies_to === 'category') {
                if (!manualDiscount.categories || manualDiscount.categories.length === 0) {
                    const errorMsg = 'Este descuento no tiene categorías asociadas.';
                    setError(errorMsg);
                    toast.error(errorMsg);
                    setAppliedDiscount(null);
                    setData('manual_discount_code', null);
                    setData('manual_discount_amount', 0);
                    return;
                }

                const eligibleCategoryIds = manualDiscount.categories.map(c => c.id);
                const eligibleItems = data.order_items.filter(item => {
                    return item.categories && item.categories.some(cat => eligibleCategoryIds.includes(cat.id));
                });
                if (eligibleItems.length === 0) {
                    // FIX: Si no hay productos elegibles, no aplica nada (sin error)
                    setAppliedDiscount(null);
                    setData('manual_discount_code', null);
                    setData('manual_discount_amount', 0);
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
                setData('manual_discount_code', manualDiscount.code);
                setAppliedDiscount({ ...manualDiscount, applied_to: appliedItems, type: 'category' });
                toast.success(`Descuento por categoría aplicado a ${eligibleItems.length} producto(s): ${manualDiscount.name} - Ahorro: $${totalManualDiscountAmount.toFixed(2)}`);
            }

            setAppliedGiftCardHook(null); // Limpia gift card si se aplicó descuento
            setData('gift_card_id', null);
            setData('gift_card_amount', 0);
            return;
        }

        // 2. Si no es descuento, intenta como gift card
        if (!fullUser || !fullUser.gift_cards) {
            const errorMsg = 'Código no válido. Selecciona un usuario para gift cards.';
            setError(errorMsg);
            toast.error(errorMsg);
            return;
        }

        const giftCard = fullUser.gift_cards.find(gc => gc.code === code.trim());
        if (!giftCard) {
            const errorMsg = 'Código no encontrado como descuento ni gift card.';
            setError(errorMsg);
            toast.error(errorMsg);
            return;
        }

        if (!giftCard.is_active) {
            const errorMsg = 'Esta gift card no está activa.';
            setError(errorMsg);
            toast.error(errorMsg);
            return;
        }

        const now = new Date();
        const expiration = new Date(giftCard.expiration_date);
        if (now > expiration) {
            const errorMsg = 'Esta gift card ha expirado.';
            setError(errorMsg);
            toast.error(errorMsg);
            return;
        }

        const currentBalance = parseFloat(giftCard.current_balance);
        if (currentBalance <= 0) {
            const errorMsg = 'Esta gift card no tiene balance disponible.';
            setError(errorMsg);
            toast.error(errorMsg);
            return;
        }

        const remainingTotal = parseFloat(data.total) || 0;
        const amountToApply = Math.min(currentBalance, remainingTotal);
        if (amountToApply <= 0) {
            const errorMsg = 'El total de la orden ya está cubierto o es cero.';
            setError(errorMsg);
            toast.error(errorMsg);
            return;
        }

        setAppliedGiftCardHook({ ...giftCard, amount_used: amountToApply });
        setData('gift_card_id', giftCard.id);
        setData('gift_card_amount', amountToApply);
        setAppliedDiscount(null); // Limpia descuento si se aplicó gift card
        setData('manual_discount_code', null);
        setData('manual_discount_amount', 0);
        toast.success(`Gift card aplicada: ${giftCard.code} - Monto usado: $${amountToApply.toFixed(2)}`);
    }, [code, discounts, fullUser, data.subtotal, data.order_items, data.total, setData]);

    return {
        code,
        setCode,
        appliedDiscount,
        appliedGiftCard: appliedGiftCardHook,
        handleApply,
        orderTotalAutomaticDiscount,
        findApplicableDiscount,
        error,
    };
};
