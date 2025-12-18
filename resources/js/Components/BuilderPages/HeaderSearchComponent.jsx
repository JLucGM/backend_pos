import React from 'react';

const HeaderSearchComponent = ({ comp, getStyles, onEdit, isPreview }) => {
    const styles = getStyles(comp);
    
    const searchStyles = {
        ...styles,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: 'none',
        outline: 'none',
        background: 'transparent',
    };

    const handleClick = () => {
        if (isPreview) {
            // Acción al hacer clic en preview
            alert('Abrir buscador');
        }
    };

    return (
        <button
            style={searchStyles}
            onDoubleClick={isPreview ? undefined : () => onEdit(comp)}
            onClick={handleClick}
            className={isPreview ? 'hover:opacity-80' : 'hover:opacity-80 cursor-pointer'}
            title="Buscar"
        >
            {comp.content || '🔍'}
        </button>
    );
};

export default HeaderSearchComponent;