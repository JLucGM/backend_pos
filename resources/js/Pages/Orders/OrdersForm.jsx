import React, { useState, useEffect, useMemo, useCallback } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import DivSection from '@/Components/ui/div-section';
import { customStyles } from '@/hooks/custom-select';
import Select from 'react-select';
import { Table, TableBody, TableCell, TableRow } from "@/Components/ui/table";
import { Button } from '@/Components/ui/button';
import { PlusCircle, Percent, DollarSign } from 'lucide-react';
import DataTable from '@/Components/DataTable';
import { getOrderItemsColumns } from './orderItemsColumns'; // Ajusta path; ver ejemplo abajo
import UserInfo from '@/Components/UserInfo';
import { formatDate } from '@/utils/dateFormatter';
import { mapToSelectOptions } from '@/utils/mapToSelectOptions';
import { toast } from 'sonner';
import { Input } from '@/Components/ui/input';

export default function OrdersForm({
    data,
    orders = null,
    products = [],
    users = [],
    paymentMethods = [],
    discounts = [],
    setData,
    errors,
    isEdit = false, // FIX: Nueva prop para detectar modo edit (true en Edit.jsx)
    isDisabled = false
}) {
    const [selectedProductToAdd, setSelectedProductToAdd] = useState(null);
    const [selectedUser , setSelectedUser ] = useState(null);
    const [deliveryLocations, setDeliveryLocations] = useState([]);
    const [manualDiscountCode, setManualDiscountCode] = useState(data.manual_discount_code || ''); // FIX: Inicializa con guardado en edit
    const [manualDiscountAmount, setManualDiscountAmount] = useState(parseFloat(data.manual_discount_amount) || 0); // FIX: Inicializa
    const [appliedManualDiscount, setAppliedManualDiscount] = useState(null); // Inicializa vacío; setea en useEffect si edit

    const paymentOptions = useMemo(() => mapToSelectOptions(paymentMethods, 'id', 'payment_method_name'), [paymentMethods]);
    const userOptions = useMemo(() => mapToSelectOptions(users, 'id', 'name'), [users]);

    // FIX: useEffect para inicializar manual discount en edit (del data guardado)
    useEffect(() => {
        if (isEdit && data.manual_discount_code && discounts.length > 0) {
            const savedDiscount = discounts.find(d => d.code === data.manual_discount_code);
            if (savedDiscount) {
                setAppliedManualDiscount(savedDiscount);
                setManualDiscountAmount(parseFloat(data.manual_discount_amount) || 0);
            }
        }
    }, [isEdit, data.manual_discount_code, data.manual_discount_amount, discounts]);

    // Helper para encontrar descuento aplicable (automático)
    const findApplicableDiscount = useCallback((productId) => {
        if (isEdit) return null; // FIX: En edit, no aplica nuevos automáticos (preserva guardados)
        const product = products.find(p => p.id === productId);
        if (!product) return null;

        const activeAutomaticDiscounts = discounts.filter(d =>
            d.is_active && d.automatic &&
            (!d.start_date || new Date(d.start_date) <= new Date()) &&
            (!d.end_date || new Date(d.end_date) >= new Date())
        );

        let applicable = null;
        let maxValue = 0;

        // Prioridad directo > categoría (igual que backend)
        if (product.discounts && product.discounts.length > 0) {
            const direct = activeAutomaticDiscounts.filter(d =>
                d.applies_to === 'product' && product.discounts.some(dd => dd.id === d.id)
            );
            if (direct.length > 0) {
                applicable = direct.reduce((prev, curr) => (curr.value > prev.value ? curr : prev));
                maxValue = applicable.value;
            }
        }

        if (!applicable && product.categories && product.categories.length > 0) {
            product.categories.forEach(cat => {
                if (cat.discounts && cat.discounts.length > 0) {
                    const catDiscounts = activeAutomaticDiscounts.filter(d =>
                        d.applies_to === 'category' && cat.discounts.some(cd => cd.id === d.id)
                    );
                    if (catDiscounts.length > 0) {
                        const bestCat = catDiscounts.reduce((prev, curr) => (curr.value > prev.value ? curr : prev));
                        if (bestCat.value > maxValue) {
                            applicable = bestCat;
                            maxValue = bestCat.value;
                        }
                    }
                }
            });
        }

        if (applicable && applicable.minimum_order_amount && data.subtotal < applicable.minimum_order_amount) {
            applicable = null;
        }

        return applicable;
    }, [products, discounts, data.subtotal, isEdit]);

    const calculateDiscount = useCallback((discount, price, quantity = 1) => {
        if (!discount) return 0;
        const subtotal = price * quantity;
        if (discount.discount_type === 'percentage') {
            return Math.min(subtotal * (discount.value / 100), subtotal);
        } else {
            return discount.value * quantity;
        }
    }, []);

        // NUEVO/actualizado: Handler para aplicar descuento manual - Ahora con CATEGORÍA implementada (continuación)
    const handleManualDiscountApply = useCallback(async () => {
        if (isEdit && appliedManualDiscount) return; // FIX: En edit, no reaplica (ya guardado en data)
        if (!manualDiscountCode.trim()) return;

        // Simulación en frontend: Busca en discounts no automáticos
        const manualDiscount = discounts.find(d =>
            d.code === manualDiscountCode.trim() &&
            d.is_active &&
            !d.automatic &&
            (!d.start_date || new Date(d.start_date) <= new Date()) &&
            (!d.end_date || new Date(d.end_date) >= new Date())
        );

        if (manualDiscount) {
            let totalManualDiscountAmount = 0;
            let appliedItems = []; // Para tracking

            // Validar y aplicar basado en applies_to
            if (manualDiscount.applies_to === 'order_total') {
                // Global
                const discountAmount = calculateDiscount(manualDiscount, data.subtotal, 1);
                if (manualDiscount.minimum_order_amount && data.subtotal < manualDiscount.minimum_order_amount) {
                    toast.error(`Monto mínimo requerido: $${manualDiscount.minimum_order_amount}`);
                    return;
                }
                totalManualDiscountAmount = discountAmount;
                setManualDiscountAmount(totalManualDiscountAmount);
                setAppliedManualDiscount(manualDiscount);
                setData('manual_discount_code', manualDiscount.code);
                setData('manual_discount_amount', totalManualDiscountAmount);
                toast.success(`Descuento global aplicado: ${manualDiscount.name} - Ahorro: $${totalManualDiscountAmount.toFixed(2)}`);
            } else if (manualDiscount.applies_to === 'product') {
                // Por producto
                if (!manualDiscount.products || manualDiscount.products.length === 0) {
                    toast.error('Este descuento no tiene productos asociados.');
                    return;
                }

                const eligibleProductIds = manualDiscount.products.map(p => p.id);
                const eligibleItems = data.order_items.filter(item => eligibleProductIds.includes(item.product_id));

                if (eligibleItems.length === 0) {
                    toast.error('No hay productos elegibles en el carrito para este descuento.');
                    return;
                }

                // Aplica descuento a cada ítem eligible
                const updatedItems = data.order_items.map(item => {
                    if (eligibleProductIds.includes(item.product_id)) {
                        const originalPrice = item.original_price || item.product_price || 0; // FIX: Usa original en edit
                        const itemDiscountAmount = calculateDiscount(manualDiscount, originalPrice, item.quantity);
                        const discountedPrice = Math.max(0, originalPrice - (itemDiscountAmount / item.quantity));
                        const discountedSubtotal = (originalPrice * item.quantity) - itemDiscountAmount;
                        const newTaxAmount = discountedSubtotal * (item.tax_rate / 100);

                        appliedItems.push(item.product_id);

                        return {
                            ...item,
                            discount_id: manualDiscount.id, // Prioridad sobre auto
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
                setManualDiscountAmount(totalManualDiscountAmount); // Display local
                setAppliedManualDiscount({ ...manualDiscount, applied_to: appliedItems });
                setData('manual_discount_code', manualDiscount.code);
                // NO setData('manual_discount_amount') - Ya en ítems
                toast.success(`Descuento aplicado a ${eligibleItems.length} producto(s): ${manualDiscount.name} - Ahorro: $${totalManualDiscountAmount.toFixed(2)}`);
            } else if (manualDiscount.applies_to === 'category') {
                // Por categorías específicas
                if (!manualDiscount.categories || manualDiscount.categories.length === 0) {
                    toast.error('Este descuento no tiene categorías asociadas.');
                    return;
                }

                const eligibleCategoryIds = manualDiscount.categories.map(c => c.id);
                const eligibleItems = data.order_items.filter(item => {
                    return item.categories && item.categories.some(cat => eligibleCategoryIds.includes(cat.id));
                });

                if (eligibleItems.length === 0) {
                    toast.error('No hay productos de categorías elegibles en el carrito para este descuento.');
                    return;
                }

                // Aplica descuento a cada ítem eligible (similar a 'product')
                const updatedItems = data.order_items.map(item => {
                    if (item.categories && item.categories.some(cat => eligibleCategoryIds.includes(cat.id))) {
                        const originalPrice = item.original_price || item.product_price || 0; // FIX: Usa original en edit
                        const itemDiscountAmount = calculateDiscount(manualDiscount, originalPrice, item.quantity);
                        const discountedPrice = Math.max(0, originalPrice - (itemDiscountAmount / item.quantity));
                        const discountedSubtotal = (originalPrice * item.quantity) - itemDiscountAmount;
                        const newTaxAmount = discountedSubtotal * (item.tax_rate / 100);

                        appliedItems.push(item.product_id);

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
            } else {
                toast.error('Tipo de descuento no soportado.');
                return;
            }

            // Validación general de mínimo
            if (manualDiscount.minimum_order_amount && data.subtotal < manualDiscount.minimum_order_amount) {
                toast.error(`Monto mínimo requerido: $${manualDiscount.minimum_order_amount}`);
                setManualDiscountAmount(0);
                setAppliedManualDiscount(null);
                if (manualDiscount.applies_to === 'order_total') {
                    setData('manual_discount_amount', 0);
                }
                return;
            }

        } else {
            toast.error('Código de descuento inválido.');
            setManualDiscountAmount(0);
            setAppliedManualDiscount(null);
            setData('manual_discount_code', null);
            setData('manual_discount_amount', 0);
        }
    }, [manualDiscountCode, discounts, data.subtotal, data.order_items, calculateDiscount, setData, isEdit, appliedManualDiscount]);

    // NUEVO: Para descuentos order_total automáticos (solo en create)
    const orderTotalAutomaticDiscount = useMemo(() => {
        if (isEdit) return 0; // FIX: En edit, no aplica nuevos globales (preserva totaldiscounts)
        const activeOrderDiscounts = discounts.filter(d =>
            d.is_active &&
            d.automatic &&
            d.applies_to === 'order_total' &&
            (!d.start_date || new Date(d.start_date) <= new Date()) &&
            (!d.end_date || new Date(d.end_date) >= new Date())
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
    }, [discounts, data.subtotal, calculateDiscount, isEdit]);

    // EXISTENTE: calculateStock (sin cambios)
    const calculateStock = (product, combinationId = null) => {
        if (!product.stocks || product.stocks.length === 0) return 0;
        if (combinationId !== null) {
            const stockEntry = product.stocks.find(s => s.combination_id === combinationId);
            return stockEntry ? parseInt(stockEntry.quantity) : 0;
        } else {
            const stockEntry = product.stocks.find(s => s.combination_id === null);
            return stockEntry ? parseInt(stockEntry.quantity) : 0;
        }
    };

    // CORREGIDO: productOptions - En edit, no aplica descuentos nuevos (solo display original)
    const productOptions = useMemo(() => {
        if (isEdit) {
            // FIX: En edit, deshabilita agregar nuevos o muestra sin descuentos (opcional: return [] para bloquear)
            return []; // O muestra productos pero sin descuento auto
        }
        const options = [];
        products.forEach(product => {
            const originalProductPrice = parseFloat(product.product_price);
            const discount = findApplicableDiscount(product.id);
            let effectivePrice = originalProductPrice;

            if (discount) {
                const discountPerItem = calculateDiscount(discount, originalProductPrice, 1);
                effectivePrice = Math.max(0, originalProductPrice - discountPerItem);
            }

            // Manejo de combinaciones (igual que antes)
            if (product.combinations && product.combinations.length > 0) {
                product.combinations.forEach(combination => {
                    const combinationOriginalPrice = parseFloat(combination.combination_price);
                    const combinationDiscount = findApplicableDiscount(product.id);
                    let combinationEffectivePrice = combinationOriginalPrice;

                    if (combinationDiscount) {
                        const discountPerItem = calculateDiscount(combinationDiscount, combinationOriginalPrice, 1);
                        combinationEffectivePrice = Math.max(0, combinationOriginalPrice - discountPerItem);
                    }

                    const combinationStock = calculateStock(product, combination.id);
                    if (combinationStock >= 0) {
                        let combinationAttributesDisplay = '';
                        if (combination.combination_attribute_value && Array.isArray(combination.combination_attribute_value)) {
                            const attributeNames = combination.combination_attribute_value.map(cav => cav.attribute_value.attribute_value_name);
                            if (attributeNames.length > 0) {
                                combinationAttributesDisplay = attributeNames.join(', ');
                            }
                        }
                        const barcode = product.stocks.find(s => s.combination_id === combination.id)?.product_barcode || null;

                        options.push({
                            value: product.id,
                            original_product_name: product.product_name,
                            combination_attributes_display: combinationAttributesDisplay,
                            barcode: barcode,
                            effective_price: combinationEffectivePrice,
                            original_display_price: combinationOriginalPrice,
                            discount: combinationDiscount,
                            combination_id: combination.id,
                            combination_details: combination,
                            is_combination: true,
                            stock: combinationStock,
                            tax_rate: product.taxes ? parseFloat(product.taxes.tax_rate) : 0,
                            label: `${product.product_name} ${combinationAttributesDisplay} ${barcode || ''} ${combinationEffectivePrice.toFixed(2)}`.toLowerCase()
                        });
                    }
                });
            } else {
                // Producto base
                const productPriceDiscount = product.product_price_discount;
                const baseEffectivePrice = productPriceDiscount ? parseFloat(productPriceDiscount) : originalProductPrice;
                effectivePrice = discount ? Math.max(0, baseEffectivePrice - calculateDiscount(discount, baseEffectivePrice, 1)) : baseEffectivePrice;

                const productStock = calculateStock(product);
                if (productStock >= 0) {
                    const barcode = product.stocks.find(s => s.combination_id === null)?.product_barcode || null;
                    options.push({
                        value: product.id,
                        original_product_name: product.product_name,
                        combination_attributes_display: null,
                        barcode: barcode,
                        effective_price: effectivePrice,
                        original_display_price: originalProductPrice,
                        discount: discount,
                        is_combination: false,
                        stock: productStock,
                        tax_rate: product.taxes ? parseFloat(product.taxes.tax_rate) : 0,
                        label: `${product.product_name} ${barcode || ''} ${effectivePrice.toFixed(2)}`.toLowerCase()
                    });
                }
            }
        });
        return options;
    }, [products, findApplicableDiscount, calculateDiscount, isEdit]);

    // ACTUALIZADO: formatProductOptionLabel - Muestra descuento si aplica (solo en create)
    const formatProductOptionLabel = ({ original_product_name, combination_attributes_display, barcode, effective_price, original_display_price, discount }) => (
        <div className="flex flex-col">
            <span className="">
                {original_product_name}
                {combination_attributes_display && <span className="text-sm mx-1">- {combination_attributes_display}</span>}
                {barcode && `(${barcode}) `}
            </span>
            <span className="text-xs text-gray-500">
                {original_display_price && original_display_price > effective_price ? (
                    <span className="line-through mr-1">${(parseFloat(original_display_price) || 0).toFixed(2)}</span>
                ) : null}
                ${(parseFloat(effective_price) || 0).toFixed(2)}
                {discount && !isEdit && ( // FIX: Solo muestra descuento en create
                    <span className="ml-2 text-green-600 text-xs">
                        <Percent className="inline w-3 h-3 mr-1" /> {discount.value}% off
                    </span>
                )}
            </span>
        </div>
    );

    // EXISTENTE: filterProductOptions (sin cambios)
    const filterProductOptions = (option, inputValue) => {
        const optionLabelForSearch = option.data.label;
        const searchInput = inputValue.toLowerCase();
        return optionLabelForSearch.includes(searchInput);
    };

    // EXISTENTE: statusOptions (sin cambios)
    const statusOptions = [
        { value: 'pending', label: 'Pendiente' },
        { value: 'processing', label: 'Procesando' },
        { value: 'completed', label: 'Completado' },
        { value: 'cancelled', label: 'Cancelado' },
        { value: 'shipped', label: 'Enviado' },
    ];

    // FUNCIONES HANDLERS (sin cambios mayores)
    const handlePaymentChange = (selectedOption) => setData('payments_method_id', selectedOption.value);
    const handleStatusChange = (selectedOption) => setData('status', selectedOption.value);

    const handleUserChange = (selectedOption) => {
        setSelectedUser(selectedOption);
        setData('user_id', selectedOption ? selectedOption.value : null);
        const selectedUserData = users.find(user => user.id === selectedOption.value);
        setDeliveryLocations(selectedUserData ? selectedUserData.delivery_locations : []);
        setData('delivery_location_id', null);
    };

        // CORREGIDO: handleAddProduct - En edit, bloquea agregar nuevos (o permite sin descuentos auto)
    const handleAddProduct = () => {
        if (isEdit) {
            toast.warning('No se pueden agregar productos nuevos en modo edición.'); // FIX: Bloquea en edit (opcional: remueve para permitir)
            setSelectedProductToAdd(null);
            return;
        }
        if (selectedProductToAdd) {
            const taxRate = selectedProductToAdd.tax_rate || 0;
            const discount = selectedProductToAdd.discount; // Del option (solo en create)
            const originalPrice = selectedProductToAdd.original_display_price; // Pre-descuento
            const discountAmountPerItem = discount ? calculateDiscount(discount, originalPrice, 1) : 0;
            const discountedPrice = Math.max(0, originalPrice - discountAmountPerItem); // Post-descuento

            // Obtener categorías del producto (para descuentos por cat)
            const product = products.find(p => p.id === selectedProductToAdd.value);
            const categories = product ? product.categories || [] : [];

            const existingItemIndex = data.order_items.findIndex(
                item => item.product_id === selectedProductToAdd.value &&
                    item.combination_id === (selectedProductToAdd.is_combination ? selectedProductToAdd.combination_id : null)
            );

            if (existingItemIndex > -1) {
                // Actualizar existente (recalcula desde originalPrice)
                const item = data.order_items[existingItemIndex];
                const newQuantity = item.quantity + 1;
                const newOriginalSubtotal = originalPrice * newQuantity;
                const newDiscountAmount = discount ? calculateDiscount(discount, originalPrice, newQuantity) : 0;
                const newDiscountedSubtotal = newOriginalSubtotal - newDiscountAmount;
                const newTaxAmount = newDiscountedSubtotal * (taxRate / 100);

                const updatedItems = data.order_items.map((it, index) => {
                    if (index === existingItemIndex) {
                        return {
                            ...it,
                            quantity: newQuantity,
                            discount_amount: newDiscountAmount,
                            discounted_price: Math.max(0, originalPrice - (newDiscountAmount / newQuantity)),
                            subtotal: newDiscountedSubtotal,
                            tax_amount: newTaxAmount,
                            tax_rate: taxRate,
                            discount_id: discount ? discount.id : null,
                            discount_type: discount ? discount.discount_type : null,
                            categories: it.categories || categories, // Mantiene categories
                        };
                    }
                    return it;
                });
                setData('order_items', updatedItems);
            } else {
                // Nuevo ítem
                const quantity = 1;
                const originalSubtotal = originalPrice * quantity;
                const discountAmount = discountAmountPerItem * quantity;
                const discountedSubtotal = originalSubtotal - discountAmount;
                const taxAmount = discountedSubtotal * (taxRate / 100);

                const newItem = {
                    product_id: selectedProductToAdd.value,
                    name_product: selectedProductToAdd.original_product_name,
                    product_price: originalPrice, // Original para backend
                    discounted_price: discountedPrice, // Post para display
                    original_price: originalPrice, // Para recálculos futuros
                    quantity: quantity,
                    subtotal: discountedSubtotal,
                    tax_rate: taxRate,
                    tax_amount: taxAmount,
                    discount_id: discount ? discount.id : null,
                    discount_amount: discountAmount,
                    discount_type: discount ? discount.discount_type : null,
                    combination_id: selectedProductToAdd.is_combination ? selectedProductToAdd.combination_id : null,
                    product_details: selectedProductToAdd.is_combination
                        ? JSON.stringify(selectedProductToAdd.combination_attributes_display || '')
                        : null,
                    stock: selectedProductToAdd.stock,
                    categories: categories, // Para descuentos por cat
                };
                setData('order_items', [...data.order_items, newItem]);
            }
            setSelectedProductToAdd(null);
            toast.success(discount ? `Producto agregado con descuento de ${discount.value}%` : 'Producto agregado');
        }
    };

    // FIX PRINCIPAL: handleQuantityChange - Recalcula correctamente en edit (desde original_price + descuento guardado)
    const handleQuantityChange = (index, newQuantity) => {
        const quantity = Math.max(1, parseInt(newQuantity) || 1);
        const item = data.order_items[index];
        const taxRate = item.tax_rate || 0;

        let originalPrice, discount;
        if (isEdit && item.original_price && item.discount_id) {
            // FIX: En edit, usa original_price ($10) y descuento guardado (busca por ID)
            originalPrice = item.original_price; // Pre-descuento guardado
            discount = discounts.find(d => d.id === item.discount_id); // Descuento guardado
        } else {
            // En create: Usa product_price como original, aplica auto si hay
            originalPrice = item.product_price || 0;
            discount = findApplicableDiscount(item.product_id); // Auto en create
        }

        // Recalcula desde original (una sola vez, aplica descuento guardado/auto)
        const newOriginalSubtotal = originalPrice * quantity;
        const newDiscountAmount = discount ? calculateDiscount(discount, originalPrice, quantity) : (item.discount_amount * (quantity / item.quantity) || 0); // Proporcional si manual
        const newDiscountedSubtotal = newOriginalSubtotal - newDiscountAmount;
        const newDiscountedPrice = Math.max(0, originalPrice - (newDiscountAmount / quantity));
        const newTaxAmount = newDiscountedSubtotal * (taxRate / 100);

        // Validación de stock
        if (item.stock && quantity > item.stock) {
            toast.error(`Stock disponible: ${item.stock}`);
            return;
        }

        const updatedItems = data.order_items.map((it, i) => {
            if (i === index) {
                return {
                    ...it,
                    quantity: quantity,
                    discount_amount: newDiscountAmount,
                    discounted_price: newDiscountedPrice,
                    product_price: isEdit ? it.product_price : newDiscountedPrice, // En edit, mantiene display post; en create, actualiza
                    original_price: originalPrice, // Mantiene para futuros recálculos
                    subtotal: newDiscountedSubtotal,
                    tax_amount: newTaxAmount,
                    discount_id: discount ? discount.id : it.discount_id, // Preserva o actualiza
                    discount_type: discount ? discount.discount_type : it.discount_type,
                };
            }
            return it;
        });
        setData('order_items', updatedItems);
    };

    // ACTUALIZADO: handleRemoveItem - Remueve y recalcula totales
    const handleRemoveItem = (index) => {
        const updatedItems = data.order_items.filter((_, i) => i !== index);
        setData('order_items', updatedItems);
        toast.success('Producto removido del pedido');
    };

    // CORREGIDO: useEffect para recalcular totales - Usa subtotal post-descuento, integra manual solo si global
    useEffect(() => {
        const itemsSubtotal = data.order_items.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0); // Post-descuentos por ítem
        const itemsTaxAmount = data.order_items.reduce((sum, item) => sum + parseFloat(item.tax_amount || 0), 0);
        
        // Descuentos por ítem (incluye auto/manual por producto/cat)
        const itemsDiscounts = data.order_items.reduce((sum, item) => sum + parseFloat(item.discount_amount || 0), 0);
        
        // Descuentos globales: manual SOLO si 'order_total' + auto order_total
        let manualDiscount = 0;
        if (appliedManualDiscount && appliedManualDiscount.applies_to === 'order_total') {
            manualDiscount = parseFloat(data.manual_discount_amount || 0);
        } // Si manual es por product/cat, ya está en itemsDiscounts
        const orderTotalDiscount = orderTotalAutomaticDiscount;
        const globalDiscounts = manualDiscount + orderTotalDiscount;
        
        // Total descuentos: suma total (ítems + globales)
        const totalDiscounts = itemsDiscounts + globalDiscounts;
        
        // Total final: itemsSubtotal (post-ítem) + tax - globales (evita doble descuento)
        const finalTotal = itemsSubtotal + itemsTaxAmount - globalDiscounts;

        setData(prevData => ({
            ...prevData,
            subtotal: itemsSubtotal, // Post-descuentos por ítem ($20 en tu ejemplo)
            tax_amount: itemsTaxAmount, // $3.60
            totaldiscounts: totalDiscounts, // $1 (ítem) + 0 global = $1
            total: finalTotal, // $23.60
            manual_discount_amount: manualDiscount, // Solo si global
        }));
    }, [data.order_items, data.manual_discount_amount, appliedManualDiscount, orderTotalAutomaticDiscount, setData, isEdit]);

    // NUEVO: orderItemsColumns - Configura columnas para DataTable (incluye descuento, muestra discounted_price)
    const orderItemsColumns = useMemo(() => getOrderItemsColumns({
        handleQuantityChange,
        handleRemoveItem,
        isDisabled,
        showDiscount: true, // FIX: Muestra columna descuento
        isEdit, // Pasa para lógica en columnas (ej. readonly en edit)
    }), [handleQuantityChange, handleRemoveItem, isDisabled, isEdit]);

    // UNIFICADO: useEffect para delivery locations (sin duplicados)
    useEffect(() => {
        if (data.user_id && users.length > 0) {
            const selectedUserData = users.find(user => user.id === data.user_id);
            if (selectedUserData) {
                const userLocations = selectedUserData.delivery_locations || [];
                setDeliveryLocations(userLocations);

                // Selecciona dirección predeterminada
                const defaultLocation = userLocations.find(loc => loc.is_default);
                if (defaultLocation) {
                    setData('delivery_location_id', defaultLocation.id);
                } else if (userLocations.length > 0) {
                    setData('delivery_location_id', userLocations[0].id);
                } else {
                    setData('delivery_location_id', null);
                }
            }
        } else {
            setDeliveryLocations([]);
            setData('delivery_location_id', null);
        }
    }, [data.user_id, users, setData]);

    // UNIFICADO: useEffect para inicializar selectedUser  (para edición)
    useEffect(() => {
        if (data.user_id && userOptions.length > 0) {
            const user = userOptions.find(option => option.value === data.user_id);
            if (user && user !== selectedUser ) {
                setSelectedUser (user);
            }
        } else if (!data.user_id && selectedUser ) {
            setSelectedUser (null);
        }
    }, [data.user_id, userOptions, selectedUser ]);

    return (
        <>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-full md:col-span-2">
                    <DivSection>
                        {orders && orders.created_at && (
                            <div>
                                <div className="mb-4">
                                    <p className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                        Pedido recibido
                                    </p>
                                    <span className="text-gray-900 dark:text-gray-100">{formatDate(orders.created_at)}</span>
                                </div>
                                <div>
                                    <p className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                        Actualizado
                                    </p>
                                    <span className="text-gray-900 dark:text-gray-100">{formatDate(orders.updated_at)}</span>
                                </div>
                            </div>
                        )}

                        <div className="mt-4">
                            <InputLabel htmlFor="status" value="Status" />
                            <Select
                                id="status"
                                name="status"
                                options={statusOptions}
                                value={statusOptions.find(option => option.value === data.status)}
                                onChange={handleStatusChange}
                                styles={customStyles}
                                isDisabled={isDisabled}
                            />
                            <InputError message={errors.status} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="payments_method_id" value="Método de Pago" />
                            <Select
                                id="payments_method_id"
                                name="payments_method_id"
                                options={paymentOptions}
                                value={paymentOptions.find(option => option.value === data.payments_method_id)}
                                onChange={handlePaymentChange}
                                styles={customStyles}
                                isDisabled={isDisabled}
                            />
                            <InputError message={errors.payments_method_id} className="mt-2" />
                        </div>
                    </DivSection>
                </div>

                <div className="col-span-full md:col-span-1">
                    <DivSection>
                        <UserInfo
                            orders={orders}
                            userOptions={userOptions}
                            selectedUser={selectedUser}
                            handleUserChange={handleUserChange}
                            customStyles={customStyles}
                            deliveryLocations={deliveryLocations}
                            data={data}
                            setData={setData}
                            errors={errors}
                            isDisabled={isDisabled}
                        />
                    </DivSection>
                </div>

                <DivSection className='col-span-full'>
                    <h3 className='font-semibold text-lg mb-4'>Productos del Pedido</h3>
                    <div className="flex items-center gap-2 mb-4">
                        <Select
                            id="product_selector"
                            name="product_selector"
                            options={productOptions}
                            value={selectedProductToAdd}
                            onChange={setSelectedProductToAdd}
                            styles={customStyles}
                            placeholder="Seleccionar producto..."
                            className="flex-grow"
                            isDisabled={isDisabled || isEdit} // FIX: Deshabilita en edit
                            filterOption={filterProductOptions}
                            formatOptionLabel={formatProductOptionLabel}
                        />
                        <Button
                            type="button"
                            onClick={handleAddProduct}
                            disabled={!selectedProductToAdd || isDisabled || isEdit} // FIX: Deshabilita en edit
                            variant="link"
                        >
                            <PlusCircle className="size-5" />
                        </Button>
                    </div>

                    {/* Input para Código de Descuento Manual */}
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <InputLabel value="Código de Descuento (Opcional)" className="mb-2" />
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Ingresa código de cupón"
                                value={manualDiscountCode}
                                onChange={(e) => setManualDiscountCode(e.target.value)}
                                disabled={isDisabled || isEdit} // FIX: Deshabilita en edit (preserva guardado)
                                // className="flex-grow rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            <Button
                                type="button"
                                onClick={handleManualDiscountApply}
                                disabled={!manualDiscountCode.trim() || isDisabled || isEdit} // FIX: Deshabilita en edit
                                variant="outline"
                                size="sm"
                            >
                                Aplicar
                            </Button>
                        </div>
                        {appliedManualDiscount && (
                            <p className="mt-1 text-sm text-green-600">
                                Aplicado: {appliedManualDiscount.name} - Ahorro: ${manualDiscountAmount.toFixed(2)}
                            </p>
                        )}
                        <InputError message={errors.manual_discount_code} className="mt-2" />
                    </div>

                    {/* DataTable: Muestra discounted_price en columna Precio, discount_amount en nueva columna */}
                    <DataTable
                        columns={orderItemsColumns}
                        data={data.order_items || []}
                    />

                    {/* Tabla de Totales: Correcta para tu ejemplo (subtotal $20 post-ítem, total $23.60) */}
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan="3" className="text-right font-bold">Subtotal (post-descuentos por ítem)</TableCell>
                                <TableCell className="font-bold">
                                    ${(parseFloat(data.subtotal) || 0).toFixed(2)} {/* $20 */}
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan="3" className="text-right font-bold">Total Descuentos</TableCell>
                                <TableCell className="font-bold text-red-600">
                                    -${(parseFloat(data.totaldiscounts) || 0).toFixed(2)} {/* -$1 */}
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan="3" className="text-right font-bold">Impuestos</TableCell>
                                <TableCell className="font-bold">
                                    ${(parseFloat(data.tax_amount) || 0).toFixed(2)} {/* $3.60 */}
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow className="bg-gray-100 dark:bg-gray-700">
                                <TableCell colSpan="3" className="text-right font-bold text-lg">Total Final</TableCell>
                                <TableCell className="font-bold text-lg">
                                    ${(parseFloat(data.total) || 0).toFixed(2)} {/* $23.60 */}
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </DivSection>
            </div>
        </>
    );
}
