import React from 'react';
import { ShoppingCart, Search, User } from 'lucide-react';
import CanvasItem from './CanvasItem';

const HeaderComponent = ({ 
    comp, 
    getStyles, 
    onEdit, 
    onDelete, 
    isPreview, 
    themeSettings,
    appliedTheme,
    setComponents,
    hoveredComponentId,
    setHoveredComponentId
}) => {
    const headerStyles = getStyles(comp);
    const customStyles = comp.styles || {};
    const content = comp.content || {};
    
    // Estilos del contenedor principal del header
    const containerStyles = {
        ...headerStyles,
        position: content?.sticky ? 'sticky' : 'static',
        top: 0,
        zIndex: 1000,
        width: content?.fullWidth ? '100%' : customStyles.width || '100%',
        height: content?.height || '70px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: customStyles.backgroundColor || '#ffffff',
        paddingTop: customStyles.paddingTop || '20px',
        paddingRight: customStyles.paddingRight || '20px',
        paddingBottom: customStyles.paddingBottom || '20px',
        paddingLeft: customStyles.paddingLeft || '20px',
        borderBottom: customStyles.borderBottom || '1px solid #e5e7eb'
    };

    // Clasificar los componentes hijos por tipo
    const classifyChildren = () => {
        if (!content?.children || !Array.isArray(content.children)) {
            return { logo: null, menu: null };
        }

        let logo = null;
        let menu = null;

        content.children.forEach(child => {
            if (child.type === 'headerLogo') {
                logo = child;
            } else if (child.type === 'headerMenu') {
                menu = child;
            }
        });

        return { logo, menu };
    };

    const { logo, menu } = classifyChildren();
    
    // Configuración de botones con valores por defecto seguros
    const buttonsConfig = content?.buttons || {};
    const defaultButtonStyles = {
        iconColor: '#000000',
        backgroundColor: '#000000',
        borderWidth: '0px',
        borderStyle: 'solid',
        borderColor: '#000000',
        borderOpacity: '1',
        borderRadius: '50%',
        backgroundOpacity: '1',
        width: '36px',
        height: '36px',
        padding: '8px',
        fontSize: '16px'
    };
    
    const cartConfig = buttonsConfig.cart || { count: '0', styles: { ...defaultButtonStyles, iconColor: '#ffffff' } };
    const searchConfig = buttonsConfig.search || { styles: { ...defaultButtonStyles, backgroundColor: 'transparent' } };
    const profileConfig = buttonsConfig.profile || { styles: { ...defaultButtonStyles, backgroundColor: '#f0f0f0' } };
    const showSearch = buttonsConfig.showSearch !== false; // Por defecto mostrar
    const buttonsGap = buttonsConfig.buttonsGap || '10px';
    
    // Determinar la posición del logo
    const logoPosition = content?.logoPosition || 'left';
    
    // Función para construir estilos de botón
    const getButtonStyles = (buttonConfig) => {
        if (!buttonConfig || !buttonConfig.styles) {
            return {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: '0px',
                borderStyle: 'solid',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                padding: '8px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: '#000000',
                borderColor: 'transparent',
            };
        }
        
        const styles = buttonConfig.styles;
        
        // Calcular opacidades
        const bgOpacity = styles.backgroundOpacity || '1';
        const borderOpacity = styles.borderOpacity || '1';
        
        // Funciones helper para convertir colores
        const parseColor = (color) => {
            if (!color) return '0, 0, 0';
            
            // Si es rgba, extraer los valores rgb
            if (color.startsWith('rgba')) {
                const matches = color.match(/\d+/g);
                return `${matches[0]}, ${matches[1]}, ${matches[2]}`;
            }
            
            // Si es hex, convertir
            if (color.startsWith('#')) {
                const hex = color.replace('#', '');
                if (hex.length === 3) {
                    const r = parseInt(hex[0] + hex[0], 16);
                    const g = parseInt(hex[1] + hex[1], 16);
                    const b = parseInt(hex[2] + hex[2], 16);
                    return `${r}, ${g}, ${b}`;
                }
                if (hex.length === 6) {
                    const r = parseInt(hex.substring(0, 2), 16);
                    const g = parseInt(hex.substring(2, 4), 16);
                    const b = parseInt(hex.substring(4, 6), 16);
                    return `${r}, ${g}, ${b}`;
                }
            }
            
            // Si es nombre de color común
            const colorMap = {
                'black': '0, 0, 0',
                'white': '255, 255, 255',
                'red': '255, 0, 0',
                'green': '0, 128, 0',
                'blue': '0, 0, 255',
                'transparent': '0, 0, 0'
            };
            
            return colorMap[color.toLowerCase()] || '0, 0, 0';
        };
        
        const bgColor = styles.backgroundColor || '#000000';
        const borderColor = styles.borderColor || '#000000';

        return {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: styles.borderWidth || '0px',
            borderStyle: styles.borderStyle || 'solid',
            borderRadius: styles.borderRadius || '50%',
            width: styles.width || '36px',
            height: styles.height || '36px',
            padding: styles.padding || '8px',
            fontSize: styles.fontSize || '16px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            backgroundColor: bgColor === 'transparent' ? 'transparent' : `rgba(${parseColor(bgColor)}, ${bgOpacity})`,
            borderColor: borderColor === 'transparent' ? 'transparent' : `rgba(${parseColor(borderColor)}, ${borderOpacity})`,
        };
    };

    // Renderizar botones
    const renderButtons = () => {
        return (
            <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: buttonsGap
            }}>
                {/* Carrito */}
                <button
                    style={getButtonStyles(cartConfig)}
                    title="Carrito"
                    className="hover:opacity-80 relative"
                    onClick={() => isPreview && alert('Ir al carrito')}
                >
                    <ShoppingCart 
                        size={16} 
                        style={{ 
                            color: cartConfig.styles?.iconColor || '#ffffff',
                            transition: 'color 0.2s'
                        }} 
                    />
                    {cartConfig?.count && cartConfig.count !== '0' && cartConfig.count !== '0' && (
                        <span style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            backgroundColor: 'red',
                            color: 'white',
                            borderRadius: '50%',
                            width: '18px',
                            height: '18px',
                            fontSize: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {cartConfig.count}
                        </span>
                    )}
                </button>
                
                {/* Buscador - solo si showSearch es true */}
                {showSearch && (
                    <button
                        style={getButtonStyles(searchConfig)}
                        title="Buscar"
                        className="hover:opacity-80"
                        onClick={() => isPreview && alert('Abrir buscador')}
                    >
                        <Search 
                            size={16} 
                            style={{ 
                                color: searchConfig.styles?.iconColor || '#000000',
                                transition: 'color 0.2s'
                            }} 
                        />
                    </button>
                )}
                
                {/* Perfil */}
                <button
                    style={getButtonStyles(profileConfig)}
                    title="Perfil"
                    className="hover:opacity-80"
                    onClick={() => isPreview && alert('Ir al perfil')}
                >
                    <User 
                        size={16} 
                        style={{ 
                            color: profileConfig.styles?.iconColor || '#000000',
                            transition: 'color 0.2s'
                        }} 
                    />
                </button>
            </div>
        );
    };

    // Función para renderizar según la posición
    const renderByPosition = () => {
        // Caso 1: Logo a la izquierda (orden: logo -> menu -> botones)
        if (logoPosition === 'left') {
            return (
                <>
                    {/* Logo a la izquierda */}
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                        {logo && (
                            <CanvasItem
                                comp={logo}
                                onEditComponent={onEdit}
                                onDeleteComponent={onDelete}
                                themeSettings={themeSettings}
                                appliedTheme={appliedTheme}
                                isPreview={isPreview}
                                setComponents={setComponents}
                                hoveredComponentId={hoveredComponentId}
                                setHoveredComponentId={setHoveredComponentId}
                            />
                        )}
                    </div>
                    
                    {/* Menú en el centro */}
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {menu && (
                            <CanvasItem
                                comp={menu}
                                onEditComponent={onEdit}
                                onDeleteComponent={onDelete}
                                themeSettings={themeSettings}
                                appliedTheme={appliedTheme}
                                isPreview={isPreview}
                                setComponents={setComponents}
                                hoveredComponentId={hoveredComponentId}
                                setHoveredComponentId={setHoveredComponentId}
                            />
                        )}
                    </div>
                    
                    {/* Botones a la derecha */}
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {renderButtons()}
                    </div>
                </>
            );
        }
        
        // Caso 2: Logo en el centro (orden: menú -> logo -> botones)
        if (logoPosition === 'center') {
            return (
                <>
                    {/* Menú a la izquierda */}
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                        {menu && (
                            <CanvasItem
                                comp={menu}
                                onEditComponent={onEdit}
                                onDeleteComponent={onDelete}
                                themeSettings={themeSettings}
                                appliedTheme={appliedTheme}
                                isPreview={isPreview}
                                setComponents={setComponents}
                                hoveredComponentId={hoveredComponentId}
                                setHoveredComponentId={setHoveredComponentId}
                            />
                        )}
                    </div>
                    
                    {/* Logo en el centro */}
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {logo && (
                            <CanvasItem
                                comp={logo}
                                onEditComponent={onEdit}
                                onDeleteComponent={onDelete}
                                themeSettings={themeSettings}
                                appliedTheme={appliedTheme}
                                isPreview={isPreview}
                                setComponents={setComponents}
                                hoveredComponentId={hoveredComponentId}
                                setHoveredComponentId={setHoveredComponentId}
                            />
                        )}
                    </div>
                    
                    {/* Botones a la derecha */}
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {renderButtons()}
                    </div>
                </>
            );
        }
        
        // Caso 3: Logo a la derecha (orden: menú -> botones+logo con logo pegado a botones)
        if (logoPosition === 'right') {
            return (
                <>
                    {/* Menú a la izquierda */}
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                        {menu && (
                            <CanvasItem
                                comp={menu}
                                onEditComponent={onEdit}
                                onDeleteComponent={onDelete}
                                themeSettings={themeSettings}
                                appliedTheme={appliedTheme}
                                isPreview={isPreview}
                                setComponents={setComponents}
                                hoveredComponentId={hoveredComponentId}
                                setHoveredComponentId={setHoveredComponentId}
                            />
                        )}
                    </div>
                    
                    {/* Logo y botones juntos a la derecha */}
                    <div style={{ 
                        flex: 1, 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        {logo && (
                            <CanvasItem
                                comp={logo}
                                onEditComponent={onEdit}
                                onDeleteComponent={onDelete}
                                themeSettings={themeSettings}
                                appliedTheme={appliedTheme}
                                isPreview={isPreview}
                                setComponents={setComponents}
                                hoveredComponentId={hoveredComponentId}
                                setHoveredComponentId={setHoveredComponentId}
                            />
                        )}
                        {renderButtons()}
                    </div>
                </>
            );
        }
        
        // Fallback: Logo a la izquierda por defecto
        return (
            <>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                    {logo && (
                        <CanvasItem
                            comp={logo}
                            onEditComponent={onEdit}
                            onDeleteComponent={onDelete}
                            themeSettings={themeSettings}
                            appliedTheme={appliedTheme}
                            isPreview={isPreview}
                            setComponents={setComponents}
                            hoveredComponentId={hoveredComponentId}
                            setHoveredComponentId={setHoveredComponentId}
                        />
                    )}
                </div>
                
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {menu && (
                        <CanvasItem
                            comp={menu}
                            onEditComponent={onEdit}
                            onDeleteComponent={onDelete}
                            themeSettings={themeSettings}
                            appliedTheme={appliedTheme}
                            isPreview={isPreview}
                            setComponents={setComponents}
                            hoveredComponentId={hoveredComponentId}
                            setHoveredComponentId={setHoveredComponentId}
                        />
                    )}
                </div>
                
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    {renderButtons()}
                </div>
            </>
        );
    };

    return (
        <header
            style={containerStyles}
            onDoubleClick={isPreview ? undefined : () => onEdit(comp)}
            className={isPreview ? '' : 'hover:opacity-80 cursor-pointer'}
        >
            {renderByPosition()}
        </header>
    );
};

export default HeaderComponent;