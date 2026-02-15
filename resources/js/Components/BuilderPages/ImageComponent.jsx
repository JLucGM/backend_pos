import React from 'react';
import { Link } from '@inertiajs/react';
import { getThemeWithDefaults, resolveStyleValue } from '@/utils/themeUtils';

const ImageComponent = ({
  comp,
  getStyles,
  onEdit,
  isPreview,
  themeSettings,
  appliedTheme,
  mode = 'builder' // 'builder' o 'frontend'
}) => {
  // Obtener configuración del tema con valores por defecto
  const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

  // ===========================================
  // FUNCIÓN PARA RESOLVER REFERENCIAS
  // ===========================================
  const resolveValue = (value) => {
    return resolveStyleValue(value, themeWithDefaults, appliedTheme);
  };

  // Obtener estilos base y resolverlos por si acaso
  const baseStylesRaw = getStyles(comp);
  const baseStyles = {};
  Object.keys(baseStylesRaw).forEach(key => {
    baseStyles[key] = resolveValue(baseStylesRaw[key]);
  });

  // Resolver estilos personalizados
  const rawStyles = comp.styles || {};
  const customStyles = {};
  Object.keys(rawStyles).forEach(key => {
    customStyles[key] = resolveValue(rawStyles[key]);
  });

  // Obtener la URL de la imagen
  const getImageUrl = () => {
    if (!comp.content) return '';

    if (typeof comp.content === 'string') {
      return comp.content;
    }

    if (typeof comp.content === 'object' && comp.content !== null) {
      return comp.content.src || comp.content.url || '';
    }

    return String(comp.content);
  };

  // Obtener el texto alternativo
  const getAltText = () => {
    if (!comp.content) return '';

    if (typeof comp.content === 'object' && comp.content !== null) {
      return comp.content.alt || '';
    }

    return '';
  };

  // Obtener la URL del enlace (si existe)
  const getLinkUrl = () => {
    return customStyles.imageUrl || baseStyles.imageUrl || '';
  };

  const imageUrl = getImageUrl();
  const altText = getAltText();
  const linkUrl = getLinkUrl();

  // Determinar si tiene enlace
  const hasLink = Boolean(linkUrl && linkUrl.trim() !== '');

  // Obtener el aspect ratio del estilo (por defecto 'square')
  const aspectRatio = customStyles.aspectRatio || baseStyles.aspectRatio || 'square';

  // Calcular el padding-bottom según el aspect ratio
  const getAspectRatioStyles = () => {
    switch (aspectRatio) {
      case 'landscape':
        return {
          width: '100%',
          height: '0',
          paddingBottom: '56.25%', // 16:9 ratio
          position: 'relative'
        };
      case 'portrait':
        return {
          width: '100%',
          height: '0',
          paddingBottom: '125%', // 4:5 ratio
          position: 'relative'
        };
      case 'square':
      default:
        return {
          width: '100%',
          height: '0',
          paddingBottom: '100%', // 1:1 ratio
          position: 'relative'
        };
    }
  };

  const containerStyles = getAspectRatioStyles();

  // Helper para añadir unidad (px) si es solo número
  const withUnit = (value, unit = 'px') => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'string' && isNaN(Number(value))) return value;
    return `${value}${unit}`;
  };

  // Resolver valores de estilo con prioridad: customStyles > baseStyles > tema
  const borderRadius = customStyles.borderRadius || baseStyles.borderRadius || '0px';
  const borderWidth = customStyles.borderWidth || baseStyles.borderWidth || '0px';
  const borderStyle = customStyles.borderStyle || baseStyles.borderStyle || 'solid';
  const borderColor = customStyles.borderColor || baseStyles.borderColor || themeWithDefaults.borders;
  const objectFit = customStyles.objectFit || baseStyles.objectFit || 'cover';
  const marginTop = customStyles.marginTop || baseStyles.marginTop || '0px';
  const marginRight = customStyles.marginRight || baseStyles.marginRight || '0px';
  const marginBottom = customStyles.marginBottom || baseStyles.marginBottom || '0px';
  const marginLeft = customStyles.marginLeft || baseStyles.marginLeft || '0px';

  // Resolver todos ellos
  const resolvedBorderRadius = resolveValue(borderRadius);
  const resolvedBorderWidth = resolveValue(borderWidth);
  const resolvedBorderColor = resolveValue(borderColor);
  const resolvedMarginTop = resolveValue(marginTop);
  const resolvedMarginRight = resolveValue(marginRight);
  const resolvedMarginBottom = resolveValue(marginBottom);
  const resolvedMarginLeft = resolveValue(marginLeft);

  // Estilos para la imagen que llena el contenedor
  const imageStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: withUnit(resolvedBorderRadius),
    borderWidth: withUnit(resolvedBorderWidth),
    borderStyle: borderStyle,
    borderColor: resolvedBorderColor,
    objectFit: objectFit,
    marginTop: withUnit(resolvedMarginTop),
    marginRight: withUnit(resolvedMarginRight),
    marginBottom: withUnit(resolvedMarginBottom),
    marginLeft: withUnit(resolvedMarginLeft),
  };

  // Manejar clic
  const handleClick = (e) => {
    if (mode === 'builder' && !isPreview) {
      e.preventDefault();
      e.stopPropagation();
      if (onEdit) {
        onEdit(comp);
      }
      return;
    }

    if ((mode === 'frontend' || isPreview) && hasLink) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
  };

  // Si no hay URL, mostrar placeholder
  if (!imageUrl) {
    const placeholder = (
      <div
        onClick={handleClick}
        style={{
          ...containerStyles,
          border: isPreview ? 'none' : `2px dashed ${resolveValue(themeWithDefaults.borders)}`,
          backgroundColor: resolveValue(themeWithDefaults.background),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: (mode === 'builder' && !isPreview) ? 'pointer' : 'default',
        }}
        className="image-placeholder"
      >
        {isPreview ? (
          <span style={{ color: resolveValue(themeWithDefaults.text) }}>[Imagen no disponible]</span>
        ) : (
          <div className="text-center p-4">
            <div style={{ color: resolveValue(themeWithDefaults.text) }}>Click para agregar imagen</div>
            <div style={{ color: resolveValue(themeWithDefaults.text) }} className="text-xs mt-1">URL no configurada</div>
            <div style={{ color: resolveValue(themeWithDefaults.text) }} className="text-xs mt-2">
              Aspect ratio: {aspectRatio}
            </div>
            {hasLink && (
              <div style={{ color: resolveValue(themeWithDefaults.links) }} className="text-xs mt-1">
                ✓ Tiene enlace configurado
              </div>
            )}
          </div>
        )}
      </div>
    );

    if (hasLink && (mode === 'frontend' || isPreview)) {
      if (linkUrl.startsWith('/')) {
        return (
          <Link href={linkUrl} style={{ display: 'block' }}>
            {placeholder}
          </Link>
        );
      } else {
        return (
          <a href={linkUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
            {placeholder}
          </a>
        );
      }
    }

    return placeholder;
  }

  // Crear el elemento de imagen
  const imageElement = (
    <div
      onClick={handleClick}
      style={{
        ...containerStyles,
        marginTop: withUnit(resolvedMarginTop),
        marginRight: withUnit(resolvedMarginRight),
        marginBottom: withUnit(resolvedMarginBottom),
        marginLeft: withUnit(resolvedMarginLeft),
        cursor: (mode === 'builder' && !isPreview) ? 'pointer' :
          (hasLink ? 'pointer' : 'default'),
      }}
      className={isPreview ? '' : 'hover:opacity-95 transition-opacity'}
    >
      <img
        src={imageUrl}
        alt={altText || 'Imagen'}
        style={{
          ...imageStyles,
          marginTop: 0,
          marginRight: 0,
          marginBottom: 0,
          marginLeft: 0,
        }}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.parentNode.style.border = isPreview ? 'none' : `2px dashed ${resolveValue(themeWithDefaults.borders)}`;
          e.target.parentNode.style.backgroundColor = resolveValue(themeWithDefaults.background);
        }}
      />
    </div>
  );

  if (hasLink && (mode === 'frontend' || isPreview)) {
    if (linkUrl.startsWith('/')) {
      return (
        <Link href={linkUrl} style={{ display: 'block' }}>
          {imageElement}
        </Link>
      );
    } else {
      return (
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block' }}
        >
          {imageElement}
        </a>
      );
    }
  }

  return imageElement;
};

export default ImageComponent;