// components/BuilderPages/Canvas.jsx
import React, { memo, useMemo, useRef, useEffect, useState } from 'react';
import CanvasItem from './CanvasItem';

const Canvas = memo(({
    components,
    onEditComponent,
    onDeleteComponent,
    themeSettings,
    appliedTheme,
    products,
    setComponents,
    canvasWidth,
    hoveredComponentId,
    setHoveredComponentId,
    isPreview = false,
    pageContent,
    availableMenus,
    companyLogo,
    countries = [],
    states = [],
    cities = []
}) => {
    const canvasRef = useRef(null);
    const [canvasRect, setCanvasRect] = useState(null);
    const [scrollTop, setScrollTop] = useState(0);

    const handleScroll = () => {
        const el = canvasRef.current;
        if (!el) return;
        setScrollTop(el.scrollTop);
        // console.log('[Canvas] scrollTop:', el.scrollTop, 'clientHeight:', el.clientHeight, 'scrollHeight:', el.scrollHeight);
    };

    const updateRect = () => {
        const el = canvasRef.current;
        if (!el) return;
        try {
            const r = el.getBoundingClientRect();
            setCanvasRect({ top: r.top, left: r.left, width: r.width, height: r.height });
            // console.log('[Canvas] mounted rect:', r, 'canvasWidth:', canvasWidth, 'components:', components.length);
        } catch (err) {
            console.warn('[Canvas] debug error', err);
        }
    };

    useEffect(() => {
        updateRect();
        window.addEventListener('resize', updateRect);
        return () => window.removeEventListener('resize', updateRect);
    }, [canvasWidth, components.length]);

    // Usar useMemo para memorizar los componentes renderizados
    const renderedComponents = useMemo(() => {
        return components.map((comp) => (
            <CanvasItem
                key={comp.id}
                comp={comp}
                onEditComponent={onEditComponent}
                onDeleteComponent={onDeleteComponent}
                themeSettings={themeSettings}
                appliedTheme={appliedTheme}
                isPreview={isPreview}
                products={products}
                setComponents={setComponents}
                hoveredComponentId={hoveredComponentId}
                setHoveredComponentId={setHoveredComponentId}
                pageContent={pageContent}
                availableMenus={availableMenus}
                companyLogo={companyLogo}
                countries={countries}
                states={states}
                cities={cities}
                canvasRect={canvasRect}
                canvasScrollTop={scrollTop}
            />
        ));
    }, [components, themeSettings, appliedTheme, isPreview, products, hoveredComponentId, pageContent, availableMenus, companyLogo, countries, states, cities, canvasRect, scrollTop]);


    return (
        <div
            ref={canvasRef}
            className={`min-h-[400px] w-full mx-auto transition-all duration-300 ease-in-out rounded-lg ${isPreview ? 'border-transparent' : 'border-dashed border-gray-300'} relative`}
            onScroll={handleScroll}
            style={{
                width: canvasWidth,
                backgroundImage: isPreview ? 'none' : 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                overflow: 'auto',
                height: '100%',
                // Cambiar estos valores:
                position: 'relative',
                zIndex: 1, // Establecer un z-index base
            }}
        >
            {components.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-lg font-semibold">Canvas Vacío</p>
                        <p className="text-sm">Arrastra componentes aquí o agrega nuevos</p>
                    </div>
                </div>
            ) : (
                // Agregar un wrapper para componentes no-sticky
                <div className="relative">
                    {/* Renderizar primero el header sticky si existe */}
                    {renderedComponents.filter(comp => {
                        const compData = components.find(c => c.id === comp.key);
                        return compData?.type === 'header' &&
                            compData?.content?.stickyType &&
                            compData?.content?.stickyType !== 'none';
                    })}

                    {/* Renderizar el resto de componentes */}
                    {renderedComponents.filter(comp => {
                        const compData = components.find(c => c.id === comp.key);
                        return !(compData?.type === 'header' &&
                            compData?.content?.stickyType &&
                            compData?.content?.stickyType !== 'none');
                    })}
                </div>
            )}
        </div>
    );
});

export default Canvas;
