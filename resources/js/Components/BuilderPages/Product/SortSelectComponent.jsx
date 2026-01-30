import React from 'react';

const SortSelectComponent = ({ comp = {}, value, onChange }) => {
    const styles = comp.styles || {};
    const selectStyle = {
        borderRadius: styles.borderRadius || '4px',
        padding: '6px 8px',
        border: styles.border ? `${styles.borderThickness || '1px'} solid ${styles.borderColor || '#ccc'}` : '1px solid #ccc',
        background: styles.background || '#fff',
    };

    return (
        <select value={value} onChange={(e) => onChange(e.target.value)} style={selectStyle}>
            <option value="">Ordenar</option>
            <option value="alpha-asc">Alfabético A-Z</option>
            <option value="alpha-desc">Alfabético Z-A</option>
            <option value="price-desc">Precio: Mayor a menor</option>
            <option value="price-asc">Precio: Menor a mayor</option>
            <option value="date-new-old">Fecha: Más reciente primero</option>
            <option value="date-old-new">Fecha: Más antiguo primero</option>
        </select>
    );
};

export default SortSelectComponent;
