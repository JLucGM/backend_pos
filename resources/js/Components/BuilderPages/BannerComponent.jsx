// components/BuilderPages/components/BannerComponent.jsx
import React from 'react';
import BannerTitleComponent from './BannerTitleComponent';
import BannerTextComponent from './BannerTextComponent';

const BannerComponent = ({
    comp,
    getStyles,
    onEdit,
    onDelete,
    themeSettings,
    isPreview,
    setComponents,
    hoveredComponentId,
    setHoveredComponentId
}) => {
    const customStyles = comp.styles || {};
    const bannerConfig = comp.content || {};

    // Configuración del contenedor principal
    const containerHeight = bannerConfig.containerHeight || '400px';
    const containerWidth = bannerConfig.containerWidth || '100%';
    const marginTop = bannerConfig.marginTop || '0px';
    const marginRight = bannerConfig.marginRight || '0px';
    const marginBottom = bannerConfig.marginBottom || '0px';
    const marginLeft = bannerConfig.marginLeft || '0px';
    const paddingTop = bannerConfig.paddingTop || '20px';
    const paddingRight = bannerConfig.paddingRight || '20px';
    const paddingBottom = bannerConfig.paddingBottom || '20px';
    const paddingLeft = bannerConfig.paddingLeft || '20px';
    const backgroundColor = bannerConfig.backgroundColor || 'transparent';
    const backgroundImage = bannerConfig.backgroundImage || null;
    const backgroundVideo = bannerConfig.backgroundVideo || null;
    const backgroundSize = bannerConfig.backgroundSize || 'cover';
    const backgroundPosition = bannerConfig.backgroundPosition || 'center center';

    // Posición del contenido en el contenedor
    const containerVerticalPosition = bannerConfig.containerVerticalPosition || 'center';
    const containerHorizontalPosition = bannerConfig.containerHorizontalPosition || 'center';
    const contentDirection = bannerConfig.contentDirection || 'vertical';

    // Obtener los componentes hijos
    const children = bannerConfig.children || [];

    // Determinar la alineación vertical del contenedor
    const getVerticalAlignment = () => {
        switch (containerVerticalPosition) {
            case 'top': return 'flex-start';
            case 'bottom': return 'flex-end';
            case 'center': 
            default: return 'center';
        }
    };

    // Determinar la alineación horizontal del contenedor
    const getHorizontalAlignment = () => {
        switch (containerHorizontalPosition) {
            case 'left': return 'flex-start';
            case 'right': return 'flex-end';
            case 'center': 
            default: return 'center';
        }
    };

    // Estilos del contenedor principal
    const containerStyles = {
        ...getStyles(comp),
        height: containerHeight,
        width: containerWidth,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        backgroundColor: backgroundImage || backgroundVideo ? 'transparent' : backgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: backgroundSize,
        backgroundPosition: backgroundPosition,
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: getVerticalAlignment(),
        justifyContent: getHorizontalAlignment(),
    };

    // Estilos para la capa de contenido interno
    const contentStyles = {
        display: 'flex',
        flexDirection: contentDirection === 'horizontal' ? 'row' : 'column',
        gap: contentDirection === 'horizontal' ? '20px' : '10px',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '100%',
        zIndex: 2,
        position: 'relative',
    };

    // Manejo de eventos de mouse
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
        <div
            style={containerStyles}
            className="group relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Video de fondo */}
            {backgroundVideo && (
                <video
                    autoPlay
                    muted
                    loop
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 1,
                    }}
                >
                    <source src={backgroundVideo} type="video/mp4" />
                    Tu navegador no soporta videos HTML5.
                </video>
            )}

            {/* Capa de contenido interno con subcomponentes */}
            <div style={contentStyles}>
                {children.map((child) => {
                    switch (child.type) {
                        case 'bannerTitle':
                            return (
                                <BannerTitleComponent
                                    key={child.id}
                                    comp={child}
                                    getStyles={() => ({})}
                                    isPreview={isPreview}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            );
                        case 'bannerText':
                            return (
                                <BannerTextComponent
                                    key={child.id}
                                    comp={child}
                                    getStyles={() => ({})}
                                    isPreview={isPreview}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            );
                        default:
                            return null;
                    }
                })}
            </div>
        </div>
    );
};

export default BannerComponent;