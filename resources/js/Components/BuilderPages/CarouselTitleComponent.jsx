import React from 'react';

const CarouselTitleComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    onDelete
}) => {
    const styles = comp.styles || {};
    
    // COMBINAR estilos del componente con getStyles
    const componentStyles = {
        ...getStyles(comp),
        color: styles.color || '#000000',
        fontSize: styles.fontSize || '24px',
        fontWeight: styles.fontWeight || 'bold',
        textAlign: styles.alignment || 'center',
        margin: 0,
        width: styles.layout === 'fill' ? '100%' : 'auto',
        // padding: '10px 0'
    };

    const handleClick = () => {
        if (!isPreview && onEdit) {
            onEdit(comp);
        }
    };

    return (
        <div 
            style={componentStyles}
            onClick={handleClick}
            className={!isPreview ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        >
            {comp.content}
        </div>
    );
};

export default CarouselTitleComponent;