import React from 'react';
import CurrencyDisplay from '@/Components/CurrencyDisplay';
import { usePage } from '@inertiajs/react';

const ProductDetailPriceComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    themeSettings,
    product,
    currentPrice,
    selectedCombination
}) => {
    const { settings } = usePage().props;
    
    // Función para obtener los estilos del precio
    const getTextStyles = () => {
        const baseStyles = getStyles(comp);
        const customStyles = comp.styles || {};

        // Determinar el estilo de texto seleccionado
        const textStyle = customStyles.textStyle || 'heading3';

        // Función para obtener la fuente según el tipo seleccionado
        const getFontFamily = () => {
            const fontType = customStyles.fontType || 'default';
            
            if (fontType === 'default' || !fontType) {
                return themeSettings?.body_font || "'Inter', sans-serif";
            }
            
            if (fontType === 'custom' && customStyles.customFont) {
                return customStyles.customFont;
            }
            
            switch(fontType) {
                case 'body_font':
                    return themeSettings?.body_font || "'Inter', sans-serif";
                case 'heading_font':
                    return themeSettings?.heading_font || "'Inter', sans-serif";
                case 'subheading_font':
                    return themeSettings?.subheading_font || "'Inter', sans-serif";
                case 'accent_font':
                    return themeSettings?.accent_font || "'Inter', sans-serif";
                default:
                    return themeSettings?.body_font || "'Inter', sans-serif";
            }
        };

        // Obtener configuración según el estilo seleccionado
        let fontSize, fontWeight, lineHeight, textTransform;
        
        switch(textStyle) {
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
                fontSize = customStyles.fontSize || '24px';
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
            color: customStyles.color || (themeSettings?.text ? `hsl(${themeSettings.text})` : '#000000'),
            margin: customStyles.margin || '0 0 1rem 0',
            paddingTop,
            paddingRight,
            paddingBottom,
            paddingLeft,
            backgroundColor: customStyles.backgroundColor || 'transparent',
            borderRadius: customStyles.borderRadius || '0px',
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
                            color: customStyles.originalPriceColor || (themeSettings?.text ? `hsl(${themeSettings.text})` : '#999999'),
                            fontSize: customStyles.originalPriceSize || '0.8em',
                            opacity: 0.7,
                        }}
                    >
                        <CurrencyDisplay currency={settings.currency} amount={parseFloat(product.product_price)} />
                    </span>
                    <span 
                        style={{
                            color: customStyles.discountPriceColor || (themeSettings?.primary ? `hsl(${themeSettings.primary})` : '#dc2626'),
                            fontSize: customStyles.discountPriceSize || '1.2em',
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
            style={getTextStyles()}
            onClick={handleClick}
            className={!isPreview ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        >
            {renderPrice()}
            
            {selectedCombination && product?.combinations?.length > 0 && (
                <div className="text-sm mt-1" style={{
                    color: themeSettings?.text ? `hsl(${themeSettings.text}, 0.7)` : '#6b7280',
                    fontSize: '0.8em',
                }}>
                    Precio para esta combinación
                </div>
            )}
        </div>
    );
};

export default ProductDetailPriceComponent;