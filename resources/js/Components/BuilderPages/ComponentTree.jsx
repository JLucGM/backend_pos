// components/BuilderPages/ComponentTree.jsx
import React, { useState, useMemo } from 'react';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableComponentTreeItem from './SortableComponentTreeItem';

const INDENTATION_WIDTH = 40;

// Función auxiliar para obtener nombres de componentes
const getComponentTypeName = (type) => {
    const typeNames = {
        'text': 'Texto',
        'heading': 'Encabezado',
        'button': 'Botón',
        'image': 'Imagen',
        'video': 'Video',
        'link': 'Enlace',
        'product': 'Producto',
        'carousel': 'Carrusel',
        'container': 'Contenedor',
        'banner': 'Sección Banner',
        'bannerTitle': 'Título del Banner',
        'bannerText': 'Texto del Banner',
        'productTitle': 'Título de Productos',
        'productCard': 'Carta de Producto',
        'productImage': 'Imagen de Producto',
        'productName': 'Nombre de Producto',
        'productPrice': 'Precio de Producto',
        'carouselTitle': 'Título del Carrusel',
        'carouselCard': 'Carta del Carrusel',
        'carouselImage': 'Imagen del Carrusel',
        'carouselName': 'Nombre del Carrusel',
        'carouselPrice': 'Precio del Carrusel',
        'bento': 'Bento',
        'bentoTitle': 'Título del Bento',
        'bentoFeature': 'Característica del Bento',
        'bentoFeatureTitle': 'Título de la Característica',
        'bentoFeatureText': 'Texto de la Característica',
        'marquee': 'Texto en Movimiento',
        'divider': 'Divider (Línea)',
        'pageContent': 'Contenido de Página',
        'header': 'Header',
        'footer': 'Footer',
        'headerLogo': 'Logo',
        'headerMenu': 'Menú',
        'footerText': 'Texto Footer',
        'footerMenu': 'Menú Footer',
    };
    return typeNames[type] || type;
};

// Función para aplanar el árbol de componentes
const flattenComponentTree = (components, parentId = null, depth = 0, result = []) => {
    components.forEach((component, index) => {
        const flatItem = {
            id: component.id,
            type: component.type,
            parentId,
            depth,
            order: index,
            data: component // Guardamos el componente completo como data
        };
        
        result.push(flatItem);
        
        // Obtener hijos según el tipo de componente
        let children = [];
        if (component.type === 'container' && Array.isArray(component.content)) {
            children = component.content;
        } else if (
            ['banner', 'product', 'productCard', 'carousel', 'carouselCard', 
             'bento', 'bentoFeature', 'header', 'footer'].includes(component.type) &&
            component.content &&
            component.content.children &&
            Array.isArray(component.content.children)
        ) {
            children = component.content.children;
        }
        
        // Recursivamente aplanar hijos
        if (children.length > 0) {
            flattenComponentTree(children, component.id, depth + 1, result);
        }
    });
    
    return result;
};

// Reconstruir árbol desde estructura plana
const buildComponentTree = (flatItems) => {
    const itemsMap = {};
    const rootItems = [];
    
    // Primero, crear map y guardar todos los items
    flatItems.forEach(item => {
        itemsMap[item.id] = {
            ...item.data,
            _children: []
        };
    });
    
    // Luego, construir jerarquía
    flatItems.forEach(item => {
        const node = itemsMap[item.id];
        
        if (item.parentId === null) {
            rootItems.push(node);
        } else if (itemsMap[item.parentId]) {
            if (!itemsMap[item.parentId]._children) {
                itemsMap[item.parentId]._children = [];
            }
            itemsMap[item.parentId]._children.push(node);
        }
    });
    
    // Función para convertir _children a estructura correcta
    const convertChildren = (nodes) => {
        return nodes.map(node => {
            // Convertir _children a estructura correcta según el tipo
            if (node._children && node._children.length > 0) {
                if (node.type === 'container') {
                    node.content = convertChildren(node._children);
                } else if (['banner', 'product', 'productCard', 'carousel', 
                           'carouselCard', 'bento', 'bentoFeature', 'header', 'footer'].includes(node.type)) {
                    node.content = node.content || {};
                    node.content.children = convertChildren(node._children);
                }
                delete node._children;
            }
            
            return node;
        });
    };
    
    return convertChildren(rootItems);
};

export default function ComponentTree({
    components,
    onEditComponent,
    onDeleteComponent,
    hoveredComponentId,
    setHoveredComponentId,
    onTreeChange
}) {
    const [activeId, setActiveId] = useState(null);
    const [offsetLeft, setOffsetLeft] = useState(0);
    const [expandedItems, setExpandedItems] = useState(new Set());

    // Aplanar el árbol para DnD
    const flattenedItems = useMemo(() => 
        flattenComponentTree(components), 
        [components]
    );
    
    // IDs para SortableContext
    const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [flattenedItems]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 2 },
        }),
        useSensor(KeyboardSensor)
    );

    const activeItem = activeId ? flattenedItems.find(({ id }) => id === activeId) : null;

    // Función de proyección para calcular depth y parentId
    const getProjection = (items, activeId, overId, dragOffset, indentationWidth) => {
        const overItemIndex = items.findIndex(({ id }) => id === overId);
        const activeItemIndex = items.findIndex(({ id }) => id === activeId);
        
        if (activeItemIndex === -1 || overItemIndex === -1) return null;
        
        const activeItem = items[activeItemIndex];
        const newItems = arrayMove(items, activeItemIndex, overItemIndex);
        const previousItem = newItems[overItemIndex - 1];
        const nextItem = newItems[overItemIndex + 1];
        const dragDepth = Math.round(dragOffset / indentationWidth);
        const projectedDepth = activeItem.depth + dragDepth;
        
        // Calcular límites de profundidad
        const maxDepth = previousItem ? previousItem.depth + 1 : 0;
        const minDepth = nextItem ? nextItem.depth : 0;
        let depth = projectedDepth;

        if (depth >= maxDepth) {
            depth = maxDepth;
        } else if (depth < minDepth) {
            depth = minDepth;
        }

        let parentId = null;
        if (depth === 0) {
            parentId = null;
        } else {
            const previousItemAtDepth = newItems
                .slice(0, overItemIndex)
                .reverse()
                .find((item) => item.depth === depth - 1);
            parentId = previousItemAtDepth ? previousItemAtDepth.id : null;
        }
        
        return { depth, maxDepth, minDepth, parentId };
    };

    const handleDragStart = ({ active }) => {
        setActiveId(active.id);
        setOffsetLeft(0);
    };

    const handleDragMove = ({ delta }) => {
        setOffsetLeft(delta.x);
    };

    const handleDragEnd = ({ active, over }) => {
        setOffsetLeft(0);
        setActiveId(null);

        if (!over) return;
        
        const overId = over.id;
        const activeId = active.id;

        if (activeId === overId) return;

        const projection = getProjection(
            flattenedItems,
            activeId,
            overId,
            offsetLeft,
            INDENTATION_WIDTH
        );

        if (projection) {
            // Actualizar parentId y depth del item arrastrado
            let newFlattened = flattenedItems.map(item => {
                if (item.id === activeId) {
                    return { 
                        ...item, 
                        parentId: projection.parentId, 
                        depth: projection.depth 
                    };
                }
                return item;
            });
            
            // Reordenar el array plano
            const oldIndex = newFlattened.findIndex(i => i.id === activeId);
            const newIndex = newFlattened.findIndex(i => i.id === overId);
            newFlattened = arrayMove(newFlattened, oldIndex, newIndex);
            
            // Actualizar órdenes
            newFlattened = newFlattened.map((item, index) => ({
                ...item,
                order: index
            }));
            
            // Reconstruir el árbol y actualizar
            const newTree = buildComponentTree(newFlattened);
            onTreeChange(newTree);
        }
    };

    const handleDragCancel = () => {
        setActiveId(null);
        setOffsetLeft(0);
    };

    // Expandir todo al inicio
    React.useEffect(() => {
        const allIds = flattenedItems.map(item => item.id);
        setExpandedItems(new Set(allIds));
    }, [components]);

    return (
        <div className="space-y-1 max-h-[600px] overflow-y-auto">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
                    {flattenedItems.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            <p>No hay componentes</p>
                            <p className="text-sm">Agrega componentes para comenzar</p>
                        </div>
                    ) : (
                        flattenedItems.map((item) => (
                            <SortableComponentTreeItem
                                key={item.id}
                                id={item.id}
                                item={item}
                                depth={item.depth}
                                indentationWidth={INDENTATION_WIDTH}
                                onDelete={onDeleteComponent}
                                onEdit={onEditComponent}
                                getComponentTypeName={getComponentTypeName}
                                isOverlay={false}
                                hoveredComponentId={hoveredComponentId}
                                setHoveredComponentId={setHoveredComponentId}
                            />
                        ))
                    )}
                </SortableContext>

                <DragOverlay>
                    {activeId && activeItem ? (
                        <SortableComponentTreeItem
                            id={activeId}
                            item={activeItem}
                            depth={activeItem.depth + Math.round(offsetLeft / INDENTATION_WIDTH)}
                            indentationWidth={INDENTATION_WIDTH}
                            isOverlay={true}
                            onDelete={() => {}}
                            onEdit={() => {}}
                            getComponentTypeName={getComponentTypeName}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}