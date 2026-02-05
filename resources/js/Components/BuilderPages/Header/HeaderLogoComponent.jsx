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

    // Estilos específicos para el logo
    const logoStyles = {
        ...styles,
        paddingTop: comp.styles?.paddingTop || '0px',
        paddingRight: comp.styles?.paddingRight || '0px',
        paddingBottom: comp.styles?.paddingBottom || '0px',
        paddingLeft: comp.styles?.paddingLeft || '0px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: styles?.height || 'auto',
        width: styles?.width || 'auto',
        maxHeight: styles?.maxHeight || 'none',
        maxWidth: styles?.maxWidth || 'none',
        opacity: styles?.opacity ? `${styles.opacity}%` : '100%',
        borderWidth: styles?.borderWidth || '0px',
        borderStyle: styles?.borderStyle || 'solid',
        borderColor: styles?.borderColor || 'transparent',
        borderRadius: styles?.borderRadius || '0px',
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
