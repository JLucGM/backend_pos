import React, { useState, useEffect, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import { getThemeWithDefaults, resolveStyleValue } from '@/utils/themeUtils';

const HeaderMenuComponent = ({
    comp,
    getStyles,
    onEdit,
    isPreview,
    themeSettings,
    availableMenus = [],
    appliedTheme,
    mode = 'frontend'
}) => {
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // Función para resolver estilos
    const resolveStyles = (styles) => {
        if (!styles) return {};
        const resolved = {};
        Object.keys(styles).forEach(key => {
            resolved[key] = resolveStyleValue(styles[key], themeWithDefaults, appliedTheme);
        });
        return resolved;
    };

    // Obtener estilos base y resolverlos
    const baseStyles = getStyles ? getStyles(comp) : (comp.styles || {});
    const styles = resolveStyles(baseStyles);

    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const [activeSubSubmenu, setActiveSubSubmenu] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    // Estado para hover de items: { [itemId]: boolean }
    const [hoveredItems, setHoveredItems] = useState({});

    // Cargar items del menú según menuId
    useEffect(() => {
        if (!comp.content?.menuId) {
            // Compatibilidad con estructura antigua
            if (comp.content?.items && Array.isArray(comp.content.items)) {
                setMenuItems(comp.content.items);
            } else if (Array.isArray(comp.content)) {
                setMenuItems(comp.content);
            } else {
                setMenuItems([]);
            }
            return;
        }

        const menuId = parseInt(comp.content.menuId);
        const foundMenu = availableMenus.find(menu => parseInt(menu.id) === menuId);
        setMenuItems(foundMenu?.items || []);
    }, [comp.content, availableMenus]);

    // Procesar URL para links
    const processUrl = (url) => {
        if (!url) return '#';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        if (url.startsWith('/')) return url;
        return `/${url}`;
    };

    // Obtener estilos base para items (sin hover)
    const getBaseItemStyles = (depth = 0) => ({
        fontFamily: styles.fontFamily || themeWithDefaults.body_font,
        fontSize: depth === 0 ? (styles.fontSize || '16px') : '14px',
        fontWeight: styles.fontWeight || 'normal',
        color: styles.color || themeWithDefaults.text,
        backgroundColor: styles.buttonBackgroundColor || 'transparent',
        border: styles.borderWidth ? 
            `${styles.borderWidth} solid ${styles.borderColor || themeWithDefaults.borders}` : 'none',
        borderRadius: styles.borderRadius || '4px',
        padding: depth === 0 ? '8px 16px' : '6px 12px',
        textDecoration: 'none',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        transition: 'all 0.2s',
    });

    // Manejadores de hover
    const handleItemHover = useCallback((itemId, isHovered) => {
        setHoveredItems(prev => ({ ...prev, [itemId]: isHovered }));
    }, []);

    // Renderizar un item con sus submenús
    const renderMenuItem = (item, depth = 0) => {
        const hasChildren = item.children && item.children.length > 0;
        const isActive = depth === 0 ? activeSubmenu === item.id : activeSubSubmenu === item.id;
        const baseStyles = getBaseItemStyles(depth);
        const isHovered = hoveredItems[item.id] || false;

        // Resolver colores hover si existen
        const hoverColor = styles.hoverColor ? 
            resolveStyleValue(styles.hoverColor, themeWithDefaults, appliedTheme) : null;
        const hoverBg = styles.hoverBackgroundColor ? 
            resolveStyleValue(styles.hoverBackgroundColor, themeWithDefaults, appliedTheme) : null;

        // Estilos combinados con hover
        const combinedStyles = {
            ...baseStyles,
            color: isHovered && hoverColor ? hoverColor : baseStyles.color,
            backgroundColor: isHovered && hoverBg ? hoverBg : baseStyles.backgroundColor,
        };

        const processedUrl = processUrl(item.url);

        return (
            <div 
                key={item.id} 
                style={{ position: 'relative', display: 'inline-block' }}
                onMouseEnter={() => {
                    handleItemHover(item.id, true);
                    if (depth === 0) setActiveSubmenu(item.id);
                    else setActiveSubSubmenu(item.id);
                }}
                onMouseLeave={() => {
                    handleItemHover(item.id, false);
                    if (depth === 0) setActiveSubmenu(null);
                    else setActiveSubSubmenu(null);
                }}
            >
                {mode === 'frontend' || isPreview ? (
                    <Link
                        href={processedUrl}
                        style={combinedStyles}
                    >
                        {item.title || item.label || item.name || `Item ${item.id}`}
                    </Link>
                ) : (
                    <a
                        href="#"
                        style={combinedStyles}
                        onClick={(e) => e.preventDefault()}
                        onDoubleClick={() => onEdit(comp)}
                    >
                        {item.title || item.label || item.name || `Item ${item.id}`}
                    </a>
                )}

                {hasChildren && isActive && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        backgroundColor: themeWithDefaults.background,
                        border: `1px solid ${themeWithDefaults.borders}`,
                        borderRadius: '4px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        minWidth: '200px',
                        zIndex: 1000,
                    }}>
                        {item.children.map(child => renderMenuItem(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    // Mensaje cuando no hay items en modo edición
    if (!isPreview && menuItems.length === 0) {
        return (
            <div 
                style={{
                    padding: '15px',
                    border: '2px dashed #f59e0b',
                    backgroundColor: '#fffbeb',
                    borderRadius: '6px',
                    color: '#92400e',
                    textAlign: 'center',
                    cursor: 'pointer'
                }}
                onDoubleClick={() => onEdit(comp)}
            >
                <strong>Menú vacío</strong><br/>
                <small>Doble clic para configurar</small>
            </div>
        );
    }

    // Placeholder en preview
    if (isPreview && menuItems.length === 0) {
        return (
            <nav style={{ display: 'flex', gap: '20px', padding: '5px' }}>
                <span style={{ opacity: 0.5 }}>[Menú]</span>
            </nav>
        );
    }

    // Estilos del contenedor principal del menú
    const containerStyles = {
        ...styles,
        display: styles.display || 'flex',
        alignItems: 'center',
        gap: styles.gap || '20px',
    };

    return (
        <nav
            style={containerStyles}
            onDoubleClick={!isPreview && onEdit ? () => onEdit(comp) : undefined}
        >
            {menuItems.map(item => renderMenuItem(item))}
        </nav>
    );
};

export default HeaderMenuComponent;