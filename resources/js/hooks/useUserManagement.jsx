// src/hooks/useUserManagement.js
import { useState, useEffect, useMemo } from 'react';
import { mapToSelectOptions } from '@/utils/mapToSelectOptions';

/**
 * Hook para manejar selección de usuario, locations y sincronización en órdenes.
 * @param {Object} data - Datos de la orden (user_id, delivery_location_id).
 * @param {Array} users - Array de usuarios (con delivery_locations).
 * @param {Function} setData - Función para actualizar data (user_id, delivery_location_id).
 * @returns {Object} Estados, handler y options para UserInfo.
 */
export const useUserManagement = (data, users, setData) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [deliveryLocations, setDeliveryLocations] = useState([]);

    // userOptions: Memo para Select (igual que en componente)
    const userOptions = useMemo(() => mapToSelectOptions(users, 'id', 'name'), [users]);

    // handleUserChange: Setea user_id, actualiza locations, resetea delivery_id
    const handleUserChange = (selectedOption) => {
        setSelectedUser(selectedOption);
        setData('user_id', selectedOption ? selectedOption.value : null);
        
        if (selectedOption) {
            const selectedUserData = users.find(user => user.id === selectedOption.value);
            setDeliveryLocations(selectedUserData ? selectedUserData.delivery_locations : []);
        } else {
            setDeliveryLocations([]);
        }
        
        setData('delivery_location_id', null); // Resetea location al cambiar user
    };

    // useEffect: Inicializa delivery locations y default al cambiar data.user_id
    useEffect(() => {
        if (data.user_id && users.length > 0) {
            const selectedUserData = users.find(user => user.id === data.user_id);
            if (selectedUserData) {
                const userLocations = selectedUserData.delivery_locations || [];
                setDeliveryLocations(userLocations);

                const defaultLocation = userLocations.find(loc => loc.is_default);
                if (defaultLocation) {
                    setData('delivery_location_id', defaultLocation.id);
                } else if (userLocations.length > 0) {
                    setData('delivery_location_id', userLocations[0].id);
                } else {
                    setData('delivery_location_id', null);
                }
            }
        } else {
            setDeliveryLocations([]);
            setData('delivery_location_id', null);
        }
    }, [data.user_id, users, setData]);

    // useEffect: Sincroniza selectedUser con data.user_id (para edit/load)
    useEffect(() => {
        if (data.user_id && userOptions.length > 0) {
            const user = userOptions.find(option => option.value === data.user_id);
            if (user && user !== selectedUser) {
                setSelectedUser(user);
            }
        } else if (!data.user_id && selectedUser) {
            setSelectedUser(null);
        }
    }, [data.user_id, userOptions, selectedUser]);

    return {
        selectedUser,
        setSelectedUser, // Opcional, si UserInfo lo necesita
        deliveryLocations,
        handleUserChange,
        userOptions, // Computado aquí para consistencia
    };
};