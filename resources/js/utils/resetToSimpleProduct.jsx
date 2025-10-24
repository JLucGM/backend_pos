/**
 * Resetea el estado del producto a un producto simple (sin atributos).
 * @param {Object} data - Estado actual de datos.
 * @param {Function} setData - Función para actualizar estado.
 */
export const resetToSimpleProduct = (data, setData) => {
    setData('prices', [{
        id: null,
        combination_price: data.product_price || "0",
        stock: data.quantity || "0",
        product_barcode: data.product_barcode || "",
        product_sku: data.product_sku || "",
        combination_attribute_value: [],
        _key: 'default'
    }]);
    setData('stocks', { 'default': data.quantity || "0" });
    setData('barcodes', { 'default': data.product_barcode || "" });
    setData('skus', { 'default': data.product_sku || "" });
};