import React, { useState } from 'react';
import { getThemeWithDefaults, resolveStyleValue } from '@/utils/themeUtils';
import ComponentWithHover from '../ComponentWithHover';
import TextComponent from '../TextComponent';
import { ChevronDown, ChevronUp } from 'lucide-react';



const AccordionRowComponent = ({
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
    const [isOpen, setIsOpen] = useState(false);
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);
    const resolveValue = (value) => resolveStyleValue(value, themeWithDefaults, appliedTheme);

    const rawContent = comp.content || {};
    const rowConfig = {};
    Object.keys(rawContent).forEach(key => {
        rowConfig[key] = resolveValue(rawContent[key]);
    });
    const children = rowConfig.children || [];

    const questionComponent = children[0];
    const answerComponent = children[1];

    const toggleOpen = () => setIsOpen(!isOpen);

    const handleMouseEnter = () => {
        if (setHoveredComponentId && !isPreview) setHoveredComponentId(comp.id);
    };
    const handleMouseLeave = () => {
        if (setHoveredComponentId && !isPreview) setHoveredComponentId(null);
    };

    // Helper para unidades
    const withUnit = (value, unit = 'px') => {
        if (value === undefined || value === null || value === '') return undefined;
        if (typeof value === 'string' && isNaN(Number(value))) return value;
        return `${value}${unit}`;
    };

    // Estilos del contenedor: combina getStyles(comp) con propiedades de rowConfig
    const rowStyles = {
        ...getStyles(comp),
        paddingTop: withUnit(rowConfig.paddingTop || '0px'),
        paddingRight: withUnit(rowConfig.paddingRight || '0px'),
        paddingBottom: withUnit(rowConfig.paddingBottom || '0px'),
        paddingLeft: withUnit(rowConfig.paddingLeft || '0px'),
        backgroundColor: resolveValue(rowConfig.backgroundColor) || 'transparent',
        borderBottom: '1px solid #e5e7eb',
        marginBottom: '8px',
    };

    return (
        <div
            style={rowStyles}
            className="group relative cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => !isPreview && onEdit && onEdit(comp)}  // ← Abre el diálogo de la fila
        >
            {/* Cabecera de la fila (pregunta) */}
            <div
                className="flex justify-between items-center py-2"
                onClick={(e) => { e.stopPropagation(); toggleOpen(); }} // Evita abrir el diálogo al hacer clic en la flecha
            >
                <div className="flex-1">
                    {questionComponent && (
                        <ComponentWithHover
                            component={questionComponent}
                            isPreview={isPreview}
                            hoveredComponentId={hoveredComponentId}
                            setHoveredComponentId={setHoveredComponentId}
                            getComponentTypeName={(type) => type}
                        >
                            <TextComponent
                                comp={questionComponent}
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
                <button className="p-1" onClick={(e) => e.stopPropagation()}>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>

            {/* Cuerpo de la fila (respuesta) */}
            {isOpen && (
                <div className="pb-4">
                    {answerComponent ? (
                        <ComponentWithHover
                            component={answerComponent}
                            isPreview={isPreview}
                            hoveredComponentId={hoveredComponentId}
                            setHoveredComponentId={setHoveredComponentId}
                            getComponentTypeName={(type) => type}
                        >
                            <TextComponent
                                comp={answerComponent}
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
                    ) : (
                        <div className="text-gray-400">Haz clic para agregar respuesta</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AccordionRowComponent;