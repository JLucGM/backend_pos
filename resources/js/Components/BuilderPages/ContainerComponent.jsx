// components/BuilderPages/components/ContainerComponent.jsx
import React from 'react';
import CanvasItem from './CanvasItem';

const ContainerComponent = ({ 
    comp, 
    getStyles, 
    onEdit, 
    onDelete, 
    themeSettings, 
    isPreview, 
    products, 
    setComponents,
    hoveredComponentId,
    setHoveredComponentId 
}) => {
    const containerStyles = {
        ...getStyles(comp),
        border: isPreview ? 'none' : '2px dashed #ccc',
        minHeight: '50px',
        // padding: '10px',
        borderRadius: 8,
        backgroundColor: comp.styles?.backgroundColor || 'transparent',
        position: 'relative',
    };

    const handleDeleteChild = (childId) => {
        setComponents((prev) => {
            const updateComponentChildren = (components) => {
                return components.map((c) => {
                    if (c.id === comp.id && c.content) {
                        return {
                            ...c,
                            content: c.content.filter((sc) => sc.id !== childId)
                        };
                    }
                    if (c.type === 'container' && c.content) {
                        return {
                            ...c,
                            content: updateComponentChildren(c.content)
                        };
                    }
                    return c;
                });
            };
            const updated = updateComponentChildren(prev);
            return updated;
        });
    };

    return (
        <div
            style={containerStyles}
            className="group relative"
            onMouseEnter={() => setHoveredComponentId(comp.id)}
            onMouseLeave={() => setHoveredComponentId(null)}
        >
            {/* Los hijos */}
            {comp.content && comp.content.map((subComp) => (
                <CanvasItem
                    key={subComp.id}
                    comp={subComp}
                    onEditComponent={onEdit}
                    onDeleteComponent={handleDeleteChild}
                    themeSettings={themeSettings}
                    isPreview={isPreview}
                    products={products}
                    setComponents={setComponents}
                    hoveredComponentId={hoveredComponentId}
                    setHoveredComponentId={setHoveredComponentId}
                />
            ))}

            {(!comp.content || comp.content.length === 0) && !isPreview && (
                <div 
                    className="text-center text-gray-400 py-8 border-2 border-dashed border-gray-300 rounded cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        // console.log('🔵 Empty container click');
                        onEdit();
                    }}
                >
                    <p>Contenedor vacío</p>
                    <p className="text-sm">Arrastra componentes aquí desde el árbol</p>
                    <p className="text-xs mt-2">Haz clic para editar el contenedor</p>
                </div>
            )}
        </div>
    );
};

export default ContainerComponent;