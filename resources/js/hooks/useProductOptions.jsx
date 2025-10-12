// src/hooks/useProductOptions.js
import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { Percent } from 'lucide-react';
import { calculateStock } from '@/utils/stockUtils';
import { formatAttributesDisplay, getBarcode, filterProductOptions } from '@/utils/productUtils';
import { 
    calculateDiscount, 
    calculateDiscountedPrice, 
    calculateDiscountedSubtotal 
} from '@/utils/discountUtils';

/**
 * Hook para manejar opciones de productos, selección y adición a la orden.
 * @param {Array} products - Array de productos (con combinations, stocks, discounts, taxes, categories).
 * @param {Object} data - Datos de la orden (order_items para chequear duplicados).
 * @param {Function} setData - Función para actualizar data (order_items).
 * @param {boolean} isEdit - Modo edición (bloquea agregar nuevos).
 * @param {Function} findApplicableDiscount - Función del hook useDiscounts para descuentos automáticos.
 * @returns {Object} Opciones, label formatter, handler de adición, estado de selección.
 */
export const useProductOptions = (products, data, setData, isEdit, findApplicableDiscount) => {
    const [selectedProductToAdd, setSelectedProductToAdd] = useState(null);

    // productOptions: Flat options para simples + variaciones (con stock, descuentos, atributos, barcode)
    const productOptions = useMemo(() => {
        if (isEdit) return []; // Bloquea en edit

        const options = [];
        products.forEach(product => {
            // Simple (sin combinations)
            if (!product.combinations || product.combinations.length === 0) {
                const originalPrice = parseFloat(product.product_price);
                const discount = findApplicableDiscount(product.id, null);
                const effectivePrice = discount ? calculateDiscountedPrice(discount, originalPrice, 1) : originalPrice;
                const productStock = calculateStock(product, null);
                if (productStock >= 0) {
                    const barcode = getBarcode(product, null);
                    options.push({
                        value: `simple_${product.id}`,
                        label: `${product.product_name} ${barcode ? `(${barcode})` : ''} - $${originalPrice.toFixed(2)}`,
                        product_id: product.id,
                        combination_id: null,
                        original_price: originalPrice,
                        effective_price: effectivePrice,
                        discount,
                        is_combination: false,
                        stock: productStock,
                        tax_rate: product.taxes ? parseFloat(product.taxes.tax_rate) : 0,
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
                    const combinationStock = calculateStock(product, combination.id);
                    if (combinationStock >= 0) {
                        const attributesDisplay = formatAttributesDisplay(combination);
                        const barcode = getBarcode(product, combination.id);
                        options.push({
                            value: `comb_${combination.id}`,
                            label: `${product.product_name}${attributesDisplay} ${barcode ? `(${barcode})` : ''} - $${originalPrice.toFixed(2)}`,
                            product_id: product.id,
                            combination_id: combination.id,
                            original_price: originalPrice,
                            effective_price: effectivePrice,
                            discount,
                            is_combination: true,
                            stock: combinationStock,
                            tax_rate: product.taxes ? parseFloat(product.taxes.tax_rate) : 0,
                            product_name: product.product_name,
                            attributes_display: attributesDisplay,
                            barcode,
                            combination_details: combination,
                        });
                    }
                });
            }
        });
        return options;
    }, [products, findApplicableDiscount, isEdit]);

    // formatProductOptionLabel: JSX para label con strike si descuento
    const formatProductOptionLabel = useCallback((option) => (
        <div className="flex flex-col">
            <span className="font-medium">
                {option.product_name}
                {option.attributes_display && <span className="text-sm text-gray-600"> {option.attributes_display}</span>}
                {option.barcode && <span className="text-xs text-gray-500">({option.barcode})</span>}
            </span>
            <span className="text-sm text-gray-500">
                {option.original_price > option.effective_price && (
                    <span className="line-through mr-1">${option.original_price.toFixed(2)}</span>
                )}
                ${option.effective_price.toFixed(2)}
                {option.discount && !isEdit && (
                    <span className="ml-2 text-green-600 text-xs">
                        <Percent className="inline w-3 h-3 mr-1" /> {option.discount.value}% off
                    </span>
                )}
            </span>
        </div>
    ), [isEdit]);

    // handleAddProduct: Agrega o actualiza ítem en order_items (con FIX para index)
    const handleAddProduct = useCallback(() => {
        if (isEdit) {
            toast.warning('No se pueden agregar productos nuevos en modo edición.');
            setSelectedProductToAdd(null);
            return;
        }
        if (!selectedProductToAdd) return;

        const { product_id, combination_id, original_price, discount, stock, tax_rate, product_name, attributes_display, barcode } = selectedProductToAdd;
        const quantity = 1;
        const taxRate = tax_rate || 0;

        // Obtiene categorías del producto
        const product = products.find(p => p.id === product_id);
        const categories = product ? product.categories || [] : [];

        const existingItemIndex = data.order_items.findIndex(item =>
            item.product_id === product_id && item.combination_id === combination_id
        );

        if (existingItemIndex > -1) {
            // Actualiza existente (duplicado)
            const item = data.order_items[existingItemIndex];
            const newQuantity = item.quantity + 1;
            const newDiscountAmount = discount ? calculateDiscount(discount, original_price, newQuantity) : 0;
            const newDiscountedSubtotal = calculateDiscountedSubtotal(original_price, newQuantity, discount);
            const newTaxAmount = newDiscountedSubtotal * (taxRate / 100);
            const newDiscountedPrice = calculateDiscountedPrice(discount, original_price, newQuantity);

            if (newQuantity > item.stock) {
                toast.error(`Stock insuficiente: Solo ${item.stock} disponibles.`);
                return;
            }

            // FIX: Map con refresh de index para todos los items
            const updatedItems = data.order_items.map((it, i) => {
                if (i === existingItemIndex) {
                    return {
                        ...it,
                        quantity: newQuantity,
                        discount_amount: newDiscountAmount,
                        discounted_price: newDiscountedPrice,
                        subtotal: newDiscountedSubtotal,
                        tax_amount: newTaxAmount,
                        discount_id: discount ? discount.id : null,
                        discount_type: discount ? discount.discount_type : null,
                        categories,
                        index: i, // FIX: Setea index actual
                    };
                }
                return {
                    ...it,
                    index: i, // FIX: Refresca index de todos (por si cambios previos)
                };
            });
            setData('order_items', updatedItems);
        } else {
            // Nuevo ítem
            const discountAmount = discount ? calculateDiscount(discount, original_price, quantity) : 0;
            const discountedSubtotal = calculateDiscountedSubtotal(original_price, quantity, discount);
            const taxAmount = discountedSubtotal * (taxRate / 100);
            const discountedPrice = calculateDiscountedPrice(discount, original_price, quantity);

            if (quantity > stock) {
                toast.error(`Stock insuficiente: Solo ${stock} disponibles.`);
                return;
            }

            const newItem = {
                product_id,
                combination_id,
                name_product: product_name,
                attributes_display,
                barcode,
                quantity,
                original_price,
                product_price: original_price,
                discounted_price: discountedPrice,
                discount_id: discount ? discount.id : null,
                discount_type: discount ? discount.discount_type : null,
                discount_amount: discountAmount,
                subtotal: discountedSubtotal,
                tax_rate: taxRate,
                tax_amount: taxAmount,
                categories,
                stock,
                product_details: attributes_display ? JSON.stringify({ attributes: attributes_display }) : null,
                index: data.order_items.length, // FIX: Index = posición donde se agrega (e.g., 0 si vacío, 1 si ya hay 1)
            };

            // FIX: Array nuevo con indices refresh para todos + nuevo ítem
            const updatedItems = [
                ...data.order_items.map((it, i) => ({ ...it, index: i })), // Refresca existentes
                newItem
            ];
            setData('order_items', updatedItems);
        }

        setSelectedProductToAdd(null);
        toast.success(discount ? `Agregado con descuento: ${discount.value}%` : 'Producto agregado');
}, [selectedProductToAdd, data.order_items, products, setData, isEdit]);  // FIX: Removido 'discount' – ahora limpia, sin error

    return {
        selectedProductToAdd,
        setSelectedProductToAdd,
        productOptions,
        formatProductOptionLabel,
        handleAddProduct,
        filterProductOptions,
    };
};
