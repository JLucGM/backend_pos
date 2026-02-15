import React from 'react';
import { getThemeWithDefaults, resolveStyleValue } from '@/utils/themeUtils';

const PageContentComponent = ({
    comp,
    getStyles,
    isPreview,
    hoveredComponentId,
    setHoveredComponentId,
    pageContent,
    themeSettings,
    appliedTheme
}) => {
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // ===========================================
    // FUNCIÓN PARA RESOLVER REFERENCIAS
    // ===========================================
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    // Resolver estilos base
    const baseStyles = getStyles ? getStyles(comp) : {};
    const resolvedBaseStyles = {};
    Object.keys(baseStyles).forEach(key => {
        resolvedBaseStyles[key] = resolveValue(baseStyles[key]);
    });

    // Resolver estilos personalizados del componente
    const rawStyles = comp.styles || {};
    const styles = {};
    Object.keys(rawStyles).forEach(key => {
        styles[key] = resolveValue(rawStyles[key]);
    });

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

    // Helper para añadir unidad (px) si es solo número
    const withUnit = (value, unit = 'px') => {
        if (value === undefined || value === null || value === '') return undefined;
        if (typeof value === 'string' && isNaN(Number(value))) return value;
        return `${value}${unit}`;
    };
console.log(styles)
    // Construir estilos del contenedor con valores resueltos
    const containerStyles = {
        ...resolvedBaseStyles,
        ...styles,
        width: styles.width || '100%',
        backgroundColor: resolveValue(styles.backgroundColor || 'transparent'),
        padding: withUnit(resolveValue(styles.padding || '20px')),
        border: isPreview ? 'none' : `1px dashed ${resolveValue(themeWithDefaults.borders)}`,
        borderRadius: withUnit(resolveValue(styles.borderRadius || '0px')),
        minHeight: styles.minHeight || '100px',
        position: 'relative',
    };

    return (
        <div
            style={containerStyles}
            className="page-content-component"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {pageContent ? (
                <div
                    className="page-content prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: pageContent }}
                    style={{
                        color: resolveValue(themeWithDefaults.text),
                        fontFamily: resolveValue(themeWithDefaults.body_font),
                    }}
                />
            ) : (
                <div className="text-center py-8" style={{ color: resolveValue(themeWithDefaults.text) }}>
                    <p>No hay contenido disponible para esta página</p>
                </div>
            )}
        </div>
    );
};

export default PageContentComponent;