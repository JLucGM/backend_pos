import React from 'react';
import { Trash2 } from 'lucide-react';

const CartItemsComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    cartItems,
    onUpdateQuantity,
    onRemoveItem,
    themeSettings
}) => {
    const styles = comp.styles || {};
    const content = comp.content || {};
    
    const containerStyles = {
        ...getStyles(comp),
        backgroundColor: styles.backgroundColor || '#ffffff',
        padding: `${styles.paddingTop || '20px'} ${styles.paddingRight || '20px'} ${styles.paddingBottom || '20px'} ${styles.paddingLeft || '20px'}`,
        borderRadius: styles.borderRadius || '0',
        border: `${styles.borderWidth || '0'} ${styles.borderStyle || 'solid'} ${styles.borderColor || '#000000'}`,
    };

    const handleClick = () => {
        if (!isPreview && onEdit) {
            onEdit(comp);
        }
    };

    // Estilos de fuente del tema
    const getFontStyles = (type = 'title') => {
        const theme = themeSettings || {};
        
        if (type === 'title') {
            return {
                fontFamily: theme?.heading_font || "'Inter', sans-serif",
                fontSize: styles.titleSize || '24px',
                fontWeight: styles.titleWeight || 'bold',
                color: styles.titleColor || (theme?.foreground ? `hsl(${theme.foreground})` : '#000000'),
            };
        }
        
        return {
            fontFamily: theme?.body_font || "'Inter', sans-serif",
            fontSize: styles.fontSize || '14px',
            color: styles.color || (theme?.text ? `hsl(${theme.text})` : '#374151'),
        };
    };

    const titleStyles = getFontStyles('title');
    const textStyles = getFontStyles();

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
                                backgroundColor: styles.rowBackground || '#ffffff',
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
                                            fontFamily: themeSettings?.body_font,
                                            color: themeSettings?.foreground ? `hsl(${themeSettings.foreground})` : '#111827'
                                        }}>
                                            {item.name}
                                        </h3>
                                        
                                        {/* Combinación seleccionada */}
                                        {content.showCombination !== false && item.combination && (
                                            <div className="text-sm mt-1" style={{ color: '#6b7280' }}>
                                                {item.combination.attribute_values
                                                    .map(attr => `${attr.attribute_name}: ${attr.value_name}`)
                                                    .join(' / ')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold" style={{ color: themeSettings?.primary ? `hsl(${themeSettings.primary})` : '#1d4ed8' }}>
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                        <div className="text-sm" style={{ color: '#6b7280' }}>
                                            ${item.price.toFixed(2)} c/u
                                        </div>
                                    </div>
                                </div>

                                {/* Stock disponible */}
                                {content.showStock && (
                                    <div className="text-sm mt-1" style={{ color: item.stock > 0 ? '#059669' : '#dc2626' }}>
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
                                                color: themeSettings?.foreground ? `hsl(${themeSettings.foreground})` : '#374151',
                                            }}
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1">{item.quantity}</span>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onUpdateQuantity(item.id, item.quantity + 1);
                                            }}
                                            className="px-3 py-1 hover:bg-gray-100"
                                            style={{
                                                borderLeft: '1px solid #e5e7eb',
                                                color: themeSettings?.foreground ? `hsl(${themeSettings.foreground})` : '#374151',
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