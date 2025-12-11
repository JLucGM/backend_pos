import React from 'react';

const BentoFeatureTitleComponent = ({
    comp,
    getStyles,
    themeSettings,
    isPreview,
    onEdit,
    onDelete,
    hoveredComponentId,
    setHoveredComponentId
}) => {
    const getTextStyles = () => {
        const baseStyles = getStyles(comp);
        const customStyles = comp.styles || {};

        // Determinar el estilo de texto seleccionado
        const textStyle = customStyles.textStyle || 'heading4'; // Por defecto heading4 para títulos de características

        // Función para obtener la fuente según el tipo seleccionado
        const getFontFamily = () => {
            const customStyles = comp.styles || {};
            const fontType = customStyles.fontType;

            // Si themeSettings no está disponible, usar valores por defecto SIN errores
            if (!themeSettings) {
                // Valores por defecto basados en tu themeSettings
                const defaultFonts = {
                    'body_font': "'Roboto', sans-serif",
                    'heading_font': "'Roboto', sans-serif",
                    'subheading_font': "'Open Sans', sans-serif",
                    'accent_font': "'Playfair Display', serif",
                    'default': "'Inter', sans-serif"
                };

                if (fontType === 'custom' && customStyles.customFont) {
                    return customStyles.customFont;
                }

                return defaultFonts[fontType] || defaultFonts.default;
            }

            // Si el usuario seleccionó "default" o no especificó nada
            if (fontType === 'default' || !fontType) {
                if (textStyle.startsWith('heading')) {
                    return themeSettings.heading_font || "'Inter', sans-serif";
                } else {
                    return themeSettings.body_font || "'Inter', sans-serif";
                }
            }

            if (fontType === 'custom' && customStyles.customFont) {
                return customStyles.customFont;
            }

            // Mapeo de fontType a las claves de themeSettings
            const fontTypeMapping = {
                'body_font': 'body_font',
                'heading_font': 'heading_font',
                'subheading_font': 'subheading_font',
                'accent_font': 'accent_font'
            };

            const themeKey = fontTypeMapping[fontType];
            if (themeKey && themeSettings[themeKey]) {
                return themeSettings[themeKey];
            }

            // Fallback final
            return "'Inter', sans-serif";
        };

        // Obtener configuración según el estilo seleccionado
        let fontSize, fontWeight, lineHeight, textTransform;
        
        if (textStyle.startsWith('heading')) {
            const level = textStyle.replace('heading', '');
            fontSize = customStyles.fontSize || themeSettings?.[`heading${level}_fontSize`] || `${3.5 - (level * 0.25)}rem`;
            fontWeight = customStyles.fontWeight || themeSettings?.[`heading${level}_fontWeight`] || '600';
            lineHeight = customStyles.lineHeight || themeSettings?.[`heading${level}_lineHeight`] || '1.3';
            textTransform = customStyles.textTransform || themeSettings?.[`heading${level}_textTransform`] || 'none';
        } else {
            // Si no es heading, asumimos paragraph
            fontSize = customStyles.fontSize || themeSettings?.paragraph_fontSize || '16px';
            fontWeight = customStyles.fontWeight || themeSettings?.paragraph_fontWeight || '600';
            lineHeight = customStyles.lineHeight || themeSettings?.paragraph_lineHeight || '1.6';
            textTransform = customStyles.textTransform || themeSettings?.paragraph_textTransform || 'none';
        }

        // Calcular line-height si es personalizado
        let finalLineHeight = lineHeight;
        if (lineHeight === 'tight') finalLineHeight = '1.2';
        if (lineHeight === 'normal') finalLineHeight = '1.4';
        if (lineHeight === 'loose') finalLineHeight = '1.6';
        if (customStyles.customLineHeight && lineHeight === 'custom') {
            finalLineHeight = customStyles.customLineHeight;
        }

        // Layout
        const layout = customStyles.layout || 'fit';
        const width = layout === 'fill' ? '100%' : 'auto';
        const alignment = customStyles.alignment || 'left';
        const textAlign = layout === 'fill' ? alignment : 'left';

        return {
            ...baseStyles,
            width,
            textAlign,
            margin: '0 0 12px 0',
            backgroundColor: customStyles.backgroundColor || 'transparent',
            borderRadius: customStyles.borderRadius || '0px',
            display: layout === 'fit' ? 'inline-block' : 'block',
            fontFamily: getFontFamily(),
            fontSize,
            fontWeight,
            lineHeight: finalLineHeight,
            textTransform,
            color: customStyles.color || '#1f2937',
        };
    };

    const handleClick = () => {
        if (!isPreview && onEdit) {
            onEdit(comp);
        }
    };

    const handleMouseEnter = () => {
        if (setHoveredComponentId && !isPreview) {
            setHoveredComponentId(comp.id);
        }
    };

    const handleMouseLeave = () => {
        if (setHoveredComponentId && !isPreview) {
            setHoveredComponentId(null);
        }
    };

    return (
        <h3 
            style={getTextStyles()}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={!isPreview ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        >
            {comp.content}
        </h3>
    );
};

export default BentoFeatureTitleComponent;