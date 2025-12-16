import React, { useState, useCallback, useMemo } from 'react';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableTreeItem from './SortableTreeItem';


// --- UTILITIES ---

const generateTempId = () => `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// 🌳 CONSTRUYE el árbol (estructura anidada para React/dnd-kit)
export function buildTree(items) {
    const tree = [];
    const childrenOf = {};
    
    const clonedItems = items.map(item => ({ 
        ...item, 
        id: (item.id !== null && item.id !== undefined) ? item.id : generateTempId(),
        children: [], 
        depth: 0, 
        parent_id: item.parent_id
    }));

    clonedItems.forEach(item => {
        const parentId = item.parent_id;
        if (parentId && clonedItems.find(i => i.id === parentId)) {
            if (!childrenOf[parentId]) childrenOf[parentId] = [];
            childrenOf[parentId].push(item);
        } else {
            tree.push(item);
        }
    });

    function attachChildren(nodeList, depth) {
        nodeList.forEach(node => {
            node.depth = depth;
            if (childrenOf[node.id]) {
                node.children = childrenOf[node.id].sort((a, b) => (a.order || 0) - (b.order || 0));
                attachChildren(node.children, depth + 1);
            }
        });
    }

    attachChildren(tree, 0);
    return tree.sort((a, b) => (a.order || 0) - (b.order || 0));
}

// 🌳 APLANA el árbol (para uso interno de DND-Kit)
export function flattenTree(tree, parent_id = null, flattened = []) {
    tree.forEach((item, index) => {
        const { children, ...itemWithoutChildren } = item;
        flattened.push({
            ...itemWithoutChildren,
            parent_id,
            order: index,
            depth: item.depth || 0,
        });
        if (children && children.length > 0) {
            flattenTree(children, item.id, flattened);
        }
    });
    return flattened;
}

const INDENTATION_WIDTH = 40; 

// 🌳 FUNCIÓN CLAVE: Proyección para el anidamiento (calcula el nuevo parent_id y profundidad)
function getProjection(items, activeId, overId, dragOffset, indentationWidth) {
    const overItemIndex = items.findIndex(({ id }) => id === overId);
    const activeItemIndex = items.findIndex(({ id }) => id === activeId);
    const activeItem = items[activeItemIndex];
    const newItems = arrayMove(items, activeItemIndex, overItemIndex);
    const previousItem = newItems[overItemIndex - 1];
    const nextItem = newItems[overItemIndex + 1];
    const dragDepth = Math.round(dragOffset / indentationWidth);
    const projectedDepth = activeItem.depth + dragDepth;
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
}

// --- COMPONENTE PRINCIPAL ---

export default function SortableTree({ treeItems, onTreeChange, errors, dynamicPages }) {
    const [activeId, setActiveId] = useState(null);
    const [offsetLeft, setOffsetLeft] = useState(0);
    
    // Aplanamos el árbol para que el SortableContext funcione linealmente
    const flattenedItems = useMemo(() => flattenTree(treeItems), [treeItems]);
    const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [flattenedItems]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), 
        useSensor(KeyboardSensor)
    );

    const activeItem = activeId ? flattenedItems.find(({ id }) => id === activeId) : null;

    // --- HANDLERS ---

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

        const projection = getProjection(
            flattenedItems,
            activeId,
            overId,
            offsetLeft,
            INDENTATION_WIDTH
        );

        if (projection) {
            // Actualiza el parent_id y depth del ítem arrastrado
            const newFlattened = flattenTree(treeItems).map(item => {
                 if (item.id === activeId) {
                     return { ...item, parent_id: projection.parentId, depth: projection.depth };
                 }
                 return item;
            });
            
            // Reordenamos el array plano (cambio vertical)
            const oldIndex = newFlattened.findIndex(i => i.id === activeId);
            const newIndex = newFlattened.findIndex(i => i.id === overId);
            const reordered = arrayMove(newFlattened, oldIndex, newIndex);

            // Reconstruimos el árbol y actualizamos el estado
            onTreeChange(buildTree(reordered));
        }
    };

    // Actualizar campos
    const updateItem = (id, field, value) => {
        const newFlattened = flattenTree(treeItems).map(item => 
            item.id === id ? { ...item, [field]: value } : item
        );
        onTreeChange(buildTree(newFlattened));
    };

    // Eliminar ítem y todos sus hijos recursivamente
    const removeItem = (id) => {
         const deleteIds = [id];
         const collectChildren = (parentId) => {
             flattenedItems.forEach(item => {
                 if (item.parent_id === parentId) {
                     deleteIds.push(item.id);
                     collectChildren(item.id);
                 }
             });
         };
         collectChildren(id);

         const newFlattened = flattenedItems.filter(item => !deleteIds.includes(item.id));
         onTreeChange(buildTree(newFlattened));
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-1">
                    {flattenedItems.map((item) => (
                        <SortableTreeItem
                            key={item.id}
                            id={item.id}
                            item={item}
                            // Cálculo de la profundidad en tiempo real para el feedback visual
                            depth={item.id === activeId && activeItem ? activeItem.depth + Math.round(offsetLeft / INDENTATION_WIDTH) : item.depth}
                            indentationWidth={INDENTATION_WIDTH}
                            onUpdate={updateItem}
                            onRemove={removeItem}
                            itemErrors={errors[`items.${item.id}.title`] || errors[`items.${item.id}.url`]}
                            dynamicPages={dynamicPages}
                        />
                    ))}
                </div>
            </SortableContext>

            <DragOverlay>
                {activeId && activeItem ? (
                    <SortableTreeItem
                        id={activeId}
                        item={activeItem}
                        depth={activeItem.depth + Math.round(offsetLeft / INDENTATION_WIDTH)}
                        indentationWidth={INDENTATION_WIDTH}
                        isOverlay
                        onUpdate={() => {}}
                        onRemove={() => {}}
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}