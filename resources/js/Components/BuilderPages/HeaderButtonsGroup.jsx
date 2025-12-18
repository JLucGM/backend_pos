import React from 'react';
import CanvasItem from './CanvasItem';

const HeaderButtonsGroup = ({ 
    comp, 
    getStyles, 
    onEdit, 
    onDelete, 
    isPreview, 
    themeSettings,
    appliedTheme,
    setComponents,
    hoveredComponentId,
    setHoveredComponentId
}) => {
    const styles = getStyles(comp);
    const content = comp.content || {};
    const customStyles = comp.styles || {};
    
    const groupStyles = {
        ...styles,
        display: 'flex',
        alignItems: 'center',
        gap: customStyles.gap || '10px',
    };

    // Filtrar botones visibles (excluir search si está oculto)
    const visibleButtons = content.buttons ? content.buttons.filter(button => {
        if (button.type === 'headerSearch' && !content.showSearch) {
            return false;
        }
        return true;
    }) : [];

    return (
        <div
            style={groupStyles}
            onDoubleClick={isPreview ? undefined : () => onEdit(comp)}
            className={isPreview ? '' : 'hover:opacity-80 cursor-pointer'}
        >
            {visibleButtons.map(button => (
                <CanvasItem
                    key={button.id}
                    comp={button}
                    onEditComponent={onEdit}
                    onDeleteComponent={onDelete}
                    themeSettings={themeSettings}
                    appliedTheme={appliedTheme}
                    isPreview={isPreview}
                    setComponents={setComponents}
                    hoveredComponentId={hoveredComponentId}
                    setHoveredComponentId={setHoveredComponentId}
                />
            ))}
        </div>
    );
};

export default HeaderButtonsGroup;