import React, { useState, useEffect } from 'react';
import {
    getThemeWithDefaults,
    getComponentStyles,
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

    // Resolver contenido (por si tiene referencias)
    const rawContent = comp.content || {};
    const content = {};
    Object.keys(rawContent).forEach(key => {
        content[key] = resolveValue(rawContent[key]);
    });

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

    // ===========================================
    // FUNCIONES DE ESTILOS CON VALORES RESUELTOS
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

    // Estilos del contenedor con valores resueltos
    const containerStyles = {
        marginBottom: resolveValue(themeWithDefaults?.spacing_large || '2rem'),
        padding: resolveValue(themeWithDefaults?.spacing_small || '0.5rem'),
        ...styles, // estilos personalizados ya resueltos
    };

    // Estilos para botones seleccionados y no seleccionados
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

            {currentCombination && (
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
                            {currentCombination.attribute_values.map(attr => attr.value_name).join(' / ')}
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