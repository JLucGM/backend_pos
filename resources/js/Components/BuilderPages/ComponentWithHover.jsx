// components/BuilderPages/ComponentWithHover.jsx
import React from 'react';

const ComponentWithHover = ({
    component,
    children,
    isPreview,
    hoveredComponentId,
    setHoveredComponentId,
    getComponentTypeName
}) => {
    const handleMouseEnter = () => {
        if (setHoveredComponentId && !isPreview) {
            setHoveredComponentId(component.id);
        }
    };

    const handleMouseLeave = () => {
        if (setHoveredComponentId && !isPreview) {
            setHoveredComponentId(null);
        }
    };
    // console.log('Hovered Component ID:', component.type);

    return (
        <div
            className={`relative group rounded-lgs transition-all duration-200 border ${hoveredComponentId === component.id && !isPreview
                ? 'border border-blue-400 bg-blue-50'
                : 'border border-transparent'
                }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Tooltip */}
            {!isPreview && (
                <div className={`rounded-t-lg bg-blue-500 text-white text-xs px-2 py-1 transition-opacity duration-300 absolute -top-6 left-0 z-50 ${hoveredComponentId === component.id ? 'opacity-100' : 'opacity-0'
                    }`}>
                    {getComponentTypeName(component.type)}
                </div>
            )}

            {children}
        </div>
    );
};

export default ComponentWithHover;
