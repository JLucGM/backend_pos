import React from 'react';

const BentoTitleComponent = ({
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
    
    // Combinar estilos del componente con getStyles
    const componentStyles = {
        ...getStyles(comp),
        color: styles.color || '#000000',
        fontSize: styles.fontSize || '32px',
        fontWeight: styles.fontWeight || 'bold',
        textAlign: styles.alignment || 'center',
        width: styles.layout === 'fill' ? '100%' : 'auto',
        maxWidth: styles.layout === 'fill' ? '100%' : '800px',
        margin: '0 auto',
        padding: '0 20px',
        lineHeight: '1.2',
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
        <div 
            style={componentStyles}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={!isPreview ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        >
            {content}
        </div>
    );
};

export default BentoTitleComponent;