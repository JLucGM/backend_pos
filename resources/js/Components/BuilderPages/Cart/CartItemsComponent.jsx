// CartItemsComponent.jsx - VERSIÓN COMPLETA CON SOPORTE PARA COMBINATIONNAME
import React from 'react';
import { Trash2 } from 'lucide-react';
import FormattedPrice from '@/Components/FormattedPrice';
import { usePage } from '@inertiajs/react';
import { getThemeWithDefaults, getComponentStyles, getResolvedFont, resolveStyleValue } from '@/utils/themeUtils';

const CartItemsComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    cartItems,
    onUpdateQuantity,
    onRemoveItem,
    onClearCart,
    mode,
    themeSettings,
    appliedTheme
}) => {
    const { settings } = usePage().props;
    const rawStyles = comp.styles || {};
    const rawContent = comp.content || {};
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    const styles = {};
    Object.keys(rawStyles).forEach(key => {
        styles[key] = resolveValue(rawStyles[key]);
    });

    const content = {};
    Object.keys(rawContent).forEach(key => {
        content[key] = resolveValue(rawContent[key]);
    });

    const withUnit = (value, unit = 'px') => {
        if (value === undefined || value === null || value === '') return undefined;
        if (typeof value === 'string' && isNaN(Number(value))) return value;
        return `${value}${unit}`;
    };

    const themeCartStyles = getComponentStyles(themeWithDefaults, 'cart');
    const themeCartTitleStyles = getComponentStyles(themeWithDefaults, 'cart-title');

    const containerStyles = {
        ...getStyles(comp),
        backgroundColor: resolveValue(styles.backgroundColor || themeCartStyles.backgroundColor || themeWithDefaults.background),
        paddingTop: withUnit(styles.paddingTop || '20px'),
        paddingRight: withUnit(styles.paddingRight || '20px'),
        paddingBottom: withUnit(styles.paddingBottom || '20px'),
        paddingLeft: withUnit(styles.paddingLeft || '20px'),
        borderRadius: withUnit(styles.borderRadius || themeCartStyles.borderRadius || '0'),
        borderWidth: withUnit(styles.borderWidth || '0'),
        borderStyle: styles.borderStyle || 'solid',
        borderColor: resolveValue(styles.borderColor || themeWithDefaults.borders),
    };

    const handleClick = () => {
        if (!isPreview && onEdit) {
            onEdit(comp);
        }
    };

    const getFontStyles = (type = 'title') => {
        if (type === 'title') {
            return {
                fontFamily: getResolvedFont(themeWithDefaults, 'heading_font', appliedTheme),
                fontSize: withUnit(styles.titleSize || themeCartTitleStyles.fontSize || themeWithDefaults.heading2_fontSize || '24px'),
                fontWeight: styles.titleWeight || themeWithDefaults.heading2_fontWeight || 'bold',
                color: resolveValue(styles.titleColor || themeCartTitleStyles.color || themeWithDefaults.heading),
            };
        }

        return {
            fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
            fontSize: withUnit(styles.fontSize || themeWithDefaults.paragraph_fontSize || '14px'),
            color: resolveValue(styles.color || themeWithDefaults.text),
        };
    };

    const titleStyles = getFontStyles('title');
    const textStyles = getFontStyles();

    const hasDiscount = (item) => {
        return item.originalPrice && item.originalPrice !== item.price;
    };

    const renderDiscountInfo = (item) => {
        if (!item.automaticDiscount) return null;

        const discount = item.automaticDiscount;
        let discountText = '';

        if (item.discountType === 'direct_discount') {
            discountText = 'Descuento directo aplicado';
        } else if (discount.name) {
            discountText = discount.name;
        } else {
            discountText = 'Descuento automático';
        }

        let discountValue = '';
        if (discount.discount_type === 'percentage') {
            discountValue = ` (${discount.value}%)`;
        } else if (discount.discount_type === 'fixed_amount') {
            discountValue = settings?.currency ?
                ` (${settings.currency.symbol}${parseFloat(discount.value).toFixed(2)})` :
                ` ($${parseFloat(discount.value).toFixed(2)})`;
        }

        const percentageOff = item.originalPrice > 0 ?
            Math.round((1 - item.price / item.originalPrice) * 100) : 0;

        return (
            <div className="mt-2">
                <div className="text-xs" style={{
                    color: '#059669',
                    fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                    backgroundColor: 'rgba(5, 150, 105, 0.1)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    display: 'inline-block',
                    fontWeight: '500'
                }}>
                    {discountText}{discountValue}
                </div>
                {percentageOff > 0 && (
                    <div className="text-xs mt-1" style={{
                        color: '#dc2626',
                        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme)
                    }}>
                        {percentageOff}% de descuento
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            style={containerStyles}
            onClick={handleClick}
            className={!isPreview ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        >
            {/* Encabezado con título y botón vaciar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={titleStyles}>
                    {content.title || 'Tu carrito'}
                </h2>
                {mode === 'frontend' && cartItems.length > 0 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClearCart();
                        }}
                        style={{
                            padding: '6px 12px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        <Trash2 size={16} />
                        Vaciar
                    </button>
                )}
            </div>

            {cartItems.length === 0 ? (
                <div className="text-center py-12" style={textStyles}>
                    <p>{content.emptyMessage || 'Tu carrito está vacío'}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {cartItems.map(item => (
                        <div
                            key={item.id}
                            className="flex items-start gap-4 p-4 rounded-lg border"
                            style={{
                                border: resolveValue(styles.rowBorder || '1px solid #e5e7eb'),
                                padding: styles.rowPadding || '16px',
                                backgroundColor: resolveValue(styles.rowBackground || themeWithDefaults.background),
                            }}
                        >
                            {/* Imagen del producto */}
                            {content.showImage !== false && (
                                <div className="flex-shrink-0">
                                    <img
                                        src={item.image || '/product-example.png'}
                                        alt={item.name}
                                        className="rounded-md object-cover"
                                        style={{
                                            width: withUnit(styles.imageSize || '80px'),
                                            height: withUnit(styles.imageSize || '80px'),
                                        }}
                                        onError={(e) => {
                                            e.target.src = '/product-example.png';
                                        }}
                                    />
                                </div>
                            )}

                            {/* Información del producto */}
                            <div className="flex-grow">
                                <div className="flex justify-between">
                                    <div>
                                        <h3 className="font-medium" style={{
                                            fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                                            color: resolveValue(themeWithDefaults.heading)
                                        }}>
                                            {item.name}
                                        </h3>

                                        {/* Combinación seleccionada: usa combinationName si existe, si no construye desde combination */}
                                        {content.showCombination !== false && (item.combinationName || item.combination) && (
                                            <div className="text-sm mt-1" style={{
                                                color: resolveValue(themeWithDefaults.text),
                                                opacity: '0.7'
                                            }}>
                                                {item.combinationName
                                                    ? item.combinationName
                                                    : item.combination?.attribute_values?.map(attr => `${attr.attribute_name}: ${attr.value_name}`).join(' / ')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        {hasDiscount(item) ? (
                                            <div>
                                                <div className="line-through text-sm" style={{
                                                    color: '#999',
                                                    fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme)
                                                }}>
                                                    <FormattedPrice amount={item.originalPrice * item.quantity} />
                                                </div>
                                                <div className="font-semibold" style={{
                                                    color: resolveValue(themeWithDefaults.primary_color),
                                                    fontFamily: getResolvedFont(themeWithDefaults, 'heading_font', appliedTheme)
                                                }}>
                                                    <FormattedPrice amount={item.price * item.quantity} />
                                                </div>
                                                <div className="text-xs mt-1" style={{
                                                    color: '#059669',
                                                    fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme)
                                                }}>
                                                    Ahorras: <FormattedPrice amount={item.discountAmount || 0} />
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="font-semibold" style={{
                                                    color: resolveValue(themeWithDefaults.primary_color),
                                                    fontFamily: getResolvedFont(themeWithDefaults, 'heading_font', appliedTheme)
                                                }}>
                                                    <FormattedPrice amount={item.price * item.quantity} />
                                                </div>
                                                <div className="text-sm" style={{ color: '#6b7280' }}>
                                                    <FormattedPrice amount={item.price} /> c/u
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {renderDiscountInfo(item)}

                                {content.showStock && (
                                    <div className="text-sm mt-1" style={{
                                        color: item.stock > 0 ? '#059669' : '#dc2626',
                                        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme)
                                    }}>
                                        {item.stock > 0
                                            ? `${item.stock} disponibles`
                                            : 'Agotado'}
                                    </div>
                                )}

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center border rounded-md">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onUpdateQuantity(item.id, item.quantity - 1);
                                            }}
                                            className="px-3 py-1 hover:bg-gray-100"
                                            style={{
                                                borderRight: '1px solid #e5e7eb',
                                                color: resolveValue(themeWithDefaults.text),
                                                fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme)
                                            }}
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1" style={{
                                            fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme)
                                        }}>
                                            {item.quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onUpdateQuantity(item.id, item.quantity + 1);
                                            }}
                                            className="px-3 py-1 hover:bg-gray-100"
                                            style={{
                                                borderLeft: '1px solid #e5e7eb',
                                                color: resolveValue(themeWithDefaults.text),
                                                fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme)
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveItem(item.id);
                                        }}
                                        className="flex items-center gap-1 text-red-600 hover:text-red-800"
                                        style={{ fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme) }}
                                    >
                                        <Trash2 size={16} />
                                        <span className="text-sm">Eliminar</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CartItemsComponent;