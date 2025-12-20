import React from 'react';
import BannerTitleComponent from './BannerTitleComponent';
import BannerTextComponent from './BannerTextComponent';
import ButtonComponent from './ButtonComponent';
import TextComponent from './TextComponent';
import HeadingComponent from './HeadingComponent';
import ImageComponent from './ImageComponent';
import ComponentWithHover from './ComponentWithHover';
import ContainerComponent from './ContainerComponent';
import MarqueeTextComponent from './MarqueeComponent/MarqueeTextComponent';
import LinkComponent from './LinkComponent';
import DividerComponent from './DividerComponent/DividerComponent';

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

    // Obtener los componentes hijos
    const children = bannerConfig.children || [];

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
    const containerVerticalPosition = bannerConfig.containerVerticalPosition || 'center';
    const containerHorizontalPosition = bannerConfig.containerHorizontalPosition || 'center';
    const contentDirection = bannerConfig.contentDirection || 'vertical';

    // Funciones de alineación
    const getVerticalAlignment = () => {
        switch (containerVerticalPosition) {
            case 'top': return 'flex-start';
            case 'bottom': return 'flex-end';
            default: return 'center';
        }
    };

    const getHorizontalAlignment = () => {
        switch (containerHorizontalPosition) {
            case 'left': return 'flex-start';
            case 'right': return 'flex-end';
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
        backgroundSize,
        backgroundPosition,
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
        width: '100%',
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

    // Función para eliminar un hijo
    const handleDeleteChild = (childId) => {
        setComponents((prev) => {
            const updateBannerChildren = (components) => {
                return components.map((c) => {
                    if (c.id === comp.id && c.content && c.content.children) {
                        return {
                            ...c,
                            content: {
                                ...c.content,
                                children: c.content.children.filter((sc) => sc.id !== childId)
                            }
                        };
                    }
                    return c;
                });
            };
            const updated = updateBannerChildren(prev);
            return updated;
        });
    };

    // Función para renderizar cualquier tipo de componente
    const renderChildComponent = (child) => {
        const commonProps = {
            comp: child,
            getStyles,
            isPreview,
            themeSettings,
            onEdit: () => onEdit(child),
            onDelete: () => handleDeleteChild(child.id),
            hoveredComponentId,
            setHoveredComponentId
        };

        switch (child.type) {
            case 'bannerTitle':
                return <BannerTitleComponent {...commonProps} />;
            case 'bannerText':
                return <BannerTextComponent {...commonProps} />;
            case 'button':
                return <ButtonComponent {...commonProps} />;
            case 'text':
                return <TextComponent {...commonProps} />;
            case 'heading':
                return <HeadingComponent {...commonProps} />;
            case 'image':
                return <ImageComponent {...commonProps} />;
                case 'marquee': // ¡AGREGA ESTE CASO!
                return <MarqueeTextComponent {...commonProps} />
                case 'link': // ¡AGREGA ESTE CASO!
                return <LinkComponent {...commonProps} />
                case 'divider': // ¡AGREGA ESTE CASO!
                return <DividerComponent {...commonProps} />
            case 'container':
                return (
                    <ContainerComponent
                        {...commonProps}
                        products={[]}
                        setComponents={setComponents}
                    />
                );
            default:
                return (
                    <div
                        style={{
                            border: isPreview ? 'none' : '1px dashed #ccc',
                            padding: '10px',
                            background: '#f9f9f9'
                        }}
                    >
                        Componente no reconocido: {child.type}
                    </div>
                );
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
                {children.length > 0 ? (
                    children.map((child) => (
                        <div key={child.id} style={{ width: '100%' }}>
                            {renderChildComponent(child)}
                        </div>
                    ))
                ) : (
                    !isPreview && (
                        <div className="text-center text-gray-400 py-8 border border-dashed border-gray-300 rounded cursor-pointer w-full">
                            <p>Banner vacío</p>
                            <p className="text-sm">Arrastra componentes aquí desde el árbol</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default BannerComponent;