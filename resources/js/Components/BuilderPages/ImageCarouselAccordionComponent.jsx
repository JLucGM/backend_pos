import React, { useState, useRef, useEffect } from 'react';
import { getThemeWithDefaults, resolveStyleValue, getTextStyles, getResolvedFont } from '@/utils/themeUtils';
import { Pencil } from 'lucide-react';

const classNames = (...classes) => classes.filter(Boolean).join(' ');

const ImageCarouselAccordion = ({
    comp,
    getStyles,
    onEdit,
    isPreview,
    themeSettings,
    appliedTheme,
    mode = 'builder',
}) => {
    const rawContent = comp.content || {};
    const rawStyles = comp.styles || {};
    const [activeIndex, setActiveIndex] = useState(Math.floor((rawContent.images?.length || 0) / 2));
    const wrapperRef = useRef(null);
    const timeoutRef = useRef(null);

    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);
    const resolveValue = (value) => resolveStyleValue(value, themeWithDefaults, appliedTheme);

    const containerStyles = {};
    Object.keys(rawStyles).forEach(key => {
        containerStyles[key] = resolveValue(rawStyles[key]);
    });

    const images = rawContent.images || [];

    useEffect(() => {
        if (!wrapperRef.current) return;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        wrapperRef.current.style.setProperty('--transition', '600ms cubic-bezier(0.22, 0.61, 0.36, 1)');
        timeoutRef.current = setTimeout(() => {
            wrapperRef.current?.style.removeProperty('--transition');
        }, 900);
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [activeIndex]);

    const handleEditClick = (e) => {
        e.stopPropagation();
        if (onEdit) onEdit(comp);
    };

    // Si no hay imágenes, mostrar placeholder
    if (images.length === 0) {
        return (
            <div
                style={containerStyles}
                className="border-2 border-dashed border-gray-300 p-8 text-center cursor-pointer hover:bg-gray-50 relative"
            >
                {/* {!isPreview && mode === 'builder' && (
                    <button
                        onClick={handleEditClick}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                    >
                        <Pencil size={16} />
                    </button>
                )} */}
                <p className="text-gray-500">Haz clic en el lápiz para agregar imágenes</p>
            </div>
        );
    }

    // Calcular proporciones del grid
    const activeWidth = 48;
    const inactiveWidth = (100 - activeWidth) / (images.length - 1);
    const gridTemplateColumns = images.map((_, idx) =>
        idx === activeIndex ? `${activeWidth}fr` : `${inactiveWidth}fr`
    ).join(' ');

    // ===== ESTILOS GLOBALES =====
    // Título
    const titleTextStyle = rawContent.titleTextStyle || 'heading2';
    const titleFontSize = rawContent.titleFontSize || (titleTextStyle === 'custom' ? '32px' : themeWithDefaults[`${titleTextStyle}_fontSize`]);
    const titleFontWeight = rawContent.titleFontWeight || (titleTextStyle === 'custom' ? 'bold' : themeWithDefaults[`${titleTextStyle}_fontWeight`]);
    const titleLineHeight = rawContent.titleLineHeight || (titleTextStyle === 'custom' ? '1.2' : themeWithDefaults[`${titleTextStyle}_lineHeight`]);
    const titleTextTransform = rawContent.titleTextTransform || 'none';
    const titleColor = rawContent.titleColor || '#ffffff';
    const titleFontType = rawContent.titleFontType || 'default';
    const titleCustomFont = rawContent.titleCustomFont || '';

    // Subtítulo
    const subtitleTextStyle = rawContent.subtitleTextStyle || 'paragraph';
    const subtitleFontSize = rawContent.subtitleFontSize || (subtitleTextStyle === 'custom' ? '16px' : themeWithDefaults[`${subtitleTextStyle}_fontSize`]);
    const subtitleFontWeight = rawContent.subtitleFontWeight || (subtitleTextStyle === 'custom' ? 'normal' : themeWithDefaults[`${subtitleTextStyle}_fontWeight`]);
    const subtitleLineHeight = rawContent.subtitleLineHeight || (subtitleTextStyle === 'custom' ? '1.6' : themeWithDefaults[`${subtitleTextStyle}_lineHeight`]);
    const subtitleTextTransform = rawContent.subtitleTextTransform || 'none';
    const subtitleColor = rawContent.subtitleColor || '#e5e7eb';
    const subtitleFontType = rawContent.subtitleFontType || 'default';
    const subtitleCustomFont = rawContent.subtitleCustomFont || '';

    // Borde de imagen
    const borderWidth = rawContent.borderWidth || '0';
    const borderStyle = rawContent.borderStyle || 'solid';
    const borderColor = rawContent.borderColor || themeWithDefaults.borders;
    const borderRadius = rawContent.borderRadius || '0';

    // Función auxiliar para resolver fuentes
    const getFontFamily = (fontType, customFont, defaultFontKey = 'body_font') => {
        if (fontType === 'default') {
            return getResolvedFont(themeWithDefaults, defaultFontKey, appliedTheme);
        }
        if (fontType === 'custom' && customFont) {
            return customFont;
        }
        return getResolvedFont(themeWithDefaults, fontType, appliedTheme);
    };

    // Estilos de título
    const titleStyles = {
        fontFamily: getFontFamily(titleFontType, titleCustomFont, 'heading_font'),
        fontSize: titleFontSize.toString().includes('rem') ? titleFontSize : `${parseInt(titleFontSize)}px`,
        fontWeight: titleFontWeight,
        lineHeight: titleLineHeight,
        textTransform: titleTextTransform,
        color: resolveValue(titleColor),
        textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
    };

    // Estilos de subtítulo
    const subtitleStyles = {
        fontFamily: getFontFamily(subtitleFontType, subtitleCustomFont, 'body_font'),
        fontSize: subtitleFontSize.toString().includes('rem') ? subtitleFontSize : `${parseInt(subtitleFontSize)}px`,
        fontWeight: subtitleFontWeight,
        lineHeight: subtitleLineHeight,
        textTransform: subtitleTextTransform,
        color: resolveValue(subtitleColor),
    };

    // Estilos del contenedor de imagen (borde)
    const imageContainerStyles = {
        border: borderWidth !== '0' ? `${parseInt(borderWidth)}px ${borderStyle} ${resolveValue(borderColor)}` : 'none',
        borderRadius: `${parseInt(borderRadius)}px`,
        overflow: 'hidden',
    };

    return (
        <div style={containerStyles} className="w-full font-sans relative">
            {/* {!isPreview && mode === 'builder' && (
                <button
                    onClick={handleEditClick}
                    className="absolute top-4 right-4 z-20 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-opacity opacity-70 hover:opacity-100"
                    title="Editar carrusel"
                >
                    <Pencil size={18} />
                </button>
            )} */}

            <div className="w-full p-4 sm:p-6 md:p-8">
                <div
                    ref={wrapperRef}
                    className="grid w-full gap-[1.5%] md:h-[640px]"
                    style={{
                        gridTemplateColumns,
                        transition: 'grid-template-columns var(--transition, 300ms ease)',
                    }}
                >
                    {images.map((image, index) => (
                        <div
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveIndex(index);
                            }}
                            className="relative group cursor-pointer overflow-hidden rounded-2xl bg-black shadow-2xl transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:z-10 transform-gpu"
                            style={imageContainerStyles}
                        >
                            <img
                                className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out"
                                style={{
                                    filter: activeIndex === index ? 'grayscale(0)' : 'grayscale(1)',
                                    transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                                }}
                                src={image.src}
                                alt={image.title || ''}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/590x640?text=Sin+imagen';
                                }}
                            />
                            <div
                                className={classNames(
                                    'absolute inset-0 transition-opacity duration-500',
                                    activeIndex === index ? 'opacity-100' : 'opacity-0',
                                    'bg-gradient-to-t from-black/70 via-black/30 to-transparent'
                                )}
                            />
                            <div
                                className={classNames(
                                    'absolute bottom-0 left-0 w-full p-6 text-white transition-[transform,opacity] duration-700 ease-in-out md:p-8',
                                    activeIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                )}
                            >
                                {image.subtitle && (
                                    <p className="text-sm font-light uppercase tracking-widest md:text-base" style={subtitleStyles}>
                                        {image.subtitle}
                                    </p>
                                )}
                                {image.title && (
                                    <p className="text-2xl font-bold tracking-tight md:text-5xl" style={titleStyles}>
                                        {image.title}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageCarouselAccordion;