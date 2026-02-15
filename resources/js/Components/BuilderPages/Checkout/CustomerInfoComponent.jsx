// components/BuilderPages/Checkout/CustomerInfoComponent.jsx
import React, { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { UserCircleIcon, TruckIcon, MapPinIcon, CreditCardIcon, HomeIcon, CheckIcon } from '@heroicons/react/24/outline';
import { StoreIcon } from 'lucide-react';
import CurrencyDisplay from '@/Components/CurrencyDisplay';
import { usePage } from '@inertiajs/react';
import { getThemeWithDefaults, getComponentStyles, getResolvedFont, getButtonStyles, resolveStyleValue } from '@/utils/themeUtils';

// Helper para añadir unidad (px) si es solo número
const withUnit = (value, unit = 'px') => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'string' && isNaN(Number(value))) return value;
    return `${value}${unit}`;
};

const CustomerInfoComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    themeSettings,
    appliedTheme,  // <-- añadido
    currentUser,
    userDeliveryLocations = [],
    selectedAddressId,
    selectedShippingRate,
    deliveryType,
    onAddressSelect,
    onDeliveryTypeChange,
    onShippingRateChange,
    shippingRates = [],
    paymentMethods = [],
    showAuthModal,
    mode = 'builder'
}) => {
    const { settings } = usePage().props;
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // ===========================================
    // FUNCIÓN PARA RESOLVER REFERENCIAS
    // ===========================================
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    // Resolver estilos personalizados del componente
    const rawStyles = comp.styles || {};
    const styles = {};
    Object.keys(rawStyles).forEach(key => {
        styles[key] = resolveValue(rawStyles[key]);
    });

    // Resolver contenido del componente
    const rawContent = comp.content || {};
    const content = {};
    Object.keys(rawContent).forEach(key => {
        content[key] = resolveValue(rawContent[key]);
    });

    // Estado para mostrar/ocultar todas las direcciones
    const [showAllAddresses, setShowAllAddresses] = useState(false);

    // Datos de ejemplo para modo builder
    const exampleUser = {
        id: 1,
        name: 'Juan Pérez (Ejemplo)',
        email: 'cliente@ejemplo.com',
        phone: '+52 55 1234 5678'
    };

    const exampleAddresses = [
        {
            id: 1,
            address_line_1: 'Calle Ejemplo 123',
            address_line_2: 'Colonia Centro',
            city: 'Ciudad de México',
            state: 'CDMX',
            country: 'México',
            postal_code: '12345',
            phone_number: '+52 55 1234 5678',
            is_default: true,
            notes: 'Casa con portón negro'
        },
        {
            id: 2,
            address_line_1: 'Avenida Principal 456',
            city: 'Guadalajara',
            state: 'Jalisco',
            country: 'México',
            postal_code: '45678',
            phone_number: '+52 55 8765 4321',
            is_default: false
        }
    ];

    const exampleShippingRates = [
        {
            id: 1,
            name: 'Envío Estándar',
            price: 50.00,
            description: 'Entrega en 3-5 días hábiles',
            estimated_days: '3-5'
        },
        {
            id: 2,
            name: 'Envío Express',
            price: 120.00,
            description: 'Entrega en 24 horas',
            estimated_days: '1-2'
        }
    ];


    // Usar datos de ejemplo en modo builder
    const displayUser = mode === 'builder' ? exampleUser : currentUser;
    const displayAddresses = mode === 'builder' ? exampleAddresses : (userDeliveryLocations || []);
    const displayShippingRates = mode === 'builder' ? exampleShippingRates : (shippingRates || []);

    // Direcciones a mostrar
    const addressesToShow = showAllAddresses
        ? displayAddresses
        : displayAddresses.slice(0, 2);

    const containerStyles = {
        ...getStyles(comp),
        backgroundColor: resolveValue(styles.backgroundColor || themeWithDefaults.background),
        paddingTop: withUnit(styles.paddingTop || '24px'),
        paddingRight: withUnit(styles.paddingRight || '24px'),
        paddingBottom: withUnit(styles.paddingBottom || '24px'),
        paddingLeft: withUnit(styles.paddingLeft || '24px'),
        borderRadius: withUnit(styles.borderRadius || themeWithDefaults.border_radius_medium || '12px'),
        border: `1px solid ${resolveValue(themeWithDefaults.borders)}`,
    };

    const titleStyles = {
        fontSize: withUnit(styles.titleSize || themeWithDefaults.heading3_fontSize || '20px', styles.titleSizeUnit || 'px'),
        color: resolveValue(styles.titleColor || themeWithDefaults.heading),
        fontFamily: getResolvedFont(themeWithDefaults, 'heading_font', appliedTheme),
        marginBottom: '20px',
        fontWeight: '600',
    };

    // Si no hay usuario autenticado y no estamos en modo builder
    if (!displayUser && mode !== 'builder') {
        return (
            <div style={containerStyles}>
                <h2 style={titleStyles}>
                    {content.title || 'Información del Cliente'}
                </h2>

                <div className="text-center py-8">
                    <UserCircleIcon className="h-16 w-16 mx-auto mb-4" style={{ color: resolveValue(themeWithDefaults.text) }} />
                    <h3 className="text-lg font-medium mb-2" style={{ color: resolveValue(themeWithDefaults.heading) }}>
                        Inicia sesión para continuar
                    </h3>
                    <p className="mb-6" style={{ color: resolveValue(themeWithDefaults.text) }}>
                        Necesitamos que inicies sesión para procesar tu pedido.
                    </p>
                    <Button
                        onClick={showAuthModal}
                        className="px-8"
                        style={{
                            ...getButtonStyles(themeWithDefaults, 'primary', appliedTheme),
                            fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                        }}
                    >
                        Iniciar Sesión o Registrarse
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyles}>
            <h2 style={titleStyles}>
                {content.title || 'Información del Cliente'}
            </h2>

            {/* Información del usuario */}
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: resolveValue(themeWithDefaults.secondary_button_background) }}>
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: resolveValue(themeWithDefaults.primary_button_background + '20') }}>
                            <UserCircleIcon className="h-6 w-6" style={{ color: resolveValue(themeWithDefaults.links) }} />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold" style={{ color: resolveValue(themeWithDefaults.heading) }}>
                            {displayUser?.name || 'Nombre del Cliente'}
                        </h3>
                        <p style={{ color: resolveValue(themeWithDefaults.text) }}>{displayUser?.email || 'email@ejemplo.com'}</p>
                        {displayUser?.phone && (
                            <p style={{ color: resolveValue(themeWithDefaults.text) }}>Teléfono: {displayUser.phone}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Tipo de entrega */}
            <div className="mb-6">
                <h3 className="font-medium mb-3" style={{ color: resolveValue(themeWithDefaults.heading) }}>Tipo de Entrega</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => onDeliveryTypeChange('delivery')}
                        className="p-4 border rounded-lg text-left transition-all"
                        style={{
                            borderColor: deliveryType === 'delivery'
                                ? resolveValue(themeWithDefaults.links)
                                : resolveValue(themeWithDefaults.borders),
                            backgroundColor: deliveryType === 'delivery'
                                ? resolveValue(themeWithDefaults.links + '10')
                                : 'transparent',
                            boxShadow: deliveryType === 'delivery'
                                ? `0 0 0 2px ${resolveValue(themeWithDefaults.links + '20')}`
                                : 'none',
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg"
                                style={{ backgroundColor: deliveryType === 'delivery'
                                    ? resolveValue(themeWithDefaults.links + '20')
                                    : resolveValue(themeWithDefaults.secondary_button_background) }}>
                                <TruckIcon className="h-6 w-6" style={{
                                    color: deliveryType === 'delivery'
                                        ? resolveValue(themeWithDefaults.links)
                                        : resolveValue(themeWithDefaults.text)
                                }} />
                            </div>
                            <div>
                                <div className="font-medium" style={{
                                    color: deliveryType === 'delivery'
                                        ? resolveValue(themeWithDefaults.links)
                                        : resolveValue(themeWithDefaults.heading)
                                }}>
                                    Envío a Domicilio
                                </div>
                                <div className="text-sm" style={{ color: resolveValue(themeWithDefaults.text) }}>
                                    Recibe tu pedido en tu dirección
                                </div>
                            </div>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => onDeliveryTypeChange('pickup')}
                        className="p-4 border rounded-lg text-left transition-all"
                        style={{
                            borderColor: deliveryType === 'pickup'
                                ? resolveValue(themeWithDefaults.links)
                                : resolveValue(themeWithDefaults.borders),
                            backgroundColor: deliveryType === 'pickup'
                                ? resolveValue(themeWithDefaults.links + '10')
                                : 'transparent',
                            boxShadow: deliveryType === 'pickup'
                                ? `0 0 0 2px ${resolveValue(themeWithDefaults.links + '20')}`
                                : 'none',
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg"
                                style={{ backgroundColor: deliveryType === 'pickup'
                                    ? resolveValue(themeWithDefaults.links + '20')
                                    : resolveValue(themeWithDefaults.secondary_button_background) }}>
                                <StoreIcon className="h-6 w-6" style={{
                                    color: deliveryType === 'pickup'
                                        ? resolveValue(themeWithDefaults.links)
                                        : resolveValue(themeWithDefaults.text)
                                }} />
                            </div>
                            <div>
                                <div className="font-medium" style={{
                                    color: deliveryType === 'pickup'
                                        ? resolveValue(themeWithDefaults.links)
                                        : resolveValue(themeWithDefaults.heading)
                                }}>
                                    Recoger en Tienda
                                </div>
                                <div className="text-sm" style={{ color: resolveValue(themeWithDefaults.text) }}>
                                    Recoge tu pedido en nuestro local
                                </div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Dirección de envío */}
            {deliveryType === 'delivery' && (
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium" style={{ color: resolveValue(themeWithDefaults.heading) }}>
                            Dirección de entrega
                        </h3>
                        <button
                            onClick={() => console.log('Agregar nueva dirección')}
                            className="text-sm flex items-center gap-1"
                            style={{ color: resolveValue(themeWithDefaults.links) }}
                        >
                            <span>+ Nueva dirección</span>
                        </button>
                    </div>

                    {displayAddresses.length === 0 ? (
                        <div className="text-center py-6 border-2 border-dashed rounded-lg"
                            style={{ borderColor: resolveValue(themeWithDefaults.borders) }}>
                            <HomeIcon className="h-12 w-12 mx-auto mb-2" style={{ color: resolveValue(themeWithDefaults.text) }} />
                            <p style={{ color: resolveValue(themeWithDefaults.text) }}>No hay direcciones registradas</p>
                            <button className="mt-2" style={{ color: resolveValue(themeWithDefaults.links) }}>
                                Agregar primera dirección
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {addressesToShow.map(address => (
                                <div
                                    key={address.id}
                                    className="p-4 border rounded-lg cursor-pointer transition-all"
                                    style={{
                                        borderColor: selectedAddressId === address.id
                                            ? resolveValue(themeWithDefaults.links)
                                            : resolveValue(themeWithDefaults.borders),
                                        backgroundColor: selectedAddressId === address.id
                                            ? resolveValue(themeWithDefaults.links + '10')
                                            : 'transparent',
                                    }}
                                    onClick={() => onAddressSelect(address.id)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 mt-1">
                                                    <div className="w-5 h-5 rounded-full border flex items-center justify-center"
                                                        style={{
                                                            borderColor: selectedAddressId === address.id
                                                                ? resolveValue(themeWithDefaults.links)
                                                                : resolveValue(themeWithDefaults.borders),
                                                            backgroundColor: selectedAddressId === address.id
                                                                ? resolveValue(themeWithDefaults.links)
                                                                : 'transparent',
                                                        }}>
                                                        {selectedAddressId === address.id && (
                                                            <CheckIcon className="h-3 w-3 text-white" />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <HomeIcon className="h-4 w-4 flex-shrink-0" style={{ color: resolveValue(themeWithDefaults.text) }} />
                                                        <span className="font-medium" style={{ color: resolveValue(themeWithDefaults.heading) }}>
                                                            {address.address_line_1}
                                                        </span>
                                                        {address.is_default && (
                                                            <span className="px-2 py-0.5 text-xs font-medium rounded-full"
                                                                style={{
                                                                    backgroundColor: resolveValue(themeWithDefaults.links + '20'),
                                                                    color: resolveValue(themeWithDefaults.links),
                                                                }}>
                                                                Principal
                                                            </span>
                                                        )}
                                                    </div>
                                                    {address.address_line_2 && (
                                                        <p className="text-sm" style={{ color: resolveValue(themeWithDefaults.text) }}>
                                                            {address.address_line_2}
                                                        </p>
                                                    )}
                                                    <p className="text-sm" style={{ color: resolveValue(themeWithDefaults.text) }}>
                                                        {address.city}, {address.state}, {address.country}
                                                    </p>
                                                    <p className="text-sm" style={{ color: resolveValue(themeWithDefaults.text) }}>
                                                        CP: {address.postal_code}
                                                    </p>
                                                    {address.phone_number && (
                                                        <p className="text-sm" style={{ color: resolveValue(themeWithDefaults.text) }}>
                                                            Tel: {address.phone_number}
                                                        </p>
                                                    )}
                                                    {selectedAddressId === address.id && (
                                                        <p className="text-sm mt-2 font-medium flex items-center gap-1"
                                                            style={{ color: resolveValue(themeWithDefaults.links) }}>
                                                            <CheckIcon className="h-4 w-4" />
                                                            Seleccionada
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {displayAddresses.length > 2 && !showAllAddresses && (
                                <button
                                    onClick={() => setShowAllAddresses(true)}
                                    className="text-sm w-full text-center py-2"
                                    style={{ color: resolveValue(themeWithDefaults.links) }}
                                >
                                    Mostrar {displayAddresses.length - 2} direcciones más
                                </button>
                            )}

                            {showAllAddresses && displayAddresses.length > 2 && (
                                <button
                                    onClick={() => setShowAllAddresses(false)}
                                    className="text-sm w-full text-center py-2"
                                    style={{ color: resolveValue(themeWithDefaults.text) }}
                                >
                                    Mostrar menos
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Métodos de envío */}
            {deliveryType === 'delivery' && selectedAddressId && displayShippingRates.length > 0 && (
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium" style={{ color: resolveValue(themeWithDefaults.heading) }}>
                            Método de Envío
                        </h3>
                        <MapPinIcon className="h-5 w-5" style={{ color: resolveValue(themeWithDefaults.text) }} />
                    </div>
                    <div className="space-y-2">
                        {displayShippingRates.map(rate => (
                            <div
                                key={rate.id}
                                className="p-4 border rounded-lg cursor-pointer transition-all"
                                style={{
                                    borderColor: selectedShippingRate?.id === rate.id
                                        ? resolveValue(themeWithDefaults.links)
                                        : resolveValue(themeWithDefaults.borders),
                                    backgroundColor: selectedShippingRate?.id === rate.id
                                        ? resolveValue(themeWithDefaults.links + '10')
                                        : 'transparent',
                                }}
                                onClick={() => onShippingRateChange(rate)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="font-medium" style={{ color: resolveValue(themeWithDefaults.heading) }}>
                                            {rate.name}
                                        </div>
                                        {rate.description && (
                                            <div className="text-sm mt-1" style={{ color: resolveValue(themeWithDefaults.text) }}>
                                                {rate.description}
                                            </div>
                                        )}
                                        {rate.estimated_days && (
                                            <div className="text-xs mt-1" style={{ color: resolveValue(themeWithDefaults.text) }}>
                                                Entrega estimada: {rate.estimated_days} días
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="font-semibold text-lg" style={{ color: resolveValue(themeWithDefaults.heading) }}>
                                            {settings?.currency ? (
                                                <CurrencyDisplay currency={settings.currency} amount={rate.price} />
                                            ) : (
                                                `$${rate.price}`
                                            )}
                                        </div>
                                        {selectedShippingRate?.id === rate.id && (
                                            <div className="w-5 h-5 rounded-full flex items-center justify-center"
                                                style={{ backgroundColor: resolveValue(themeWithDefaults.links) }}>
                                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Información para pickup */}
            {deliveryType === 'pickup' && (
                <div className="rounded-lg p-4"
                    style={{
                        backgroundColor: resolveValue(themeWithDefaults.info_color + '20'),
                        border: `1px solid ${resolveValue(themeWithDefaults.info_color)}`,
                    }}>
                    <div className="flex items-start gap-3">
                        <StoreIcon className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: resolveValue(themeWithDefaults.info_color) }} />
                        <div>
                            <h4 className="font-medium" style={{ color: resolveValue(themeWithDefaults.info_color) }}>
                                Recoger en Tienda
                            </h4>
                            <p className="text-sm mt-1" style={{ color: resolveValue(themeWithDefaults.text) }}>
                                Puedes recoger tu pedido en nuestro local. Te notificaremos cuando esté listo.
                            </p>
                            <div className="mt-2 text-sm" style={{ color: resolveValue(themeWithDefaults.info_color) }}>
                                <div>Horario: Lunes a Viernes 9:00 - 18:00</div>
                                <div>Dirección: Av. Principal #123, Ciudad</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerInfoComponent;