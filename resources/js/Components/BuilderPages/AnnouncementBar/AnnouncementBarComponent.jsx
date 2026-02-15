import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ComponentWithHover from '../ComponentWithHover';
import AnnouncementComponent from './AnnouncementComponent';
import { getThemeWithDefaults, getComponentStyles, resolveStyleValue } from '@/utils/themeUtils';

const AnnouncementBarComponent = ({
    comp,
    getStyles,
    onEdit,
    onDelete,
    themeSettings,
    isPreview,
    products = [],
    setComponents,
    hoveredComponentId,
    setHoveredComponentId,
    mode = 'builder',
    appliedTheme
}) => {
    const customStyles = comp.styles || {};
    const announcementConfig = comp.content || {};
    const children = announcementConfig.children || [];
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);
    const themeAnnouncementStyles = getComponentStyles(themeWithDefaults, 'announcement-bar');

    // ===========================================
    // FUNCIÓN PARA RESOLVER REFERENCIAS
    // ===========================================
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    // Resolver todas las propiedades de customStyles
    const resolvedCustomStyles = {};
    Object.keys(customStyles).forEach(key => {
        resolvedCustomStyles[key] = resolveValue(customStyles[key]);
    });

    // Resolver propiedades de announcementConfig (si las hay)
    const resolvedConfig = {};
    Object.keys(announcementConfig).forEach(key => {
        resolvedConfig[key] = resolveValue(announcementConfig[key]);
    });

    // Estados para el carrusel
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const intervalRef = useRef(null);

    // Configuración del carrusel (usar valores resueltos)
    const autoplayTime = (resolvedConfig.autoplayTime || 5) * 1000; // Convertir a milisegundos
    const showArrows = children.length > 1;
    const isCarouselMode = children.length > 0; // Siempre mostrar como carrusel si hay anuncios

    // Asegurar que currentIndex esté dentro del rango válido
    useEffect(() => {
        if (children.length > 0 && currentIndex >= children.length) {
            setCurrentIndex(0);
        }
    }, [children.length, currentIndex]);

    // Efecto para el autoplay - solo en frontend, no en builder
    useEffect(() => {
        if (mode === 'frontend' && isPlaying && children.length > 1) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prevIndex) =>
                    prevIndex === children.length - 1 ? 0 : prevIndex + 1
                );
            }, autoplayTime);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, children.length, autoplayTime, mode]);

    // Funciones de navegación - funcionan en todos los modos
    const goToPrevious = () => {
        setCurrentIndex(currentIndex === 0 ? children.length - 1 : currentIndex - 1);
    };

    const goToNext = () => {
        setCurrentIndex(currentIndex === children.length - 1 ? 0 : currentIndex + 1);
    };

    // Pausar autoplay al hacer hover - solo en frontend
    const handleMouseEnter = () => {
        if (mode === 'frontend') {
            setIsPlaying(false);
        }
    };

    const handleMouseLeave = () => {
        if (mode === 'frontend') {
            setIsPlaying(true);
        }
    };

    // Helper para añadir unidad (px) si es solo número
    const withUnit = (value, unit = 'px') => {
        if (value === undefined || value === null || value === '') return undefined;
        // Si ya es string y tiene algun caracter no numerico (como px, %, rem), devolver tal cual
        if (typeof value === 'string' && isNaN(Number(value))) return value;
        return `${value}${unit}`;
    };

    // Estilos del contenedor principal con valores del tema (usar resolvedCustomStyles)
    const containerStyles = {
        ...getStyles(comp),
        backgroundColor: resolvedCustomStyles.backgroundColor || themeAnnouncementStyles.backgroundColor,
        paddingTop: withUnit(resolvedCustomStyles.paddingTop) || themeAnnouncementStyles.paddingTop,
        paddingBottom: withUnit(resolvedCustomStyles.paddingBottom) || themeAnnouncementStyles.paddingBottom,
        paddingLeft: withUnit(resolvedCustomStyles.paddingLeft || '20px'),
        paddingRight: withUnit(resolvedCustomStyles.paddingRight || '20px'),
        position: 'relative',
        overflow: 'hidden',
        minHeight: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: themeAnnouncementStyles.color,
        fontSize: themeAnnouncementStyles.fontSize,
    };

    // Estilos del contenido del carrusel
    const carouselStyles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        position: 'relative',
    };

    // Estilos de las flechas - personalizables (usar resolvedCustomStyles)
    const arrowStyles = {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: resolvedCustomStyles.arrowBackgroundColor || 'rgba(255, 255, 255, 0.2)',
        opacity: resolvedCustomStyles.arrowOpacity || 1,
        border: `${withUnit(resolvedCustomStyles.arrowBorderWidth) || '0px'} solid ${resolvedCustomStyles.arrowBorderColor || 'transparent'}`,
        borderRadius: withUnit(resolvedCustomStyles.arrowBorderRadius) || '50%',
        width: withUnit(resolvedCustomStyles.arrowSize) || '32px',
        height: withUnit(resolvedCustomStyles.arrowSize) || '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: resolvedCustomStyles.arrowIconColor || '#ffffff',
        zIndex: 10,
        transition: 'all 0.2s ease',
    };

    const leftArrowStyles = {
        ...arrowStyles,
        left: '10px',
    };

    const rightArrowStyles = {
        ...arrowStyles,
        right: '10px',
    };

    // Función para renderizar hijos
    const renderChild = (child) => {
        const commonProps = {
            comp: child,
            getStyles,
            isPreview: mode === 'frontend' ? true : isPreview,
            onEdit: mode === 'frontend' ? () => { } : onEdit,
            onDelete: mode === 'frontend' ? () => { } : onDelete,
            hoveredComponentId,
            setHoveredComponentId,
            themeSettings,
            appliedTheme, // Pasamos appliedTheme para que los hijos también resuelvan
            mode
        };

        if (child.type === 'announcement') {
            return (
                <ComponentWithHover
                    key={child.id}
                    component={child}
                    isPreview={isPreview}
                    hoveredComponentId={hoveredComponentId}
                    setHoveredComponentId={setHoveredComponentId}
                    getComponentTypeName={() => 'Anuncio'}
                >
                    <AnnouncementComponent
                        {...commonProps}
                    />
                </ComponentWithHover>
            );
        }

        return null;
    };

    // Si no hay hijos, mostrar mensaje en modo builder
    if (children.length === 0 && mode === 'builder') {
        return (
            <div style={containerStyles}>
                <div style={{
                    color: resolvedCustomStyles.backgroundColor === themeAnnouncementStyles.backgroundColor ? themeAnnouncementStyles.color : '#666666',
                    textAlign: 'center',
                    opacity: 0.7,
                    fontSize: '14px'
                }}>
                    Barra de anuncios vacía. Agrega componentes "Anuncio" para comenzar.
                </div>
            </div>
        );
    }

    // Si no hay hijos en frontend, no mostrar nada
    if (children.length === 0 && mode === 'frontend') {
        return null;
    }

    return (
        <div
            style={containerStyles}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div style={carouselStyles}>
                {/* Flecha izquierda */}
                {showArrows && isCarouselMode && (
                    <button
                        style={leftArrowStyles}
                        onClick={goToPrevious}
                        onMouseEnter={(e) => {
                            if (resolvedCustomStyles.arrowHoverBackgroundColor) {
                                e.target.style.backgroundColor = resolvedCustomStyles.arrowHoverBackgroundColor;
                            } else {
                                // Efecto hover por defecto: aumentar opacidad
                                const currentBg = resolvedCustomStyles.arrowBackgroundColor || 'rgba(255, 255, 255, 0.2)';
                                e.target.style.backgroundColor = currentBg.replace(/[\d.]+\)$/, '0.4)');
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = resolvedCustomStyles.arrowBackgroundColor || 'rgba(255, 255, 255, 0.2)';
                        }}
                    >
                        <ChevronLeft size={parseInt(resolvedCustomStyles.arrowIconSize) || 16} />
                    </button>
                )}

                {/* Contenido del anuncio */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                    {/* Siempre mostrar como carrusel - solo un anuncio a la vez */}
                    {children.length > 0 && children[currentIndex] ? renderChild(children[currentIndex]) : null}
                </div>

                {/* Flecha derecha */}
                {showArrows && isCarouselMode && (
                    <button
                        style={rightArrowStyles}
                        onClick={goToNext}
                        onMouseEnter={(e) => {
                            if (resolvedCustomStyles.arrowHoverBackgroundColor) {
                                e.target.style.backgroundColor = resolvedCustomStyles.arrowHoverBackgroundColor;
                            } else {
                                // Efecto hover por defecto: aumentar opacidad
                                const currentBg = resolvedCustomStyles.arrowBackgroundColor || 'rgba(255, 255, 255, 0.2)';
                                e.target.style.backgroundColor = currentBg.replace(/[\d.]+\)$/, '0.4)');
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = resolvedCustomStyles.arrowBackgroundColor || 'rgba(255, 255, 255, 0.2)';
                        }}
                    >
                        <ChevronRight size={parseInt(resolvedCustomStyles.arrowIconSize) || 16} />
                    </button>
                )}
            </div>

            {/* Sin indicadores de puntos */}
        </div>
    );
};

export default AnnouncementBarComponent;