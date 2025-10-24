/**
 * Valida si un valor es un número positivo.
 * @param {string|number} value - Valor a validar.
 * @returns {boolean} - True si es válido.
 */
export const isValidPositiveNumber = (value) => {
    const numericValue = parseFloat(value);
    return !isNaN(numericValue) && numericValue >= 0;
};

/**
 * Obtiene el mensaje de error para un campo numérico positivo.
 * @param {string} fieldName - Nombre del campo (e.g., 'precio', 'stock').
 * @returns {string} - Mensaje de error.
 */
export const getPositiveNumberError = (fieldName) => {
    return `Por favor, ingresa un ${fieldName} válido (número positivo).`;
};