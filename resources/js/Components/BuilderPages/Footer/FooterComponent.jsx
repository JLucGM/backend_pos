// components/BuilderPages/FooterComponent.jsx
import React from 'react';
import FooterMenuComponent from './FooterMenuComponent';
import TextComponent from '../TextComponent';
import { getThemeWithDefaults, getComponentStyles, resolveStyleValue } from '@/utils/themeUtils';

// Helper para añadir unidad (px) si es solo número
const withUnit = (value, unit = 'px') => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'string' && isNaN(Number(value))) return value;
    return `${value}${unit}`;
};

const FooterComponent = ({
    comp,
    getStyles,
    onEdit,
    onDelete,
    isPreview,
    themeSettings,
    appliedTheme,
    setComponents,
    hoveredComponentId,
    setHoveredComponentId,
    mode = 'frontend',
    availableMenus = []
}) => {
    // Obtener configuración del tema con valores por defecto
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);
    const themeFooterStyles = getComponentStyles(themeWithDefaults, 'footer', appliedTheme);

    // ===========================================
    // FUNCIÓN PARA RESOLVER REFERENCIAS
    // ===========================================
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    // Resolver estilos del componente
    const rawStyles = getStyles(comp) || {};
    const resolvedStyles = {};
    Object.keys(rawStyles).forEach(key => {
        resolvedStyles[key] = resolveValue(rawStyles[key]);
    });

    // Resolver contenido del componente
    const rawContent = comp.content || {};
    const resolvedContent = {};
    Object.keys(rawContent).forEach(key => {
        resolvedContent[key] = resolveValue(rawContent[key]);
    });

    // Determinar si estamos en modo de edición
    const isEditable = mode === 'builder' && !isPreview;

    // Estilos del contenedor principal del footer con valores resueltos
    const containerStyles = {
        ...resolvedStyles,
        width: '100%',
        backgroundColor: resolvedStyles.backgroundColor || themeFooterStyles.backgroundColor,
        paddingTop: withUnit(resolvedStyles.paddingTop || '40px'),
        paddingRight: withUnit(resolvedStyles.paddingRight || '20px'),
        paddingBottom: withUnit(resolvedStyles.paddingBottom || '40px'),
        paddingLeft: withUnit(resolvedStyles.paddingLeft || '20px'),
    };

    // Obtener los hijos del footer (usando resolvedContent)
    const children = resolvedContent.children || [];

    return (
        <footer
            style={containerStyles}
            onDoubleClick={isEditable ? () => onEdit(comp) : undefined}
            className={isEditable ? 'hover:opacity-80 cursor-pointer' : ''}
        >
            {/* Grid de columnas */}
            <div style={{
                display: resolvedContent.layout === 'flex' ? 'flex' : 'grid',
                flexWrap: 'wrap',
                gridTemplateColumns: resolvedContent.layout === 'flex' ? 'none' : `repeat(${resolvedContent.columns || 3}, 1fr)`,
                gap: withUnit(resolvedStyles.gap || '40px'),
                maxWidth: withUnit(resolvedStyles.maxWidth || '1200px'),
                margin: '0 auto'
            }}>
                {children.map(child => {
                    // Renderizar según el tipo de componente hijo
                    if (child.type === 'footerMenu') {
                        return (
                            <div key={child.id}>
                                <FooterMenuComponent
                                    comp={child}
                                    getStyles={getStyles}
                                    onEdit={onEdit}
                                    isPreview={isPreview}
                                    themeSettings={themeSettings}
                                    appliedTheme={appliedTheme}
                                    availableMenus={availableMenus}
                                    mode={mode}
                                />
                            </div>
                        );
                    } else if (child.type === 'text') {
                        return (
                            <div key={child.id}>
                                <TextComponent
                                    comp={child}
                                    getStyles={getStyles}
                                    themeSettings={themeSettings}
                                    appliedTheme={appliedTheme}
                                    isPreview={isPreview}
                                />
                            </div>
                        );
                    }
                    return null;
                })}
            </div>

            {/* Copyright con valores del tema (usando resolvedContent) */}
            {resolvedContent.showCopyright && (
                <div style={{
                    textAlign: 'center',
                    marginTop: '40px',
                    paddingTop: '20px',
                    borderTop: `1px solid ${themeWithDefaults.borders}`, // themeWithDefaults ya tiene valor resuelto
                    color: themeWithDefaults.text,
                    fontSize: '14px'
                }}>
                    {resolvedContent.copyrightText || '© 2023 Mi Empresa. Todos los derechos reservados.'}
                </div>
            )}
        </footer>
    );
};

export default FooterComponent;