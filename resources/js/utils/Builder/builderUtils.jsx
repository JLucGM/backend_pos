// utils/Builder/builderUtils.js
export const addToHistory = (newComponents, history, setHistory, historyIndex, setHistoryIndex) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newComponents)));
    if (newHistory.length > 10) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
};

// Función para encontrar un componente en el árbol
export const findComponentInTree = (components, id) => {
    for (const component of components) {
        if (component.id === id) {
            return component;
        }
        if (component.type === 'container' && component.content) {
            const found = findComponentInTree(component.content, id);
            if (found) return found;
        }
    }
    return null;
};

// Función para eliminar un componente del árbol
export const removeComponentFromTree = (components, id) => {
    return components.filter(component => {
        if (component.id === id) {
            return false;
        }
        if (component.type === 'container' && component.content) {
            component.content = removeComponentFromTree(component.content, id);
        }
        return true;
    });
};

// Función para obtener la ruta completa de un componente
export const getComponentPath = (components, id, path = []) => {
    for (let i = 0; i < components.length; i++) {
        if (components[i].id === id) {
            return [...path, i];
        }
        if (components[i].type === 'container' && components[i].content) {
            const found = getComponentPath(components[i].content, id, [...path, i]);
            if (found) return found;
        }
    }
    return null;
};

// Función para acceder a un componente por su ruta
export const getComponentByPath = (components, path) => {
    let current = components;
    for (const index of path) {
        if (current[index] && current[index].type === 'container' && current[index].content) {
            current = current[index].content;
        } else {
            return current[index];
        }
    }
    return current;
};