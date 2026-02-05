import { useMemo } from 'react';
import {
    getThemeWithDefaults,
    getButtonStyles,
    getInputStyles,
    getTextStyles,
    getComponentStyles
} from '@/utils/themeUtils';

/**
 * Hook personalizado para usar temas de manera consistente en los componentes
 * @param {object} themeSettings - Configuraciones del tema actual
 * @param {object} appliedTheme - Tema aplicado desde la base de datos
 * @returns {object} - Objeto con utilidades y estilos del tema
 */
export const useTheme = (themeSettings = {}, appliedTheme = null) => {
    const theme = useMemo(() => getThemeWithDefaults(themeSettings, appliedTheme), [themeSettings, appliedTheme]);

    const colors = useMemo(() => ({
        background: theme.background,
        text: theme.text,
        heading: theme.heading,
        links: theme.links,
        hoverLinks: theme.hover_links,
        borders: theme.borders,
        shadows: theme.shadows || '#0000001a',

        // Botones
        primaryButton: {
            background: theme.primary_button_background,
            text: theme.primary_button_text,
            border: theme.primary_button_border,
            hoverBackground: theme.primary_button_hover_background,
            hoverText: theme.primary_button_hover_text,
            hoverBorder: theme.primary_button_hover_border,
        },

        secondaryButton: {
            background: theme.secondary_button_background,
            text: theme.secondary_button_text,
            border: theme.secondary_button_border,
            hoverBackground: theme.secondary_button_hover_background,
            hoverText: theme.secondary_button_hover_text,
            hoverBorder: theme.secondary_button_hover_border,
        },

        // Inputs
        input: {
            background: theme.input_background,
            text: theme.input_text,
            border: theme.input_border,
            hoverBackground: theme.input_hover_background,
            focusBackground: theme.input_focus_background,
            focusBorder: theme.input_focus_border,
        }
    }), [theme]);

    const fonts = useMemo(() => ({
        body: theme.body_font,
        heading: theme.heading_font,
        subheading: theme.subheading_font,
        accent: theme.accent_font,
    }), [theme]);

    const spacing = useMemo(() => ({
        // Banner
        banner: {
            height: theme.banner_containerHeight,
            paddingTop: theme.banner_paddingTop,
            paddingRight: theme.banner_paddingRight,
            paddingBottom: theme.banner_paddingBottom,
            paddingLeft: theme.banner_paddingLeft,
            innerPaddingTop: theme.banner_innerContainerPaddingTop,
            innerPaddingRight: theme.banner_innerContainerPaddingRight,
            innerPaddingBottom: theme.banner_innerContainerPaddingBottom,
            innerPaddingLeft: theme.banner_innerContainerPaddingLeft,
            innerBorderRadius: theme.banner_innerContainerBorderRadius,
        },

        // Carousel
        carousel: {
            gapX: theme.carousel_gapX,
            gapY: theme.carousel_gapY,
        },

        // Bento
        bento: {
            gap: theme.bento_gridGap,
            borderRadius: theme.bento_containerBorderRadius,
        },

        // Marquee
        marquee: {
            paddingTop: theme.marquee_paddingTop,
            paddingBottom: theme.marquee_paddingBottom,
        },

        // Divider
        divider: {
            paddingTop: theme.divider_paddingTop,
            paddingBottom: theme.divider_paddingBottom,
        }
    }), [theme]);

    // Funciones de utilidad
    const getButtonStyle = (type = 'primary') => getButtonStyles(theme, type);
    const getInputStyle = () => getInputStyles(theme);
    const getTextStyle = (textType = 'paragraph') => getTextStyles(theme, textType);
    const getComponentStyle = (componentType) => getComponentStyles(theme, componentType);

    // Estilos comunes pre-calculados
    const commonStyles = useMemo(() => ({
        container: {
            backgroundColor: colors.background,
            color: colors.text,
            fontFamily: fonts.body,
        },

        card: {
            backgroundColor: colors.background,
            border: `1px solid ${colors.borders}`,
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: `0 2px 4px ${colors.shadows}`,
        },

        button: {
            primary: {
                ...getButtonStyle('primary'),
                padding: '0.75rem 1.5rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
            },

            secondary: {
                ...getButtonStyle('secondary'),
                padding: '0.75rem 1.5rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
            }
        },

        input: {
            ...getInputStyle(),
            padding: '0.75rem',
            fontSize: '1rem',
            transition: 'all 0.2s ease',
        },

        heading: {
            h1: getTextStyle('heading1'),
            h2: getTextStyle('heading2'),
            h3: getTextStyle('heading3'),
            h4: getTextStyle('heading4'),
            h5: getTextStyle('heading5'),
            h6: getTextStyle('heading6'),
        },

        text: {
            paragraph: getTextStyle('paragraph'),
        }
    }), [colors, fonts, theme]);

    return {
        // Configuración completa del tema
        theme,

        // Colores organizados
        colors,

        // Fuentes
        fonts,

        // Espaciado
        spacing,

        // Funciones de utilidad
        getButtonStyle,
        getInputStyle,
        getTextStyle,
        getComponentStyle,

        // Estilos comunes
        styles: commonStyles,
    };
};

export default useTheme;