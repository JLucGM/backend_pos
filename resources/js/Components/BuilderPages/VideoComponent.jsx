// components/Builder/components/VideoComponent.jsx
import React from 'react';
import LazyVideo from './LazyVideo';
import { getThemeWithDefaults } from '@/utils/themeUtils';

const VideoComponent = ({ comp, onEdit, isPreview, themeSettings, appliedTheme, getStyles }) => {
    // Obtener configuración del tema con valores por defecto
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);
    
    // Obtener estilos base
    const baseStyles = getStyles ? getStyles(comp) : {};
    const customStyles = comp.styles || {};
    
    // Aplicar estilos del tema
    const videoStyles = {
        ...baseStyles,
        borderRadius: customStyles.borderRadius || '0px',
        borderWidth: customStyles.borderWidth || '0px',
        borderStyle: customStyles.borderStyle || 'solid',
        borderColor: customStyles.borderColor || themeWithDefaults.borders,
        backgroundColor: customStyles.backgroundColor || themeWithDefaults.background,
        padding: customStyles.padding || '0px',
        margin: customStyles.margin || '0px',
    };

    return (
        <div 
            onDoubleClick={isPreview ? undefined : () => onEdit(comp)}
            style={videoStyles}
        >
            <LazyVideo src={comp.content} title="Video" />
        </div>
    );
};

export default VideoComponent;
