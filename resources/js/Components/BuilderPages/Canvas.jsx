// components/BuilderPages/Canvas.jsx
import React, { memo } from 'react';
import CanvasItem from './CanvasItem';

const Canvas = memo(({
    components,
    onEditComponent,
    onDeleteComponent,
    themeSettings,  // Recibe themeSettings desde Builder
    appliedTheme,   // Nuevo: recibe el objeto tema completo
    products,
    setComponents,
    canvasWidth,
    hoveredComponentId,
    setHoveredComponentId,
    isPreview = false,
    pageContent
}) => {

    // Estilos del contenedor basados en el tema
    const containerStyles = {
        backgroundColor: themeSettings?.background ?
            `hsl(${themeSettings.background})` :
            (isPreview ? 'transparent' : '#f3f4f6'),
        fontFamily: themeSettings?.fontFamily || 'inherit',
        color: themeSettings?.foreground ?
            `hsl(${themeSettings.foreground})` : 'inherit',
    };

    return (
        <div
            className={`min-h-[400px] w-full mx-auto transition-all duration-300 ease-in-out rounded-lg ${isPreview ? 'border-transparent' : 'border-dashed border-gray-300'} relative`}
            style={{
                width: canvasWidth,
                backgroundImage: isPreview ? 'none' : 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                ...containerStyles,
            }}
        >
            {components.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center" style={{ color: themeSettings?.foreground ? `hsl(${themeSettings.foreground})` : '#6b7280' }}>
                        <p className="text-lg font-semibold">Canvas Vacío</p>
                        <p className="text-sm">Arrastra componentes aquí o agrega nuevos</p>
                        {appliedTheme?.name && (
                            <p className="text-xs mt-2">
                                Tema aplicado: <span className="font-medium">{appliedTheme.name}</span>
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                components.map((comp) => (
                    <CanvasItem
                        key={comp.id}
                        comp={comp}
                        onEditComponent={onEditComponent}
                        onDeleteComponent={onDeleteComponent}
                        themeSettings={themeSettings}
                        appliedTheme={appliedTheme}  // Pasar el tema aplicado
                        isPreview={isPreview}
                        products={products}
                        setComponents={setComponents}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                        pageContent={pageContent}
                    />
                ))
            )}
        </div>
    );
});

export default Canvas;