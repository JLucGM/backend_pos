import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { getThemeWithDefaults, getComponentStyles, getResolvedFont, getButtonStyles } from '@/utils/themeUtils';

const CheckoutAddressSelectorComponent = ({
    userDeliveryLocations,
    selectedAddressId,
    onSelectAddress,
    onAddNewAddress,
    themeSettings,
    appliedTheme
}) => {
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    if (!userDeliveryLocations || userDeliveryLocations.length === 0) {
        return (
            <div className="mb-4">
                <button
                    onClick={onAddNewAddress}
                    className="flex items-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg w-full hover:opacity-80"
                    style={{
                        borderColor: themeWithDefaults.borders,
                        color: themeWithDefaults.text,
                        fontFamily: getResolvedFont(themeWithDefaults, 'body_font'),
                    }}
                >
                    <PlusIcon className="h-5 w-5" />
                    <span>Agregar dirección de entrega</span>
                </button>
            </div>
        );
    }

    return (
        <div className="mb-6">
            <h3 className="font-medium mb-3" style={{
                color: themeWithDefaults.heading,
                fontFamily: getResolvedFont(themeWithDefaults, 'heading_font'),
            }}>
                Selecciona una dirección de entrega
            </h3>
            <div className="space-y-3">
                {userDeliveryLocations.map(address => (
                    <div
                        key={address.id}
                        className="p-4 border rounded-lg cursor-pointer transition-all"
                        style={{
                            borderColor: selectedAddressId === address.id
                                ? themeWithDefaults.links
                                : themeWithDefaults.borders,
                            backgroundColor: selectedAddressId === address.id
                                ? themeWithDefaults.background
                                : 'transparent',
                            fontFamily: getResolvedFont(themeWithDefaults, 'body_font'),
                        }}
                        onClick={() => onSelectAddress(address.id)}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-medium" style={{ color: themeWithDefaults.heading }}>
                                    {address.address_line_1}
                                </p>
                                {address.address_line_2 && (
                                    <p style={{ color: themeWithDefaults.text }}>
                                        {address.address_line_2}
                                    </p>
                                )}
                                <p style={{ color: themeWithDefaults.text }}>
                                    {address.city}, {address.state}, {address.country}
                                </p>
                                <p style={{ color: themeWithDefaults.text }}>
                                    Código Postal: {address.postal_code}
                                </p>
                                {address.phone_number && (
                                    <p style={{ color: themeWithDefaults.text }}>
                                        Tel: {address.phone_number}
                                    </p>
                                )}
                                {address.notes && (
                                    <p className="text-sm mt-1" style={{
                                        color: themeWithDefaults.text,
                                        opacity: '0.7'
                                    }}>
                                        Notas: {address.notes}
                                    </p>
                                )}
                            </div>
                            {address.is_default && (
                                <span className="px-2 py-1 text-xs font-medium rounded-full" style={{
                                    backgroundColor: themeWithDefaults.links,
                                    color: themeWithDefaults.primary_button_text,
                                }}>
                                    Principal
                                </span>
                            )}
                        </div>
                    </div>
                ))}
                <button
                    onClick={onAddNewAddress}
                    className="flex items-center gap-2 hover:opacity-80"
                    style={{
                        color: themeWithDefaults.links,
                        fontFamily: getResolvedFont(themeWithDefaults, 'body_font'),
                    }}
                >
                    <PlusIcon className="h-4 w-4" />
                    <span>Agregar nueva dirección</span>
                </button>
            </div>
        </div>
    );
};

export default CheckoutAddressSelectorComponent;
