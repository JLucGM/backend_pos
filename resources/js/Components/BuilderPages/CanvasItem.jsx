// components/BuilderPages/CanvasItem.jsx
import React from 'react';
import HeadingComponent from './HeadingComponent';
import ButtonComponent from './ButtonComponent';
import ImageComponent from './ImageComponent';
import VideoComponent from './VideoComponent';
import LinkComponent from './LinkComponent';
import ProductComponent from './ProductComponent';
import CarouselComponent from './CarouselComponent';
import ContainerComponent from './ContainerComponent';
import BannerComponent from './BannerComponent';
import BannerTitleComponent from './BannerTitleComponent';
import BannerTextComponent from './BannerTextComponent';
import ProductTitleComponent from './ProductTitleComponent';
import ProductCardComponent from './ProductCardComponent';
import ProductImageComponent from './ProductImageComponent';
import ProductNameComponent from './ProductNameComponent';
import ProductPriceComponent from './ProductPriceComponent';
import CarouselNameComponent from './CarouselNameComponent';
import CarouselImageComponent from './CarouselImageComponent';
import CarouselCardComponent from './CarouselCardComponent';
import CarouselTitleComponent from './CarouselTitleComponent';
import BentoTitleComponent from './BentoComponent/BentoTitleComponent';
import BentoFeatureComponent from './BentoComponent/BentoFeatureComponent';
import BentoFeatureTitleComponent from './BentoComponent/BentoFeatureTitleComponent';
import BentoFeatureTextComponent from './BentoComponent/BentoFeatureTextComponent';
import PageContentComponent from './PageContentComponent';
import TextComponent from './TextComponent';
import BentoComponent from './BentoComponent/BentoComponent';
import DividerComponent from './DividerComponent/DividerComponent';
import MarqueeTextComponent from './MarqueeComponent/MarqueeTextComponent';
import CarouselPriceComponent from './CarouselPriceComponent';

const CanvasItem = ({
    comp,
    onEditComponent,
    onDeleteComponent,
    themeSettings,
    appliedTheme,
    isPreview,
    products,
    setComponents,
    hoveredComponentId,
    setHoveredComponentId,
    pageContent
}) => {
    const getStyles = (comp) => {
        const styles = comp.styles || {};

        // Estilos base del tema aplicado
        const themeStyles = {
            color: themeSettings?.foreground ? `hsl(${themeSettings.foreground})` : '#000000',
            backgroundColor: themeSettings?.background ? `hsl(${themeSettings.background})` : 'transparent',
            fontFamily: themeSettings?.fontFamily || 'inherit',
            borderRadius: themeSettings?.borderRadius || '0',
            // Agregar más propiedades del tema si existen
            ...(themeSettings?.primary && {
                '--primary-color': `hsl(${themeSettings.primary})`
            }),
        };

        // Combinar estilos del tema con estilos específicos del componente
        // Los estilos del componente tienen prioridad sobre los del tema
        return {
            ...themeStyles,
            ...styles, // Los estilos del componente sobrescriben los del tema
        };
    };

    const isHovered = hoveredComponentId === comp.id;

    // Funciones seguras para eventos de mouse
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

    const renderComponent = () => {
        // Propiedades comunes para todos los componentes
        const commonProps = {
            comp,
            getStyles,
            isPreview,
            themeSettings,
            appliedTheme,
        };

        switch (comp.type) {
            case 'text':
                return <TextComponent {...commonProps} />;
            case 'heading':
                return <HeadingComponent {...commonProps} />;
            case 'button':
                return <ButtonComponent {...commonProps} />;
            case 'image':
                return <ImageComponent {...commonProps} />;
            case 'video':
                return <VideoComponent {...commonProps} />;
            case 'link':
                return <LinkComponent {...commonProps} />;
            case 'product':
                return (
                    <ProductComponent
                        {...commonProps}
                        onEdit={() => onEditComponent(comp)}
                        onDelete={() => onDeleteComponent(comp.id)}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            case 'carousel':
                return (
                    <CarouselComponent
                        {...commonProps}
                        onEdit={() => onEditComponent(comp)}
                        onDelete={() => onDeleteComponent(comp.id)}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            case 'carouselTitle':
                return (
                    <CarouselTitleComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'carouselCard':
                return (
                    <CarouselCardComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            case 'carouselImage':
                return (
                    <CarouselImageComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'carouselName':
                return (
                    <CarouselNameComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'carouselPrice':
                return (
                    <CarouselPriceComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'container':
                return (
                    <ContainerComponent
                        {...commonProps}
                        onEdit={() => onEditComponent(comp)}
                        onDelete={() => onDeleteComponent(comp.id)}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            case 'banner':
                return (
                    <BannerComponent
                        {...commonProps}
                        onEdit={() => onEditComponent(comp)}
                        onDelete={() => onDeleteComponent(comp.id)}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            case 'bannerTitle':
                return (
                    <BannerTitleComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'bannerText':
                return (
                    <BannerTextComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'productTitle':
                return (
                    <ProductTitleComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'productCard':
                return (
                    <ProductCardComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            case 'productImage':
                return (
                    <ProductImageComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'productName':
                return (
                    <ProductNameComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'productPrice':
                return (
                    <ProductPriceComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'bento':
                return (
                    <BentoComponent
                        {...commonProps}
                        onEdit={() => onEditComponent(comp)}
                        onDelete={() => onDeleteComponent(comp.id)}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            case 'bentoTitle':
                return (
                    <BentoTitleComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'bentoFeature':
                return (
                    <BentoFeatureComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                );
            case 'bentoFeatureTitle':
                return (
                    <BentoFeatureTitleComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'bentoFeatureText':
                return (
                    <BentoFeatureTextComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'marquee':
                return (
                    <MarqueeTextComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'divider':
                return (
                    <DividerComponent
                        {...commonProps}
                        onEdit={onEditComponent}
                        onDelete={onDeleteComponent}
                    />
                );
            case 'pageContent':
                return (
                    <PageContentComponent
                        {...commonProps}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        pageContent={pageContent}
                    />
                );
            default:
                return (
                    <div
                        className="p-4 border border-red-300 bg-red-50 rounded"
                        style={getStyles(comp)}
                    >
                        <div className="font-bold text-red-600">
                            Componente no reconocido: {comp.type}
                        </div>
                        <div className="text-sm text-gray-600">
                            ID: {comp.id}
                        </div>
                    </div>
                );
        }
    };

    const getComponentTypeName = (type) => {
        const typeNames = {
            'text': 'Texto',
            'heading': 'Encabezado',
            'button': 'Botón',
            'image': 'Imagen',
            'video': 'Video',
            'link': 'Enlace',
            'product': 'Producto',
            'carousel': 'Carrusel',
            'container': 'Contenedor',
            'banner': 'Sección Banner',
            'bannerTitle': 'Título del Banner',
            'bannerText': 'Texto del Banner',
            'productTitle': 'Título de Productos',
            'productCard': 'Carta de Producto',
            'productImage': 'Imagen de Producto',
            'productName': 'Nombre de Producto',
            'productPrice': 'Precio de Producto',
            'marquee': 'Texto en Movimiento',
            'divider': 'Divider',
            'pageContent': 'Contenido de Página',
            'bento': 'Bento',
            'bentoTitle': 'Título Bento',
            'bentoFeature': 'Característica Bento',
            'bentoFeatureTitle': 'Título Característica',
            'bentoFeatureText': 'Texto Característica',
            'carouselTitle': 'Título del Carrusel',
            'carouselCard': 'Carta del Carrusel',
            'carouselImage': 'Imagen del Carrusel',
            'carouselName': 'Nombre del Carrusel',
            'carouselPrice': 'Precio del Carrusel'
        };
        return typeNames[type] || type;
    };

    // Obtener información del origen del tema
    const getThemeSource = () => {
        if (!appliedTheme) return 'Sin tema';

        // Determinar de dónde viene el tema
        if (comp.appliedThemeSource === 'page') {
            return 'Página';
        } else if (comp.appliedThemeSource === 'template') {
            return 'Plantilla';
        } else {
            return 'Global';
        }
    };

    return (
        <div
            id={`component-${comp.id}`}
            className={`relative group rounded-lg transition-all duration-200 ${isHovered && !isPreview
                    ? 'border-2 border-blue-400 bg-blue-50/30'
                    : 'border border-transparent'
                }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            // style={{
            //     // Aplicar bordes redondeados del tema a los contenedores
            //     borderRadius: themeSettings?.borderRadius || '0.375rem',
            //     // Fondo sutil basado en el tema
            //     backgroundColor: isHovered && !isPreview
            //         ? themeSettings?.primary
            //             ? `hsla(${themeSettings.primary}, 0.05)`
            //             : '#eff6ff'
            //         : 'transparent',
            // }}
        >
            {/* Solo mostrar el tooltip en modo edición */}
            {!isPreview && (
                <div
                    className={`rounded-t-lg text-white text-xs px-3 py-1.5 transition-all duration-300 absolute -top-7 left-0 z-50 flex items-center gap-2 shadow-md ${isHovered ? 'bg-blue-400 opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                        }`}
                    // style={{
                    //     backgroundColor: "#60a5fa" ?
                    //         `#60a5fa` : '#60a5fa',
                    // }}
                >
                    <span className="font-medium">{getComponentTypeName(comp.type)}</span>
                    {/* {appliedTheme?.name && (
                        <>
                            <span className="opacity-75">•</span>
                            <span className="text-xs opacity-90 bg-white/20 px-1.5 py-0.5 rounded">
                                {appliedTheme.name}ddd
                            </span>
                        </>
                    )} */}
                </div>
            )}

            {/* Indicador visual del tema aplicado (solo en hover) */}
            {/* {!isPreview && isHovered && appliedTheme && (
                <div className="absolute top-1 right-1 z-40">
                    <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs shadow-sm border">
                        <div className="flex items-center gap-1">
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{
                                    backgroundColor: themeSettings?.primary
                                        ? `hsl(${themeSettings.primary})`
                                        : '#3b82f6',
                                }}
                            />
                            <span className="text-gray-700 font-medium">{getThemeSource()}</span>
                        </div>
                    </div>
                </div>
            )} */}

            <div className="relative z-10">
                {renderComponent()}
            </div>

            {/* Controles de edición (solo en modo edición) */}
            {/* {!isPreview && isHovered && (
                <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-1 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={() => onEditComponent(comp)}
                        className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded shadow"
                        style={{
                            backgroundColor: themeSettings?.primary
                                ? `hsl(${themeSettings.primary})`
                                : '#3b82f6',
                        }}
                    >
                        Editarsss
                    </button>
                    {comp.type !== 'pageContent' && (
                        <button
                            onClick={() => onDeleteComponent(comp.id)}
                            className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded shadow"
                        >
                            Eliminar
                        </button>
                    )}
                </div>
            )} */}
        </div>
    );
};

// Componente de debug para ver información del tema
// const ThemeDebugInfo = ({ themeSettings, appliedTheme }) => {
//     if (!themeSettings || !appliedTheme) return null;

//     return (
//         <div className="fixed bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border z-50 max-w-xs">
//             <div className="text-xs font-medium text-gray-700 mb-2">DEBUG - Tema Aplicado</div>
//             <div className="space-y-1">
//                 <div className="flex items-center justify-between">
//                     <span className="text-xs text-gray-500">Nombre:</span>
//                     <span className="text-xs font-medium">{appliedTheme.name}</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                     <span className="text-xs text-gray-500">Primario:</span>
//                     <div
//                         className="w-4 h-4 rounded border"
//                         style={{
//                             backgroundColor: themeSettings.primary
//                                 ? `hsl(${themeSettings.primary})`
//                                 : '#3b82f6'
//                         }}
//                     />
//                 </div>
//                 <div className="flex items-center justify-between">
//                     <span className="text-xs text-gray-500">Fondo:</span>
//                     <div
//                         className="w-4 h-4 rounded border"
//                         style={{
//                             backgroundColor: themeSettings.background
//                                 ? `hsl(${themeSettings.background})`
//                                 : '#ffffff'
//                         }}
//                     />
//                 </div>
//                 <div className="flex items-center justify-between">
//                     <span className="text-xs text-gray-500">Texto:</span>
//                     <div
//                         className="w-4 h-4 rounded border"
//                         style={{
//                             backgroundColor: themeSettings.foreground
//                                 ? `hsl(${themeSettings.foreground})`
//                                 : '#000000'
//                         }}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

export default CanvasItem;