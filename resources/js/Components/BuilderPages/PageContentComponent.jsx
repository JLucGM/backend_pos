import React from 'react';

const PageContentComponent = ({
    comp,
    getStyles,
    isPreview,
    hoveredComponentId,
    setHoveredComponentId,
    pageContent // ← Recibir el contenido real de la página
}) => {

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

    // Estilos para el contenedor del contenido
    const containerStyles = {
        ...getStyles(comp),
        width: '100%',
        backgroundColor: comp.styles?.backgroundColor,
        // padding: '20px',
        // backgroundColor: '#ffffff',
        border: isPreview ? 'none' : '1px dashed #ddd',
        // borderRadius: '8px',
        // minHeight: '100px'
    };

    return (
        <div
            style={containerStyles}
            className="page-content-component"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >

            {/* Mostrar el contenido real de la página */}
            {pageContent ? (
                <div
                    className="page-content prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: pageContent }}
                />
            ) : (
                <div className="text-center text-gray-500 py-8">
                    <p>No hay contenido disponible para esta página</p>
                </div>
            )}
        </div>
    );
};

export default PageContentComponent;
