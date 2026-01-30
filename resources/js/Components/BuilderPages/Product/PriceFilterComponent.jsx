import React from 'react';

const PriceFilterComponent = ({ comp = {}, minPrice, maxPrice, setMinPrice, setMaxPrice }) => {
    const styles = comp.styles || {};
    const inputStyle = {
        borderRadius: styles.borderRadius || '4px',
        padding: '6px 8px',
        border: styles.border ? `${styles.borderThickness || '1px'} solid ${styles.borderColor || '#ccc'}` : '1px solid #ccc',
        background: styles.background || '#fff',
    };

    return (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
                placeholder="Precio mínimo"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                style={inputStyle}
            />
            <input
                placeholder="Precio máximo"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                style={inputStyle}
            />
        </div>
    );
};

export default PriceFilterComponent;
