import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

const HeaderMenuComponent = ({ 
    comp, 
    getStyles, 
    onEdit, 
    isPreview, 
    themeSettings, 
    availableMenus = [],
    mode = 'frontend' // 'builder' o 'frontend'
}) => {
    const styles = getStyles(comp);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const [activeSubSubmenu, setActiveSubSubmenu] = useState(null);
    const [menuItems, setMenuItems] = useState([]);

    // OBTENER LOS ITEMS DEL MENÚ DINÁMICAMENTE
    useEffect(() => {
        if (!comp.content?.menuId) {
            // Si no hay menuId, verificar si hay items directos (backward compatibility)
            if (comp.content?.items && Array.isArray(comp.content.items)) {
                setMenuItems(comp.content.items);
            } else if (Array.isArray(comp.content)) {
                setMenuItems(comp.content);
            } else {
                setMenuItems([]);
            }
            return;
        }

        // Buscar el menú por ID en availableMenus
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
        
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        
        if (url.startsWith('/')) {
            return url;
        }
        
        return `/${url}`;
    };

    // Si no hay items en modo edición, mostrar mensaje
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
                onDoubleClick={() => onEdit && onEdit(comp)}
            >
                <strong>Menú vacío</strong><br/>
                <small>Doble clic para configurar</small>
            </div>
        );
    }

    // En modo preview, si no hay items, mostrar un placeholder simple
    if (isPreview && menuItems.length === 0) {
        return (
            <nav style={{ display: 'flex', gap: '20px', padding: '10px' }}>
                <span style={{ opacity: 0.5 }}>[Menú]</span>
            </nav>
        );
    }

    // Función para obtener estilos simplificada
    const getItemStyles = (depth = 0) => {
        return {
            fontFamily: themeSettings?.body_font || 'inherit',
            fontSize: depth === 0 ? (comp.styles?.fontSize || '16px') : '14px',
            fontWeight: comp.styles?.fontWeight || 'normal',
            color: comp.styles?.color || '#000000',
            backgroundColor: comp.styles?.buttonBackgroundColor || 'transparent',
            border: comp.styles?.borderWidth ? 
                `${comp.styles.borderWidth} solid ${comp.styles.borderColor || '#000000'}` : 'none',
            borderRadius: comp.styles?.borderRadius || '4px',
            padding: depth === 0 ? '8px 16px' : '6px 12px',
            textDecoration: 'none',
            display: 'inline-block',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            transition: 'all 0.2s',
        };
    };

    // Renderizar cada item con submenús
    const renderMenuItem = (item, depth = 0) => {
        const hasChildren = item.children && item.children.length > 0;
        const isActive = depth === 0 ? activeSubmenu === item.id : activeSubSubmenu === item.id;
        const itemStyles = getItemStyles(depth);
        const processedUrl = processUrl(item.url);

        return (
            <div 
                key={item.id} 
                style={{ position: 'relative', display: 'inline-block' }}
                onMouseEnter={() => {
                    if (depth === 0) setActiveSubmenu(item.id);
                    else setActiveSubSubmenu(item.id);
                }}
                onMouseLeave={() => {
                    if (depth === 0) setActiveSubmenu(null);
                    else setActiveSubSubmenu(null);
                }}
            >
                {mode === 'frontend' || isPreview ? (
                    // En modo frontend o preview, usar Inertia Link para navegación SPA
                    <Link
                        href={processedUrl}
                        style={itemStyles}
                        onMouseEnter={(e) => {
                            if (comp.styles?.hoverColor) {
                                e.target.style.color = comp.styles.hoverColor;
                            }
                            if (comp.styles?.hoverBackgroundColor) {
                                e.target.style.backgroundColor = comp.styles.hoverBackgroundColor;
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.color = itemStyles.color;
                            e.target.style.backgroundColor = itemStyles.backgroundColor;
                        }}
                    >
                        {item.title || item.label || item.name || `Item ${item.id}`}
                        {hasChildren && ' '}
                    </Link>
                ) : (
                    // En modo builder, mantener comportamiento de edición
                    <a
                        href="#"
                        style={itemStyles}
                        onMouseEnter={(e) => {
                            if (comp.styles?.hoverColor) {
                                e.target.style.color = comp.styles.hoverColor;
                            }
                            if (comp.styles?.hoverBackgroundColor) {
                                e.target.style.backgroundColor = comp.styles.hoverBackgroundColor;
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.color = itemStyles.color;
                            e.target.style.backgroundColor = itemStyles.backgroundColor;
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            if (onEdit) {
                                onEdit(comp);
                            }
                        }}
                    >
                        {item.title || item.label || item.name || `Item ${item.id}`}
                        {hasChildren && ' '}
                    </a>
                )}

                {/* Submenú */}
                {hasChildren && isActive && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
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

    // Estilos del contenedor principal
    const containerStyles = {
        ...styles,
        display: 'flex',
        alignItems: 'center',
        gap: comp.styles?.gap || '20px',
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