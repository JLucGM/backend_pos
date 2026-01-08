// components/Builder/components/ButtonComponent.jsx - VERSIÓN COMPLETA
import React, { useState, useEffect } from 'react';
import cartHelper from '@/Helper/cartHelper';

const ButtonComponent = ({ 
    comp, 
    getStyles, 
    onEdit, 
    isPreview, 
    themeSettings,
    product,
    selectedCombination,
    quantity = 1,
    companyId,
    storeAutomaticDiscounts = []
}) => {
    const [localStyles, setLocalStyles] = useState({});
    const [isHovered, setIsHovered] = useState(false);
    const [buttonType, setButtonType] = useState('primary');

    // Función para obtener la familia de fuentes
    const getFontFamily = () => {
        const customStyles = comp.styles || {};
        const fontType = customStyles.fontType;
        
        if (fontType === 'default' || !fontType) {
            return themeSettings?.body_font || "'Inter', sans-serif";
        }
        
        if (fontType === 'custom' && customStyles.customFont) {
            return customStyles.customFont;
        }
        
        switch(fontType) {
            case 'body_font':
                return themeSettings?.body_font || "'Inter', sans-serif";
            case 'heading_font':
                return themeSettings?.heading_font || "'Inter', sans-serif";
            case 'subheading_font':
                return themeSettings?.subheading_font || "'Inter', sans-serif";
            case 'accent_font':
                return themeSettings?.accent_font || "'Inter', sans-serif";
            default:
                return themeSettings?.body_font || "'Inter', sans-serif";
        }
    };

    // Inicializar el tipo de botón y estilos
    useEffect(() => {
        const customStyles = comp.styles || {};
        
        // Determinar el tipo de botón (primary, secondary, o custom)
        const type = customStyles.buttonType || 'primary';
        setButtonType(type);
        
        if (type === 'custom') {
            const layout = customStyles.layout || 'fit';
            const width = layout === 'fill' ? '100%' : 'auto';
            
            setLocalStyles({
                width,
                backgroundColor: customStyles.backgroundColor || '#007bff',
                color: customStyles.color || '#ffffff',
                borderColor: customStyles.borderColor || customStyles.backgroundColor || '#007bff',
                borderWidth: customStyles.borderWidth || '1px',
                borderRadius: customStyles.borderRadius || '4px',
                paddingTop: customStyles.paddingTop || '10px',
                paddingRight: customStyles.paddingRight || '10px',
                paddingBottom: customStyles.paddingBottom || '10px',
                paddingLeft: customStyles.paddingLeft || '10px',
                fontSize: customStyles.fontSize || '16px',
                textTransform: customStyles.textTransform || 'none',
                fontFamily: getFontFamily(),
                cursor: 'pointer',
                transition: 'all 0.2s ease',
            });
        } else {
            const baseStyles = getStyles(comp);
            const themeStyles = {};
            
            if (type === 'primary') {
                themeStyles.backgroundColor = themeSettings?.primary_button_background 
                    ? `hsl(${themeSettings.primary_button_background})` 
                    : '#e1f0fe';
                themeStyles.color = themeSettings?.primary_button_text 
                    ? `hsl(${themeSettings.primary_button_text})` 
                    : '#0a0a0a';
                themeStyles.borderColor = themeSettings?.primary_button_border 
                    ? `hsl(${themeSettings.primary_button_border})` 
                    : '#e1f0fe';
                themeStyles.borderWidth = themeSettings?.primary_button_border_thickness || '1px';
                themeStyles.textTransform = themeSettings?.primary_button_text_case || 'none';
                
                themeStyles.borderRadius = customStyles.customBorderRadius || themeSettings?.primary_button_corner_radius || '0.5rem';
                themeStyles.fontSize = customStyles.customFontSize || '16px';
            } else if (type === 'secondary') {
                themeStyles.backgroundColor = themeSettings?.secondary_button_background 
                    ? `hsl(${themeSettings.secondary_button_background})` 
                    : '#f5f5f5';
                themeStyles.color = themeSettings?.secondary_button_text 
                    ? `hsl(${themeSettings.secondary_button_text})` 
                    : '#0a0a0a';
                themeStyles.borderColor = themeSettings?.secondary_button_border 
                    ? `hsl(${themeSettings.secondary_button_border})` 
                    : '#f5f5f5';
                themeStyles.borderWidth = themeSettings?.secondary_button_border_thickness || '1px';
                themeStyles.textTransform = themeSettings?.secondary_button_text_case || 'none';
                
                themeStyles.borderRadius = customStyles.customBorderRadius || themeSettings?.secondary_button_corner_radius || '0.5rem';
                themeStyles.fontSize = customStyles.customFontSize || '16px';
            }
            
            themeStyles.paddingTop = customStyles.paddingTop || '10px';
            themeStyles.paddingRight = customStyles.paddingRight || '10px';
            themeStyles.paddingBottom = customStyles.paddingBottom || '10px';
            themeStyles.paddingLeft = customStyles.paddingLeft || '10px';
            
            const layout = customStyles.layout || 'fit';
            themeStyles.width = layout === 'fill' ? '100%' : 'auto';
            
            themeStyles.fontFamily = getFontFamily();
            themeStyles.cursor = 'pointer';
            themeStyles.transition = 'all 0.2s ease';
            
            setLocalStyles({
                ...baseStyles,
                ...themeStyles,
            });
        }
    }, [comp.styles, themeSettings, getStyles]);

    // Función para obtener estilos según hover state
    const getButtonStyles = () => {
        const baseStyles = localStyles;
        
        if (buttonType === 'custom') {
            if (isHovered && comp.styles?.hoverBackgroundColor) {
                return {
                    ...baseStyles,
                    backgroundColor: comp.styles.hoverBackgroundColor,
                    borderColor: comp.styles.hoverBorderColor || comp.styles.hoverBackgroundColor,
                    color: comp.styles.hoverColor || baseStyles.color,
                };
            }
            return baseStyles;
        }
        
        if (isHovered) {
            if (buttonType === 'primary') {
                return {
                    ...baseStyles,
                    backgroundColor: themeSettings?.primary_button_hover_background 
                        ? `hsl(${themeSettings.primary_button_hover_background})` 
                        : '#b3d7ff',
                    color: themeSettings?.primary_button_hover_text 
                        ? `hsl(${themeSettings.primary_button_hover_text})` 
                        : '#0a0a0a',
                    borderColor: themeSettings?.primary_button_hover_border 
                        ? `hsl(${themeSettings.primary_button_hover_border})` 
                        : '#b3d7ff',
                    borderWidth: themeSettings?.primary_button_hover_border_thickness || '1px',
                };
            } else if (buttonType === 'secondary') {
                return {
                    ...baseStyles,
                    backgroundColor: themeSettings?.secondary_button_hover_background 
                        ? `hsl(${themeSettings.secondary_button_hover_background})` 
                        : '#d6d6d6',
                    color: themeSettings?.secondary_button_hover_text 
                        ? `hsl(${themeSettings.secondary_button_hover_text})` 
                        : '#0a0a0a',
                    borderColor: themeSettings?.secondary_button_hover_border 
                        ? `hsl(${themeSettings.secondary_button_hover_border})` 
                        : '#d6d6d6',
                    borderWidth: themeSettings?.secondary_button_hover_border_thickness || '1px',
                };
            }
        }
        
        return baseStyles;
    };

    // Manejar clic para agregar al carrito
    const handleClick = (e) => {
        e.stopPropagation();
        
        // Verificar si estamos en modo preview
        if (isPreview) {
            if (onEdit) {
                onEdit(comp);
            }
            return;
        }
        
        // Si tenemos producto y companyId, agregar al carrito
        if (product && companyId) {
            // Filtrar descuentos automáticos del producto (sin código)
            const productAutoDiscounts = product.discounts ? 
                product.discounts.filter(d => !d.code) : [];
            
            // Combinar descuentos del producto con descuentos de la tienda
            const allAutomaticDiscounts = [...productAutoDiscounts, ...storeAutomaticDiscounts];
            
            // Agregar al carrito con todos los descuentos automáticos
            cartHelper.addToCart(companyId, product, selectedCombination, quantity, allAutomaticDiscounts);
            
            // Mostrar notificación
            const discountInfo = productAutoDiscounts.length > 0 || storeAutomaticDiscounts.length > 0 ?
                " con descuento automático aplicado!" : "!";
            alert(`¡${product.product_name} agregado al carrito${discountInfo}`);
            
            // Disparar evento para actualizar el carrito en otros componentes
            window.dispatchEvent(new Event('cartUpdated'));
        } else {
            // Modo builder - editar componente
            if (onEdit) {
                onEdit(comp);
            }
        }
    };

    // EXTRAER EL TEXTO DEL CONTENIDO
    const getButtonText = () => {
        if (comp.styles?.contentOverride) {
            return comp.styles.contentOverride;
        }
        
        if (!comp.content) return 'Agregar al carrito';
        
        if (typeof comp.content === 'string') {
            return comp.content;
        }
        
        if (typeof comp.content === 'object' && comp.content !== null) {
            return comp.content.text || comp.content.label || 'Agregar al carrito';
        }
        
        return String(comp.content);
    };

    const buttonContent = getButtonText();

    return (
        <button
            style={getButtonStyles()}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="focus:outline-none"
        >
            {buttonContent}
        </button>
    );
};

export default ButtonComponent;