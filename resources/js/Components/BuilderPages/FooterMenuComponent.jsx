
const FooterMenuComponent = ({ comp, getStyles, onEdit, isPreview, themeSettings, availableMenus = [] }) => {
    const styles = getStyles(comp);

    // OBTENER LOS ITEMS DEL MENÚ - MISMOS MÉTODOS QUE HEADER
    let menuItems = [];
    
    // PRIMERA OPCIÓN: Usar los items directos de comp.content (SIEMPRE)
    if (comp.content?.items && Array.isArray(comp.content.items)) {
        menuItems = comp.content.items;
    }
    // SEGUNDA OPCIÓN: Buscar por menuId SOLO SI availableMenus tiene datos
    else if (comp.content?.menuId && availableMenus.length > 0) {
        const menuId = parseInt(comp.content.menuId);
        const menu = availableMenus.find(m => parseInt(m.id) === menuId);
        
        if (menu?.items) {
            menuItems = menu.items;
        }
    }
    // TERCERA OPCIÓN: Formato antiguo (array directo)
    else if (Array.isArray(comp.content)) {
        menuItems = comp.content;
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
                <strong>Menú de footer vacío</strong><br/>
                <small>Doble clic para configurar</small>
            </div>
        );
    }

    // En modo preview, si no hay items, mostrar un placeholder simple
    if (isPreview && menuItems.length === 0) {
        return (
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px' }}>
                <span style={{ opacity: 0.5 }}>[Menú del footer]</span>
            </nav>
        );
    }

    // Obtener estilos de display
    const getFlexDirection = () => {
        const display = comp.styles?.display || 'column';
        if (display === 'row') return 'row';
        if (display === 'grid') return 'grid';
        return 'column';
    };

    // Estilos del contenedor principal
    const containerStyles = {
        ...styles,
        display: getFlexDirection() === 'grid' ? 'grid' : 'flex',
        flexDirection: getFlexDirection() === 'row' ? 'row' : 'column',
        gridTemplateColumns: getFlexDirection() === 'grid' ? 'repeat(auto-fit, minmax(150px, 1fr))' : 'none',
        gap: comp.styles?.gap || '10px',
        fontFamily: (() => {
            // Lógica para fuente basada en fontType
            const fontType = comp.styles?.fontType || 'default';
            if (fontType === 'body_font') return themeSettings?.body_font || 'inherit';
            if (fontType === 'heading_font') return themeSettings?.heading_font || 'inherit';
            if (fontType === 'custom') return comp.styles?.customFont || 'inherit';
            return themeSettings?.fontFamily || 'inherit';
        })(),
        fontSize: comp.styles?.fontSize || '14px',
        fontWeight: comp.styles?.fontWeight || 'normal',
        textTransform: comp.styles?.textTransform || 'none',
    };

    // Renderizar cada item del menú
    const renderMenuItem = (item) => {
        const baseColor = comp.styles?.color || '#666666';
        const hoverColor = comp.styles?.hoverColor || '#007bff';
        const hoverDecoration = comp.styles?.hoverDecoration || 'underline';

        return (
            <a
                key={item.id}
                href={isPreview ? (item.url || '#') : '#'}
                style={{
                    color: baseColor,
                    textDecoration: 'none',
                    padding: '3px 0',
                    transition: 'all 0.2s',
                    fontSize: 'inherit',
                    fontWeight: 'inherit',
                    textTransform: 'inherit',
                }}
                onMouseEnter={(e) => {
                    e.target.style.color = hoverColor;
                    if (hoverDecoration !== 'none') {
                        e.target.style.textDecoration = hoverDecoration;
                    }
                }}
                onMouseLeave={(e) => {
                    e.target.style.color = baseColor;
                    if (hoverDecoration !== 'none') {
                        e.target.style.textDecoration = 'none';
                    }
                }}
                onClick={(e) => {
                    if (!isPreview) {
                        e.preventDefault();
                        onEdit(comp);
                    }
                }}
            >
                {/* Usar item.title en lugar de item.label para consistencia */}
                {item.title || item.label || item.name || `Item ${item.id}`}
            </a>
        );
    };

    return (
        <nav
            style={containerStyles}
            onDoubleClick={isPreview ? undefined : () => onEdit(comp)}
            className={isPreview ? '' : 'hover:opacity-80 cursor-pointer'}
        >
            {menuItems.map(item => renderMenuItem(item))}
        </nav>
    );
};

export default FooterMenuComponent;