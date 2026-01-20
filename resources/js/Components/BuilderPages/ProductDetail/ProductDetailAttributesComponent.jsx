import React, { useState, useEffect } from 'react';

const ProductDetailAttributesComponent = ({ 
    comp, 
    product, 
    themeSettings, 
    onCombinationChange 
}) => {
    const [selectedValues, setSelectedValues] = useState({});
    const [availableCombinations, setAvailableCombinations] = useState([]);
    const [currentCombination, setCurrentCombination] = useState(null);

    // Extraer atributos únicos del producto
    const extractAttributes = () => {
        if (!product || !product.combinations || product.combinations.length === 0) {
            return [];
        }

        const attributesMap = {};
        
        product.combinations.forEach(combination => {
            combination.attribute_values.forEach(attr => {
                if (!attributesMap[attr.attribute_id]) {
                    attributesMap[attr.attribute_id] = {
                        id: attr.attribute_id,
                        name: attr.attribute_name,
                        values: []
                    };
                }

                const valueExists = attributesMap[attr.attribute_id].values.some(
                    v => v.value_id === attr.value_id
                );
                
                if (!valueExists) {
                    attributesMap[attr.attribute_id].values.push({
                        value_id: attr.value_id,
                        value_name: attr.value_name
                    });
                }
            });
        });

        return Object.values(attributesMap);
    };

    // Filtrar combinaciones disponibles basadas en selecciones
    const filterCombinations = () => {
        if (!product || !product.combinations) return [];

        return product.combinations.filter(combination => {
            return Object.entries(selectedValues).every(([attributeId, valueId]) => {
                return combination.attribute_values.some(attr => 
                    attr.attribute_id.toString() === attributeId && 
                    attr.value_id.toString() === valueId
                );
            });
        });
    };

    // Encontrar combinación exacta
    const findExactCombination = () => {
        if (!product || !product.combinations) return null;
        
        const attributes = extractAttributes();
        
        if (Object.keys(selectedValues).length < attributes.length) {
            return null;
        }

        return product.combinations.find(combination => {
            return Object.entries(selectedValues).every(([attributeId, valueId]) => {
                return combination.attribute_values.some(attr => 
                    attr.attribute_id.toString() === attributeId && 
                    attr.value_id.toString() === valueId
                );
            });
        });
    };

    // Obtener stock para la combinación actual
    const getCurrentStock = () => {
        if (!currentCombination || !product?.stocks) return 0;
        
        const stock = product.stocks.find(s => s.combination_id === currentCombination.id);
        return stock ? stock.quantity : 0;
    };

    // Manejar cambio de atributo
    const handleAttributeChange = (attributeId, valueId) => {
        const newSelectedValues = {
            ...selectedValues,
            [attributeId]: valueId
        };
        setSelectedValues(newSelectedValues);
        
        const exactCombination = findExactCombination();
        setCurrentCombination(exactCombination);
        
        if (onCombinationChange) {
            onCombinationChange(exactCombination);
        }
    };

    // Efecto para inicializar atributos
    useEffect(() => {
        const attributes = extractAttributes();
        
        if (attributes.length === 0) {
            setSelectedValues({});
            setAvailableCombinations([]);
            setCurrentCombination(null);
            if (onCombinationChange) onCombinationChange(null);
            return;
        }
        
        const initialSelections = {};
        attributes.forEach(attr => {
            if (attr.values.length > 0) {
                initialSelections[attr.id] = attr.values[0].value_id;
            }
        });
        
        setSelectedValues(initialSelections);
    }, [product]);

    // Efecto para actualizar combinaciones disponibles
    useEffect(() => {
        const filtered = filterCombinations();
        setAvailableCombinations(filtered);
        
        const exact = findExactCombination();
        setCurrentCombination(exact);
        
        if (onCombinationChange) {
            onCombinationChange(exact);
        }
    }, [selectedValues, product]);

    // Función para obtener estilos de fuente según configuración
    // Función para obtener estilos de fuente según configuración
const getFontStyles = (type = 'title') => {
    const styles = comp.styles || {};
    const theme = themeSettings || {};
    
    if (type === 'title') {
        const fontType = styles.titleFontType || 'default';
        let fontFamily;
        
        if (fontType === 'default') {
            // Usar heading_font del tema para títulos
            fontFamily = theme?.heading_font || theme?.heading_font_family || "'Inter', sans-serif";
        } else if (fontType === 'custom' && styles.titleCustomFont) {
            fontFamily = styles.titleCustomFont;
        } else {
            // Usar fuentes específicas del tema
            switch(fontType) {
                case 'body_font':
                    fontFamily = theme?.body_font || "'Inter', sans-serif";
                    break;
                case 'heading_font':
                    fontFamily = theme?.heading_font || "'Inter', sans-serif";
                    break;
                case 'subheading_font':
                    fontFamily = theme?.subheading_font || "'Inter', sans-serif";
                    break;
                case 'accent_font':
                    fontFamily = theme?.accent_font || "'Georgia', serif";
                    break;
                default:
                    fontFamily = theme?.body_font || "'Inter', sans-serif";
            }
        }
        
        // Determinar tamaño de fuente y peso según el estilo seleccionado
        let fontSize = styles.titleSize;
        let fontWeight = styles.titleFontWeight;
        
        // Si no están definidos, usar los del tema según el estilo de texto
        if (!fontSize || !fontWeight) {
            const textStyle = styles.titleTextStyle || 'heading3';
            
            // Extraer el nivel si es un heading
            if (textStyle.startsWith('heading')) {
                const level = textStyle.replace('heading', '');
                
                // Usar los valores del tema para el nivel correspondiente
                if (!fontSize) {
                    // Buscar primero en el tema, luego valor por defecto
                    const themeFontSize = theme?.[`heading${level}_fontSize`] || theme?.[`heading${level}_size`];
                    fontSize = themeFontSize || `${3.5 - (level * 0.25)}rem`;
                }
                
                if (!fontWeight) {
                    const themeFontWeight = theme?.[`heading${level}_fontWeight`];
                    fontWeight = themeFontWeight || 'bold';
                }
            } else if (textStyle === 'paragraph') {
                if (!fontSize) {
                    fontSize = theme?.paragraph_fontSize || theme?.paragraph_size || '16px';
                }
                if (!fontWeight) {
                    fontWeight = theme?.paragraph_fontWeight || 'normal';
                }
            } else {
                // Valores por defecto
                if (!fontSize) {
                    fontSize = '18px';
                }
                if (!fontWeight) {
                    fontWeight = 'bold';
                }
            }
        }
        
        return {
            fontFamily,
            fontSize,
            fontWeight,
            color: styles.titleColor || (theme?.heading ? `hsl(${theme.heading})` : '#000000'),
            marginBottom: theme?.spacing_medium || '1rem',
        };
    } else {
        // Para etiquetas
        return {
            fontFamily: theme?.body_font || "'Inter', sans-serif",
            fontSize: styles.labelSize || theme?.paragraph_fontSize || '14px',
            fontWeight: styles.labelFontWeight || theme?.paragraph_fontWeight || 'normal',
            color: styles.labelColor || (theme?.text ? `hsl(${theme.text})` : '#666666'),
            marginBottom: theme?.spacing_small || '0.5rem',
            display: 'block',
        };
    }
};

    // Estilos del contenedor con valores del tema
    const containerStyles = {
        marginBottom: themeSettings?.spacing_large || '2rem',
        padding: themeSettings?.spacing_small || '0.5rem',
        ...comp.styles,
    };

    // Estilos para botones seleccionados y no seleccionados
    const getButtonStyles = (isSelected) => {
        const styles = comp.styles || {};
        const theme = themeSettings || {};
        
        const baseStyles = {
            padding: `${theme?.spacing_small || '0.5rem'} ${theme?.spacing_medium || '1rem'}`,
            borderRadius: styles.buttonBorderRadius || theme?.border_radius || '6px',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s',
            minWidth: '60px',
            borderWidth: '1px',
            borderStyle: 'solid',
            cursor: 'pointer',
            fontFamily: theme?.button_font_family || 'inherit',
        };
        
        if (isSelected) {
            return {
                ...baseStyles,
                backgroundColor: styles.selectedBgColor || (theme?.primary_button_background ? `hsl(${theme.primary_button_background})` : '#dbeafe'),
                color: styles.selectedTextColor || (theme?.primary_button_text ? `hsl(${theme.primary_button_text})` : '#1e40af'),
                borderColor: styles.selectedBorderColor || (theme?.primary_button_border ? `hsl(${theme.primary_button_border})` : '#93c5fd'),
            };
        } else {
            return {
                ...baseStyles,
                backgroundColor: styles.buttonBgColor || (theme?.secondary_button_background ? `hsl(${theme.secondary_button_background})` : '#ffffff'),
                color: styles.buttonColor || (theme?.secondary_button_text ? `hsl(${theme.secondary_button_text})` : '#374151'),
                borderColor: styles.buttonBorderColor || (theme?.borders ? `hsl(${theme.borders})` : '#d1d5db'),
            };
        }
    };

    const attributes = extractAttributes();

    // Si no hay atributos, mostrar mensaje o nada
    if (attributes.length === 0) {
        // Modo builder: mostrar datos de ejemplo
        if (!product) {
            return (
                <div style={containerStyles} className="product-attributes">
                    <h3 className="text-lg font-semibold mb-4" style={getFontStyles('title')}>
                        {comp.content?.title || 'Opciones del Producto'}
                    </h3>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" style={getFontStyles('label')}>
                            Talla:
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {['Pequeño', 'Mediano', 'Grande'].map((size, index) => (
                                <button
                                    key={size}
                                    type="button"
                                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
                                    style={getButtonStyles(index === 0)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="text-sm text-gray-500 italic">
                        (En el frontend, se mostrarán las combinaciones reales del producto)
                    </div>
                </div>
            );
        }
        
        // En frontend, si no hay atributos, no renderizar nada
        return null;
    }

    return (
        <div style={containerStyles} className="product-attributes">
            <h3 className="text-lg font-semibold mb-4" style={getFontStyles('title')}>
                {comp.content?.title || 'Opciones'}
            </h3>
            
            {attributes.map(attribute => (
                <div key={attribute.id} className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={getFontStyles('label')}>
                        {attribute.name}:
                    </label>
                    
                    <div className="flex flex-wrap gap-2">
                        {attribute.values.map(value => {
                            const isSelected = selectedValues[attribute.id] === value.value_id;
                            const isDisabled = !availableCombinations.some(combination =>
                                combination.attribute_values.some(attr =>
                                    attr.attribute_id === attribute.id && 
                                    attr.value_id === value.value_id
                                )
                            );

                            return (
                                <button
                                    key={value.value_id}
                                    type="button"
                                    onClick={() => !isDisabled && handleAttributeChange(attribute.id, value.value_id)}
                                    disabled={isDisabled}
                                    style={{
                                        ...getButtonStyles(isSelected),
                                        opacity: isDisabled ? 0.5 : 1,
                                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {value.value_name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Información de la combinación actual */}
            {currentCombination && (
                <div className="mt-4 p-3 rounded-md" style={{
                    backgroundColor: themeSettings?.secondary ? `hsl(${themeSettings.secondary})` : '#f9fafb',
                    borderColor: themeSettings?.borders ? `hsl(${themeSettings.borders})` : '#e5e7eb',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderRadius: themeSettings?.border_radius || '0.5rem',
                }}>
                    <div className="flex justify-between items-center">
                        <span className="text-sm" style={{
                            color: themeSettings?.text ? `hsl(${themeSettings.text})` : '#666666',
                            fontFamily: themeSettings?.body_font || 'inherit',
                        }}>
                            Combinación seleccionada
                        </span>
                        <span className="text-sm font-medium" style={{
                            color: themeSettings?.foreground ? `hsl(${themeSettings.foreground})` : '#000000',
                            fontFamily: themeSettings?.body_font || 'inherit',
                        }}>
                            {currentCombination.attribute_values.map(attr => attr.value_name).join(' / ')}
                        </span>
                    </div>
                    
                    <div className="mt-2 flex justify-between items-center">
                        <span className="text-sm" style={{
                            color: themeSettings?.text ? `hsl(${themeSettings.text})` : '#666666',
                            fontFamily: themeSettings?.body_font || 'inherit',
                        }}>
                            Disponibilidad:
                        </span>
                        <span className={`text-sm font-medium ${
                            getCurrentStock() > 0 ? 'text-green-600' : 'text-red-600'
                        }`} style={{
                            fontFamily: themeSettings?.body_font || 'inherit',
                        }}>
                            {getCurrentStock() > 0 
                                ? `${getCurrentStock()} disponibles`
                                : 'Agotado'
                            }
                        </span>
                    </div>
                </div>
            )}

            {/* Mensaje si no hay combinación válida */}
            {availableCombinations.length === 0 && Object.keys(selectedValues).length > 0 && (
                <div className="mt-4 p-3 rounded-md" style={{
                    backgroundColor: '#fee2e2',
                    borderColor: '#fecaca',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderRadius: themeSettings?.border_radius || '0.5rem',
                }}>
                    <p className="text-sm text-red-700" style={{
                        fontFamily: themeSettings?.body_font || 'inherit',
                    }}>
                        Esta combinación no está disponible. Por favor selecciona otras opciones.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProductDetailAttributesComponent;