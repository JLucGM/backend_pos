// components/BuilderPages/HeaderLogoComponent.jsx
import React from 'react';
import { getThemeWithDefaults, getComponentStyles, getResolvedFont } from '@/utils/themeUtils';

const HeaderLogoComponent = ({
    comp,
    getStyles,
    onEdit,
    isPreview,
    themeSettings,
    companyLogo,
    appliedTheme
}) => {
    const styles = getStyles(comp);

    // Helper para añadir unidad (px) si es solo número
    const withUnit = (value, unit = 'px') => {
        if (value === undefined || value === null || value === '') return undefined;
        // Si ya es string y tiene algun caracter no numerico (como px, %, rem), devolver tal cual
        if (typeof value === 'string' && isNaN(Number(value))) return value;
        return `${value}${unit}`;
    };

    // Estilos específicos para el logo
    const logoStyles = {
        ...styles,
        paddingTop: withUnit(comp.styles?.paddingTop) || '0px',
        paddingRight: withUnit(comp.styles?.paddingRight) || '0px',
        paddingBottom: withUnit(comp.styles?.paddingBottom) || '0px',
        paddingLeft: withUnit(comp.styles?.paddingLeft) || '0px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: withUnit(styles?.height, comp.styles?.heightUnit) || 'auto',
        width: withUnit(styles?.width, comp.styles?.widthUnit) || 'auto',
        maxHeight: withUnit(styles?.maxHeight) || 'none',
        maxWidth: withUnit(styles?.maxWidth) || 'none',
        opacity: styles?.opacity ? `${styles.opacity}%` : '100%',
        borderWidth: withUnit(styles?.borderWidth) || '0px',
        borderStyle: styles?.borderStyle || 'solid',
        borderColor: styles?.borderColor || 'transparent',
        borderRadius: withUnit(styles?.borderRadius) || '0px',
    };

    // Determinar qué mostrar: logo de la compañía o contenido del componente
    const displayContent = () => {
        // Si hay logo de compañía disponible y no hay contenido personalizado
        const isDefaultContent = !comp.content || comp.content === 'Logo' || comp.content === '';

        if (companyLogo && isDefaultContent) {
            return (
                <img
                    src={companyLogo}
                    alt="Logo de la compañía"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: comp.styles?.objectFit || 'contain',
                        maxHeight: logoStyles.maxHeight || '100%',
                        maxWidth: logoStyles.maxWidth || '100%',
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
                        objectFit: comp.styles?.objectFit || 'contain',
                        maxHeight: logoStyles.maxHeight || '100%',
                        maxWidth: logoStyles.maxWidth || '100%',
                    }}
                />
            );
        }

        // Si el contenido es un objeto con propiedades de imagen
        if (comp.content && typeof comp.content === 'object' && comp.content.src) {
            return (
                <img
                    src={comp.content.src}
                    alt={comp.content.alt || 'Logo'}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: comp.styles?.objectFit || 'contain',
                        maxHeight: logoStyles.maxHeight || '100%',
                        maxWidth: logoStyles.maxWidth || '100%',
                    }}
                />
            );
        }

        // Si es texto simple
        return (
            <span style={{
                fontSize: comp.styles?.fontSize || '24px',
                fontWeight: comp.styles?.fontWeight || 'bold',
                color: comp.styles?.color || getThemeWithDefaults(themeSettings, appliedTheme.heading),
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
            {displayContent()}
        </div>
    );
};

export default HeaderLogoComponent;
