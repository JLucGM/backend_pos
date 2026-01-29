import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import cartHelper from '@/Helper/cartHelper';
import { getButtonStyles, hslToCss, getThemeWithDefaults } from '@/utils/themeUtils';

const ButtonComponent = ({
    comp: originalComp,
    getStyles,
    onEdit,
    isPreview = false,
    themeSettings = {},
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
    const themeWithDefaults = getThemeWithDefaults(themeSettings);

    // ===========================================
    // 2. DETERMINAR SI ES UNA URL
    // ===========================================
    const isUrl = React.useMemo(() => {
        const url = comp.styles?.buttonUrl || comp.content;
        if (!url) return false;

        const urlString = String(url);

        if (typeof urlString === 'string') {
            return urlString.startsWith('/') || urlString.startsWith('http');
        }

        return false;
    }, [comp.styles?.buttonUrl, comp.content]);

    // ===========================================
    // 3. OBTENER Y PROCESAR URL
    // ===========================================
    const getButtonUrl = () => {
        // Prioridad 1: URL específica en estilos
        const urlFromStyles = comp.styles?.buttonUrl;
        if (urlFromStyles) {
            return urlFromStyles;
        }

        // Prioridad 2: Contenido (para compatibilidad con versiones anteriores)
        const content = comp.content;
        if (!content) return '';

        if (typeof content === 'string') {
            // Si parece una URL, usarla
            if (content.startsWith('/') || content.startsWith('http')) {
                return content;
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
    // 4. OBTENER ESTILOS DEL BOTÓN
    // ===========================================
    const getButtonStylesCustom = () => {
        const baseStyles = getStyles ? getStyles(comp) : {};
        const customStyles = comp.styles || {};

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
        const buttonType = customStyles.buttonType || 'primary';

        // ===== ESTILOS PARA TIPO "custom" =====
        if (buttonType === 'custom') {
            styles = {
                ...styles,
                backgroundColor: customStyles.backgroundColor || hslToCss(themeWithDefaults.primary_button_background),
                color: customStyles.color || hslToCss(themeWithDefaults.primary_button_text),
                borderColor: customStyles.borderColor || customStyles.backgroundColor || hslToCss(themeWithDefaults.primary_button_border),
                borderWidth: customStyles.borderWidth || themeWithDefaults.primary_button_border_thickness,
                borderStyle: customStyles.borderStyle || 'solid',
                borderRadius: customStyles.borderRadius || themeWithDefaults.primary_button_corner_radius,
                paddingTop: customStyles.paddingTop || '10px',
                paddingRight: customStyles.paddingRight || '10px',
                paddingBottom: customStyles.paddingBottom || '10px',
                paddingLeft: customStyles.paddingLeft || '10px',
                fontSize: customStyles.fontSize || '16px',
                textTransform: customStyles.textTransform || themeWithDefaults.primary_button_text_case === 'default' ? 'none' : themeWithDefaults.primary_button_text_case,
                fontWeight: customStyles.fontWeight || 'normal',
            };
        }
        // ===== ESTILOS PARA TIPO "primary" =====
        else if (buttonType === 'primary') {
            // Usar utilidades del tema
            const themeButtonStyles = getButtonStyles(themeWithDefaults, 'primary');
            
            styles = {
                ...styles,
                backgroundColor: themeButtonStyles.backgroundColor || customStyles.backgroundColor,
                color: themeButtonStyles.color || customStyles.color,
                borderColor: themeButtonStyles.borderColor || themeButtonStyles.backgroundColor,
                borderWidth: themeButtonStyles.borderWidth || customStyles.borderWidth,
                borderStyle: 'solid',
                borderRadius: themeButtonStyles.borderRadius || customStyles.borderRadius,
                fontSize: customStyles.fontSize || '16px',
                textTransform: themeButtonStyles.textTransform || customStyles.textTransform,
                fontWeight: customStyles.fontWeight || 'normal',
                paddingTop: customStyles.paddingTop || '10px',
                paddingRight: customStyles.paddingRight || '10px',
                paddingBottom: customStyles.paddingBottom || '10px',
                paddingLeft: customStyles.paddingLeft || '10px',
            };
        }
        // ===== ESTILOS PARA TIPO "secondary" =====
        else if (buttonType === 'secondary') {
            // Usar utilidades del tema
            const themeButtonStyles = getButtonStyles(themeWithDefaults, 'secondary');
            
            styles = {
                ...styles,
                backgroundColor: themeButtonStyles.backgroundColor || customStyles.backgroundColor,
                color: themeButtonStyles.color || customStyles.color,
                borderColor: themeButtonStyles.borderColor || themeButtonStyles.backgroundColor,
                borderWidth: themeButtonStyles.borderWidth || customStyles.borderWidth,
                borderStyle: 'solid',
                borderRadius: themeButtonStyles.borderRadius || customStyles.borderRadius,
                fontSize: customStyles.fontSize || '16px',
                textTransform: themeButtonStyles.textTransform || customStyles.textTransform,
                fontWeight: customStyles.fontWeight || 'normal',
                paddingTop: customStyles.paddingTop || '10px',
                paddingRight: customStyles.paddingRight || '10px',
                paddingBottom: customStyles.paddingBottom || '10px',
                paddingLeft: customStyles.paddingLeft || '10px',
            };
        }
        // ===== ESTILOS POR DEFECTO (si no hay tipo especificado) =====
        else {
            styles = {
                ...styles,
                backgroundColor: customStyles.backgroundColor || hslToCss(themeWithDefaults.primary_button_background),
                color: customStyles.color || hslToCss(themeWithDefaults.primary_button_text),
                border: customStyles.borderWidth
                    ? `${customStyles.borderWidth} solid ${customStyles.borderColor || hslToCss(themeWithDefaults.primary_button_border)}`
                    : `${themeWithDefaults.primary_button_border_thickness} solid ${hslToCss(themeWithDefaults.primary_button_border)}`,
                borderRadius: customStyles.borderRadius || themeWithDefaults.primary_button_corner_radius,
                fontSize: customStyles.fontSize || '16px',
                fontWeight: customStyles.fontWeight || 'normal',
                padding: `${customStyles.paddingTop || '10px'} ${customStyles.paddingRight || '20px'} ${customStyles.paddingBottom || '10px'} ${customStyles.paddingLeft || '20px'}`,
            };
        }

        // Ajustar ancho según layout
        const layout = customStyles.layout || 'fit';
        if (layout === 'fill') {
            styles.width = '100%';
            // Para botones de ancho completo, el texto se alinea según textAlign
            styles.textAlign = customStyles.textAlign || 'center';
        }

        // Aplicar estilos de hover
        if (isHovered) {
            if (buttonType === 'custom' && customStyles.hoverBackgroundColor) {
                styles.backgroundColor = customStyles.hoverBackgroundColor;
                styles.borderColor = customStyles.hoverBorderColor || customStyles.hoverBackgroundColor;
                styles.color = customStyles.hoverColor || styles.color;
            } else if (buttonType === 'primary') {
                const themeButtonStyles = getButtonStyles(themeWithDefaults, 'primary');
                const hoverBg = themeButtonStyles['--hover-bg'] || customStyles.hoverBackgroundColor;
                const hoverBorder = themeButtonStyles['--hover-border'] || hoverBg;
                const hoverColor = themeButtonStyles['--hover-color'] || styles.color;
                
                styles.backgroundColor = hoverBg;
                styles.borderColor = hoverBorder;
                styles.color = hoverColor;
            } else if (buttonType === 'secondary') {
                const themeButtonStyles = getButtonStyles(themeWithDefaults, 'secondary');
                const hoverBg = themeButtonStyles['--hover-bg'] || customStyles.hoverBackgroundColor;
                const hoverBorder = themeButtonStyles['--hover-border'] || hoverBg;
                const hoverColor = themeButtonStyles['--hover-color'] || styles.color;
                
                styles.backgroundColor = hoverBg;
                styles.borderColor = hoverBorder;
                styles.color = hoverColor;
            } else {
                // Efecto hover genérico usando valores del tema
                styles.backgroundColor = hslToCss(themeWithDefaults.primary_button_hover_background);
                styles.borderColor = hslToCss(themeWithDefaults.primary_button_hover_border);
                styles.color = hslToCss(themeWithDefaults.primary_button_hover_text);
            }
        }

        return styles;
    };

    // ===========================================
    // 5. MANEJAR CLIC
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
// 6. OBTENER TEXTO DEL BOTÓN
// ===========================================
const getButtonText = () => {
    // Prioridad 1: Texto específico para botón en estilos
    if (comp.styles?.buttonText && comp.styles.buttonText.trim() !== '') {
        return String(comp.styles.buttonText);
    }
    
    // Prioridad 2: Contenido directo del componente
    const content = comp.content;
    
    // Si es una URL, devolver texto descriptivo según tipo
    if (isUrl && typeof content === 'string') {
        if (content.includes('detalles-del-producto')) {
            return 'Ver Producto';
        } else if (content.startsWith('/')) {
            return 'Ir a Página';
        } else if (content.startsWith('http')) {
            return 'Visitar Enlace';
        }
    }
    
    // Si el contenido existe y no es una URL, usarlo
    if (content && typeof content === 'string' && content.trim() !== '') {
        // Verificar que no sea una URL
        if (!content.startsWith('/') && !content.startsWith('http')) {
            return content;
        }
    }
    
    // Si es un objeto con texto
    if (content && typeof content === 'object') {
        if (content.text && String(content.text).trim() !== '') {
            return String(content.text);
        }
        if (content.content && String(content.content).trim() !== '') {
            return String(content.content);
        }
    }
    
    // Texto por defecto
    return 'Botón';
};

    // ===========================================
    // 7. OBTENER ESTILOS Y TEXTO
    // ===========================================
    const buttonStyles = getButtonStylesCustom();
    const buttonText = getButtonText();
    const customStyles = comp.styles || {};
    const layout = customStyles.layout || 'fit';
    const align = customStyles.align || 'start';

    // ===========================================
// 8. FUNCIÓN PARA CREAR EL ELEMENTO DEL BOTÓN
// ===========================================
const createButtonElement = () => {
    const buttonTextValue = getButtonText();
    
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
                {buttonTextValue}
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
                    {buttonTextValue}
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
                    {buttonTextValue}
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
            {buttonTextValue}
        </button>
    );
};

    // ===========================================
    // 9. LÓGICA DE RENDERIZADO CON POSICIÓN
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