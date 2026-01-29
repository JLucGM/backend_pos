// components/BuilderPages/Checkout/CustomerInfoComponent.jsx
import React, { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { UserCircleIcon, TruckIcon, MapPinIcon, CreditCardIcon, HomeIcon, CheckIcon } from '@heroicons/react/24/outline';
import { StoreIcon } from 'lucide-react';
import CurrencyDisplay from '@/Components/CurrencyDisplay';
import { usePage } from '@inertiajs/react';
import { getThemeWithDefaults, getComponentStyles, hslToCss, getResolvedFont, getButtonStyles } from '@/utils/themeUtils';

const CustomerInfoComponent = ({
    comp,
    getStyles,
    isPreview,
    onEdit,
    themeSettings,
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
    const styles = comp.styles || {};
    const content = comp.content || {};

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

    const examplePaymentMethods = [
        {
            id: 'card',
            name: 'Tarjeta de Crédito/Débito',
            description: 'Paga con tu tarjeta Visa, Mastercard o American Express'
        },
        {
            id: 'paypal',
            name: 'PayPal',
            description: 'Paga de forma segura con tu cuenta PayPal'
        }
    ];

    // Usar datos de ejemplo en modo builder
    const displayUser = mode === 'builder' ? exampleUser : currentUser;
    const displayAddresses = mode === 'builder' ? exampleAddresses : (userDeliveryLocations || []);
    const displayShippingRates = mode === 'builder' ? exampleShippingRates : (shippingRates || []);
    // const displayPaymentMethods = mode === 'builder' ? examplePaymentMethods : (paymentMethods || []);

    // Direcciones a mostrar
    const addressesToShow = showAllAddresses 
        ? displayAddresses 
        : displayAddresses.slice(0, 2);

    const containerStyles = {
        ...getStyles(comp),
        backgroundColor: styles.backgroundColor || '#ffffff',
        padding: styles.padding || '24px',
        borderRadius: styles.borderRadius || '12px',
        border: '1px solid #e5e7eb',
    };

    const titleStyles = {
        fontSize: styles.titleSize || '20px',
        color: styles.titleColor || '#000000',
        fontFamily: themeSettings?.heading_font,
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
                    <UserCircleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                        Inicia sesión para continuar
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Necesitamos que inicies sesión para procesar tu pedido.
                    </p>
                    <Button
                        onClick={showAuthModal}
                        className="px-8"
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

            {/* Indicador de datos de ejemplo */}
            {/* {mode === 'builder' && (
                <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                    <strong>Modo Builder:</strong> Mostrando datos de ejemplo para personalización
                </div>
            )} */}

            {/* Información del usuario */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <UserCircleIcon className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{displayUser?.name || 'Nombre del Cliente'}</h3>
                        <p className="text-gray-600">{displayUser?.email || 'email@ejemplo.com'}</p>
                        {displayUser?.phone && (
                            <p className="text-gray-600">Teléfono: {displayUser.phone}</p>
                        )}
                    </div>
                    {/* {mode !== 'builder' && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={showAuthModal}
                        >
                            Cambiar
                        </Button>
                    )} */}
                </div>
            </div>

            {/* Tipo de entrega */}
            <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Tipo de Entrega</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => onDeliveryTypeChange('delivery')}
                        className={`p-4 border rounded-lg text-left transition-all ${
                            deliveryType === 'delivery' 
                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                                : 'border-gray-300 hover:border-gray-400'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                                deliveryType === 'delivery' ? 'bg-blue-100' : 'bg-gray-100'
                            }`}>
                                <TruckIcon className={`h-6 w-6 ${
                                    deliveryType === 'delivery' ? 'text-blue-600' : 'text-gray-400'
                                }`} />
                            </div>
                            <div>
                                <div className={`font-medium ${
                                    deliveryType === 'delivery' ? 'text-blue-700' : 'text-gray-700'
                                }`}>
                                    Envío a Domicilio
                                </div>
                                <div className="text-sm text-gray-500">
                                    Recibe tu pedido en tu dirección
                                </div>
                            </div>
                        </div>
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => onDeliveryTypeChange('pickup')}
                        className={`p-4 border rounded-lg text-left transition-all ${
                            deliveryType === 'pickup' 
                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                                : 'border-gray-300 hover:border-gray-400'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                                deliveryType === 'pickup' ? 'bg-blue-100' : 'bg-gray-100'
                            }`}>
                                <StoreIcon className={`h-6 w-6 ${
                                    deliveryType === 'pickup' ? 'text-blue-600' : 'text-gray-400'
                                }`} />
                            </div>
                            <div>
                                <div className={`font-medium ${
                                    deliveryType === 'pickup' ? 'text-blue-700' : 'text-gray-700'
                                }`}>
                                    Recoger en Tienda
                                </div>
                                <div className="text-sm text-gray-500">
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
                        <h3 className="font-medium text-gray-700">Dirección de entrega</h3>
                        <button
                            onClick={() => console.log('Agregar nueva dirección')}
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                            <span>+ Nueva dirección</span>
                        </button>
                    </div>

                    {displayAddresses.length === 0 ? (
                        <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                            <HomeIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500">No hay direcciones registradas</p>
                            <button className="mt-2 text-blue-600 hover:text-blue-800">
                                Agregar primera dirección
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {addressesToShow.map(address => (
                                <div
                                    key={address.id}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                        selectedAddressId === address.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                    onClick={() => onAddressSelect(address.id)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 mt-1">
                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                                        selectedAddressId === address.id
                                                            ? 'border-blue-500 bg-blue-500'
                                                            : 'border-gray-300'
                                                    }`}>
                                                        {selectedAddressId === address.id && (
                                                            <CheckIcon className="h-3 w-3 text-white" />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <HomeIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                                        <span className="font-medium">{address.address_line_1}</span>
                                                        {address.is_default && (
                                                            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                                Principal
                                                            </span>
                                                        )}
                                                    </div>
                                                    {address.address_line_2 && (
                                                        <p className="text-gray-600 text-sm">{address.address_line_2}</p>
                                                    )}
                                                    <p className="text-gray-600 text-sm">
                                                        {address.city}, {address.state}, {address.country}
                                                    </p>
                                                    <p className="text-gray-600 text-sm">CP: {address.postal_code}</p>
                                                    {address.phone_number && (
                                                        <p className="text-gray-600 text-sm">Tel: {address.phone_number}</p>
                                                    )}
                                                    {selectedAddressId === address.id && (
                                                        <p className="text-blue-600 text-sm mt-2 font-medium flex items-center gap-1">
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
                                    className="text-sm text-blue-600 hover:text-blue-800 w-full text-center py-2"
                                >
                                    Mostrar {displayAddresses.length - 2} direcciones más
                                </button>
                            )}

                            {showAllAddresses && displayAddresses.length > 2 && (
                                <button
                                    onClick={() => setShowAllAddresses(false)}
                                    className="text-sm text-gray-600 hover:text-gray-800 w-full text-center py-2"
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
                        <h3 className="font-medium text-gray-700">Método de Envío</h3>
                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                        {displayShippingRates.map(rate => (
                            <div
                                key={rate.id}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                    selectedShippingRate?.id === rate.id 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => onShippingRateChange(rate)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{rate.name}</div>
                                        {rate.description && (
                                            <div className="text-sm text-gray-600 mt-1">{rate.description}</div>
                                        )}
                                        {rate.estimated_days && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                Entrega estimada: {rate.estimated_days} días
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="font-semibold text-lg">
                                            {settings?.currency ? (
                                                <CurrencyDisplay currency={settings.currency} amount={rate.price} />
                                            ) : (
                                                `$${rate.price}`
                                            )}
                                        </div>
                                        {selectedShippingRate?.id === rate.id && (
                                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
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

            {/* Métodos de pago */}
            {/* {displayPaymentMethods.length > 0 && (
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-gray-700">Métodos de Pago Disponibles</h3>
                        <CreditCardIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                        {displayPaymentMethods.map(method => (
                            <div
                                key={method.id}
                                className="p-4 border border-gray-200 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{method.name}</div>
                                        {method.description && (
                                            <div className="text-sm text-gray-600 mt-1">
                                                {method.description}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )} */}

            {/* Información para pickup */}
            {deliveryType === 'pickup' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <StoreIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-blue-900">Recoger en Tienda</h4>
                            <p className="text-blue-700 text-sm mt-1">
                                Puedes recoger tu pedido en nuestro local. Te notificaremos cuando esté listo.
                            </p>
                            <div className="mt-2 text-sm text-blue-600">
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