// components/BuilderPages/components/ContainerComponent.jsx
import React from 'react';
import CanvasItem from './CanvasItem';
import { getThemeWithDefaults, getComponentStyles, resolveStyleValue } from '@/utils/themeUtils';

const ContainerComponent = ({
  comp,
  getStyles,
  onEdit,
  onDelete,
  themeSettings,
  appliedTheme,
  isPreview,
  products,
  setComponents,
  hoveredComponentId,
  setHoveredComponentId
}) => {
  // Obtener configuración del tema con valores por defecto
  const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

  // ===========================================
  // FUNCIÓN PARA RESOLVER REFERENCIAS
  // ===========================================
  const resolveValue = (value) => {
    return resolveStyleValue(value, themeWithDefaults, appliedTheme);
  };

  // Obtener estilos específicos del tema para container y resolverlos
  const themeContainerStylesRaw = getComponentStyles(themeWithDefaults, 'container', appliedTheme);
  const themeContainerStyles = {};
  Object.keys(themeContainerStylesRaw).forEach(key => {
    themeContainerStyles[key] = resolveValue(themeContainerStylesRaw[key]);
  });

  // Resolver estilos personalizados del componente
  const rawStyles = comp.styles || {};
  const customStyles = {};
  Object.keys(rawStyles).forEach(key => {
    customStyles[key] = resolveValue(rawStyles[key]);
  });

  // Helper para añadir unidad
  const withUnit = (value, unit = 'px') => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'string' && isNaN(Number(value))) return value;
    return `${value}${unit}`;
  };

  // Padding individual (resolver por si acaso, aunque normalmente son numéricos)
  const paddingTop = withUnit(resolveValue(customStyles.paddingTop) || '0px');
  const paddingRight = withUnit(resolveValue(customStyles.paddingRight) || '0px');
  const paddingBottom = withUnit(resolveValue(customStyles.paddingBottom) || '0px');
  const paddingLeft = withUnit(resolveValue(customStyles.paddingLeft) || '0px');

  const marginTop = withUnit(resolveValue(customStyles.marginTop) || '0px');
  const marginRight = withUnit(resolveValue(customStyles.marginRight) || '0px');
  const marginBottom = withUnit(resolveValue(customStyles.marginBottom) || '0px');
  const marginLeft = withUnit(resolveValue(customStyles.marginLeft) || '0px');

  // Alignment y dirección
  const alignment = customStyles.alignment || 'left';
  const direction = customStyles.direction || 'row';
  const gap = withUnit(resolveValue(customStyles.gap) || themeContainerStyles.gap || '0px');

  // Imagen de fondo (no resolver, es una URL)
  const backgroundImage = customStyles.backgroundImage;
  const backgroundColor = resolveValue(customStyles.backgroundColor || themeContainerStyles.backgroundColor || 'transparent');
  const backgroundSize = customStyles.backgroundSize || 'cover';
  const backgroundPosition = customStyles.backgroundPosition || 'center';

  const borderRadius = withUnit(resolveValue(customStyles.borderRadius) || themeContainerStyles.borderRadius || '0px');

  // Determinar alineación flex
  const getFlexAlignment = () => {
    if (direction === 'row') {
      switch (alignment) {
        case 'left': return 'flex-start';
        case 'center': return 'center';
        case 'right': return 'flex-end';
        default: return 'flex-start';
      }
    } else {
      switch (alignment) {
        case 'left': return 'flex-start';
        case 'center': return 'center';
        case 'right': return 'flex-end';
        default: return 'flex-start';
      }
    }
  };

  const flexAlignment = getFlexAlignment();

  // Estilos del contenedor
  const containerStyles = {
    ...getStyles(comp),
    // width: 'auto',
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    // Fondo: si hay imagen, se muestra; si no, solo color
    backgroundColor: backgroundImage ? 'transparent' : backgroundColor,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
    backgroundSize,
    backgroundPosition,
    backgroundRepeat: 'no-repeat',
    borderRadius,
    display: 'flex',
    flexDirection: direction,
    gap,
    justifyContent: direction === 'row' ? flexAlignment : 'flex-start',
    alignItems: direction === 'row' ? 'flex-start' : flexAlignment,
    flexWrap: 'wrap',
    border: isPreview ? 'none' : `2px dashed ${resolveValue(themeWithDefaults.borders)}`,
    minHeight: '50px',
    position: 'relative',
    boxSizing: 'border-box',
  };

  // Eventos de mouse
  const handleMouseEnter = () => {
    if (setHoveredComponentId && !isPreview) {
      setHoveredComponentId(comp.id);
    }
  };

  const handleMouseLeave = () => {
    if (setHoveredComponentId && !isPreview) {
      setHoveredComponentId(null);
    }
  };

  const handleDeleteChild = (childId) => {
    setComponents((prev) => {
      const updateComponentChildren = (components) => {
        return components.map((c) => {
          if (c.id === comp.id && c.content) {
            return {
              ...c,
              content: c.content.filter((sc) => sc.id !== childId)
            };
          }
          if (c.type === 'container' && c.content) {
            return {
              ...c,
              content: updateComponentChildren(c.content)
            };
          }
          return c;
        });
      };
      return updateComponentChildren(prev);
    });
  };

  return (
    <div
      style={containerStyles}
      className="group relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {comp.content && comp.content.length > 0 ? (
        comp.content.map((subComp) => (
          <div
            key={subComp.id}
            className={direction === 'row' ? 'flex-auto min-w-0' : 'w-full'}
          >
            <CanvasItem
              comp={subComp}
              onEditComponent={onEdit}
              onDeleteComponent={handleDeleteChild}
              themeSettings={themeSettings}
              appliedTheme={appliedTheme}
              isPreview={isPreview}
              products={products}
              setComponents={setComponents}
              hoveredComponentId={hoveredComponentId}
              setHoveredComponentId={setHoveredComponentId}
            />
          </div>
        ))
      ) : (
        !isPreview && (
          <div
            className="w-full text-center text-gray-400 py-8 border border-dashed border-gray-300 rounded cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <p>Contenedor vacío</p>
            <p className="text-sm">Agrega componentes aquí</p>
          </div>
        )
      )}
    </div>
  );
};

export default ContainerComponent;