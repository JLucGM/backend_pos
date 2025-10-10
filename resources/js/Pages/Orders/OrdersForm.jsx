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
    isEdit = false,
    isDisabled = false
}) {
    const [selectedProductToAdd, setSelectedProductToAdd] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [deliveryLocations, setDeliveryLocations] = useState([]);
    const [manualDiscountCode, setManualDiscountCode] = useState(data.manual_discount_code || '');
    const [manualDiscountAmount, setManualDiscountAmount] = useState(parseFloat(data.manual_discount_amount) || 0);
    const [appliedManualDiscount, setAppliedManualDiscount] = useState(null);

    const paymentOptions = useMemo(() => mapToSelectOptions(paymentMethods, 'id', 'payment_method_name'), [paymentMethods]);
    const userOptions = useMemo(() => mapToSelectOptions(users, 'id', 'name'), [users]);

    // useEffect para inicializar manual discount en edit
    useEffect(() => {
        if (isEdit && data.manual_discount_code && discounts.length > 0) {
            const savedDiscount = discounts.find(d => d.code === data.manual_discount_code);
            if (savedDiscount) {
                setAppliedManualDiscount(savedDiscount);
                setManualDiscountAmount(parseFloat(data.manual_discount_amount) || 0);
            }
        }
    }, [isEdit, data.manual_discount_code, data.manual_discount_amount, discounts]);

    // NUEVO: findApplicableDiscount con combination_id (usa product.discounts.pivot)
    const findApplicableDiscount = useCallback((productId, combinationId = null) => {
        if (isEdit) return null; // En edit, no aplica nuevos (preserva guardados)
        const product = products.find(p => p.id === productId);
        if (!product || !product.discounts) return null;

        // Filtra descuentos activos automáticos del product
        const activeDiscounts = product.discounts.filter(discount =>
            discount.is_active &&
            discount.automatic &&
            (!discount.start_date || new Date(discount.start_date) <= new Date()) &&
            (!discount.end_date || new Date(discount.end_date) >= new Date())
        );

        // Match exacto con combination_id en pivot
        return activeDiscounts.find(discount => {
            const pivotCombId = discount.pivot?.combination_id;
            if (combinationId !== null) {
                return pivotCombId === combinationId; // Variable: match ID específico
            } else {
                return pivotCombId === null; // Simple: match null
            }
        });
    }, [products, isEdit]);

    const calculateDiscount = useCallback((discount, price, quantity = 1) => {
        if (!discount) return 0;
        const subtotal = price * quantity;
        if (discount.discount_type === 'percentage') {
            return Math.min(subtotal * (discount.value / 100), subtotal);
        } else {
            return discount.value * quantity;
        }
    }, []);

    // handleManualDiscountApply (sin cambios mayores, pero integra combination_id para 'product')
    const handleManualDiscountApply = useCallback(async () => {
        if (isEdit && appliedManualDiscount) return;
        if (!manualDiscountCode.trim()) return;

        const manualDiscount = discounts.find(d =>
            d.code === manualDiscountCode.trim() &&
            d.is_active &&
            !d.automatic &&
            (!d.start_date || new Date(d.start_date) <= new Date()) &&
            (!d.end_date || new Date(d.end_date) >= new Date())
        );

        if (manualDiscount) {
            let totalManualDiscountAmount = 0;
            let appliedItems = [];

            if (manualDiscount.applies_to === 'order_total') {
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

                const updatedItems = data.order_items.map(item => {
                    if (eligibleProductIds.includes(item.product_id)) {
                        const originalPrice = item.original_price || item.product_price || 0;
                        const itemDiscountAmount = calculateDiscount(manualDiscount, originalPrice, item.quantity);
                        const discountedPrice = Math.max(0, originalPrice - (itemDiscountAmount / item.quantity));
                        const discountedSubtotal = (originalPrice * item.quantity) - itemDiscountAmount;
                        const newTaxAmount = discountedSubtotal * (item.tax_rate / 100);

                        appliedItems.push({ product_id: item.product_id, combination_id: item.combination_id }); // NUEVO: Track combination

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
                // Similar a 'product', pero por categories (usa item.categories si cargadas)
                if (!manualDiscount.categories || manualDiscount.categories.length === 0) {
                    toast.error('Este descuento no tiene categorías asociadas.');
                    return;
                }

                const eligibleCategoryIds = manualDiscount.categories.map(c => c.id);
                const eligibleItems = data.order_items.filter(item => {
                    // Asume item.categories cargadas o busca en products (ajusta si no)
                    return item.categories && item.categories.some(cat => eligibleCategoryIds.includes(cat.id));
                });

                if (eligibleItems.length === 0) {
                    toast.error('No hay productos de categorías elegibles en el carrito para este descuento.');
                    return;
                }

                const updatedItems = data.order_items.map(item => {
                    if (item.categories && item.categories.some(cat => eligibleCategoryIds.includes(cat.id))) {
                        const originalPrice = item.original_price || item.product_price || 0;
                        const itemDiscountAmount = calculateDiscount(manualDiscount, originalPrice, item.quantity);
                        const discountedPrice = Math.max(0, originalPrice - (itemDiscountAmount / item.quantity));
                        const discountedSubtotal = (originalPrice * item.quantity) - itemDiscountAmount;
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

    // orderTotalAutomaticDiscount (sin cambios)
    const orderTotalAutomaticDiscount = useMemo(() => {
        if (isEdit) return 0;
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

    // calculateStock (sin cambios)
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

    // productOptions: Flat options para simples + variaciones individuales (label con atributos/precio de combination)
    const productOptions = useMemo(() => {
        if (isEdit) {
            // En edit, deshabilita agregar nuevos o muestra sin descuentos auto (opcional)
            return []; // Bloquea select en edit; remueve si quieres permitir agregar
        }
        const options = [];

        products.forEach(product => {
            // Producto simple (sin combinations)
            if (!product.combinations || product.combinations.length === 0) {
                const originalPrice = parseFloat(product.product_price);
                const discount = findApplicableDiscount(product.id, null); // Null para simple
                let effectivePrice = originalPrice;
                if (discount) {
                    const discountPerItem = calculateDiscount(discount, originalPrice, 1);
                    effectivePrice = Math.max(0, originalPrice - discountPerItem);
                }

                const productStock = calculateStock(product, null);
                if (productStock >= 0) {
                    const barcode = product.stocks.find(s => s.combination_id === null)?.product_barcode || null;
                    options.push({
                        value: `simple_${product.id}`, // Unique para simple
                        label: `${product.product_name} ${barcode ? `(${barcode})` : ''} - $${originalPrice.toFixed(2)}`,
                        product_id: product.id,
                        combination_id: null,
                        original_price: originalPrice,
                        effective_price: effectivePrice,
                        discount: discount,
                        is_combination: false,
                        stock: productStock,
                        tax_rate: product.taxes ? parseFloat(product.taxes.tax_rate) : 0,
                        product_name: product.product_name,
                        attributes_display: null,
                        barcode: barcode,
                    });
                }
            } else {
                // Producto variable: Cada combination como option separada
                product.combinations.forEach(combination => {
                    const originalPrice = parseFloat(combination.combination_price);
                    const discount = findApplicableDiscount(product.id, combination.id); // Match con combination_id
                    let effectivePrice = originalPrice;
                    if (discount) {
                        const discountPerItem = calculateDiscount(discount, originalPrice, 1);
                        effectivePrice = Math.max(0, originalPrice - discountPerItem);
                    }

                    const combinationStock = calculateStock(product, combination.id);
                    if (combinationStock >= 0) {
                        // Label con atributos (de tu JSON: combination_attribute_value)
                        let attributesDisplay = '';
                        if (combination.combination_attribute_value && Array.isArray(combination.combination_attribute_value)) {
                            attributesDisplay = combination.combination_attribute_value.map(cav =>
                                `${cav.attribute_value.attribute.attribute_name}: ${cav.attribute_value.attribute_value_name}`
                            ).join(', ');
                            attributesDisplay = attributesDisplay ? ` - ${attributesDisplay}` : '';
                        }
                        const barcode = product.stocks.find(s => s.combination_id === combination.id)?.product_barcode || null;

                        options.push({
                            value: `comb_${combination.id}`, // Unique para combination
                            label: `${product.product_name}${attributesDisplay} ${barcode ? `(${barcode})` : ''} - $${originalPrice.toFixed(2)}`,
                            product_id: product.id,
                            combination_id: combination.id,
                            original_price: originalPrice,
                            effective_price: effectivePrice,
                            discount: discount,
                            is_combination: true,
                            stock: combinationStock,
                            tax_rate: product.taxes ? parseFloat(product.taxes.tax_rate) : 0,
                            product_name: product.product_name,
                            attributes_display: attributesDisplay,
                            barcode: barcode,
                            combination_details: combination, // Para más info si necesitas
                        });
                    }
                });
            }
        });

        return options;
    }, [products, findApplicableDiscount, calculateDiscount, isEdit]);

    // formatProductOptionLabel: Muestra original con strike si descuento (solo en create)
    const formatProductOptionLabel = (option) => (
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
    );

    // filterProductOptions: Búsqueda en label (incluye atributos)
    const filterProductOptions = (option, inputValue) => {
        const searchTerm = inputValue.toLowerCase();
        const label = option.label.toLowerCase();
        return label.includes(searchTerm);
    };

    // statusOptions (sin cambios)
    const statusOptions = [
        { value: 'pending', label: 'Pendiente' },
        { value: 'processing', label: 'Procesando' },
        { value: 'completed', label: 'Completado' },
        { value: 'cancelled', label: 'Cancelado' },
        { value: 'shipped', label: 'Enviado' },
    ];

    // Handlers básicos (sin cambios)
    const handlePaymentChange = (selectedOption) => setData('payments_method_id', selectedOption.value);
    const handleStatusChange = (selectedOption) => setData('status', selectedOption.value);

    const handleUserChange = (selectedOption) => {
        setSelectedUser(selectedOption);
        setData('user_id', selectedOption ? selectedOption.value : null);
        const selectedUserData = users.find(user => user.id === selectedOption.value);
        setDeliveryLocations(selectedUserData ? selectedUserData.delivery_locations : []);
        setData('delivery_location_id', null);
    };

    // handleAddProduct: Agrega con combination_id, original_price de combination, aplica descuento si match
    const handleAddProduct = useCallback(() => {
        if (isEdit) {
            toast.warning('No se pueden agregar productos nuevos en modo edición.');
            setSelectedProductToAdd(null);
            return;
        }
        if (!selectedProductToAdd) return;

        const { product_id, combination_id, original_price, effective_price, discount, stock, tax_rate, product_name, attributes_display, barcode } = selectedProductToAdd;
        const quantity = 1;
        const taxRate = tax_rate || 0;

        // Obtener categorías del producto (para manual discount por cat)
        const product = products.find(p => p.id === product_id);
        const categories = product ? product.categories || [] : [];

        const existingItemIndex = data.order_items.findIndex(item =>
            item.product_id === product_id && item.combination_id === combination_id
        );

        if (existingItemIndex > -1) {
            // Actualiza cantidad existente
            const item = data.order_items[existingItemIndex];
            const newQuantity = item.quantity + 1;
            const newOriginalSubtotal = original_price * newQuantity;
            const newDiscountAmount = discount ? calculateDiscount(discount, original_price, newQuantity) : 0;
            const newDiscountedSubtotal = newOriginalSubtotal - newDiscountAmount;
            const newTaxAmount = newDiscountedSubtotal * (taxRate / 100);
            const newDiscountedPrice = Math.max(0, original_price - (newDiscountAmount / newQuantity));

            if (newQuantity > item.stock) {
                toast.error(`Stock insuficiente: Solo ${item.stock} disponibles.`);
                return;
            }

            const updatedItems = data.order_items.map((it, index) => {
                if (index === existingItemIndex) {
                    return {
                        ...it,
                        quantity: newQuantity,
                        discount_amount: newDiscountAmount,
                        discounted_price: newDiscountedPrice,
                        subtotal: newDiscountedSubtotal,
                        tax_amount: newTaxAmount,
                        discount_id: discount ? discount.id : null,
                        discount_type: discount ? discount.discount_type : null,
                        categories: categories,
                    };
                }
                return it;
            });
            setData('order_items', updatedItems);
        } else {
            // Nuevo ítem
            const originalSubtotal = original_price * quantity;
            const discountAmount = discount ? calculateDiscount(discount, original_price, quantity) : 0;
            const discountedSubtotal = originalSubtotal - discountAmount;
            const taxAmount = discountedSubtotal * (taxRate / 100);
            const discountedPrice = Math.max(0, original_price - (discountAmount / quantity));

            if (quantity > stock) {
                toast.error(`Stock insuficiente: Solo ${stock} disponibles.`);
                return;
            }

            const newItem = {
                product_id,
                combination_id,
                name_product: product_name, // FIX: Cambia de 'product_name' a 'name_product' para match validación
                attributes_display, // Opcional, para display (no validado)
                barcode,
                quantity,
                original_price, // Opcional, para recálculos (no validado)
                product_price: original_price, // FIX: Envía como 'product_price' (validado en request)
                discounted_price: discountedPrice,
                discount_id: discount ? discount.id : null,
                discount_type: discount ? discount.discount_type : null,
                discount_amount: discountAmount,
                subtotal: discountedSubtotal,
                tax_rate: taxRate, // Opcional, no validado pero útil
                tax_amount: taxAmount, // Required en validación
                categories, // Opcional
                stock, // Opcional, para frontend
                product_details: attributes_display ? JSON.stringify({ attributes: attributes_display }) : null, // FIX: JSON para migración (nullable)
            };
            setData('order_items', [...data.order_items, newItem]);
        }

        setSelectedProductToAdd(null);
        toast.success(discount ? `Agregado con descuento: ${discount.value}%` : 'Producto agregado');
    }, [selectedProductToAdd, data.order_items, products, calculateDiscount, setData, isEdit]);


    // handleQuantityChange: Recalcula desde original_price (combination o base), proporcional
    const handleQuantityChange = useCallback((index, newQuantity) => {
        const quantity = Math.max(1, parseInt(newQuantity) || 1);
        const item = data.order_items[index];
        const taxRate = item.tax_rate || 0;

        // Usa original_price guardado (de combination o base)
        const originalPrice = item.original_price || item.product_price || 0;

        let discount = null;
        if (isEdit && item.discount_id) {
            // En edit: Usa descuento guardado (busca por ID)
            discount = discounts.find(d => d.id === item.discount_id);
        } else {
            // En create: Aplica auto si match combination_id
            discount = findApplicableDiscount(item.product_id, item.combination_id);
        }

        const newOriginalSubtotal = originalPrice * quantity;
        const newDiscountAmount = discount ? calculateDiscount(discount, originalPrice, quantity) : 0;
        const newDiscountedSubtotal = newOriginalSubtotal - newDiscountAmount;
        const newTaxAmount = newDiscountedSubtotal * (taxRate / 100);
        const newDiscountedPrice = Math.max(0, originalPrice - (newDiscountAmount / quantity));

        // Validación stock
        if (quantity > item.stock) {
            toast.error(`Stock disponible: ${item.stock}`);
            return;
        }

        const updatedItems = data.order_items.map((it, i) => {
            if (i === index) {
                return {
                    ...it,
                    quantity,
                    original_price: originalPrice, // Mantiene
                    discount_amount: newDiscountAmount,
                    discounted_price: newDiscountedPrice,
                    subtotal: newDiscountedSubtotal,
                    tax_amount: newTaxAmount,
                    discount_id: discount ? discount.id : it.discount_id,
                    discount_type: discount ? discount.discount_type : it.discount_type,
                };
            }
            return it;
        });
        setData('order_items', updatedItems);
    }, [data.order_items, discounts, findApplicableDiscount, calculateDiscount]);

    // handleRemoveItem (sin cambios)
    const handleRemoveItem = (index) => {
        const updatedItems = data.order_items.filter((_, i) => i !== index);
        setData('order_items', updatedItems);
        toast.success('Producto removido del pedido');
    };

    // useEffect para recalcular totales (post-descuentos por ítem + globales)
    useEffect(() => {
        const itemsSubtotal = data.order_items.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0); // Post-ítem discounts
        const itemsTaxAmount = data.order_items.reduce((sum, item) => sum + parseFloat(item.tax_amount || 0), 0);
        const itemsDiscounts = data.order_items.reduce((sum, item) => sum + parseFloat(item.discount_amount || 0), 0);

        // Globales: manual si order_total + auto order_total
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

    // orderItemsColumns: Config para DataTable (muestra discounted_price, discount_amount)
    const orderItemsColumns = useMemo(() => getOrderItemsColumns({
        handleQuantityChange,
        handleRemoveItem,
        isDisabled,
        showDiscount: true, // Muestra columna descuento
        isEdit,
    }), [handleQuantityChange, handleRemoveItem, isDisabled, isEdit]);
    // console.log('orderItemsColumns:', orderItemsColumns); // Verifica si columns existe
    // console.log('order_items data:', data.order_items); // Verifica si product_name está ahí

    // useEffect para delivery locations (sin cambios)
    useEffect(() => {
        if (data.user_id && users.length > 0) {
            const selectedUserData = users.find(user => user.id === data.user_id);
            if (selectedUserData) {
                const userLocations = selectedUserData.delivery_locations || [];
                setDeliveryLocations(userLocations);

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

    // useEffect para selectedUser (sin cambios)
    useEffect(() => {
        if (data.user_id && userOptions.length > 0) {
            const user = userOptions.find(option => option.value === data.user_id);
            if (user && user !== selectedUser) {
                setSelectedUser(user);
            }
        } else if (!data.user_id && selectedUser) {
            setSelectedUser(null);
        }
    }, [data.user_id, userOptions, selectedUser]);

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
                            placeholder="Busca y selecciona producto o variación (e.g., Pantalon - Talla S, Rojo - $11)..."
                            className="flex-grow"
                            isDisabled={isDisabled || isEdit}
                            filterOption={filterProductOptions}
                            formatOptionLabel={formatProductOptionLabel}
                        />
                        <Button
                            type="button"
                            onClick={handleAddProduct}
                            disabled={!selectedProductToAdd || isDisabled || isEdit}
                            variant="outline"
                            size="sm"
                        >
                            <PlusCircle className="size-4" />
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
                                disabled={isDisabled || isEdit}
                            />
                            <Button
                                type="button"
                                onClick={handleManualDiscountApply}
                                disabled={!manualDiscountCode.trim() || isDisabled || isEdit}
                                variant="outline"
                                size="sm"
                            >
                                Aplicar
                            </Button>
                        </div>
                        {appliedManualDiscount && (
                            <p className="mt-1 text-sm text-green-600">
                                Aplicado: {appliedManualDiscount.name} - Ahorro: ${manualDiscountAmount.toFixed(2)}
                                {appliedManualDiscount.applied_to && (
                                    <span className="text-xs"> (aplicado a {appliedManualDiscount.applied_to.length} ítem{appliedManualDiscount.applied_to.length > 1 ? 's' : ''})</span>
                                )}
                            </p>
                        )}
                        <InputError message={errors.manual_discount_code} className="mt-2" />
                    </div>

                    {/* DataTable: Muestra order_items con columnas para discounted_price, discount_amount */}
                    {data.order_items && data.order_items.length > 0 ? (
                        <DataTable
                            columns={orderItemsColumns}
                            data={data.order_items}
                        />
                    ) : (
                        <p className="text-gray-500 text-center py-8">No hay productos en el pedido. Agrega algunos para continuar.</p>
                    )}

                    {/* Tabla de Totales: Subtotal post-descuentos por ítem, total final */}
                    <Table className="mt-6">
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan="3" className="text-right font-medium">Subtotal (post-descuentos por ítem)</TableCell>
                                <TableCell className="font-medium">
                                    ${(parseFloat(data.subtotal) || 0).toFixed(2)}
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan="3" className="text-right font-medium">Total Descuentos</TableCell>
                                <TableCell className="font-medium text-red-600">
                                    -${(parseFloat(data.totaldiscounts) || 0).toFixed(2)}
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan="3" className="text-right font-medium">Impuestos</TableCell>
                                <TableCell className="font-medium">
                                    ${(parseFloat(data.tax_amount) || 0).toFixed(2)}
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow className="bg-gray-50 dark:bg-gray-800">
                                <TableCell colSpan="3" className="text-right font-bold text-lg">Total Final</TableCell>
                                <TableCell className="font-bold text-lg">
                                    ${(parseFloat(data.total) || 0).toFixed(2)}
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
