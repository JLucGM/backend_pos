import React, { useEffect } from 'react';
import { generateThemeCSS } from '@/utils/themeUtils';

const ThemeProvider = ({ themeSettings, children }) => {
    useEffect(() => {
        if (!themeSettings || Object.keys(themeSettings).length === 0) {
            return;
        }

        // Generar CSS del tema
        const themeCSS = generateThemeCSS(themeSettings);
        
        // Buscar si ya existe un elemento de estilo del tema
        let styleElement = document.getElementById('theme-styles');
        
        if (!styleElement) {
            // Crear nuevo elemento de estilo
            styleElement = document.createElement('style');
            styleElement.id = 'theme-styles';
            styleElement.type = 'text/css';
            document.head.appendChild(styleElement);
        }
        
        // Actualizar el contenido CSS
        styleElement.textContent = themeCSS;
        
        // Cleanup function para remover estilos cuando el componente se desmonte
        return () => {
            const existingStyle = document.getElementById('theme-styles');
            if (existingStyle) {
                existingStyle.remove();
            }
        };
    }, [themeSettings]);

    return <>{children}</>;
};

export default ThemeProvider;