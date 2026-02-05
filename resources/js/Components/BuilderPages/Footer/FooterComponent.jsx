// components/BuilderPages/FooterComponent.jsx
import React from 'react';
import FooterMenuComponent from './FooterMenuComponent';
import TextComponent from '../TextComponent'; 
import { getThemeWithDefaults, getComponentStyles } from '@/utils/themeUtils';

const FooterComponent = ({
    comp,
    getStyles,
    onEdit,
    onDelete,
    isPreview,
    themeSettings,
    appliedTheme,
    setComponents,
    hoveredComponentId,
    setHoveredComponentId,
    mode = 'frontend',
    availableMenus = []
}) => {
    const styles = getStyles(comp);
    const content = comp.content || {};
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);
    const themeFooterStyles = getComponentStyles(themeWithDefaults, 'footer', appliedTheme);

    // Determinar si estamos en modo de edición
    const isEditable = mode === 'builder' && !isPreview;

    // Estilos del contenedor principal del footer con valores del tema
    const containerStyles = {
        ...styles,
        width: '100%',
        backgroundColor: styles.backgroundColor || themeFooterStyles.backgroundColor,
        padding: '40px 20px',
    };

    // Obtener los hijos del footer
    const children = content.children || [];

    return (
        <footer
            style={containerStyles}
            onDoubleClick={isEditable ? () => onEdit(comp) : undefined}
            className={isEditable ? 'hover:opacity-80 cursor-pointer' : ''}
        >
            {/* Grid de columnas */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${content.columns || 3}, 1fr)`,
                gap: '40px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {children.map(child => {
                    // Renderizar según el tipo de componente hijo
                    if (child.type === 'footerMenu') {
                        return (
                            <div key={child.id}>
                                <FooterMenuComponent
                                    comp={child}
                                    getStyles={getStyles}
                                    onEdit={onEdit}
                                    isPreview={isPreview}
                                    themeSettings={themeSettings}
                                    appliedTheme={appliedTheme}
                                    availableMenus={availableMenus}
                                    mode={mode}
                                />
                            </div>
                        );
                    } else if (child.type === 'text') {
                        return (
                            <div key={child.id}>
                                <TextComponent
                                    comp={child}
                                    getStyles={getStyles}
                                    themeSettings={themeSettings}
                                    appliedTheme={appliedTheme}
                                    isPreview={isPreview}
                                />
                            </div>
                        );
                    }
                    return null;
                })}
            </div>

            {/* Copyright con valores del tema */}
            {content.showCopyright && (
                <div style={{
                    textAlign: 'center',
                    marginTop: '40px',
                    paddingTop: '20px',
                    borderTop: `1px solid ${themeWithDefaults.borders}`,
                    color: themeWithDefaults.text,
                    fontSize: '14px'
                }}>
                    {content.copyrightText || '© 2023 Mi Empresa. Todos los derechos reservados.'}
                </div>
            )}
        </footer>
    );
};

export default FooterComponent;
