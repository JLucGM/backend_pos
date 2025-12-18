import React from 'react';

const HeaderCartComponent = ({ comp, getStyles, onEdit, isPreview }) => {
    const styles = getStyles(comp);
    
    const cartStyles = {
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
            alert('Ir al carrito');
        }
    };

    return (
        <button
            style={cartStyles}
            onDoubleClick={isPreview ? undefined : () => onEdit(comp)}
            onClick={handleClick}
            className={isPreview ? 'hover:opacity-80' : 'hover:opacity-80 cursor-pointer'}
            title="Carrito de compras"
        >
            <span>{comp.content || '🛒'}</span>
            {comp.count && comp.count !== '0' && (
                <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    backgroundColor: 'red',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {comp.count}
                </span>
            )}
        </button>
    );
};

export default HeaderCartComponent;