import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import cartHelper from '@/Helper/cartHelper';

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
    
    // ===========================================
    // 2. DETERMINAR SI ES UNA URL
    // ===========================================
    const isUrl = React.useMemo(() => {
        const url = comp.styles?.buttonUrl || comp.content;
        if (!url) return false;
        
        if (typeof url === 'string') {
            return url.startsWith('/') || url.startsWith('http');
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
    const getButtonStyles = () => {
        const baseStyles = getStyles ? getStyles(comp) : {};
        const customStyles = comp.styles || {};
        
        // Estilos base
        let styles = {
            ...baseStyles,
            fontFamily: themeSettings?.body_font || 'inherit',
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
                backgroundColor: customStyles.backgroundColor || '#007bff',
                color: customStyles.color || '#ffffff',
                borderColor: customStyles.borderColor || customStyles.backgroundColor || '#007bff',
                borderWidth: customStyles.borderWidth || '1px',
                borderStyle: customStyles.borderStyle || 'solid',
                borderRadius: customStyles.borderRadius || '4px',
                paddingTop: customStyles.paddingTop || '10px',
                paddingRight: customStyles.paddingRight || '10px',
                paddingBottom: customStyles.paddingBottom || '10px',
                paddingLeft: customStyles.paddingLeft || '10px',
                fontSize: customStyles.fontSize || '16px',
                textTransform: customStyles.textTransform || 'none',
                fontWeight: customStyles.fontWeight || 'normal',
            };
        }
        // ===== ESTILOS PARA TIPO "primary" =====
        else if (buttonType === 'primary') {
            // Usar estilos del tema si están disponibles
            const primaryBg = themeSettings?.primary_button_background 
                ? `hsl(${themeSettings.primary_button_background})` 
                : (customStyles.backgroundColor || '#007bff');
            
            const primaryColor = themeSettings?.primary_button_text 
                ? `hsl(${themeSettings.primary_button_text})` 
                : (customStyles.color || '#ffffff');
            
            styles = {
                ...styles,
                backgroundColor: primaryBg,
                color: primaryColor,
                borderColor: themeSettings?.primary_button_border 
                    ? `hsl(${themeSettings.primary_button_border})` 
                    : primaryBg,
                borderWidth: customStyles.borderWidth || themeSettings?.primary_button_border_thickness || '1px',
                borderStyle: 'solid',
                borderRadius: customStyles.borderRadius || themeSettings?.primary_button_corner_radius || '4px',
                fontSize: customStyles.fontSize || '16px',
                textTransform: customStyles.textTransform || themeSettings?.primary_button_text_case || 'none',
                fontWeight: customStyles.fontWeight || 'normal',
                paddingTop: customStyles.paddingTop || '10px',
                paddingRight: customStyles.paddingRight || '10px',
                paddingBottom: customStyles.paddingBottom || '10px',
                paddingLeft: customStyles.paddingLeft || '10px',
            };
        }
        // ===== ESTILOS PARA TIPO "secondary" =====
        else if (buttonType === 'secondary') {
            // Usar estilos del tema si están disponibles
            const secondaryBg = themeSettings?.secondary_button_background 
                ? `hsl(${themeSettings.secondary_button_background})` 
                : (customStyles.backgroundColor || '#6c757d');
            
            const secondaryColor = themeSettings?.secondary_button_text 
                ? `hsl(${themeSettings.secondary_button_text})` 
                : (customStyles.color || '#ffffff');
            
            styles = {
                ...styles,
                backgroundColor: secondaryBg,
                color: secondaryColor,
                borderColor: themeSettings?.secondary_button_border 
                    ? `hsl(${themeSettings.secondary_button_border})` 
                    : secondaryBg,
                borderWidth: customStyles.borderWidth || themeSettings?.secondary_button_border_thickness || '1px',
                borderStyle: 'solid',
                borderRadius: customStyles.borderRadius || themeSettings?.secondary_button_corner_radius || '4px',
                fontSize: customStyles.fontSize || '16px',
                textTransform: customStyles.textTransform || themeSettings?.secondary_button_text_case || 'none',
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
                backgroundColor: customStyles.backgroundColor || '#007bff',
                color: customStyles.color || '#ffffff',
                border: customStyles.borderWidth 
                    ? `${customStyles.borderWidth} solid ${customStyles.borderColor || '#007bff'}`
                    : '1px solid transparent',
                borderRadius: customStyles.borderRadius || '4px',
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
                const hoverBg = themeSettings?.primary_button_hover_background 
                    ? `hsl(${themeSettings.primary_button_hover_background})` 
                    : (customStyles.hoverBackgroundColor || '#0056b3');
                styles.backgroundColor = hoverBg;
                styles.borderColor = themeSettings?.primary_button_hover_border 
                    ? `hsl(${themeSettings.primary_button_hover_border})` 
                    : hoverBg;
            } else if (buttonType === 'secondary') {
                const hoverBg = themeSettings?.secondary_button_hover_background 
                    ? `hsl(${themeSettings.secondary_button_hover_background})` 
                    : (customStyles.hoverBackgroundColor || '#545b62');
                styles.backgroundColor = hoverBg;
                styles.borderColor = themeSettings?.secondary_button_hover_border 
                    ? `hsl(${themeSettings.secondary_button_hover_border})` 
                    : hoverBg;
            } else {
                // Efecto hover genérico
                styles.opacity = 0.9;
                styles.transform = 'translateY(-1px)';
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
        // Prioridad 1: Texto personalizado en estilos
        if (comp.styles?.contentOverride) {
            return comp.styles.contentOverride;
        }
        
        // Prioridad 2: Texto específico para botón
        if (comp.styles?.buttonText) {
            return comp.styles.buttonText;
        }
        
        const content = comp.content;
        if (!content) return 'Botón';
        
        // Si el contenido NO es una URL, usarlo como texto
        if (typeof content === 'string') {
            // Verificar si es una URL
            if (content.startsWith('/') || content.startsWith('http')) {
                // Es una URL, mostrar texto por defecto según tipo
                if (content.includes('detalles-del-producto')) {
                    return 'Ver Producto';
                } else if (content.startsWith('/')) {
                    return 'Ir a Página';
                } else if (content.startsWith('http')) {
                    return 'Visitar Enlace';
                }
            }
            // No es URL, usar como texto
            return content;
        }
        
        return String(content);
    };
    
    // ===========================================
    // 7. OBTENER ESTILOS Y TEXTO
    // ===========================================
    const buttonStyles = getButtonStyles();
    const buttonText = getButtonText();
    const customStyles = comp.styles || {};
    const layout = customStyles.layout || 'fit';
    const align = customStyles.align || 'start';
    
    // ===========================================
    // 8. FUNCIÓN PARA CREAR EL ELEMENTO DEL BOTÓN
    // ===========================================
    const createButtonElement = () => {
        // CASO 1: BOTÓN VACÍO EN MODO BUILDER → PLACEHOLDER EDITABLE
        if (mode === 'builder' && !isPreview && (!comp.content || !buttonText.trim())) {
            return (
                <div 
                    style={{
                        ...buttonStyles,
                        border: '2px dashed #f59e0b',
                        backgroundColor: '#fffbeb',
                        color: '#92400e',
                        textAlign: 'center',
                        cursor: 'pointer',
                        padding: '20px',
                        minWidth: '100px',
                    }}
                    onClick={handleClick}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="button-placeholder"
                >
                    <strong>Botón</strong><br/>
                    <small>Haz clic para configurar</small>
                </div>
            );
        }
        
        // CASO 2: MODO FRONTEND o PREVIEW con URL INTERNA → LINK DE INERTIA
        if ((mode === 'frontend' || isPreview) && isUrl && processedUrl.startsWith('/')) {
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
        
        // CASO 3: MODO FRONTEND o PREVIEW con URL EXTERNA → <a> CON TARGET="_blank"
        if ((mode === 'frontend' || isPreview) && isUrl && processedUrl.startsWith('http')) {
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
        
        // CASO 4: MODO BUILDER (edición) con URL → ENLACE EDITABLE
        if (mode === 'builder' && !isPreview && isUrl) {
            return (
                <a
                    href="#"
                    style={{
                        ...buttonStyles,
                        border: '2px dashed #4CAF50',
                    }}
                    onClick={handleClick}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="button-editable-link"
                >
                    {buttonText} <small style={{ fontSize: '12px', opacity: 0.7 }}>{buttonUrl ? `(${buttonUrl})` : ''}</small>
                </a>
            );
        }
        
        // CASO 5: BOTÓN NORMAL (sin URL) → <button>
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