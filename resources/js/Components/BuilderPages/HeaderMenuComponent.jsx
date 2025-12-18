import React, { useState } from 'react';

const HeaderMenuComponent = ({ comp, getStyles, onEdit, isPreview, themeSettings, availableMenus = [] }) => {
    const styles = getStyles(comp);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const [activeSubSubmenu, setActiveSubSubmenu] = useState(null);

    // OBTENER LOS ITEMS DEL MENÚ - SOLUCIÓN DIRECTA
    let menuItems = [];
    
    // PRIMERA OPCIÓN: Usar los items directos de comp.content (SIEMPRE)
    if (comp.content?.items && Array.isArray(comp.content.items)) {
        menuItems = comp.content.items;
        // console.log('✅ Usando items directos de comp.content:', menuItems.length, 'items');
    }
    // SEGUNDA OPCIÓN: Buscar por menuId SOLO SI availableMenus tiene datos
    else if (comp.content?.menuId && availableMenus.length > 0) {
        const menuId = parseInt(comp.content.menuId);
        // console.log('Buscando menú con ID:', menuId);
        
        const menu = availableMenus.find(m => parseInt(m.id) === menuId);
        
        if (menu?.items) {
            menuItems = menu.items;
            // console.log('✅ Usando items de availableMenus:', menuItems.length, 'items');
        } else {
            console.log('❌ Menú no encontrado en availableMenus');
        }
    }
    // TERCERA OPCIÓN: Formato antiguo (array directo)
    else if (Array.isArray(comp.content)) {
        menuItems = comp.content;
        // console.log('✅ Usando comp.content como array:', menuItems.length, 'items');
    }


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
                onDoubleClick={() => onEdit(comp)}
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
                <a
                    href={isPreview ? (item.url || '#') : '#'}
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
                        if (!isPreview) {
                            e.preventDefault();
                            onEdit(comp);
                        }
                    }}
                >
                    {/* CAMBIO AQUÍ: Usar item.title en lugar de item.label */}
                    {item.title || item.label || item.name || `Item ${item.id}`}
                    {hasChildren && ' ▼'}
                </a>

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
            onDoubleClick={!isPreview ? () => onEdit(comp) : undefined}
        >
            {menuItems.map(item => renderMenuItem(item))}
        </nav>
    );
};

export default HeaderMenuComponent;