import React from 'react';
import BentoFeatureTitleComponent from './BentoFeatureTitleComponent';
import BentoFeatureTextComponent from './BentoFeatureTextComponent';
import ComponentWithHover from '../ComponentWithHover';

const BentoFeatureComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    onDelete,
    hoveredComponentId,
    setHoveredComponentId
}) => {
    const featureConfig = comp.content || {};
    const children = featureConfig.children || [];
    
    // Función para obtener el nombre del tipo de componente
    const getComponentTypeName = (type) => {
        const typeNames = {
            'bentoFeatureTitle': 'Título de Característica',
            'bentoFeatureText': 'Texto de Característica'
        };
        return typeNames[type] || type;
    };

    // Estilos de la carta de característica
    const cardStyles = {
        ...getStyles(comp),
        backgroundColor: featureConfig.backgroundColor || '#f8fafc',
        backgroundImage: featureConfig.backgroundImage ? `url(${featureConfig.backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: featureConfig.border === 'solid' 
            ? `${featureConfig.borderThickness || '1px'} solid ${featureConfig.borderColor || '#e5e7eb'}` 
            : 'none',
        borderRadius: featureConfig.borderRadius || '12px',
        padding: featureConfig.padding || '24px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        opacity: featureConfig.opacity || 1,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    };

    // Manejo de eventos
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

    const handleClick = (e) => {
        if (!isPreview && onEdit && e.target === e.currentTarget) {
            onEdit(comp);
        }
    };

    // Encontrar componentes hijos
    const titleComponent = children.find(child => child.type === 'bentoFeatureTitle');
    const textComponent = children.find(child => child.type === 'bentoFeatureText');

    return (
        <div
            style={cardStyles}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`group transition-all duration-300 hover:scale-105 ${
                !isPreview ? 'cursor-pointer hover:shadow-xl' : ''
            }`}
        >
            {/* Título de la característica */}
            {titleComponent && (
                <ComponentWithHover
                    component={titleComponent}
                    isPreview={isPreview}
                    hoveredComponentId={hoveredComponentId}
                    setHoveredComponentId={setHoveredComponentId}
                    getComponentTypeName={getComponentTypeName}
                >
                    <BentoFeatureTitleComponent
                        comp={titleComponent}
                        getStyles={getStyles}
                        isPreview={isPreview}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                </ComponentWithHover>
            )}

            {/* Texto de la característica */}
            {textComponent && (
                <ComponentWithHover
                    component={textComponent}
                    isPreview={isPreview}
                    hoveredComponentId={hoveredComponentId}
                    setHoveredComponentId={setHoveredComponentId}
                    getComponentTypeName={getComponentTypeName}
                >
                    <BentoFeatureTextComponent
                        comp={textComponent}
                        getStyles={getStyles}
                        isPreview={isPreview}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                </ComponentWithHover>
            )}
        </div>
    );
};

export default BentoFeatureComponent;