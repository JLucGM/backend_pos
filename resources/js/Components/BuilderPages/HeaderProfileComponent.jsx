import React from 'react';

const HeaderProfileComponent = ({ comp, getStyles, onEdit, isPreview }) => {
    const styles = getStyles(comp);
    
    const profileStyles = {
        ...styles,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: 'none',
        outline: 'none',
    };

    const handleClick = () => {
        if (isPreview) {
            // Acción al hacer clic en preview
            alert('Ir al perfil');
        }
    };

    return (
        <button
            style={profileStyles}
            onDoubleClick={isPreview ? undefined : () => onEdit(comp)}
            onClick={handleClick}
            className={isPreview ? 'hover:opacity-80' : 'hover:opacity-80 cursor-pointer'}
            title="Perfil"
        >
            {comp.content || '👤'}
        </button>
    );
};

export default HeaderProfileComponent;