import React from 'react';
import { getThemeWithDefaults, resolveStyleValue } from '@/utils/themeUtils';

const SortSelectComponent = ({
    comp = {},
    value,
    onChange,
    themeSettings,
    appliedTheme
}) => {
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // ===========================================
    // FUNCIÓN PARA RESOLVER REFERENCIAS
    // ===========================================
    const resolveValue = (val) => resolveStyleValue(val, themeWithDefaults, appliedTheme);

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

    // Estilo del select (manteniendo la lógica original del flag `border`)
    const selectStyle = {
        borderRadius,
        padding: '6px 8px',
        border: styles.border
            ? `${borderThickness} solid ${borderColor}`
            : '1px solid #ccc',
        // background,
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