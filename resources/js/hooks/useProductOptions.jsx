// src/hooks/useProductOptions.js
import { useState, useMemo, useCallback, useEffect } from 'react'; // Agregar useEffect
import { toast } from 'sonner';
import { Percent } from 'lucide-react';
import { calculateStock } from '@/utils/stockUtils';
import { formatAttributesDisplay, getBarcode, filterProductOptions } from '@/utils/productUtils';
import {
    calculateDiscount,
    calculateDiscountedPrice
} from '@/utils/discountUtils';

/**
 * Hook para manejar opciones de productos, selección y adición a la orden.
 * @param {Array} products - Array de productos (con combinations, stocks, discounts, taxes, categories).
 * @param {Object} data - Datos de la orden (order_items para chequear duplicados).
 * @param {Function} setData - Función para actualizar data (order_items).
 * @param {Function} findApplicableDiscount - Función del hook useDiscounts para descuentos automáticos.
 * @returns {Object} Opciones, label formatter, handlers de adición (single + bulk), estados de selección.
 */
export const useProductOptions = (products, data, setData, findApplicableDiscount) => {
    const [selectedProductToAdd, setSelectedProductToAdd] = useState(null);
    const [selectedProductsBulk, setSelectedProductsBulk] = useState([]);
    const [productOptions, setProductOptions] = useState([]);
    const [prevStoreId, setPrevStoreId] = useState(null);

    // Efecto para actualizar productOptions cuando cambie la tienda (store_id)
    useEffect(() => {
        const selectedStoreId = data.store_id;

        // Solo recalcular si realmente cambió el store_id o es la primera vez
        if (selectedStoreId !== prevStoreId || productOptions.length === 0) {
            const options = [];
            products.forEach(product => {
                const productTaxRate = product.taxes ? parseFloat(product.taxes.tax_rate) : 0;

                // Simple (sin combinations)
                if (!product.combinations || product.combinations.length === 0) {
                    const originalPrice = product.product_price_discount && parseFloat(product.product_price_discount) > 0
                        ? parseFloat(product.product_price_discount)
                        : parseFloat(product.product_price);

                    const discount = findApplicableDiscount(product.id, null);
                    const effectivePrice = discount ? calculateDiscountedPrice(discount, originalPrice, 1) : originalPrice;

                    const productStock = calculateStock(product, null, selectedStoreId);

                    if (productStock >= 0) {
                        const barcode = getBarcode(product, null);
                        options.push({
                            value: `simple_${product.id}`,
                            label: `${product.product_name} ${barcode ? `(${barcode})` : ''} - $${originalPrice.toFixed(2)} (Stock: ${productStock})`,
                            product_id: product.id,
                            combination_id: null,
                            original_price: originalPrice,
                            effective_price: effectivePrice,
                            discount,
                            is_combination: false,
                            stock: productStock,
                            tax_rate: productTaxRate,
                            product_name: product.product_name,
                            attributes_display: null,
                            barcode,
                        });
                    }
                } else {
                    // Variable: Cada combination como option
                    product.combinations.forEach(combination => {
                        const originalPrice = parseFloat(combination.combination_price);
                        const discount = findApplicableDiscount(product.id, combination.id);
                        const effectivePrice = discount ? calculateDiscountedPrice(discount, originalPrice, 1) : originalPrice;

                        const combinationStock = calculateStock(product, combination.id, selectedStoreId);

                        if (combinationStock >= 0) {
                            const attributesDisplay = formatAttributesDisplay(combination, true);
                            const attributes = formatAttributesDisplay(combination, false);
                            const barcode = getBarcode(product, combination.id);

                            options.push({
                                value: `comb_${combination.id}`,
                                label: `${product.product_name}${attributesDisplay} ${barcode ? `(${barcode})` : ''} - $${originalPrice.toFixed(2)} (Stock: ${combinationStock})`,
                                product_id: product.id,
                                combination_id: combination.id,
                                original_price: originalPrice,
                                effective_price: effectivePrice,
                                discount,
                                is_combination: true,
                                stock: combinationStock,
                                tax_rate: productTaxRate,
                                product_name: product.product_name,
                                attributes_display: attributesDisplay,
                                attributes,
                                barcode,
                                combination_details: combination,
                            });
                        }
                    });
                }
            });

            setProductOptions(options);
            setPrevStoreId(selectedStoreId); // Actualizar store_id anterior
        }
    }, [products, findApplicableDiscount, data.store_id, prevStoreId, productOptions.length]);

    // formatProductOptionLabel: JSX para label con strike si descuento
    const formatProductOptionLabel = useCallback((option) => (
        <div className="flex flex-col">
            <span className="font-medium">
                {option.product_name}
                {option.attributes_display && <span className="text-sm text-gray-600"> {option.attributes_display}</span>}
                {option.barcode && <span className="text-xs text-gray-500">({option.barcode})</span>}
            </span>
            <span className="text-sm text-gray-500">
                {option.original_price < parseFloat(option.product?.product_price || option.original_price) && (
                    <span className="line-through mr-1">${parseFloat(option.product?.product_price || option.original_price).toFixed(2)}</span>
                )}
                ${option.effective_price.toFixed(2)}
                {option.discount && (
                    <span className="ml-2 text-green-600 text-xs">
                        <Percent className="inline w-3 h-3 mr-1" /> {option.discount.value}% off
                    </span>
                )}
                <span className="ml-2 text-blue-600 text-xs">
                    Stock: {option.stock}
                </span>
            </span>
        </div>
    ), []);

    // handleAddProduct: Single add
    const handleAddProduct = useCallback(() => {
        if (!selectedProductToAdd) return;

        const { product_id, combination_id, original_price, discount, stock, tax_rate, product_name, attributes_display, barcode } = selectedProductToAdd;
        const quantity = 1;
        const taxRate = tax_rate || 0;

        const product = products.find(p => p.id === product_id);
        const categories = product ? product.categories || [] : [];

        const existingItemIndex = data.order_items.findIndex(item =>
            item.product_id === product_id && item.combination_id === combination_id
        );

        if (existingItemIndex > -1) {
            // Duplicado: Aumenta cantidad (validar stock)
            const item = data.order_items[existingItemIndex];
            const newQuantity = item.quantity + 1;
            if (newQuantity > item.stock) {
                toast.error(`Stock insuficiente para ${product_name}: Solo ${item.stock} disponibles.`);
                return;
            }

            const updatedItems = data.order_items.map((it, i) => {
                if (i === existingItemIndex) {
                    const newDiscountAmount = discount ? calculateDiscount(discount, original_price, newQuantity) : 0;
                    const originalSubtotal = original_price * newQuantity;
                    const itemSubtotalAfterDiscounts = originalSubtotal - newDiscountAmount;
                    const newTaxAmount = itemSubtotalAfterDiscounts * (taxRate / 100);
                    const newDiscountedPrice = calculateDiscountedPrice(discount, original_price, newQuantity);

                    return {
                        ...it,
                        quantity: newQuantity,
                        discount_amount: newDiscountAmount,
                        discounted_price: newDiscountedPrice,
                        subtotal: itemSubtotalAfterDiscounts,
                        tax_amount: newTaxAmount,
                        discount_id: discount ? discount.id : it.discount_id,
                        discount_type: discount ? discount.discount_type : it.discount_type,
                        stock: stock,
                        index: i,
                    };
                }
                return { ...it, index: i };
            });

            setData('order_items', updatedItems);
            toast.success(`Cantidad actualizada para ${product_name}`);
        } else {
            // Nuevo: Validar stock
            if (quantity > stock) {
                toast.error(`Stock insuficiente para ${product_name}: Solo ${stock} disponibles.`);
                return;
            }

            const discountAmount = discount ? calculateDiscount(discount, original_price, quantity) : 0;
            const originalSubtotal = original_price * quantity;
            const itemSubtotalAfterDiscounts = originalSubtotal - discountAmount;
            const taxAmount = itemSubtotalAfterDiscounts * (taxRate / 100);
            const discountedPrice = calculateDiscountedPrice(discount, original_price, quantity);

            const newItem = {
                product_id,
                combination_id,
                name_product: product_name,
                attributes_display,
                barcode,
                quantity,
                original_price: original_price,
                product_price: original_price,
                discounted_price: discountedPrice,
                discount_id: discount ? discount.id : null,
                discount_type: discount ? discount.discount_type : null,
                discount_amount: discountAmount,
                subtotal: itemSubtotalAfterDiscounts,
                tax_rate: taxRate,
                tax_amount: taxAmount,
                categories,
                stock,
                product_details: attributes_display ? JSON.stringify({ attributes: attributes_display }) : null,
                index: data.order_items.length,
            };

            setData('order_items', [...data.order_items, newItem]);
            toast.success(`${product_name} agregado al pedido`);
        }

        setSelectedProductToAdd(null);
    }, [selectedProductToAdd, data.order_items, products, setData]);

    // handleAddBulkProducts - Agrega múltiples, maneja duplicados y validaciones en batch
    const handleAddBulkProducts = useCallback(() => {
        if (!selectedProductsBulk || selectedProductsBulk.length === 0) {
            toast.warning('Selecciona al menos un producto.');
            return;
        }

        let hasError = false;
        const newItems = [];
        const updatedExistingIndices = [];

        selectedProductsBulk.forEach(option => {
            const { product_id, combination_id, original_price, discount, stock, tax_rate, product_name, attributes_display, barcode } = option;
            const quantity = 1;
            const taxRate = tax_rate || 0;

            const product = products.find(p => p.id === product_id);
            const categories = product ? product.categories || [] : [];

            const existingItemIndex = data.order_items.findIndex(item =>
                item.product_id === product_id && item.combination_id === combination_id
            );

            if (existingItemIndex > -1) {
                // Duplicado: Aumenta cantidad (validar stock)
                const item = data.order_items[existingItemIndex];
                const newQuantity = item.quantity + 1;
                if (newQuantity > item.stock) {
                    toast.error(`Stock insuficiente para ${product_name}: Solo ${item.stock} disponibles.`);
                    hasError = true;
                    return;
                }
                updatedExistingIndices.push(existingItemIndex);
            } else {
                // Nuevo: Validar stock
                if (quantity > stock) {
                    toast.error(`Stock insuficiente para ${product_name}: Solo ${stock} disponibles.`);
                    hasError = true;
                    return;
                }

                const discountAmount = discount ? calculateDiscount(discount, original_price, quantity) : 0;
                const originalSubtotal = original_price * quantity;
                const itemSubtotalAfterDiscounts = originalSubtotal - discountAmount;
                const taxAmount = itemSubtotalAfterDiscounts * (taxRate / 100);
                const discountedPrice = calculateDiscountedPrice(discount, original_price, quantity);

                const newItem = {
                    product_id,
                    combination_id,
                    name_product: product_name,
                    attributes_display,
                    barcode,
                    quantity,
                    original_price: original_price,
                    product_price: original_price,
                    discounted_price: discountedPrice,
                    discount_id: discount ? discount.id : null,
                    discount_type: discount ? discount.discount_type : null,
                    discount_amount: discountAmount,
                    subtotal: itemSubtotalAfterDiscounts,
                    tax_rate: taxRate,
                    tax_amount: taxAmount,
                    categories,
                    stock,
                    product_details: attributes_display ? JSON.stringify({ attributes: attributes_display }) : null,
                    index: data.order_items.length + newItems.length,
                };
                newItems.push(newItem);
            }
        });

        if (hasError) {
            toast.error('Algunos productos no se agregaron por stock insuficiente.');
            return;
        }

        if (newItems.length === 0 && updatedExistingIndices.length === 0) {
            toast.warning('No hay productos nuevos para agregar.');
            return;
        }

        let updatedItems = data.order_items.map((it, i) => ({ ...it, index: i }));

        newItems.forEach(newItem => {
            const finalIndex = updatedItems.length;
            updatedItems.push({ ...newItem, index: finalIndex });
        });

        updatedExistingIndices.forEach(index => {
            const item = updatedItems[index];
            const option = selectedProductsBulk.find(opt =>
                opt.product_id === item.product_id && opt.combination_id === item.combination_id
            );
            if (option) {
                const newQuantity = item.quantity + 1;
                const newDiscountAmount = option.discount ? calculateDiscount(option.discount, item.original_price, newQuantity) : 0;
                const originalSubtotal = item.original_price * newQuantity;
                const itemSubtotalAfterDiscounts = originalSubtotal - newDiscountAmount;
                const newTaxAmount = itemSubtotalAfterDiscounts * (item.tax_rate / 100);
                const newDiscountedPrice = calculateDiscountedPrice(option.discount, item.original_price, newQuantity);

                updatedItems[index] = {
                    ...item,
                    quantity: newQuantity,
                    discount_amount: newDiscountAmount,
                    discounted_price: newDiscountedPrice,
                    subtotal: itemSubtotalAfterDiscounts,
                    tax_amount: newTaxAmount,
                    discount_id: option.discount ? option.discount.id : item.discount_id,
                    discount_type: option.discount ? option.discount.discount_type : item.discount_type,
                    index: index,
                };
            }
        });

        setData('order_items', updatedItems);
        setSelectedProductsBulk([]);
        toast.success(`Agregados ${newItems.length + updatedExistingIndices.length} producto(s)`);
    }, [selectedProductsBulk, data.order_items, products, setData]);

    const toggleBulkSelection = useCallback((option) => {
        setSelectedProductsBulk(prev => {
            const isSelected = prev.some(opt => opt.value === option.value);
            if (isSelected) {
                return prev.filter(opt => opt.value !== option.value);
            }
            return [...prev, option];
        });
    }, []);

    const selectAllBulk = useCallback(() => {
        setSelectedProductsBulk(productOptions);
    }, [productOptions]);

    const clearBulkSelection = useCallback(() => {
        setSelectedProductsBulk([]);
    }, []);

    return {
        selectedProductToAdd,
        setSelectedProductToAdd,
        selectedProductsBulk,
        setSelectedProductsBulk,
        productOptions,
        formatProductOptionLabel,
        handleAddProduct,
        handleAddBulkProducts,
        toggleBulkSelection,
        selectAllBulk,
        clearBulkSelection,
        filterProductOptions,
    };
};