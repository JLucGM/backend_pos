import React from 'react';

const BentoFeatureTitleComponent = ({
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
        color: styles.color || '#1f2937',
        fontSize: styles.fontSize || '20px',
        fontWeight: styles.fontWeight || '600',
        textAlign: styles.alignment || 'left',
        width: styles.layout === 'fill' ? '100%' : 'auto',
        margin: '0 0 12px 0',
        lineHeight: '1.3',
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
        <h3 
            style={componentStyles}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={!isPreview ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        >
            {content}
        </h3>
    );
};

export default BentoFeatureTitleComponent;