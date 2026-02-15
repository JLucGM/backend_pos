import React from 'react';
import { getThemeWithDefaults, resolveStyleValue } from '@/utils/themeUtils';

const PaginationComponent = ({
    comp = {},
    currentPage = 1,
    totalPages = 1,
    onChange = () => {},
    themeSettings,
    appliedTheme
}) => {
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // ===========================================
    // FUNCIÓN PARA RESOLVER REFERENCIAS
    // ===========================================
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    // Resolver estilos personalizados
    const rawStyles = comp.styles || {};
    const styles = {};
    Object.keys(rawStyles).forEach(key => {
        styles[key] = resolveValue(rawStyles[key]);
    });

    const handlePrev = () => onChange(Math.max(1, currentPage - 1));
    const handleNext = () => onChange(Math.min(totalPages, currentPage + 1));

    // Valores resueltos (con fallbacks)
    const borderRadius = resolveValue(styles.borderRadius || '4px');
    const background = resolveValue(styles.background || '#fff');
    const borderThickness = resolveValue(styles.borderThickness || '1px');
    const borderColor = resolveValue(styles.borderColor || '#000');

    const btnStyle = {
        borderRadius,
        background,
        color: resolveValue(themeWithDefaults.text),
        border: styles.border
            ? `${borderThickness} solid ${borderColor}`
            : 'none',
        padding: '6px 10px',
        cursor: 'pointer',
    };

    // Opcional: usar color del tema para el texto del contador
    const spanStyle = {
        alignSelf: 'center',
        color: resolveValue(themeWithDefaults.text) // añadimos color del tema
    };

    return (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', padding: '12px 0' }}>
            <button style={btnStyle} onClick={handlePrev} disabled={currentPage <= 1}>
                Anterior
            </button>
            <span style={spanStyle}>
                {currentPage} / {totalPages}
            </span>
            <button style={btnStyle} onClick={handleNext} disabled={currentPage >= totalPages}>
                Siguiente
            </button>
        </div>
    );
};

export default PaginationComponent;