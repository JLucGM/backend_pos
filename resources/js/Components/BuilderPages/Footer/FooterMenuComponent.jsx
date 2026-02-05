// components/BuilderPages/FooterMenuComponent.jsx
import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { getThemeWithDefaults, getComponentStyles, getResolvedFont } from '@/utils/themeUtils';

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

    // Helper para añadir unidad (px) si es solo número
    const withUnit = (value, unit = 'px') => {
        if (value === undefined || value === null || value === '') return undefined;
        // Si ya es string y tiene algun caracter no numerico (como px, %, rem), devolver tal cual
        if (typeof value === 'string' && isNaN(Number(value))) return value;
        return `${value}${unit}`;
    };

    // OBTENER LOS ITEMS DEL MENÚ DINÁMICAMENTE
    useEffect(() => {
        if (!comp.content?.menuId) {
            setMenuItems([]);
            return;
        }

        const menuId = parseInt(comp.content.menuId);

        const foundMenu = availableMenus.find(menu => parseInt(menu.id) === menuId);

        if (foundMenu?.items) {
            setMenuItems(foundMenu.items);
        } else {
            setMenuItems([]);
        }
    }, [comp.content, availableMenus]);

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
                    ID: {comp.id} | menuId: {comp.content?.menuId || 'none'}
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
                <span style={{ opacity: 0.5 }}>[Menú Footer {comp.content?.menuId || 'sin configurar'}]</span>
            </div>
        );
    }

    // Determinar disposición (column o row)
    const displayStyle = comp.styles?.display || 'column';

    const containerStyles = {
        ...styles,
        display: 'flex',
        flexDirection: displayStyle === 'column' ? 'column' : 'row',
        gap: withUnit(
            comp.styles?.gap === 'custom' ? comp.styles?.customGap : (comp.styles?.gap || '8px'),
            comp.styles?.gap === 'custom' ? comp.styles?.customGapUnit : (comp.styles?.gapUnit || 'px')
        ),
        alignItems: displayStyle === 'column' ? 'flex-start' : 'center',
    };

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
                                    color: comp.styles?.color || themeWithDefaults.text,
                                    textDecoration: 'none',
                                    fontSize: withUnit(
                                        comp.styles?.fontSize === 'custom' ? comp.styles?.customFontSize : (comp.styles?.fontSize || '14px'),
                                        comp.styles?.fontSize === 'custom' ? comp.styles?.customFontSizeUnit : (comp.styles?.fontSizeUnit || 'px')
                                    ),
                                    textTransform: comp.styles?.textTransform || 'none',
                                    display: 'block',
                                    padding: '4px 0',
                                    transition: 'color 0.2s',
                                    fontFamily: getResolvedFont(themeWithDefaults, 'body_font'),
                                }}
                                className="hover:opacity-80"
                            >
                                {item.title || item.label || item.name}
                            </Link>
                        ) : (
                            <div
                                style={{
                                    color: comp.styles?.color || themeWithDefaults.text,
                                    textDecoration: 'none',
                                    fontSize: withUnit(
                                        comp.styles?.fontSize === 'custom' ? comp.styles?.customFontSize : (comp.styles?.fontSize || '14px'),
                                        comp.styles?.fontSize === 'custom' ? comp.styles?.customFontSizeUnit : (comp.styles?.fontSizeUnit || 'px')
                                    ),
                                    textTransform: comp.styles?.textTransform || 'none',
                                    display: 'block',
                                    padding: '4px 0',
                                    cursor: 'pointer',
                                    fontFamily: getResolvedFont(themeWithDefaults, 'body_font'),
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
