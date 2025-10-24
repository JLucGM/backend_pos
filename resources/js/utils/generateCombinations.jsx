/**
 * Genera todas las combinaciones posibles de valores de atributos.
 * @param {Array} attributeNames - Nombres de los atributos (e.g., ['Color', 'Tamaño']).
 * @param {Array<Array>} attributeValues - Valores de cada atributo (e.g., [['Rojo', 'Azul'], ['Pequeño', 'Grande']]).
 * @returns {Array<Array>} - Array de combinaciones (e.g., [['Rojo', 'Pequeño'], ['Rojo', 'Grande']]).
 */
export const generateCombinations = (attributeNames, attributeValues) => {
    const validAttributeData = attributeNames
        .map((name, index) => ({ name, values: attributeValues[index] || [] }))
        .filter(attr => attr.name && attr.name.trim() !== '' && attr.values.length > 0 && attr.values.every(val => val.trim() !== ''));

    if (validAttributeData.length === 0) {
        return [[]];
    }

    const combinations = [];

    const generate = (prefix, index) => {
        if (index === validAttributeData.length) {
            combinations.push(prefix);
            return;
        }
        const currentAttributeValues = validAttributeData[index].values;
        for (const value of currentAttributeValues) {
            generate([...prefix, value], index + 1);
        }
    };

    generate([], 0);
    return combinations;
};