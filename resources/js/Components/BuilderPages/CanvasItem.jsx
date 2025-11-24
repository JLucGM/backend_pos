// components/BuilderPages/CanvasItem.jsx
import React, { memo } from 'react';
import { Button } from '@/Components/ui/button';
import { Trash, Edit } from 'lucide-react';

// Importa todos los componentes específicos
import TextComponent from './TextComponent';
import ImageComponent from './ImageComponent';
import VideoComponent from './VideoComponent';
import LinkComponent from './LinkComponent';
import ProductComponent from './ProductComponent';
import CarouselComponent from './CarouselComponent';
import ContainerComponent from './ContainerComponent';
import ButtonComponent from './ButtonComponent';
import HeadingComponent from './HeadingComponent';

const CanvasItem = memo(
    ({ 
        comp, 
        onEditComponent, 
        onDeleteComponent, 
        themeSettings, 
        isPreview = false, 
        products, 
        setComponents,
        hoveredComponentId,
        setHoveredComponentId 
    }) => {
        const getStyles = () => {
            const styles = comp.styles || {};
            return {
                color: styles.color || (themeSettings?.primary ? `hsl(${themeSettings.primary})` : 'inherit'),
                fontSize: styles.fontSize || 'inherit',
                backgroundColor: styles.backgroundColor || (themeSettings?.primary ? `hsl(${themeSettings.primary})` : 'inherit'),
                padding: styles.padding || 'inherit',
                fontFamily: themeSettings?.fontFamily || 'inherit',
            };
        };

        const isHovered = hoveredComponentId === comp.id;

        const renderComponent = () => {
            switch (comp.type) {
                case 'text':
                    return <TextComponent comp={comp} getStyles={getStyles} isPreview={isPreview} />;
                case 'heading':
                    return <HeadingComponent comp={comp} getStyles={getStyles} isPreview={isPreview} />;
                case 'button':
                    return <ButtonComponent comp={comp} getStyles={getStyles} isPreview={isPreview} />;
                case 'image':
                    return <ImageComponent comp={comp} isPreview={isPreview} />;
                case 'video':
                    return <VideoComponent comp={comp} isPreview={isPreview} />;
                case 'link':
                    return <LinkComponent comp={comp} getStyles={getStyles} isPreview={isPreview} />;
                case 'product':
                    return <ProductComponent products={products} comp={comp} getStyles={getStyles} isPreview={isPreview} />;
                case 'carousel':
                    return <CarouselComponent products={products.slice(0, comp.content.limit || 5)} comp={comp} isPreview={isPreview} />;
                case 'container':
                    return <ContainerComponent 
                        comp={comp} 
                        getStyles={getStyles} 
                        onEdit={() => onEditComponent(comp)}
                        onDelete={onDeleteComponent} 
                        themeSettings={themeSettings} 
                        isPreview={isPreview} 
                        products={products} 
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />;
                default:
                    return <div className="p-4 border border-red-300 bg-red-50 text-red-700">
                        Tipo de componente desconocido: {comp.type}
                    </div>;
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
                'container': 'Contenedor'
            };
            return typeNames[type] || type;
        };

        return (
            <div 
                className={`relative rounded-lg transition-all  ${
                    isHovered ? 'border border-blue-400 bg-blue-50 bg-opacity-50' : 'border border-transparent'
                }`}
                onMouseEnter={() => setHoveredComponentId(comp.id)}
                onMouseLeave={() => setHoveredComponentId(null)}
                
            >
                <div className={`rounded-t-lg bg-blue-500 text-white text-xs px-2 py-1 transition-opacity duration-300 absolute -top-6 left-0 z-50 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                }`}>
                    {getComponentTypeName(comp.type)}
                </div>
                
                {!isPreview && (
                    <div className={`absolute top-2 right-2 z-40 flex gap-1 transition-opacity ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                    }`}>
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                // console.log('🟢 Edit button clicked:', comp.type, comp.id);
                                onEditComponent(comp);
                            }}
                            variant="secondary"
                            size="icon"
                            className="h-6 w-6 bg-white border shadow-sm"
                        >
                            <Edit size={12} />
                        </Button>
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteComponent(comp.id);
                            }}
                            variant="destructive"
                            size="icon"
                            className="h-6 w-6 shadow-sm"
                        >
                            <Trash size={12} />
                        </Button>
                    </div>
                )}
                <div className="">
                    {renderComponent()}
                </div>
            </div>
        );
    }
);

export default CanvasItem;