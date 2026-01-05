// components/BuilderPages/Checkout/CheckoutDiscountGiftCardComponent.jsx
import React, { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Percent, Gift } from 'lucide-react';

const CheckoutDiscountGiftCardComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    onDelete,
    themeSettings,
    discountCode = '',
    setDiscountCode = () => {},
    giftCardCode = '',
    setGiftCardCode = () => {},
    onApplyDiscount = () => {},
    onApplyGiftCard = () => {},
    appliedDiscount = null,
    appliedGiftCard = null,
    userGiftCards = [],
    mode = 'builder'
}) => {
    const styles = comp.styles || {};
    const content = comp.content || {};
    const [activeTab, setActiveTab] = useState('discount');

    // Datos de ejemplo para modo builder
    const exampleAppliedDiscount = mode === 'builder' ? {
        id: 1,
        name: 'DESCUENTO10',
        code: 'DESCUENTO10',
        discount_type: 'percentage',
        value: 10,
        description: '10% de descuento'
    } : appliedDiscount;

    const exampleAppliedGiftCard = mode === 'builder' ? {
        id: 1,
        code: 'GIFT-123456',
        current_balance: 50.00,
        amount_used: 25.00
    } : appliedGiftCard;

    const containerStyles = {
        ...getStyles(comp),
        backgroundColor: styles.backgroundColor || '#f8fafc',
        padding: styles.padding || '16px',
        borderRadius: styles.borderRadius || '8px',
        border: '1px solid #e5e7eb',
    };

    const titleStyles = {
        fontSize: styles.titleSize || '16px',
        color: styles.titleColor || '#374151',
        fontFamily: themeSettings?.heading_font,
        marginBottom: '12px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    };

    return (
        <div style={containerStyles}>
            <h3 style={titleStyles}>
                <Percent size={18} />
                {content.title || 'Cupones y Gift Cards'}
            </h3>

            {/* Tabs para cambiar entre descuento y gift card */}
            <div className="flex border-b mb-4">
                <button
                    className={`px-4 py-2 font-medium text-sm ${activeTab === 'discount' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                    onClick={() => setActiveTab('discount')}
                >
                    Cupón
                </button>
                <button
                    className={`px-4 py-2 font-medium text-sm ${activeTab === 'giftcard' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                    onClick={() => setActiveTab('giftcard')}
                >
                    Gift Card
                </button>
            </div>

            {activeTab === 'discount' ? (
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            placeholder="Código de descuento"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                            disabled={mode === 'builder'}
                        />
                        <button
                            onClick={onApplyDiscount}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                            disabled={mode === 'builder'}
                        >
                            Aplicar
                        </button>
                    </div>
                    {exampleAppliedDiscount && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-green-700 font-medium text-sm">
                                ✓ Cupón aplicado: {exampleAppliedDiscount.code}
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                                {exampleAppliedDiscount.discount_type === 'percentage' 
                                    ? `${exampleAppliedDiscount.value}% de descuento`
                                    : `$${exampleAppliedDiscount.value} de descuento`}
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={giftCardCode}
                            onChange={(e) => setGiftCardCode(e.target.value)}
                            placeholder="Código de gift card"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                            disabled={mode === 'builder'}
                        />
                        <button
                            onClick={onApplyGiftCard}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                            disabled={mode === 'builder'}
                        >
                            Aplicar
                        </button>
                    </div>
                    
                    {userGiftCards && userGiftCards.length > 0 && mode !== 'builder' && (
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Tus Gift Cards:</p>
                            <div className="space-y-2">
                                {userGiftCards.map(giftCard => (
                                    <div 
                                        key={giftCard.id}
                                        className="p-2 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 text-sm"
                                        onClick={() => setGiftCardCode(giftCard.code)}
                                    >
                                        <p className="font-medium">{giftCard.code}</p>
                                        <p className="text-xs text-gray-600">
                                            Saldo: ${giftCard.current_balance}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {exampleAppliedGiftCard && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-green-700 font-medium text-sm">
                                <Gift size={14} className="inline mr-1" />
                                Gift Card aplicada: {exampleAppliedGiftCard.code}
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                                Saldo aplicado: ${exampleAppliedGiftCard.amount_used || exampleAppliedGiftCard.current_balance}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {mode === 'builder' && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500 italic">
                        En modo frontend, los clientes podrán aplicar cupones y gift cards aquí.
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutDiscountGiftCardComponent;