/**
 * Formatea el display de atributos para una combinación de producto.
 * @param {Object} combination - Objeto de combinación con 'combination_attribute_value' (array).
 * @param {boolean} [asString=false] - Si true, retorna string plano (para compatibilidad); si false, array para badges.
 * @returns {Array|string} Array de {attribute_name, attribute_value_name} o string formateado.
 */
export const formatAttributesDisplay = (combination, asString = false) => {
    if (!combination.combination_attribute_value || !Array.isArray(combination.combination_attribute_value)) {
        return asString ? '' : [];
    }

    const attributesArray = combination.combination_attribute_value.map(cav => ({
        attribute_name: cav.attribute_value.attribute.attribute_name, // e.g., "talla"
        attribute_value_name: cav.attribute_value.attribute_value_name, // e.g., "s"
    }));

    if (asString) {
        // Modo string (compatibilidad): Une como antes
        const attributesDisplay = attributesArray
            .map(attr => `${attr.attribute_name}: ${attr.attribute_value_name}`)
            .join(', ');
        return attributesDisplay ? ` - ${attributesDisplay}` : '';
    }

    // Modo array (para badges): Retorna el array directamente
    return attributesArray;
};

/**
* Obtiene el barcode de un producto basado en la combinación (null para simples).
    * @param {Object} product - Producto con array 'stocks'.
    * @param {number|null} combinationId - ID de combinación (null para simple).
    * @returns {string|null} Barcode o null si no existe.
    */
export const getBarcode = (product, combinationId = null) => {
    if (!product.stocks || product.stocks.length === 0) return null;

    const stockEntry = product.stocks.find(s => s.combination_id === combinationId);
    return stockEntry ? stockEntry.product_barcode : null;
};

/**
    * Filtra opciones de productos por búsqueda (case-insensitive en label).
    * @param {Object} option - Opción del Select con 'label'.
    * @param {string} inputValue - Término de búsqueda del usuario.
    * @returns {boolean} True si el label contiene el término.
    */
export const filterProductOptions = (option, inputValue) => {
    const searchTerm = inputValue.toLowerCase();
    const label = option.label.toLowerCase();
    return label.includes(searchTerm);
};