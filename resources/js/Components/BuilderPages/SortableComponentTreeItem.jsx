// components/BuilderPages/SortableComponentTreeItem.jsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
    Bars3Icon, 
    XMarkIcon, 
    PencilIcon,
    ChevronRightIcon, 
    ChevronDownIcon 
} from '@heroicons/react/24/outline';
import { Button } from '@/Components/ui/button';

export default function SortableComponentTreeItem({
    id,
    item,
    depth,
    indentationWidth,
    onDelete,
    onEdit,
    getComponentTypeName,
    isOverlay,
    hoveredComponentId,
    setHoveredComponentId,
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        marginLeft: !isOverlay ? `${depth * indentationWidth}px` : undefined,
    };
    
    // Funciones para manejar hover sincronizado
    const handleMouseEnter = () => {
        if (setHoveredComponentId && !isOverlay) {
            setHoveredComponentId(item.id);
        }
    };

    const handleMouseLeave = () => {
        if (setHoveredComponentId && !isOverlay) {
            setHoveredComponentId(null);
        }
    };

    // Estilos dinámicos basados en el estado
    const getItemStyles = () => {
        let styles = "flex items-center gap-1 p-2 border rounded mb-1 group transition-colors duration-150 cursor-pointer ";

        if (isDragging) {
            styles += "bg-blue-100 border-blue-400 ";
        } else if (hoveredComponentId === item.id && !isOverlay) {
            styles += "border-blue-400 bg-blue-50 ";
        } else {
            styles += "bg-white border-gray-200 hover:bg-gray-50 ";
        }

        return styles;
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative transition-colors duration-150 ${isDragging ? 'z-50' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Líneas Conectoras */}
            {!isOverlay && depth > 0 && (
                <>
                    <div 
                        className="absolute h-full border-l-2 border-gray-300"
                        style={{ 
                            left: `${indentationWidth / 2}px`, 
                            top: '-50%',
                            height: 'calc(100% + 8px)',
                        }} 
                    />
                    <div 
                        className="absolute w-[20px] h-0 border-t-2 border-gray-300"
                        style={{ 
                            left: `${indentationWidth / 2}px`, 
                            top: '50%',
                            marginTop: '-1px',
                        }} 
                    />
                </>
            )}

            <div className={getItemStyles()}>
                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab p-1 hover:bg-gray-200 rounded transition-colors active:cursor-grabbing"
                >
                    <Bars3Icon className="size-4 text-gray-500" />
                </div>

                {/* Nombre del componente */}
                <span className="flex-1 text-sm font-medium ml-2">
                    {getComponentTypeName(item.type)}
                </span>

                {/* Acciones */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(item.data);
                        }}
                        title="Editar"
                        size="icon"
                        className="h-6 w-6"
                        variant="ghost"
                    >
                        <PencilIcon className="size-3" />
                    </Button>

                    {/* Solo mostrar botón de eliminar si NO es pageContent */}
                    {item.type !== 'pageContent' && (
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(id);
                            }}
                            title="Eliminar"
                            size="icon"
                            className="h-6 w-6"
                            variant="ghost"
                        >
                            <XMarkIcon className="size-3 text-red-500" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}