import React from 'react';
import { getThemeWithDefaults, resolveStyleValue } from '@/utils/themeUtils';

const HeaderLogoComponent = ({
    comp,
    getStyles,
    onEdit,
    isPreview,
    themeSettings,
    companyLogo,
    appliedTheme
}) => {
    // Obtener tema combinado con valores por defecto
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // Función para resolver estilos (referencias "theme.xxx")
    const resolveStyles = (styles) => {
        if (!styles) return {};
        const resolved = {};
        Object.keys(styles).forEach(key => {
            resolved[key] = resolveStyleValue(styles[key], themeWithDefaults, appliedTheme);
        });
        return resolved;
    };

    // Obtener estilos base del componente y resolverlos
    const baseStyles = getStyles ? getStyles(comp) : (comp.styles || {});
    const styles = resolveStyles(baseStyles);

    // Helper para añadir unidad (px) si es solo número
    const withUnit = (value, unit = 'px') => {
        if (value === undefined || value === null || value === '') return undefined;
        if (typeof value === 'string' && isNaN(Number(value))) return value;
        return `${value}${unit}`;
    };

    // Estilos específicos para el logo
    const logoStyles = {
        ...styles,
        paddingTop: withUnit(styles.paddingTop) || '0px',
        paddingRight: withUnit(styles.paddingRight) || '0px',
        paddingBottom: withUnit(styles.paddingBottom) || '0px',
        paddingLeft: withUnit(styles.paddingLeft) || '0px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: withUnit(styles.height) || 'auto',
        width: withUnit(styles.width) || 'auto',
        maxHeight: withUnit(styles.maxHeight) || 'none',
        maxWidth: withUnit(styles.maxWidth) || 'none',
        opacity: styles.opacity ? `${styles.opacity}%` : '100%',
        borderWidth: withUnit(styles.borderWidth) || '0px',
        borderStyle: styles.borderStyle || 'solid',
        borderColor: styles.borderColor || 'transparent',
        borderRadius: withUnit(styles.borderRadius) || '0px',
    };

    // Determinar qué mostrar: logo de la compañía o contenido personalizado
    const renderContent = () => {
        // Si hay logo de compañía y el contenido es el predeterminado ("Logo")
        const isDefaultContent = !comp.content || comp.content === 'Logo' || comp.content === '';

        if (companyLogo && isDefaultContent) {
            return (
                <img
                    src={companyLogo}
                    alt="Logo de la compañía"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: styles.objectFit || 'contain',
                        maxHeight: logoStyles.maxHeight,
                        maxWidth: logoStyles.maxWidth,
                    }}
                />
            );
        }

        // Si el contenido es una URL de imagen
        if (comp.content && typeof comp.content === 'string' &&
            (comp.content.startsWith('http') || comp.content.startsWith('/'))) {
            return (
                <img
                    src={comp.content}
                    alt="Logo personalizado"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: styles.objectFit || 'contain',
                        maxHeight: logoStyles.maxHeight,
                        maxWidth: logoStyles.maxWidth,
                    }}
                />
            );
        }

        // Si el contenido es un objeto con src
        if (comp.content && typeof comp.content === 'object' && comp.content.src) {
            return (
                <img
                    src={comp.content.src}
                    alt={comp.content.alt || 'Logo'}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: styles.objectFit || 'contain',
                        maxHeight: logoStyles.maxHeight,
                        maxWidth: logoStyles.maxWidth,
                    }}
                />
            );
        }

        // Texto simple
        return (
            <span style={{
                fontSize: styles.fontSize || '24px',
                fontWeight: styles.fontWeight || 'bold',
                color: styles.color || themeWithDefaults.heading,
            }}>
                {comp.content || 'Logo'}
            </span>
        );
    };

    return (
        <div
            style={logoStyles}
            onDoubleClick={isPreview ? undefined : () => onEdit(comp)}
            className={isPreview ? '' : 'hover:opacity-80 cursor-pointer'}
        >
            {renderContent()}
        </div>
    );
};

export default HeaderLogoComponent;