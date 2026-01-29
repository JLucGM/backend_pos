/**
 * Utilidades para aplicar configuraciones de tema a componentes
 */

/**
 * Obtiene los valores por defecto del tema basados en el ThemeSeeder
 * @returns {object} - Configuraciones por defecto del tema
 */
export const getDefaultThemeSettings = () => ({
    // Colores generales
    background: '0 0% 100%',
    heading: '0 0% 3.9%',
    text: '0 0% 3.9%',
    links: '209 100% 50%',
    hover_links: '209 100% 40%',
    borders: '0 0% 96.1%',
    shadows: '0 0% 0% 0.1',

    // Primary Button
    primary_button_background: '209 100% 92%',
    primary_button_text: '0 0% 3.9%',
    primary_button_border: '209 100% 92%',
    primary_button_border_thickness: '1px',
    primary_button_corner_radius: '0.5rem',
    primary_button_text_case: 'default',
    primary_button_hover_background: '209 100% 84%',
    primary_button_hover_text: '0 0% 3.9%',
    primary_button_hover_border: '209 100% 84%',

    // Secondary Button
    secondary_button_background: '0 0% 96.1%',
    secondary_button_text: '0 0% 3.9%',
    secondary_button_border: '0 0% 96.1%',
    secondary_button_border_thickness: '1px',
    secondary_button_corner_radius: '0.5rem',
    secondary_button_text_case: 'default',
    secondary_button_hover_background: '0 0% 84.1%',
    secondary_button_hover_text: '0 0% 3.9%',
    secondary_button_hover_border: '0 0% 84.1%',

    // Inputs
    input_background: '0 0% 100%',
    input_text: '0 0% 3.9%',
    input_border: '0 0% 96.1%',
    input_border_thickness: '1px',
    input_corner_radius: '0.375rem',
    input_hover_background: '0 0% 100%',
    input_focus_background: '0 0% 100%',
    input_focus_border: '209 100% 92%',

    // Tipografía
    body_font: "'Inter', sans-serif",
    heading_font: "'Inter', sans-serif",
    subheading_font: "'Inter', sans-serif",
    accent_font: "'Inter', sans-serif",

    // Párrafo
    paragraph_font: 'body_font',
    paragraph_fontSize: '16px',
    paragraph_fontWeight: 'normal',
    paragraph_lineHeight: '1.6',
    paragraph_textTransform: 'none',

    // Headings
    heading1_font: 'heading_font',
    heading1_fontSize: '2.5rem',
    heading1_fontWeight: 'bold',
    heading1_lineHeight: '1.2',
    heading1_textTransform: 'none',

    heading2_font: 'heading_font',
    heading2_fontSize: '2rem',
    heading2_fontWeight: 'bold',
    heading2_lineHeight: '1.3',
    heading2_textTransform: 'none',

    heading3_font: 'heading_font',
    heading3_fontSize: '1.75rem',
    heading3_fontWeight: 'bold',
    heading3_lineHeight: '1.3',
    heading3_textTransform: 'none',

    heading4_font: 'heading_font',
    heading4_fontSize: '1.5rem',
    heading4_fontWeight: 'bold',
    heading4_lineHeight: '1.4',
    heading4_textTransform: 'none',

    heading5_font: 'heading_font',
    heading5_fontSize: '1.25rem',
    heading5_fontWeight: 'bold',
    heading5_lineHeight: '1.4',
    heading5_textTransform: 'none',

    heading6_font: 'heading_font',
    heading6_fontSize: '1rem',
    heading6_fontWeight: 'bold',
    heading6_lineHeight: '1.5',
    heading6_textTransform: 'none',

    // Componentes específicos
    carousel_backgroundColor: '#ffffff',
    carousel_gapX: '10px',
    carousel_gapY: '10px',

    banner_containerHeight: '400px',
    banner_paddingTop: '20px',
    banner_paddingRight: '20px',
    banner_paddingBottom: '20px',
    banner_paddingLeft: '20px',
    banner_backgroundColor: 'transparent',
    banner_innerContainerBackgroundColor: 'transparent',
    banner_innerContainerBackgroundOpacity: '1',
    banner_innerContainerPaddingTop: '20px',
    banner_innerContainerPaddingRight: '20px',
    banner_innerContainerPaddingBottom: '20px',
    banner_innerContainerPaddingLeft: '20px',
    banner_innerContainerBorderRadius: '0px',

    bento_backgroundColor: '#ffffff',
    bento_containerBorderRadius: '0px',
    bento_gridGap: '20px',

    container_backgroundColor: 'transparent',
    container_borderRadius: '0px',
    container_gap: '0px',

    marquee_paddingTop: '10px',
    marquee_paddingBottom: '10px',
    marquee_fontSize: '16px',
    marquee_fontWeight: 'normal',
    marquee_color: '#000000',
    marquee_backgroundColor: 'transparent',
    marquee_borderRadius: '0px',

    divider_paddingTop: '20px',
    divider_paddingBottom: '20px',
    divider_lineWidth: '1px',
    divider_lineLength: '100%',
    divider_lineColor: '#000000',
    divider_opacity: '1',
});

/**
 * Combina los valores por defecto del tema con los valores actuales
 * @param {object} themeSettings - Configuraciones actuales del tema
 * @returns {object} - Configuraciones combinadas con valores por defecto
 */
export const getThemeWithDefaults = (themeSettings = {}) => {
    const defaults = getDefaultThemeSettings();
    return { ...defaults, ...themeSettings };
};

/**
 * Convierte un valor HSL a CSS
 * @param {string} hslValue - Valor HSL como "209 100% 92%"
 * @returns {string} - Valor CSS como "hsl(209 100% 92%)"
 */
export const hslToCss = (hslValue) => {
    if (!hslValue) return '';
    return `hsl(${hslValue})`;
};

/**
 * Obtiene el valor de fuente resuelto basado en la configuración del tema
 * @param {object} themeSettings - Configuraciones del tema
 * @param {string} fontKey - Clave de la fuente (ej: 'paragraph_font', 'heading1_font')
 * @returns {string} - Valor de fuente CSS
 */
export const getResolvedFont = (themeSettings, fontKey) => {
    const settings = getThemeWithDefaults(themeSettings);
    const fontValue = settings[fontKey];
    
    if (!fontValue || fontValue === 'body_font') {
        return settings.body_font || "'Inter', sans-serif";
    }
    
    if (fontValue === 'heading_font') {
        return settings.heading_font || "'Inter', sans-serif";
    }
    
    if (fontValue === 'subheading_font') {
        return settings.subheading_font || "'Inter', sans-serif";
    }
    
    if (fontValue === 'accent_font') {
        return settings.accent_font || "'Inter', sans-serif";
    }
    
    if (fontValue === 'custom') {
        return settings[`${fontKey}_custom`] || "'Inter', sans-serif";
    }
    
    return fontValue;
};

/**
 * Genera estilos CSS para botones basados en la configuración del tema
 * @param {object} themeSettings - Configuraciones del tema
 * @param {string} buttonType - Tipo de botón ('primary' o 'secondary')
 * @returns {object} - Objeto con estilos CSS
 */
export const getButtonStyles = (themeSettings, buttonType = 'primary') => {
    const settings = getThemeWithDefaults(themeSettings);
    const prefix = buttonType === 'primary' ? 'primary_button' : 'secondary_button';
    
    return {
        backgroundColor: hslToCss(settings[`${prefix}_background`]),
        color: hslToCss(settings[`${prefix}_text`]),
        borderColor: hslToCss(settings[`${prefix}_border`]),
        borderWidth: settings[`${prefix}_border_thickness`] || '1px',
        borderRadius: settings[`${prefix}_corner_radius`] || '0.5rem',
        textTransform: settings[`${prefix}_text_case`] === 'default' ? 'none' : settings[`${prefix}_text_case`],
        borderStyle: 'solid',
        
        // Estados hover
        '--hover-bg': hslToCss(settings[`${prefix}_hover_background`]),
        '--hover-color': hslToCss(settings[`${prefix}_hover_text`]),
        '--hover-border': hslToCss(settings[`${prefix}_hover_border`]),
    };
};

/**
 * Genera estilos CSS para inputs basados en la configuración del tema
 * @param {object} themeSettings - Configuraciones del tema
 * @returns {object} - Objeto con estilos CSS
 */
export const getInputStyles = (themeSettings) => {
    const settings = getThemeWithDefaults(themeSettings);
    
    return {
        backgroundColor: hslToCss(settings.input_background),
        color: hslToCss(settings.input_text),
        borderColor: hslToCss(settings.input_border),
        borderWidth: settings.input_border_thickness || '1px',
        borderRadius: settings.input_corner_radius || '0.375rem',
        borderStyle: 'solid',
        
        // Estados hover y focus
        '--hover-bg': hslToCss(settings.input_hover_background),
        '--focus-bg': hslToCss(settings.input_focus_background),
        '--focus-border': hslToCss(settings.input_focus_border),
    };
};

/**
 * Genera estilos CSS para texto basados en la configuración del tema
 * @param {object} themeSettings - Configuraciones del tema
 * @param {string} textType - Tipo de texto ('paragraph', 'heading1', 'heading2', etc.)
 * @returns {object} - Objeto con estilos CSS
 */
export const getTextStyles = (themeSettings, textType = 'paragraph') => {
    const settings = getThemeWithDefaults(themeSettings);
    
    if (textType === 'paragraph') {
        return {
            fontFamily: getResolvedFont(settings, 'paragraph_font'),
            fontSize: settings.paragraph_fontSize || '16px',
            fontWeight: settings.paragraph_fontWeight || 'normal',
            lineHeight: settings.paragraph_lineHeight || '1.6',
            textTransform: settings.paragraph_textTransform === 'none' ? 'none' : settings.paragraph_textTransform,
            color: hslToCss(settings.text),
        };
    }
    
    // Para headings (h1, h2, h3, etc.)
    if (textType.startsWith('heading')) {
        const level = textType.replace('heading', '');
        const defaultSize = `${3.5 - (parseInt(level) * 0.25)}rem`;
        const defaultLineHeight = parseInt(level) <= 2 ? '1.2' : '1.4';
        
        return {
            fontFamily: getResolvedFont(settings, `heading${level}_font`),
            fontSize: settings[`heading${level}_fontSize`] || defaultSize,
            fontWeight: settings[`heading${level}_fontWeight`] || 'bold',
            lineHeight: settings[`heading${level}_lineHeight`] || defaultLineHeight,
            textTransform: settings[`heading${level}_textTransform`] === 'none' ? 'none' : settings[`heading${level}_textTransform`],
            color: hslToCss(settings.heading),
        };
    }
    
    return {};
};

/**
 * Genera estilos CSS generales basados en la configuración del tema
 * @param {object} themeSettings - Configuraciones del tema
 * @returns {object} - Objeto con estilos CSS generales
 */
export const getGeneralStyles = (themeSettings) => {
    const settings = getThemeWithDefaults(themeSettings);
    
    return {
        '--theme-background': hslToCss(settings.background),
        '--theme-heading': hslToCss(settings.heading),
        '--theme-text': hslToCss(settings.text),
        '--theme-links': hslToCss(settings.links),
        '--theme-hover-links': hslToCss(settings.hover_links),
        '--theme-borders': hslToCss(settings.borders),
        '--theme-shadows': settings.shadows ? `hsl(${settings.shadows})` : 'hsl(0 0% 0% / 0.1)',
        
        // Fuentes
        '--theme-body-font': settings.body_font || "'Inter', sans-serif",
        '--theme-heading-font': settings.heading_font || "'Inter', sans-serif",
        '--theme-subheading-font': settings.subheading_font || "'Inter', sans-serif",
        '--theme-accent-font': settings.accent_font || "'Inter', sans-serif",

        // Component-specific variables
        // Carousel
        '--carousel-bg': settings.carousel_backgroundColor || '#ffffff',
        '--carousel-gap-x': settings.carousel_gapX || '10px',
        '--carousel-gap-y': settings.carousel_gapY || '10px',

        // Banner
        '--banner-height': settings.banner_containerHeight || '400px',
        '--banner-bg': settings.banner_backgroundColor || 'transparent',
        '--banner-inner-bg': settings.banner_innerContainerBackgroundColor || 'transparent',
        '--banner-border-radius': settings.banner_innerContainerBorderRadius || '0px',

        // Bento
        '--bento-bg': settings.bento_backgroundColor || '#ffffff',
        '--bento-border-radius': settings.bento_containerBorderRadius || '0px',
        '--bento-gap': settings.bento_gridGap || '20px',

        // Container
        '--container-bg': settings.container_backgroundColor || 'transparent',
        '--container-border-radius': settings.container_borderRadius || '0px',
        '--container-gap': settings.container_gap || '0px',

        // Marquee
        '--marquee-color': settings.marquee_color || '#000000',
        '--marquee-bg': settings.marquee_backgroundColor || 'transparent',
        '--marquee-font-size': settings.marquee_fontSize || '16px',
        '--marquee-font-weight': settings.marquee_fontWeight || 'normal',

        // Divider
        '--divider-color': settings.divider_lineColor || '#000000',
        '--divider-width': settings.divider_lineWidth || '1px',
        '--divider-opacity': settings.divider_opacity || '1',

        // Image
        '--image-border-radius': settings.image_borderRadius || '0px',
        '--image-border-width': settings.image_borderWidth || '0px',
        '--image-border-color': settings.image_borderColor || '#e5e7eb',
        '--image-object-fit': settings.image_objectFit || 'cover',

        // Video
        '--video-border-radius': settings.video_borderRadius || '0px',
        '--video-border-width': settings.video_borderWidth || '0px',
        '--video-border-color': settings.video_borderColor || '#e5e7eb',

        // Product Detail
        '--product-title-color': settings.productDetail_titleColor || '#000000',
        '--product-title-size': settings.productDetail_titleSize || '32px',
        '--product-price-color': settings.productDetail_priceColor || '#666666',
        '--product-price-size': settings.productDetail_priceSize || '24px',
        '--product-description-color': settings.productDetail_descriptionColor || '#000000',
        '--product-description-size': settings.productDetail_descriptionSize || '16px',

        // Cart
        '--cart-bg': settings.cart_backgroundColor || '#ffffff',
        '--cart-border-radius': settings.cart_borderRadius || '12px',
        '--cart-title-color': settings.cart_titleColor || '#000000',
        '--cart-title-size': settings.cart_titleSize || '24px',

        // Checkout
        '--checkout-bg': settings.checkout_backgroundColor || '#ffffff',
        '--checkout-border-radius': settings.checkout_borderRadius || '12px',
        '--checkout-title-color': settings.checkout_titleColor || '#000000',
        '--checkout-total-color': settings.checkout_totalColor || '#1d4ed8',

        // Profile
        '--profile-bg': settings.profile_backgroundColor || '#ffffff',
        '--profile-title-color': settings.profile_titleColor || '#000000',
        '--profile-card-bg': settings.profile_cardBackgroundColor || '#ffffff',
        '--profile-card-border-radius': settings.profile_cardBorderRadius || '12px',

        // Auth
        '--auth-bg': settings.auth_backgroundColor || '#ffffff',
        '--auth-title-color': settings.auth_titleColor || '#000000',
        '--auth-subtitle-color': settings.auth_subtitleColor || '#666666',

        // Header
        '--header-bg': settings.header_backgroundColor || '#ffffff',
        '--header-logo-color': settings.header_logoColor || '#000000',
        '--header-menu-color': settings.header_menuColor || '#000000',

        // Footer
        '--footer-bg': settings.footer_backgroundColor || '#f8f9fa',
        '--footer-text-color': settings.footer_textColor || '#666666',
        '--footer-link-color': settings.footer_linkColor || '#666666',

        // Announcement Bar
        '--announcement-bg': settings.announcementBar_backgroundColor || '#000000',
        '--announcement-text-color': settings.announcementBar_textColor || '#ffffff',
        '--announcement-font-size': settings.announcementBar_fontSize || '14px',
    };
};

/**
 * Genera CSS completo como string para inyectar en el DOM
 * @param {object} themeSettings - Configuraciones del tema
 * @returns {string} - CSS como string
 */
export const generateThemeCSS = (themeSettings) => {
    const generalStyles = getGeneralStyles(themeSettings);
    const primaryButtonStyles = getButtonStyles(themeSettings, 'primary');
    const secondaryButtonStyles = getButtonStyles(themeSettings, 'secondary');
    const inputStyles = getInputStyles(themeSettings);
    
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
            const styles = getTextStyles(themeSettings, `heading${level}`);
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
            background-color: var(--carousel-bg);
            gap: var(--carousel-gap-x) var(--carousel-gap-y);
        }
        
        /* Banner */
        .banner-container {
            height: var(--banner-height);
            background-color: var(--banner-bg);
        }
        
        .banner-inner {
            background-color: var(--banner-inner-bg);
            border-radius: var(--banner-border-radius);
        }
        
        /* Bento */
        .bento-container {
            background-color: var(--bento-bg);
            border-radius: var(--bento-border-radius);
            gap: var(--bento-gap);
        }
        
        /* Container */
        .container-component {
            background-color: var(--container-bg);
            border-radius: var(--container-border-radius);
            gap: var(--container-gap);
        }
        
        /* Marquee */
        .marquee-text {
            color: var(--marquee-color);
            background-color: var(--marquee-bg);
            font-size: var(--marquee-font-size);
            font-weight: var(--marquee-font-weight);
        }
        
        /* Divider */
        .divider-line {
            border-color: var(--divider-color);
            border-width: var(--divider-width);
            opacity: var(--divider-opacity);
        }
        
        /* Image */
        .image-component {
            border-radius: var(--image-border-radius);
            border-width: var(--image-border-width);
            border-color: var(--image-border-color);
            object-fit: var(--image-object-fit);
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
 * @returns {object} - Objeto con estilos CSS
 */
export const getComponentStyles = (themeSettings, componentType) => {
    const settings = getThemeWithDefaults(themeSettings);
    
    switch (componentType) {
        case 'carousel':
            return {
                backgroundColor: settings.carousel_backgroundColor || '#ffffff',
                gap: `${settings.carousel_gapY || '10px'} ${settings.carousel_gapX || '10px'}`,
            };
            
        case 'banner':
            return {
                height: settings.banner_containerHeight || '400px',
                backgroundColor: settings.banner_backgroundColor || 'transparent',
                paddingTop: settings.banner_paddingTop || '20px',
                paddingRight: settings.banner_paddingRight || '20px',
                paddingBottom: settings.banner_paddingBottom || '20px',
                paddingLeft: settings.banner_paddingLeft || '20px',
            };
            
        case 'banner-inner':
            return {
                backgroundColor: settings.banner_innerContainerBackgroundColor || 'transparent',
                opacity: settings.banner_innerContainerBackgroundOpacity || '1',
                borderRadius: settings.banner_innerContainerBorderRadius || '0px',
                paddingTop: settings.banner_innerContainerPaddingTop || '20px',
                paddingRight: settings.banner_innerContainerPaddingRight || '20px',
                paddingBottom: settings.banner_innerContainerPaddingBottom || '20px',
                paddingLeft: settings.banner_innerContainerPaddingLeft || '20px',
            };
            
        case 'bento':
            return {
                backgroundColor: settings.bento_backgroundColor || '#ffffff',
                borderRadius: settings.bento_containerBorderRadius || '0px',
                gap: settings.bento_gridGap || '20px',
            };
            
        case 'container':
            return {
                backgroundColor: settings.container_backgroundColor || 'transparent',
                borderRadius: settings.container_borderRadius || '0px',
                gap: settings.container_gap || '0px',
            };
            
        case 'marquee':
            return {
                color: settings.marquee_color || '#000000',
                backgroundColor: settings.marquee_backgroundColor || 'transparent',
                fontSize: settings.marquee_fontSize || '16px',
                fontWeight: settings.marquee_fontWeight || 'normal',
                paddingTop: settings.marquee_paddingTop || '10px',
                paddingBottom: settings.marquee_paddingBottom || '10px',
                borderRadius: settings.marquee_borderRadius || '0px',
            };
            
        case 'divider':
            return {
                borderColor: settings.divider_lineColor || '#000000',
                borderWidth: settings.divider_lineWidth || '1px',
                width: settings.divider_lineLength || '100%',
                opacity: settings.divider_opacity || '1',
                marginTop: settings.divider_paddingTop || '20px',
                marginBottom: settings.divider_paddingBottom || '20px',
            };
            
        case 'image':
            return {
                borderRadius: settings.image_borderRadius || '0px',
                borderWidth: settings.image_borderWidth || '0px',
                borderStyle: settings.image_borderStyle || 'solid',
                borderColor: settings.image_borderColor || '#e5e7eb',
                objectFit: settings.image_objectFit || 'cover',
            };
            
        case 'video':
            return {
                borderRadius: settings.video_borderRadius || '0px',
                borderWidth: settings.video_borderWidth || '0px',
                borderColor: settings.video_borderColor || '#e5e7eb',
            };
            
        case 'product-title':
            return {
                color: settings.productDetail_titleColor || '#000000',
                fontSize: settings.productDetail_titleSize || '32px',
            };
            
        case 'product-price':
            return {
                color: settings.productDetail_priceColor || '#666666',
                fontSize: settings.productDetail_priceSize || '24px',
            };
            
        case 'product-description':
            return {
                color: settings.productDetail_descriptionColor || '#000000',
                fontSize: settings.productDetail_descriptionSize || '16px',
            };
            
        case 'cart':
            return {
                backgroundColor: settings.cart_backgroundColor || '#ffffff',
                borderRadius: settings.cart_borderRadius || '12px',
            };
            
        case 'cart-title':
            return {
                color: settings.cart_titleColor || '#000000',
                fontSize: settings.cart_titleSize || '24px',
            };
            
        case 'checkout':
            return {
                backgroundColor: settings.checkout_backgroundColor || '#ffffff',
                borderRadius: settings.checkout_borderRadius || '12px',
            };
            
        case 'checkout-title':
            return {
                color: settings.checkout_titleColor || '#000000',
                fontSize: settings.checkout_titleSize || '20px',
            };
            
        case 'checkout-total':
            return {
                color: settings.checkout_totalColor || '#1d4ed8',
                fontSize: settings.checkout_totalFontSize || '24px',
            };
            
        case 'profile':
            return {
                backgroundColor: settings.profile_backgroundColor || '#ffffff',
            };
            
        case 'profile-title':
            return {
                color: settings.profile_titleColor || '#000000',
                fontSize: settings.profile_titleSize || '32px',
                fontWeight: settings.profile_titleWeight || 'bold',
            };
            
        case 'profile-card':
            return {
                backgroundColor: settings.profile_cardBackgroundColor || '#ffffff',
                borderRadius: settings.profile_cardBorderRadius || '12px',
                border: settings.profile_cardBorder || '1px solid #e5e7eb',
                padding: settings.profile_cardPadding || '24px',
            };
            
        case 'auth':
            return {
                backgroundColor: settings.auth_backgroundColor || '#ffffff',
            };
            
        case 'auth-title':
            return {
                color: settings.auth_titleColor || '#000000',
                fontSize: settings.auth_titleSize || '28px',
            };
            
        case 'auth-subtitle':
            return {
                color: settings.auth_subtitleColor || '#666666',
                fontSize: settings.auth_subtitleSize || '16px',
            };
            
        case 'header':
            return {
                backgroundColor: settings.header_backgroundColor || '#ffffff',
                borderBottom: settings.header_borderBottom || '1px solid #e5e7eb',
            };
            
        case 'header-logo':
            return {
                color: settings.header_logoColor || '#000000',
                fontSize: settings.header_logoSize || '24px',
            };
            
        case 'header-menu':
            return {
                color: settings.header_menuColor || '#000000',
                fontSize: settings.header_menuSize || '16px',
            };
            
        case 'footer':
            return {
                backgroundColor: settings.footer_backgroundColor || '#f8f9fa',
            };
            
        case 'footer-text':
            return {
                color: settings.footer_textColor || '#666666',
            };
            
        case 'footer-link':
            return {
                color: settings.footer_linkColor || '#666666',
            };
            
        case 'announcement-bar':
            return {
                backgroundColor: settings.announcementBar_backgroundColor || '#000000',
                color: settings.announcementBar_textColor || '#ffffff',
                fontSize: settings.announcementBar_fontSize || '14px',
                paddingTop: settings.announcementBar_paddingTop || '15px',
                paddingBottom: settings.announcementBar_paddingBottom || '15px',
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
 * @returns {object} - Estilos CSS para aplicar
 */
export const useThemeStyles = (themeSettings, componentType, variant = 'primary') => {
    const settings = getThemeWithDefaults(themeSettings);
    
    switch (componentType) {
        case 'button':
            return getButtonStyles(settings, variant);
        case 'input':
            return getInputStyles(settings);
        case 'text':
            return getTextStyles(settings, variant);
        case 'component':
            return getComponentStyles(settings, variant);
        default:
            return getComponentStyles(settings, componentType);
    }
};

export default {
    hslToCss,
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