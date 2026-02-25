// components/BuilderPages/components/HeroBannerComponent.jsx
import React from 'react';
import { getThemeWithDefaults, resolveStyleValue } from '@/utils/themeUtils';
import ComponentWithHover from '../ComponentWithHover';
import HeadingComponent from '../HeadingComponent';
import TextComponent from '../TextComponent';
import ImageComponent from '../ImageComponent';
import ButtonComponent from '../ButtonComponent';

const HeroBannerComponent = ({
    comp,
    getStyles,
    onEdit,
    onDelete,
    themeSettings,
    appliedTheme,
    isPreview,
    setComponents,
    hoveredComponentId,
    setHoveredComponentId
}) => {
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    const rawContent = comp.content || {};
    const heroConfig = {};
    Object.keys(rawContent).forEach(key => {
        heroConfig[key] = resolveValue(rawContent[key]);
    });

    const children = heroConfig.children || [];

    const withUnit = (value, unit = 'px') => {
        if (value === undefined || value === null || value === '') return undefined;
        if (typeof value === 'string' && isNaN(Number(value))) return value;
        return `${value}${unit}`;
    };

    // Reemplaza la parte de altura con esto:
const heightVh = heroConfig.heightVh !== undefined ? heroConfig.heightVh : 100;

const containerStyles = {
    ...getStyles(comp),
    width: '100%',
    height: `${heightVh}vh`,  //直接用 vh
    paddingTop: withUnit(heroConfig.paddingTop || '40px'),
    paddingRight: withUnit(heroConfig.paddingRight || '20px'),
    paddingBottom: withUnit(heroConfig.paddingBottom || '40px'),
    paddingLeft: withUnit(heroConfig.paddingLeft || '20px'),
    backgroundColor: resolveValue(heroConfig.backgroundColor) || 'transparent',
    display: 'flex',
    alignItems: 'center',
};

const gridStyles = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: withUnit(heroConfig.gap || '40px'),
    maxWidth: withUnit(heroConfig.maxWidth || 'auto', heroConfig.maxWidthUnit || 'px'),
    margin: '0 auto',
    alignItems: 'center',
    width: '100%',
    height: '100%',
};

    const leftColumnStyles = {
        display: 'flex',
        flexDirection: 'column',
        gap: withUnit(heroConfig.textGap || '20px'),
        textAlign: heroConfig.textAlign || 'left',
        width: '100%', // Hereda el ancho de la columna
    };

    const rightColumnStyles = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%', // Hereda el ancho de la columna
        minHeight: '200px', // Altura mínima para que se vea aunque no haya imagen
    };

    // Buscar la imagen (tomamos la primera que encuentre)
    const imageChild = children.find(child => child.type === 'image');
    const leftChildren = children.filter(child => child.type !== 'image');

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

    const getComponentTypeName = (type) => {
        const typeNames = {
            'heading': 'Título',
            'text': 'Texto',
            'button': 'Botón',
            'image': 'Imagen',
        };
        return typeNames[type] || type;
    };

    const renderChild = (child) => {
        const commonProps = {
            comp: child,
            getStyles,
            isPreview,
            themeSettings,
            appliedTheme,
            onEdit,
            onDelete,
            hoveredComponentId,
            setHoveredComponentId,
            mode: isPreview ? 'frontend' : 'builder', // Importante para ImageComponent
        };

        switch (child.type) {
            case 'heading':
                return <HeadingComponent {...commonProps} />;
            case 'text':
                return <TextComponent {...commonProps} />;
            case 'button':
                return <ButtonComponent {...commonProps} />;
            case 'image':
                return <ImageComponent {...commonProps} />;
            default:
                return <div>Componente no soportado</div>;
        }
    };

    return (
        <div
            style={containerStyles}
            className="group relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => !isPreview && onEdit && onEdit(comp)}
        >
            <div style={gridStyles}>
                {/* Columna izquierda */}
                <div style={leftColumnStyles}>
                    {leftChildren.map((child) => (
                        <ComponentWithHover
                            key={child.id}
                            component={child}
                            isPreview={isPreview}
                            hoveredComponentId={hoveredComponentId}
                            setHoveredComponentId={setHoveredComponentId}
                            getComponentTypeName={getComponentTypeName}
                        >
                            {renderChild(child)}
                        </ComponentWithHover>
                    ))}
                    {leftChildren.length === 0 && !isPreview && (
                        <div className="text-gray-400 border border-dashed p-4 text-center">
                            Arrastra componentes aquí (título, texto, botones)
                        </div>
                    )}
                </div>

                {/* Columna derecha */}
                <div  style={rightColumnStyles}>
                    {imageChild ? (
                        // Envolvemos en un div con width: 100% para que el ImageComponent se expanda
                        <div style={{ width: '100%' }}>
                            <ComponentWithHover
                                component={imageChild}
                                isPreview={isPreview}
                                hoveredComponentId={hoveredComponentId}
                                setHoveredComponentId={setHoveredComponentId}
                                getComponentTypeName={getComponentTypeName}
                            >
                                <ImageComponent
                                    comp={imageChild}
                                    getStyles={getStyles}
                                    isPreview={isPreview}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    themeSettings={themeSettings}
                                    appliedTheme={appliedTheme}
                                    mode={isPreview ? 'frontend' : 'builder'}
                                />
                            </ComponentWithHover>
                        </div>
                    ) : (
                        !isPreview && (
                            <div className="text-gray-400 border border-dashed p-4 text-center">
                                Arrastra una imagen aquí
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default HeroBannerComponent;