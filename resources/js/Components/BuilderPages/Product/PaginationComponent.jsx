import React from 'react';

const PaginationComponent = ({ comp = {}, currentPage = 1, totalPages = 1, onChange = () => {} }) => {
    const styles = comp.styles || {};
    const handlePrev = () => onChange(Math.max(1, currentPage - 1));
    const handleNext = () => onChange(Math.min(totalPages, currentPage + 1));

    const btnStyle = {
        borderRadius: styles.borderRadius || '4px',
        background: styles.background || '#fff',
        border: styles.border ? `${styles.borderThickness || '1px'} solid ${styles.borderColor || '#000'}` : 'none',
        padding: '6px 10px',
        cursor: 'pointer',
    };

    return (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', padding: '12px 0' }}>
            <button style={btnStyle} onClick={handlePrev} disabled={currentPage <= 1}>Anterior</button>
            <span style={{ alignSelf: 'center' }}>{currentPage} / {totalPages}</span>
            <button style={btnStyle} onClick={handleNext} disabled={currentPage >= totalPages}>Siguiente</button>
        </div>
    );
};

export default PaginationComponent;
