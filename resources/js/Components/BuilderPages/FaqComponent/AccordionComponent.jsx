import React from 'react';
import { getThemeWithDefaults, resolveStyleValue } from '@/utils/themeUtils';
import ComponentWithHover from '../ComponentWithHover';
import AccordionRowComponent from './AccordionRowComponent';

const AccordionComponent = ({
    comp,
    getStyles,
    onEdit,
    onDelete,
    themeSettings,
    appliedTheme,
    isPreview,
    hoveredComponentId,
    setHoveredComponentId
}) => {
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    const rawContent = comp.content || {};
    const accordionConfig = {};
    Object.keys(rawContent).forEach(key => {
        accordionConfig[key] = resolveValue(rawContent[key]);
    });

    const children = accordionConfig.children || [];

    const getComponentTypeName = (type) => {
        const typeNames = {
            'accordionRow': 'Fila de Acordeón',
        };
        return typeNames[type] || type;
    };

    const withUnit = (value, unit = 'px') => {
        if (value === undefined || value === null || value === '') return undefined;
        if (typeof value === 'string' && isNaN(Number(value))) return value;
        return `${value}${unit}`;
    };

    const containerStyles = {
        ...getStyles(comp),
        width: '100%',
        paddingTop: withUnit(accordionConfig.paddingTop || '0px'),
        paddingRight: withUnit(accordionConfig.paddingRight || '0px'),
        paddingBottom: withUnit(accordionConfig.paddingBottom || '0px'),
        paddingLeft: withUnit(accordionConfig.paddingLeft || '0px'),
        border: accordionConfig.border === 'solid'
            ? `${withUnit(accordionConfig.borderThickness) || '1px'} solid ${resolveValue(accordionConfig.borderColor) || '#e5e7eb'}`
            : 'none',
        borderRadius: withUnit(accordionConfig.borderRadius || '0px'),
        backgroundColor: resolveValue(accordionConfig.backgroundColor) || 'transparent',
    };

    const handleMouseEnter = () => {
        if (setHoveredComponentId && !isPreview) {
            setHoveredComponentId(comp.id);
        }
    };

    const handleMouseLeave = () => {
        if (setHoveredComponentId && !isPreview) {
            setHoveredComponentId(null);
        }
    };

    return (
        <div
            style={containerStyles}
            className="group relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => !isPreview && onEdit && onEdit(comp)}
        >
            {children.map((row) => (
                <ComponentWithHover
                    key={row.id}
                    component={row}
                    isPreview={isPreview}
                    hoveredComponentId={hoveredComponentId}
                    setHoveredComponentId={setHoveredComponentId}
                    getComponentTypeName={getComponentTypeName}
                >
                    <AccordionRowComponent
                        comp={row}
                        getStyles={getStyles}
                        isPreview={isPreview}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        themeSettings={themeSettings}
                        appliedTheme={appliedTheme}
                        hoveredComponentId={hoveredComponentId}
                        setHoveredComponentId={setHoveredComponentId}
                    />
                </ComponentWithHover>
            ))}
        </div>
    );
};

export default AccordionComponent;