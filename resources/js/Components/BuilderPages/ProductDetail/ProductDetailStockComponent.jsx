import React from 'react';
import { getThemeWithDefaults, getResolvedFont, resolveStyleValue } from '@/utils/themeUtils';

// Helper para añadir unidad (px) si es solo número
const withUnit = (value, unit = 'px') => {
    if (value === undefined || value === null || value === '') return undefined;
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

    // Función para obtener estilos de fuente (definida una sola vez)
    const getFontStyles = () => {
        const fontType = styles.fontType || 'default';

        const fontFamily = getResolvedFont(themeWithDefaults, fontType === 'default' ? 'body_font' : fontType, appliedTheme);

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
                ...styles,
                paddingTop: withUnit(styles.paddingTop || '12px'),
                paddingRight: withUnit(styles.paddingRight || '16px'),
                paddingBottom: withUnit(styles.paddingBottom || '12px'),
                paddingLeft: withUnit(styles.paddingLeft || '16px'),
                borderRadius: withUnit(styles.borderRadius || '8px'),
                borderWidth: withUnit(styles.borderWidth || '1px'),
                borderStyle: 'solid',
                backgroundColor: styles.inStockBgColor || '#dcfce7',
                color: styles.text || '#166534',
                borderColor: styles.inStockBorderColor || '#bbf7d0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                ...fontStyles,
            }}>
                <span className="stock-icon" style={{
                    fontSize: withUnit(styles.iconSize || '16px'),
                    fontWeight: 'bold',
                }}>
                    {content.inStockIcon || '✓'}
                </span>

                <span className="stock-message" style={fontStyles}>
                    {content.inStockText || 'En stock'}
                </span>

                {content.showSku && (
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
            return content.outOfStockText || 'Agotado';
        } else if (quantity <= 5) {
            return content.lowStockText || `Solo ${quantity} disponibles`;
        } else {
            return content.inStockText || `En stock (${quantity} disponibles)`;
        }
    };

    // Determinar icono
    const getStockIcon = () => {
        const status = stockInfo.status;

        if (status === 'in_stock') {
            return content.inStockIcon || '✓';
        } else if (status === 'low_stock') {
            return content.lowStockIcon || '⚠';
        } else {
            return content.outOfStockIcon || '✗';
        }
    };

    const statusStyles = getStatusStyles();
    const fontStyles = getFontStyles();

    return (
        <div className="product-stock" style={{
            ...styles,
            paddingTop: withUnit(styles.paddingTop || '12px'),
            paddingRight: withUnit(styles.paddingRight || '16px'),
            paddingBottom: withUnit(styles.paddingBottom || '12px'),
            paddingLeft: withUnit(styles.paddingLeft || '16px'),
            borderRadius: withUnit(styles.borderRadius || '8px'),
            borderWidth: withUnit(styles.borderWidth || '1px'),
            borderStyle: 'solid',
            ...statusStyles,
            ...fontStyles,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        }}>
            <span className="stock-icon" style={{
                fontSize: withUnit(styles.iconSize || '16px'),
                fontWeight: 'bold',
            }}>
                {getStockIcon()}
            </span>

            <span className="stock-message" style={fontStyles}>
                {getStockMessage()}
            </span>

            {content.showSku && product?.stocks?.[0]?.sku && (
                <span className="stock-sku ml-auto text-xs opacity-70">
                    SKU: {product.stocks[0].sku}
                </span>
            )}
        </div>
    );
};

export default ProductDetailStockComponent;