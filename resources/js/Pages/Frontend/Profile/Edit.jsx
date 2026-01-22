import React from 'react';
import { Head } from '@inertiajs/react';
import ProfileComponent from '@/Components/BuilderPages/Profile/ProfileComponent';

export default function Edit({ user, deliveryLocations, companyName }) {
    // Simular el componente como si fuera parte del builder
    const mockComponent = {
        id: 'profile-page',
        type: 'profile',
        content: {
            title: 'Mi Perfil',
            personalInfoTitle: 'Información Personal',
            addressesTitle: 'Direcciones de Envío',
            giftCardsTitle: 'Mis Gift Cards',
            loginRequiredTitle: 'Inicia sesión para ver tu perfil',
            loginRequiredMessage: 'Necesitas iniciar sesión para acceder a tu perfil y gestionar tus datos.',
            loginButtonText: 'Iniciar Sesión'
        },
        styles: {
            backgroundColor: '#ffffff',
            paddingTop: '40px',
            paddingRight: '20px',
            paddingBottom: '40px',
            paddingLeft: '20px',
            maxWidth: '1200px',
            borderRadius: '0px',
            titleColor: '#000000',
            titleSize: '32px',
            titleWeight: 'bold',
            titleAlignment: 'left',
            cardBackgroundColor: '#ffffff',
            cardBorderRadius: '12px',
            cardBorder: '1px solid #e5e7eb',
            cardPadding: '24px'
        }
    };

    // Formatear direcciones de entrega
    const formattedDeliveryLocations = deliveryLocations.map(location => ({
        id: location.id,
        address_line_1: location.address_line_1,
        address_line_2: location.address_line_2,
        postal_code: location.postal_code,
        phone_number: location.phone_number,
        notes: location.notes,
        is_default: location.is_default,
        country: location.country?.country_name || null,
        state: location.state?.state_name || null,
        city: location.city?.city_name || null,
        full_address: [
            location.address_line_1,
            location.address_line_2,
            location.city?.city_name,
            location.state?.state_name,
            location.country?.country_name,
            location.postal_code
        ].filter(Boolean).join(', ')
    }));

    return (
        <>
            <Head title={`Perfil - ${companyName}`} />
            
            <div className="min-h-screen bg-gray-50">
                <ProfileComponent
                    comp={mockComponent}
                    themeSettings={{}}
                    isPreview={true}
                    currentUser={user}
                    userDeliveryLocations={formattedDeliveryLocations}
                    userGiftCards={[]} // Por ahora vacío, se puede agregar después
                    mode="frontend"
                />
            </div>
        </>
    );
}