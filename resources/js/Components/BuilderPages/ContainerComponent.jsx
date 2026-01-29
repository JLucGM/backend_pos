// components/BuilderPages/components/ContainerComponent.jsx
import React from 'react';
import CanvasItem from './CanvasItem';
import { getThemeWithDefaults, getComponentStyles, hslToCss } from '@/utils/themeUtils';

const ContainerComponent = ({
    comp,
    getStyles,
    onEdit,
    onDelete,
    themeSettings,
    isPreview,
    products,
    setComponents,
    hoveredComponentId,
    setHoveredComponentId
}) => {
    // Obtener configuración del tema con valores por defecto
    const themeWithDefaults = getThemeWithDefaults(themeSettings);
    
    // Obtener estilos específicos del componente container del tema
    const themeContainerStyles = getComponentStyles(themeWithDefaults, 'container');
    
    // Extraer estilos personalizados
    const customStyles = comp.styles || {};

    // Padding individual
    const paddingTop = customStyles.paddingTop || '0px';
    const paddingRight = customStyles.paddingRight || '0px';
    const paddingBottom = customStyles.paddingBottom || '0px';
    const paddingLeft = customStyles.paddingLeft || '0px';

    // Alignment 
    const alignment = customStyles.alignment || 'left';

    // Dirección (flex direction)
    const direction = customStyles.direction || 'row';

    // Gap entre elementos hijos usando valor del tema
    const gap = customStyles.gap || themeContainerStyles.gap || '0px';

    // Background y border radius usando valores del tema
    const backgroundColor = customStyles.backgroundColor || themeContainerStyles.backgroundColor || 'transparent';
    const borderRadius = customStyles.borderRadius || themeContainerStyles.borderRadius || '0px';

    // Determinar alineación basada en dirección
    const getFlexAlignment = () => {
        if (direction === 'row') {
            // Para dirección horizontal
            switch (alignment) {
                case 'left': return 'flex-start';
                case 'center': return 'center';
                case 'right': return 'flex-end';
                default: return 'flex-start';
            }
        } else {
            // Para dirección vertical
            switch (alignment) {
                case 'left': return 'flex-start';
                case 'center': return 'center';
                case 'right': return 'flex-end';
                default: return 'flex-start';
            }
        }
    };

    const flexAlignment = getFlexAlignment();

    const containerStyles = {
        ...getStyles(comp),
        // Layout - SIEMPRE ANCHO COMPLETO
        width: '100%',
        // Padding individual
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        // Background y borde usando valores del tema
        backgroundColor,
        borderRadius,
        // Flexbox para organizar hijos
        display: 'flex',
        flexDirection: direction,
        gap,
        // Alineación basada en dirección
        justifyContent: direction === 'row' ? flexAlignment : 'flex-start',
        alignItems: direction === 'row' ? 'flex-start' : flexAlignment,
        // Permitir que los hijos se envuelvan si no caben
        flexWrap: 'wrap',
        // Estilos de borde para modo edición usando colores del tema
        border: isPreview ? 'none' : `2px dashed ${hslToCss(themeWithDefaults.borders)}`,
        minHeight: '50px',
        position: 'relative',
        boxSizing: 'border-box',
    };

    // Funciones seguras para eventos de mouse
    const handleMouseEnter = () => {
        if (setHoveredComponentId && !isPreview) {
            setHoveredComponentId(comp.id);
        }
    };

    const handleMouseLeave = () => {
        if (setHoveredComponentId && !isPreview) {
            setHoveredComponentId(null);
        }
    };

    const handleDeleteChild = (childId) => {
        setComponents((prev) => {
            const updateComponentChildren = (components) => {
                return components.map((c) => {
                    if (c.id === comp.id && c.content) {
                        return {
                            ...c,
                            content: c.content.filter((sc) => sc.id !== childId)
                        };
                    }
                    if (c.type === 'container' && c.content) {
                        return {
                            ...c,
                            content: updateComponentChildren(c.content)
                        };
                    }
                    return c;
                });
            };
            const updated = updateComponentChildren(prev);
            return updated;
        });
    };

    return (
        <div
            style={containerStyles}
            className="group relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Los hijos - ahora siempre debería haber al menos uno */}
            {comp.content && comp.content.length > 0 ? (
                comp.content.map((subComp) => (
                    <CanvasItem
                        key={subComp.id}
                        comp={subComp}
                        onEditComponent={onEdit}
                        onDeleteComponent={handleDeleteChild}
                        themeSettings={themeSettings}
                        isPreview={isPreview}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                ))
            ) : (
                // Esto solo debería verse si alguien elimina todos los hijos
                !isPreview && (
                    <div
                        className="w-full text-center text-gray-400 py-8 border border-dasheds border-gray-300 rounded cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                    >
                        <p>Contenedor vacío</p>
                        <p className="text-sm">Agrega componentes aquí</p>
                    </div>
                )
            )}
        </div>
    );
};

export default ContainerComponent;