import React from 'react';
import { getThemeWithDefaults, resolveStyleValue } from '@/utils/themeUtils';

const PriceFilterComponent = ({
    comp = {},
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
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

    // Valores resueltos (con fallbacks)
    const borderRadius = resolveValue(styles.borderRadius || '4px');
    const borderThickness = resolveValue(styles.borderThickness || '1px');
    const borderColor = resolveValue(styles.borderColor || '#ccc');
    const background = resolveValue(styles.background || '#fff');

    const inputStyle = {
        borderRadius,
        padding: '6px 8px',
        border: styles.border
            ? `${borderThickness} solid ${borderColor}`
            : '1px solid #ccc',
        background,
        // Color de texto heredado del tema (opcional)
        color: resolveValue(themeWithDefaults.text),
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