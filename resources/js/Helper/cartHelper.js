// Helper/cartHelper.js - VERSIÓN COMPLETA Y CORREGIDA
const cartHelper = {
    getCartKey: (companyId) => `shoppingCart_${companyId}`,
    
    getCart: (companyId) => {
        const cartKey = cartHelper.getCartKey(companyId);
        const cart = localStorage.getItem(cartKey);
        return cart ? JSON.parse(cart) : [];
    },
    
    addToCart: (companyId, product, combination = null, quantity = 1) => {
        const cartKey = cartHelper.getCartKey(companyId);
        const cart = cartHelper.getCart(companyId);
        
        // 1. Determinar precio base
        const basePrice = combination ? parseFloat(combination.price) : parseFloat(product.product_price);
        
        // 2. Determinar tasa de impuesto
        const taxRate = product.tax ? parseFloat(product.tax.tax_rate) : 0;
        
        // 3. Calcular precio con descuento de producto (si aplica)
        let discountedPrice = basePrice;
        let productDiscount = null;
        
        // Buscar descuentos aplicables al producto
        if (product.discounts && product.discounts.length > 0) {
            // Filtrar descuentos que aplican a este producto específico
            const applicableDiscounts = product.discounts.filter(discount => {
                // Si el descuento es para combinación específica, verificar
                if (discount.pivot?.combination_id) {
                    return combination && discount.pivot.combination_id === combination.id;
                }
                // Descuento para producto simple
                return !combination;
            });
            
            // Aplicar el primer descuento válido
            if (applicableDiscounts.length > 0) {
                productDiscount = applicableDiscounts[0];
                if (productDiscount.discount_type === 'percentage') {
                    discountedPrice = basePrice * (1 - (productDiscount.value / 100));
                } else {
                    discountedPrice = Math.max(0, basePrice - productDiscount.value);
                }
            }
        }
        
        // 4. Calcular impuesto sobre el precio con descuento
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
            }
        } else {
            // Agregar nuevo item si hay stock
            if (quantity <= stock) {
                const newItem = {
                    id: `${product.id}_${combination ? combination.id : 'simple'}_${Date.now()}`,
                    productId: product.id,
                    productName: product.product_name,
                    price: discountedPrice,
                    originalPrice: basePrice,
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
                    productDiscount: productDiscount,
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
        
        // Normalizar combinationId: undefined -> null
        const normalizedCombinationId = combinationId === undefined ? null : combinationId;
        
        const newCart = cart.filter(item => {
            // Si el productId no coincide, mantener el item
            if (item.productId !== productId) return true;
            
            // Si ambos tienen null o el mismo combinationId, eliminar
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
    
    getCartSummary: (companyId, discounts = []) => {
        const cart = cartHelper.getCart(companyId);
        
        if (cart.length === 0) {
            return {
                items: [],
                subtotal: 0,
                taxTotal: 0,
                discountTotal: 0,
                totalAmount: 0,
                itemCount: 0
            };
        }
        
        // Calcular subtotal sumando los subtotales de cada item
        const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
        
        // Calcular total de impuestos sumando los taxAmount de cada item
        const taxTotal = cart.reduce((sum, item) => sum + item.taxAmount, 0);
        
        // Calcular descuentos aplicables
        let discountTotal = 0;
        let appliedDiscounts = [];
        
        // 1. Descuentos de categoría
        const categoryDiscounts = discounts.filter(d => d.applies_to === 'category');
        // 2. Descuentos de orden total
        const orderDiscounts = discounts.filter(d => d.applies_to === 'order_total');
        
        // Aplicar descuentos de categoría
        categoryDiscounts.forEach(discount => {
            const categoryIds = discount.categories || [];
            const applicableItems = cart.filter(item => 
                item.categories.some(catId => categoryIds.includes(catId))
            );
            
            if (applicableItems.length > 0) {
                const itemsSubtotal = applicableItems.reduce((sum, item) => sum + item.subtotal, 0);
                let discountAmount = 0;
                
                if (discount.discount_type === 'percentage') {
                    discountAmount = itemsSubtotal * (discount.value / 100);
                } else {
                    discountAmount = Math.min(discount.value, itemsSubtotal);
                }
                
                if (discountAmount > 0) {
                    discountTotal += discountAmount;
                    appliedDiscounts.push({
                        ...discount,
                        amount: discountAmount,
                        type: 'category'
                    });
                }
            }
        });
        
        // Aplicar descuentos de orden total (después de impuestos)
        orderDiscounts.forEach(discount => {
            const orderTotalBeforeDiscount = subtotal + taxTotal - discountTotal;
            
            // Verificar monto mínimo de orden
            if (discount.minimum_order_amount && orderTotalBeforeDiscount < discount.minimum_order_amount) {
                return;
            }
            
            let discountAmount = 0;
            if (discount.discount_type === 'percentage') {
                discountAmount = orderTotalBeforeDiscount * (discount.value / 100);
            } else {
                discountAmount = Math.min(discount.value, orderTotalBeforeDiscount);
            }
            
            if (discountAmount > 0) {
                discountTotal += discountAmount;
                appliedDiscounts.push({
                    ...discount,
                    amount: discountAmount,
                    type: 'order_total'
                });
            }
        });
        
        // Calcular total final
        const totalAmount = Math.max(0, subtotal + taxTotal - discountTotal);
        
        return {
            items: cart,
            subtotal: parseFloat(subtotal.toFixed(2)),
            taxTotal: parseFloat(taxTotal.toFixed(2)),
            discountTotal: parseFloat(discountTotal.toFixed(2)),
            totalAmount: parseFloat(totalAmount.toFixed(2)),
            itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
            appliedDiscounts: appliedDiscounts
        };
    },
    
    // AÑADE ESTA FUNCIÓN QUE FALTA - Es la que está causando el error
    applyProductDiscounts: (cartItems, discounts = []) => {
        // Esta función aplica descuentos específicos de producto
        // Nota: En nuestra nueva estructura, los descuentos de producto ya se aplican en addToCart
        // Pero mantenemos esta función por compatibilidad
        
        return cartItems.map(item => {
            let discountedPrice = item.price || item.originalPrice;
            let appliedDiscount = null;
            
            // Buscar descuentos que apliquen a este producto
            const productDiscounts = discounts.filter(discount => {
                if (discount.applies_to === 'product') {
                    // Verificar si el descuento aplica a este producto específico
                    const productMatch = discount.products?.some(p => 
                        p.id === item.productId && 
                        (p.pivot?.combination_id === null || p.pivot?.combination_id === item.combinationId)
                    );
                    return productMatch;
                }
                return false;
            });
            
            // Aplicar el primer descuento válido
            if (productDiscounts.length > 0) {
                const discount = productDiscounts[0];
                appliedDiscount = discount;
                
                const basePrice = item.originalPrice || item.price;
                
                if (discount.discount_type === 'percentage') {
                    discountedPrice = basePrice * (1 - (discount.value / 100));
                } else {
                    discountedPrice = Math.max(0, basePrice - discount.value);
                }
                
                // Recalcular impuesto con el nuevo precio
                const newTaxAmount = (discountedPrice * (item.taxRate || 0)) / 100;
                
                return {
                    ...item,
                    price: discountedPrice,
                    originalPrice: basePrice,
                    appliedDiscount,
                    taxAmount: newTaxAmount * item.quantity,
                    subtotal: discountedPrice * item.quantity
                };
            }
            
            return item;
        });
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
                // Sumar stocks sin combinación
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