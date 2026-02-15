import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { getThemeWithDefaults, getComponentStyles, getResolvedFont, resolveStyleValue } from '@/utils/themeUtils';

const FooterMenuComponent = ({
    comp,
    getStyles,
    onEdit,
    isPreview,
    themeSettings,
    appliedTheme,
    availableMenus = [],
    mode = 'frontend'
}) => {
    const styles = getStyles(comp);
    const [menuItems, setMenuItems] = useState([]);
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);
    const themeFooterStyles = getComponentStyles(themeWithDefaults, 'footer', appliedTheme);

    // ===========================================
    // FUNCIÓN PARA RESOLVER REFERENCIAS
    // ===========================================
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    // Resolver estilos
    const resolvedStyles = {};
    Object.keys(styles).forEach(key => {
        resolvedStyles[key] = resolveValue(styles[key]);
    });

    // Resolver propiedades del contenido
    const content = comp.content || {};
    const resolvedContent = {};
    Object.keys(content).forEach(key => {
        resolvedContent[key] = resolveValue(content[key]);
    });

    // Helper para añadir unidad (px) si es solo número
    const withUnit = (value, unit = 'px') => {
        if (value === undefined || value === null || value === '') return undefined;
        if (typeof value === 'string' && isNaN(Number(value))) return value;
        return `${value}${unit}`;
    };

    // OBTENER LOS ITEMS DEL MENÚ DINÁMICAMENTE
    useEffect(() => {
        if (!resolvedContent.menuId) {
            setMenuItems([]);
            return;
        }

        const menuId = parseInt(resolvedContent.menuId);

        const foundMenu = availableMenus.find(menu => parseInt(menu.id) === menuId);

        if (foundMenu?.items) {
            setMenuItems(foundMenu.items);
        } else {
            setMenuItems([]);
        }
    }, [resolvedContent.menuId, availableMenus]);

    // Función para procesar URLs
    const processUrl = (url) => {
        if (!url) return '#';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        if (url.startsWith('/')) return url;
        return `/${url}`;
    };

    // Si no hay items en modo builder
    if (menuItems.length === 0 && mode === 'builder' && !isPreview) {
        return (
            <div
                style={{
                    padding: '10px',
                    border: '2px dashed #f59e0b',
                    backgroundColor: '#fffbeb',
                    borderRadius: '6px',
                    color: '#92400e',
                    textAlign: 'center',
                    cursor: 'pointer',
                    minWidth: '150px',
                }}
                onDoubleClick={() => onEdit && onEdit(comp)}
            >
                <strong>Menú Footer</strong><br />
                <small>Doble clic para configurar</small>
                <div style={{ fontSize: '10px', marginTop: '5px' }}>
                    ID: {comp.id} | menuId: {resolvedContent.menuId || 'none'}
                </div>
            </div>
        );
    }

    // En modo frontend/preview sin items
    if (menuItems.length === 0 && (isPreview || mode === 'frontend')) {
        return (
            <div style={{
                padding: '10px',
                border: '1px dashed #ccc',
                borderRadius: '4px'
            }}>
                <span style={{ opacity: 0.5 }}>[Menú Footer {resolvedContent.menuId || 'sin configurar'}]</span>
            </div>
        );
    }

    // Determinar disposición (column o row)
    const displayStyle = resolvedStyles.display || 'column';

    // Obtener gap con valores resueltos
    const gapValue = resolvedStyles.gap === 'custom' ? resolvedStyles.customGap : (resolvedStyles.gap || '8px');
    const gapUnit = resolvedStyles.gap === 'custom' ? resolvedStyles.customGapUnit : (resolvedStyles.gapUnit || 'px');
    const gap = withUnit(gapValue, gapUnit);

    // Obtener fontSize con valores resueltos
    const fontSizeValue = resolvedStyles.fontSize === 'custom' ? resolvedStyles.customFontSize : (resolvedStyles.fontSize || '14px');
    const fontSizeUnit = resolvedStyles.fontSize === 'custom' ? resolvedStyles.customFontSizeUnit : (resolvedStyles.fontSizeUnit || 'px');
    const fontSize = withUnit(fontSizeValue, fontSizeUnit);

    const containerStyles = {
        ...resolvedStyles,
        display: 'flex',
        flexDirection: displayStyle === 'column' ? 'column' : 'row',
        gap: gap,
        alignItems: displayStyle === 'column' ? 'flex-start' : 'center',
    };

    const linkColor = resolveValue(resolvedStyles.color || themeWithDefaults.text);

    return (
        <div
            style={containerStyles}
            onDoubleClick={mode === 'builder' && !isPreview && onEdit ? () => onEdit(comp) : undefined}
        >
            {menuItems.map(item => {
                const processedUrl = processUrl(item.url);

                return (
                    <div key={item.id}>
                        {mode === 'frontend' || isPreview ? (
                            <Link
                                href={processedUrl}
                                style={{
                                    color: linkColor,
                                    textDecoration: 'none',
                                    fontSize: fontSize,
                                    textTransform: resolvedStyles.textTransform || 'none',
                                    display: 'block',
                                    padding: '4px 0',
                                    transition: 'color 0.2s',
                                    fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                                }}
                                className="hover:opacity-80"
                            >
                                {item.title || item.label || item.name}
                            </Link>
                        ) : (
                            <div
                                style={{
                                    color: linkColor,
                                    textDecoration: 'none',
                                    fontSize: fontSize,
                                    textTransform: resolvedStyles.textTransform || 'none',
                                    display: 'block',
                                    padding: '4px 0',
                                    cursor: 'pointer',
                                    fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (onEdit) onEdit(comp);
                                }}
                            >
                                {item.title || item.label || item.name}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default FooterMenuComponent;