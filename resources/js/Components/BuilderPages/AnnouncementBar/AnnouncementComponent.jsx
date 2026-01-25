import React from 'react';
import { Link } from '@inertiajs/react';

const AnnouncementComponent = ({
    comp,
    getStyles,
    onEdit,
    onDelete,
    themeSettings,
    isPreview,
    mode = 'builder'
}) => {
    const customStyles = comp.styles || {};
    const announcementConfig = comp.content || {};

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

        // Función para obtener la fuente según el tipo seleccionado
        const getFontFamily = () => {
            const fontType = customStyles.fontType;

            if (fontType === 'custom' && customStyles.customFont) {
                return customStyles.customFont;
            }

            switch (fontType) {
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

        return {
            ...baseStyles,
            fontFamily: getFontFamily(),
            fontSize: customStyles.fontSize || '14px',
            fontWeight: customStyles.fontWeight || 'normal',
            color: customStyles.color || '#ffffff',
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