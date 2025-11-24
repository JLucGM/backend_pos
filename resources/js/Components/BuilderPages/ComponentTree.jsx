// components/BuilderPages/ComponentTree.jsx
import React from 'react';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ChevronRight, ChevronDown, GripVertical, Edit, Trash2 } from 'lucide-react';

// Componente para el área de drop raíz
const RootDroppable = ({ children, isOver }) => {
    const { setNodeRef } = useDroppable({
        id: 'root-area',
    });

    return (
        <div
            ref={setNodeRef}
            className={`min-h-20 transition-colors duration-200 ${
                isOver ? 'bg-blue-100 border-2 border-blue-400 border-dashed rounded-lg' : ''
            }`}
        >
            {children}
        </div>
    );
};

const SortableItem = ({ component, onDelete, onEdit, level = 0, activeId, overId }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: component.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? 'transform 200ms ease, opacity 200ms ease' : transition,
        opacity: isDragging ? 0.6 : 1,
    };

    const [isExpanded, setIsExpanded] = React.useState(true);
    const hasChildren = component.type === 'container' && component.content && component.content.length > 0;

    // Efectos visuales para el drag & drop
    const isActive = activeId === component.id;
    const isOver = overId === component.id;
    const isContainer = component.type === 'container';
    
    // Estilos dinámicos basados en el estado
    const getItemStyles = () => {
        let styles = "flex items-center gap-1 p-2 border rounded mb-1 group transition-all duration-200 ";
        
        if (isActive) {
            styles += "bg-blue-100 border-blue-400 shadow-md ";
        } else if (isOver && isContainer) {
            styles += "bg-green-100 border-green-400 shadow-sm ";
        } else if (isOver) {
            styles += "bg-yellow-100 border-yellow-400 shadow-sm ";
        } else if (isDragging) {
            styles += "bg-blue-50 border-blue-300 shadow ";
        } else {
            styles += "bg-white border-gray-200 hover:bg-gray-50 ";
        }
        
        return styles;
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className={`pl-${level * 4} transition-all duration-200 ${isDragging ? 'z-10' : ''}`}
        >
            <div className={getItemStyles()}>
                <div 
                    {...attributes} 
                    {...listeners} 
                    className="cursor-grab p-1 hover:bg-gray-200 rounded transition-colors active:cursor-grabbing"
                >
                    <GripVertical size={14} className={isActive ? "text-blue-500" : "text-gray-500"} />
                </div>
                
                {hasChildren && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                        {isExpanded ? 
                            <ChevronDown size={14} className={isActive ? "text-blue-500" : "text-gray-500"} /> : 
                            <ChevronRight size={14} className={isActive ? "text-blue-500" : "text-gray-500"} />}
                    </button>
                )}
                
                {!hasChildren && <div className="w-6" />}
                
                <span className={`flex-1 text-sm font-medium transition-colors ${isActive ? "text-blue-700" : ""}`}>
                    {component.type.charAt(0).toUpperCase() + component.type.slice(1)}
                    <span className="text-xs text-gray-500 ml-2">(ID: {component.id})</span>
                </span>
                
                <div className={`transition-opacity ${isActive ? "opacity-0" : "opacity-0 group-hover:opacity-100"} flex gap-1`}>
                    <button
                        onClick={() => onEdit(component)}
                        className="p-1 hover:bg-blue-100 rounded text-blue-600 transition-colors"
                        title="Editar"
                    >
                        <Edit size={14} />
                    </button>
                    <button
                        onClick={() => onDelete(component.id)}
                        className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
                        title="Eliminar"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {hasChildren && isExpanded && (
                <div className="border-l-2 border-gray-200 ml-3 mt-1 transition-all duration-200">
                    {component.content.map((child) => (
                        <SortableItem
                            key={child.id}
                            component={child}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            level={level + 1}
                            activeId={activeId}
                            overId={overId}
                        />
                    ))}
                </div>
            )}
            
            {/* Indicador visual para contenedores durante el drag */}
            {isOver && isContainer && (
                <div className="absolute inset-0 border-2 border-green-400 rounded bg-green-50 bg-opacity-50 pointer-events-none animate-pulse"></div>
            )}
        </div>
    );
};

const ComponentTree = ({ components, onEditComponent, onDeleteComponent, activeId, overId }) => {
    const isRootOver = overId === 'root-area';

    return (
        <RootDroppable isOver={isRootOver}>
            <div className="space-y-1 max-h-[600px] overflow-y-auto relative">
                {components.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        <p>No hay componentes</p>
                        <p className="text-sm">Agrega componentes para comenzar</p>
                    </div>
                ) : (
                    components.map((component) => (
                        <SortableItem
                            key={component.id}
                            component={component}
                            onDelete={onDeleteComponent}
                            onEdit={onEditComponent}
                            activeId={activeId}
                            overId={overId}
                        />
                    ))
                )}
                
                {/* Área de drop vacía - ahora funcional */}
                {activeId && (
                    <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200 ${
                        isRootOver ? 'border-blue-400 bg-blue-100 text-blue-700' : 'border-gray-300 text-gray-500'
                    }`}>
                        Suelta aquí para mover al nivel raíz
                    </div>
                )}
            </div>
        </RootDroppable>
    );
};

export default ComponentTree;