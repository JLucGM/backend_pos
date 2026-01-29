import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, User, LogOut } from 'lucide-react';
import CanvasItem from '../CanvasItem';
import { Link, usePage, router } from '@inertiajs/react';
import { getThemeWithDefaults, getComponentStyles, hslToCss, getResolvedFont } from '@/utils/themeUtils';

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
    setHoveredComponentId,
    mode = 'frontend', // 'builder' o 'frontend',
    availableMenus = [],
    companyLogo // Agregar esta prop
}) => {
    const { props } = usePage();
    const user = props.auth?.user;
    const cart = props.cart || { items_count: 0 };
    const headerStyles = getStyles(comp);
    const customStyles = comp.styles || {};
    const content = comp.content || {};
    const themeWithDefaults = getThemeWithDefaults(themeSettings);
    const themeHeaderStyles = getComponentStyles(themeWithDefaults, 'header');

    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Determinar si estamos en modo de edición
    const isEditable = mode === 'builder' && !isPreview;

    // Configuración de sticky
    const stickyType = content?.stickyType || 'none'; // 'none', 'fixed', 'smart'

    // Efecto para manejar el scroll solo en modo frontend y sticky smart
    useEffect(() => {
        if (mode !== 'frontend' || stickyType !== 'smart') return;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY < lastScrollY) {
                // Scrolling up - mostrar header
                setIsVisible(true);
            } else if (currentScrollY > 100 && currentScrollY > lastScrollY) {
                // Scrolling down y pasó los 100px - ocultar header
                setIsVisible(false);
            }
            
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY, mode, stickyType]);

    // Estilos del contenedor principal del header con valores del tema
    const getContainerStyles = () => {
        const baseStyles = {
            ...headerStyles,
            width: content?.fullWidth ? '100%' : customStyles.width || '100%',
            height: content?.height || '70px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: customStyles.backgroundColor || themeHeaderStyles.backgroundColor,
            paddingTop: customStyles.paddingTop || '20px',
            paddingRight: customStyles.paddingRight || '20px',
            paddingBottom: customStyles.paddingBottom || '20px',
            paddingLeft: customStyles.paddingLeft || '20px',
            borderBottom: customStyles.borderBottom || themeHeaderStyles.borderBottom || '1px solid #e5e5e5',
            transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
        };

        // Aplicar sticky solo en modo frontend
        if (mode === 'frontend') {
            if (stickyType === 'fixed') {
                return {
                    ...baseStyles,
                    position: 'fixed',
                    top: 0,
                    zIndex: 1000,
                };
            } else if (stickyType === 'smart') {
                return {
                    ...baseStyles,
                    position: 'fixed',
                    top: 0,
                    zIndex: 1000,
                    transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
                };
            }
        }

        // Modo builder o sin sticky
        return {
            ...baseStyles,
            position: 'static',
        };
    };

    const containerStyles = getContainerStyles();

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
        iconColor: hslToCss(themeWithDefaults.text),
        backgroundColor: hslToCss(themeWithDefaults.primary_button_background),
        borderWidth: '0px',
        borderStyle: 'solid',
        borderColor: hslToCss(themeWithDefaults.primary_button_border),
        borderOpacity: '1',
        borderRadius: '50%',
        backgroundOpacity: '1',
        width: '36px',
        height: '36px',
        padding: '8px',
        fontSize: '16px'
    };

    const cartConfig = buttonsConfig.cart || { count: '0', styles: { ...defaultButtonStyles, iconColor: hslToCss(themeWithDefaults.primary_button_text) } };
    const searchConfig = buttonsConfig.search || { styles: { ...defaultButtonStyles, backgroundColor: 'transparent' } };
    const profileConfig = buttonsConfig.profile || { styles: { ...defaultButtonStyles, backgroundColor: hslToCss(themeWithDefaults.secondary_button_background) } };
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
                backgroundColor: hslToCss(themeWithDefaults.primary_button_background),
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

        const bgColor = styles.backgroundColor || hslToCss(themeWithDefaults.primary_button_background);
        const borderColor = styles.borderColor || hslToCss(themeWithDefaults.primary_button_border);

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

    // Función para obtener la ruta de login/logout correcta
    const getAuthRoute = () => {
        if (mode !== 'frontend') return '#';

        try {
            const hostname = window.location.hostname;
            const sessionDomain = props.env?.SESSION_DOMAIN || '.pos.test';

            // Si estamos en un subdominio
            if (hostname.endsWith(sessionDomain)) {
                const subdomain = hostname.split('.')[0];
                if (user) {
                    // Ruta de logout para subdominio
                    return route('frontend.logout', { subdomain });
                } else {
                    // Ruta de login para subdominio
                    return route('frontend.login', { subdomain });
                }
            }

            // Si estamos en un dominio personalizado
            const domain = hostname;
            if (user) {
                return route('frontend.logout.custom', { domain });
            } else {
                return route('frontend.login.custom', { domain });
            }
        } catch (error) {
            console.error('Error generating auth route:', error);
            return '#';
        }
    };

    // Función para obtener la ruta del carrito
    const getCartRoute = () => {
        if (mode !== 'frontend') return '#';

        try {
            const hostname = window.location.hostname;
            const sessionDomain = props.env?.SESSION_DOMAIN || '.pos.test';

            // Si estamos en un subdominio
            if (hostname.endsWith(sessionDomain)) {
                const subdomain = hostname.split('.')[0];
                return route('frontend.cart', { subdomain });
            }

            // Si estamos en un dominio personalizado
            const domain = hostname;
            return route('frontend.cart.custom', { domain });
        } catch (error) {
            console.error('Error generating cart route:', error);
            return '#';
        }
    };

    // Función para obtener la ruta del perfil
    const getProfileRoute = () => {
        if (mode !== 'frontend') return '#';

        try {
            const hostname = window.location.hostname;
            const sessionDomain = props.env?.SESSION_DOMAIN || '.pos.test';

            // Si estamos en un subdominio
            if (hostname.endsWith(sessionDomain)) {
                const subdomain = hostname.split('.')[0];
                return route('frontend.profile', { subdomain });
            }

            // Si estamos en un dominio personalizado
            const domain = hostname;
            return route('frontend.profile.custom', { domain });
        } catch (error) {
            console.error('Error generating profile route:', error);
            return '#';
        }
    };

    // Función para obtener la ruta de pedidos
    const getOrdersRoute = () => {
        if (mode !== 'frontend') return '#';

        try {
            const hostname = window.location.hostname;
            const sessionDomain = props.env?.SESSION_DOMAIN || '.pos.test';

            // Si estamos en un subdominio
            if (hostname.endsWith(sessionDomain)) {
                const subdomain = hostname.split('.')[0];
                return route('frontend.orders', { subdomain });
            }

            // Si estamos en un dominio personalizado
            const domain = hostname;
            return route('frontend.orders.custom', { domain });
        } catch (error) {
            console.error('Error generating orders route:', error);
            return '#';
        }
    };

    // Función para manejar logout
    const handleLogout = () => {
        if (mode === 'frontend') {
            router.post(getAuthRoute(), {}, {
                onSuccess: () => {
                    setShowProfileDropdown(false);
                    router.reload();
                }
            });
        } else if (isPreview) {
            alert('Simulación: Cerrar sesión');
        }
    };

    // Obtener el conteo real del carrito o usar el configurado
    const getCartCount = () => {
        if (mode === 'frontend' && cart && cart.items_count !== undefined) {
            return cart.items_count;
        }
        return cartConfig?.count || '0';
    };

    // Renderizar botones condicionalmente
    const renderButtons = () => {
        const isAuthenticated = user && mode === 'frontend';
        const cartCount = getCartCount();

        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: buttonsGap
            }}>
                {/* Carrito - Redirige al carrito real */}
                <Link
                    style={getButtonStyles(cartConfig)}
                    title="Carrito"
                    className="hover:opacity-80 relative"
                    href='/carrito-de-compras'
                >
                    <ShoppingCart
                        size={16}
                        style={{
                            color: cartConfig.styles?.iconColor || hslToCss(themeWithDefaults.primary_button_text),
                            transition: 'color 0.2s'
                        }}
                    />
                    {cartCount && cartCount !== '0' && parseInt(cartCount) > 0 && (
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
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold'
                        }}>
                            {cartCount}
                        </span>
                    )}
                </Link>

                {/* Buscador - solo si showSearch es true */}
                {showSearch && (
                    <button
                        style={getButtonStyles(searchConfig)}
                        title="Buscar"
                        className="hover:opacity-80"
                        onClick={() => {
                            if (mode === 'frontend') {
                                router.visit('/search');
                            } else if (isPreview) {
                                alert('Abrir buscador (simulación)');
                            }
                        }}
                    >
                        <Search
                            size={16}
                            style={{
                                color: searchConfig.styles?.iconColor || hslToCss(themeWithDefaults.text),
                                transition: 'color 0.2s'
                            }}
                        />
                    </button>
                )}

                {/* Botón de Perfil/Login condicional */}
                <div style={{ position: 'relative' }}>
                    {isAuthenticated ? (
                        // Usuario autenticado: Mostrar botón de perfil con dropdown
                        <>
                            <button
                                style={getButtonStyles(profileConfig)}
                                title="Mi perfil"
                                className="hover:opacity-80"
                                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                            >
                                <User
                                    size={16}
                                    style={{
                                        color: profileConfig.styles?.iconColor || hslToCss(themeWithDefaults.text),
                                        transition: 'color 0.2s'
                                    }}
                                />
                            </button>

                            {showProfileDropdown && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        backgroundColor: 'white',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        borderRadius: '8px',
                                        minWidth: '200px',
                                        zIndex: 1001,
                                        marginTop: '10px',
                                        border: '1px solid #e5e5e5',
                                        overflow: 'hidden'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Información del usuario */}
                                    <div style={{
                                        padding: '16px',
                                        borderBottom: `1px solid ${hslToCss(themeWithDefaults.borders)}`,
                                        backgroundColor: hslToCss(themeWithDefaults.background)
                                    }}>
                                        <div style={{
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: '#333'
                                        }}>
                                            {user.name}
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#666',
                                            marginTop: '4px'
                                        }}>
                                            {user.email}
                                        </div>
                                    </div>

                                    {/* Opciones del menú */}
                                    <Link
                                        href='/perfil-de-usuario'
                                        style={{
                                            display: 'block',
                                            padding: '12px 16px',
                                            textDecoration: 'none',
                                            color: '#333',
                                            fontSize: '14px',
                                            transition: 'background-color 0.2s'
                                        }}
                                        className="hover:bg-gray-50"
                                    >
                                        Mi perfil
                                    </Link>

                                    <Link
                                        href='/pedidos'
                                        style={{
                                            display: 'block',
                                            padding: '12px 16px',
                                            textDecoration: 'none',
                                            color: '#333',
                                            fontSize: '14px',
                                            transition: 'background-color 0.2s'
                                        }}
                                        className="hover:bg-gray-50"
                                    >
                                        Mis pedidos
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: 'none',
                                            border: 'none',
                                            color: '#d32f2f',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s',
                                            borderTop: `1px solid ${hslToCss(themeWithDefaults.borders)}`
                                        }}
                                        className="hover:bg-red-50"
                                    >
                                        <LogOut size={14} style={{ marginRight: '8px' }} />
                                        Cerrar sesión
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        // Usuario no autenticado: Mostrar botón de login
                        <Link
                            href={'/iniciar-sesion'}
                            style={getButtonStyles(profileConfig)}
                            title="Iniciar sesión"
                            className="hover:opacity-80 flex items-center justify-center"
                        >
                            <User
                                size={16}
                                style={{
                                    color: profileConfig.styles?.iconColor || hslToCss(themeWithDefaults.text),
                                    transition: 'color 0.2s'
                                }}
                            />
                        </Link>
                    )}
                </div>
            </div>
        );
    };

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = () => {
            setShowProfileDropdown(false);
        };

        if (showProfileDropdown) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showProfileDropdown]);

    // Función para renderizar según la posición - PASAR companyLogo A LOS CanvasItem DE LOGO
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
                                mode={mode}
                                companyLogo={companyLogo} // Pasar companyLogo
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
                                mode={mode}
                                availableMenus={availableMenus}
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
                                mode={mode}
                                availableMenus={availableMenus}
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
                                mode={mode}
                                companyLogo={companyLogo} // Pasar companyLogo
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
                                mode={mode}
                                availableMenus={availableMenus}
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
                                mode={mode}
                                companyLogo={companyLogo} // Pasar companyLogo
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
                            mode={mode}
                            companyLogo={companyLogo} // Pasar companyLogo
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
                            mode={mode}
                            availableMenus={availableMenus}
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
            onDoubleClick={isEditable ? () => onEdit(comp) : undefined}
            className={isEditable ? 'hover:opacity-80 cursor-pointer' : ''}
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            {renderByPosition()}
        </header>
    );
};

export default HeaderComponent;