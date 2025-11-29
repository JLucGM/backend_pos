import React from 'react';

const CarouselNameComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    onDelete
}) => {
    const styles = comp.styles || {};
    
    const componentStyles = {
        color: styles.color || '#000000',
        fontSize: styles.fontSize || '16px',
        fontWeight: styles.fontWeight || '600',
        textAlign: styles.alignment || 'left',
        margin: '10px 0 5px 0',
        padding: '0 10px',
        width: styles.layout === 'fill' ? '100%' : 'auto',
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
            {comp.content || (
                <span className="text-gray-400 italic">
                    Nombre del producto (se obtiene de la base de datos)
                </span>
            )}
        </div>
    );
};

export default CarouselNameComponent;