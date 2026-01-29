// components/Builder/components/MarqueeTextComponent.jsx
import React, { useState, useRef, useEffect } from 'react';
import { getThemeWithDefaults, getComponentStyles, getResolvedFont, hslToCss } from '@/utils/themeUtils';

const MarqueeTextComponent = ({ comp, getStyles, onEdit, isPreview, themeSettings }) => {
    // Obtener configuración del tema con valores por defecto
    const themeWithDefaults = getThemeWithDefaults(themeSettings);
    
    // Obtener estilos específicos del componente marquee del tema
    const themeMarqueeStyles = getComponentStyles(themeWithDefaults, 'marquee');
    
    const [isPaused, setIsPaused] = useState(false);
    const marqueeRef = useRef(null);
    const contentRef = useRef(null);
    const containerRef = useRef(null);

    // Función para obtener la familia de fuentes usando utilidades del tema
    const getFontFamily = () => {
        const customStyles = comp.styles || {};
        
        if (customStyles.fontFamily) {
            return customStyles.fontFamily;
        }
        
        const fontType = customStyles.fontType || 'body_font';
        return getResolvedFont(themeWithDefaults, fontType);
    };

    const getMarqueeStyles = () => {
        const baseStyles = getStyles(comp);
        const customStyles = comp.styles || {};

        // Padding individual usando valores del tema como fallback
        const paddingTop = customStyles.paddingTop || themeWithDefaults.marquee_paddingTop || '10px';
        const paddingRight = customStyles.paddingRight || '0px';
        const paddingBottom = customStyles.paddingBottom || themeWithDefaults.marquee_paddingBottom || '10px';
        const paddingLeft = customStyles.paddingLeft || '0px';

        // Layout: fit (ancho natural) o fill (ancho 100%)
        const layout = customStyles.layout || 'fill';
        const width = layout === 'fill' ? '100%' : 'auto';

        // Estilos de texto usando valores del tema
        const fontSize = customStyles.fontSize || themeWithDefaults.marquee_fontSize || '16px';
        const fontWeight = customStyles.fontWeight || themeWithDefaults.marquee_fontWeight || 'normal';
        const color = customStyles.color || themeWithDefaults.marquee_color || hslToCss(themeWithDefaults.text);
        const backgroundColor = customStyles.backgroundColor || themeWithDefaults.marquee_backgroundColor || 'transparent';
        const borderRadius = customStyles.borderRadius || themeWithDefaults.marquee_borderRadius || '0px';

        return {
            ...baseStyles,
            width,
            paddingTop,
            paddingRight,
            paddingBottom,
            paddingLeft,
            borderRadius,
            fontSize,
            fontWeight,
            color,
            backgroundColor,
            fontFamily: getFontFamily(),
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            position: 'relative',
        };
    };

    const getAnimationStyle = () => {
        const customStyles = comp.styles || {};
        const direction = customStyles.direction || 'left';
        const speed = customStyles.speed || 2;

        // Convertir velocidad a duración (más velocidad = menor duración)
        const duration = 20 / speed; // 20 segundos base dividido por la velocidad

        return {
            display: 'inline-block',
            paddingLeft: '100%',
            animation: `marquee-${direction} ${duration}s linear infinite`,
            animationPlayState: isPaused ? 'paused' : 'running',
        };
    };

    const handleMouseEnter = () => {
        if (comp.styles?.interactive !== false) {
            setIsPaused(true);
        }
    };

    const handleMouseLeave = () => {
        if (comp.styles?.interactive !== false) {
            setIsPaused(false);
        }
    };

    // Agregar estilos CSS dinámicamente
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes marquee-left {
                0% { transform: translateX(0); }
                100% { transform: translateX(-100%); }
            }
            @keyframes marquee-right {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(0); }
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // EXTRAER EL TEXTO DEL CONTENIDO - ¡ESTO ES LO QUE FALTA!
    const getTextContent = () => {
        if (!comp.content) return 'Texto en movimiento';
        
        // Si content es una cadena, devolverla directamente
        if (typeof comp.content === 'string') {
            return comp.content;
        }
        
        // Si content es un objeto, extraer la propiedad 'text'
        if (typeof comp.content === 'object' && comp.content !== null) {
            return comp.content.text || 'Texto en movimiento';
        }
        
        // Si es otra cosa, convertir a cadena
        return String(comp.content);
    };

    const textContent = getTextContent();

    return (
        <div
            ref={containerRef}
            style={getMarqueeStyles()}
            onDoubleClick={isPreview ? undefined : () => onEdit(comp)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="marquee-container"
        >
            <div
                ref={marqueeRef}
                style={getAnimationStyle()}
            >
                {textContent} {/* ¡Usar textContent, no comp.content directamente! */}
            </div>
        </div>
    );
};

export default MarqueeTextComponent;