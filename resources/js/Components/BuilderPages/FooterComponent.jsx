import React from 'react';
import CanvasItem from './CanvasItem';

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
    setHoveredComponentId
}) => {
    const footerStyles = getStyles(comp);
    const customStyles = comp.styles || {};
    const content = comp.content || {};
    
    // Estilos del contenedor principal del footer
    const containerStyles = {
        ...footerStyles,
        width: '100%',
        backgroundColor: customStyles.backgroundColor || '#f8fafc',
        paddingTop: customStyles.paddingTop || '40px',
        paddingRight: customStyles.paddingRight || '20px',
        paddingBottom: customStyles.paddingBottom || '40px',
        paddingLeft: customStyles.paddingLeft || '20px',
        borderTop: customStyles.borderTop || '1px solid #e5e7eb'
    };

    // Renderizar los hijos del footer
    const renderChildren = () => {
        if (!content?.children || !Array.isArray(content.children)) {
            return null;
        }

        const columns = content.columns || 3;
        const layout = content.layout || 'grid';
        
        if (layout === 'grid') {
            return (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gap: '20px',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {content.children.map(child => (
                        <CanvasItem
                            key={child.id}
                            comp={child}
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
        } else {
            // Layout flex
            return (
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    gap: '20px',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {content.children.map(child => (
                        <div key={child.id} style={{ flex: '1 0 200px' }}>
                            <CanvasItem
                                comp={child}
                                onEditComponent={onEdit}
                                onDeleteComponent={onDelete}
                                themeSettings={themeSettings}
                                appliedTheme={appliedTheme}
                                isPreview={isPreview}
                                setComponents={setComponents}
                                hoveredComponentId={hoveredComponentId}
                                setHoveredComponentId={setHoveredComponentId}
                            />
                        </div>
                    ))}
                </div>
            );
        }
    };

    // Renderizar redes sociales si están habilitadas
    const renderSocialMedia = () => {
        if (!content?.socialMedia?.show) return null;
        
        const social = content.socialMedia;
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '15px',
                marginTop: '20px'
            }}>
                {social.facebook && (
                    <a href={social.facebook} target="_blank" rel="noopener noreferrer">
                        Facebook
                    </a>
                )}
                {social.twitter && (
                    <a href={social.twitter} target="_blank" rel="noopener noreferrer">
                        Twitter
                    </a>
                )}
                {social.instagram && (
                    <a href={social.instagram} target="_blank" rel="noopener noreferrer">
                        Instagram
                    </a>
                )}
                {social.linkedin && (
                    <a href={social.linkedin} target="_blank" rel="noopener noreferrer">
                        LinkedIn
                    </a>
                )}
            </div>
        );
    };

    // Renderizar texto de copyright si está habilitado
    const renderCopyright = () => {
        if (!content?.showCopyright) return null;
        
        return (
            <div style={{
                textAlign: 'center',
                marginTop: '30px',
                paddingTop: '20px',
                borderTop: '1px solid #e5e7eb',
                fontSize: '14px',
                color: '#666666'
            }}>
                {content.copyrightText || '© 2023 Mi Empresa. Todos los derechos reservados.'}
            </div>
        );
    };

    return (
        <footer
            style={containerStyles}
            onDoubleClick={isPreview ? undefined : () => onEdit(comp)}
            className={isPreview ? '' : 'hover:opacity-80 cursor-pointer'}
        >
            {renderChildren()}
            {renderSocialMedia()}
            {renderCopyright()}
        </footer>
    );
};

export default FooterComponent;