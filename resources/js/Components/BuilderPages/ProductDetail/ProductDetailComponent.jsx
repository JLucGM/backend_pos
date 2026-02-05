import React, { useState, useEffect } from 'react';
import ProductDetailImageComponent from './ProductDetailImageComponent';
import ProductDetailNameComponent from './ProductDetailNameComponent';
import ProductDetailPriceComponent from './ProductDetailPriceComponent';
import ProductDetailDescriptionComponent from './ProductDetailDescriptionComponent';
import ProductDetailAttributesComponent from './ProductDetailAttributesComponent';
import ProductDetailStockComponent from './ProductDetailStockComponent';
import QuantitySelectorComponent from './QuantitySelectorComponent';
import ButtonComponent from '../ButtonComponent';
import ComponentWithHover from '../ComponentWithHover';
import { getThemeWithDefaults, getComponentStyles } from '@/utils/themeUtils';

// Helper para añadir unidad (px) si es solo número
const withUnit = (value, unit = 'px') => {
    if (value === undefined || value === null || value === '') return undefined;
    // Si ya es string y tiene algun caracter no numerico (como px, %, rem), devolver tal cual
    if (typeof value === 'string' && isNaN(Number(value))) return value;
    return `${value}${unit}`;
};

const ProductDetailComponent = ({
    comp,
    getStyles,
    onEdit,
    onDelete,
    themeSettings,
    isPreview,
    products,
    setComponents,
    hoveredComponentId,
    setHoveredComponentId,
    product,
    storeAutomaticDiscounts = [],
    appliedTheme,
}) => {
    // Extraer configuraciones personalizadas
    const customStyles = comp.styles || {};
    const productDetailConfig = comp.content || {};

    const children = productDetailConfig.children || [];

    const [selectedCombination, setSelectedCombination] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [currentPrice, setCurrentPrice] = useState(null);

    const getComponentTypeName = (type) => {
        const typeNames = {
            'productDetailImage': 'Imagen del producto',
            'productDetailName': 'Nombre del producto',
            'productDetailPrice': 'Precio del producto',
            'productDetailDescription': 'Descripción del producto',
            'productDetailAttributes': 'Atributos del producto',
            'productDetailStock': 'Stock del producto',
            'quantitySelector': 'Selector de cantidad',
            'button': 'Botón'
        };
        return typeNames[type] || type;
    };

    // Obtener configuraciones de layout y estilos
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    const layoutType = customStyles.layoutType || 'grid';
    const padding = customStyles.padding || '20px';
    const backgroundColor = customStyles.backgroundColor || themeWithDefaults.background;
    const maxWidth = customStyles.maxWidth || '100%';
    const gap = customStyles.gap || '60px';

    // Obtener valores de padding individuales (con valores por defecto)
    const paddingTop = customStyles.paddingTop || '20px';
    const paddingRight = customStyles.paddingRight || '20px';
    const paddingBottom = customStyles.paddingBottom || '20px';
    const paddingLeft = customStyles.paddingLeft || '20px';

    // Separar componentes por tipo para mejor organización
    const imageComponents = children.filter(child => child.type === 'productDetailImage');
    const descriptionComponents = children.filter(child => child.type === 'productDetailDescription');
    const otherComponents = children.filter(child =>
        child.type !== 'productDetailImage' && child.type !== 'productDetailDescription'
    );

    // Configurar estilos del contenedor basado en layoutType
    const getContainerStyles = () => {
        const baseStyles = {
            ...getStyles(comp),
            width: '100%',
            paddingTop: withUnit(paddingTop),
            paddingRight: withUnit(paddingRight),
            paddingBottom: withUnit(paddingBottom),
            paddingLeft: withUnit(paddingLeft),
            backgroundColor,
            maxWidth,
            margin: '0 auto',
            border: isPreview ? 'none' : '1px none #ccc',
            minHeight: '50px',
            position: 'relative',
            boxSizing: 'border-box',
        };

        switch (layoutType) {
            case 'grid':
                return {
                    ...baseStyles,
                    display: 'grid',
                    gridTemplateColumns: imageComponents.length > 0 ? '1fr 1fr' : '1fr',
                    gap: withUnit(gap),
                    alignItems: 'start',
                };
            case 'stack':
            default:
                return {
                    ...baseStyles,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                };
        }
    };

    const containerStyles = getContainerStyles();

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

    const handleCombinationChange = (combination) => {
        setSelectedCombination(combination);
        if (combination) {
            setCurrentPrice(combination.price);
        } else if (product) {
            setCurrentPrice(product.product_price);
        }
    };

    const handleQuantityChange = (newQuantity) => {
        setQuantity(newQuantity);
    };

    const getMaxQuantity = () => {
        if (!product?.stocks) return 99;

        if (selectedCombination) {
            const stock = product.stocks.find(s => s.combination_id === selectedCombination.id);
            return stock ? Math.min(stock.quantity, 99) : 0;
        } else {
            const totalStock = product.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
            return Math.min(totalStock, 99);
        }
    };

    // Función para eliminar un hijo
    const handleDeleteChild = (childId) => {
        setComponents((prev) => {
            const updateProductDetailChildren = (components) => {
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
            const updated = updateProductDetailChildren(prev);
            return updated;
        });
    };

    useEffect(() => {
        if (product) {
            if (selectedCombination) {
                setCurrentPrice(selectedCombination.price);
            } else {
                setCurrentPrice(product.product_price);
            }
        }
    }, [product, selectedCombination]);

    // RENDERIZAR CADA HIJO
    const renderChild = (child) => {
        const commonProps = {
            comp: child,
            getStyles,
            isPreview,
            onEdit: () => onEdit(child),
            onDelete: () => handleDeleteChild(child.id),
            hoveredComponentId,
            setHoveredComponentId,
            themeSettings,
            appliedTheme
        };

        switch (child.type) {
            case 'productDetailImage':
                return (
                    <ComponentWithHover
                        key={child.id}
                        component={child}
                        isPreview={isPreview}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        getComponentTypeName={getComponentTypeName}
                    >
                        <ProductDetailImageComponent
                            {...commonProps}
                            product={product}
                        />
                    </ComponentWithHover>
                );
            case 'productDetailName':
                return (
                    <ComponentWithHover
                        key={child.id}
                        component={child}
                        isPreview={isPreview}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        getComponentTypeName={getComponentTypeName}
                    >
                        <ProductDetailNameComponent
                            {...commonProps}
                            product={product}
                        />
                    </ComponentWithHover>
                );
            case 'productDetailPrice':
                return (
                    <ComponentWithHover
                        key={child.id}
                        component={child}
                        isPreview={isPreview}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        getComponentTypeName={getComponentTypeName}
                    >
                        <ProductDetailPriceComponent
                            {...commonProps}
                            product={product}
                            currentPrice={currentPrice}
                            selectedCombination={selectedCombination}
                        />
                    </ComponentWithHover>
                );
            case 'productDetailDescription':
                return (
                    <ComponentWithHover
                        key={child.id}
                        component={child}
                        isPreview={isPreview}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        getComponentTypeName={getComponentTypeName}
                    >
                        <ProductDetailDescriptionComponent
                            {...commonProps}
                            product={product}
                        />
                    </ComponentWithHover>
                );
            case 'productDetailAttributes':
                return (
                    <ComponentWithHover
                        key={child.id}
                        component={child}
                        isPreview={isPreview}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        getComponentTypeName={getComponentTypeName}
                    >
                        <ProductDetailAttributesComponent
                            {...commonProps}
                            product={product}
                            onCombinationChange={handleCombinationChange}
                        />
                    </ComponentWithHover>
                );
            case 'productDetailStock':
                return (
                    <ComponentWithHover
                        key={child.id}
                        component={child}
                        isPreview={isPreview}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        getComponentTypeName={getComponentTypeName}
                    >
                        <ProductDetailStockComponent
                            {...commonProps}
                            product={product}
                            currentCombination={selectedCombination}
                            themeSettings={themeSettings}
                        />
                    </ComponentWithHover>
                );
            case 'quantitySelector':
                return (
                    <ComponentWithHover
                        key={child.id}
                        component={child}
                        isPreview={isPreview}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        getComponentTypeName={getComponentTypeName}
                    >
                        <QuantitySelectorComponent
                            {...commonProps}
                            maxQuantity={getMaxQuantity()}
                            onQuantityChange={handleQuantityChange}
                            themeSettings={themeSettings}
                        />
                    </ComponentWithHover>
                );
            case 'button':
                return (
                    <ComponentWithHover
                        key={child.id}
                        component={child}
                        isPreview={isPreview}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        getComponentTypeName={getComponentTypeName}
                    >
                        <ButtonComponent
                            {...commonProps}
                            product={product}
                            selectedCombination={selectedCombination}
                            quantity={quantity}
                            storeAutomaticDiscounts={storeAutomaticDiscounts} // Añade esta línea
                        />
                    </ComponentWithHover>
                );
            default:
                return null;
        }
    };

    // Renderizado para layout grid - separar imagen de información
    const renderGridLayout = () => {
        if (imageComponents.length === 0) {
            // Sin imágenes, todo en una columna
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {children.map(renderChild)}
                </div>
            );
        }

        return (
            <>
                {/* Columna izquierda - Imágenes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {imageComponents.map(renderChild)}
                </div>

                {/* Columna derecha - Información del producto */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {otherComponents.concat(descriptionComponents).map(renderChild)}
                </div>
            </>
        );
    };

    // Renderizado para layout stack - descripción al final
    const renderStackLayout = () => {
        // Primero otros componentes, luego descripción
        const orderedComponents = [...imageComponents, ...otherComponents, ...descriptionComponents];

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {orderedComponents.map(renderChild)}
            </div>
        );
    };

    // Renderizar contenido basado en el layout seleccionado
    const renderContent = () => {
        switch (layoutType) {
            case 'grid':
                return renderGridLayout();
            case 'stack':
            default:
                return renderStackLayout();
        }
    };

    return (
        <div
            style={containerStyles}
            className="group relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children.length > 0 ? (
                renderContent()
            ) : (
                !isPreview && (
                    <div className="text-center text-gray-400 py-8 border border-dashed border-gray-300 rounded cursor-pointer w-full">
                        <p>Detalles del producto vacío</p>
                        <p className="text-sm">Arrastra componentes aquí desde el árbol</p>
                    </div>
                )
            )}
        </div>
    );
};

export default ProductDetailComponent;
