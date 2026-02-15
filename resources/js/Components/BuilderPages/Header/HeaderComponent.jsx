import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Search, User, LogOut } from 'lucide-react';
import CanvasItem from '../CanvasItem';
import { Link, usePage, router } from '@inertiajs/react';
import { getThemeWithDefaults, getComponentStyles, getResolvedFont, resolveStyleValue } from '@/utils/themeUtils';

// Helper para añadir unidad (px) si es solo número
const withUnit = (value, unit = 'px') => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'string' && isNaN(Number(value))) return value;
    return `${value}${unit}`;
};

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
    mode = 'frontend', // 'builder' o 'frontend'
    availableMenus = [],
    companyLogo,
    canvasRect = null,
    canvasScrollTop = 0
}) => {
    const { props } = usePage();
    const user = props.auth?.user;
    const cart = props.cart || { items_count: 0 };

    const customStyles = comp.styles || {};
    const content = comp.content || {};
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);
    const themeHeaderStyles = getComponentStyles(themeWithDefaults, 'header', appliedTheme);

    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const headerRef = useRef(null);

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

    // ---------- RESOLUCIÓN DE ESTILOS ----------
    const resolveStyles = (styles) => {
        if (!styles) return {};
        const resolved = {};
        Object.keys(styles).forEach(key => {
            resolved[key] = resolveStyleValue(styles[key], themeWithDefaults, appliedTheme);
        });
        return resolved;
    };

    // Resolver estilos del header principal
    const headerStyles = resolveStyles(getStyles(comp));

    // Obtener estilos del contenedor principal
    const getContainerStyles = () => {
        const baseStyles = {
            ...headerStyles,
            width: content?.fullWidth ? '100%' : (headerStyles.width || '100%'),
            height: withUnit(content?.height || headerStyles.height || '70px', content?.heightUnit || 'px'),
            display: headerStyles.display || 'flex',
            alignItems: headerStyles.alignItems || 'center',
            borderBottom: headerStyles.borderBottom || themeHeaderStyles.borderBottom || '1px solid #e5e5e5',
            transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
        };

        // En builder/preview usar sticky si está configurado
        if (mode !== 'frontend') {
            if (stickyType === 'fixed' || stickyType === 'smart') {
                return {
                    ...baseStyles,
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                };
            }
            return baseStyles;
        }

        // En frontend se maneja por separado
        return baseStyles;
    };

    const containerStyles = getContainerStyles();

    // ---------- CLASIFICACIÓN DE HIJOS ----------
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

    // ---------- CONFIGURACIÓN DE BOTONES ----------
    const buttonsConfig = content?.buttons || {};
    const defaultButtonStyles = {
        iconColor: themeWithDefaults.text,
        backgroundColor: themeWithDefaults.primary_button_background,
        borderWidth: '0px',
        borderStyle: 'solid',
        borderColor: themeWithDefaults.primary_button_border,
        borderOpacity: '1',
        borderRadius: '50%',
        backgroundOpacity: '1',
        width: '36px',
        height: '36px',
        padding: '8px',
        fontSize: '16px'
    };

    // Resolver estilos de cada botón
    const cartConfig = buttonsConfig.cart || { count: '0', styles: { ...defaultButtonStyles, iconColor: themeWithDefaults.primary_button_text } };
    const searchConfig = buttonsConfig.search || { styles: { ...defaultButtonStyles, backgroundColor: 'transparent' } };
    const profileConfig = buttonsConfig.profile || { styles: { ...defaultButtonStyles, backgroundColor: themeWithDefaults.secondary_button_background } };

    const cartStylesResolved = resolveStyles(cartConfig.styles || {});
    const cartConfigResolved = { ...cartConfig, styles: cartStylesResolved };

    const searchStylesResolved = resolveStyles(searchConfig.styles || {});
    const searchConfigResolved = { ...searchConfig, styles: searchStylesResolved };

    const profileStylesResolved = resolveStyles(profileConfig.styles || {});
    const profileConfigResolved = { ...profileConfig, styles: profileStylesResolved };

    const showSearch = buttonsConfig.showSearch !== false;
    const buttonsGap = withUnit(buttonsConfig.buttonsGap || '10px');
    const logoPosition = content?.logoPosition || 'left';

    // ---------- FUNCIÓN PARA CONSTRUIR ESTILOS DE BOTÓN ----------
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
                backgroundColor: themeWithDefaults.primary_button_background,
                borderColor: 'transparent',
            };
        }

        const styles = buttonConfig.styles;

        const bgOpacity = styles.backgroundOpacity || '1';
        const borderOpacity = styles.borderOpacity || '1';

        const parseColor = (color) => {
            if (!color) return '0, 0, 0';
            if (color.startsWith('rgba')) {
                const matches = color.match(/\d+/g);
                return `${matches[0]}, ${matches[1]}, ${matches[2]}`;
            }
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

        const bgColor = styles.backgroundColor || themeWithDefaults.primary_button_background;
        const borderColor = styles.borderColor || themeWithDefaults.primary_button_border;

        return {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: withUnit(styles.borderWidth || '0px'),
            borderStyle: styles.borderStyle || 'solid',
            borderRadius: withUnit(styles.borderRadius || '50%'),
            width: withUnit(styles.width || '36px'),
            height: withUnit(styles.height || '36px'),
            padding: withUnit(styles.padding || '8px'),
            fontSize: withUnit(styles.fontSize || '16px'),
            cursor: 'pointer',
            transition: 'all 0.2s',
            backgroundColor: bgColor === 'transparent' ? 'transparent' : `rgba(${parseColor(bgColor)}, ${bgOpacity})`,
            borderColor: borderColor === 'transparent' ? 'transparent' : `rgba(${parseColor(borderColor)}, ${borderOpacity})`,
        };
    };

    // ---------- FUNCIONES DE RUTAS ----------
    const getAuthRoute = () => {
        if (mode !== 'frontend') return '#';
        try {
            const hostname = window.location.hostname;
            const sessionDomain = props.env?.SESSION_DOMAIN || '.pos.test';
            if (hostname.endsWith(sessionDomain)) {
                const subdomain = hostname.split('.')[0];
                return user ? route('frontend.logout', { subdomain }) : route('frontend.login', { subdomain });
            }
            const domain = hostname;
            return user ? route('frontend.logout.custom', { domain }) : route('frontend.login.custom', { domain });
        } catch (error) {
            console.error('Error generating auth route:', error);
            return '#';
        }
    };

    const getCartRoute = () => {
        if (mode !== 'frontend') return '#';
        try {
            const hostname = window.location.hostname;
            const sessionDomain = props.env?.SESSION_DOMAIN || '.pos.test';
            if (hostname.endsWith(sessionDomain)) {
                const subdomain = hostname.split('.')[0];
                return route('frontend.cart', { subdomain });
            }
            const domain = hostname;
            return route('frontend.cart.custom', { domain });
        } catch (error) {
            console.error('Error generating cart route:', error);
            return '#';
        }
    };

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

    const getCartCount = () => {
        if (mode === 'frontend' && cart && cart.items_count !== undefined) {
            return cart.items_count;
        }
        return cartConfig?.count || '0';
    };

    // ---------- RENDERIZADO DE BOTONES ----------
    const renderButtons = () => {
        const isAuthenticated = user && mode === 'frontend';
        const cartCount = getCartCount();

        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: buttonsGap }}>
                {showSearch && (
                    <button
                        style={getButtonStyles(searchConfigResolved)}
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
                            style={{ color: searchConfigResolved.styles?.iconColor || themeWithDefaults.text }}
                        />
                    </button>
                )}

                <Link
                    style={getButtonStyles(cartConfigResolved)}
                    title="Carrito"
                    className="hover:opacity-80 relative"
                    href="/carrito-de-compras"
                >
                    <ShoppingCart
                        size={16}
                        style={{ color: cartConfigResolved.styles?.iconColor || themeWithDefaults.primary_button_text }}
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
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold'
                        }}>
                            {cartCount}
                        </span>
                    )}
                </Link>

                <div style={{ position: 'relative' }}>
                    {isAuthenticated ? (
                        <>
                            <button
                                style={getButtonStyles(profileConfigResolved)}
                                title="Mi perfil"
                                className="hover:opacity-80"
                                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                            >
                                <User
                                    size={16}
                                    style={{ color: profileConfigResolved.styles?.iconColor || themeWithDefaults.text }}
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
                                        zIndex: 2001,
                                        marginTop: '10px',
                                        border: '1px solid #e5e5e5',
                                        overflow: 'hidden'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div style={{
                                        padding: '16px',
                                        borderBottom: `1px solid ${themeWithDefaults.borders}`,
                                        backgroundColor: themeWithDefaults.background
                                    }}>
                                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                                            {user.name}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                            {user.email}
                                        </div>
                                    </div>

                                    <Link
                                        href="/perfil-de-usuario"
                                        style={{
                                            display: 'block',
                                            padding: '12px 16px',
                                            textDecoration: 'none',
                                            color: '#333',
                                            fontSize: '14px'
                                        }}
                                        className="hover:bg-gray-50"
                                    >
                                        Mi perfil
                                    </Link>

                                    <Link
                                        href="/pedidos"
                                        style={{
                                            display: 'block',
                                            padding: '12px 16px',
                                            textDecoration: 'none',
                                            color: '#333',
                                            fontSize: '14px'
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
                                            borderTop: `1px solid ${themeWithDefaults.borders}`
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
                        <Link
                            href="/iniciar-sesion"
                            style={getButtonStyles(profileConfigResolved)}
                            title="Iniciar sesión"
                            className="hover:opacity-80 flex items-center justify-center"
                        >
                            <User size={16} style={{ color: profileConfigResolved.styles?.iconColor || themeWithDefaults.text }} />
                        </Link>
                    )}
                </div>
            </div>
        );
    };

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = () => setShowProfileDropdown(false);
        if (showProfileDropdown) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showProfileDropdown]);

    // ---------- RENDERIZADO SEGÚN POSICIÓN DEL LOGO ----------
    const renderByPosition = () => {
        const commonProps = {
            onEditComponent: onEdit,
            onDeleteComponent: onDelete,
            themeSettings,
            appliedTheme,
            isPreview,
            setComponents,
            hoveredComponentId,
            setHoveredComponentId,
            mode,
        };

        if (logoPosition === 'left') {
            return (
                <>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                        {logo && <CanvasItem comp={logo} {...commonProps} companyLogo={companyLogo} />}
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {menu && <CanvasItem comp={menu} {...commonProps} availableMenus={availableMenus} />}
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {renderButtons()}
                    </div>
                </>
            );
        }

        if (logoPosition === 'center') {
            return (
                <>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                        {menu && <CanvasItem comp={menu} {...commonProps} availableMenus={availableMenus} />}
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {logo && <CanvasItem comp={logo} {...commonProps} companyLogo={companyLogo} />}
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {renderButtons()}
                    </div>
                </>
            );
        }

        if (logoPosition === 'right') {
            return (
                <>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                        {menu && <CanvasItem comp={menu} {...commonProps} availableMenus={availableMenus} />}
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                        {logo && <CanvasItem comp={logo} {...commonProps} companyLogo={companyLogo} />}
                        {renderButtons()}
                    </div>
                </>
            );
        }

        // Fallback
        return (
            <>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                    {logo && <CanvasItem comp={logo} {...commonProps} companyLogo={companyLogo} />}
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {menu && <CanvasItem comp={menu} {...commonProps} availableMenus={availableMenus} />}
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    {renderButtons()}
                </div>
            </>
        );
    };

    // ---------- RENDER FINAL ----------
    const isStickyFrontend = mode === 'frontend' && (stickyType === 'fixed' || stickyType === 'smart');

    if (isStickyFrontend) {
        const headerHeight = content?.height || '70px';
        const fixedHeaderStyles = {
            ...containerStyles,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            width: '100%',
            height: headerHeight,
            transform: stickyType === 'smart' ? (isVisible ? 'translateY(0)' : 'translateY(-100%)') : 'none',
        };
        // console.log(fixedHeaderStyles)

        return (
            <>
                <div style={{ height: headerHeight, width: '100%', backgroundColor: 'transparent' }} />
                <header ref={headerRef} style={fixedHeaderStyles} onClick={(e) => e.stopPropagation()}>
                    {renderByPosition()}
                </header>
            </>
        );
    }
// console.log(containerStyles)
    return (
        <header
            ref={headerRef}
            style={containerStyles}
            onDoubleClick={isEditable ? () => onEdit(comp) : undefined}
            className={isEditable ? 'hover:opacity-80 cursor-pointer' : ''}
            onClick={(e) => e.stopPropagation()}
        >
            {renderByPosition()}
        </header>
    );
};

export default HeaderComponent;