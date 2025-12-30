// cartHelper.js
const cartHelper = {
    // Genera una clave única para cada tenant
    getCartKey: (companyId) => {
        return `shoppingCart_${companyId}`;
    },
    
    getCart: (companyId) => {
        const cartKey = cartHelper.getCartKey(companyId);
        const cart = localStorage.getItem(cartKey);
        return cart ? JSON.parse(cart) : [];
    },
    
    addToCart: (companyId, product, combination = null, quantity = 1) => {
        const cartKey = cartHelper.getCartKey(companyId);
        const cart = cartHelper.getCart(companyId);
        
        const item = {
            productId: product.id,
            productName: product.product_name,
            price: combination ? combination.price : product.product_price,
            quantity: quantity,
            combinationId: combination ? combination.id : null,
            combinationName: combination ? combination.attribute_values?.map(attr => attr.value_name).join(' / ') : null,
            image: product.media?.[0]?.original_url || '',
            stock: combination 
                ? (product.stocks?.find(s => s.combination_id === combination.id)?.quantity || 0)
                : (product.stocks?.reduce((sum, stock) => sum + stock.quantity, 0) || 0),
            addedAt: new Date().toISOString()
        };
        
        // Verificar si ya existe
        const existingIndex = cart.findIndex(item => 
            item.productId === product.id && 
            item.combinationId === (combination ? combination.id : null)
        );
        
        if (existingIndex >= 0) {
            cart[existingIndex].quantity += quantity;
        } else {
            cart.push(item);
        }
        
        localStorage.setItem(cartKey, JSON.stringify(cart));
        return cart;
    },
    
    updateQuantity: (companyId, productId, combinationId, newQuantity) => {
        const cartKey = cartHelper.getCartKey(companyId);
        const cart = cartHelper.getCart(companyId);
        const index = cart.findIndex(item => 
            item.productId === productId && item.combinationId === combinationId
        );
        
        if (index >= 0) {
            cart[index].quantity = Math.max(1, newQuantity);
            localStorage.setItem(cartKey, JSON.stringify(cart));
        }
        return cart;
    },
    
    removeItem: (companyId, productId, combinationId) => {
        const cartKey = cartHelper.getCartKey(companyId);
        const cart = cartHelper.getCart(companyId);
        const newCart = cart.filter(item => 
            !(item.productId === productId && item.combinationId === combinationId)
        );
        localStorage.setItem(cartKey, JSON.stringify(newCart));
        return newCart;
    },
    
    clearCart: (companyId) => {
        const cartKey = cartHelper.getCartKey(companyId);
        localStorage.removeItem(cartKey);
        return [];
    },
    
    getCartSummary: (companyId) => {
        const cart = cartHelper.getCart(companyId);
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        const totalAmount = cart.reduce((total, item) => 
            total + (parseFloat(item.price) * item.quantity), 0
        );
        
        return {
            itemCount,
            totalAmount,
            items: cart
        };
    }
};

export default cartHelper;