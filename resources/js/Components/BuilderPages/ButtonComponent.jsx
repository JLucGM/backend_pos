// components/Builder/components/ButtonComponent.jsx
import React, { useState, useEffect } from 'react';

const ButtonComponent = ({ comp, getStyles, onEdit, isPreview, themeSettings, appliedTheme }) => {
    const [localStyles, setLocalStyles] = useState({});
    const [isHovered, setIsHovered] = useState(false);
    const [buttonType, setButtonType] = useState('primary');

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
                // Añadir estilos base del tema si están disponibles
                fontFamily: themeSettings?.fontFamily || 'inherit',
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
            
            // Combinar con estilos base del tema
            setLocalStyles({
                ...baseStyles,
                ...themeStyles,
            });
        }
    }, [comp.styles, themeSettings, getStyles]);

    // Función para obtener estilos según hover state
    const getButtonStyles = () => {
        if (buttonType === 'custom') {
            return localStyles;
        }
        
        // Para primary y secondary, cambiar estilos en hover
        if (isHovered) {
            if (buttonType === 'primary') {
                return {
                    ...localStyles,
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
                    ...localStyles,
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
        
        return localStyles;
    };

    // Manejar doble clic para editar
    const handleDoubleClick = () => {
        if (!isPreview && onEdit) {
            onEdit(comp);
        }
    };

    // Contenido del botón (puede sobrescribirse)
    const buttonContent = comp.styles?.contentOverride || comp.content || 'Botón';

    return (
        <div className="relative">
            <button
                style={getButtonStyles()}
                onDoubleClick={handleDoubleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
                {buttonContent}
            </button>
            
            {/* Indicador visual del tipo de botón (solo en modo edición) */}
            {!isPreview && (
                <div className="absolute -top-6 left-0 text-xs flex items-center gap-1">
                    <span className={`px-1.5 py-0.5 rounded text-white ${buttonType === 'primary' ? 'bg-blue-500' : buttonType === 'secondary' ? 'bg-gray-500' : 'bg-purple-500'}`}>
                        {buttonType === 'primary' ? 'Primario' : buttonType === 'secondary' ? 'Secundario' : 'Personalizado'}
                    </span>
                </div>
            )}
        </div>
    );
};

export default ButtonComponent;