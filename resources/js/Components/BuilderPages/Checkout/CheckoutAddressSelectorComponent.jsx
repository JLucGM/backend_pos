import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

const CheckoutAddressSelectorComponent = ({
    userDeliveryLocations,
    selectedAddressId,
    onSelectAddress,
    onAddNewAddress,
    themeSettings,
}) => {
    if (!userDeliveryLocations || userDeliveryLocations.length === 0) {
        return (
            <div className="mb-4">
                <button
                    onClick={onAddNewAddress}
                    className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg w-full hover:border-blue-500"
                >
                    <PlusIcon className="h-5 w-5 text-gray-400" />
                    <span>Agregar dirección de entrega</span>
                </button>
            </div>
        );
    }

    return (
        <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-3">Selecciona una dirección de entrega</h3>
            <div className="space-y-3">
                {userDeliveryLocations.map(address => (
                    <div
                        key={address.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedAddressId === address.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => onSelectAddress(address.id)}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-medium">{address.address_line_1}</p>
                                {address.address_line_2 && (
                                    <p className="text-gray-600">{address.address_line_2}</p>
                                )}
                                <p className="text-gray-600">
                                    {address.city}, {address.state}, {address.country}
                                </p>
                                <p className="text-gray-600">Código Postal: {address.postal_code}</p>
                                {address.phone_number && (
                                    <p className="text-gray-600">Tel: {address.phone_number}</p>
                                )}
                                {address.notes && (
                                    <p className="text-sm text-gray-500 mt-1">Notas: {address.notes}</p>
                                )}
                            </div>
                            {address.is_default && (
                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    Principal
                                </span>
                            )}
                        </div>
                    </div>
                ))}
                <button
                    onClick={onAddNewAddress}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                    <PlusIcon className="h-4 w-4" />
                    <span>Agregar nueva dirección</span>
                </button>
            </div>
        </div>
    );
};

export default CheckoutAddressSelectorComponent;