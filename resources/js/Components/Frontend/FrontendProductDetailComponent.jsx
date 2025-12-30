import cartHelper from '@/Helper/cartHelper';
import React, { useState, useEffect } from 'react';
// import { Alert } from '../ui/alert';

const FrontendProductDetailComponent = ({ comp, product, themeSettings, companyId }) => {
    // console.log("🔵 Componente montado con producto:", product?.product_name);

    const children = comp.content?.children || [];
    const componentStyles = comp.styles || {};

    // Extraer configuraciones de layout y estilos con valores por defecto del tema
    const layoutType = componentStyles.layoutType || 'grid';
    const padding = componentStyles.padding || themeSettings?.spacing_medium || '20px';
    const backgroundColor = componentStyles.backgroundColor || (themeSettings?.background ? `hsl(${themeSettings.background})` : '#ffffff');
    const maxWidth = componentStyles.maxWidth || '100%';
    const gap = componentStyles.gap || themeSettings?.spacing_large || '60px';

    // Padding individual con valores por defecto del tema
    const paddingTop = componentStyles.paddingTop || themeSettings?.spacing_medium || '20px';
    const paddingRight = componentStyles.paddingRight || themeSettings?.spacing_medium || '20px';
    const paddingBottom = componentStyles.paddingBottom || themeSettings?.spacing_medium || '20px';
    const paddingLeft = componentStyles.paddingLeft || themeSettings?.spacing_medium || '20px';

    // Separar componentes por tipo
    const imageComponents = children.filter(child => child.type === 'productDetailImage');
    const descriptionComponents = children.filter(child => child.type === 'productDetailDescription');
    const otherComponents = children.filter(child =>
        child.type !== 'productDetailImage' && child.type !== 'productDetailDescription'
    );

    const [selectedCombination, setSelectedCombination] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [currentPrice, setCurrentPrice] = useState(product?.product_price || '0.00');
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [currentImage, setCurrentImage] = useState('');
    const [imageGallery, setImageGallery] = useState([]);

    // Extraer atributos únicos del producto
    const attributes = React.useMemo(() => {
        if (!product?.combinations?.length) return [];

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
    }, [product]);

    // Configurar estilos del contenedor basado en layoutType
    const getContainerStyles = () => {
        const baseStyles = {
            padding,
            backgroundColor,
            maxWidth,
            margin: '0 auto',
            boxSizing: 'border-box',
            paddingTop,
            paddingRight,
            paddingBottom,
            paddingLeft,
        };

        switch (layoutType) {
            case 'grid':
                return {
                    ...baseStyles,
                    display: 'grid',
                    gridTemplateColumns: imageComponents.length > 0 ? '1fr 1fr' : '1fr',
                    gap,
                    alignItems: 'start',
                };
            case 'stack':
            default:
                return {
                    ...baseStyles,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: themeSettings?.spacing_medium || '20px',
                };
        }
    };

    const containerStyles = getContainerStyles();

    // Función para obtener imágenes de una combinación
    const getCombinationImages = (combination) => {
        if (!combination) return [];

        // Si la combinación tiene imágenes específicas
        if (combination.images && Array.isArray(combination.images)) {
            return combination.images;
        }

        // Si la combinación tiene una sola imagen
        if (combination.image_url) {
            return [{ url: combination.image_url, is_main: true }];
        }

        // Si no hay imágenes específicas, usar las del producto
        return product?.media || [];
    };

    // Inicializar atributos cuando se cargan
    useEffect(() => {
        if (attributes.length === 0) {
            setSelectedAttributes({});
            setSelectedCombination(null);
            setCurrentImage(product?.media?.[0]?.original_url || '');
            setImageGallery(product?.media || []);
            return;
        }

        // Seleccionar el primer valor de cada atributo
        const initialSelections = {};
        attributes.forEach(attr => {
            if (attr.values.length > 0) {
                initialSelections[attr.id] = attr.values[0].value_id;
            }
        });

        setSelectedAttributes(initialSelections);

        // Encontrar la combinación que coincida con todas las selecciones
        if (product?.combinations) {
            const exactCombination = product.combinations.find(combination => {
                return Object.entries(initialSelections).every(([attrId, valueId]) => {
                    return combination.attribute_values.some(attr =>
                        attr.attribute_id.toString() === attrId &&
                        attr.value_id.toString() === valueId.toString()
                    );
                });
            });

            setSelectedCombination(exactCombination);

            if (exactCombination) {
                setCurrentPrice(exactCombination.price || product.product_price);

                // Obtener imágenes de la combinación
                const images = getCombinationImages(exactCombination);
                setImageGallery(images);

                if (images.length > 0) {
                    const mainImage = images.find(img => img.is_main) || images[0];
                    setCurrentImage(mainImage.original_url || mainImage.url || '');
                } else {
                    setCurrentImage(product.media?.[0]?.original_url || '');
                }
            } else {
                // Si no hay combinación, usar imágenes por defecto del producto
                setCurrentImage(product?.media?.[0]?.original_url || '');
                setImageGallery(product?.media || []);
            }
        }
    }, [attributes, product]);

    // Manejar cambio de atributo
    const handleAttributeChange = (attributeId, valueId) => {
        const newSelectedAttributes = {
            ...selectedAttributes,
            [attributeId]: valueId
        };

        setSelectedAttributes(newSelectedAttributes);

        // Encontrar combinación exacta
        if (product?.combinations) {
            const exactCombination = product.combinations.find(combination => {
                return Object.entries(newSelectedAttributes).every(([attrId, valId]) => {
                    return combination.attribute_values.some(attr =>
                        attr.attribute_id.toString() === attrId &&
                        attr.value_id.toString() === valId.toString()
                    );
                });
            });

            setSelectedCombination(exactCombination);

            if (exactCombination) {
                setCurrentPrice(exactCombination.price || product.product_price);

                // Actualizar imágenes según la combinación seleccionada
                const images = getCombinationImages(exactCombination);
                setImageGallery(images);

                if (images.length > 0) {
                    const mainImage = images.find(img => img.is_main) || images[0];
                    setCurrentImage(mainImage.original_url || mainImage.url || '');
                } else {
                    setCurrentImage(product.media?.[0]?.original_url || '');
                }
            } else {
                // Si no se encuentra combinación exacta, usar imágenes por defecto
                setCurrentImage(product?.media?.[0]?.original_url || '');
                setImageGallery(product?.media || []);
            }
        }
    };

    // Determinar si un valor está disponible
    const isValueAvailable = (attributeId, valueId) => {
        if (!product?.combinations) return false;

        const otherSelectedAttributes = { ...selectedAttributes };
        delete otherSelectedAttributes[attributeId];

        const availableCombinations = product.combinations.filter(combination => {
            const hasThisValue = combination.attribute_values.some(
                attr => attr.attribute_id.toString() === attributeId.toString() &&
                    attr.value_id.toString() === valueId.toString()
            );

            if (!hasThisValue) return false;

            return Object.entries(otherSelectedAttributes).every(([attrId, valId]) => {
                return combination.attribute_values.some(attr =>
                    attr.attribute_id.toString() === attrId &&
                    attr.value_id.toString() === valId.toString()
                );
            });
        });

        return availableCombinations.length > 0;
    };

    // Función para obtener estilos de borde con borderRadius
    const getBorderStyles = (childStyles) => {
        const styles = {};

        // Configurar borde
        if (childStyles.imageBorder === 'solid') {
            const borderColor = childStyles.imageBorderColor || (themeSettings?.borders ? `hsl(${themeSettings.borders})` : 'rgba(0, 0, 0, 0.1)');
            styles.border = `${childStyles.imageBorderThickness || '1px'} solid ${borderColor}`;
        } else if (childStyles.imageBorder === 'none') {
            styles.border = 'none';
        } else if (childStyles.imageBorder === 'dashed') {
            const borderColor = childStyles.imageBorderColor || (themeSettings?.borders ? `hsl(${themeSettings.borders})` : 'rgba(0, 0, 0, 0.1)');
            styles.border = `${childStyles.imageBorderThickness || '1px'} dashed ${borderColor}`;
        }

        // Configurar borderRadius
        if (childStyles.imageBorderRadius) {
            styles.borderRadius = childStyles.imageBorderRadius;
        } else if (childStyles.borderRadius) {
            styles.borderRadius = childStyles.borderRadius;
        } else if (themeSettings?.border_radius) {
            styles.borderRadius = themeSettings.border_radius;
        }

        return styles;
    };

    // Componente para mostrar los atributos
    const renderAttributes = (child) => {
        if (attributes.length === 0) {
            return null;
        }

        const childStyles = child.styles || {};
        const childContent = child.content || {};

        return (
            <div className="product-attributes mb-6" style={childStyles}>
                <h3
                    className="text-lg font-semibold mb-4"
                    style={{
                        color: childStyles.titleColor || (themeSettings?.heading ? `hsl(${themeSettings.heading})` : '#000000'),
                        fontSize: childStyles.titleSize || themeSettings?.heading4_fontSize || '18px',
                        fontFamily: themeSettings?.heading_font_family || 'inherit',
                    }}
                >
                    {childContent.title || 'Opciones del Producto'}
                </h3>
                {attributes.map(attribute => (
                    <div key={attribute.id} className="mb-4">
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{
                                color: childStyles.labelColor || (themeSettings?.text ? `hsl(${themeSettings.text})` : '#666666'),
                                fontSize: childStyles.labelSize || themeSettings?.paragraph_fontSize || '14px',
                                fontFamily: themeSettings?.body_font || 'inherit',
                            }}
                        >
                            {attribute.name}:
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {attribute.values.map(value => {
                                const isSelected = selectedAttributes[attribute.id] === value.value_id;
                                const isAvailable = isValueAvailable(attribute.id, value.value_id);

                                // Configurar estilos base del botón
                                const buttonStyles = {
                                    padding: childStyles.buttonPadding || themeSettings?.spacing_small || '8px 16px',
                                    borderRadius: childStyles.buttonBorderRadius || themeSettings?.button_border_radius || '4px',
                                    fontWeight: childStyles.buttonFontWeight || '500',
                                    transition: 'all 0.2s',
                                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                                    opacity: isAvailable ? 1 : 0.5,
                                    fontFamily: themeSettings?.button_font_family || 'inherit',
                                };

                                // Configurar borde
                                if (childStyles.buttonBorder) {
                                    buttonStyles.border = childStyles.buttonBorder;
                                } else {
                                    buttonStyles.borderWidth = childStyles.buttonBorderWidth || '1px';
                                    buttonStyles.borderStyle = childStyles.buttonBorderStyle || 'solid';
                                    buttonStyles.borderColor = childStyles.buttonBorderColor || (themeSettings?.borders ? `hsl(${themeSettings.borders})` : '#d1d5db');
                                }

                                // Configurar estados
                                if (isSelected) {
                                    buttonStyles.backgroundColor = childStyles.selectedBgColor || (themeSettings?.primary_button_background ? `hsl(${themeSettings.primary_button_background})` : '#2563eb');
                                    buttonStyles.color = childStyles.selectedColor || (themeSettings?.primary_button_text ? `hsl(${themeSettings.primary_button_text})` : '#ffffff');
                                    if (childStyles.selectedButtonBorder) {
                                        buttonStyles.border = childStyles.selectedButtonBorder;
                                    } else {
                                        buttonStyles.borderColor = childStyles.selectedBorderColor || (themeSettings?.primary_button_border ? `hsl(${themeSettings.primary_button_border})` : '#2563eb');
                                        if (childStyles.selectedBorderWidth) {
                                            buttonStyles.borderWidth = childStyles.selectedBorderWidth;
                                        }
                                    }
                                } else {
                                    buttonStyles.backgroundColor = childStyles.buttonBgColor || (themeSettings?.secondary_button_background ? `hsl(${themeSettings.secondary_button_background})` : '#ffffff');
                                    buttonStyles.color = childStyles.buttonColor || (themeSettings?.secondary_button_text ? `hsl(${themeSettings.secondary_button_text})` : '#374151');
                                }

                                return (
                                    <button
                                        key={value.value_id}
                                        type="button"
                                        onClick={() => isAvailable && handleAttributeChange(attribute.id, value.value_id)}
                                        disabled={!isAvailable}
                                        style={buttonStyles}
                                    >
                                        {value.value_name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Componente para mostrar el stock
// Reemplaza tu función renderStock actual con esta versión:
const renderStock = (child) => {
    if (!product) return null;

    // Obtener stock para producto simple o combinación
    const getStockInfo = () => {
        if (!product?.stocks) return { quantity: 0, status: 'unavailable' };
        
        if (selectedCombination) {
            const stock = product.stocks.find(s => s.combination_id === selectedCombination.id);
            const quantity = stock ? stock.quantity : 0;
            
            return {
                quantity,
                status: quantity > 0 ? 'in_stock' : 'out_of_stock'
            };
        } else {
            const totalQuantity = product.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
            
            let status = 'out_of_stock';
            if (totalQuantity > 5) {
                status = 'in_stock';
            } else if (totalQuantity > 0) {
                status = 'low_stock';
            }
            
            return {
                quantity: totalQuantity,
                status
            };
        }
    };

    const stockInfo = getStockInfo();
    const childStyles = child.styles || {};
    const childContent = child.content || {};

    // Función para obtener estilos de fuente (similar a ProductDetailStockComponent)
    const getFontStyles = () => {
        const styles = childStyles || {};
        const fontType = styles.fontType || 'default';
        let fontFamily;
        
        if (fontType === 'default') {
            fontFamily = themeSettings?.body_font || "'Inter', sans-serif";
        } else if (fontType === 'custom' && styles.customFont) {
            fontFamily = styles.customFont;
        } else {
            switch(fontType) {
                case 'body_font':
                    fontFamily = themeSettings?.body_font || "'Inter', sans-serif";
                    break;
                case 'heading_font':
                    fontFamily = themeSettings?.heading_font || "'Inter', sans-serif";
                    break;
                case 'subheading_font':
                    fontFamily = themeSettings?.subheading_font || "'Inter', sans-serif";
                    break;
                case 'accent_font':
                    fontFamily = themeSettings?.accent_font || "'Inter', sans-serif";
                    break;
                default:
                    fontFamily = themeSettings?.body_font || "'Inter', sans-serif";
            }
        }
        
        return {
            fontFamily,
            fontSize: styles.fontSize || '14px',
            fontWeight: styles.fontWeight || '500',
        };
    };

    // Estilos condicionales basados en estado
    const getStatusStyles = () => {
        const status = stockInfo.status;
        
        switch(status) {
            case 'in_stock':
                return {
                    backgroundColor: childStyles.inStockBgColor || '#dcfce7',
                    color: childStyles.inStockColor || '#166534',
                    borderColor: childStyles.inStockBorderColor || '#bbf7d0',
                };
            case 'low_stock':
                return {
                    backgroundColor: childStyles.lowStockBgColor || '#fef9c3',
                    color: childStyles.lowStockColor || '#854d0e',
                    borderColor: childStyles.lowStockBorderColor || '#fef08a',
                };
            case 'out_of_stock':
            default:
                return {
                    backgroundColor: childStyles.outOfStockBgColor || '#fee2e2',
                    color: childStyles.outOfStockColor || '#991b1b',
                    borderColor: childStyles.outOfStockBorderColor || '#fecaca',
                };
        }
    };

    // Determinar mensaje según cantidad (usando contenido personalizado)
    const getStockMessage = () => {
        const quantity = stockInfo.quantity;
        
        if (quantity <= 0) {
            return childContent?.outOfStockText || 'Agotado';
        } else if (quantity <= 5) {
            return childContent?.lowStockText || `Solo ${quantity} disponibles`;
        } else {
            return childContent?.inStockText || `En stock (${quantity} disponibles)`;
        }
    };

    // Determinar icono (usando contenido personalizado)
    const getStockIcon = () => {
        const status = stockInfo.status;
        
        if (status === 'in_stock') {
            return childContent?.inStockIcon || '✓';
        } else if (status === 'low_stock') {
            return childContent?.lowStockIcon || '⚠';
        } else {
            return childContent?.outOfStockIcon || '✗';
        }
    };

    const statusStyles = getStatusStyles();
    const fontStyles = getFontStyles();

    return (
        <div className="product-stock" style={{
            ...childStyles,
            padding: childStyles?.padding || '12px 16px',
            borderRadius: childStyles?.borderRadius || '8px',
            borderWidth: childStyles?.borderWidth || '1px',
            borderStyle: 'solid',
            ...statusStyles,
            ...fontStyles,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        }}>
            <span className="stock-icon" style={{
                fontSize: childStyles?.iconSize || '16px',
                fontWeight: 'bold',
            }}>
                {getStockIcon()}
            </span>
            
            <span className="stock-message" style={fontStyles}>
                {getStockMessage()}
            </span>

            {childContent?.showSku && product?.stocks?.[0]?.sku && (
                <span className="stock-sku ml-auto text-xs opacity-70">
                    SKU: {product.stocks[0].sku}
                </span>
            )}
        </div>
    );
};

    // Función para obtener estilos del precio
    const getProductDetailPriceStyles = (customStyles) => {
        // Determinar el estilo de texto seleccionado
        const textStyle = customStyles?.textStyle || 'heading3';
        const theme = themeSettings || {};

        // Función para obtener la fuente según el tipo seleccionado
        const getFontFamily = () => {
            const fontType = customStyles?.fontType || 'default';

            if (fontType === 'default' || !fontType) {
                // Para precios, generalmente usamos la fuente del body
                return theme?.body_font || theme?.font_family || "'Inter', sans-serif";
            }

            if (fontType === 'custom' && customStyles?.customFont) {
                return customStyles.customFont;
            }

            switch (fontType) {
                case 'body_font':
                    return theme?.body_font || theme?.font_family || "'Inter', sans-serif";
                case 'heading_font':
                    return theme?.heading_font || theme?.heading_font_family || "'Inter', sans-serif";
                case 'subheading_font':
                    return theme?.subheading_font || "'Inter', sans-serif";
                case 'accent_font':
                    return theme?.accent_font || "'Georgia', serif";
                default:
                    return theme?.body_font || theme?.font_family || "'Inter', sans-serif";
            }
        };

        // Obtener configuración según el estilo seleccionado
        let fontSize, fontWeight, lineHeight, textTransform;

        switch (textStyle) {
            case 'paragraph':
                fontSize = customStyles?.fontSize || theme?.paragraph_fontSize || theme?.paragraph_size || '16px';
                fontWeight = customStyles?.fontWeight || theme?.paragraph_fontWeight || 'normal';
                lineHeight = customStyles?.lineHeight || theme?.paragraph_lineHeight || theme?.paragraph_line_height || '1.6';
                textTransform = customStyles?.textTransform || theme?.paragraph_textTransform || 'none';
                break;

            case 'heading1':
                fontSize = customStyles?.fontSize || theme?.heading1_fontSize || theme?.heading1_size || '2.5rem';
                fontWeight = customStyles?.fontWeight || theme?.heading1_fontWeight || 'bold';
                lineHeight = customStyles?.lineHeight || theme?.heading1_lineHeight || theme?.heading1_line_height || '1.2';
                textTransform = customStyles?.textTransform || theme?.heading1_textTransform || theme?.heading1_case || 'none';
                break;

            case 'heading2':
                fontSize = customStyles?.fontSize || theme?.heading2_fontSize || theme?.heading2_size || '2rem';
                fontWeight = customStyles?.fontWeight || theme?.heading2_fontWeight || 'bold';
                lineHeight = customStyles?.lineHeight || theme?.heading2_lineHeight || theme?.heading2_line_height || '1.3';
                textTransform = customStyles?.textTransform || theme?.heading2_textTransform || theme?.heading2_case || 'none';
                break;

            case 'heading3':
                fontSize = customStyles?.fontSize || theme?.heading3_fontSize || theme?.heading3_size || '1.75rem';
                fontWeight = customStyles?.fontWeight || theme?.heading3_fontWeight || 'bold';
                lineHeight = customStyles?.lineHeight || theme?.heading3_lineHeight || theme?.heading3_line_height || '1.3';
                textTransform = customStyles?.textTransform || theme?.heading3_textTransform || theme?.heading3_case || 'none';
                break;

            case 'heading4':
                fontSize = customStyles?.fontSize || theme?.heading4_fontSize || theme?.heading4_size || '1.5rem';
                fontWeight = customStyles?.fontWeight || theme?.heading4_fontWeight || 'bold';
                lineHeight = customStyles?.lineHeight || theme?.heading4_lineHeight || theme?.heading4_line_height || '1.4';
                textTransform = customStyles?.textTransform || theme?.heading4_textTransform || theme?.heading4_case || 'none';
                break;

            case 'heading5':
                fontSize = customStyles?.fontSize || theme?.heading5_fontSize || theme?.heading5_size || '1.25rem';
                fontWeight = customStyles?.fontWeight || theme?.heading5_fontWeight || 'bold';
                lineHeight = customStyles?.lineHeight || theme?.heading5_lineHeight || theme?.heading5_line_height || '1.4';
                textTransform = customStyles?.textTransform || theme?.heading5_textTransform || theme?.heading5_case || 'none';
                break;

            case 'heading6':
                fontSize = customStyles?.fontSize || theme?.heading6_fontSize || theme?.heading6_size || '1rem';
                fontWeight = customStyles?.fontWeight || theme?.heading6_fontWeight || 'bold';
                lineHeight = customStyles?.lineHeight || theme?.heading6_lineHeight || theme?.heading6_line_height || '1.5';
                textTransform = customStyles?.textTransform || theme?.heading6_textTransform || theme?.heading6_case || 'none';
                break;

            case 'custom':
            default:
                fontSize = customStyles?.fontSize || '24px';
                fontWeight = customStyles?.fontWeight || 'bold';
                lineHeight = customStyles?.lineHeight || '1.4';
                textTransform = customStyles?.textTransform || 'none';
                break;
        }

        // Calcular line-height si es personalizado
        let finalLineHeight = lineHeight;
        if (lineHeight === 'tight') finalLineHeight = '1.2';
        if (lineHeight === 'normal') finalLineHeight = '1.4';
        if (lineHeight === 'loose') finalLineHeight = '1.6';
        if (customStyles?.customLineHeight && lineHeight === 'custom') {
            finalLineHeight = customStyles.customLineHeight;
        }

        // Layout
        const layout = customStyles?.layout || 'fit';
        const width = layout === 'fill' ? '100%' : 'auto';
        const alignment = customStyles?.alignment || 'left';
        const textAlign = layout === 'fill' ? alignment : 'left';

        // Padding individual con valores del tema
        const paddingTop = customStyles?.paddingTop || theme?.spacing_small || '0px';
        const paddingRight = customStyles?.paddingRight || theme?.spacing_small || '0px';
        const paddingBottom = customStyles?.paddingBottom || theme?.spacing_small || '0px';
        const paddingLeft = customStyles?.paddingLeft || theme?.spacing_small || '0px';

        // Color - usar color del texto del tema por defecto
        const color = customStyles?.color || (theme?.text ? `hsl(${theme.text})` : '#000000');

        return {
            width,
            textAlign,
            display: layout === 'fit' ? 'inline-block' : 'block',
            fontFamily: getFontFamily(),
            fontSize,
            fontWeight,
            lineHeight: finalLineHeight,
            textTransform,
            color,
            margin: customStyles?.margin || `${theme?.spacing_medium || '1rem'} 0`,
            paddingTop,
            paddingRight,
            paddingBottom,
            paddingLeft,
            backgroundColor: customStyles?.backgroundColor || 'transparent',
            borderRadius: customStyles?.borderRadius || theme?.border_radius || '0px',
        };
    };

    // Función para obtener estilos del nombre del producto
    const getProductDetailNameStyles = (customStyles) => {
        // Determinar el estilo de texto seleccionado
        const textStyle = customStyles?.textStyle || 'heading1';
        const theme = themeSettings || {};

        // Función para obtener la fuente según el tipo seleccionado
        const getFontFamily = () => {
            const fontType = customStyles?.fontType || 'default';

            if (fontType === 'default' || !fontType) {
                // Para headings, usar la fuente de heading del tema
                if (textStyle.startsWith('heading')) {
                    return theme?.heading_font || theme?.heading_font_family || "'Inter', sans-serif";
                }
                return theme?.body_font || theme?.font_family || "'Inter', sans-serif";
            }

            if (fontType === 'custom' && customStyles?.customFont) {
                return customStyles.customFont;
            }

            switch (fontType) {
                case 'body_font':
                    return theme?.body_font || theme?.font_family || "'Inter', sans-serif";
                case 'heading_font':
                    return theme?.heading_font || theme?.heading_font_family || "'Inter', sans-serif";
                case 'subheading_font':
                    return theme?.subheading_font || "'Inter', sans-serif";
                case 'accent_font':
                    return theme?.accent_font || "'Georgia', serif";
                default:
                    return theme?.body_font || theme?.font_family || "'Inter', sans-serif";
            }
        };

        // Obtener configuración según el estilo seleccionado
        let fontSize, fontWeight, lineHeight, textTransform;

        switch (textStyle) {
            case 'paragraph':
                fontSize = customStyles?.fontSize || theme?.paragraph_fontSize || theme?.paragraph_size || '16px';
                fontWeight = customStyles?.fontWeight || theme?.paragraph_fontWeight || 'normal';
                lineHeight = customStyles?.lineHeight || theme?.paragraph_lineHeight || theme?.paragraph_line_height || '1.6';
                textTransform = customStyles?.textTransform || theme?.paragraph_textTransform || 'none';
                break;

            case 'heading1':
                fontSize = customStyles?.fontSize || theme?.heading1_fontSize || theme?.heading1_size || '2.5rem';
                fontWeight = customStyles?.fontWeight || theme?.heading1_fontWeight || 'bold';
                lineHeight = customStyles?.lineHeight || theme?.heading1_lineHeight || theme?.heading1_line_height || '1.2';
                textTransform = customStyles?.textTransform || theme?.heading1_textTransform || theme?.heading1_case || 'none';
                break;

            case 'heading2':
                fontSize = customStyles?.fontSize || theme?.heading2_fontSize || theme?.heading2_size || '2rem';
                fontWeight = customStyles?.fontWeight || theme?.heading2_fontWeight || 'bold';
                lineHeight = customStyles?.lineHeight || theme?.heading2_lineHeight || theme?.heading2_line_height || '1.3';
                textTransform = customStyles?.textTransform || theme?.heading2_textTransform || theme?.heading2_case || 'none';
                break;

            case 'heading3':
                fontSize = customStyles?.fontSize || theme?.heading3_fontSize || theme?.heading3_size || '1.75rem';
                fontWeight = customStyles?.fontWeight || theme?.heading3_fontWeight || 'bold';
                lineHeight = customStyles?.lineHeight || theme?.heading3_lineHeight || theme?.heading3_line_height || '1.3';
                textTransform = customStyles?.textTransform || theme?.heading3_textTransform || theme?.heading3_case || 'none';
                break;

            case 'heading4':
                fontSize = customStyles?.fontSize || theme?.heading4_fontSize || theme?.heading4_size || '1.5rem';
                fontWeight = customStyles?.fontWeight || theme?.heading4_fontWeight || 'bold';
                lineHeight = customStyles?.lineHeight || theme?.heading4_lineHeight || theme?.heading4_line_height || '1.4';
                textTransform = customStyles?.textTransform || theme?.heading4_textTransform || theme?.heading4_case || 'none';
                break;

            case 'heading5':
                fontSize = customStyles?.fontSize || theme?.heading5_fontSize || theme?.heading5_size || '1.25rem';
                fontWeight = customStyles?.fontWeight || theme?.heading5_fontWeight || 'bold';
                lineHeight = customStyles?.lineHeight || theme?.heading5_lineHeight || theme?.heading5_line_height || '1.4';
                textTransform = customStyles?.textTransform || theme?.heading5_textTransform || theme?.heading5_case || 'none';
                break;

            case 'heading6':
                fontSize = customStyles?.fontSize || theme?.heading6_fontSize || theme?.heading6_size || '1rem';
                fontWeight = customStyles?.fontWeight || theme?.heading6_fontWeight || 'bold';
                lineHeight = customStyles?.lineHeight || theme?.heading6_lineHeight || theme?.heading6_line_height || '1.5';
                textTransform = customStyles?.textTransform || theme?.heading6_textTransform || theme?.heading6_case || 'none';
                break;

            case 'custom':
            default:
                fontSize = customStyles?.fontSize || '32px';
                fontWeight = customStyles?.fontWeight || 'bold';
                lineHeight = customStyles?.lineHeight || '1.2';
                textTransform = customStyles?.textTransform || 'none';
                break;
        }

        // Calcular line-height si es personalizado
        let finalLineHeight = lineHeight;
        if (lineHeight === 'tight') finalLineHeight = '1.2';
        if (lineHeight === 'normal') finalLineHeight = '1.4';
        if (lineHeight === 'loose') finalLineHeight = '1.6';
        if (customStyles?.customLineHeight && lineHeight === 'custom') {
            finalLineHeight = customStyles.customLineHeight;
        }

        // Layout
        const layout = customStyles?.layout || 'fit';
        const width = layout === 'fill' ? '100%' : 'auto';
        const alignment = customStyles?.alignment || 'left';
        const textAlign = layout === 'fill' ? alignment : 'left';

        // Padding individual con valores del tema
        const paddingTop = customStyles?.paddingTop || theme?.spacing_small || '0px';
        const paddingRight = customStyles?.paddingRight || theme?.spacing_small || '0px';
        const paddingBottom = customStyles?.paddingBottom || theme?.spacing_small || '0px';
        const paddingLeft = customStyles?.paddingLeft || theme?.spacing_small || '0px';

        // Color - usar color de heading del tema por defecto
        const color = customStyles?.color || (theme?.heading ? `hsl(${theme.heading})` : '#000000');

        return {
            width,
            textAlign,
            display: layout === 'fit' ? 'inline-block' : 'block',
            fontFamily: getFontFamily(),
            fontSize,
            fontWeight,
            lineHeight: finalLineHeight,
            textTransform,
            color,
            margin: customStyles?.margin || `${theme?.spacing_medium || '1rem'} 0`,
            paddingTop,
            paddingRight,
            paddingBottom,
            paddingLeft,
            backgroundColor: customStyles?.backgroundColor || 'transparent',
            borderRadius: customStyles?.borderRadius || theme?.border_radius || '0px',
        };
    };

    // Función para obtener estilos de la descripción
    const getProductDetailDescriptionStyles = (customStyles) => {
        // Usar estilo de párrafo para descripciones
        const textStyle = customStyles?.textStyle || 'paragraph';
        const theme = themeSettings || {};

        // Obtener configuración según el estilo seleccionado
        let fontSize, fontWeight, lineHeight, textTransform;

        if (textStyle === 'paragraph') {
            fontSize = customStyles?.fontSize || theme?.paragraph_fontSize || theme?.paragraph_size || '16px';
            fontWeight = customStyles?.fontWeight || theme?.paragraph_fontWeight || 'normal';
            lineHeight = customStyles?.lineHeight || theme?.paragraph_lineHeight || theme?.paragraph_line_height || '1.6';
            textTransform = customStyles?.textTransform || theme?.paragraph_textTransform || 'none';
        } else if (textStyle.startsWith('heading')) {
            const level = textStyle.replace('heading', '');
            fontSize = customStyles?.fontSize || theme?.[`heading${level}_fontSize`] || theme?.[`heading${level}_size`] || `${3.5 - (level * 0.25)}rem`;
            fontWeight = customStyles?.fontWeight || theme?.[`heading${level}_fontWeight`] || 'bold';
            lineHeight = customStyles?.lineHeight || theme?.[`heading${level}_lineHeight`] || theme?.[`heading${level}_line_height`] || '1.2';
            textTransform = customStyles?.textTransform || theme?.[`heading${level}_textTransform`] || theme?.[`heading${level}_case`] || 'none';
        } else {
            fontSize = customStyles?.fontSize || '16px';
            fontWeight = customStyles?.fontWeight || 'normal';
            lineHeight = customStyles?.lineHeight || '1.6';
            textTransform = customStyles?.textTransform || 'none';
        }

        // Calcular line-height
        let finalLineHeight = lineHeight;
        if (lineHeight === 'tight') finalLineHeight = '1.2';
        if (lineHeight === 'normal') finalLineHeight = '1.4';
        if (lineHeight === 'loose') finalLineHeight = '1.6';
        if (customStyles?.customLineHeight && lineHeight === 'custom') {
            finalLineHeight = customStyles.customLineHeight;
        }

        // Función para obtener la fuente
        const getFontFamily = () => {
            const fontType = customStyles?.fontType || 'default';

            if (fontType === 'default' || !fontType) {
                return theme?.body_font || theme?.font_family || "'Inter', sans-serif";
            }

            if (fontType === 'custom' && customStyles?.customFont) {
                return customStyles.customFont;
            }

            switch (fontType) {
                case 'body_font':
                    return theme?.body_font || theme?.font_family || "'Inter', sans-serif";
                case 'heading_font':
                    return theme?.heading_font || theme?.heading_font_family || "'Inter', sans-serif";
                case 'subheading_font':
                    return theme?.subheading_font || "'Inter', sans-serif";
                case 'accent_font':
                    return theme?.accent_font || "'Georgia', serif";
                default:
                    return theme?.body_font || theme?.font_family || "'Inter', sans-serif";
            }
        };

        // Layout
        const layout = customStyles?.layout || 'fit';
        const width = layout === 'fill' ? '100%' : 'auto';
        const alignment = customStyles?.alignment || 'left';
        const textAlign = layout === 'fill' ? alignment : 'left';

        // Padding individual con valores del tema
        const paddingTop = customStyles?.paddingTop || theme?.spacing_small || '0px';
        const paddingRight = customStyles?.paddingRight || theme?.spacing_small || '0px';
        const paddingBottom = customStyles?.paddingBottom || theme?.spacing_small || '0px';
        const paddingLeft = customStyles?.paddingLeft || theme?.spacing_small || '0px';

        const borderRadius = customStyles?.borderRadius || theme?.border_radius || '0px';
        const borderColor = customStyles?.borderColor || 'transparent';
        const borderWidth = customStyles?.borderWidth || '0px';
        const borderStyle = customStyles?.borderStyle || 'solid';
        // Color - usar color de texto del tema por defecto
        const color = customStyles?.color || (theme?.text ? `hsl(${theme.text})` : '#000000');

        return {
            width,
            textAlign,
            display: layout === 'fit' ? 'inline-block' : 'block',
            fontFamily: getFontFamily(),
            fontSize,
            fontWeight,
            lineHeight: finalLineHeight,
            textTransform,
            color,
            margin: customStyles?.margin || `${theme?.spacing_medium || '1rem'} 0`,
            paddingTop,
            paddingRight,
            paddingBottom,
            paddingLeft,
            borderColor,
            borderWidth,
            borderStyle,
            backgroundColor: customStyles?.backgroundColor || 'transparent',
            borderRadius: customStyles?.borderRadius || theme?.border_radius || '0px',
        };
    };

    // Componente para selector de cantidad
    const renderQuantitySelector = (child) => {
        if (!product) return null;

        const childStyles = child.styles || {};
        const childContent = child.content || {};

        const maxQuantity = selectedCombination
            ? (product.stocks?.find(s => s.combination_id === selectedCombination.id)?.quantity || 99)
            : (product.stocks?.reduce((sum, stock) => sum + stock.quantity, 0) || 99);

        return (
            <div className="quantity-selector mb-6">
                <label
                    className="block text-sm font-medium mb-2"
                    style={{
                        color: childStyles.labelColor || (themeSettings?.text ? `hsl(${themeSettings.text})` : '#666666'),
                        fontFamily: themeSettings?.body_font || 'inherit',
                    }}
                >
                    {childContent.label || 'Cantidad:'}
                </label>
                <div
                    className="flex items-center border rounded-md w-32"
                    style={{
                        borderColor: childStyles.borderColor || (themeSettings?.borders ? `hsl(${themeSettings.borders})` : '#d1d5db'),
                        borderRadius: childStyles.borderRadius || themeSettings?.border_radius || '6px',
                    }}
                >
                    <button
                        type="button"
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        disabled={quantity <= 1}
                        style={{
                            color: childStyles.buttonColor || (themeSettings?.text ? `hsl(${themeSettings.text})` : '#374151'),
                            padding: childStyles.buttonPadding || themeSettings?.spacing_small || '8px 12px',
                            backgroundColor: childStyles.buttonBgColor || 'transparent',
                            border: 'none',
                            cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                            opacity: quantity <= 1 ? 0.5 : 1,
                            fontFamily: themeSettings?.button_font_family || 'inherit',
                        }}
                    >
                        -
                    </button>
                    <input
                        type="number"
                        min="1"
                        max={maxQuantity}
                        value={quantity}
                        onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            const clamped = Math.min(Math.max(1, val), maxQuantity);
                            setQuantity(clamped);
                        }}
                        className="w-16 text-center border-0 focus:ring-0 focus:outline-none"
                        style={{
                            color: childStyles.inputColor || (themeSettings?.text ? `hsl(${themeSettings.text})` : '#000000'),
                            backgroundColor: childStyles.inputBgColor || 'transparent',
                            fontSize: childStyles.inputFontSize || '14px',
                            fontFamily: themeSettings?.input_font_family || 'inherit',
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => setQuantity(prev => Math.min(maxQuantity, prev + 1))}
                        disabled={quantity >= maxQuantity}
                        style={{
                            color: childStyles.buttonColor || (themeSettings?.text ? `hsl(${themeSettings.text})` : '#374151'),
                            padding: childStyles.buttonPadding || themeSettings?.spacing_small || '8px 12px',
                            backgroundColor: childStyles.buttonBgColor || 'transparent',
                            border: 'none',
                            cursor: quantity >= maxQuantity ? 'not-allowed' : 'pointer',
                            opacity: quantity >= maxQuantity ? 0.5 : 1,
                            fontFamily: themeSettings?.button_font_family || 'inherit',
                        }}
                    >
                        +
                    </button>
                </div>
                {childContent.showMax && (
                    <p className="text-xs mt-1" style={{
                        color: childStyles.maxLabelColor || (themeSettings?.text ? `hsl(${themeSettings.text})` : '#6b7280'),
                        fontFamily: themeSettings?.body_font || 'inherit',
                    }}>
                        Máximo: {maxQuantity}
                    </p>
                )}
            </div>
        );
    };

    // Función para agregar al carrito
const handleAddToCart = () => {
    if (!product || !companyId) return;
        
        // Usar el helper con el companyId
        cartHelper.addToCart(
            companyId, 
            product, 
            selectedCombination || null, 
            quantity
        );
    
    // Usar la combinación seleccionada si existe
    const combination = selectedCombination || null;
    
    // Crear el item del carrito
    const cartItem = {
        productId: product.id,
        productName: product.product_name,
        combinationId: combination?.id,
        combinationName: combination 
            ? combination.attribute_values.map(attr => attr.value_name).join(' / ')
            : null,
        price: currentPrice,
        quantity: quantity,
        image: currentImage || product.media?.[0]?.original_url || '',
        stock: combination 
            ? (product.stocks?.find(s => s.combination_id === combination.id)?.quantity || 0)
            : (product.stocks?.reduce((sum, stock) => sum + stock.quantity, 0) || 0)
    };
    
    // Obtener carrito actual
    const currentCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    
    // Verificar si ya existe
    const existingIndex = currentCart.findIndex(item => 
        item.productId === cartItem.productId && 
        item.combinationId === cartItem.combinationId
    );
    
    if (existingIndex >= 0) {
        // Actualizar cantidad
        currentCart[existingIndex].quantity += cartItem.quantity;
    } else {
        // Agregar nuevo
        currentCart.push(cartItem);
    }
    
    // Guardar en localStorage
    localStorage.setItem('shoppingCart', JSON.stringify(currentCart));
    
    // Mostrar notificación
    // Alert(`${product.product_name} agregado al carrito`);
    
    // Opcional: Redirigir al carrito después de añadir
    if (window.confirm('¿Deseas ir al carrito?')) {
        window.location.href = '/carrito-de-compras';
    }
};

    // Componente para mostrar galería de imágenes
    const renderImageGallery = (child) => {
        const childStyles = child.styles || {};
        const showGallery = childStyles.showGallery !== false && imageGallery.length > 1;

        // Obtener estilos de borde y borderRadius con valores del tema
        const borderStyles = getBorderStyles(childStyles);

        return (
            <div key={child.id} className="product-image-gallery">
                {/* Imagen principal */}
                <div className="main-image mb-4">
                    <div
                        style={{
                            width: '100%',
                            maxWidth: childStyles.maxWidth || '500px',
                            margin: '0 auto',
                            borderRadius: borderStyles.borderRadius || themeSettings?.border_radius || '0px',
                            overflow: 'hidden',
                            ...borderStyles,
                        }}
                    >
                        <img
                            src={currentImage || product.media?.[0]?.original_url || 'https://yadakcenter.ir/wp-content/uploads/2016/07/shop-placeholder.png'}
                            alt={product.product_name}
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'block',
                                aspectRatio: childStyles.aspectRatio === 'landscape' ? '16/9' :
                                    childStyles.aspectRatio === 'portrait' ? '4/5' : '1/1',
                                objectFit: childStyles.objectFit || 'cover',
                                boxShadow: childStyles.boxShadow || (themeSettings?.shadows ? `0 4px 6px -1px rgba(0, 0, 0, ${themeSettings.shadows})` : 'none'),
                            }}
                            onError={(e) => {
                                e.target.src = 'https://yadakcenter.ir/wp-content/uploads/2016/07/shop-placeholder.png';
                            }}
                        />
                    </div>
                </div>

                {/* Galería de miniaturas (si hay más de una imagen) */}
                {showGallery && (
                    <div className="thumbnail-grid" style={{
                        display: 'flex',
                        gap: themeSettings?.spacing_small || '10px',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        {imageGallery.map((img, index) => {
                            const imgUrl = img.original_url || img.url;
                            const isSelected = currentImage === imgUrl;

                            return (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImage(imgUrl)}
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        border: isSelected
                                            ? `2px solid ${childStyles.thumbnailBorderColor || (themeSettings?.primary ? `hsl(${themeSettings.primary})` : '#007bff')}`
                                            : `1px solid ${themeSettings?.borders ? `hsl(${themeSettings.borders})` : '#ddd'}`,
                                        borderRadius: childStyles.thumbnailBorderRadius || themeSettings?.border_radius || '4px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        padding: 0,
                                        background: 'transparent',
                                        transition: 'border-color 0.2s',
                                    }}
                                    title={`Vista ${index + 1}`}
                                >
                                    <img
                                        src={imgUrl}
                                        alt={`Vista ${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                        onError={(e) => {
                                            e.target.src = 'https://yadakcenter.ir/wp-content/uploads/2016/07/shop-placeholder.png';
                                        }}
                                    />
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    // Renderizar los hijos individualmente
    const renderChild = (child) => {
        if (!product) {
            return (
                <div key={child.id} className="text-center py-8 text-gray-500">
                    No se encontró el producto
                </div>
            );
        }

        const childStyles = child.styles || {};

        switch (child.type) {
            case 'productDetailImage':
                return renderImageGallery(child);

            case 'productDetailName':
                const productDetailNameStyles = getProductDetailNameStyles(childStyles);
                return (
                    <h1
                        key={child.id}
                        className="product-detail-name mb-4"
                        style={productDetailNameStyles}
                    >
                        {product.product_name}
                    </h1>
                );
            case 'productDetailPrice':
                const priceStyles = getProductDetailPriceStyles(childStyles);
                const hasDiscount = product.product_price_discount && parseFloat(product.product_price_discount) > 0;
                const showDiscount = childStyles.showDiscount !== false;
                const showCurrency = childStyles.showCurrency !== false;
                const price = currentPrice || product.product_price;

                return (
                    <div
                        key={child.id}
                        className="product-detail-price mb-6"
                        style={priceStyles}
                    >
                        {hasDiscount && showDiscount ? (
                            <>
                                <span className="line-through mr-2" style={{
                                    color: childStyles.originalPriceColor || (themeSettings?.text ? `hsl(${themeSettings.text})` : '#999999'),
                                    fontSize: childStyles.originalPriceSize || '0.8em',
                                    opacity: 0.7,
                                }}>
                                    {showCurrency ? (childStyles.currencySymbol || '$') : ''}{parseFloat(product.product_price).toFixed(2)}
                                </span>
                                <span style={{
                                    color: childStyles.discountPriceColor || (themeSettings?.primary ? `hsl(${themeSettings.primary})` : '#dc2626'),
                                    fontSize: childStyles.discountPriceSize || '1.2em',
                                    fontWeight: 'bold',
                                }}>
                                    {showCurrency ? (childStyles.currencySymbol || '$') : ''}{parseFloat(product.product_price_discount).toFixed(2)}
                                </span>
                            </>
                        ) : (
                            <span style={{ fontWeight: 'bold' }}>
                                {showCurrency ? (childStyles.currencySymbol || '$') : ''}{parseFloat(price).toFixed(2)}
                            </span>
                        )}
                    </div>
                );
            case 'productDetailDescription':
                const descriptionStyles = getProductDetailDescriptionStyles(childStyles);
                return (
                    <div
                        key={child.id}
                        className="product-detail-description mb-8"
                        style={descriptionStyles}
                        dangerouslySetInnerHTML={{
                            __html: product.product_description || 'Sin descripción disponible'
                        }}
                    />
                );
            case 'button':
                const buttonType = childStyles.buttonType || 'primary';
                
                // Determinar colores basados en el tipo de botón y tema
                let buttonBgColor, buttonTextColor, buttonBorderColor, hoverBgColor;
                
                if (buttonType === 'primary') {
                    buttonBgColor = childStyles.backgroundColor || (themeSettings?.primary_button_background ? `hsl(${themeSettings.primary_button_background})` : '#007bff');
                    buttonTextColor = childStyles.color || (themeSettings?.primary_button_text ? `hsl(${themeSettings.primary_button_text})` : '#ffffff');
                    buttonBorderColor = childStyles.borderColor || (themeSettings?.primary_button_border ? `hsl(${themeSettings.primary_button_border})` : 'transparent');
                    hoverBgColor = childStyles.hoverBackgroundColor || (themeSettings?.primary_button_hover_background ? `hsl(${themeSettings.primary_button_hover_background})` : '#0056b3');
                } else {
                    buttonBgColor = childStyles.backgroundColor || (themeSettings?.secondary_button_background ? `hsl(${themeSettings.secondary_button_background})` : '#6c757d');
                    buttonTextColor = childStyles.color || (themeSettings?.secondary_button_text ? `hsl(${themeSettings.secondary_button_text})` : '#ffffff');
                    buttonBorderColor = childStyles.borderColor || (themeSettings?.secondary_button_border ? `hsl(${themeSettings.secondary_button_border})` : 'transparent');
                    hoverBgColor = childStyles.hoverBackgroundColor || (themeSettings?.secondary_button_hover_background ? `hsl(${themeSettings.secondary_button_hover_background})` : '#545b62');
                }
                
                return (
                    <button
                        key={child.id}
                        className="product-detail-button"
                        style={{
                            backgroundColor: buttonBgColor,
                            color: buttonTextColor,
                            padding: `${childStyles.paddingTop || themeSettings?.spacing_small || '10px'} ${childStyles.paddingRight || themeSettings?.spacing_medium || '20px'} ${childStyles.paddingBottom || themeSettings?.spacing_small || '10px'} ${childStyles.paddingLeft || themeSettings?.spacing_medium || '20px'}`,
                            borderRadius: childStyles.borderRadius || themeSettings?.button_border_radius || '4px',
                            border: childStyles.border || 'none',
                            borderWidth: childStyles.borderWidth || '0px',
                            borderStyle: childStyles.borderStyle || 'solid',
                            borderColor: buttonBorderColor,
                            cursor: 'pointer',
                            fontSize: childStyles.fontSize || '16px',
                            fontWeight: childStyles.fontWeight || '600',
                            fontFamily: themeSettings?.button_font_family || childStyles.fontFamily || 'inherit',
                            textTransform: childStyles.textTransform || 'none',
                            transition: 'all 0.2s',
                            boxShadow: childStyles.boxShadow || 'none',
                        }}
                        onClick={handleAddToCart}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = hoverBgColor;
                            if (childStyles.hoverTransform) {
                                e.currentTarget.style.transform = childStyles.hoverTransform;
                            }
                            if (childStyles.hoverBoxShadow) {
                                e.currentTarget.style.boxShadow = childStyles.hoverBoxShadow;
                            }
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = buttonBgColor;
                            if (childStyles.hoverTransform) {
                                e.currentTarget.style.transform = 'none';
                            }
                            if (childStyles.hoverBoxShadow) {
                                e.currentTarget.style.boxShadow = childStyles.boxShadow || 'none';
                            }
                        }}
                    >
                        {child.content || 'Agregar al carrito'}
                    </button>
                );
            case 'productDetailAttributes':
                return (
                    <div key={child.id}>
                        {renderAttributes(child)}
                    </div>
                );
            case 'productDetailStock':
                return (
                    <div key={child.id}>
                        {renderStock(child)}
                    </div>
                );
            case 'quantitySelector':
                return (
                    <div key={child.id}>
                        {renderQuantitySelector(child)}
                    </div>
                );
            default:
                return null;
        }
    };

    // Renderizado para layout grid
    const renderGridLayout = () => {
        if (imageComponents.length === 0) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: themeSettings?.spacing_medium || '20px' }}>
                    {children.map(child => renderChild(child))}
                </div>
            );
        }

        return (
            <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: themeSettings?.spacing_medium || '20px' }}>
                    {imageComponents.map(child => renderChild(child))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: themeSettings?.spacing_medium || '20px' }}>
                    {otherComponents.concat(descriptionComponents).map(child => renderChild(child))}
                </div>
            </>
        );
    };

    // Renderizado para layout stack - descripción al final
    const renderStackLayout = () => {
        // Primero otros componentes, luego descripción
        const orderedComponents = [...imageComponents, ...otherComponents, ...descriptionComponents];

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: themeSettings?.spacing_medium || '20px' }}>
                {orderedComponents.map(child => renderChild(child))}
            </div>
        );
    };

    // Renderizar contenido basado en el layout seleccionado
    const renderContent = () => {
        switch (layoutType) {
            case 'grid':
                return renderGridLayout();
            case 'stack':
            default:
                return renderStackLayout();
        }
    };

    return (
        <div style={containerStyles} className="product-detail-container">
            {children.length > 0 ? renderContent() : (
                <div className="text-center py-8 text-gray-500">
                    No hay componentes en el detalle del producto
                </div>
            )}
        </div>
    );
};

export default FrontendProductDetailComponent;