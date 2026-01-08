// Helper/cartHelper.js - VERSIÓN COMPLETA CON DESCUENTOS AUTOMÁTICOS
const cartHelper = {
    getCartKey: (companyId) => `shoppingCart_${companyId}`,

    getCart: (companyId) => {
        const cartKey = cartHelper.getCartKey(companyId);
        const cart = localStorage.getItem(cartKey);
        return cart ? JSON.parse(cart) : [];
    },

    addToCart: (companyId, product, combination = null, quantity = 1, storeAutomaticDiscounts = []) => {
        const cartKey = cartHelper.getCartKey(companyId);
        const cart = cartHelper.getCart(companyId);

        // 1. Determinar precio base
        const basePrice = combination ? parseFloat(combination.price) : parseFloat(product.product_price);

        // 2. Determinar tasa de impuesto
        const taxRate = product.tax ? parseFloat(product.tax.tax_rate) : 0;

        // 3. Inicializar variables para descuentos
        let finalPrice = basePrice;
        let appliedAutomaticDiscount = null;
        let discountAmount = 0;
        let discountType = 'none';

        // 4. APLICAR DESCUENTO DIRECTO DEL PRODUCTO (product_price_discount)
        if (product.product_price_discount && parseFloat(product.product_price_discount) > 0) {
            const directDiscountPrice = parseFloat(product.product_price_discount);
            if (directDiscountPrice < basePrice) {
                finalPrice = directDiscountPrice;
                discountAmount = basePrice - directDiscountPrice;
                discountType = 'direct_discount';
            }
        }

        // 5. APLICAR DESCUENTOS AUTOMÁTICOS DEL PRODUCTO (array discounts)
        if (product.discounts && product.discounts.length > 0) {
            // Filtrar descuentos automáticos (sin código o con código pero automáticos)
            const productAutoDiscounts = product.discounts.filter(discount => {
                // Solo descuentos automáticos (sin código)
                return !discount.code;
            });

            // Aplicar el descuento automático más beneficioso
            let bestDiscount = null;
            let bestDiscountedPrice = finalPrice;

            productAutoDiscounts.forEach(discount => {
                // Verificar si aplica a esta combinación específica
                const appliesToCombination = !discount.pivot ||
                    discount.pivot.combination_id === null ||
                    (combination && discount.pivot.combination_id === combination.id);

                if (!appliesToCombination) return;

                let discountedPrice = basePrice;

                if (discount.discount_type === 'percentage') {
                    discountedPrice = basePrice * (1 - (parseFloat(discount.value) / 100));
                } else if (discount.discount_type === 'fixed_amount') {
                    discountedPrice = Math.max(0, basePrice - parseFloat(discount.value));
                }

                // Verificar si este descuento es mejor que el actual
                if (discountedPrice < bestDiscountedPrice) {
                    bestDiscountedPrice = discountedPrice;
                    bestDiscount = discount;
                }
            });

            // Aplicar el mejor descuento encontrado
            if (bestDiscount && bestDiscountedPrice < finalPrice) {
                finalPrice = bestDiscountedPrice;
                appliedAutomaticDiscount = bestDiscount;
                discountAmount = basePrice - finalPrice;
                discountType = 'product_automatic';
            }
        }

        // 6. APLICAR DESCUENTOS AUTOMÁTICOS DE LA TIENDA (storeAutomaticDiscounts)
        if (storeAutomaticDiscounts && storeAutomaticDiscounts.length > 0) {
            // Filtrar descuentos automáticos aplicables a este producto
            const applicableStoreDiscounts = storeAutomaticDiscounts.filter(discount => {
                // Verificar si el descuento aplica a este producto
                switch (discount.applies_to) {
                    case 'product':
                        // Verificar productos específicos
                        if (discount.products && discount.products.length > 0) {
                            return discount.products.some(p => p.id === product.id);
                        }
                        return false;

                    case 'category':
                        // Verificar categorías
                        if (discount.categories && discount.categories.length > 0) {
                            const productCategoryIds = product.categories.map(c => c.id);
                            return discount.categories.some(catId =>
                                productCategoryIds.includes(catId)
                            );
                        }
                        return false;

                    case 'order_total':
                        // Descuentos de orden total se aplican después
                        return false;

                    default:
                        return false;
                }
            });

            // Aplicar el descuento de tienda más beneficioso
            let bestStoreDiscount = null;
            let bestStoreDiscountedPrice = finalPrice;

            applicableStoreDiscounts.forEach(discount => {
                let discountedPrice = finalPrice;

                if (discount.discount_type === 'percentage') {
                    discountedPrice = finalPrice * (1 - (parseFloat(discount.value) / 100));
                } else if (discount.discount_type === 'fixed_amount') {
                    discountedPrice = Math.max(0, finalPrice - parseFloat(discount.value));
                }

                // Verificar si este descuento es mejor que el actual
                if (discountedPrice < bestStoreDiscountedPrice) {
                    bestStoreDiscountedPrice = discountedPrice;
                    bestStoreDiscount = discount;
                }
            });

            // Aplicar el mejor descuento de tienda encontrado
            if (bestStoreDiscount && bestStoreDiscountedPrice < finalPrice) {
                finalPrice = bestStoreDiscountedPrice;
                appliedAutomaticDiscount = bestStoreDiscount;
                discountAmount = basePrice - finalPrice;
                discountType = 'store_automatic';
            }
        }

        // 7. Calcular impuesto sobre el precio final
        const itemTaxAmount = (finalPrice * taxRate) / 100;

        // 8. Buscar stock
        const stock = combination
            ? (product.stocks?.find(s => s.combination_id === combination.id)?.quantity || 0)
            : (product.stocks?.filter(s => s.combination_id === null)
                .reduce((sum, s) => sum + s.quantity, 0) || 0);

        // 9. Buscar item existente
        const existingIndex = cart.findIndex(item =>
            item.productId === product.id &&
            item.combinationId === (combination ? combination.id : null)
        );

        if (existingIndex >= 0) {
            // Actualizar cantidad si hay stock suficiente
            const newQuantity = cart[existingIndex].quantity + quantity;
            if (newQuantity <= stock) {
                cart[existingIndex].quantity = newQuantity;
                cart[existingIndex].price = finalPrice;
                cart[existingIndex].originalPrice = basePrice;
                cart[existingIndex].subtotal = finalPrice * newQuantity;
                cart[existingIndex].taxAmount = itemTaxAmount * newQuantity;
                cart[existingIndex].automaticDiscount = appliedAutomaticDiscount;
                cart[existingIndex].discountAmount = discountAmount * newQuantity;
                cart[existingIndex].discountType = discountType;
                cart[existingIndex].hasDirectDiscount = product.product_price_discount && parseFloat(product.product_price_discount) > 0;
            }
        } else {
            // Agregar nuevo item si hay stock
            if (quantity <= stock) {
                const newItem = {
                    id: `${product.id}_${combination ? combination.id : 'simple'}_${Date.now()}`,
                    productId: product.id,
                    productName: product.product_name,
                    price: finalPrice,
                    originalPrice: basePrice,
                    hasDirectDiscount: product.product_price_discount && parseFloat(product.product_price_discount) > 0,
                    quantity: quantity,
                    combinationId: combination ? combination.id : null,
                    combinationName: combination ?
                        combination.attribute_values.map(av => `${av.attribute_name}: ${av.value_name}`).join(', ') :
                        null,
                    image: product.media?.[0]?.original_url || '',
                    stock: stock,
                    taxRate: taxRate,
                    taxAmount: itemTaxAmount * quantity,
                    subtotal: finalPrice * quantity,
                    automaticDiscount: appliedAutomaticDiscount,
                    discountAmount: discountAmount * quantity,
                    discountType: discountType,
                    manualDiscount: null,
                    categories: product.categories.map(c => c.id),
                    addedAt: new Date().toISOString()
                };

                cart.push(newItem);
            }
        }

        localStorage.setItem(cartKey, JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
        return cart;
    },

    updateItemQuantity: (companyId, productId, combinationId, newQuantity) => {
        const cartKey = cartHelper.getCartKey(companyId);
        const cart = cartHelper.getCart(companyId);
        const normalizedCombinationId = combinationId === undefined ? null : combinationId;

        const index = cart.findIndex(item =>
            item.productId === productId &&
            item.combinationId === normalizedCombinationId
        );

        if (index >= 0) {
            const item = cart[index];
            if (newQuantity <= item.stock && newQuantity > 0) {
                cart[index].quantity = newQuantity;
                cart[index].subtotal = item.price * newQuantity;
                cart[index].taxAmount = (item.price * (item.taxRate / 100)) * newQuantity;
                cart[index].discountAmount = (item.originalPrice - item.price) * newQuantity;
                localStorage.setItem(cartKey, JSON.stringify(cart));
                window.dispatchEvent(new Event('cartUpdated'));
            }
        }
        return cart;
    },

    removeItem: (companyId, productId, combinationId) => {
        const cartKey = cartHelper.getCartKey(companyId);
        const cart = cartHelper.getCart(companyId);

        const normalizedCombinationId = combinationId === undefined ? null : combinationId;

        const newCart = cart.filter(item => {
            if (item.productId !== productId) return true;
            return item.combinationId !== normalizedCombinationId;
        });

        localStorage.setItem(cartKey, JSON.stringify(newCart));
        window.dispatchEvent(new Event('cartUpdated'));
        return newCart;
    },

    clearCart: (companyId) => {
        const cartKey = cartHelper.getCartKey(companyId);
        localStorage.removeItem(cartKey);
        window.dispatchEvent(new Event('cartUpdated'));
        return [];
    },

    getCartSummary: (companyId, storeAutomaticDiscounts = []) => {
    const cart = cartHelper.getCart(companyId);
    
    if (cart.length === 0) {
        return {
            items: [],
            subtotal: 0,
            originalSubtotal: 0,
            taxTotal: 0,
            automaticDiscountTotal: 0,
            manualDiscountTotal: 0,
            totalAmount: 0,
            itemCount: 0,
            appliedAutomaticDiscounts: [],
            appliedManualDiscounts: []
        };
    }
    
    // 1. Calcular subtotal con TODOS los descuentos aplicados
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    
    // 2. Calcular subtotal original (sin descuentos)
    const originalSubtotal = cart.reduce((sum, item) => 
        sum + (item.originalPrice * item.quantity), 0);
    
    // 3. Calcular total de impuestos
    const taxTotal = cart.reduce((sum, item) => sum + item.taxAmount, 0);
    
    // 4. Calcular total de descuentos automáticos
    const automaticDiscountTotal = cart.reduce((sum, item) => 
        sum + (item.discountType !== 'manual' ? item.discountAmount : 0), 0);
    
    // 5. Calcular total de descuentos manuales (por código)
    const manualDiscountTotal = cart.reduce((sum, item) => 
        sum + (item.discountType === 'manual' ? item.discountAmount : 0), 0);
    
    // 6. Recolectar descuentos manuales aplicados
    const appliedManualDiscounts = [];
    const manualDiscountsMap = new Map();
    
    cart.forEach(item => {
        if (item.manualDiscount) {
            const discount = item.manualDiscount;
            if (!manualDiscountsMap.has(discount.code)) {
                manualDiscountsMap.set(discount.code, {
                    ...discount,
                    amount: 0,
                    items: []
                });
            }
            const storedDiscount = manualDiscountsMap.get(discount.code);
            storedDiscount.amount += item.discountAmount;
            storedDiscount.items.push({
                productId: item.productId,
                productName: item.productName,
                amount: item.discountAmount
            });
        }
    });
    
    manualDiscountsMap.forEach(discount => {
        appliedManualDiscounts.push(discount);
    });
    
    // 7. Calcular total final
    const totalAmount = Math.max(0, 
        originalSubtotal + taxTotal - automaticDiscountTotal - manualDiscountTotal
    );
    
    // IMPORTANTE: El subtotal debe ser el total con todos los descuentos aplicados
    // Si subtotal no incluye descuentos manuales, ajustarlo
    const subtotalWithAllDiscounts = originalSubtotal - automaticDiscountTotal - manualDiscountTotal;
    
    return {
        items: cart,
        subtotal: parseFloat(subtotal.toFixed(2)),
        subtotalWithAllDiscounts: parseFloat(subtotalWithAllDiscounts.toFixed(2)), // NUEVO
        originalSubtotal: parseFloat(originalSubtotal.toFixed(2)),
        taxTotal: parseFloat(taxTotal.toFixed(2)),
        automaticDiscountTotal: parseFloat(automaticDiscountTotal.toFixed(2)),
        manualDiscountTotal: parseFloat(manualDiscountTotal.toFixed(2)),
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
        appliedAutomaticDiscounts: [],
        appliedManualDiscounts: appliedManualDiscounts
    };
},

    // cartHelper.js - FUNCIÓN ACTUALIZADA applyManualDiscount
    applyManualDiscount: (companyId, discountCode, discountData) => {
        const cartKey = cartHelper.getCartKey(companyId);
        const cart = cartHelper.getCart(companyId);

        if (!discountData) {
            // Limpiar todos los descuentos manuales
            const cleanedCart = cart.map(item => ({
                ...item,
                manualDiscount: null,
                // Restaurar precio original si tenía descuento manual
                price: item.originalPrice,
                discountAmount: item.automaticDiscount ?
                    (item.originalPrice - item.price) * item.quantity : 0,
                discountType: item.automaticDiscount ? 'automatic' : 'none'
            }));

            localStorage.setItem(cartKey, JSON.stringify(cleanedCart));
            window.dispatchEvent(new Event('cartUpdated'));
            return cleanedCart;
        }

        let updatedCart = [...cart];

        // Si el descuento está asociado a un producto específico (tiene product_id)
        if (discountData.product_id) {
            updatedCart = cart.map(item => {
                // Aplicar solo al producto específico
                if (item.productId === discountData.product_id) {
                    // Verificar combinación si aplica
                    if (discountData.pivot && discountData.pivot.combination_id !== null) {
                        if (item.combinationId !== discountData.pivot.combination_id) {
                            return item; // No aplicar si no es la combinación correcta
                        }
                    }

                    let discountedPrice = item.originalPrice;

                    if (discountData.discount_type === 'percentage') {
                        discountedPrice = item.originalPrice * (1 - (parseFloat(discountData.value) / 100));
                    } else if (discountData.discount_type === 'fixed_amount') {
                        discountedPrice = Math.max(0, item.originalPrice - parseFloat(discountData.value));
                    }

                    return {
                        ...item,
                        price: discountedPrice,
                        manualDiscount: discountData,
                        subtotal: discountedPrice * item.quantity,
                        taxAmount: (discountedPrice * (item.taxRate / 100)) * item.quantity,
                        discountAmount: (item.originalPrice - discountedPrice) * item.quantity,
                        discountType: item.discountType === 'automatic' ? 'automatic_and_manual' : 'manual'
                    };
                }
                return item;
            });
        } else {
            // Para descuentos generales (no asociados a producto específico)
            switch (discountData.applies_to) {
                case 'product':
                    if (discountData.products && discountData.products.length > 0) {
                        const productIds = discountData.products.map(p => p.id);

                        updatedCart = cart.map(item => {
                            if (productIds.includes(item.productId)) {
                                let discountedPrice = item.originalPrice;

                                if (discountData.discount_type === 'percentage') {
                                    discountedPrice = item.originalPrice * (1 - (parseFloat(discountData.value) / 100));
                                } else if (discountData.discount_type === 'fixed_amount') {
                                    discountedPrice = Math.max(0, item.originalPrice - parseFloat(discountData.value));
                                }

                                return {
                                    ...item,
                                    price: discountedPrice,
                                    manualDiscount: discountData,
                                    subtotal: discountedPrice * item.quantity,
                                    taxAmount: (discountedPrice * (item.taxRate / 100)) * item.quantity,
                                    discountAmount: (item.originalPrice - discountedPrice) * item.quantity,
                                    discountType: item.discountType === 'automatic' ? 'automatic_and_manual' : 'manual'
                                };
                            }
                            return item;
                        });
                    }
                    break;

                case 'category':
                    if (discountData.categories && discountData.categories.length > 0) {
                        updatedCart = cart.map(item => {
                            // Necesitamos pasar información de categorías del producto
                            // Esto es un ejemplo, ajusta según tu estructura
                            const hasMatchingCategory = item.categories?.some(catId =>
                                discountData.categories.includes(catId)
                            );

                            if (hasMatchingCategory) {
                                let discountedPrice = item.originalPrice;

                                if (discountData.discount_type === 'percentage') {
                                    discountedPrice = item.originalPrice * (1 - (parseFloat(discountData.value) / 100));
                                } else if (discountData.discount_type === 'fixed_amount') {
                                    discountedPrice = Math.max(0, item.originalPrice - parseFloat(discountData.value));
                                }

                                return {
                                    ...item,
                                    price: discountedPrice,
                                    manualDiscount: discountData,
                                    subtotal: discountedPrice * item.quantity,
                                    taxAmount: (discountedPrice * (item.taxRate / 100)) * item.quantity,
                                    discountAmount: (item.originalPrice - discountedPrice) * item.quantity,
                                    discountType: item.discountType === 'automatic' ? 'automatic_and_manual' : 'manual'
                                };
                            }
                            return item;
                        });
                    }
                    break;

                case 'order_total':
                    // Descuento de orden total - se maneja en getCartSummary
                    updatedCart = cart.map(item => ({
                        ...item,
                        manualDiscount: discountData
                    }));
                    break;
            }
        }

        localStorage.setItem(cartKey, JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
        return updatedCart;
    },

    validateCartStock: (companyId, products) => {
        const cart = cartHelper.getCart(companyId);
        const errors = [];

        cart.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) {
                errors.push(`Producto ${item.productName} no encontrado`);
                return;
            }

            let stock = 0;
            if (item.combinationId) {
                const stockObj = product.stocks?.find(s => s.combination_id === item.combinationId);
                stock = stockObj?.quantity || 0;
            } else {
                stock = product.stocks?.filter(s => s.combination_id === null)
                    .reduce((sum, s) => sum + s.quantity, 0) || 0;
            }

            if (item.quantity > stock) {
                errors.push(`${item.productName}: Stock insuficiente. Disponible: ${stock}, Solicitado: ${item.quantity}`);
            }
        });

        return {
            valid: errors.length === 0,
            errors
        };
    }
};

export default cartHelper;