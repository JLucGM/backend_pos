import React from 'react';
import ProductCardComponent from './ProductCardComponent';
import ComponentWithHover from '../ComponentWithHover';
import { getThemeWithDefaults, getComponentStyles, getResolvedFont, resolveStyleValue } from '@/utils/themeUtils';

const ProductComponent = ({
    comp,
    getStyles,
    onEdit,
    onDelete,
    themeSettings,
    appliedTheme,
    isPreview,
    products = [],
    setComponents,
    hoveredComponentId,
    setHoveredComponentId,
    mode = 'builder', // 'builder' o 'frontend'
    companyId,
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
    const productConfig = {};
    Object.keys(rawContent).forEach(key => {
        productConfig[key] = resolveValue(rawContent[key]);
    });

    // Resolver estilos base del componente
    const rawStyles = comp.styles || {};
    const resolvedStyles = {};
    Object.keys(rawStyles).forEach(key => {
        resolvedStyles[key] = resolveValue(rawStyles[key]);
    });

    const children = productConfig.children || [];

    // Determinar si estamos en modo frontend
    const isFrontend = mode === 'frontend';

    // Configuración del grid con valores resueltos
    const columns = productConfig.columns || 3;
    const gapX = productConfig.gapX || '10px';
    const gapY = productConfig.gapY || '10px';
    const limit = productConfig.limit || 8;

    // Encontrar los componentes hijos
    const titleComponent = children.find(child => child.type === 'productTitle');
    const cardComponent = children.find(child => child.type === 'productCard');

    // Estilos del contenedor con valores resueltos
    const baseStyles = getStyles(comp);

    // Asegurar que el backgroundColor del tema tenga prioridad
    const finalBackgroundColor = productConfig.backgroundColor ||
        resolvedStyles.backgroundColor ||
        themeWithDefaults.background ||
        '#ffffff';

    const containerStyles = {
        ...baseStyles,
        backgroundColor: finalBackgroundColor,
        padding: '20px 0',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative',
        boxSizing: 'border-box',
    };

    // Grid styles
    const gridStyles = {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gapY} ${gapX}`,
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
    };

    // Obtener productos para mostrar
    const productsToShow = products.slice(0, limit);

    // ==================== RENDERIZADO FRONTEND ====================
    if (isFrontend) {
        return (
            <div style={containerStyles}>
                {/* Título del grid */}
                {titleComponent && (
                    <h2
                        className="product-grid-title"
                        style={{
                            ...titleComponent.styles,
                            textAlign: titleComponent.styles?.alignment || 'center',
                            marginBottom: '2rem',
                            display: 'block',
                            width: '100%',
                            padding: '0 20px',
                        }}
                    >
                        {titleComponent.content}
                    </h2>
                )}

                {/* Grid de productos */}
                {cardComponent && productsToShow.length > 0 ? (
                    <div style={gridStyles}>
                        {productsToShow.map((product) => (
                            <ProductCardComponent
                                key={product.id}
                                comp={{
                                    ...cardComponent,
                                    content: {
                                        ...cardComponent.content,
                                        productData: product,
                                    }
                                }}
                                getStyles={getStyles}
                                onEdit={() => { }}
                                onDelete={() => { }}
                                themeSettings={themeSettings}
                                appliedTheme={appliedTheme}
                                isPreview={false}
                                products={products}
                                setComponents={() => { }}
                                hoveredComponentId={null}
                                setHoveredComponentId={() => { }}
                                mode="frontend"
                                companyId={companyId}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No hay productos disponibles
                    </div>
                )}
            </div>
        );
    }

    // ==================== RENDERIZADO BUILDER ====================
    // Manejo de eventos de mouse (solo en modo builder)
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
            {/* Renderizar título con ComponentWithHover */}
            {titleComponent && (
                <ComponentWithHover
                    component={titleComponent}
                    isPreview={isPreview}
                    hoveredComponentId={hoveredComponentId}
                    setHoveredComponentId={setHoveredComponentId}
                    getComponentTypeName={(type) => type}
                >
                    <div
                        style={{
                            ...titleComponent.styles,
                            textAlign: titleComponent.styles?.alignment || 'center',
                            marginBottom: '2rem',
                            display: 'block',
                            width: '100%',
                            padding: '0 20px',
                        }}
                    >
                        {titleComponent.content}
                    </div>
                </ComponentWithHover>
            )}

            {/* Grid de productos */}
            {cardComponent && (
                <div style={gridStyles}>
                    {productsToShow.map((product, index) => (
                        <ComponentWithHover
                            key={product?.id || index}
                            component={cardComponent}
                            isPreview={isPreview}
                            hoveredComponentId={hoveredComponentId}
                            setHoveredComponentId={setHoveredComponentId}
                            getComponentTypeName={(type) => type}
                        >
                            <ProductCardComponent
                                comp={{
                                    ...cardComponent,
                                    content: {
                                        ...cardComponent.content,
                                        productData: product
                                    }
                                }}
                                getStyles={getStyles}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                themeSettings={themeSettings}
                                appliedTheme={appliedTheme}
                                isPreview={isPreview}
                                products={products}
                                setComponents={setComponents}
                                hoveredComponentId={hoveredComponentId}
                                setHoveredComponentId={setHoveredComponentId}
                                mode="builder"
                                companyId={companyId}
                            />
                        </ComponentWithHover>
                    ))}
                </div>
            )}

            {products.length === 0 && !isPreview && (
                <div className="text-center text-gray-400 py-8">
                    <p>No hay productos disponibles</p>
                    <p className="text-sm">Agrega productos desde el panel de administración</p>
                </div>
            )}
        </div>
    );
};

export default ProductComponent;