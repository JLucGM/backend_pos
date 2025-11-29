import React from 'react';

const BentoFeatureTextComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    onDelete,
    hoveredComponentId,
    setHoveredComponentId
}) => {
    const styles = comp.styles || {};
    const content = comp.content || '';
    
    const componentStyles = {
        ...getStyles(comp),
        color: styles.color || '#6b7280',
        fontSize: styles.fontSize || '16px',
        fontWeight: styles.fontWeight || '400',
        textAlign: styles.alignment || 'left',
        width: styles.layout === 'fill' ? '100%' : 'auto',
        margin: '0',
        lineHeight: '1.5',
    };

    const handleClick = () => {
        if (!isPreview && onEdit) {
            onEdit(comp);
        }
    };

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
        <p 
            style={componentStyles}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={!isPreview ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        >
            {content}
        </p>
    );
};

export default BentoFeatureTextComponent;