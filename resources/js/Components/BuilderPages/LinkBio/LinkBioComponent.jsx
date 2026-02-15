import React, { useState } from 'react';
import ButtonComponent from '../ButtonComponent';
import HeadingComponent from '../HeadingComponent';
import TextComponent from '../TextComponent';
import ImageComponent from '../ImageComponent';
import DividerComponent from '../DividerComponent/DividerComponent';
import { getThemeWithDefaults, resolveStyleValue } from '@/utils/themeUtils';

const LinkBioComponent = ({
    comp,
    getStyles,
    themeSettings,
    appliedTheme,
    isPreview = false,
    onEdit,
    onDelete,
    setComponents,
    hoveredComponentId,
    setHoveredComponentId
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // ===========================================
    // FUNCIÓN PARA RESOLVER REFERENCIAS
    // ===========================================
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    const content = comp.content || {};
    const styles = comp.styles || {};

    // Resolver propiedades del contenido
    const resolvedContent = {};
    Object.keys(content).forEach(key => {
        resolvedContent[key] = resolveValue(content[key]);
    });

    // Resolver propiedades de estilos (aunque probablemente no se usen directamente, por si acaso)
    const resolvedStyles = {};
    Object.keys(styles).forEach(key => {
        resolvedStyles[key] = resolveValue(styles[key]);
    });

    // Estilo del contenedor principal (usamos resolvedStyles, pero podemos mantener styles si no hay referencias)
    const containerStyles = {
        ...resolvedStyles,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
    };

    // Estilo del fondo (separado del contenido)
    const backgroundStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
    };

    if (resolvedContent.backgroundType === 'color') {
        backgroundStyle.backgroundColor = resolvedContent.backgroundColor || themeWithDefaults.background;
    } else if (resolvedContent.backgroundType === 'image' && resolvedContent.backgroundImage) {
        backgroundStyle.backgroundImage = `url('${resolvedContent.backgroundImage}')`;
        backgroundStyle.backgroundSize = resolvedContent.backgroundSize || 'cover';
        backgroundStyle.backgroundPosition = resolvedContent.backgroundPosition || 'center';
        backgroundStyle.backgroundRepeat = 'no-repeat';

        // Aplicar filtro de imagen solo al fondo (resolver valores)
        if (resolvedContent.imageFilter && resolvedContent.imageFilter !== 'none') {
            if (resolvedContent.imageFilter === 'darken') {
                backgroundStyle.filter = 'brightness(0.7)';
            } else if (resolvedContent.imageFilter === 'lighten') {
                backgroundStyle.filter = 'brightness(1.3)';
            }
        }
    } else if (resolvedContent.backgroundType === 'gradient' && resolvedContent.gradientColors) {
        backgroundStyle.background = resolvedContent.gradientColors;
    }

    // Estilo del overlay para cuando hay imagen con filtro (separado también)
    const overlayStyle = {};
    if (resolvedContent.backgroundType === 'image' && resolvedContent.imageOverlay && resolvedContent.imageOverlay !== 'none') {
        if (resolvedContent.imageOverlay === 'darken') {
            overlayStyle.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        } else if (resolvedContent.imageOverlay === 'lighten') {
            overlayStyle.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        } else if (resolvedContent.imageOverlay === 'gradient-dark') {
            overlayStyle.background = 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3))';
        } else if (resolvedContent.imageOverlay === 'gradient-light') {
            overlayStyle.background = 'linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3))';
        }
        overlayStyle.position = 'absolute';
        overlayStyle.top = 0;
        overlayStyle.left = 0;
        overlayStyle.right = 0;
        overlayStyle.bottom = 0;
        overlayStyle.zIndex = 1;
    }

    // Estilo del contenedor interno (contenido)
    const innerContainerStyles = {
        maxWidth: resolvedContent.maxWidth ? `${resolvedContent.maxWidth}px` : '400px',
        width: '100%',
        textAlign: resolvedContent.alignment || 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: resolvedContent.buttonsGap ? `${resolvedContent.buttonsGap}px` : '16px',
        position: 'relative',
        zIndex: 2,
    };

    const handleMouseEnter = () => {
        if (setHoveredComponentId && !isPreview) {
            setHoveredComponentId(comp.id);
        }
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        if (setHoveredComponentId && !isPreview) {
            setHoveredComponentId(null);
        }
        setIsHovered(false);
    };

    const handleEdit = (e) => {
        if (isPreview) return;
        e.stopPropagation();
        if (onEdit) onEdit(comp);
    };

    // Función para renderizar hijos según su tipo
    const renderChild = (child) => {
        const commonProps = {
            comp: child,
            getStyles,
            themeSettings,
            appliedTheme,
            isPreview,
        };

        switch (child.type) {
            case 'heading':
                return <HeadingComponent key={child.id} {...commonProps} />;
            case 'button':
                return (
                    <ButtonComponent
                        key={child.id}
                        {...commonProps}
                        mode={isPreview ? 'frontend' : 'builder'}
                    />
                );
            case 'text':
                return <TextComponent key={child.id} {...commonProps} />;
            case 'image':
                return <ImageComponent key={child.id} {...commonProps} />;
            case 'divider':
                return <DividerComponent key={child.id} {...commonProps} />;
            default:
                return null;
        }
    };

    return (
        <div
            className={`link-bio-container relative ${isHovered && !isPreview ? 'border-2 border-blue-400' : ''}`}
            style={containerStyles}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleEdit}
        >
            {/* Fondo separado del contenido */}
            <div style={backgroundStyle} />

            {/* Overlay para imagen de fondo (separado también) */}
            {resolvedContent.backgroundType === 'image' && resolvedContent.imageOverlay && resolvedContent.imageOverlay !== 'none' && (
                <div style={overlayStyle} />
            )}

            <div style={innerContainerStyles}>
                {/* Renderizar hijos */}
                {resolvedContent.children && resolvedContent.children.length > 0 ? (
                    resolvedContent.children.map(child => {
                        if (!child || !child.id) return null;
                        return renderChild(child);
                    })
                ) : (
                    !isPreview && (
                        <div key="placeholder" className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 text-center">
                            <p className="mb-2">Agrega componentes hijos como:</p>
                            <ul className="text-sm space-y-1">
                                <li>• Título (HeadingComponent)</li>
                                <li>• Botones (ButtonComponent)</li>
                                <li>• Texto (TextComponent)</li>
                                <li>• Imagen (ImageComponent)</li>
                                <li>• Divisor (DividerComponent)</li>
                            </ul>
                            <p className="mt-4 text-xs">Usa el árbol de componentes a la izquierda para agregar hijos</p>
                        </div>
                    )
                )}
            </div>

            {/* Toolbar de edición en modo builder */}
            {!isPreview && isHovered && (
                <div key="toolbar" className="absolute -top-8 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-t flex items-center gap-1">
                    <span>Link Bio</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(comp);
                        }}
                        className="ml-1 hover:bg-blue-600 px-1 rounded"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(comp.id);
                        }}
                        className="hover:bg-red-500 px-1 rounded"
                    >
                        🗑️
                    </button>
                </div>
            )}
        </div>
    );
};

export default LinkBioComponent;