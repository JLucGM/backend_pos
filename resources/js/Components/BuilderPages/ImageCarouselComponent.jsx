import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getThemeWithDefaults, resolveStyleValue, getTextStyles, getResolvedFont } from '@/utils/themeUtils';
import { Pencil, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/Components/ui/button';

const classNames = (...classes) => classes.filter(Boolean).join(' ');

const ImageCarouselComponent = ({
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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slideWidth, setSlideWidth] = useState(0); // ancho de un slide + gap en píxeles
    const carouselContainerRef = useRef(null); // contenedor con overflow hidden
    const slidesContainerRef = useRef(null); // contenedor flex de los slides
    const timeoutRef = useRef(null);
    const resizeObserverRef = useRef(null);

    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);
    const resolveValue = (value) => resolveStyleValue(value, themeWithDefaults, appliedTheme);

    const containerStyles = {};
    Object.keys(rawStyles).forEach(key => {
        containerStyles[key] = resolveValue(rawStyles[key]);
    });

    const images = rawContent.images || [];
    const slidesToShow = rawContent.slidesToShow || 3;
    const autoplay = rawContent.autoplay || false;
    const autoplaySpeed = rawContent.autoplaySpeed || 3000;
    const infinite = rawContent.infinite !== false;
    const showArrows = rawContent.showArrows !== false;
    const showDots = rawContent.showDots !== false;
    const gap = rawContent.gap || 16;
    const displayMode = rawContent.displayMode || 'card';
    const aspectRatio = rawContent.aspectRatio || 'square';

    // Navegación
    const nextSlide = () => {
        if (currentIndex < images.length - slidesToShow) {
            setCurrentIndex(prev => prev + 1);
        } else if (infinite) {
            setCurrentIndex(0);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        } else if (infinite) {
            setCurrentIndex(images.length - slidesToShow);
        }
    };

    // Autoplay
    useEffect(() => {
        if (!autoplay || isPreview || images.length === 0) return;
        const interval = setInterval(nextSlide, autoplaySpeed);
        return () => clearInterval(interval);
    }, [autoplay, autoplaySpeed, currentIndex, images.length]);

    const handleEditClick = (e) => {
        e.stopPropagation();
        if (onEdit) onEdit(comp);
    };

    // ===== ESTILOS GLOBALES =====
    const titleTextStyle = rawContent.titleTextStyle || 'heading3';
    const titleFontSize = rawContent.titleFontSize || (titleTextStyle === 'custom' ? '20px' : themeWithDefaults[`${titleTextStyle}_fontSize`]);
    const titleFontWeight = rawContent.titleFontWeight || (titleTextStyle === 'custom' ? 'bold' : themeWithDefaults[`${titleTextStyle}_fontWeight`]);
    const titleLineHeight = rawContent.titleLineHeight || (titleTextStyle === 'custom' ? '1.2' : themeWithDefaults[`${titleTextStyle}_lineHeight`]);
    const titleTextTransform = rawContent.titleTextTransform || 'none';
    const titleColor = rawContent.titleColor || (displayMode === 'overlay' ? '#ffffff' : themeWithDefaults.heading);
    const titleFontType = rawContent.titleFontType || 'default';
    const titleCustomFont = rawContent.titleCustomFont || '';

    const textTextStyle = rawContent.textTextStyle || 'paragraph';
    const textFontSize = rawContent.textFontSize || (textTextStyle === 'custom' ? '14px' : themeWithDefaults[`${textTextStyle}_fontSize`]);
    const textFontWeight = rawContent.textFontWeight || (textTextStyle === 'custom' ? 'normal' : themeWithDefaults[`${textTextStyle}_fontWeight`]);
    const textLineHeight = rawContent.textLineHeight || (textTextStyle === 'custom' ? '1.6' : themeWithDefaults[`${textTextStyle}_lineHeight`]);
    const textTextTransform = rawContent.textTextTransform || 'none';
    const textColor = rawContent.textColor || (displayMode === 'overlay' ? '#e5e7eb' : themeWithDefaults.text);
    const textFontType = rawContent.textFontType || 'default';
    const textCustomFont = rawContent.textCustomFont || '';

    const cardPadding = rawContent.cardPadding || '16px';
    const cardBorderWidth = rawContent.cardBorderWidth || '0';
    const cardBorderStyle = rawContent.cardBorderStyle || 'solid';
    const cardBorderColor = rawContent.cardBorderColor || themeWithDefaults.borders;
    const cardBorderRadius = rawContent.cardBorderRadius || '8px';
    const cardBackgroundColor = rawContent.cardBackgroundColor || themeWithDefaults.background;
    const cardShadow = rawContent.cardShadow || 'none';

    const getAspectRatioPadding = () => {
        switch (aspectRatio) {
            case 'landscape': return '56.25%';
            case 'portrait': return '125%';
            default: return '100%';
        }
    };

    const getFontFamily = (fontType, customFont, defaultFontKey = 'body_font') => {
        if (fontType === 'default') {
            return getResolvedFont(themeWithDefaults, defaultFontKey, appliedTheme);
        }
        if (fontType === 'custom' && customFont) {
            return customFont;
        }
        return getResolvedFont(themeWithDefaults, fontType, appliedTheme);
    };

    const titleStyles = {
        fontFamily: getFontFamily(titleFontType, titleCustomFont, 'heading_font'),
        fontSize: titleFontSize.toString().includes('rem') ? titleFontSize : `${parseInt(titleFontSize)}px`,
        fontWeight: titleFontWeight,
        lineHeight: titleLineHeight,
        textTransform: titleTextTransform,
        color: resolveValue(titleColor),
        margin: displayMode === 'card' ? '0 0 8px 0' : 0,
        textShadow: displayMode === 'overlay' ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none',
    };

    const textStyles = {
        fontFamily: getFontFamily(textFontType, textCustomFont, 'body_font'),
        fontSize: textFontSize.toString().includes('rem') ? textFontSize : `${parseInt(textFontSize)}px`,
        fontWeight: textFontWeight,
        lineHeight: textLineHeight,
        textTransform: textTextTransform,
        color: resolveValue(textColor),
        margin: 0,
        textShadow: displayMode === 'overlay' ? '1px 1px 3px rgba(0,0,0,0.5)' : 'none',
    };

    const cardStyles = {
        padding: cardPadding,
        border: cardBorderWidth !== '0' ? `${parseInt(cardBorderWidth)}px ${cardBorderStyle} ${resolveValue(cardBorderColor)}` : 'none',
        borderRadius: `${parseInt(cardBorderRadius)}px`,
        backgroundColor: resolveValue(cardBackgroundColor),
        boxShadow: cardShadow,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    };

    // Calcular el ancho de un slide + gap para el desplazamiento
    const updateSlideWidth = useCallback(() => {
        if (slidesContainerRef.current && slidesContainerRef.current.children.length > 0) {
            const firstSlide = slidesContainerRef.current.children[0];
            const width = firstSlide.getBoundingClientRect().width;
            setSlideWidth(width + gap);
        }
    }, [gap]);

    useEffect(() => {
        updateSlideWidth();
        // Observar cambios de tamaño del contenedor
        if (carouselContainerRef.current) {
            resizeObserverRef.current = new ResizeObserver(updateSlideWidth);
            resizeObserverRef.current.observe(carouselContainerRef.current);
        }
        return () => {
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
            }
        };
    }, [updateSlideWidth, images.length, slidesToShow]);

    // Aplicar transformación en píxeles
    useEffect(() => {
        if (slidesContainerRef.current && slideWidth > 0) {
            const offset = -currentIndex * slideWidth;
            slidesContainerRef.current.style.transform = `translateX(${offset}px)`;
        }
    }, [currentIndex, slideWidth]);

    if (images.length === 0) {
        return (
            <div
                style={containerStyles}
                className="border-2 border-dashed border-gray-300 p-8 text-center cursor-pointer hover:bg-gray-50 relative"
            >
                {!isPreview && mode === 'builder' && (
                    <button
                        onClick={handleEditClick}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                    >
                        <Pencil size={16} />
                    </button>
                )}
                <p className="text-gray-500">Haz clic en el lápiz para agregar imágenes</p>
            </div>
        );
    }

    return (
        <div style={containerStyles} className="w-full relative">
            {!isPreview && mode === 'builder' && (
                <button
                    onClick={handleEditClick}
                    className="absolute top-4 right-4 z-20 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-opacity opacity-70 hover:opacity-100"
                    title="Editar carrusel"
                >
                    <Pencil size={18} />
                </button>
            )}

            <div className="w-full p-4 sm:p-6 md:p-8">
                {/* Contenedor del carrusel con overflow hidden */}
                <div ref={carouselContainerRef} className="relative overflow-hidden">
                    {showArrows && images.length > slidesToShow && (
                        <>
                            <Button
                                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/15 rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                                size="icon"
                                disabled={!infinite && currentIndex === 0}
                            >
                                <ChevronLeft size={20} />
                            </Button>
                            <Button
                                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/15 rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                                size="icon"
                                disabled={!infinite && currentIndex >= images.length - slidesToShow}
                            >
                                <ChevronRight size={20} />
                            </Button>
                        </>
                    )}

                    <div
                        ref={slidesContainerRef}
                        className="flex transition-transform duration-500 ease-in-out will-change-transform"
                        style={{ gap: `${gap}px` }}
                    >
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0"
                                style={{
                                    width: `calc((100% - ${(slidesToShow - 1) * gap}px) / ${slidesToShow})`,
                                }}
                            >
                                {displayMode === 'overlay' ? (
                                    <div
                                        style={{
                                            ...cardStyles,
                                            position: 'relative',
                                            padding: 0,
                                            overflow: 'hidden',
                                            backgroundColor: 'transparent',
                                        }}
                                        className="card overlay-card"
                                    >
                                        <div
                                            className="relative w-full overflow-hidden"
                                            style={{ paddingBottom: getAspectRatioPadding() }}
                                        >
                                            <img
                                                className="absolute inset-0 w-full h-full object-cover"
                                                style={{ borderRadius: cardBorderRadius }}
                                                src={image.src}
                                                alt={image.title || ''}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/400x300?text=Sin+imagen';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                                            <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                                                {image.title && <h3 style={titleStyles}>{image.title}</h3>}
                                                {image.text && <p style={textStyles}>{image.text}</p>}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={cardStyles} className="card">
                                        <div
                                            className="relative w-full overflow-hidden rounded-lg"
                                            style={{ paddingBottom: getAspectRatioPadding() }}
                                        >
                                            <img
                                                className="absolute inset-0 w-full h-full object-cover"
                                                src={image.src}
                                                alt={image.title || ''}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/400x300?text=Sin+imagen';
                                                }}
                                            />
                                        </div>
                                        {image.title && (
                                            <h3 style={titleStyles}>{image.title}</h3>
                                        )}
                                        {image.text && (
                                            <p style={textStyles}>{image.text}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots */}
                {showDots && images.length > 1 && (
                    <div className="flex justify-center mt-6 space-x-2">
                        {Array.from({ length: images.length - slidesToShow + 1 }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-blue-500 w-4' : 'bg-gray-400'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageCarouselComponent;