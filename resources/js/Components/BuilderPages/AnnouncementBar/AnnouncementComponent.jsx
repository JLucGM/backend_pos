import React from 'react';
import { Link } from '@inertiajs/react';
import { getThemeWithDefaults, getComponentStyles, getResolvedFont } from '@/utils/themeUtils';

const AnnouncementComponent = ({
    comp,
    getStyles,
    onEdit,
    onDelete,
    themeSettings,
    appliedTheme,
    isPreview,
    mode = 'builder'
}) => {
    const customStyles = comp.styles || {};
    const announcementConfig = comp.content || {};
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);
    const themeAnnouncementStyles = getComponentStyles(themeWithDefaults, 'announcement-bar');

    // Obtener el texto del anuncio
    const getText = () => {
        if (typeof announcementConfig === 'string') {
            return announcementConfig;
        }
        return announcementConfig.text || 'Nuevo anuncio';
    };

    // Obtener la URL de navegación
    const getNavigationUrl = () => {
        if (typeof announcementConfig === 'object') {
            return announcementConfig.navigationUrl || '';
        }
        return '';
    };

    // Determinar si tiene navegación
    const hasNavigation = () => {
        const url = getNavigationUrl();
        return url && url.trim() !== '';
    };

    // Procesar URL para navegación
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

    // Obtener estilos del texto
    const getTextStyles = () => {
        const baseStyles = getStyles ? getStyles(comp) : {};

        // Helper para añadir unidad (px) si es solo número
        const withUnit = (value, unit = 'px') => {
            if (value === undefined || value === null || value === '') return undefined;
            // Si ya es string y tiene algun caracter no numerico (como px, %, rem), devolver tal cual
            if (typeof value === 'string' && isNaN(Number(value))) return value;
            return `${value}${unit}`;
        };

        const fontSize = customStyles.fontSize || themeAnnouncementStyles.fontSize || themeWithDefaults.paragraph_fontSize || '14px';
        const fontSizeUnit = customStyles.fontSizeUnit || (fontSize?.toString().includes('rem') ? 'rem' : 'px');

        return {
            ...baseStyles,
            fontFamily: getFontFamily(),
            fontSize: withUnit(fontSize, fontSizeUnit),
            fontWeight: customStyles.fontWeight || 'normal',
            color: customStyles.color || themeAnnouncementStyles.color || themeWithDefaults.text,
            textTransform: customStyles.textTransform || 'none',
            lineHeight: customStyles.lineHeight || '1.4',
            textDecoration: hasNavigation() ? 'underline' : 'none',
            cursor: hasNavigation() ? 'pointer' : 'default',
            transition: 'all 0.2s ease',
            backgroundColor: 'transparent',
            margin: 0,
            padding: 0,
        };
    };

    // Manejar clic
    const handleClick = (e) => {
        // En modo builder sin preview: editar componente
        if (mode === 'builder' && !isPreview) {
            e.preventDefault();
            e.stopPropagation();
            if (onEdit) {
                onEdit(comp);
            }
            return;
        }

        // Si no hay navegación, no hacer nada
        if (!hasNavigation()) {
            e.preventDefault();
            return;
        }
    };

    // Función para obtener la fuente usando utilidades del tema
    const getFontFamily = () => {
        const fontType = customStyles.fontType;

        // Si el usuario seleccionó "default" o no especificó nada
        if (fontType === 'default' || !fontType) {
            return getResolvedFont(themeWithDefaults, 'paragraph_font');
        }

        if (fontType === 'custom' && customStyles.customFont) {
            return customStyles.customFont;
        }

        return getResolvedFont(themeWithDefaults, fontType);
    };

    const textStyles = getTextStyles();
    const text = getText();
    const navigationUrl = getNavigationUrl();
    const processedUrl = processUrl(navigationUrl);

    // Si tiene navegación y estamos en frontend/preview
    if (hasNavigation() && (mode === 'frontend' || isPreview)) {
        // URL interna -> Link de Inertia
        if (processedUrl.startsWith('/')) {
            return (
                <Link
                    href={processedUrl}
                    style={textStyles}
                    onClick={handleClick}
                    className="announcement-link-inertia"
                >
                    {text}
                </Link>
            );
        }
        // URL externa -> <a> con target="_blank"
        else if (processedUrl.startsWith('http')) {
            return (
                <a
                    href={processedUrl}
                    style={textStyles}
                    onClick={handleClick}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="announcement-link-external"
                >
                    {text}
                </a>
            );
        }
    }

    // Caso por defecto: span sin navegación
    return (
        <span
            style={textStyles}
            onClick={handleClick}
            className="announcement-text"
        >
            {text}
        </span>
    );
};

export default AnnouncementComponent;
