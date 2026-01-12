// components/BuilderPages/FooterComponent.jsx
import React from 'react';
import FooterMenuComponent from './FooterMenuComponent'; // Importar directamente

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

    // Clasificar los componentes hijos por tipo
    const classifyChildren = () => {
        if (!content?.children || !Array.isArray(content.children)) {
            return { text1: null, menu: null, text2: null };
        }

        let text1 = null;
        let menu = null;
        let text2 = null;

        content.children.forEach(child => {
            if (child.type === 'footerText' && !text1) {
                text1 = child;
            } else if (child.type === 'footerMenu') {
                menu = child;
            } else if (child.type === 'footerText' && text1) {
                text2 = child;
            }
        });

        return { text1, menu, text2 };
    };

    const { text1, menu, text2 } = classifyChildren();

    return (
        <footer
            style={containerStyles}
            onDoubleClick={isEditable ? () => onEdit(comp) : undefined}
            className={isEditable ? 'hover:opacity-80 cursor-pointer' : ''}
        >
            {/* Mostrar columnas */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${content.columns || 3}, 1fr)`,
                gap: '40px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {/* Columna 1: Texto */}
                <div>
                    {text1 && (
                        <div
                            style={{
                                color: text1.styles?.color || '#666666',
                                fontSize: text1.styles?.fontSize || '14px',
                                lineHeight: text1.styles?.lineHeight || '1.6',
                                cursor: isEditable ? 'pointer' : 'default'
                            }}
                            onDoubleClick={isEditable ? () => onEdit(text1) : undefined}
                            className={isEditable ? 'hover:opacity-80' : ''}
                        >
                            {text1.content || 'Texto del footer'}
                        </div>
                    )}
                </div>

                {/* Columna 2: Menú - USANDO FooterMenuComponent DIRECTAMENTE */}
                <div>
                    {menu && (
                        <FooterMenuComponent
                            comp={menu} // <-- Pasar el objeto footerMenu
                            getStyles={getStyles}
                            onEdit={onEdit}
                            isPreview={isPreview}
                            themeSettings={themeSettings}
                            availableMenus={availableMenus} // <-- Pasar availableMenus
                            mode={mode} // <-- Pasar el modo
                        />
                    )}
                </div>

                {/* Columna 3: Texto */}
                <div>
                    {text2 && (
                        <div
                            style={{
                                color: text2.styles?.color || '#666666',
                                fontSize: text2.styles?.fontSize || '14px',
                                lineHeight: text2.styles?.lineHeight || '1.6',
                                cursor: isEditable ? 'pointer' : 'default'
                            }}
                            onDoubleClick={isEditable ? () => onEdit(text2) : undefined}
                            className={isEditable ? 'hover:opacity-80' : ''}
                        >
                            {text2.content || 'Texto del footer'}
                        </div>
                    )}
                </div>
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