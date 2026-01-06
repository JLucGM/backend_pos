// Helper/cartHelper.js - VERSIÓN COMPLETA CON AMBOS TIPOS DE DESCUENTOS
const cartHelper = {
    getCartKey: (companyId) => `shoppingCart_${companyId}`,
    
    getCart: (companyId) => {
        const cartKey = cartHelper.getCartKey(companyId);
        const cart = localStorage.getItem(cartKey);
        return cart ? JSON.parse(cart) : [];
    },
    
    addToCart: (companyId, product, combination = null, quantity = 1, automaticDiscounts = []) => {
        const cartKey = cartHelper.getCartKey(companyId);
        const cart = cartHelper.getCart(companyId);
        
        // 1. Determinar precio base
        const basePrice = combination ? parseFloat(combination.price) : parseFloat(product.product_price);
        
        // 2. Determinar tasa de impuesto
        const taxRate = product.tax ? parseFloat(product.tax.tax_rate) : 0;
        
        // 3. Buscar descuentos automáticos aplicables
        let discountedPrice = basePrice;
        let appliedAutomaticDiscount = null;
        
        // Filtrar descuentos automáticos que aplican a este producto
        if (automaticDiscounts && automaticDiscounts.length > 0) {
            const applicableAutoDiscounts = automaticDiscounts.filter(discount => {
                // Solo descuentos automáticos
                if (!discount.automatic) return false;
                
                // Verificar a qué aplica el descuento
                switch (discount.applies_to) {
                    case 'product':
                        // Verificar si el descuento aplica a este producto específico
                        if (discount.products && discount.products.length > 0) {
                            const productMatch = discount.products.some(p => 
                                p.id === product.id && 
                                (p.pivot?.combination_id === null || p.pivot?.combination_id === (combination ? combination.id : null))
                            );
                            return productMatch;
                        }
                        return false;
                        
                    case 'category':
                        // Verificar si el descuento aplica a alguna categoría del producto
                        if (discount.categories && discount.categories.length > 0) {
                            const productCategoryIds = product.categories.map(c => c.id);
                            const categoryMatch = discount.categories.some(catId => 
                                productCategoryIds.includes(catId)
                            );
                            return categoryMatch;
                        }
                        return false;
                        
                    case 'order_total':
                        // Estos se aplican después en getCartSummary
                        return false;
                        
                    default:
                        return false;
                }
            });
            
            // Aplicar el primer descuento automático válido (solo uno)
            if (applicableAutoDiscounts.length > 0) {
                appliedAutomaticDiscount = applicableAutoDiscounts[0];
                if (appliedAutomaticDiscount.discount_type === 'percentage') {
                    discountedPrice = basePrice * (1 - (appliedAutomaticDiscount.value / 100));
                } else {
                    discountedPrice = Math.max(0, basePrice - appliedAutomaticDiscount.value);
                }
            }
        }
        
        // 4. Calcular impuesto sobre el precio final (con descuento automático si aplica)
        const itemTaxAmount = (discountedPrice * taxRate) / 100;
        
        // 5. Buscar stock
        const stock = combination 
            ? (product.stocks?.find(s => s.combination_id === combination.id)?.quantity || 0)
            : (product.stocks?.filter(s => s.combination_id === null)
                .reduce((sum, s) => sum + s.quantity, 0) || 0);
        
        // 6. Buscar item existente
        const existingIndex = cart.findIndex(item => 
            item.productId === product.id && 
            item.combinationId === (combination ? combination.id : null)
        );
        
        if (existingIndex >= 0) {
            // Actualizar cantidad si hay stock suficiente
            const newQuantity = cart[existingIndex].quantity + quantity;
            if (newQuantity <= stock) {
                cart[existingIndex].quantity = newQuantity;
                cart[existingIndex].subtotal = discountedPrice * newQuantity;
                cart[existingIndex].taxAmount = itemTaxAmount * newQuantity;
                // Actualizar descuento automático si aplica
                if (appliedAutomaticDiscount) {
                    cart[existingIndex].automaticDiscount = appliedAutomaticDiscount;
                }
            }
        } else {
            // Agregar nuevo item si hay stock
            if (quantity <= stock) {
                const newItem = {
                    id: `${product.id}_${combination ? combination.id : 'simple'}_${Date.now()}`,
                    productId: product.id,
                    productName: product.product_name,
                    price: discountedPrice, // Precio con descuento automático si aplica
                    originalPrice: basePrice, // Precio base sin descuentos
                    quantity: quantity,
                    combinationId: combination ? combination.id : null,
                    combinationName: combination ? 
                        combination.attribute_values.map(av => `${av.attribute_name}: ${av.value_name}`).join(', ') : 
                        null,
                    image: product.media?.[0]?.original_url || '',
                    stock: stock,
                    taxRate: taxRate,
                    taxAmount: itemTaxAmount * quantity,
                    subtotal: discountedPrice * quantity,
                    automaticDiscount: appliedAutomaticDiscount, // Guardar descuento automático
                    manualDiscount: null, // Descuento manual se aplica después
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
    
    getCartSummary: (companyId, manualDiscount = null, automaticDiscounts = []) => {
        const cart = cartHelper.getCart(companyId);
        
        if (cart.length === 0) {
            return {
                items: [],
                subtotal: 0,
                taxTotal: 0,
                automaticDiscountTotal: 0,
                manualDiscountTotal: 0,
                totalAmount: 0,
                itemCount: 0,
                appliedAutomaticDiscounts: [],
                appliedManualDiscount: null
            };
        }
        
        // 1. Calcular subtotal con descuentos automáticos ya aplicados
        const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
        
        // 2. Calcular total de impuestos
        const taxTotal = cart.reduce((sum, item) => sum + item.taxAmount, 0);
        
        // 3. Calcular total de descuentos automáticos ya aplicados
        const automaticDiscountTotal = cart.reduce((sum, item) => {
            if (item.automaticDiscount) {
                const originalSubtotal = item.originalPrice * item.quantity;
                return sum + (originalSubtotal - item.subtotal);
            }
            return sum;
        }, 0);
        
        // 4. Buscar descuentos automáticos de orden total que no se hayan aplicado
        let orderTotalDiscounts = 0;
        let appliedOrderDiscounts = [];
        
        const orderTotalAutoDiscounts = automaticDiscounts.filter(d => 
            d.automatic && d.applies_to === 'order_total'
        );
        
        const orderTotalBeforeManual = subtotal + taxTotal;
        
        orderTotalAutoDiscounts.forEach(discount => {
            // Verificar monto mínimo
            if (discount.minimum_order_amount && orderTotalBeforeManual < discount.minimum_order_amount) {
                return;
            }
            
            let discountAmount = 0;
            if (discount.discount_type === 'percentage') {
                discountAmount = orderTotalBeforeManual * (discount.value / 100);
            } else {
                discountAmount = Math.min(discount.value, orderTotalBeforeManual);
            }
            
            if (discountAmount > 0) {
                orderTotalDiscounts += discountAmount;
                appliedOrderDiscounts.push({
                    ...discount,
                    amount: discountAmount,
                    type: 'order_total_automatic'
                });
            }
        });
        
        // 5. Calcular descuento manual (por código)
        let manualDiscountTotal = 0;
        let appliedManualDiscount = null;
        
        if (manualDiscount) {
            const orderTotalAfterAuto = orderTotalBeforeManual - orderTotalDiscounts;
            
            if (manualDiscount.discount_type === 'percentage') {
                manualDiscountTotal = orderTotalAfterAuto * (manualDiscount.value / 100);
            } else {
                manualDiscountTotal = Math.min(manualDiscount.value, orderTotalAfterAuto);
            }
            
            appliedManualDiscount = manualDiscount;
        }
        
        // 6. Calcular total final
        const totalAmount = Math.max(0, 
            subtotal + taxTotal - orderTotalDiscounts - manualDiscountTotal
        );
        
        return {
            items: cart,
            subtotal: parseFloat(subtotal.toFixed(2)),
            taxTotal: parseFloat(taxTotal.toFixed(2)),
            automaticDiscountTotal: parseFloat((automaticDiscountTotal + orderTotalDiscounts).toFixed(2)),
            manualDiscountTotal: parseFloat(manualDiscountTotal.toFixed(2)),
            totalAmount: parseFloat(totalAmount.toFixed(2)),
            itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
            appliedAutomaticDiscounts: [
                ...cart.filter(item => item.automaticDiscount).map(item => item.automaticDiscount),
                ...appliedOrderDiscounts
            ],
            appliedManualDiscount: appliedManualDiscount
        };
    },
    
    // Función para aplicar descuento manual (código)
    applyManualDiscount: (companyId, discountCode, discountData) => {
        const cartKey = cartHelper.getCartKey(companyId);
        const cart = cartHelper.getCart(companyId);
        
        // Primero, quitar cualquier descuento manual previo
        const cartWithoutManual = cart.map(item => ({
            ...item,
            manualDiscount: null
        }));
        
        // Si no hay descuento, solo limpiar
        if (!discountData) {
            localStorage.setItem(cartKey, JSON.stringify(cartWithoutManual));
            window.dispatchEvent(new Event('cartUpdated'));
            return cartWithoutManual;
        }
        
        // Aplicar nuevo descuento manual según su tipo
        let updatedCart = cartWithoutManual;
        
        switch (discountData.applies_to) {
            case 'product':
                // Aplicar a productos específicos
                updatedCart = cartWithoutManual.map(item => {
                    const productMatch = discountData.products?.some(p => 
                        p.id === item.productId && 
                        (p.pivot?.combination_id === null || p.pivot?.combination_id === item.combinationId)
                    );
                    
                    if (productMatch) {
                        let discountedPrice = item.price;
                        if (discountData.discount_type === 'percentage') {
                            discountedPrice = item.originalPrice * (1 - (discountData.value / 100));
                        } else {
                            discountedPrice = Math.max(0, item.originalPrice - discountData.value);
                        }
                        
                        return {
                            ...item,
                            price: discountedPrice,
                            manualDiscount: discountData,
                            subtotal: discountedPrice * item.quantity,
                            taxAmount: (discountedPrice * (item.taxRate / 100)) * item.quantity
                        };
                    }
                    return item;
                });
                break;
                
            case 'category':
                // Aplicar a categorías
                updatedCart = cartWithoutManual.map(item => {
                    const categoryMatch = discountData.categories?.some(catId => 
                        item.categories.includes(catId)
                    );
                    
                    if (categoryMatch) {
                        let discountedPrice = item.price;
                        if (discountData.discount_type === 'percentage') {
                            discountedPrice = item.originalPrice * (1 - (discountData.value / 100));
                        } else {
                            discountedPrice = Math.max(0, item.originalPrice - discountData.value);
                        }
                        
                        return {
                            ...item,
                            price: discountedPrice,
                            manualDiscount: discountData,
                            subtotal: discountedPrice * item.quantity,
                            taxAmount: (discountedPrice * (item.taxRate / 100)) * item.quantity
                        };
                    }
                    return item;
                });
                break;
                
            case 'order_total':
                // Descuento de orden total - se aplica en getCartSummary, no en los items
                updatedCart = cartWithoutManual.map(item => ({
                    ...item,
                    manualDiscount: discountData
                }));
                break;
        }
        
        localStorage.setItem(cartKey, JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
        return updatedCart;
    },
    
    // Función para aplicar gift card
    applyGiftCard: (companyId, giftCardCode, giftCardBalance) => {
        const cartSummary = cartHelper.getCartSummary(companyId);
        const maxApplicable = Math.min(giftCardBalance, cartSummary.totalAmount);
        
        return {
            applied: maxApplicable,
            remainingBalance: giftCardBalance - maxApplicable,
            newTotal: Math.max(0, cartSummary.totalAmount - maxApplicable)
        };
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