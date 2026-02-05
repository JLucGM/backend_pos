import React from 'react';
import { getThemeWithDefaults, getResolvedFont } from '@/utils/themeUtils';

// Helper para añadir unidad (px) si es solo número
const withUnit = (value, unit = 'px') => {
    if (value === undefined || value === null || value === '') return undefined;
    // Si ya es string y tiene algun caracter no numerico (como px, %, rem), devolver tal cual
    if (typeof value === 'string' && isNaN(Number(value))) return value;
    return `${value}${unit}`;
};

const ProductDetailStockComponent = ({
    comp,
    product,
    currentCombination,
    themeSettings,
    appliedTheme
}) => {
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // Función para obtener estilos de fuente (definida una sola vez)
    const getFontStyles = () => {
        const styles = comp.styles || {};
        const fontType = styles.fontType || 'default';

        const fontFamily = getResolvedFont(themeWithDefaults, fontType === 'default' ? 'body_font' : fontType);

        return {
            fontFamily,
            fontSize: withUnit(styles.fontSize || '14px', styles.fontSizeUnit || 'px'),
            fontWeight: styles.fontWeight || '500',
        };
    };

    // Si no hay producto (modo builder), mostrar datos de ejemplo
    if (!product) {

        const fontStyles = getFontStyles();

        return (
            <div className="product-stock" style={{
                ...comp.styles,
                paddingTop: withUnit(comp.styles?.paddingTop || '12px'),
                paddingRight: withUnit(comp.styles?.paddingRight || '16px'),
                paddingBottom: withUnit(comp.styles?.paddingBottom || '12px'),
                paddingLeft: withUnit(comp.styles?.paddingLeft || '16px'),
                borderRadius: withUnit(comp.styles?.borderRadius || '8px'),
                borderWidth: withUnit(comp.styles?.borderWidth || '1px'),
                borderStyle: 'solid',
                backgroundColor: comp.styles?.inStockBgColor || '#dcfce7',
                color: comp.styles?.inStockColor || '#166534',
                borderColor: comp.styles?.inStockBorderColor || '#bbf7d0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                ...fontStyles,
            }}>
                <span className="stock-icon" style={{
                    fontSize: comp.styles?.iconSize || '16px',
                    fontWeight: 'bold',
                }}>
                    {comp.content?.inStockIcon || '✓'}
                </span>

                <span className="stock-message" style={fontStyles}>
                    {comp.content?.inStockText || 'En stock'}
                </span>

                {comp.content?.showSku && (
                    <span className="stock-sku ml-auto text-xs opacity-70">
                        SKU: ABC123
                    </span>
                )}
            </div>
        );
    }

    // Obtener stock para producto simple o combinación
    const getStockInfo = () => {
        if (!product?.stocks) return { quantity: 0, status: 'unavailable' };

        if (currentCombination) {
            const stock = product.stocks.find(s => s.combination_id === currentCombination.id);
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

    // Estilos condicionales
    const getStatusStyles = () => {
        const status = stockInfo.status;
        const styles = comp.styles || {};

        switch (status) {
            case 'in_stock':
                return {
                    backgroundColor: styles.inStockBgColor || '#dcfce7',
                    color: styles.inStockColor || '#166534',
                    borderColor: styles.inStockBorderColor || '#bbf7d0',
                };
            case 'low_stock':
                return {
                    backgroundColor: styles.lowStockBgColor || '#fef9c3',
                    color: styles.lowStockColor || '#854d0e',
                    borderColor: styles.lowStockBorderColor || '#fef08a',
                };
            case 'out_of_stock':
            default:
                return {
                    backgroundColor: styles.outOfStockBgColor || '#fee2e2',
                    color: styles.outOfStockColor || '#991b1b',
                    borderColor: styles.outOfStockBorderColor || '#fecaca',
                };
        }
    };

    // Determinar mensaje según cantidad
    const getStockMessage = () => {
        const quantity = stockInfo.quantity;

        if (quantity <= 0) {
            return comp.content?.outOfStockText || 'Agotado';
        } else if (quantity <= 5) {
            return comp.content?.lowStockText || `Solo ${quantity} disponibles`;
        } else {
            return comp.content?.inStockText || `En stock (${quantity} disponibles)`;
        }
    };

    // Determinar icono
    const getStockIcon = () => {
        const status = stockInfo.status;

        if (status === 'in_stock') {
            return comp.content?.inStockIcon || '✓';
        } else if (status === 'low_stock') {
            return comp.content?.lowStockIcon || '⚠';
        } else {
            return comp.content?.outOfStockIcon || '✗';
        }
    };

    const statusStyles = getStatusStyles();
    const fontStyles = getFontStyles();

    return (
        <div className="product-stock" style={{
            ...comp.styles,
            paddingTop: withUnit(comp.styles?.paddingTop || '12px'),
            paddingRight: withUnit(comp.styles?.paddingRight || '16px'),
            paddingBottom: withUnit(comp.styles?.paddingBottom || '12px'),
            paddingLeft: withUnit(comp.styles?.paddingLeft || '16px'),
            borderRadius: withUnit(comp.styles?.borderRadius || '8px'),
            borderWidth: withUnit(comp.styles?.borderWidth || '1px'),
            borderStyle: 'solid',
            ...statusStyles,
            ...fontStyles,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        }}>
            <span className="stock-icon" style={{
                fontSize: withUnit(comp.styles?.iconSize || '16px'),
                fontWeight: 'bold',
            }}>
                {getStockIcon()}
            </span>

            <span className="stock-message" style={fontStyles}>
                {getStockMessage()}
            </span>

            {comp.content?.showSku && product?.stocks?.[0]?.sku && (
                <span className="stock-sku ml-auto text-xs opacity-70">
                    SKU: {product.stocks[0].sku}
                </span>
            )}
        </div>
    );
};

export default ProductDetailStockComponent;
