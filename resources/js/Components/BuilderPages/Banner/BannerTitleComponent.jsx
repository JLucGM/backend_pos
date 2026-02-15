import React from 'react';
import { getThemeWithDefaults, getTextStyles, getResolvedFont, resolveStyleValue } from '@/utils/themeUtils';

const BannerTitleComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    onDelete,
    themeSettings,
    appliedTheme
}) => {
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    const getComponentStyles = () => {
        const baseStyles = getStyles(comp);
        const customStyles = comp.styles || {};

        // Resolver valores que pueden ser referencias
        const resolvedCustomStyles = {};
        Object.keys(customStyles).forEach(key => {
            resolvedCustomStyles[key] = resolveValue(customStyles[key]);
        });

        const textStyle = resolvedCustomStyles.textStyle || 'heading1';

        const getFontFamily = () => {
            const fontType = resolvedCustomStyles.fontType;
            if (fontType === 'default' || !fontType) {
                if (textStyle.startsWith('heading')) {
                    return getResolvedFont(themeWithDefaults, 'heading_font');
                } else {
                    return getResolvedFont(themeWithDefaults, 'body_font');
                }
            }
            if (fontType === 'custom' && resolvedCustomStyles.customFont) {
                return resolvedCustomStyles.customFont;
            }
            switch (fontType) {
                case 'body_font':
                    return getResolvedFont(themeWithDefaults, 'body_font');
                case 'heading_font':
                    return getResolvedFont(themeWithDefaults, 'heading_font');
                case 'subheading_font':
                    return getResolvedFont(themeWithDefaults, 'subheading_font');
                case 'accent_font':
                    return getResolvedFont(themeWithDefaults, 'accent_font');
                default:
                    return getResolvedFont(themeWithDefaults, 'body_font');
            }
        };

        let fontSize, fontWeight, lineHeight, textTransform, color;

        if (textStyle.startsWith('heading')) {
            const themeTextStyles = getTextStyles(themeWithDefaults, textStyle);
            fontSize = resolvedCustomStyles.fontSize || themeTextStyles.fontSize;
            fontWeight = resolvedCustomStyles.fontWeight || themeTextStyles.fontWeight;
            lineHeight = resolvedCustomStyles.lineHeight || themeTextStyles.lineHeight;
            textTransform = resolvedCustomStyles.textTransform || themeTextStyles.textTransform;
            color = resolvedCustomStyles.color || themeTextStyles.color;
        } else {
            const themeTextStyles = getTextStyles(themeWithDefaults, 'paragraph');
            fontSize = resolvedCustomStyles.fontSize || themeTextStyles.fontSize;
            fontWeight = resolvedCustomStyles.fontWeight || themeTextStyles.fontWeight;
            lineHeight = resolvedCustomStyles.lineHeight || themeTextStyles.lineHeight;
            textTransform = resolvedCustomStyles.textTransform || themeTextStyles.textTransform;
            color = resolvedCustomStyles.color || themeTextStyles.color;
        }

        let finalLineHeight = lineHeight;
        if (lineHeight === 'tight') finalLineHeight = '1.2';
        if (lineHeight === 'normal') finalLineHeight = '1.4';
        if (lineHeight === 'loose') finalLineHeight = '1.6';
        if (resolvedCustomStyles.customLineHeight && lineHeight === 'custom') {
            finalLineHeight = resolvedCustomStyles.customLineHeight;
        }

        const paddingTop = resolvedCustomStyles.paddingTop || '10px';
        const paddingRight = resolvedCustomStyles.paddingRight || '10px';
        const paddingBottom = resolvedCustomStyles.paddingBottom || '10px';
        const paddingLeft = resolvedCustomStyles.paddingLeft || '10px';

        const layout = resolvedCustomStyles.layout || 'fit';
        const width = layout === 'fill' ? '100%' : 'auto';
        const alignment = resolvedCustomStyles.alignment || 'center';
        const textAlign = layout === 'fill' ? alignment : 'center';

        const background = resolvedCustomStyles.background || 'transparent';
        const backgroundOpacity = resolvedCustomStyles.backgroundOpacity || '1';
        let backgroundColor = 'transparent';
        if (background !== 'transparent') {
            const rgb = hexToRgb(background);
            backgroundColor = `rgba(${rgb}, ${backgroundOpacity})`;
        }

        const withUnit = (value, unit = 'px') => {
            if (value === undefined || value === null || value === '') return undefined;
            if (typeof value === 'string' && isNaN(Number(value))) return value;
            return `${value}${unit}`;
        };

        return {
            ...baseStyles,
            width,
            textAlign,
            paddingTop: withUnit(paddingTop),
            paddingRight: withUnit(paddingRight),
            paddingBottom: withUnit(paddingBottom),
            paddingLeft: withUnit(paddingLeft),
            backgroundColor,
            borderRadius: withUnit(resolvedCustomStyles.borderRadius) || '0px',
            display: layout === 'fit' ? 'inline-block' : 'block',
            fontFamily: getFontFamily(),
            fontSize: withUnit(fontSize, resolvedCustomStyles.fontSizeUnit || (fontSize?.toString().includes('rem') ? 'rem' : 'px')),
            fontWeight,
            lineHeight: finalLineHeight,
            textTransform,
            color,
        };
    };

    function hexToRgb(hex) {
        const longHex = hex.length === 4 ?
            `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex;
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(longHex);
        return result ?
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
            : '0, 0, 0';
    }
console.log(getComponentStyles());
    return (
        <div style={getComponentStyles()}>
            {comp.content}
        </div>
    );
};

export default BannerTitleComponent;