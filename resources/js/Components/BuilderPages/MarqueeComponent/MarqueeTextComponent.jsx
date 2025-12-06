// components/Builder/components/MarqueeTextComponent.jsx
import React, { useState, useRef, useEffect } from 'react';

const MarqueeTextComponent = ({ comp, getStyles, onEdit, isPreview, themeSettings }) => {
    const [isPaused, setIsPaused] = useState(false);
    const marqueeRef = useRef(null);
    const contentRef = useRef(null);
    const containerRef = useRef(null);

    // Función para obtener la familia de fuentes
    const getFontFamily = () => {
        const customStyles = comp.styles || {};
        
        if (customStyles.fontFamily) {
            return customStyles.fontFamily;
        }
        
        const fontType = customStyles.fontType || 'body_font';
        switch(fontType) {
            case 'body_font':
                return themeSettings?.body_font || "'Inter', sans-serif";
            case 'heading_font':
                return themeSettings?.heading_font || "'Inter', sans-serif";
            case 'subheading_font':
                return themeSettings?.subheading_font || "'Inter', sans-serif";
            case 'accent_font':
                return themeSettings?.accent_font || "'Inter', sans-serif";
            case 'custom':
                return customStyles.customFont || "'Inter', sans-serif";
            default:
                return themeSettings?.body_font || "'Inter', sans-serif";
        }
    };

    const getMarqueeStyles = () => {
        const baseStyles = getStyles(comp);
        const customStyles = comp.styles || {};

        // Padding individual
        const paddingTop = customStyles.paddingTop || '10px';
        const paddingRight = customStyles.paddingRight || '0px';
        const paddingBottom = customStyles.paddingBottom || '10px';
        const paddingLeft = customStyles.paddingLeft || '0px';

        // Layout: fit (ancho natural) o fill (ancho 100%)
        const layout = customStyles.layout || 'fill';
        const width = layout === 'fill' ? '100%' : 'auto';

        // Estilos de texto
        const fontSize = customStyles.fontSize || '16px';
        const fontWeight = customStyles.fontWeight || 'normal';
        const color = customStyles.color || '#000000';
        const backgroundColor = customStyles.backgroundColor || 'transparent';

        const borderRadius = customStyles.borderRadius || '0px';

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
                {comp.content}
            </div>
        </div>
    );
};

export default MarqueeTextComponent;