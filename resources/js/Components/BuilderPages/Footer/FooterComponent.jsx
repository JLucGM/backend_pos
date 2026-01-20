// components/BuilderPages/FooterComponent.jsx
import React from 'react';
import FooterMenuComponent from './FooterMenuComponent';
import TextComponent from '../TextComponent'; 

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

    // Determinar si estamos en modo de edición
    const isEditable = mode === 'builder' && !isPreview;

    // Estilos del contenedor principal del footer
    const containerStyles = {
        ...styles,
        width: '100%',
        backgroundColor: styles.backgroundColor || '#f9f9f9',
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
                                    isPreview={isPreview}
                                />
                            </div>
                        );
                    }
                    return null;
                })}
            </div>

            {/* Copyright */}
            {content.showCopyright && (
                <div style={{
                    textAlign: 'center',
                    marginTop: '40px',
                    paddingTop: '20px',
                    borderTop: '1px solid #e5e5e5',
                    color: '#666',
                    fontSize: '14px'
                }}>
                    {content.copyrightText || '© 2023 Mi Empresa. Todos los derechos reservados.'}
                </div>
            )}
        </footer>
    );
};

export default FooterComponent;