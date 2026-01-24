// src/hooks/useOrderItems.js
import { useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { calculateDiscount, calculateDiscountedPrice } from '@/utils/discountUtils';
import { calculateStock } from '@/utils/stockUtils'; // FIX: Para stock dinámico siempre
import { getOrderItemsColumns } from '@/Pages/Orders/orderItemsColumns';
import { usePage } from '@inertiajs/react';

/**
 * Hook para manejar ítems de orden: cantidad, remover, columnas de DataTable.
 * @param {Object} data - Datos de la orden (order_items).
 * @param {Array} discounts - Descuentos para edit mode.
 * @param {Function} setData - Actualiza order_items.
 * @param {boolean} isDisabled - Deshabilita interacciones.
 * @param {Function} findApplicableDiscount - De useDiscounts para create mode.
 * @param {Array} products - Products para stock dinámico (siempre).
 * @returns {Object} Handlers y columnas para DataTable.
 */
export const useOrderItems = (data, discounts, setData, isDisabled, findApplicableDiscount, products = []) => {
    const settings = usePage().props.settings;

    // handleQuantityChange: Recalcula ítem con descuento/stock (FIX: Stock SIEMPRE dinámico de products)
    const handleQuantityChange = useCallback((index, newQuantity) => {
        if (!data.order_items || !Array.isArray(data.order_items) || index < 0 || index >= data.order_items.length) {
            console.warn('Invalid quantity change:', { index, length: data.order_items?.length });
            return;
        }

        const quantity = Math.max(1, parseInt(newQuantity) || 1);
        const item = data.order_items[index];
        if (!item) return;

        const taxRate = item.tax_rate ? parseFloat(item.tax_rate) / 100 : 0;
        const originalPrice = item.original_price || item.product_price || 0;

        let discount = findApplicableDiscount(item.product_id, item.combination_id);

        const newDiscountAmount = discount ? calculateDiscount(discount, originalPrice, quantity) : 0;
        const originalSubtotal = originalPrice * quantity;

        // **CORRECCIÓN: Calcular subtotal después de descuentos**
        const itemSubtotalAfterDiscounts = originalSubtotal - newDiscountAmount;

        // **CORRECCIÓN: Calcular impuesto sobre el subtotal después de descuentos**
        const newTaxAmount = itemSubtotalAfterDiscounts * taxRate;
        const newDiscountedPrice = calculateDiscountedPrice(discount, originalPrice, quantity);

        // FIX: Stock SIEMPRE dinámico de products (no usa item.stock – valida contra real actual)
        let currentStock = 0;
        if (products.length > 0) {
            const product = products.find(p => p.id === item.product_id);
            if (product) {
                currentStock = calculateStock(product, item.combination_id);
            }
        } else {
            currentStock = item.stock || 0; // Fallback si no products
        }

        if (quantity > currentStock) {
            toast.error(`Stock insuficiente: Solo ${currentStock} disponibles.`);
            return;
        }

        // Map con refresh de index
        const updatedItems = data.order_items.map((it, i) => {
            if (i === index) {
                return {
                    ...it,
                    quantity,
                    original_price: originalPrice,
                    discount_amount: newDiscountAmount,
                    discounted_price: newDiscountedPrice,
                    subtotal: itemSubtotalAfterDiscounts, // ← Subtotal después de descuentos
                    tax_amount: newTaxAmount, // ← Impuesto sobre subtotal después de descuentos
                    discount_id: discount ? discount.id : it.discount_id,
                    discount_type: discount ? discount.discount_type : it.discount_type,
                    stock: currentStock, // Actualiza stock en item para consistencia
                    index: i,
                };
            }
            return { ...it, index: i };
        });
        setData('order_items', updatedItems);
    }, [data.order_items, findApplicableDiscount, setData, products]);

    // handleRemoveItem: Intacto (no afecta stock)
    const handleRemoveItem = useCallback((index) => {
        if (!data.order_items || !Array.isArray(data.order_items) || index < 0 || index >= data.order_items.length) {
            console.warn('Invalid remove index:', index);
            return;
        }

        const updatedItems = data.order_items
            .filter((_, i) => i !== index)
            .map((it, i) => ({ ...it, index: i }));
        setData('order_items', updatedItems);
        toast.success('Producto removido del pedido');
    }, [data.order_items, setData]);

    // orderItemsColumns: Intacto
    const orderItemsColumns = useMemo(() => getOrderItemsColumns({
        handleQuantityChange,
        handleRemoveItem,
        isDisabled,
        showDiscount: true,
        settings,
    }), [handleQuantityChange, handleRemoveItem, isDisabled, settings]);

    return {
        handleQuantityChange,
        handleRemoveItem,
        orderItemsColumns,
    };
};