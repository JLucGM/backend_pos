import React from 'react';
import BentoTitleComponent from './BentoTitleComponent';
import BentoFeatureComponent from './BentoFeatureComponent';
import ComponentWithHover from '../ComponentWithHover';
import { getThemeWithDefaults, getComponentStyles } from '@/utils/themeUtils';

const BentoComponent = ({
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
    const bentoConfig = comp.content || {};
    const children = bentoConfig.children || [];
    const themeWithDefaults = getThemeWithDefaults(themeSettings);
    const themeBentoStyles = getComponentStyles(themeWithDefaults, 'bento');

    // Función para obtener el nombre del tipo de componente
    const getComponentTypeName = (type) => {
        const typeNames = {
            'bento': 'Bento',
            'bentoTitle': 'Título del Bento',
            'bentoFeature': 'Característica Bento',
            'bentoFeatureTitle': 'Título de Característica',
            'bentoFeatureText': 'Texto de Característica'
        };
        return typeNames[type] || type;
    };

    // Configuración del contenedor principal con valores del tema
    const containerStyles = {
        ...getStyles(comp),
        width: '100%',
        backgroundColor: bentoConfig.backgroundColor || themeBentoStyles.backgroundColor,
        padding: '40px 20px',
        borderRadius: bentoConfig.containerBorderRadius || themeBentoStyles.borderRadius,
        border: bentoConfig.containerBorder === 'solid' 
            ? `${bentoConfig.containerBorderThickness || '1px'} solid ${bentoConfig.containerBorderColor || '#e5e7eb'}` 
            : 'none',
    };

    // Grid styles basado en la cantidad de características con valores del tema
    const featuresCount = children.filter(child => child.type === 'bentoFeature').length;
    const gridColumns = bentoConfig.gridColumns || getGridColumns(featuresCount);
    
    const gridStyles = {
        display: 'grid',
        gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
        gap: bentoConfig.gridGap || themeBentoStyles.gap,
        maxWidth: '1200px',
        margin: '0 auto',
    };

    function getGridColumns(count) {
        if (count <= 2) return 2;
        if (count <= 4) return 2;
        if (count <= 6) return 3;
        return 4;
    }

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

    // Encontrar los componentes hijos
    const titleComponent = children.find(child => child.type === 'bentoTitle');
    const featureComponents = children.filter(child => child.type === 'bentoFeature');

    return (
        <div
            style={containerStyles}
            className="group relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Título del Bento */}
            {titleComponent && (
                <ComponentWithHover
                    component={titleComponent}
                    isPreview={isPreview}
                    hoveredComponentId={hoveredComponentId}
                    setHoveredComponentId={setHoveredComponentId}
                    getComponentTypeName={getComponentTypeName}
                >
                    <BentoTitleComponent
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

            {/* Grid de características */}
            <div style={gridStyles} className="mt-8">
                {featureComponents.map((feature, index) => (
                    <ComponentWithHover
                        key={feature.id}
                        component={feature}
                        isPreview={isPreview}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        getComponentTypeName={getComponentTypeName}
                    >
                        <BentoFeatureComponent
                            comp={feature}
                            getStyles={getStyles}
                            isPreview={isPreview}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            hoveredComponentId={hoveredComponentId}
                            setHoveredComponentId={setHoveredComponentId}
                        />
                    </ComponentWithHover>
                ))}
            </div>
        </div>
    );
};

export default BentoComponent;