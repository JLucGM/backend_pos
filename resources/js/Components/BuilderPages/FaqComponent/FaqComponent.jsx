import React from 'react';
import { getThemeWithDefaults, resolveStyleValue } from '@/utils/themeUtils';
import ComponentWithHover from '../ComponentWithHover';
import AccordionComponent from './AccordionComponent';
import HeadingComponent from '../HeadingComponent';

const FaqComponent = ({
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
    const faqConfig = {};
    Object.keys(rawContent).forEach(key => {
        faqConfig[key] = resolveValue(rawContent[key]);
    });

    const children = faqConfig.children || [];

    const getComponentTypeName = (type) => {
        const typeNames = {
            'heading': 'Título',
            'accordion': 'Acordeón',
        };
        return typeNames[type] || type;
    };

    const containerStyles = {
        ...getStyles(comp),
        width: '100%',
        backgroundColor: resolveValue(faqConfig.backgroundColor) || 'transparent',
        padding: faqConfig.padding || '40px 20px',
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

    const headingComponent = children.find(child => child.type === 'heading');
    const accordionComponent = children.find(child => child.type === 'accordion');

    return (
        <div
            style={containerStyles}
            className="group relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {headingComponent && (
                <ComponentWithHover
                    component={headingComponent}
                    isPreview={isPreview}
                    hoveredComponentId={hoveredComponentId}
                    setHoveredComponentId={setHoveredComponentId}
                    getComponentTypeName={getComponentTypeName}
                >
                    <HeadingComponent
                        comp={headingComponent}
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
            )}

            {accordionComponent && (
                <ComponentWithHover
                    component={accordionComponent}
                    isPreview={isPreview}
                    hoveredComponentId={hoveredComponentId}
                    setHoveredComponentId={setHoveredComponentId}
                    getComponentTypeName={getComponentTypeName}
                    onClick={() => !isPreview && onEdit && onEdit(comp)}
                >
                    <AccordionComponent
                        comp={accordionComponent}
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
            )}
        </div>
    );
};

export default FaqComponent;