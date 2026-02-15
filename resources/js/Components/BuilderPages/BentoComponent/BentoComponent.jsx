import React from 'react';
import BentoTitleComponent from './BentoTitleComponent';
import BentoFeatureComponent from './BentoFeatureComponent';
import ComponentWithHover from '../ComponentWithHover';
import { getThemeWithDefaults, getComponentStyles, resolveStyleValue } from '@/utils/themeUtils';

const BentoComponent = ({
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

    // ===========================================
    // FUNCIÓN PARA RESOLVER REFERENCIAS
    // ===========================================
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    // Resolver contenido del componente
    const rawContent = comp.content || {};
    const bentoConfig = {};
    Object.keys(rawContent).forEach(key => {
        bentoConfig[key] = resolveValue(rawContent[key]);
    });

    const children = bentoConfig.children || [];

    // Resolver estilos personalizados del componente (si los hay)
    const rawStyles = comp.styles || {};
    const styles = {};
    Object.keys(rawStyles).forEach(key => {
        styles[key] = resolveValue(rawStyles[key]);
    });

    // Obtener estilos del tema para bento (resueltos por si acaso)
    const themeBentoStylesRaw = getComponentStyles(themeWithDefaults, 'bento', appliedTheme);
    const themeBentoStyles = {};
    Object.keys(themeBentoStylesRaw).forEach(key => {
        themeBentoStyles[key] = resolveValue(themeBentoStylesRaw[key]);
    });

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

    // Helper para añadir unidad (px) si es solo número
    const withUnit = (value, unit = 'px') => {
        if (value === undefined || value === null || value === '') return undefined;
        if (typeof value === 'string' && isNaN(Number(value))) return value;
        return `${value}${unit}`;
    };

    // Configuración del contenedor principal con valores resueltos
    const containerStyles = {
        ...getStyles(comp),
        width: '100%',
        backgroundColor: resolveValue(bentoConfig.backgroundColor || themeBentoStyles.backgroundColor),
        padding: '40px 20px',
        borderRadius: withUnit(bentoConfig.containerBorderRadius) || themeBentoStyles.borderRadius,
        border: bentoConfig.containerBorder === 'solid'
            ? `${withUnit(bentoConfig.containerBorderThickness) || '1px'} solid ${resolveValue(bentoConfig.containerBorderColor || '#e5e7eb')}`
            : 'none',
    };

    // Grid styles basado en la cantidad de características
    const featuresCount = children.filter(child => child.type === 'bentoFeature').length;
    const gridColumns = bentoConfig.gridColumns || getGridColumns(featuresCount);

    const gridStyles = {
        display: 'grid',
        gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
        gap: withUnit(bentoConfig.gridGap) || themeBentoStyles.gap,
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
                        themeSettings={themeSettings}
                        appliedTheme={appliedTheme}
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
                            themeSettings={themeSettings}
                            appliedTheme={appliedTheme}
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