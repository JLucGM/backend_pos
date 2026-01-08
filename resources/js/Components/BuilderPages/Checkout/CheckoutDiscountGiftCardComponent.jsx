// components/BuilderPages/Checkout/CheckoutDiscountGiftCardComponent.jsx
import React, { useState } from 'react';
import { Percent, Gift, X, Calendar, DollarSign } from 'lucide-react';

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
    onRemoveDiscount = () => {},
    onApplyGiftCard = () => {},
    onRemoveGiftCard = () => {},
    appliedDiscounts = [],
    appliedGiftCard = null,
    giftCardAmountUsed = 0,
    userGiftCards = [],
    mode = 'builder'
}) => {
    const styles = comp.styles || {};
    const content = comp.content || {};
    const [activeTab, setActiveTab] = useState('discount');
    const [isApplying, setIsApplying] = useState(false);
    const [isApplyingGiftCard, setIsApplyingGiftCard] = useState(false);

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
                // ... Sección de cupones (igual que antes) ...
                <div className="space-y-3">
                    {/* Código de descuento */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            placeholder="Código de descuento (ej: AA11)"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
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
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            {isApplying ? 'Aplicando...' : 'Aplicar'}
                        </button>
                    </div>
                    
                    {/* Descuentos aplicados */}
                    {exampleAppliedDiscounts.length > 0 && (
                        <div className="space-y-2 mt-3">
                            {exampleAppliedDiscounts.map(discount => (
                                <div key={discount.code || discount.id} className="p-3 bg-green-50 border border-green-200 rounded-md">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="text-green-700 font-medium text-sm">
                                                ✓ Cupón aplicado: {discount.code}
                                            </p>
                                            <p className="text-xs text-green-600 mt-1">
                                                {discount.discount_type === 'percentage' 
                                                    ? `${discount.value}% de descuento`
                                                    : `$${discount.value} de descuento`}
                                            </p>
                                            {discount.product_name && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Aplica a: {discount.product_name}
                                                </p>
                                            )}
                                            {discount.amount && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Descuento: ${discount.amount.toFixed(2)}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => onRemoveDiscount(discount.code)}
                                            className="ml-2 text-red-600 hover:text-red-800 text-sm"
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
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                            disabled={mode === 'builder' || isApplyingGiftCard || appliedGiftCard}
                        />
                        <button
                            onClick={handleApplyGiftCard}
                            disabled={mode === 'builder' || isApplyingGiftCard || !giftCardCode.trim() || appliedGiftCard}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            {isApplyingGiftCard ? 'Aplicando...' : 'Aplicar'}
                        </button>
                    </div>
                    
                    {/* Lista de gift cards del usuario */}
                    {userGiftCards && userGiftCards.length > 0 && mode !== 'builder' && (
                        <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Tus Gift Cards:</p>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {userGiftCards.map(giftCard => (
                                    <div 
                                        key={giftCard.id}
                                        className={`p-3 border rounded-md cursor-pointer transition-all hover:shadow-sm ${
                                            appliedGiftCard?.id === giftCard.id 
                                                ? 'bg-green-50 border-green-300' 
                                                : 'border-gray-200 hover:border-green-300'
                                        }`}
                                        onClick={() => handleGiftCardClick(giftCard)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Gift size={14} className="text-green-600" />
                                                    <p className="font-medium text-gray-900">{giftCard.code}</p>
                                                    {appliedGiftCard?.id === giftCard.id && (
                                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                            Aplicada
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    <div className="flex items-center gap-1 text-gray-600">
                                                        <DollarSign size={12} />
                                                        <span>Saldo: <strong className="text-green-600">${parseFloat(giftCard.current_balance).toFixed(2)}</strong></span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-1 text-gray-600">
                                                        <Calendar size={12} />
                                                        <span>Expira: {formatDate(giftCard.expiration_date)}</span>
                                                    </div>
                                                </div>
                                                
                                                {appliedGiftCard?.id === giftCard.id && exampleGiftCardAmountUsed > 0 && (
                                                    <div className="mt-2 pt-2 border-t border-green-200">
                                                        <p className="text-xs text-green-700">
                                                            Se usarán <strong>${exampleGiftCardAmountUsed.toFixed(2)}</strong> en esta orden
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Saldo restante: ${(parseFloat(giftCard.current_balance) - exampleGiftCardAmountUsed).toFixed(2)}
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
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md mt-3">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Gift size={16} className="text-green-600" />
                                        <p className="text-green-700 font-medium text-sm">
                                            ✓ Gift Card aplicada: {exampleAppliedGiftCard.code}
                                        </p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div>
                                            <p className="text-gray-600">Saldo total:</p>
                                            <p className="font-medium text-green-600">
                                                ${parseFloat(exampleAppliedGiftCard.current_balance).toFixed(2)}
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <p className="text-gray-600">Se usará en esta orden:</p>
                                            <p className="font-medium text-green-600">
                                                ${exampleGiftCardAmountUsed.toFixed(2)}
                                            </p>
                                        </div>
                                        
                                        <div className="col-span-2">
                                            <p className="text-gray-600">Fecha de expiración:</p>
                                            <p className="font-medium">
                                                {formatDate(exampleAppliedGiftCard.expiration_date)}
                                            </p>
                                        </div>
                                        
                                        {exampleGiftCardAmountUsed > 0 && (
                                            <div className="col-span-2 mt-2 pt-2 border-t border-green-200">
                                                <p className="text-xs text-green-700 font-medium">
                                                    Saldo restante después de la compra: 
                                                    ${(parseFloat(exampleAppliedGiftCard.current_balance) - exampleGiftCardAmountUsed).toFixed(2)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <button
                                    onClick={onRemoveGiftCard}
                                    className="ml-2 text-red-600 hover:text-red-800 text-sm"
                                    disabled={mode === 'builder'}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {/* Información adicional */}
                    {mode === 'builder' && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-blue-700 text-xs font-medium mb-1">
                                Ejemplo de Gift Card del usuario:
                            </p>
                            <p className="text-blue-600 text-xs">
                                Código: <strong>407279</strong> - Saldo: $10.00
                            </p>
                            <p className="text-blue-600 text-xs mt-1">
                                En modo frontend, los usuarios podrán seleccionar sus gift cards disponibles y aplicar el saldo a su orden.
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