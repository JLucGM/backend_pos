// utils/Builder/componentTreeUtils.js

// Convierte el árbol de componentes a estructura plana para dnd-kit
export function flattenComponentTree(components, parentId = null, depth = 0, result = []) {
    components.forEach((component, index) => {
        const { id, type, content, styles } = component;
        
        // Extraer hijos según el tipo de componente
        let children = [];
        if (type === 'container' && Array.isArray(content)) {
            children = content;
        } else if (
            ['banner', 'product', 'productCard', 'carousel', 'carouselCard', 'bento', 'bentoFeature', 'header', 'footer'].includes(type) &&
            content &&
            content.children &&
            Array.isArray(content.children)
        ) {
            children = content.children;
        }
        
        // Crear item plano
        const flatItem = {
            id,
            type,
            parentId,
            depth,
            order: index,
            data: { type, content, styles },
            children: children.map(child => ({ ...child })) // Copia de hijos para estructura interna
        };
        
        result.push(flatItem);
        
        // Recursivamente aplanar hijos
        if (children.length > 0) {
            flattenComponentTree(children, id, depth + 1, result);
        }
    });
    
    return result;
}

// Reconstruye el árbol de componentes desde estructura plana
export function buildComponentTree(items) {
    const tree = [];
    const childrenOf = {};
    
    // Primero, procesar todos los items para construir estructura de hijos
    items.forEach(item => {
        const { parentId, children, ...node } = item;
        
        if (parentId !== null && parentId !== undefined) {
            if (!childrenOf[parentId]) childrenOf[parentId] = [];
            childrenOf[parentId].push(node);
        } else {
            tree.push(node);
        }
    });
    
    // Función recursiva para construir la estructura anidada
    function attachChildren(nodes) {
        return nodes.map(node => {
            const component = {
                id: node.id,
                type: node.type,
                content: node.data.content,
                styles: node.data.styles
            };
            
            if (childrenOf[node.id]) {
                const childComponents = attachChildren(childrenOf[node.id].sort((a, b) => a.order - b.order));
                
                // Asignar hijos a la estructura correcta según el tipo
                if (node.type === 'container') {
                    component.content = childComponents;
                } else if (
                    ['banner', 'product', 'productCard', 'carousel', 'carouselCard', 'bento', 'bentoFeature', 'header', 'footer'].includes(node.type)
                ) {
                    component.content = component.content || {};
                    component.content.children = childComponents;
                }
            }
            
            return component;
        });
    }
    
    // Ordenar raíz por order
    const sortedTree = tree.sort((a, b) => a.order - b.order);
    return attachChildren(sortedTree);
}

// Función auxiliar para generar ID temporal
export const generateTempId = () => `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;