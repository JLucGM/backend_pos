import React from 'react';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ChevronRight, ChevronDown, GripVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

// Componente para el área de drop raíz
const RootDroppable = ({ children, isOver }) => {
    const { setNodeRef } = useDroppable({
        id: 'root-area',
    });

    return (
        <div
            ref={setNodeRef}
            className={`min-h-20 transition-colors duration-200 ${isOver ? 'bg-blue-100 border-2 border-blue-400 border-dashed rounded-lg p-4' : ''
                }`}
        >
            {isOver && (
                <div className="text-center text-blue-600 text-sm mb-2">
                    Soltar aquí para mover al nivel raíz
                </div>
            )}
            {children}
        </div>
    );
};

const SortableItem = ({
    component,
    onDelete,
    onEdit,
    level = 0,
    activeId,
    overId,
    dropPosition,
    hoveredComponentId,
    setHoveredComponentId
}) => {
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

    // Determinar si tiene hijos - AGREGAR CARRUSEL Y CARRUSEL CARD
    const hasChildren =
        (component.type === 'container' && component.content && component.content.length > 0) ||
        (component.type === 'banner' && component.content?.children && component.content.children.length > 0) ||
        (component.type === 'product' && component.content?.children && component.content.children.length > 0) ||
        (component.type === 'productCard' && component.content?.children && component.content.children.length > 0) ||
        (component.type === 'carousel' && component.content?.children && component.content.children.length > 0) ||
        (component.type === 'carouselCard' && component.content?.children && component.content.children.length > 0);

    // Función para obtener los hijos según el tipo de componente - AGREGAR CARRUSEL
    const getChildren = () => {
        if (component.type === 'container') {
            return component.content || [];
        } else if (component.type === 'banner') {
            return component.content?.children || [];
        } else if (component.type === 'product') {
            return component.content?.children || [];
        } else if (component.type === 'productCard') {
            return component.content?.children || [];
        } else if (component.type === 'carousel') {
            return component.content?.children || [];
        } else if (component.type === 'carouselCard') {
            return component.content?.children || [];
        }
        return [];
    };

    // Efectos visuales para el drag & drop - AGREGAR CARRUSEL
    const isActive = activeId === component.id;
    const isOver = overId === component.id;
    const isContainer = component.type === 'container';
    const isBanner = component.type === 'banner';
    const isProduct = component.type === 'product';
    const isProductCard = component.type === 'productCard';
    const isCarousel = component.type === 'carousel';
    const isCarouselCard = component.type === 'carouselCard';
    
    // Verificar si hay un indicador de posición para este componente
    const hasDropIndicator = dropPosition && dropPosition.id === component.id;
    const dropPositionType = hasDropIndicator ? dropPosition.position : null;
    
    // Funciones para manejar hover sincronizado
    const handleMouseEnter = () => {
        if (setHoveredComponentId) {
            setHoveredComponentId(component.id);
        }
    };

    const handleMouseLeave = (e) => {
        if (setHoveredComponentId) {
            setTimeout(() => {
                if (hoveredComponentId === component.id) {
                    setHoveredComponentId(null);
                }
            }, 50);
        }
    };

    // Estilos dinámicos basados en el estado - ACTUALIZAR CON CARRUSEL
    const getItemStyles = () => {
        let styles = "flex items-center gap-1 p-2 border rounded mb-1 group transition-all duration-200 cursor-pointer ";
        
        if (isActive) {
            styles += "bg-blue-100 border-blue-400 ";
        } else if (isOver && (isContainer || isBanner || isProduct || isProductCard || isCarousel || isCarouselCard)) {
            styles += "bg-green-100 border-green-400 ";
        } else if (isOver) {
            styles += "bg-yellow-100 border-yellow-400 ";
        } else if (isDragging) {
            styles += "bg-blue-50 border-blue-300 ";
        } else {
            styles += "bg-white border-gray-200 hover:bg-gray-50 ";
        }

        // Efecto de hover sincronizado
        if (hoveredComponentId === component.id) {
            styles += "border-blue-400 bg-blue-50 ";
        }
        
        return styles;
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className={`pl-${level * 4} transition-all duration-200 relative ${isDragging ? 'z-10' : ''}`}
            id={`component-${component.id}`}
        >
            {/* Indicador de posición - ARRIBA */}
            {hasDropIndicator && dropPositionType === 'top' && (
                <div className="absolute -top-1 left-0 right-0 h-0.5 bg-blue-500 z-30 pointer-events-none">
                    <div className="absolute -top-1 left-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
            )}
            
            {/* Área principal del componente */}
            <div className={getItemStyles()}>
                <div 
                    {...attributes} 
                    {...listeners} 
                    className="cursor-grab p-1 hover:bg-gray-200 rounded transition-colors active:cursor-grabbing"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <GripVertical size={14} className={isActive ? "text-blue-500" : "text-gray-500"} />
                </div>
                
                {hasChildren && (
                    <Button
                        onClick={() => setIsExpanded(!isExpanded)}
                        variant="ghost"
                        size="icon"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {isExpanded ? 
                            <ChevronDown size={14} className={isActive ? "text-blue-500" : "text-gray-500"} /> : 
                            <ChevronRight size={14} className={isActive ? "text-blue-500" : "text-gray-500"} />}
                    </Button>
                )}
                
                {!hasChildren && <div className="w-6" />}
                
                <span 
                    className={`flex-1 text-sm font-medium transition-colors ${
                        isActive || hoveredComponentId === component.id ? "text-blue-700" : ""
                    }`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {getComponentTypeName(component.type)}
                </span>
                
                <div 
                    className={`transition-opacity ${
                        isActive || hoveredComponentId === component.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    } flex gap-1`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <Button
                        onClick={() => onEdit(component)}
                        title="Editar"
                        size="icon"
                    >
                        <Edit size={14} />
                    </Button>
                    <Button
                        onClick={() => onDelete(component.id)}
                        title="Eliminar"
                        size="icon"
                        variant="destructive"
                    >
                        <Trash2 size={14} />
                    </Button>
                </div>
            </div>

            {/* Indicador de posición - ABAJO */}
            {hasDropIndicator && dropPositionType === 'bottom' && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 z-30 pointer-events-none">
                    <div className="absolute -top-1 left-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
            )}

            {hasChildren && isExpanded && (
                <div 
                    className="border-l-2 border-gray-200 ml-3 mt-1 transition-all duration-200 relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Indicador de área de drop para contenedores y banners - ACTUALIZAR CON CARRUSEL */}
                    {(isOver && (isContainer || isBanner || isProduct || isProductCard || isCarousel || isCarouselCard) && dropPositionType === 'inside') && (
                        <div className="absolute inset-x-0 -top-1 h-2 bg-green-400 rounded opacity-50 z-20 pointer-events-none"></div>
                    )}
                    
                    {getChildren().map((child) => (
                        <SortableItem
                            key={child.id}
                            component={child}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            level={level + 1}
                            activeId={activeId}
                            overId={overId}
                            dropPosition={dropPosition}
                            hoveredComponentId={hoveredComponentId}
                            setHoveredComponentId={setHoveredComponentId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Función auxiliar para obtener nombres de componentes - ACTUALIZAR CON CARRUSEL
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
        'carouselPrice': 'Precio del Carrusel'
    };
    return typeNames[type] || type;
};

const ComponentTree = ({ 
    components, 
    onEditComponent, 
    onDeleteComponent, 
    activeId, 
    overId,
    dropPosition,
    hoveredComponentId,
    setHoveredComponentId 
}) => {
    const isRootOver = overId === 'root-area';

    return (
        <RootDroppable isOver={isRootOver}>
            <div 
                className="space-y-1 max-h-[600px] overflow-y-auto relative"
                onMouseLeave={() => setHoveredComponentId(null)}
            >
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
                            level={0}
                            activeId={activeId}
                            overId={overId}
                            dropPosition={dropPosition}
                            hoveredComponentId={hoveredComponentId}
                            setHoveredComponentId={setHoveredComponentId}
                        />
                    ))
                )}
                
                {/* Área de drop vacía */}
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