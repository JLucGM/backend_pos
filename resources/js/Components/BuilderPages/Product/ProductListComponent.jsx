import React, { useMemo, useState, useEffect } from 'react';
import ProductCardComponent from './ProductCardComponent';
import ComponentWithHover from '../ComponentWithHover';
import PaginationComponent from './PaginationComponent';
import PriceFilterComponent from './PriceFilterComponent';
import SortSelectComponent from './SortSelectComponent';
import { getThemeWithDefaults, resolveStyleValue } from '@/utils/themeUtils';

const ProductListComponent = ({
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
    mode = 'builder',
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
    const rawListConfig = comp.content || {};
    const listConfig = {};
    Object.keys(rawListConfig).forEach(key => {
        listConfig[key] = resolveValue(rawListConfig[key]);
    });

    const children = listConfig.children || [];

    // Resolver estilos del componente (por si acaso)
    const rawStyles = comp.styles || {};
    const styles = {};
    Object.keys(rawStyles).forEach(key => {
        styles[key] = resolveValue(rawStyles[key]);
    });

    // Encontrar hijos
    const titleComponent = children.find(child => child.type === 'productTitle');
    const cardComponent = children.find(child => child.type === 'productCard');
    const paginationComponent = children.find(child => child.type === 'productListPagination');
    const priceFilterComponent = children.find(child => child.type === 'productListPriceFilter');
    const sortSelectComponent = children.find(child => child.type === 'productListSortSelect');

    // Estilos base
    const baseStyles = getStyles(comp);

    // Color de fondo resuelto
    const finalBackgroundColor = listConfig.backgroundColor ||
        styles.backgroundColor ||
        themeWithDefaults.background ||
        '#ffffff';

    const containerStyles = {
        ...baseStyles,
        backgroundColor: resolveValue(finalBackgroundColor),
        padding: '20px 0',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative',
        boxSizing: 'border-box',
    };

    // Configuración del grid (valores resueltos)
    const columns = listConfig.columns || 3;
    const gapX = listConfig.gapX || '10px';
    const gapY = listConfig.gapY || '10px';
    const limit = listConfig.limit || 8;

    const gridStyles = {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gapY} ${gapX}`,
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
    };

    // Estados locales para frontend
    const [currentPage, setCurrentPage] = useState(1);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortOption, setSortOption] = useState('');

    // Filtrado y ordenamiento
    const filteredAndSorted = useMemo(() => {
        let list = [...products];
        const getName = (p) => (p?.product_name || p?.name || p?.title || '').toString();
        const getPriceVal = (p) => {
            const v = p?.product_price ?? p?.price ?? p?.product_price_discount ?? 0;
            const n = parseFloat(v);
            return isNaN(n) ? 0 : n;
        };
        const getDateVal = (p) => new Date(p?.created_at || p?.createdAt || p?.date || 0);

        const min = parseFloat(minPrice);
        const max = parseFloat(maxPrice);
        if (!isNaN(min)) list = list.filter(p => getPriceVal(p) >= min);
        if (!isNaN(max)) list = list.filter(p => getPriceVal(p) <= max);

        switch (sortOption) {
            case 'alpha-asc':
                list.sort((a, b) => getName(a).localeCompare(getName(b)));
                break;
            case 'alpha-desc':
                list.sort((a, b) => getName(b).localeCompare(getName(a)));
                break;
            case 'price-asc':
                list.sort((a, b) => getPriceVal(a) - getPriceVal(b));
                break;
            case 'price-desc':
                list.sort((a, b) => getPriceVal(b) - getPriceVal(a));
                break;
            case 'date-new-old':
                list.sort((a, b) => getDateVal(b) - getDateVal(a));
                break;
            case 'date-old-new':
                list.sort((a, b) => getDateVal(a) - getDateVal(b));
                break;
            default:
                break;
        }
        return list;
    }, [products, minPrice, maxPrice, sortOption]);

    const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / limit));
    const currentItems = filteredAndSorted.slice((currentPage - 1) * limit, currentPage * limit);

    useEffect(() => setCurrentPage(1), [minPrice, maxPrice, sortOption, products]);

    const isFrontend = mode === 'frontend';

    if (isFrontend) {
        return (
            <div style={containerStyles}>
                {titleComponent && (
                    <h2 style={{
                        ...titleComponent.styles,
                        textAlign: titleComponent.styles?.alignment || 'center',
                        marginBottom: '1rem',
                        padding: '0 20px'
                    }}>
                        {titleComponent.content}
                    </h2>
                )}

                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {priceFilterComponent && (
                        <PriceFilterComponent
                            comp={priceFilterComponent}
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            setMinPrice={setMinPrice}
                            setMaxPrice={setMaxPrice}
                            themeSettings={themeSettings}
                            appliedTheme={appliedTheme}
                        />
                    )}

                    {sortSelectComponent && (
                        <SortSelectComponent
                            comp={sortSelectComponent}
                            value={sortOption}
                            onChange={setSortOption}
                            themeSettings={themeSettings}
                            appliedTheme={appliedTheme}
                        />
                    )}
                </div>

                {cardComponent && currentItems.length > 0 ? (
                    <div style={gridStyles}>
                        {currentItems.map(product => (
                            <ProductCardComponent
                                key={product.id}
                                comp={{ ...cardComponent, content: { ...cardComponent.content, productData: product } }}
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
                    <div className="text-center py-8 text-gray-500">No hay productos disponibles</div>
                )}

                {paginationComponent && (
                    <PaginationComponent
                        comp={paginationComponent}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onChange={setCurrentPage}
                        themeSettings={themeSettings}
                        appliedTheme={appliedTheme}
                    />
                )}
            </div>
        );
    }

    // BUILDER RENDER
    const handleMouseEnter = () => {
        if (setHoveredComponentId && !isPreview) setHoveredComponentId(comp.id);
    };
    const handleMouseLeave = () => {
        if (setHoveredComponentId && !isPreview) setHoveredComponentId(null);
    };

    return (
        <div style={containerStyles} className="group relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {titleComponent && (
                <ComponentWithHover
                    component={titleComponent}
                    isPreview={isPreview}
                    hoveredComponentId={hoveredComponentId}
                    setHoveredComponentId={setHoveredComponentId}
                    getComponentTypeName={(t) => t}
                >
                    <div style={{
                        ...titleComponent.styles,
                        textAlign: titleComponent.styles?.alignment || 'center',
                        marginBottom: '1rem',
                        padding: '0 20px'
                    }}>
                        {titleComponent.content}
                    </div>
                </ComponentWithHover>
            )}

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                {priceFilterComponent && (
                    <ComponentWithHover
                        component={priceFilterComponent}
                        isPreview={isPreview}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        getComponentTypeName={(t) => t}
                    >
                        <PriceFilterComponent
                            comp={priceFilterComponent}
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            setMinPrice={setMinPrice}
                            setMaxPrice={setMaxPrice}
                            themeSettings={themeSettings}
                            appliedTheme={appliedTheme}
                        />
                    </ComponentWithHover>
                )}

                {sortSelectComponent && (
                    <ComponentWithHover
                        component={sortSelectComponent}
                        isPreview={isPreview}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        getComponentTypeName={(t) => t}
                    >
                        <SortSelectComponent
                            comp={sortSelectComponent}
                            value={sortOption}
                            onChange={setSortOption}
                            themeSettings={themeSettings}
                            appliedTheme={appliedTheme}
                        />
                    </ComponentWithHover>
                )}
            </div>

            {cardComponent && (
                <div style={gridStyles}>
                    {products.slice(0, limit).map((product, index) => (
                        <ComponentWithHover
                            key={product?.id || index}
                            component={cardComponent}
                            isPreview={isPreview}
                            hoveredComponentId={hoveredComponentId}
                            setHoveredComponentId={setHoveredComponentId}
                            getComponentTypeName={(t) => t}
                        >
                            <ProductCardComponent
                                comp={{ ...cardComponent, content: { ...cardComponent.content, productData: product } }}
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

            {paginationComponent && (
                <ComponentWithHover
                    component={paginationComponent}
                    isPreview={isPreview}
                    hoveredComponentId={hoveredComponentId}
                    setHoveredComponentId={setHoveredComponentId}
                    getComponentTypeName={(t) => t}
                >
                    <PaginationComponent
                        comp={paginationComponent}
                        currentPage={1}
                        totalPages={Math.max(1, Math.ceil(products.length / limit))}
                        onChange={() => { }}
                        themeSettings={themeSettings}
                        appliedTheme={appliedTheme}
                    />
                </ComponentWithHover>
            )}
        </div>
    );
};

export default ProductListComponent;