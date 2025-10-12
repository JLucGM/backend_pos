/**
 * Formatea el display de atributos para una combinación de producto.
 * @param {Object} combination - Objeto de combinación con 'combination_attribute_value' (array).
 * @returns {string} String formateado como " - Atributo1: Valor1, Atributo2: Valor2" o vacío.
 */
export const formatAttributesDisplay = (combination) => {
    if (!combination.combination_attribute_value || !Array.isArray(combination.combination_attribute_value)) {
        return '';
    }

    const attributesDisplay = combination.combination_attribute_value
        .map(cav =>
            `${cav.attribute_value.attribute.attribute_name}: ${cav.attribute_value.attribute_value_name}`
        )
        .join(', ');

    return attributesDisplay ? ` - ${attributesDisplay}` : '';
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