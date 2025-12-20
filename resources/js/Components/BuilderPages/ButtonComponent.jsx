// components/Builder/components/ButtonComponent.jsx
import React, { useState, useEffect } from 'react';

const ButtonComponent = ({ comp, getStyles, onEdit, isPreview, themeSettings }) => {
    const [localStyles, setLocalStyles] = useState({});
    const [isHovered, setIsHovered] = useState(false);
    const [buttonType, setButtonType] = useState('primary');

    // Función para obtener la familia de fuentes
    const getFontFamily = () => {
        const customStyles = comp.styles || {};
        const fontType = customStyles.fontType;
        
        // Si el usuario seleccionó "default" o no especificó nada
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
            // Estilos completamente personalizados
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
            // Usar estilos del tema (primary o secondary)
            const baseStyles = getStyles(comp);
            const themeStyles = {};
            
            if (type === 'primary') {
                // Estilos primarios del tema
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
                
                // Si hay sobrescrituras personalizadas, usarlas
                themeStyles.borderRadius = customStyles.customBorderRadius || themeSettings?.primary_button_corner_radius || '0.5rem';
                themeStyles.fontSize = customStyles.customFontSize || '16px';
            } else if (type === 'secondary') {
                // Estilos secundarios del tema
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
                
                // Si hay sobrescrituras personalizadas, usarlas
                themeStyles.borderRadius = customStyles.customBorderRadius || themeSettings?.secondary_button_corner_radius || '0.5rem';
                themeStyles.fontSize = customStyles.customFontSize || '16px';
            }
            
            // Padding y layout
            themeStyles.paddingTop = customStyles.paddingTop || '10px';
            themeStyles.paddingRight = customStyles.paddingRight || '10px';
            themeStyles.paddingBottom = customStyles.paddingBottom || '10px';
            themeStyles.paddingLeft = customStyles.paddingLeft || '10px';
            
            // Layout: fit o fill
            const layout = customStyles.layout || 'fit';
            themeStyles.width = layout === 'fill' ? '100%' : 'auto';
            
            // Fuente según configuración
            themeStyles.fontFamily = getFontFamily();
            themeStyles.cursor = 'pointer';
            themeStyles.transition = 'all 0.2s ease';
            
            // Combinar con estilos base del tema
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
            // Para botón custom, manejar hover si está configurado
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
        
        // Para primary y secondary, cambiar estilos en hover según tema
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

    // Manejar doble clic para editar
    const handleDoubleClick = () => {
        if (!isPreview && onEdit) {
            onEdit(comp);
        }
    };

    // EXTRAER EL TEXTO DEL CONTENIDO
    const getButtonText = () => {
        // Si hay una sobrescritura en estilos, usarla
        if (comp.styles?.contentOverride) {
            return comp.styles.contentOverride;
        }
        
        // Si no, usar el contenido
        if (!comp.content) return 'Botón';
        
        // Si content es una cadena, devolverla directamente
        if (typeof comp.content === 'string') {
            return comp.content;
        }
        
        // Si content es un objeto, extraer la propiedad 'text'
        if (typeof comp.content === 'object' && comp.content !== null) {
            return comp.content.text || comp.content.label || 'Botón';
        }
        
        // Si es otra cosa, convertir a cadena
        return String(comp.content);
    };

    const buttonContent = getButtonText();

    return (
        <button
            style={getButtonStyles()}
            onDoubleClick={handleDoubleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="focus:outline-none"
        >
            {buttonContent}
        </button>
    );
};

export default ButtonComponent;