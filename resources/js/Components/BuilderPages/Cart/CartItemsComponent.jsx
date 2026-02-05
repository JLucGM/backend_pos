// CartItemsComponent.jsx - VERSIÓN COMPLETA CON DESCUENTOS
import React from 'react';
import { Trash2 } from 'lucide-react';
import CurrencyDisplay from '@/Components/CurrencyDisplay';
import { usePage } from '@inertiajs/react';
import { getThemeWithDefaults, getComponentStyles, getResolvedFont } from '@/utils/themeUtils';

const CartItemsComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    cartItems,
    onUpdateQuantity,
    onRemoveItem,
    themeSettings,
    appliedTheme
}) => {
    const { settings } = usePage().props;
    const styles = comp.styles || {};
    const content = comp.content || {};
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // Obtener estilos del tema para cart
    const themeCartStyles = getComponentStyles(themeWithDefaults, 'cart');
    const themeCartTitleStyles = getComponentStyles(themeWithDefaults, 'cart-title');

    const containerStyles = {
        ...getStyles(comp),
        backgroundColor: styles.backgroundColor || themeCartStyles.backgroundColor || themeWithDefaults.background,
        padding: `${styles.paddingTop || '20px'} ${styles.paddingRight || '20px'} ${styles.paddingBottom || '20px'} ${styles.paddingLeft || '20px'}`,
        borderRadius: styles.borderRadius || themeCartStyles.borderRadius || '0',
        border: `${styles.borderWidth || '0'} ${styles.borderStyle || 'solid'} ${styles.borderColor || themeWithDefaults.borders}`,
    };

    const handleClick = () => {
        if (!isPreview && onEdit) {
            onEdit(comp);
        }
    };

    // Estilos de fuente del tema
    const getFontStyles = (type = 'title') => {
        if (type === 'title') {
            return {
                fontFamily: getResolvedFont(themeWithDefaults, 'heading_font'),
                fontSize: styles.titleSize || themeCartTitleStyles.fontSize || themeWithDefaults.heading2_fontSize || '24px',
                fontWeight: styles.titleWeight || themeWithDefaults.heading2_fontWeight || 'bold',
                color: styles.titleColor || themeCartTitleStyles.color || themeWithDefaults.heading,
            };
        }

        return {
            fontFamily: getResolvedFont(themeWithDefaults, 'body_font'),
            fontSize: styles.fontSize || themeWithDefaults.paragraph_fontSize || '14px',
            color: styles.color || themeWithDefaults.text,
        };
    };

    const titleStyles = getFontStyles('title');
    const textStyles = getFontStyles();

    // Función para calcular si hay descuento
    const hasDiscount = (item) => {
        return item.originalPrice && item.originalPrice !== item.price;
    };

    // Función para renderizar información de descuento
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
                    fontFamily: getResolvedFont(themeWithDefaults, 'body_font'),
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
                        fontFamily: getResolvedFont(themeWithDefaults, 'body_font')
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
            <h2 style={{ ...titleStyles, marginBottom: '24px' }}>
                {content.title || 'Tu carrito'}
            </h2>

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
                                border: styles.rowBorder || '1px solid #e5e7eb',
                                padding: styles.rowPadding || '16px',
                                backgroundColor: styles.rowBackground || themeWithDefaults.background,
                            }}
                        >
                            {/* Imagen del producto */}
                            {content.showImage !== false && (
                                <div className="flex-shrink-0">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="rounded-md object-cover"
                                        style={{
                                            width: styles.imageSize || '80px',
                                            height: styles.imageSize || '80px',
                                        }}
                                    />
                                </div>
                            )}

                            {/* Información del producto */}
                            <div className="flex-grow">
                                <div className="flex justify-between">
                                    <div>
                                        <h3 className="font-medium" style={{
                                            fontFamily: getResolvedFont(themeWithDefaults, 'body_font'),
                                            color: themeWithDefaults.heading
                                        }}>
                                            {item.name}
                                        </h3>

                                        {/* Combinación seleccionada */}
                                        {content.showCombination !== false && item.combination && (
                                            <div className="text-sm mt-1" style={{
                                                color: themeWithDefaults.text,
                                                opacity: '0.7'
                                            }}>
                                                {item.combination.attribute_values
                                                    .map(attr => `${attr.attribute_name}: ${attr.value_name}`)
                                                    .join(' / ')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        {/* Mostrar precio original tachado si hay descuento */}
                                        {hasDiscount(item) ? (
                                            <div>
                                                <div className="line-through text-sm" style={{
                                                    color: '#999',
                                                    fontFamily: getResolvedFont(themeWithDefaults, 'body_font')
                                                }}>
                                                    {settings?.currency ? (
                                                        <CurrencyDisplay currency={settings.currency} amount={item.originalPrice * item.quantity} />
                                                    ) : (
                                                        `$${(item.originalPrice * item.quantity).toFixed(2)}`
                                                    )}
                                                </div>
                                                <div className="font-semibold" style={{
                                                    color: themeSettings?.primary ? themeSettings.primary : '#1d4ed8',
                                                    fontFamily: themeSettings?.heading_font
                                                }}>
                                                    {settings?.currency ? (
                                                        <CurrencyDisplay currency={settings.currency} amount={item.price * item.quantity} />
                                                    ) : (
                                                        `$${(item.price * item.quantity).toFixed(2)}`
                                                    )}
                                                </div>
                                                {/* Mostrar ahorro */}
                                                <div className="text-xs mt-1" style={{
                                                    color: '#059669',
                                                    fontFamily: themeSettings?.body_font
                                                }}>
                                                    Ahorras: {settings?.currency ? (
                                                        <CurrencyDisplay currency={settings.currency} amount={item.discountAmount || 0} />
                                                    ) : (
                                                        `$${(item.discountAmount || 0).toFixed(2)}`
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="font-semibold" style={{
                                                    color: themeSettings?.primary ? themeSettings.primary : '#1d4ed8',
                                                    fontFamily: themeSettings?.heading_font
                                                }}>
                                                    {settings?.currency ? (
                                                        <CurrencyDisplay currency={settings.currency} amount={item.price * item.quantity} />
                                                    ) : (
                                                        `$${(item.price * item.quantity).toFixed(2)}`
                                                    )}
                                                </div>
                                                <div className="text-sm" style={{ color: '#6b7280' }}>
                                                    {settings?.currency ? (
                                                        <><CurrencyDisplay currency={settings.currency} amount={item.price} /> c/u</>
                                                    ) : (
                                                        `$${item.price.toFixed(2)} c/u`
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Información de descuento */}
                                {renderDiscountInfo(item)}

                                {/* Stock disponible */}
                                {content.showStock && (
                                    <div className="text-sm mt-1" style={{
                                        color: item.stock > 0 ? '#059669' : '#dc2626',
                                        fontFamily: themeSettings?.body_font
                                    }}>
                                        {item.stock > 0
                                            ? `${item.stock} disponibles`
                                            : 'Agotado'}
                                    </div>
                                )}

                                {/* Controles de cantidad */}
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
                                                color: themeSettings?.foreground ? themeSettings.foreground : '#374151',
                                                fontFamily: themeSettings?.body_font
                                            }}
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1" style={{
                                            fontFamily: themeSettings?.body_font
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
                                                color: themeSettings?.foreground ? themeSettings.foreground : '#374151',
                                                fontFamily: themeSettings?.body_font
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
                                        style={{ fontFamily: themeSettings?.body_font }}
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
