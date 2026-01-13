// components/Builder/components/ImageComponent.jsx - VERSIÓN CON ASPECT RATIO
import React from 'react';

const ImageComponent = ({
  comp,
  getStyles,
  onEdit,
  isPreview,
  themeSettings
}) => {
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

  const imageUrl = getImageUrl();
  const altText = getAltText();

  // Obtener estilos base
  const baseStyles = getStyles(comp);

  // Obtener el aspect ratio del estilo (por defecto 'square')
  const aspectRatio = comp.styles?.aspectRatio || baseStyles.aspectRatio || 'square';

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
  
  // Estilos para la imagen que llena el contenedor
  const imageStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    // Estilos de borde personalizados
    borderRadius: comp.styles?.borderRadius || baseStyles.borderRadius || '0px',
    borderWidth: comp.styles?.borderWidth || baseStyles.borderWidth || '0px',
    borderStyle: comp.styles?.borderStyle || baseStyles.borderStyle || 'solid',
    borderColor: comp.styles?.borderColor || baseStyles.borderColor || 'transparent',
    // Ajuste de imagen
    objectFit: comp.styles?.objectFit || baseStyles.objectFit || 'cover',
    // Márgenes personalizados (para el contenedor, no la imagen)
    marginTop: comp.styles?.marginTop || baseStyles.marginTop || '0px',
    marginRight: comp.styles?.marginRight || baseStyles.marginRight || '0px',
    marginBottom: comp.styles?.marginBottom || baseStyles.marginBottom || '0px',
    marginLeft: comp.styles?.marginLeft || baseStyles.marginLeft || '0px',
  };

  // Manejar clic para editar (solo en modo edición)
  const handleClick = (e) => {
    if (!isPreview && onEdit) {
      e.stopPropagation();
      onEdit(comp);
    }
  };

  // Si no hay URL, mostrar placeholder
  if (!imageUrl) {
    return (
      <div
        onClick={handleClick}
        style={{
          ...containerStyles,
          border: isPreview ? 'none' : '2px dashed #ccc',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isPreview ? 'default' : 'pointer',
        }}
        className="image-placeholder"
      >
        {isPreview ? (
          <span className="text-gray-400">[Imagen no disponible]</span>
        ) : (
          <div className="text-center p-4">
            <div className="text-gray-400">Click para agregar imagen</div>
            <div className="text-xs text-gray-500 mt-1">URL no configurada</div>
            <div className="text-xs text-gray-400 mt-2">
              Aspect ratio: {aspectRatio}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      style={{
        ...containerStyles,
        marginTop: imageStyles.marginTop,
        marginRight: imageStyles.marginRight,
        marginBottom: imageStyles.marginBottom,
        marginLeft: imageStyles.marginLeft,
      }}
      className={isPreview ? '' : 'cursor-pointer hover:opacity-95 transition-opacity'}
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
          // Manejar error de carga de imagen
          e.target.style.display = 'none';
          e.target.parentNode.style.border = isPreview ? 'none' : '2px dashed #f00';
          e.target.parentNode.style.backgroundColor = '#ffe6e6';
        }}
      />
    </div>
  );
};

export default ImageComponent;