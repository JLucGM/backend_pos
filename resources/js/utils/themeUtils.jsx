/**
 * Utilidades para aplicar configuraciones de tema a componentes
 */

/**
 * Obtiene los valores por defecto del tema como fallback absoluto
 * Solo se usa cuando no hay tema asignado o hay error
 * @returns {object} - Configuraciones por defecto mínimas
 */
export const getFallbackThemeSettings = () => ({
    "background": "#121212",
    "heading": "#fafafa",
    "text": "#e6e6e6",
    "links": "#66b3ff",
    "hover_links": "#b3d9ff",
    "borders": "#333333",
    "shadows": "#00000080",
    "primary_button_background": "#004d99",
    "primary_button_text": "#fafafa",
    "primary_button_border": "#004d99",
    "primary_button_border_thickness": "2px",
    "primary_button_corner_radius": "0.5rem",
    "primary_button_text_case": "uppercase",
    "primary_button_hover_background": "#0066cc",
    "primary_button_hover_text": "#fafafa",
    "primary_button_hover_border": "#0066cc",
    "primary_button_hover_border_thickness": "2px",
    "primary_button_focus_background": "#0080ff",
    "primary_button_focus_text": "#fafafa",
    "primary_button_focus_border": "#0080ff",
    "primary_button_focus_border_thickness": "3px",
    "secondary_button_background": "#333333",
    "secondary_button_text": "#fafafa",
    "secondary_button_border": "#4d4d4d",
    "secondary_button_border_thickness": "2px",
    "secondary_button_corner_radius": "0.5rem",
    "secondary_button_text_case": "uppercase",
    "secondary_button_hover_background": "#4d4d4d",
    "secondary_button_hover_text": "#fafafa",
    "secondary_button_hover_border": "#666666",
    "secondary_button_hover_border_thickness": "2px",
    "secondary_button_focus_background": "#666666",
    "secondary_button_focus_text": "#fafafa",
    "secondary_button_focus_border": "#808080",
    "secondary_button_focus_border_thickness": "3px",
    "input_background": "#1a1a1a",
    "input_text": "#e6e6e6",
    "input_border": "#404040",
    "input_border_thickness": "1px",
    "input_corner_radius": "0.375rem",
    "input_hover_background": "#1f1f1f",
    "input_focus_background": "#262626",
    "input_focus_border": "#0080ff",
    "body_font": "'Segoe UI', 'Roboto', sans-serif",
    "heading_font": "'Segoe UI', 'Roboto', sans-serif",
    "subheading_font": "'Segoe UI', 'Roboto', sans-serif",
    "accent_font": "'Consolas', monospace",
    "paragraph_font": "body_font",
    "paragraph_fontSize": "16px",
    "paragraph_fontWeight": "normal",
    "paragraph_lineHeight": "1.7",
    "paragraph_textTransform": "none",
    "heading1_font": "heading_font",
    "heading1_fontSize": "2.75rem",
    "heading1_fontWeight": "bold",
    "heading1_lineHeight": "1.1",
    "heading1_textTransform": "uppercase",
    "heading2_font": "heading_font",
    "heading2_fontSize": "2.25rem",
    "heading2_fontWeight": "bold",
    "heading2_lineHeight": "1.2",
    "heading2_textTransform": "uppercase",
    "heading3_font": "heading_font",
    "heading3_fontSize": "1.875rem",
    "heading3_fontWeight": "bold",
    "heading3_lineHeight": "1.3",
    "heading3_textTransform": "none",
    "heading4_font": "heading_font",
    "heading4_fontSize": "1.625rem",
    "heading4_fontWeight": "bold",
    "heading4_lineHeight": "1.4",
    "heading4_textTransform": "none",
    "heading5_font": "heading_font",
    "heading5_fontSize": "1.375rem",
    "heading5_fontWeight": "bold",
    "heading5_lineHeight": "1.4",
    "heading5_textTransform": "none",
    "heading6_font": "heading_font",
    "heading6_fontSize": "1.125rem",
    "heading6_fontWeight": "bold",
    "heading6_lineHeight": "1.5",
    "heading6_textTransform": "none",
    "primary_color": "#004d99",
    "foreground": "#fafafa",
    "secondary_color": "#333333",
    "font_family": "'Segoe UI', system-ui, sans-serif",
    "heading_font_family": "'Segoe UI', system-ui, sans-serif",
    "button_font_family": "'Segoe UI', system-ui, sans-serif",
    "input_font_family": "'Segoe UI', system-ui, sans-serif",
    "carousel_backgroundColor": "#1a1a1a",
    "carousel_gapX": "10px",
    "carousel_gapY": "10px",
    "banner_containerHeight": "400px",
    "banner_paddingTop": "20px",
    "banner_paddingRight": "20px",
    "banner_paddingBottom": "20px",
    "banner_paddingLeft": "20px",
    "banner_backgroundColor": "transparent",
    "banner_innerContainerBackgroundColor": "transparent",
    "banner_innerContainerBackgroundOpacity": "1",
    "banner_innerContainerPaddingTop": "20px",
    "banner_innerContainerPaddingRight": "20px",
    "banner_innerContainerPaddingBottom": "20px",
    "banner_innerContainerPaddingLeft": "20px",
    "banner_innerContainerBorderRadius": "0px",
    "bento_backgroundColor": "#1a1a1a",
    "bento_containerBorderRadius": "0px",
    "bento_gridGap": "20px",
    "container_backgroundColor": "transparent",
    "container_borderRadius": "0px",
    "container_gap": "0px",
    "marquee_paddingTop": "10px",
    "marquee_paddingBottom": "10px",
    "marquee_fontSize": "16px",
    "marquee_fontWeight": "normal",
    "marquee_color": "#e6e6e6",
    "marquee_backgroundColor": "transparent",
    "marquee_borderRadius": "0px",
    "divider_paddingTop": "20px",
    "divider_paddingBottom": "20px",
    "divider_lineWidth": "1px",
    "divider_lineLength": "100%",
    "divider_lineColor": "#333333",
    "divider_opacity": "1"
});

/**
 * Obtiene los valores por defecto del tema desde la base de datos
 * @param {object} appliedTheme - Tema aplicado desde la base de datos
 * @returns {object} - Configuraciones por defecto del tema
 */
export const getDefaultThemeSettings = (appliedTheme = null) => {
    // Si no hay tema aplicado, usar fallback
    if (!appliedTheme || !appliedTheme.settings) {
        return getFallbackThemeSettings();
    }

    // Usar las configuraciones del tema de la base de datos
    return appliedTheme.settings;
};

/**
 * Combina los valores por defecto del tema con los valores actuales
 * @param {object} themeSettings - Configuraciones actuales del tema (personalizaciones de la página)
 * @param {object} appliedTheme - Tema aplicado desde la base de datos
 * @returns {object} - Configuraciones combinadas con valores por defecto
 */
export const getThemeWithDefaults = (themeSettings = {}, appliedTheme = null) => {
    // 1. Obtener valores por defecto del tema de la base de datos
    const defaults = getDefaultThemeSettings(appliedTheme);
    // 2. Combinar: defaults del tema + personalizaciones de la página
    const merged = { ...defaults, ...themeSettings };

    // Debug helper: Escribe 'window.DEBUG_THEME = true' en la consola del navegador para ver esto
    if (typeof window !== 'undefined' && window.DEBUG_THEME) {
        console.groupCollapsed('🎨 Theme Debug: getThemeWithDefaults');
        console.log('Applied Theme (DB):', appliedTheme);
        console.log('Page Customizations:', themeSettings);
        console.log('⬇️ MERGED RESULT:', merged);
        console.groupEnd();
    }

    return merged;
};



/**
 * Obtiene el valor de fuente resuelto basado en la configuración del tema
 * @param {object} themeSettings - Configuraciones del tema
 * @param {string} fontKey - Clave de la fuente (ej: 'paragraph_font', 'heading1_font')
 * @param {object} appliedTheme - Tema aplicado desde la base de datos
 * @returns {string} - Valor de fuente CSS
 */
export const getResolvedFont = (themeSettings, fontKey, appliedTheme = null) => {
    const settings = getThemeWithDefaults(themeSettings, appliedTheme);
    const fontValue = settings[fontKey];

    if (!fontValue || fontValue === 'body_font') {
        return settings.body_font || "'Arial', 'Helvetica', sans-serif";
    }

    if (fontValue === 'heading_font') {
        return settings.heading_font || "'Arial', 'Helvetica', sans-serif";
    }

    if (fontValue === 'subheading_font') {
        return settings.subheading_font || "'Arial', 'Helvetica', sans-serif";
    }

    if (fontValue === 'accent_font') {
        return settings.accent_font || "'Georgia', 'Times New Roman', serif";
    }

    if (fontValue === 'custom') {
        return settings[`${fontKey}_custom`] || "'Arial', 'Helvetica', sans-serif";
    }

    return fontValue;
};

/**
 * Genera estilos CSS para botones basados en la configuración del tema
 * @param {object} themeSettings - Configuraciones del tema
 * @param {string} buttonType - Tipo de botón ('primary' o 'secondary')
 * @param {object} appliedTheme - Tema aplicado desde la base de datos
 * @returns {object} - Objeto con estilos CSS
 */
export const getButtonStyles = (themeSettings, buttonType = 'primary', appliedTheme = null) => {
    const settings = getThemeWithDefaults(themeSettings, appliedTheme);
    const prefix = buttonType === 'primary' ? 'primary_button' : 'secondary_button';

    return {
        backgroundColor: settings[`${prefix}_background`],
        color: settings[`${prefix}_text`],
        borderColor: settings[`${prefix}_border`],
        borderWidth: settings[`${prefix}_border_thickness`] || '1px',
        borderRadius: settings[`${prefix}_corner_radius`] || '0.5rem',
        textTransform: settings[`${prefix}_text_case`] === 'default' ? 'none' : settings[`${prefix}_text_case`],
        borderStyle: 'solid',

        // Estados hover
        '--hover-bg': settings[`${prefix}_hover_background`],
        '--hover-color': settings[`${prefix}_hover_text`],
        '--hover-border': settings[`${prefix}_hover_border`],
    };
};

/**
 * Genera estilos CSS para inputs basados en la configuración del tema
 * @param {object} themeSettings - Configuraciones del tema
 * @param {object} appliedTheme - Tema aplicado desde la base de datos
 * @returns {object} - Objeto con estilos CSS
 */
export const getInputStyles = (themeSettings, appliedTheme = null) => {
    const settings = getThemeWithDefaults(themeSettings, appliedTheme);

    return {
        backgroundColor: settings.input_background,
        color: settings.input_text,
        borderColor: settings.input_border,
        borderWidth: settings.input_border_thickness || '1px',
        borderRadius: settings.input_corner_radius || '0.375rem',
        borderStyle: 'solid',

        // Estados hover y focus
        '--hover-bg': settings.input_hover_background,
        '--focus-bg': settings.input_focus_background,
        '--focus-border': settings.input_focus_border,
    };
};

/**
 * Genera estilos CSS para texto basados en la configuración del tema
 * @param {object} themeSettings - Configuraciones del tema
 * @param {string} textType - Tipo de texto ('paragraph', 'heading1', 'heading2', etc.)
 * @param {object} appliedTheme - Tema aplicado desde la base de datos
 * @returns {object} - Objeto con estilos CSS
 */
export const getTextStyles = (themeSettings, textType = 'paragraph', appliedTheme = null) => {
    const settings = getThemeWithDefaults(themeSettings, appliedTheme);

    if (textType === 'paragraph') {
        return {
            fontFamily: getResolvedFont(settings, 'paragraph_font', appliedTheme),
            fontSize: settings.paragraph_fontSize || '16px',
            fontWeight: settings.paragraph_fontWeight || 'normal',
            lineHeight: settings.paragraph_lineHeight || '1.6',
            textTransform: settings.paragraph_textTransform === 'none' ? 'none' : settings.paragraph_textTransform,
            color: settings.text,
        };
    }

    // Para headings (h1, h2, h3, etc.)
    if (textType.startsWith('heading')) {
        const level = textType.replace('heading', '');
        const defaultSize = `${3.5 - (parseInt(level) * 0.25)}rem`;
        const defaultLineHeight = parseInt(level) <= 2 ? '1.2' : '1.4';

        return {
            fontFamily: getResolvedFont(settings, `heading${level}_font`, appliedTheme),
            fontSize: settings[`heading${level}_fontSize`] || defaultSize,
            fontWeight: settings[`heading${level}_fontWeight`] || 'bold',
            lineHeight: settings[`heading${level}_lineHeight`] || defaultLineHeight,
            textTransform: settings[`heading${level}_textTransform`] === 'none' ? 'none' : settings[`heading${level}_textTransform`],
            color: settings.heading,
        };
    }

    return {};
};

/**
 * Genera estilos CSS generales basados en la configuración del tema
 * @param {object} themeSettings - Configuraciones del tema
 * @param {object} appliedTheme - Tema aplicado desde la base de datos
 * @returns {object} - Objeto con estilos CSS generales
 */
export const getGeneralStyles = (themeSettings, appliedTheme = null) => {
    const settings = getThemeWithDefaults(themeSettings, appliedTheme);

    return {
        '--theme-background': settings.background,
        '--theme-heading': settings.heading,
        '--theme-text': settings.text,
        '--theme-links': settings.links,
        '--theme-hover-links': settings.hover_links,
        '--theme-borders': settings.borders,
        '--theme-shadows': settings.shadows || '0 0 0 0.1rem rgba(0,0,0,0.1)',

        // Fuentes
        '--theme-body-font': settings.body_font || "'Arial', 'Helvetica', sans-serif",
        '--theme-heading-font': settings.heading_font || "'Arial', 'Helvetica', sans-serif",
        '--theme-subheading-font': settings.subheading_font || "'Arial', 'Helvetica', sans-serif",
        '--theme-accent-font': settings.accent_font || "'Georgia', 'Times New Roman', serif",

        // Component-specific variables
        // Carousel
        '--carousel-gap-x': settings.carousel_gapX || '10px',
        '--carousel-gap-y': settings.carousel_gapY || '10px',

        // Banner
        '--banner-height': settings.banner_containerHeight || '400px',
        '--banner-border-radius': settings.banner_innerContainerBorderRadius || '0px',

        // Bento
        '--bento-border-radius': settings.bento_containerBorderRadius || '0px',
        '--bento-gap': settings.bento_gridGap || '20px',

        // Container
        '--container-border-radius': settings.container_borderRadius || '0px',
        '--container-gap': settings.container_gap || '0px',

        // Marquee
        '--marquee-font-size': settings.marquee_fontSize || '16px',
        '--marquee-font-weight': settings.marquee_fontWeight || 'normal',

        // Divider
        '--divider-width': settings.divider_lineWidth || '1px',
        '--divider-opacity': settings.divider_opacity || '1',


        // Video - No existe en seeder, usar valores clean
        '--video-border-radius': '0px',
        '--video-border-width': '0px',
        '--video-border-color': settings.borders,

        // Product Detail
        '--product-title-color': settings.heading,
        '--product-title-size': '32px',
        '--product-price-color': settings.heading,
        '--product-price-size': '24px',
        '--product-description-color': settings.text,
        '--product-description-size': '16px',

        // Cart
        '--cart-bg': settings.background,
        '--cart-border-radius': settings.input_corner_radius || '12px',
        '--cart-title-color': settings.heading,
        '--cart-title-size': '24px',

        // Checkout
        '--checkout-bg': settings.background,
        '--checkout-border-radius': settings.input_corner_radius || '12px',
        '--checkout-title-color': settings.heading,
        '--checkout-total-color': settings.primary_color,

        // Profile
        '--profile-bg': settings.background,
        '--profile-title-color': settings.heading,
        '--profile-card-bg': settings.background,
        '--profile-card-border-radius': settings.input_corner_radius || '12px',

        // Auth
        '--auth-bg': settings.background,
        '--auth-title-color': settings.heading,
        '--auth-subtitle-color': settings.text,

        // Header
        '--header-bg': settings.background,
        '--header-logo-color': settings.heading,
        '--header-menu-color': settings.heading,

        // Footer
        '--footer-bg': settings.secondary_button_background, // Usar fondo secundario para footer
        '--footer-text-color': settings.text,
        '--footer-link-color': settings.links,

        // Announcement Bar
        '--announcement-bg': settings.heading, // Usar heading color (usualmente oscuro) para contraste
        '--announcement-text-color': settings.background, // Usar fondo (usualmente claro) para contraste
        '--announcement-font-size': '14px',
    };
};

/**
 * Genera CSS completo como string para inyectar en el DOM
 * @param {object} themeSettings - Configuraciones del tema
 * @param {object} appliedTheme - Tema aplicado desde la base de datos
 * @returns {string} - CSS como string
 */
export const generateThemeCSS = (themeSettings, appliedTheme = null) => {
    const generalStyles = getGeneralStyles(themeSettings, appliedTheme);
    const primaryButtonStyles = getButtonStyles(themeSettings, 'primary', appliedTheme);
    const secondaryButtonStyles = getButtonStyles(themeSettings, 'secondary', appliedTheme);
    const inputStyles = getInputStyles(themeSettings, appliedTheme);

    return `
        :root {
            ${Object.entries(generalStyles).map(([key, value]) => `${key}: ${value};`).join('\n            ')}
        }
        
        /* Estilos de botones primarios */
        .btn-primary, .button-primary {
            background-color: ${primaryButtonStyles.backgroundColor};
            color: ${primaryButtonStyles.color};
            border-color: ${primaryButtonStyles.borderColor};
            border-width: ${primaryButtonStyles.borderWidth};
            border-radius: ${primaryButtonStyles.borderRadius};
            text-transform: ${primaryButtonStyles.textTransform};
            border-style: solid;
        }
        
        .btn-primary:hover, .button-primary:hover {
            background-color: ${primaryButtonStyles['--hover-bg']};
            color: ${primaryButtonStyles['--hover-color']};
            border-color: ${primaryButtonStyles['--hover-border']};
        }
        
        /* Estilos de botones secundarios */
        .btn-secondary, .button-secondary {
            background-color: ${secondaryButtonStyles.backgroundColor};
            color: ${secondaryButtonStyles.color};
            border-color: ${secondaryButtonStyles.borderColor};
            border-width: ${secondaryButtonStyles.borderWidth};
            border-radius: ${secondaryButtonStyles.borderRadius};
            text-transform: ${secondaryButtonStyles.textTransform};
            border-style: solid;
        }
        
        .btn-secondary:hover, .button-secondary:hover {
            background-color: ${secondaryButtonStyles['--hover-bg']};
            color: ${secondaryButtonStyles['--hover-color']};
            border-color: ${secondaryButtonStyles['--hover-border']};
        }
        
        /* Estilos de inputs */
        .input, .form-input, input[type="text"], input[type="email"], input[type="password"], textarea, select {
            background-color: ${inputStyles.backgroundColor};
            color: ${inputStyles.color};
            border-color: ${inputStyles.borderColor};
            border-width: ${inputStyles.borderWidth};
            border-radius: ${inputStyles.borderRadius};
            border-style: solid;
        }
        
        .input:hover, .form-input:hover, input:hover, textarea:hover, select:hover {
            background-color: ${inputStyles['--hover-bg']};
        }
        
        .input:focus, .form-input:focus, input:focus, textarea:focus, select:focus {
            background-color: ${inputStyles['--focus-bg']};
            border-color: ${inputStyles['--focus-border']};
        }
        
        /* Estilos de texto */
        body, p {
            font-family: var(--theme-body-font);
            color: var(--theme-text);
        }
        
        h1, h2, h3, h4, h5, h6 {
            color: var(--theme-heading);
        }
        
        ${[1, 2, 3, 4, 5, 6].map(level => {
        const styles = getTextStyles(themeSettings, `heading${level}`, appliedTheme);
        return `
        h${level} {
            font-family: ${styles.fontFamily};
            font-size: ${styles.fontSize};
            font-weight: ${styles.fontWeight};
            line-height: ${styles.lineHeight};
            text-transform: ${styles.textTransform};
        }`;
    }).join('')}
        
        a {
            color: var(--theme-links);
        }
        
        a:hover {
            color: var(--theme-hover-links);
        }
        
        /* Estilos de componentes específicos */
        
        /* Carousel */
        .carousel-container {
            gap: var(--carousel-gap-x) var(--carousel-gap-y);
        }
        
        /* Banner */
        .banner-container {
            height: var(--banner-height);
        }
        
        .banner-inner {
            border-radius: var(--banner-border-radius);
        }
        
        /* Bento */
        .bento-container {
            border-radius: var(--bento-border-radius);
            gap: var(--bento-gap);
        }
        
        /* Container */
        .container-component {
            border-radius: var(--container-border-radius);
            gap: var(--container-gap);
        }
        
        /* Marquee */
        .marquee-text {
            font-size: var(--marquee-font-size);
            font-weight: var(--marquee-font-weight);
        }
        
        /* Divider */
        .divider-line {
            border-width: var(--divider-width);
            opacity: var(--divider-opacity);
        }
        

        
        /* Video */
        .video-component {
            border-radius: var(--video-border-radius);
            border-width: var(--video-border-width);
            border-color: var(--video-border-color);
        }
        
        /* Product Detail */
        .product-title {
            color: var(--product-title-color);
            font-size: var(--product-title-size);
        }
        
        .product-price {
            color: var(--product-price-color);
            font-size: var(--product-price-size);
        }
        
        .product-description {
            color: var(--product-description-color);
            font-size: var(--product-description-size);
        }
        
        /* Cart */
        .cart-container {
            background-color: var(--cart-bg);
            border-radius: var(--cart-border-radius);
        }
        
        .cart-title {
            color: var(--cart-title-color);
            font-size: var(--cart-title-size);
        }
        
        /* Checkout */
        .checkout-container {
            background-color: var(--checkout-bg);
            border-radius: var(--checkout-border-radius);
        }
        
        .checkout-title {
            color: var(--checkout-title-color);
        }
        
        .checkout-total {
            color: var(--checkout-total-color);
        }
        
        /* Profile */
        .profile-container {
            background-color: var(--profile-bg);
        }
        
        .profile-title {
            color: var(--profile-title-color);
        }
        
        .profile-card {
            background-color: var(--profile-card-bg);
            border-radius: var(--profile-card-border-radius);
        }
        
        /* Auth */
        .auth-container {
            background-color: var(--auth-bg);
        }
        
        .auth-title {
            color: var(--auth-title-color);
        }
        
        .auth-subtitle {
            color: var(--auth-subtitle-color);
        }
        
        /* Header */
        .header-container {
            background-color: var(--header-bg);
        }
        
        .header-logo {
            color: var(--header-logo-color);
        }
        
        .header-menu {
            color: var(--header-menu-color);
        }
        
        /* Footer */
        .footer-container {
            background-color: var(--footer-bg);
        }
        
        .footer-text {
            color: var(--footer-text-color);
        }
        
        .footer-link {
            color: var(--footer-link-color);
        }
        
        /* Announcement Bar */
        .announcement-bar {
            background-color: var(--announcement-bg);
            color: var(--announcement-text-color);
            font-size: var(--announcement-font-size);
        }
    `;
};

/**
 * Genera estilos CSS para componentes específicos basados en la configuración del tema
 * @param {object} themeSettings - Configuraciones del tema
 * @param {string} componentType - Tipo de componente
 * @param {object} appliedTheme - Tema aplicado desde la base de datos
 * @returns {object} - Objeto con estilos CSS
 */
export const getComponentStyles = (themeSettings, componentType, appliedTheme = null) => {
    const settings = getThemeWithDefaults(themeSettings, appliedTheme);

    switch (componentType) {
        case 'carousel':
            return {
                backgroundColor: settings.carousel_backgroundColor || settings.background,
                gap: `${settings.carousel_gapY || '10px'} ${settings.carousel_gapX || '10px'}`,
            };

        case 'banner':
            return {
                height: settings.banner_containerHeight || '400px',
                backgroundColor: 'transparent',  // Banners son personalizables
                paddingTop: settings.banner_paddingTop || '20px',
                paddingRight: settings.banner_paddingRight || '20px',
                paddingBottom: settings.banner_paddingBottom || '20px',
                paddingLeft: settings.banner_paddingLeft || '20px',
            };

        case 'banner-inner':
            return {
                backgroundColor: 'transparent',  // Banners son personalizables
                opacity: settings.banner_innerContainerBackgroundOpacity || '1',
                borderRadius: settings.banner_innerContainerBorderRadius || '0px',
                paddingTop: settings.banner_innerContainerPaddingTop || '20px',
                paddingRight: settings.banner_innerContainerPaddingRight || '20px',
                paddingBottom: settings.banner_innerContainerPaddingBottom || '20px',
                paddingLeft: settings.banner_innerContainerPaddingLeft || '20px',
            };

        case 'bento':
            return {
                backgroundColor: settings.bento_backgroundColor ? settings.bento_backgroundColor : settings.background,
                borderRadius: settings.bento_containerBorderRadius || '0px',
                gap: settings.bento_gridGap || '20px',
            };

        case 'container':
            return {
                backgroundColor: 'transparent',  // Containers son personalizables
                borderRadius: settings.container_borderRadius || '0px',
                gap: settings.container_gap || '0px',
            };

        case 'marquee':
            return {
                color: settings.text,  // Hereda de global
                backgroundColor: settings.marquee_backgroundColor || 'transparent',
                fontSize: settings.marquee_fontSize || '16px',
                fontWeight: settings.marquee_fontWeight || 'normal',
                paddingTop: settings.marquee_paddingTop || '10px',
                paddingBottom: settings.marquee_paddingBottom || '10px',
                borderRadius: settings.marquee_borderRadius || '0px',
            };

        case 'divider':
            return {
                borderColor: settings.borders,  // Hereda de global
                borderWidth: settings.divider_lineWidth || '1px',
                width: settings.divider_lineLength || '100%',
                opacity: settings.divider_opacity || '1',
                marginTop: settings.divider_paddingTop || '20px',
                marginBottom: settings.divider_paddingBottom || '20px',
            };

        case 'video':
            return {
                borderRadius: '0px',
                borderWidth: '0px',
                borderColor: settings.borders,
            };

        case 'product-title':
            return {
                color: settings.heading,
                fontSize: '32px',
            };

        case 'product-price':
            return {
                color: settings.heading,
                fontSize: '24px',
            };

        case 'product-description':
            return {
                color: settings.text,
                fontSize: '16px',
            };

        case 'cart':
            return {
                backgroundColor: settings.background,
                borderRadius: settings.input_corner_radius || '12px',
            };

        case 'cart-title':
            return {
                color: settings.heading,
                fontSize: '24px',
            };

        case 'checkout':
            return {
                backgroundColor: settings.background,
                borderRadius: settings.input_corner_radius || '12px',
            };

        case 'checkout-title':
            return {
                color: settings.heading,
                fontSize: '20px',
            };

        case 'checkout-total':
            return {
                color: settings.primary_color,
                fontSize: '24px',
            };

        case 'profile':
            return {
                backgroundColor: settings.background,
            };

        case 'profile-title':
            return {
                color: settings.heading,
                fontSize: '32px',
                fontWeight: 'bold',
            };

        case 'profile-card':
            return {
                backgroundColor: settings.background,
                borderRadius: settings.input_corner_radius || '12px',
                border: `1px solid ${settings.borders}`,
                padding: '24px',
            };

        case 'auth':
            return {
                backgroundColor: settings.background,
            };

        case 'auth-title':
            return {
                color: settings.heading,
                fontSize: '28px',
            };

        case 'auth-subtitle':
            return {
                color: settings.text,
                fontSize: '16px',
            };

        case 'header':
            return {
                backgroundColor: settings.background,
                color: settings.heading,
            };

        case 'header-logo':
            return {
                color: settings.heading,
                fontSize: '24px',
                fontWeight: 'bold',
            };

        case 'header-menu':
            return {
                color: settings.heading,
                fontSize: '16px',
            };

        case 'footer':
            return {
                backgroundColor: settings.secondary_button_background,
                color: settings.text,
            };

        case 'footer-link':
            return {
                color: settings.links,
            };

        case 'announcement-bar':
            return {
                backgroundColor: settings.heading,
                color: settings.background,
                fontSize: '14px',
            };

        default:
            return {};
    }
};

/**
 * Hook personalizado para aplicar tema a un componente
 * @param {object} themeSettings - Configuraciones del tema
 * @param {string} componentType - Tipo de componente ('button', 'input', 'text', etc.)
 * @param {string} variant - Variante del componente ('primary', 'secondary', etc.)
 * @param {object} appliedTheme - Tema aplicado desde la base de datos
 * @returns {object} - Estilos CSS para aplicar
 */
export const useThemeStyles = (themeSettings, componentType, variant = 'primary', appliedTheme = null) => {
    const settings = getThemeWithDefaults(themeSettings, appliedTheme);

    switch (componentType) {
        case 'button':
            return getButtonStyles(settings, variant, appliedTheme);
        case 'input':
            return getInputStyles(settings, appliedTheme);
        case 'text':
            return getTextStyles(settings, variant, appliedTheme);
        case 'component':
            return getComponentStyles(settings, variant, appliedTheme);
        default:
            return getComponentStyles(settings, componentType, appliedTheme);
    }
};

export default {
    getDefaultThemeSettings,
    getThemeWithDefaults,
    getResolvedFont,
    getButtonStyles,
    getInputStyles,
    getTextStyles,
    getGeneralStyles,
    getComponentStyles,
    generateThemeCSS,
    useThemeStyles,
};