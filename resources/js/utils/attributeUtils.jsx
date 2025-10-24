/**
 * Agrega un nuevo atributo vacío a los arrays de nombres y valores.
 * @param {Array} attributeNames - Array actual de nombres.
 * @param {Array} attributeValues - Array actual de valores.
 * @param {number} maxAttributes - Máximo número de atributos permitidos.
 * @returns {Object} - Nuevos arrays { newNames, newValues }.
 */
export const addNewAttribute = (attributeNames, attributeValues, maxAttributes = 3) => {
    if (attributeNames.length >= maxAttributes) {
        throw new Error("No puedes agregar más atributos.");
    }
    return {
        newNames: [...attributeNames, ""],
        newValues: [...attributeValues, [""]]
    };
};

/**
 * Remueve un atributo por índice de los arrays de nombres y valores.
 * @param {Array} attributeNames - Array actual de nombres.
 * @param {Array} attributeValues - Array actual de valores.
 * @param {number} index - Índice a remover.
 * @returns {Object} - Nuevos arrays { newNames, newValues }.
 */
export const removeAttributeByIndex = (attributeNames, attributeValues, index) => {
    const newNames = [...attributeNames];
    const newValues = [...attributeValues];
    newNames.splice(index, 1);
    newValues.splice(index, 1);
    return { newNames, newValues };
};

/**
 * Agrega un nuevo valor vacío a un atributo específico.
 * @param {Array} attributeValues - Array actual de valores.
 * @param {number} index - Índice del atributo.
 * @returns {Array} - Nuevo array de valores.
 */
export const addNewAttributeValue = (attributeValues, index) => {
    const newValues = [...attributeValues];
    newValues[index] = [...newValues[index], ""];
    return newValues;
};

/**
 * Remueve un valor de atributo por índices.
 * @param {Array} attributeValues - Array actual de valores.
 * @param {number} attributeIndex - Índice del atributo.
 * @param {number} valueIndex - Índice del valor.
 * @returns {Array} - Nuevo array de valores.
 */
export const removeAttributeValueByIndex = (attributeValues, attributeIndex, valueIndex) => {
    const newValues = [...attributeValues];
    newValues[attributeIndex].splice(valueIndex, 1);
    return newValues;
};

/**
 * Verifica si hay atributos válidos para generar combinaciones.
 * @param {Array} attributeNames - Nombres de atributos.
 * @param {Array} attributeValues - Valores de atributos.
 * @returns {boolean} - True si hay al menos un atributo válido.
 */
export const hasValidAttributes = (attributeNames, attributeValues) => {
    return attributeNames.some((name, index) => 
        name && name.trim() !== '' && 
        attributeValues[index] && 
        attributeValues[index].some(val => val.trim() !== '')
    );
};