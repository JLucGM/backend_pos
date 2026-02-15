// components/BuilderPages/Checkout/CheckoutDiscountGiftCardComponent.jsx
import React, { useState } from 'react';
import { Percent, Gift, X, Calendar, DollarSign } from 'lucide-react';
import CurrencyDisplay from '@/Components/CurrencyDisplay';
import { usePage } from '@inertiajs/react';
import { getThemeWithDefaults, getComponentStyles, getResolvedFont, getInputStyles, resolveStyleValue } from '@/utils/themeUtils';

// Helper para añadir unidad (px) si es solo número
const withUnit = (value, unit = 'px') => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'string' && isNaN(Number(value))) return value;
    return `${value}${unit}`;
};

const CheckoutDiscountGiftCardComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    onDelete,
    themeSettings,
    discountCode = '',
    setDiscountCode = () => { },
    giftCardCode = '',
    setGiftCardCode = () => { },
    onApplyDiscount = () => { },
    onRemoveDiscount = () => { },
    onApplyGiftCard = () => { },
    onRemoveGiftCard = () => { },
    appliedDiscounts = [],
    appliedGiftCard = null,
    giftCardAmountUsed = 0,
    userGiftCards = [],
    mode = 'builder',
    appliedTheme
}) => {
    const { settings } = usePage().props;
    const rawStyles = comp.styles || {};
    const rawContent = comp.content || {};
    const [activeTab, setActiveTab] = useState('discount');
    const [isApplying, setIsApplying] = useState(false);
    const [isApplyingGiftCard, setIsApplyingGiftCard] = useState(false);
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // ===========================================
    // FUNCIÓN PARA RESOLVER REFERENCIAS
    // ===========================================
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    // Resolver estilos personalizados
    const styles = {};
    Object.keys(rawStyles).forEach(key => {
        styles[key] = resolveValue(rawStyles[key]);
    });

    // Resolver contenido (por si contiene referencias)
    const content = {};
    Object.keys(rawContent).forEach(key => {
        content[key] = resolveValue(rawContent[key]);
    });

    // Obtener estilos del tema (resueltos)
    const themeInputStyles = getInputStyles(themeWithDefaults);
    // Resolver los valores de themeInputStyles por si acaso
    Object.keys(themeInputStyles).forEach(key => {
        if (typeof themeInputStyles[key] === 'string') {
            themeInputStyles[key] = resolveValue(themeInputStyles[key]);
        }
    });

    // Datos de ejemplo para modo builder
    const exampleAppliedDiscounts = mode === 'builder' ? [{
        id: 1,
        name: 'Año nuevo 2026',
        code: 'AA11',
        discount_type: 'percentage',
        value: '15',
        amount: 1.50,
        product_name: 'Camisa',
        description: '15% de descuento en camisas'
    }] : appliedDiscounts;

    const exampleAppliedGiftCard = mode === 'builder' ? {
        id: 1,
        code: '407279',
        initial_balance: '10.00',
        current_balance: '10.00',
        expiration_date: '2026-01-15T00:00:00.000000Z'
    } : appliedGiftCard;

    const exampleGiftCardAmountUsed = mode === 'builder' ? 5.00 : giftCardAmountUsed;

    const containerStyles = {
        ...getStyles(comp),
        backgroundColor: resolveValue(styles.backgroundColor || themeWithDefaults.background),
        paddingTop: withUnit(styles.paddingTop || '16px'),
        paddingRight: withUnit(styles.paddingRight || '16px'),
        paddingBottom: withUnit(styles.paddingBottom || '16px'),
        paddingLeft: withUnit(styles.paddingLeft || '16px'),
        borderRadius: withUnit(styles.borderRadius || '8px'),
        border: `1px solid ${resolveValue(themeWithDefaults.borders)}`,
    };

    const titleStyles = {
        fontSize: withUnit(styles.titleSize || themeWithDefaults.heading4_fontSize || '16px', styles.titleSizeUnit || 'px'),
        color: resolveValue(styles.titleColor || themeWithDefaults.heading),
        fontFamily: getResolvedFont(themeWithDefaults, 'heading_font', appliedTheme),
        marginBottom: '12px',
        fontWeight: themeWithDefaults.heading4_fontWeight || '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    };

    // Función para formatear fecha
    const formatDate = (dateString) => {
        if (!dateString) return 'Sin expiración';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Función para aplicar gift card
    const handleApplyGiftCard = async () => {
        if (mode === 'builder') {
            // En modo builder, simular aplicación
            const mockGiftCard = {
                id: 999,
                code: giftCardCode || '407279',
                initial_balance: '10.00',
                current_balance: '10.00',
                expiration_date: '2026-01-15T00:00:00.000000Z'
            };
            onApplyGiftCard();
            return;
        }

        setIsApplyingGiftCard(true);
        try {
            await onApplyGiftCard();
        } finally {
            setIsApplyingGiftCard(false);
        }
    };

    // Función para manejar clic en gift card de la lista
    const handleGiftCardClick = (giftCard) => {
        setGiftCardCode(giftCard.code);
        if (mode === 'frontend') {
            // Aplicar automáticamente al hacer clic
            setTimeout(() => {
                handleApplyGiftCard();
            }, 100);
        }
    };

    return (
        <div style={containerStyles}>
            <h3 style={titleStyles}>
                <Percent size={18} />
                {content.title || 'Cupones y Gift Cards'}
            </h3>

            {/* Tabs */}
            <div className="flex border-b mb-4" style={{ borderColor: resolveValue(themeWithDefaults.borders) }}>
                <button
                    className={`px-4 py-2 font-medium text-sm ${activeTab === 'discount' ? 'border-b-2' : ''}`}
                    onClick={() => setActiveTab('discount')}
                    style={{
                        borderColor: activeTab === 'discount' ? resolveValue(themeWithDefaults.links) : 'transparent',
                        color: activeTab === 'discount' ? resolveValue(themeWithDefaults.links) : resolveValue(themeWithDefaults.text),
                        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                    }}
                >
                    Cupón
                </button>
                <button
                    className={`px-4 py-2 font-medium text-sm ${activeTab === 'giftcard' ? 'border-b-2' : ''}`}
                    onClick={() => setActiveTab('giftcard')}
                    style={{
                        borderColor: activeTab === 'giftcard' ? resolveValue(themeWithDefaults.links) : 'transparent',
                        color: activeTab === 'giftcard' ? resolveValue(themeWithDefaults.links) : resolveValue(themeWithDefaults.text),
                        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                    }}
                >
                    Gift Card
                </button>
            </div>

            {activeTab === 'discount' ? (
                <div className="space-y-3">
                    {/* Código de descuento */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            placeholder="Código de descuento (ej: AA11)"
                            className="flex-1 px-3 py-2 border rounded-md text-sm"
                            style={{
                                ...themeInputStyles,
                                fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                            }}
                            disabled={mode === 'builder' || isApplying}
                        />
                        <button
                            onClick={async () => {
                                setIsApplying(true);
                                try {
                                    await onApplyDiscount();
                                } finally {
                                    setIsApplying(false);
                                }
                            }}
                            disabled={mode === 'builder' || isApplying || !discountCode.trim()}
                            className="px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            style={{
                                backgroundColor: resolveValue(themeWithDefaults.primary_button_background),
                                color: resolveValue(themeWithDefaults.primary_button_text),
                                border: `1px solid ${resolveValue(themeWithDefaults.primary_button_border)}`,
                                fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                            }}
                        >
                            {isApplying ? 'Aplicando...' : 'Aplicar'}
                        </button>
                    </div>

                    {/* Descuentos aplicados */}
                    {exampleAppliedDiscounts.length > 0 && (
                        <div className="space-y-2 mt-3">
                            {exampleAppliedDiscounts.map(discount => (
                                <div key={discount.code || discount.id} className="p-3 rounded-md" style={{
                                    backgroundColor: resolveValue(themeWithDefaults.success_color + '20'), // 20% opacidad
                                    border: `1px solid ${resolveValue(themeWithDefaults.success_color)}`,
                                }}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="font-medium text-sm" style={{ color: resolveValue(themeWithDefaults.success_color) }}>
                                                ✓ Cupón aplicado: {discount.code}
                                            </p>
                                            <p className="text-xs mt-1" style={{ color: resolveValue(themeWithDefaults.success_color) }}>
                                                {discount.discount_type === 'percentage'
                                                    ? `${discount.value}% de descuento`
                                                    : `$${discount.value} de descuento`}
                                            </p>
                                            {discount.product_name && (
                                                <p className="text-xs mt-1" style={{ color: resolveValue(themeWithDefaults.text) }}>
                                                    Aplica a: {discount.product_name}
                                                </p>
                                            )}
                                            {discount.amount && (
                                                <p className="text-xs mt-1" style={{ color: resolveValue(themeWithDefaults.text) }}>
                                                    Descuento: {settings?.currency ? (
                                                        <CurrencyDisplay currency={settings.currency} amount={discount.amount} />
                                                    ) : (
                                                        `$${discount.amount.toFixed(2)}`
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => onRemoveDiscount(discount.code)}
                                            className="ml-2 hover:opacity-80 text-sm"
                                            style={{ color: resolveValue(themeWithDefaults.danger_color) }}
                                            disabled={mode === 'builder'}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Input para código de gift card */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={giftCardCode}
                            onChange={(e) => setGiftCardCode(e.target.value)}
                            placeholder="Código de gift card (ej: 407279)"
                            className="flex-1 px-3 py-2 border rounded-md text-sm"
                            style={{
                                ...themeInputStyles,
                                fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                            }}
                            disabled={mode === 'builder' || isApplyingGiftCard || appliedGiftCard}
                        />
                        <button
                            onClick={handleApplyGiftCard}
                            disabled={mode === 'builder' || isApplyingGiftCard || !giftCardCode.trim() || appliedGiftCard}
                            className="px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            style={{
                                backgroundColor: resolveValue(themeWithDefaults.success_color), // Usamos success_color del tema
                                color: '#ffffff',
                                border: `1px solid ${resolveValue(themeWithDefaults.success_color)}`,
                                fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                            }}
                        >
                            {isApplyingGiftCard ? 'Aplicando...' : 'Aplicar'}
                        </button>
                    </div>

                    {/* Lista de gift cards del usuario */}
                    {userGiftCards && userGiftCards.length > 0 && mode !== 'builder' && (
                        <div className="mt-3">
                            <p className="text-sm font-medium mb-2" style={{ color: resolveValue(themeWithDefaults.text) }}>
                                Tus Gift Cards:
                            </p>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {userGiftCards.map(giftCard => (
                                    <div
                                        key={giftCard.id}
                                        className={`p-3 border rounded-md cursor-pointer transition-all hover:shadow-sm`}
                                        style={{
                                            borderColor: appliedGiftCard?.id === giftCard.id
                                                ? resolveValue(themeWithDefaults.success_color)
                                                : resolveValue(themeWithDefaults.borders),
                                            backgroundColor: appliedGiftCard?.id === giftCard.id
                                                ? resolveValue(themeWithDefaults.success_color + '10')
                                                : 'transparent',
                                            fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                                        }}
                                        onClick={() => handleGiftCardClick(giftCard)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Gift size={14} style={{ color: resolveValue(themeWithDefaults.success_color) }} />
                                                    <p className="font-medium" style={{ color: resolveValue(themeWithDefaults.heading) }}>
                                                        {giftCard.code}
                                                    </p>
                                                    {appliedGiftCard?.id === giftCard.id && (
                                                        <span className="text-xs px-2 py-1 rounded-full" style={{
                                                            backgroundColor: resolveValue(themeWithDefaults.success_color + '20'),
                                                            color: resolveValue(themeWithDefaults.success_color),
                                                        }}>
                                                            Aplicada
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    <div className="flex items-center gap-1" style={{ color: resolveValue(themeWithDefaults.text) }}>
                                                        <DollarSign size={12} />
                                                        <span>Saldo: <strong style={{ color: resolveValue(themeWithDefaults.success_color) }}>
                                                            {settings?.currency ? (
                                                                <CurrencyDisplay currency={settings.currency} amount={parseFloat(giftCard.current_balance)} />
                                                            ) : (
                                                                `$${parseFloat(giftCard.current_balance).toFixed(2)}`
                                                            )}
                                                        </strong></span>
                                                    </div>

                                                    <div className="flex items-center gap-1" style={{ color: resolveValue(themeWithDefaults.text) }}>
                                                        <Calendar size={12} />
                                                        <span>Expira: {formatDate(giftCard.expiration_date)}</span>
                                                    </div>
                                                </div>

                                                {appliedGiftCard?.id === giftCard.id && exampleGiftCardAmountUsed > 0 && (
                                                    <div className="mt-2 pt-2 border-t" style={{ borderColor: resolveValue(themeWithDefaults.borders) }}>
                                                        <p className="text-xs" style={{ color: resolveValue(themeWithDefaults.success_color) }}>
                                                            Se usarán <strong>
                                                                {settings?.currency ? (
                                                                    <CurrencyDisplay currency={settings.currency} amount={exampleGiftCardAmountUsed} />
                                                                ) : (
                                                                    `$${exampleGiftCardAmountUsed.toFixed(2)}`
                                                                )}
                                                            </strong> en esta orden
                                                        </p>
                                                        <p className="text-xs mt-1" style={{ color: resolveValue(themeWithDefaults.text) }}>
                                                            Saldo restante: {settings?.currency ? (
                                                                <CurrencyDisplay currency={settings.currency} amount={parseFloat(giftCard.current_balance) - exampleGiftCardAmountUsed} />
                                                            ) : (
                                                                `$${(parseFloat(giftCard.current_balance) - exampleGiftCardAmountUsed).toFixed(2)}`
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Gift Card aplicada */}
                    {exampleAppliedGiftCard && (
                        <div className="p-3 rounded-md mt-3" style={{
                            backgroundColor: resolveValue(themeWithDefaults.success_color + '20'),
                            border: `1px solid ${resolveValue(themeWithDefaults.success_color)}`,
                        }}>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Gift size={16} style={{ color: resolveValue(themeWithDefaults.success_color) }} />
                                        <p className="font-medium text-sm" style={{ color: resolveValue(themeWithDefaults.success_color) }}>
                                            ✓ Gift Card aplicada: {exampleAppliedGiftCard.code}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div>
                                            <p className="text-gray-600" style={{ color: resolveValue(themeWithDefaults.text) }}>Saldo total:</p>
                                            <p className="font-medium" style={{ color: resolveValue(themeWithDefaults.success_color) }}>
                                                {settings?.currency ? (
                                                    <CurrencyDisplay currency={settings.currency} amount={parseFloat(exampleAppliedGiftCard.current_balance)} />
                                                ) : (
                                                    `$${parseFloat(exampleAppliedGiftCard.current_balance).toFixed(2)}`
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-600" style={{ color: resolveValue(themeWithDefaults.text) }}>Se usará en esta orden:</p>
                                            <p className="font-medium" style={{ color: resolveValue(themeWithDefaults.success_color) }}>
                                                {settings?.currency ? (
                                                    <CurrencyDisplay currency={settings.currency} amount={exampleGiftCardAmountUsed} />
                                                ) : (
                                                    `$${exampleGiftCardAmountUsed.toFixed(2)}`
                                                )}
                                            </p>
                                        </div>

                                        <div className="col-span-2">
                                            <p className="text-gray-600" style={{ color: resolveValue(themeWithDefaults.text) }}>Fecha de expiración:</p>
                                            <p className="font-medium" style={{ color: resolveValue(themeWithDefaults.text) }}>
                                                {formatDate(exampleAppliedGiftCard.expiration_date)}
                                            </p>
                                        </div>

                                        {exampleGiftCardAmountUsed > 0 && (
                                            <div className="col-span-2 mt-2 pt-2 border-t" style={{ borderColor: resolveValue(themeWithDefaults.borders) }}>
                                                <p className="text-xs" style={{ color: resolveValue(themeWithDefaults.success_color) }}>
                                                    Saldo restante después de la compra:
                                                    {settings?.currency ? (
                                                        <CurrencyDisplay currency={settings.currency} amount={parseFloat(exampleAppliedGiftCard.current_balance) - exampleGiftCardAmountUsed} />
                                                    ) : (
                                                        `$${(parseFloat(exampleAppliedGiftCard.current_balance) - exampleGiftCardAmountUsed).toFixed(2)}`
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={onRemoveGiftCard}
                                    className="ml-2 hover:opacity-80 text-sm"
                                    style={{ color: resolveValue(themeWithDefaults.danger_color) }}
                                    disabled={mode === 'builder'}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Información adicional */}
                    {mode === 'builder' && (
                        <div className="p-3 rounded-md" style={{
                            backgroundColor: resolveValue(themeWithDefaults.info_color + '20'),
                            border: `1px solid ${resolveValue(themeWithDefaults.info_color)}`,
                        }}>
                            <p className="text-xs font-medium mb-1" style={{ color: resolveValue(themeWithDefaults.info_color) }}>
                                Ejemplo de Gift Card del usuario:
                            </p>
                            <p className="text-xs" style={{ color: resolveValue(themeWithDefaults.info_color) }}>
                                Código: <strong>407279</strong> - Saldo: $10.00
                            </p>
                            <p className="text-xs mt-1" style={{ color: resolveValue(themeWithDefaults.info_color) }}>
                                En modo frontend, los usuarios podrán seleccionar sus gift cards disponibles y aplicar el saldo a su orden.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {mode === 'builder' && (
                <div className="mt-3 pt-3 border-t" style={{ borderColor: resolveValue(themeWithDefaults.borders) }}>
                    <div className="text-xs italic" style={{ color: resolveValue(themeWithDefaults.text) }}>
                        En modo frontend, los clientes podrán aplicar cupones y gift cards aquí.
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutDiscountGiftCardComponent;