// components/Builder/components/MarqueeTextComponent.jsx
import React, { useState, useRef, useEffect } from 'react';
import { getThemeWithDefaults, getComponentStyles, getResolvedFont, resolveStyleValue } from '@/utils/themeUtils';

const MarqueeTextComponent = ({ comp, getStyles, onEdit, isPreview, themeSettings, appliedTheme }) => {
    // Obtener configuración del tema con valores por defecto
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // Obtener estilos específicos del componente marquee del tema
    const themeMarqueeStyles = getComponentStyles(themeWithDefaults, 'marquee', appliedTheme);

    const [isPaused, setIsPaused] = useState(false);
    const marqueeRef = useRef(null);
    const contentRef = useRef(null);
    const containerRef = useRef(null);

    // ===========================================
    // FUNCIÓN PARA RESOLVER REFERENCIAS
    // ===========================================
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    // Resolver estilos personalizados
    const rawStyles = comp.styles || {};
    const styles = {};
    Object.keys(rawStyles).forEach(key => {
        styles[key] = resolveValue(rawStyles[key]);
    });

    // Resolver contenido (si es necesario)
    const rawContent = comp.content;
    const resolvedContent = resolveValue(rawContent);

    // Helper para añadir unidad (px) si es solo número
    const withUnit = (value, unit = 'px') => {
        if (value === undefined || value === null || value === '') return undefined;
        // Si ya es string y tiene algun caracter no numerico (como px, %, rem), devolver tal cual
        if (typeof value === 'string' && isNaN(Number(value))) return value;
        return `${value}${unit}`;
    };

    const getMarqueeStyles = () => {
        const baseStyles = getStyles(comp);

        // Padding individual usando valores del tema como fallback (resueltos)
        const paddingTop = styles.paddingTop || themeWithDefaults.marquee_paddingTop || '10px';
        const paddingRight = styles.paddingRight || '0px';
        const paddingBottom = styles.paddingBottom || themeWithDefaults.marquee_paddingBottom || '10px';
        const paddingLeft = styles.paddingLeft || '0px';

        // Layout: fit (ancho natural) o fill (ancho 100%)
        const layout = styles.layout || 'fill';
        const width = layout === 'fill' ? '100%' : 'auto';

        // Estilos de texto usando valores del tema (resueltos)
        const fontSize = styles.fontSize || themeWithDefaults.marquee_fontSize || '16px';
        const fontSizeUnit = styles.fontSizeUnit || (fontSize?.toString().includes('rem') ? 'rem' : 'px');
        const fontWeight = styles.fontWeight || themeWithDefaults.marquee_fontWeight || 'normal';
        const color = styles.color || themeWithDefaults.marquee_color || themeWithDefaults.text;
        const backgroundColor = styles.backgroundColor || themeWithDefaults.marquee_backgroundColor || 'transparent';
        const borderRadius = styles.borderRadius || themeWithDefaults.marquee_borderRadius || '0px';

        return {
            ...baseStyles,
            width,
            paddingTop: withUnit(paddingTop),
            paddingRight: withUnit(paddingRight),
            paddingBottom: withUnit(paddingBottom),
            paddingLeft: withUnit(paddingLeft),
            borderRadius: withUnit(borderRadius),
            fontSize: withUnit(fontSize, fontSizeUnit),
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
        const direction = styles.direction || 'left';
        // Resolver speed si es referencia
        const speed = resolveValue(styles.speed || 2);

        // Convertir velocidad a duración (más velocidad = menor duración)
        const duration = 20 / speed;

        return {
            display: 'inline-block',
            paddingLeft: '100%',
            animation: `marquee-${direction} ${duration}s linear infinite`,
            animationPlayState: isPaused ? 'paused' : 'running',
        };
    };

    const handleMouseEnter = () => {
        if (styles.interactive !== false) {
            setIsPaused(true);
        }
    };

    const handleMouseLeave = () => {
        if (styles.interactive !== false) {
            setIsPaused(false);
        }
    };

    // Función para obtener la fuente usando utilidades del tema
    const getFontFamily = () => {
        const fontType = styles.fontType;

        // Si el usuario seleccionó "default" o no especificó nada
        if (fontType === 'default' || !fontType) {
            return getResolvedFont(themeWithDefaults, 'body_font', appliedTheme);
        }

        if (fontType === 'custom' && styles.customFont) {
            return styles.customFont;
        }

        return getResolvedFont(themeWithDefaults, fontType, appliedTheme);
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

    // EXTRAER EL TEXTO DEL CONTENIDO (ya resuelto)
    const getTextContent = () => {
        if (!resolvedContent) return 'Texto en movimiento';

        // Si content es una cadena, devolverla directamente
        if (typeof resolvedContent === 'string') {
            return resolvedContent;
        }

        // Si content es un objeto, extraer la propiedad 'text'
        if (typeof resolvedContent === 'object' && resolvedContent !== null) {
            return resolvedContent.text || 'Texto en movimiento';
        }

        // Si es otra cosa, convertir a cadena
        return String(resolvedContent);
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
                {textContent}
            </div>
        </div>
    );
};

export default MarqueeTextComponent;