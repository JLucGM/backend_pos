import React from 'react';

const HeaderLogoComponent = ({ comp, getStyles, onEdit, isPreview, themeSettings }) => {
    const styles = getStyles(comp);
    
    const logoStyles = {
        ...styles,
        // fontSize: comp.styles?.fontSize || '24px',
        // fontWeight: comp.styles?.fontWeight || 'bold',
        // color: comp.styles?.color || '#000000',
        // Aplicar padding individual
        paddingTop: comp.styles?.paddingTop || '0px',
        paddingRight: comp.styles?.paddingRight || '0px',
        paddingBottom: comp.styles?.paddingBottom || '0px',
        paddingLeft: comp.styles?.paddingLeft || '0px',
        // Asegurar que el logo sea un bloque en línea para que el padding funcione correctamente
        // display: 'inline-block',
    };

    return (
        <div
            style={logoStyles}
            onDoubleClick={isPreview ? undefined : () => onEdit(comp)}
            className={isPreview ? '' : 'hover:opacity-80 cursor-pointer'}
        >
            {comp.content || 'Logo'}
        </div>
    );
};

export default HeaderLogoComponent;