import React from 'react';
import CurrencyDisplay from '@/Components/CurrencyDisplay';
import { usePage } from '@inertiajs/react';
import { getThemeWithDefaults, getTextStyles, getResolvedFont, getComponentStyles } from '@/utils/themeUtils';

// Helper para añadir unidad (px) si es solo número
const withUnit = (value, unit = 'px') => {
    if (value === undefined || value === null || value === '') return undefined;
    // Si ya es string y tiene algun caracter no numerico (como px, %, rem), devolver tal cual
    if (typeof value === 'string' && isNaN(Number(value))) return value;
    return `${value}${unit}`;
};

const ProductDetailPriceComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    themeSettings,
    product,
    currentPrice,
    selectedCombination,
    appliedTheme
}) => {
    const { settings } = usePage().props;

    // Obtener themeWithDefaults una sola vez para usar en todo el componente
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // Función para obtener los estilos del precio
    const getPriceStyles = () => {  // ✅ Nombre diferente
        const baseStyles = getStyles(comp);
        const customStyles = comp.styles || {};

        // Determinar el estilo de texto seleccionado
        const textStyle = customStyles.textStyle || 'heading3';

        // Obtener estilos del tema para el tipo de texto
        const themeTextStyles = getTextStyles(themeWithDefaults, textStyle); // ✅ Ahora usa la importada

        // Obtener estilos específicos del componente product-price
        const themeComponentStyles = getComponentStyles(themeWithDefaults, 'product-price', appliedTheme);

        // Función para obtener la fuente según el tipo seleccionado
        const getFontFamily = () => {
            const fontType = customStyles.fontType || 'default';

            if (fontType === 'default' || !fontType) {
                return getResolvedFont(themeWithDefaults, 'body_font');
            }

            if (fontType === 'custom' && customStyles.customFont) {
                return customStyles.customFont;
            }

            return getResolvedFont(themeWithDefaults, fontType) || themeTextStyles.fontFamily;
        };

        // Obtener configuración según el estilo seleccionado
        let fontSize, fontWeight, lineHeight, textTransform;

        switch (textStyle) {
            case 'paragraph':
                fontSize = customStyles.fontSize || themeSettings?.paragraph_fontSize || '16px';
                fontWeight = customStyles.fontWeight || themeSettings?.paragraph_fontWeight || 'normal';
                lineHeight = customStyles.lineHeight || themeSettings?.paragraph_lineHeight || '1.6';
                textTransform = customStyles.textTransform || themeSettings?.paragraph_textTransform || 'none';
                break;

            case 'heading1':
                fontSize = customStyles.fontSize || themeSettings?.heading1_fontSize || '2.5rem';
                fontWeight = customStyles.fontWeight || themeSettings?.heading1_fontWeight || 'bold';
                lineHeight = customStyles.lineHeight || themeSettings?.heading1_lineHeight || '1.2';
                textTransform = customStyles.textTransform || themeSettings?.heading1_textTransform || 'none';
                break;

            case 'heading2':
                fontSize = customStyles.fontSize || themeSettings?.heading2_fontSize || '2rem';
                fontWeight = customStyles.fontWeight || themeSettings?.heading2_fontWeight || 'bold';
                lineHeight = customStyles.lineHeight || themeSettings?.heading2_lineHeight || '1.3';
                textTransform = customStyles.textTransform || themeSettings?.heading2_textTransform || 'none';
                break;

            case 'heading3':
                fontSize = customStyles.fontSize || themeSettings?.heading3_fontSize || '1.75rem';
                fontWeight = customStyles.fontWeight || themeSettings?.heading3_fontWeight || 'bold';
                lineHeight = customStyles.lineHeight || themeSettings?.heading3_lineHeight || '1.3';
                textTransform = customStyles.textTransform || themeSettings?.heading3_textTransform || 'none';
                break;

            case 'heading4':
                fontSize = customStyles.fontSize || themeSettings?.heading4_fontSize || '1.5rem';
                fontWeight = customStyles.fontWeight || themeSettings?.heading4_fontWeight || 'bold';
                lineHeight = customStyles.lineHeight || themeSettings?.heading4_lineHeight || '1.4';
                textTransform = customStyles.textTransform || themeSettings?.heading4_textTransform || 'none';
                break;

            case 'heading5':
                fontSize = customStyles.fontSize || themeSettings?.heading5_fontSize || '1.25rem';
                fontWeight = customStyles.fontWeight || themeSettings?.heading5_fontWeight || 'bold';
                lineHeight = customStyles.lineHeight || themeSettings?.heading5_lineHeight || '1.4';
                textTransform = customStyles.textTransform || themeSettings?.heading5_textTransform || 'none';
                break;

            case 'heading6':
                fontSize = customStyles.fontSize || themeSettings?.heading6_fontSize || '1rem';
                fontWeight = customStyles.fontWeight || themeSettings?.heading6_fontWeight || 'bold';
                lineHeight = customStyles.lineHeight || themeSettings?.heading6_lineHeight || '1.5';
                textTransform = customStyles.textTransform || themeSettings?.heading6_textTransform || 'none';
                break;

            case 'custom':
            default:
                fontSize = withUnit(customStyles.fontSize || themeWithDefaults.productDetail_priceSize || '24px', customStyles.fontSizeUnit || 'px');
                fontWeight = customStyles.fontWeight || 'bold';
                lineHeight = customStyles.lineHeight || '1.4';
                textTransform = customStyles.textTransform || 'none';
                break;
        }

        // Calcular line-height si es personalizado
        let finalLineHeight = lineHeight;
        if (lineHeight === 'tight') finalLineHeight = '1.2';
        if (lineHeight === 'normal') finalLineHeight = '1.4';
        if (lineHeight === 'loose') finalLineHeight = '1.6';
        if (customStyles.customLineHeight && lineHeight === 'custom') {
            finalLineHeight = customStyles.customLineHeight;
        }

        // Layout
        const layout = customStyles.layout || 'fit';
        const width = layout === 'fill' ? '100%' : 'auto';
        const alignment = customStyles.alignment || 'left';
        const textAlign = layout === 'fill' ? alignment : 'left';

        // Padding individual
        const paddingTop = customStyles.paddingTop || '0px';
        const paddingRight = customStyles.paddingRight || '0px';
        const paddingBottom = customStyles.paddingBottom || '0px';
        const paddingLeft = customStyles.paddingLeft || '0px';

        return {
            ...baseStyles,
            width,
            textAlign,
            display: layout === 'fit' ? 'inline-block' : 'block',
            fontFamily: getFontFamily(),
            fontSize,
            fontWeight,
            lineHeight: finalLineHeight,
            textTransform,
            color: customStyles.color || themeComponentStyles.color || themeWithDefaults.text,
            margin: customStyles.margin || '0 0 1rem 0',
            paddingTop: withUnit(paddingTop),
            paddingRight: withUnit(paddingRight),
            paddingBottom: withUnit(paddingBottom),
            paddingLeft: withUnit(paddingLeft),
            backgroundColor: customStyles.backgroundColor || 'transparent',
            borderRadius: withUnit(customStyles.borderRadius || '0px'),
        };
    };

    const handleClick = () => {
        if (!isPreview && onEdit) {
            onEdit(comp);
        }
    };

    // Función para mostrar precio con descuento si aplica
    const renderPrice = () => {
        if (!product) {
            return (
                <span className="text-gray-400 italic">
                    Precio del producto (se obtiene dinámicamente)
                </span>
            );
        }

        const customStyles = comp.styles || {};
        const price = currentPrice || product.product_price;
        const hasDiscount = product.product_price_discount && parseFloat(product.product_price_discount) > 0;
        const showDiscount = customStyles.showDiscount !== false;

        if (hasDiscount && showDiscount && settings?.currency) {
            return (
                <>
                    <span
                        className="line-through mr-2"
                        style={{
                            color: customStyles.originalPriceColor || themeWithDefaults.text,
                            fontSize: withUnit(customStyles.originalPriceSize || '0.8em'),
                            opacity: 0.7,
                        }}
                    >
                        <CurrencyDisplay currency={settings.currency} amount={parseFloat(product.product_price)} />
                    </span>
                    <span
                        style={{
                            color: customStyles.discountPriceColor || themeWithDefaults.links,
                            fontSize: withUnit(customStyles.discountPriceSize || '1.2em'),
                            fontWeight: 'bold',
                        }}
                    >
                        <CurrencyDisplay currency={settings.currency} amount={parseFloat(product.product_price_discount)} />
                    </span>
                </>
            );
        }

        if (settings?.currency) {
            return (
                <span style={{ fontWeight: 'bold' }}>
                    <CurrencyDisplay currency={settings.currency} amount={parseFloat(price)} />
                </span>
            );
        }

        // Fallback si no hay configuración de moneda
        return (
            <span style={{ fontWeight: 'bold' }}>
                ${parseFloat(price).toFixed(2)}
            </span>
        );
    };

    return (
        <div
            style={getPriceStyles()}  // ✅ Usar nuevo nombre
            onClick={handleClick}
            className={!isPreview ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        >
            {renderPrice()}

            {selectedCombination && product?.combinations?.length > 0 && (
                <div className="text-sm mt-1" style={{
                    color: themeWithDefaults.text,
                    opacity: '0.7',
                    fontSize: '0.8em',
                }}>
                    Precio para esta combinación
                </div>
            )}
        </div>
    );
};

export default ProductDetailPriceComponent;
