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
import ChildComponentOptions from './ChildComponentOptions';

const INDENTATION_WIDTH = 40;

// Lista de componentes que pueden tener hijos y ser colapsados
const COLLAPSIBLE_TYPES = [
    'container', 'product', 'carousel', 'banner', 'footer', 'header',
    'bento', 'productCard', 'carouselCard', 'bentoFeature', 'productDetail','cart', 'checkout','checkoutDiscountGiftCard'
];

const NO_ADD_BUTTON_TYPES = ['header', 'footer', 'bentoFeature', 'productCard', 'carouselCard','productDetail'];

// Función para determinar si un componente puede tener hijos
const canHaveChildren = (type) => {
    return COLLAPSIBLE_TYPES.includes(type);
};

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
        'checkoutDiscountGiftCard': 'Descuentos y Gift Cards',
    };
    return typeNames[type] || type;
};

// Función para determinar si un componente tiene hijos
const hasChildren = (component) => {
    if (component.type === 'container' && Array.isArray(component.content)) {
        return component.content.length > 0;
    } else if (
        canHaveChildren(component.type) &&
        component.content &&
        component.content.children &&
        Array.isArray(component.content.children)
    ) {
        return component.content.children.length > 0;
    }
    return false;
};

// Función para aplanar el árbol de componentes con soporte para collapse
const flattenComponentTree = (components, parentId = null, depth = 0, result = [], expandedItems = new Set()) => {
    components.forEach((component, index) => {
        const flatItem = {
            id: component.id,
            type: component.type,
            parentId,
            depth,
            order: index,
            data: component,
            hasChildren: hasChildren(component),
            canHaveChildren: canHaveChildren(component.type)
        };

        result.push(flatItem);

        // Solo aplanar hijos si el componente está expandido
        const isExpanded = expandedItems.has(component.id);
        let children = [];

        if (isExpanded) {
            if (component.type === 'container' && Array.isArray(component.content)) {
                children = component.content;
            } else if (
                canHaveChildren(component.type) &&
                component.content &&
                component.content.children &&
                Array.isArray(component.content.children)
            ) {
                children = component.content.children;
            }

            // Recursivamente aplanar hijos
            if (children.length > 0) {
                flattenComponentTree(children, component.id, depth + 1, result, expandedItems);
            }
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
                } else if (canHaveChildren(node.type)) {
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

// Función para generar IDs únicos
const generateId = () => {
    return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export default function ComponentTree({
    components,
    onEditComponent,
    onDeleteComponent,
    hoveredComponentId,
    setHoveredComponentId,
    onTreeChange,
    expandedItems,
    setExpandedItems
}) {
    const [activeId, setActiveId] = useState(null);
    const [offsetLeft, setOffsetLeft] = useState(0);

    // Función para agregar un hijo a un componente padre
    const handleAddChild = (parentId, childType) => {
        // Crear el nuevo componente hijo
        const newChild = {
            id: generateId(),
            type: childType,
            content: getDefaultContent(childType)
        };
        
        // Función recursiva para agregar el hijo al árbol
        const addChildToTree = (tree) => {
            return tree.map(component => {
                // Si encontramos el componente padre
                if (component.id === parentId) {
                    // Crear una copia del componente padre
                    const updatedParent = { ...component };

                    // Agregar el hijo según el tipo de componente padre
                    if (component.type === 'container') {
                        updatedParent.content = [
                            ...(component.content || []),
                            newChild
                        ];
                    } else if (canHaveChildren(component.type)) {
                        updatedParent.content = {
                            ...component.content,
                            children: [
                                ...(component.content?.children || []),
                                newChild
                            ]
                        };
                    }

                    return updatedParent;
                }

                // Si no es el padre, buscar recursivamente en sus hijos
                if (component.type === 'container' && Array.isArray(component.content)) {
                    return {
                        ...component,
                        content: addChildToTree(component.content)
                    };
                } else if (canHaveChildren(component.type) && component.content?.children) {
                    return {
                        ...component,
                        content: {
                            ...component.content,
                            children: addChildToTree(component.content.children)
                        }
                    };
                }

                return component;
            });
        };

        // Actualizar el árbol de componentes
        const newTree = addChildToTree(components);
        onTreeChange(newTree);

        // Expandir automáticamente el padre después de agregar un hijo
        if (!expandedItems.has(parentId)) {
            const newExpanded = new Set(expandedItems);
            newExpanded.add(parentId);
            setExpandedItems(newExpanded);
        }
    };

    const getDefaultContent = (type) => {
        switch (type) {
            case 'text':
                return { text: 'Nuevo texto' }; // Mantenemos como objeto
            case 'heading':
                return { text: 'Nuevo encabezado', level: 'h2' }; // Objeto
            case 'button':
                return { text: 'Nuevo botón', url: '#' }; // Objeto
            case 'image':
                return { src: 'https://picsum.photos/150', alt: 'Nueva imagen' }; // Objeto
            case 'video':
                return { src: '', title: 'Nuevo video' }; // Objeto
            case 'link':
                return { text: 'Nuevo enlace', url: '#' }; // Objeto
            case 'marquee':
                return { text: 'Texto en movimiento' }; // Objeto
            case 'divider':
                return {}; // Objeto vacío
            case 'container':
                // Contenedor con un componente de texto por defecto
                return [
                    {
                        id: generateId(),
                        type: 'text',
                        content: { text: 'Nuevo texto' }
                    }
                ];
            case 'bentoFeature':
                const featureId = generateId();
                const featureTitleId = generateId();
                const featureTextId = generateId();

                return {
                    // Configuración de la carta de característica
                    backgroundColor: '#f8fafc',
                    backgroundImage: null,
                    border: 'none',
                    borderThickness: '1px',
                    borderColor: '#e5e7eb',
                    borderRadius: '12px',
                    padding: '24px',
                    opacity: 1,
                    // Los hijos de la característica
                    children: [
                        {
                            id: featureTitleId,
                            type: 'bentoFeatureTitle',
                            content: 'Nueva Característica',
                            styles: {
                                layout: 'fit',
                                alignment: 'left',
                                color: '#1f2937',
                                fontSize: '20px',
                                fontWeight: '600'
                            }
                        },
                        {
                            id: featureTextId,
                            type: 'bentoFeatureText',
                            content: 'Descripción de la nueva característica.',
                            styles: {
                                layout: 'fit',
                                alignment: 'left',
                                color: '#6b7280',
                                fontSize: '16px',
                                fontWeight: 'normal'
                            }
                        }
                    ]
                };
            default:
                return {};
        }
    };

    // Aplanar el árbol para DnD considerando elementos expandidos
    const flattenedItems = useMemo(() =>
        flattenComponentTree(components, null, 0, [], expandedItems),
        [components, expandedItems]
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

    // Toggle para expandir/colapsar
    const toggleExpand = (id) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedItems(newExpanded);
    };

    // Expandir/colapsar todos
    const expandAll = () => {
        const allParentIds = new Set();
        flattenedItems.forEach(item => {
            if (canHaveChildren(item.type) && item.hasChildren) {
                allParentIds.add(item.id);
            }
        });
        setExpandedItems(allParentIds);
    };

    const collapseAll = () => {
        setExpandedItems(new Set());
    };

    return (
        <div className="space-y-2">
            {/* Controles de expandir/colapsar */}
            <div className="flex justify-end gap-2 pb-2 border-b">
                <button
                    onClick={expandAll}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    title="Expandir todos los componentes padre"
                >
                    Expandir Todo
                </button>
                <button
                    onClick={collapseAll}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    title="Colapsar todos los componentes padre"
                >
                    Colapsar Todo
                </button>
            </div>

            <div className="max-h-[600px] overflow-y-auto">
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
                            <div className="space-y-1">
                                {flattenedItems.map((item) => {
                                    const isParentComponent = canHaveChildren(item.type);
                                    const isExpanded = expandedItems.has(item.id);
                                    const showAddButton = isParentComponent &&
                                        isExpanded &&
                                        !NO_ADD_BUTTON_TYPES.includes(item.type);

                                    return (
                                        <React.Fragment key={item.id}>
                                            <SortableComponentTreeItem
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
                                                isExpanded={isExpanded}
                                                onToggleExpand={toggleExpand}
                                                collapsibleTypes={COLLAPSIBLE_TYPES}
                                                canHaveChildren={isParentComponent}
                                            />

                                            {showAddButton && (
                                                <div
                                                    style={{
                                                        marginLeft: `${(item.depth + 1) * INDENTATION_WIDTH}px`
                                                    }}
                                                >
                                                    <ChildComponentOptions
                                                        parentId={item.id}
                                                        parentType={item.type}  // ← Agregar esta línea
                                                        onAddChild={handleAddChild}
                                                        isExpanded={isExpanded}
                                                    />
                                                </div>
                                            )}

                                        </React.Fragment>
                                    );
                                })}
                            </div>
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
                                onDelete={() => { }}
                                onEdit={() => { }}
                                getComponentTypeName={getComponentTypeName}
                                isExpanded={expandedItems.has(activeId)}
                                onToggleExpand={() => { }}
                                collapsibleTypes={COLLAPSIBLE_TYPES}
                                canHaveChildren={canHaveChildren(activeItem.type)}
                            />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    );
}