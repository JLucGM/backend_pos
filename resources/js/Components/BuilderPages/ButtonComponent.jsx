import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import cartHelper from '@/Helper/cartHelper';
import { getButtonStyles, getThemeWithDefaults, resolveStyleValue } from '@/utils/themeUtils';

const ButtonComponent = ({
    comp: originalComp,
    getStyles,
    onEdit,
    isPreview = false,
    themeSettings = {},
    appliedTheme = null,
    product = null,
    selectedCombination = null,
    quantity = 1,
    companyId = null,
    storeAutomaticDiscounts = [],
    mode = 'builder' // 'builder' o 'frontend'
}) => {
    const [isHovered, setIsHovered] = useState(false);

    // ===========================================
    // 1. NORMALIZAR EL COMPONENTE
    // ===========================================
    const comp = React.useMemo(() => {
        // Asegurar que styles sea un objeto, no un array
        const normalizedStyles = Array.isArray(originalComp.styles)
            ? {}
            : (originalComp.styles || {});

        return {
            ...originalComp,
            styles: normalizedStyles
        };
    }, [originalComp]);

    // Obtener configuración del tema con valores por defecto
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // ===========================================
    // 2. FUNCIÓN PARA RESOLVER REFERENCIAS
    // ===========================================
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    // ===========================================
    // 3. RESOLVER TODAS LAS PROPIEDADES DEL COMPONENTE
    // ===========================================
    // Resolver styles
    const rawStyles = comp.styles || {};
    const resolvedStyles = {};
    Object.keys(rawStyles).forEach(key => {
        resolvedStyles[key] = resolveValue(rawStyles[key]);
    });

    // Resolver content (puede ser string, objeto, etc.)
    const resolvedContent = resolveValue(comp.content);

    // ===========================================
    // 4. DETERMINAR SI ES UNA URL
    // ===========================================
    const isUrl = React.useMemo(() => {
        const url = resolvedStyles.buttonUrl || resolvedContent;
        if (!url) return false;

        const urlString = String(url);

        if (typeof urlString === 'string') {
            return urlString.startsWith('/') || urlString.startsWith('http');
        }

        return false;
    }, [resolvedStyles.buttonUrl, resolvedContent]);

    // ===========================================
    // 5. OBTENER Y PROCESAR URL
    // ===========================================
    const getButtonUrl = () => {
        // Prioridad 1: URL específica en estilos
        const urlFromStyles = resolvedStyles.buttonUrl;
        if (urlFromStyles) {
            return urlFromStyles;
        }

        // Prioridad 2: Contenido (para compatibilidad con versiones anteriores)
        if (!resolvedContent) return '';

        if (typeof resolvedContent === 'string') {
            // Si parece una URL, usarla
            if (resolvedContent.startsWith('/') || resolvedContent.startsWith('http')) {
                return resolvedContent;
            }
        }

        return '';
    };

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

    const buttonUrl = getButtonUrl();
    const processedUrl = processUrl(buttonUrl);

    // ===========================================
    // 6. OBTENER ESTILOS DEL BOTÓN
    // ===========================================
    const getButtonStylesCustom = () => {
        const baseStyles = getStyles ? getStyles(comp) : {};

        // Usamos resolvedStyles en lugar de raw customStyles

        // Estilos base
        let styles = {
            ...baseStyles,
            fontFamily: themeWithDefaults?.body_font || 'inherit',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textDecoration: 'none',
            display: 'inline-block',
            outline: 'none',
            border: 'none',
        };

        // Determinar tipo de botón
        const buttonType = resolvedStyles.buttonType || 'primary';

        // Helper para añadir unidad (px) si es solo número
        const withUnit = (value, unit = 'px') => {
            if (value === undefined || value === null || value === '') return undefined;
            // Si ya es string y tiene algun caracter no numerico (como px, %, rem), devolver tal cual
            if (typeof value === 'string' && isNaN(Number(value))) return value;
            return `${value}${unit}`;
        };

        // ===== ESTILOS PARA TIPO "custom" =====
        if (buttonType === 'custom') {
            const fontSize = resolvedStyles.fontSize || '16px';
            const fontSizeUnit = resolvedStyles.fontSizeUnit || (fontSize?.toString().includes('rem') ? 'rem' : 'px');

            styles = {
                ...styles,
                backgroundColor: resolvedStyles.backgroundColor || themeWithDefaults.primary_button_background,
                color: resolvedStyles.color || themeWithDefaults.primary_button_text,
                borderColor: resolvedStyles.borderColor || resolvedStyles.backgroundColor || themeWithDefaults.primary_button_border,
                borderWidth: withUnit(resolvedStyles.borderWidth) || themeWithDefaults.primary_button_border_thickness,
                borderStyle: resolvedStyles.borderStyle || 'solid',
                borderRadius: withUnit(resolvedStyles.borderRadius) || themeWithDefaults.primary_button_corner_radius,
                paddingTop: withUnit(resolvedStyles.paddingTop) || '10px',
                paddingRight: withUnit(resolvedStyles.paddingRight) || '10px',
                paddingBottom: withUnit(resolvedStyles.paddingBottom) || '10px',
                paddingLeft: withUnit(resolvedStyles.paddingLeft) || '10px',
                fontSize: withUnit(fontSize, fontSizeUnit),
                textTransform: resolvedStyles.textTransform || themeWithDefaults.primary_button_text_case === 'default' ? 'none' : themeWithDefaults.primary_button_text_case,
                fontWeight: resolvedStyles.fontWeight || 'normal',
            };
        }
        // ===== ESTILOS PARA TIPO "primary" =====
        else if (buttonType === 'primary') {
            // Usar utilidades del tema
            const themeButtonStyles = getButtonStyles(themeWithDefaults, 'primary', appliedTheme);
            const fontSize = resolvedStyles.fontSize || themeButtonStyles.fontSize || '16px';
            const fontSizeUnit = resolvedStyles.fontSizeUnit || (fontSize?.toString().includes('rem') ? 'rem' : 'px');

            styles = {
                ...styles,
                backgroundColor: themeButtonStyles.backgroundColor || resolvedStyles.backgroundColor,
                color: themeButtonStyles.color || resolvedStyles.color,
                borderColor: themeButtonStyles.borderColor || themeButtonStyles.backgroundColor,
                borderWidth: withUnit(themeButtonStyles.borderWidth || resolvedStyles.borderWidth),
                borderStyle: 'solid',
                borderRadius: withUnit(themeButtonStyles.borderRadius || resolvedStyles.borderRadius),
                fontSize: withUnit(fontSize, fontSizeUnit),
                textTransform: themeButtonStyles.textTransform || resolvedStyles.textTransform,
                fontWeight: resolvedStyles.fontWeight || 'normal',
                paddingTop: withUnit(resolvedStyles.paddingTop || themeButtonStyles.paddingTop || '10px'),
                paddingRight: withUnit(resolvedStyles.paddingRight || themeButtonStyles.paddingRight || '20px'),
                paddingBottom: withUnit(resolvedStyles.paddingBottom || themeButtonStyles.paddingBottom || '10px'),
                paddingLeft: withUnit(resolvedStyles.paddingLeft || themeButtonStyles.paddingLeft || '20px'),
            };
        }
        // ===== ESTILOS PARA TIPO "secondary" =====
        else if (buttonType === 'secondary') {
            // Usar utilidades del tema
            const themeButtonStyles = getButtonStyles(themeWithDefaults, 'secondary', appliedTheme);
            const fontSize = resolvedStyles.fontSize || themeButtonStyles.fontSize || '16px';
            const fontSizeUnit = resolvedStyles.fontSizeUnit || (fontSize?.toString().includes('rem') ? 'rem' : 'px');

            styles = {
                ...styles,
                backgroundColor: themeButtonStyles.backgroundColor || resolvedStyles.backgroundColor,
                color: themeButtonStyles.color || resolvedStyles.color,
                borderColor: themeButtonStyles.borderColor || themeButtonStyles.backgroundColor,
                borderWidth: withUnit(themeButtonStyles.borderWidth || resolvedStyles.borderWidth),
                borderStyle: 'solid',
                borderRadius: withUnit(themeButtonStyles.borderRadius || resolvedStyles.borderRadius),
                fontSize: withUnit(fontSize, fontSizeUnit),
                textTransform: themeButtonStyles.textTransform || resolvedStyles.textTransform,
                fontWeight: resolvedStyles.fontWeight || 'normal',
                paddingTop: withUnit(resolvedStyles.paddingTop || themeButtonStyles.paddingTop || '10px'),
                paddingRight: withUnit(resolvedStyles.paddingRight || themeButtonStyles.paddingRight || '20px'),
                paddingBottom: withUnit(resolvedStyles.paddingBottom || themeButtonStyles.paddingBottom || '10px'),
                paddingLeft: withUnit(resolvedStyles.paddingLeft || themeButtonStyles.paddingLeft || '20px'),
            };
        }
        // ===== ESTILOS POR DEFECTO (si no hay tipo especificado) =====
        else {
            const fontSize = resolvedStyles.fontSize || '16px';
            const fontSizeUnit = resolvedStyles.fontSizeUnit || (fontSize?.toString().includes('rem') ? 'rem' : 'px');

            styles = {
                ...styles,
                backgroundColor: resolvedStyles.backgroundColor || themeWithDefaults.primary_button_background,
                color: resolvedStyles.color || themeWithDefaults.primary_button_text,
                border: resolvedStyles.borderWidth
                    ? `${withUnit(resolvedStyles.borderWidth)} solid ${resolvedStyles.borderColor || themeWithDefaults.primary_button_border}`
                    : `${withUnit(themeWithDefaults.primary_button_border_thickness)} solid ${themeWithDefaults.primary_button_border}`,
                borderRadius: withUnit(resolvedStyles.borderRadius) || themeWithDefaults.primary_button_corner_radius,
                fontSize: withUnit(fontSize, fontSizeUnit),
                fontWeight: resolvedStyles.fontWeight || 'normal',
                paddingTop: withUnit(resolvedStyles.paddingTop || '10px'),
                paddingRight: withUnit(resolvedStyles.paddingRight || '20px'),
                paddingBottom: withUnit(resolvedStyles.paddingBottom || '10px'),
                paddingLeft: withUnit(resolvedStyles.paddingLeft || '20px'),
            };
        }

        // Ajustar ancho según layout
        const layout = resolvedStyles.layout || 'fit';
        if (layout === 'fill') {
            styles.width = '100%';
            // Para botones de ancho completo, el texto se alinea según textAlign
            styles.textAlign = resolvedStyles.textAlign || 'center';
        }

        // Aplicar estilos de hover
        if (isHovered) {
            if (buttonType === 'custom' && resolvedStyles.hoverBackgroundColor) {
                styles.backgroundColor = resolvedStyles.hoverBackgroundColor;
                styles.borderColor = resolvedStyles.hoverBorderColor || resolvedStyles.hoverBackgroundColor;
                styles.color = resolvedStyles.hoverColor || styles.color;
            } else if (buttonType === 'primary') {
                const themeButtonStyles = getButtonStyles(themeWithDefaults, 'primary', appliedTheme);
                const hoverBg = themeButtonStyles['--hover-bg'] || resolvedStyles.hoverBackgroundColor;
                const hoverBorder = themeButtonStyles['--hover-border'] || hoverBg;
                const hoverColor = themeButtonStyles['--hover-color'] || styles.color;

                styles.backgroundColor = hoverBg;
                styles.borderColor = hoverBorder;
                styles.color = hoverColor;
            } else if (buttonType === 'secondary') {
                const themeButtonStyles = getButtonStyles(themeWithDefaults, 'secondary', appliedTheme);
                const hoverBg = themeButtonStyles['--hover-bg'] || resolvedStyles.hoverBackgroundColor;
                const hoverBorder = themeButtonStyles['--hover-border'] || hoverBg;
                const hoverColor = themeButtonStyles['--hover-color'] || styles.color;

                styles.backgroundColor = hoverBg;
                styles.borderColor = hoverBorder;
                styles.color = hoverColor;
            } else {
                // Efecto hover genérico usando valores del tema
                styles.backgroundColor = themeWithDefaults.primary_button_hover_background;
                styles.borderColor = themeWithDefaults.primary_button_hover_border;
                styles.color = themeWithDefaults.primary_button_hover_text;
            }
        }

        return styles;
    };

    // ===========================================
    // 7. MANEJAR CLIC
    // ===========================================
    const handleClick = (e) => {

        // MODO BUILDER (no preview): editar componente
        if (mode === 'builder' && !isPreview) {
            e.preventDefault();
            e.stopPropagation();
            if (onEdit) {
                onEdit(comp);
            }
            return;
        }

        // MODO FRONTEND o PREVIEW con URL: dejar navegar
        if ((mode === 'frontend' || isPreview) && isUrl) {
            // NO hacer preventDefault() - dejar que Link navegue
            return;
        }

        // MODO FRONTEND: botón de acción (agregar al carrito)
        if (product && companyId && !isUrl) {
            e.preventDefault();
            e.stopPropagation();

            const productAutoDiscounts = product.discounts ?
                product.discounts.filter(d => !d.code) : [];
            const allAutomaticDiscounts = [...productAutoDiscounts, ...storeAutomaticDiscounts];

            cartHelper.addToCart(companyId, product, selectedCombination, quantity, allAutomaticDiscounts);

            const discountInfo = productAutoDiscounts.length > 0 || storeAutomaticDiscounts.length > 0 ?
                " con descuento automático aplicado!" : "!";
            alert(`¡${product.product_name} agregado al carrito${discountInfo}`);

            window.dispatchEvent(new Event('cartUpdated'));
        }
    };

    // ===========================================
    // 8. OBTENER TEXTO DEL BOTÓN
    // ===========================================
    const getButtonText = () => {
        // Prioridad 1: Texto específico para botón en estilos
        if (resolvedStyles.buttonText && resolvedStyles.buttonText.trim() !== '') {
            return String(resolvedStyles.buttonText);
        }

        // Prioridad 2: Contenido directo del componente (ya resuelto)
        // Si es una URL, devolver texto descriptivo según tipo
        if (isUrl && typeof resolvedContent === 'string') {
            if (resolvedContent.includes('detalles-del-producto')) {
                return 'Ver Producto';
            } else if (resolvedContent.startsWith('/')) {
                return 'Ir a Página';
            } else if (resolvedContent.startsWith('http')) {
                return 'Visitar Enlace';
            }
        }

        // Si el contenido existe y no es una URL, usarlo
        if (resolvedContent && typeof resolvedContent === 'string' && resolvedContent.trim() !== '') {
            // Verificar que no sea una URL
            if (!resolvedContent.startsWith('/') && !resolvedContent.startsWith('http')) {
                return resolvedContent;
            }
        }

        // Si es un objeto con texto (pero ya resolvimos content, así que no debería pasar)
        if (resolvedContent && typeof resolvedContent === 'object') {
            if (resolvedContent.text && String(resolvedContent.text).trim() !== '') {
                return String(resolvedContent.text);
            }
            if (resolvedContent.content && String(resolvedContent.content).trim() !== '') {
                return String(resolvedContent.content);
            }
        }

        // Texto por defecto
        return 'Botón';
    };

    // ===========================================
    // 9. OBTENER ESTILOS Y TEXTO
    // ===========================================
    const buttonStyles = getButtonStylesCustom();
    const buttonText = getButtonText();
    const layout = resolvedStyles.layout || 'fit';
    const align = resolvedStyles.align || 'start';

    // ===========================================
    // 10. FUNCIÓN PARA CREAR EL ELEMENTO DEL BOTÓN
    // ===========================================
    const createButtonElement = () => {
        // Para modo BUILDER sin preview
        if (mode === 'builder' && !isPreview) {
            // Siempre usar un <button> en modo builder para mantener consistencia
            return (
                <button
                    style={buttonStyles}
                    onClick={handleClick}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="button-builder"
                    type="button"
                >
                    {buttonText}
                </button>
            );
        }

        // Para modo FRONTEND o PREVIEW
        if ((mode === 'frontend' || isPreview) && isUrl) {
            // URL interna -> Link de Inertia
            if (processedUrl.startsWith('/')) {
                return (
                    <Link
                        href={processedUrl}
                        style={buttonStyles}
                        onClick={handleClick}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className="button-link-inertia"
                    >
                        {buttonText}
                    </Link>
                );
            }
            // URL externa -> <a> con target="_blank"
            else if (processedUrl.startsWith('http')) {
                return (
                    <a
                        href={processedUrl}
                        style={buttonStyles}
                        onClick={handleClick}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button-link-external"
                    >
                        {buttonText}
                    </a>
                );
            }
        }

        // Caso por defecto: botón normal sin URL
        return (
            <button
                style={buttonStyles}
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="button-normal"
                type="button"
            >
                {buttonText}
            </button>
        );
    };

    // ===========================================
    // 11. LÓGICA DE RENDERIZADO CON POSICIÓN
    // ===========================================
    const buttonElement = createButtonElement();

    // Si no hay posición o es 'start', devolver el botón directamente
    if (!align || align === 'start') {
        return buttonElement;
    }

    // Si es layout 'fill', el botón ya tiene width: 100%, solo aplicar textAlign interno
    if (layout === 'fill') {
        return buttonElement;
    }

    // Si es layout 'fit' con posición 'center' o 'end', usar contenedor
    return (
        <div style={{
            display: 'flex',
            justifyContent: align === 'center' ? 'center' :
                align === 'end' ? 'flex-end' : 'flex-start',
            width: '100%',
        }}>
            {buttonElement}
        </div>
    );
};

export default ButtonComponent;