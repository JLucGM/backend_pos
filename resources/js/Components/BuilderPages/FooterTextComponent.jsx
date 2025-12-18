import React from 'react';

const FooterTextComponent = ({ comp, getStyles, onEdit, isPreview, themeSettings }) => {
    const styles = getStyles(comp);
    
    const footerStyles = {
        ...styles,
        fontSize: comp.styles?.fontSize || '14px',
        color: comp.styles?.color || '#666666',
        lineHeight: comp.styles?.lineHeight || '1.5',
        marginBottom: comp.styles?.marginBottom || '10px',
        fontFamily: themeSettings?.body_font || "'Inter', sans-serif"
    };

    return (
        <div
            style={footerStyles}
            onDoubleClick={isPreview ? undefined : () => onEdit(comp)}
            className={isPreview ? '' : 'hover:opacity-80 cursor-pointer'}
        >
            {comp.content || 'Texto del footer'}
        </div>
    );
};

export default FooterTextComponent;