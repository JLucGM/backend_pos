import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    getThemeWithDefaults,
    getResolvedFont,
    resolveStyleValue
} from '@/utils/themeUtils';

// Helper para añadir unidad (px) si es solo número
const withUnit = (value, unit = 'px') => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'string' && isNaN(Number(value))) return value;
    return `${value}${unit}`;
};

const ProductDetailAttributesComponent = ({
    comp,
    product,
    themeSettings,
    onCombinationChange,
    selectedCombination,
    appliedTheme
}) => {
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

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

    // Resolver contenido
    const rawContent = comp.content || {};
    const content = {};
    Object.keys(rawContent).forEach(key => {
        content[key] = resolveValue(rawContent[key]);
    });

    const [selectedValues, setSelectedValues] = useState({});
    const [availableCombinations, setAvailableCombinations] = useState([]);
    const prevCombinationRef = useRef(null);

    // Helper para convertir a número (entero) y comparar de forma segura
    const toNum = (val) => {
        if (val === null || val === undefined) return null;
        return Number(val);
    };

    // Extraer atributos únicos del producto
    const extractAttributes = () => {
        if (!product || !product.combinations || product.combinations.length === 0) {
            return [];
        }

        const attributesMap = {};

        product.combinations.forEach(combination => {
            combination.attribute_values.forEach(attr => {
                const attrId = toNum(attr.attribute_id);
                const valueId = toNum(attr.value_id);

                if (!attributesMap[attrId]) {
                    attributesMap[attrId] = {
                        id: attrId,
                        name: attr.attribute_name,
                        values: []
                    };
                }

                const valueExists = attributesMap[attrId].values.some(
                    v => v.value_id === valueId
                );

                if (!valueExists) {
                    attributesMap[attrId].values.push({
                        value_id: valueId,
                        value_name: attr.value_name
                    });
                }
            });
        });

        return Object.values(attributesMap);
    };

    // Filtrar combinaciones disponibles basadas en selecciones (usando números)
    const filterCombinations = () => {
        if (!product?.combinations) return [];

        return product.combinations.filter(combination => {
            return Object.entries(selectedValues).every(([attrId, valueId]) => {
                return combination.attribute_values.some(attr =>
                    toNum(attr.attribute_id) === toNum(attrId) &&
                    toNum(attr.value_id) === toNum(valueId)
                );
            });
        });
    };

    // Encontrar combinación exacta
    const findExactCombination = () => {
        if (!product?.combinations) return null;

        const attributes = extractAttributes();
        if (Object.keys(selectedValues).length < attributes.length) {
            return null;
        }

        return product.combinations.find(combination => {
            return Object.entries(selectedValues).every(([attrId, valueId]) => {
                return combination.attribute_values.some(attr =>
                    toNum(attr.attribute_id) === toNum(attrId) &&
                    toNum(attr.value_id) === toNum(valueId)
                );
            });
        });
    };

    // Obtener stock para la combinación actual
    const getCurrentStock = () => {
        if (!selectedCombination || !product?.stocks) return 0;
        const stock = product.stocks.find(s => toNum(s.combination_id) === toNum(selectedCombination.id));
        return stock ? stock.quantity : 0;
    };

    // Función de disponibilidad: verifica si un valor es alcanzable con las selecciones actuales
    const isValueAvailable = useCallback((attributeId, valueId) => {
        if (!product?.combinations) return false;
        const numAttrId = toNum(attributeId);
        const numValueId = toNum(valueId);

        return product.combinations.some(combination => {
            // La combinación debe contener este valor
            if (!combination.attribute_values.some(av => toNum(av.attribute_id) === numAttrId && toNum(av.value_id) === numValueId)) {
                return false;
            }
            // Debe coincidir con los valores seleccionados en otros atributos
            return Object.entries(selectedValues).every(([otherAttrId, otherValId]) => {
                if (toNum(otherAttrId) === numAttrId) return true; // Ignoramos el atributo actual
                return combination.attribute_values.some(av =>
                    toNum(av.attribute_id) === toNum(otherAttrId) && toNum(av.value_id) === toNum(otherValId)
                );
            });
        });
    }, [product, selectedValues]);

    // Manejar cambio de atributo
    const handleAttributeChange = (attributeId, valueId) => {
        const numAttrId = toNum(attributeId);
        const numValueId = toNum(valueId);
        setSelectedValues(prev => ({
            ...prev,
            [numAttrId]: numValueId
        }));
    };

    // Inicializar selecciones cuando cambia el producto o la combinación externa
    useEffect(() => {
        const attributes = extractAttributes();

        if (attributes.length === 0) {
            setSelectedValues({});
            setAvailableCombinations([]);
            return;
        }

        // Si hay una combinación seleccionada externamente, sincronizar selectedValues
        if (selectedCombination) {
            const initialSelections = {};
            selectedCombination.attribute_values.forEach(attr => {
                initialSelections[toNum(attr.attribute_id)] = toNum(attr.value_id);
            });
            setSelectedValues(initialSelections);
        } else {
            // Por defecto, seleccionar el primer valor de cada atributo
            const initialSelections = {};
            attributes.forEach(attr => {
                if (attr.values.length > 0) {
                    initialSelections[attr.id] = attr.values[0].value_id;
                }
            });
            setSelectedValues(initialSelections);
        }
    }, [product, selectedCombination]);

    // Actualizar combinaciones disponibles y notificar al padre solo si cambió
    useEffect(() => {
        const filtered = filterCombinations();
        setAvailableCombinations(filtered);

        const exact = findExactCombination();
        // Comparar con la combinación anterior para evitar bucles
        if (JSON.stringify(prevCombinationRef.current) !== JSON.stringify(exact)) {
            prevCombinationRef.current = exact;
            if (onCombinationChange) {
                onCombinationChange(exact);
            }
        }
    }, [selectedValues, product, onCombinationChange]);

    // ===========================================
    // FUNCIONES DE ESTILOS (COMPLETAS)
    // ===========================================
    const getFontStyles = (type = 'title') => {
        if (type === 'title') {
            const fontType = styles.titleFontType || 'default';
            let fontFamily;

            if (fontType === 'default') {
                fontFamily = resolveValue(themeWithDefaults?.heading_font || themeWithDefaults?.heading_font_family || "'Inter', sans-serif");
            } else if (fontType === 'custom' && styles.titleCustomFont) {
                fontFamily = styles.titleCustomFont;
            } else {
                switch (fontType) {
                    case 'body_font':
                        fontFamily = resolveValue(themeWithDefaults?.body_font || "'Inter', sans-serif");
                        break;
                    case 'heading_font':
                        fontFamily = resolveValue(themeWithDefaults?.heading_font || "'Inter', sans-serif");
                        break;
                    case 'subheading_font':
                        fontFamily = resolveValue(themeWithDefaults?.subheading_font || "'Inter', sans-serif");
                        break;
                    case 'accent_font':
                        fontFamily = resolveValue(themeWithDefaults?.accent_font || "'Georgia', serif");
                        break;
                    default:
                        fontFamily = resolveValue(themeWithDefaults?.body_font || "'Inter', sans-serif");
                }
            }

            let fontSize = styles.titleSize;
            let fontWeight = styles.titleFontWeight;

            if (!fontSize || !fontWeight) {
                const textStyle = styles.titleTextStyle || 'heading3';

                if (textStyle.startsWith('heading')) {
                    const level = textStyle.replace('heading', '');

                    if (!fontSize) {
                        const themeFontSize = themeWithDefaults?.[`heading${level}_fontSize`] || themeWithDefaults?.[`heading${level}_size`];
                        fontSize = themeFontSize || `${3.5 - (level * 0.25)}rem`;
                    }

                    if (!fontWeight) {
                        const themeFontWeight = themeWithDefaults?.[`heading${level}_fontWeight`];
                        fontWeight = themeFontWeight || 'bold';
                    }
                } else if (textStyle === 'paragraph') {
                    if (!fontSize) {
                        fontSize = themeWithDefaults?.paragraph_fontSize || themeWithDefaults?.paragraph_size || '16px';
                    }
                    if (!fontWeight) {
                        fontWeight = themeWithDefaults?.paragraph_fontWeight || 'normal';
                    }
                } else {
                    if (!fontSize) fontSize = '18px';
                    if (!fontWeight) fontWeight = 'bold';
                }
            }

            return {
                fontFamily,
                fontSize: withUnit(fontSize, styles.titleSizeUnit || (fontSize?.toString().includes('rem') ? 'rem' : 'px')),
                fontWeight,
                color: resolveValue(styles.titleColor || themeWithDefaults.heading),
                marginBottom: resolveValue(themeWithDefaults?.spacing_medium || '1rem'),
            };
        } else {
            return {
                fontFamily: resolveValue(themeWithDefaults?.body_font || "'Inter', sans-serif"),
                fontSize: withUnit(styles.labelSize || themeWithDefaults?.paragraph_fontSize || '14px', styles.labelSizeUnit || 'px'),
                fontWeight: styles.labelFontWeight || themeWithDefaults?.paragraph_fontWeight || 'normal',
                color: resolveValue(styles.labelColor || themeWithDefaults?.text || '#666666'),
                marginBottom: resolveValue(themeWithDefaults?.spacing_small || '0.5rem'),
                display: 'block',
            };
        }
    };

    // Estilos del contenedor
    const containerStyles = {
        marginBottom: resolveValue(themeWithDefaults?.spacing_large || '2rem'),
        padding: resolveValue(themeWithDefaults?.spacing_small || '0.5rem'),
        ...styles,
    };

    // Estilos para botones
    const getButtonStyles = (isSelected) => {
        const baseStyles = {
            padding: `${resolveValue(themeWithDefaults?.spacing_small || '0.5rem')} ${resolveValue(themeWithDefaults?.spacing_medium || '1rem')}`,
            borderRadius: withUnit(styles.buttonBorderRadius || resolveValue(themeWithDefaults?.border_radius || '6px')),
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s',
            minWidth: '60px',
            borderWidth: '1px',
            borderStyle: 'solid',
            cursor: 'pointer',
            fontFamily: resolveValue(themeWithDefaults?.button_font_family || 'inherit'),
        };

        if (isSelected) {
            return {
                ...baseStyles,
                backgroundColor: resolveValue(styles.selectedBgColor || themeWithDefaults?.primary_button_background || '#dbeafe'),
                color: resolveValue(styles.selectedTextColor || themeWithDefaults?.primary_button_text || '#1e40af'),
                borderColor: resolveValue(styles.selectedBorderColor || themeWithDefaults?.primary_button_border || '#93c5fd'),
            };
        } else {
            return {
                ...baseStyles,
                backgroundColor: resolveValue(styles.buttonBgColor || themeWithDefaults?.secondary_button_background),
                color: resolveValue(styles.buttonColor || themeWithDefaults?.secondary_button_text),
                borderColor: resolveValue(styles.buttonBorderColor || themeWithDefaults?.borders),
            };
        }
    };

    const attributes = extractAttributes();

    if (attributes.length === 0) {
        // Placeholder en builder
        if (!product) {
            return (
                <div style={containerStyles} className="product-attributes">
                    <h3 className="text-lg font-semibold mb-4" style={getFontStyles('title')}>
                        {content.title || 'Opciones del Producto'}
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
        return null;
    }

    return (
        <div style={containerStyles} className="product-attributes">
            <h3 className="text-lg font-semibold mb-4" style={getFontStyles('title')}>
                {content.title || 'Opciones'}
            </h3>

            {attributes.map(attribute => (
                <div key={attribute.id} className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={getFontStyles('label')}>
                        {attribute.name}:
                    </label>

                    <div className="flex flex-wrap gap-2">
                        {attribute.values.map(value => {
                            const isSelected = selectedValues[attribute.id] === value.value_id;
                            const available = isValueAvailable(attribute.id, value.value_id);

                            return (
                                <button
                                    key={value.value_id}
                                    type="button"
                                    onClick={() => available && handleAttributeChange(attribute.id, value.value_id)}
                                    disabled={!available}
                                    style={{
                                        ...getButtonStyles(isSelected),
                                        opacity: !available ? 0.5 : 1,
                                        cursor: !available ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {value.value_name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}

            {selectedCombination && (
                <div className="mt-4 p-3 rounded-md" style={{
                    backgroundColor: resolveValue(themeWithDefaults.background),
                    borderColor: resolveValue(themeWithDefaults.borders),
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderRadius: resolveValue(themeWithDefaults?.border_radius || '0.5rem'),
                }}>
                    <div className="flex justify-between items-center">
                        <span className="text-sm" style={{
                            color: resolveValue(themeWithDefaults?.text || '#666666'),
                            fontFamily: resolveValue(themeWithDefaults?.body_font || 'inherit'),
                        }}>
                            Combinación seleccionada
                        </span>
                        <span className="text-sm font-medium" style={{
                            color: resolveValue(themeWithDefaults.heading),
                            fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                        }}>
                            {selectedCombination.attribute_values.map(attr => attr.value_name).join(' / ')}
                        </span>
                    </div>

                    <div className="mt-2 flex justify-between items-center">
                        <span className="text-sm" style={{
                            color: resolveValue(themeWithDefaults?.text || '#666666'),
                            fontFamily: resolveValue(themeWithDefaults?.body_font || 'inherit'),
                        }}>
                            Disponibilidad:
                        </span>
                        <span className={`text-sm font-medium ${getCurrentStock() > 0 ? 'text-green-600' : 'text-red-600'}`} style={{
                            fontFamily: resolveValue(themeWithDefaults?.body_font || 'inherit'),
                        }}>
                            {getCurrentStock() > 0
                                ? `${getCurrentStock()} disponibles`
                                : 'Agotado'
                            }
                        </span>
                    </div>
                </div>
            )}

            {availableCombinations.length === 0 && Object.keys(selectedValues).length > 0 && (
                <div className="mt-4 p-3 rounded-md" style={{
                    backgroundColor: '#fee2e2',
                    borderColor: '#fecaca',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderRadius: resolveValue(themeWithDefaults?.border_radius || '0.5rem'),
                }}>
                    <p className="text-sm text-red-700" style={{
                        fontFamily: resolveValue(themeWithDefaults?.body_font || 'inherit'),
                    }}>
                        Esta combinación no está disponible. Por favor selecciona otras opciones.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProductDetailAttributesComponent;