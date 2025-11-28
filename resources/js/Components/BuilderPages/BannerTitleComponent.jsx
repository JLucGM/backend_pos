// components/BuilderPages/components/BannerTitleComponent.jsx
import React from 'react';

const BannerTitleComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    onDelete
}) => {
    const styles = comp.styles || {};
    
    const componentStyles = {
        color: styles.color || '#000000',
        fontSize: styles.fontSize || '32px',
        fontWeight: styles.fontWeight || 'bold',
        backgroundColor: styles.background !== 'transparent' ? 
            `rgba(${hexToRgb(styles.background)}, ${styles.backgroundOpacity || '1'})` : 'transparent',
        borderRadius: styles.borderRadius || '0px',
        paddingTop: styles.paddingTop || '10px',
        paddingRight: styles.paddingRight || '10px',
        paddingBottom: styles.paddingBottom || '10px',
        paddingLeft: styles.paddingLeft || '10px',
        textAlign: styles.alignment || 'center',
        margin: 0,
        width: styles.layout === 'fill' ? '100%' : 'auto',
    };

    function hexToRgb(hex) {
        const longHex = hex.length === 4 ? 
            `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex;
        
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(longHex);
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
            : '0, 0, 0';
    }

    return (
        <div style={componentStyles}>
            {comp.content}
        </div>
    );
};

export default BannerTitleComponent;