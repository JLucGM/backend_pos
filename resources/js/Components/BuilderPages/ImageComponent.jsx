// components/Builder/components/ImageComponent.jsx - VERSIÓN SOLO PORCENTAJES
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
  
  // Valores por defecto en porcentaje
  const defaultWidth = '100%';
  const defaultHeight = '100%';
  
  // Asegurar que el ancho y alto sean porcentajes
  const getPercentageValue = (value, defaultValue) => {
    if (!value) return defaultValue;
    // Si el valor no termina con %, agregarlo
    if (typeof value === 'string' && !value.endsWith('%')) {
      return `${value}%`;
    }
    return value;
  };

  const width = getPercentageValue(comp.styles?.width || baseStyles.width, defaultWidth);
  const height = getPercentageValue(comp.styles?.height || baseStyles.height, defaultHeight);

  // Crear estilos combinados
  const imageStyles = {
    ...baseStyles,
    display: 'block',
    width: width,
    height: height,
    // Estilos de borde personalizados
    borderRadius: comp.styles?.borderRadius || baseStyles.borderRadius || '0px',
    borderWidth: comp.styles?.borderWidth || baseStyles.borderWidth || '0px',
    borderStyle: comp.styles?.borderStyle || baseStyles.borderStyle || 'solid',
    borderColor: comp.styles?.borderColor || baseStyles.borderColor || 'transparent',
    // Márgenes personalizados
    marginTop: comp.styles?.marginTop || baseStyles.marginTop || '0px',
    marginRight: comp.styles?.marginRight || baseStyles.marginRight || '0px',
    marginBottom: comp.styles?.marginBottom || baseStyles.marginBottom || '0px',
    marginLeft: comp.styles?.marginLeft || baseStyles.marginLeft || '0px',
    // Ajuste de imagen
    objectFit: comp.styles?.objectFit || baseStyles.objectFit || 'cover',
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
          ...imageStyles,
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
              Tamaño: {width} × {height}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      style={{
        display: 'inline-block',
        width: '100%', // Contenedor ocupa el 100% del padre
        height: '100%',
      }}
      onClick={handleClick}
      className={isPreview ? '' : 'cursor-pointer hover:opacity-95 transition-opacity'}
    >
      <img
        src={imageUrl}
        alt={altText || 'Imagen'}
        style={imageStyles}
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