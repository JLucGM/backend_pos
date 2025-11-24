// components/BuilderPages/Canvas.jsx
import React, { memo } from 'react';
import CanvasItem from './CanvasItem';

const Canvas = memo(({ 
    components, 
    onEditComponent, 
    onDeleteComponent, 
    themeSettings, 
    products, 
    setComponents, 
    canvasWidth,
    hoveredComponentId,
    setHoveredComponentId 
}) => (
    <div
        className="min-h-[400px] w-full mx-auto transition-all duration-300 ease-in-out bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300 relative"
        style={{ 
            width: canvasWidth, 
            backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)', 
            backgroundSize: '20px 20px',
        }}
    >
        {components.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <p className="text-lg font-semibold">Canvas Vacío</p>
                    <p className="text-sm">Arrastra componentes aquí o agrega nuevos</p>
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
                    isPreview={false}
                    products={products}
                    setComponents={setComponents}
                    hoveredComponentId={hoveredComponentId}
                    setHoveredComponentId={setHoveredComponentId}
                />
            ))
        )}
    </div>
));

export default Canvas;