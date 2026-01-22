import React, { useState, useEffect, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Badge } from '@/Components/ui/badge';
import { toast } from 'sonner';
import { User, MapPin, Plus, Edit, Trash2, Phone, Mail, CreditCard } from 'lucide-react';
import Select from 'react-select';
import { customStyles } from '@/hooks/custom-select';
import { mapToSelectOptions } from '@/utils/mapToSelectOptions';

export default function ProfileComponent({ 
    comp, 
    themeSettings, 
    isPreview = false, 
    currentUser = null,
    userDeliveryLocations = [],
    userGiftCards = [],
    mode = 'builder',
    countries = [],
    states = [],
    cities = []
}) {
    const [profileData, setProfileData] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        current_password: '',
        password: '',
        password_confirmation: ''
    });

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [addressData, setAddressData] = useState({
        address_line_1: '',
        address_line_2: '',
        postal_code: '',
        phone_number: '',
        notes: '',
        is_default: false,
        country_id: null,
        state_id: null,
        city_id: null
    });

    const [filteredStates, setFilteredStates] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);

    // Opciones para los selects
    const countryOptions = useMemo(() => mapToSelectOptions(countries, 'id', 'country_name'), [countries]);
    const stateOptions = useMemo(() => mapToSelectOptions(filteredStates, 'id', 'state_name'), [filteredStates]);
    const cityOptions = useMemo(() => mapToSelectOptions(filteredCities, 'id', 'city_name'), [filteredCities]);

    const styles = comp?.styles || {};
    const content = comp?.content || {};

    // Efectos para filtrar estados y ciudades
    useEffect(() => {
        if (addressData.country_id) {
            const statesForCountry = states.filter(state => state.country_id === addressData.country_id);
            setFilteredStates(statesForCountry);

            if (!statesForCountry.some(state => state.id === addressData.state_id)) {
                setAddressData(prev => ({ ...prev, state_id: null, city_id: null }));
            }
        } else {
            setFilteredStates([]);
            setAddressData(prev => ({ ...prev, state_id: null, city_id: null }));
        }
    }, [addressData.country_id, states]);

    useEffect(() => {
        if (addressData.state_id) {
            const citiesForState = cities.filter(city => city.state_id === addressData.state_id);
            setFilteredCities(citiesForState);

            if (!citiesForState.some(city => city.id === addressData.city_id)) {
                setAddressData(prev => ({ ...prev, city_id: null }));
            }
        } else {
            setFilteredCities([]);
            setAddressData(prev => ({ ...prev, city_id: null }));
        }
    }, [addressData.state_id, cities]);

    // Aplicar estilos del tema
    const containerStyles = {
        backgroundColor: styles.backgroundColor || themeSettings?.background || '#ffffff',
        padding: `${styles.paddingTop || '40px'} ${styles.paddingRight || '20px'} ${styles.paddingBottom || '40px'} ${styles.paddingLeft || '20px'}`,
        maxWidth: styles.maxWidth || '1200px',
        margin: '0 auto',
        borderRadius: styles.borderRadius || '0px',
    };

    const titleStyles = {
        color: styles.titleColor || themeSettings?.foreground || '#000000',
        fontSize: styles.titleSize || '32px',
        fontWeight: styles.titleWeight || 'bold',
        marginBottom: '24px',
        textAlign: styles.titleAlignment || 'left'
    };

    const cardStyles = {
        backgroundColor: styles.cardBackgroundColor || '#ffffff',
        borderRadius: styles.cardBorderRadius || '12px',
        border: styles.cardBorder || '1px solid #e5e7eb',
        padding: styles.cardPadding || '24px'
    };

    // Si no hay usuario autenticado y estamos en preview
    if (!currentUser && isPreview) {
        return (
            <div style={containerStyles} className="text-center">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <User className="mx-auto h-12 w-12 text-yellow-600 mb-4" />
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                        {content.loginRequiredTitle || 'Inicia sesión para ver tu perfil'}
                    </h3>
                    <p className="text-yellow-700 mb-4">
                        {content.loginRequiredMessage || 'Necesitas iniciar sesión para acceder a tu perfil y gestionar tus datos.'}
                    </p>
                    <Button 
                        onClick={() => router.visit('/iniciar-sesion')}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {content.loginButtonText || 'Iniciar Sesión'}
                    </Button>
                </div>
            </div>
        );
    }

    // Modo builder - mostrar vista de ejemplo respetando el layoutType
    if (mode === 'builder') {
        const layoutType = content.layoutType || 'tabs';
        
        // Componentes de ejemplo para el builder
        const exampleProfileSection = (
            <Card style={cardStyles}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {content.personalInfoTitle || 'Información Personal'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Nombre completo</Label>
                            <Input value="Usuario Ejemplo" disabled />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input value="usuario@ejemplo.com" disabled />
                        </div>
                        <div>
                            <Label>Teléfono</Label>
                            <Input value="+1 234 567 8900" disabled />
                        </div>
                    </div>
                    <Button variant="outline" disabled>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Información
                    </Button>
                </CardContent>
            </Card>
        );

        const exampleAddressesSection = (
            <Card style={cardStyles}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {content.addressesTitle || 'Direcciones de Envío'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant="secondary">Principal</Badge>
                                <Button variant="ghost" size="sm" disabled>
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-sm font-medium">Calle Principal 123</p>
                            <p className="text-sm text-gray-600">Apartamento 4B</p>
                            <p className="text-sm text-gray-600">Ciudad, Estado 12345</p>
                            <p className="text-sm text-gray-600">+1 234 567 8900</p>
                        </div>
                    </div>
                    <Button variant="outline" className="mt-4" disabled>
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Nueva Dirección
                    </Button>
                </CardContent>
            </Card>
        );

        const exampleGiftCardsSection = (
            <Card style={cardStyles}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        {content.giftCardsTitle || 'Mis Gift Cards'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline">Gift Card</Badge>
                                <CreditCard className="h-5 w-5 text-blue-600" />
                            </div>
                            <p className="text-lg font-mono font-bold text-gray-800 mb-2">
                                GIFT-123456
                            </p>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Saldo disponible:</span>
                                    <span className="font-semibold text-green-600">$75.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Expira:</span>
                                    <span className="text-gray-800">31/12/2024</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );

        return (
            <div style={containerStyles}>
                <h1 style={titleStyles}>
                    {content.title || 'Mi Perfil'}
                </h1>
                
                {layoutType === 'grid' ? (
                    // Grid Layout - Todo visible a la vez
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Información Personal - ocupa 2 columnas */}
                            <div className="lg:col-span-2">
                                {exampleProfileSection}
                            </div>

                            {/* Resumen - ocupa 1 columna */}
                            <div>
                                <Card style={cardStyles}>
                                    <CardHeader>
                                        <CardTitle>Resumen</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Direcciones</span>
                                            <Badge>2</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Gift Cards</span>
                                            <Badge>1</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Pedidos</span>
                                            <Badge>5</Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Direcciones de Envío - ancho completo */}
                        {exampleAddressesSection}

                        {/* Gift Cards - ancho completo */}
                        {exampleGiftCardsSection}
                    </div>
                ) : (
                    // Tabs Layout - Contenido organizado en pestañas
                    <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="profile">Perfil</TabsTrigger>
                            <TabsTrigger value="addresses">Direcciones</TabsTrigger>
                            <TabsTrigger value="giftcards">Gift Cards</TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile" className="space-y-6">
                            {exampleProfileSection}
                        </TabsContent>

                        <TabsContent value="addresses" className="space-y-6">
                            {exampleAddressesSection}
                        </TabsContent>

                        <TabsContent value="giftcards" className="space-y-6">
                            {exampleGiftCardsSection}
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        );
    }

    // Funciones para manejar el perfil
    const handleProfileUpdate = (e) => {
        e.preventDefault();
        
        router.put('/profile', profileData, {
            onSuccess: () => {
                toast.success('Perfil actualizado correctamente');
                setIsEditingProfile(false);
                setProfileData(prev => ({
                    ...prev,
                    current_password: '',
                    password: '',
                    password_confirmation: ''
                }));
            },
            onError: (errors) => {
                Object.keys(errors).forEach(key => {
                    toast.error(errors[key]);
                });
            }
        });
    };

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        
        const url = editingAddress ? `/profile/addresses/${editingAddress.id}` : '/profile/addresses';
        const method = editingAddress ? 'put' : 'post';
        
        router[method](url, addressData, {
            onSuccess: () => {
                toast.success(editingAddress ? 'Dirección actualizada' : 'Dirección agregada');
                setIsAddingAddress(false);
                setEditingAddress(null);
                resetAddressForm();
            },
            onError: (errors) => {
                Object.keys(errors).forEach(key => {
                    toast.error(errors[key]);
                });
            }
        });
    };

    const handleDeleteAddress = (addressId) => {
        if (confirm('¿Estás seguro de eliminar esta dirección?')) {
            router.delete(`/profile/addresses/${addressId}`, {
                onSuccess: () => {
                    toast.success('Dirección eliminada');
                },
                onError: () => {
                    toast.error('Error al eliminar la dirección');
                }
            });
        }
    };

    const resetAddressForm = () => {
        setAddressData({
            address_line_1: '',
            address_line_2: '',
            postal_code: '',
            phone_number: '',
            notes: '',
            is_default: false,
            country_id: null,
            state_id: null,
            city_id: null
        });
    };

    const startEditAddress = (address) => {
        setEditingAddress(address);
        setAddressData({
            address_line_1: address.address_line_1 || '',
            address_line_2: address.address_line_2 || '',
            postal_code: address.postal_code || '',
            phone_number: address.phone_number || '',
            notes: address.notes || '',
            is_default: address.is_default || false,
            country_id: address.country_id || null,
            state_id: address.state_id || null,
            city_id: address.city_id || null
        });
        setIsAddingAddress(true);
    };

    // Determinar el tipo de layout
    const layoutType = content.layoutType || 'tabs';

    // Renderizar contenido según el tipo de layout
    const renderProfileContent = () => {
        const profileSection = (
            <Card style={cardStyles}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {content.personalInfoTitle || 'Información Personal'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isEditingProfile ? (
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Nombre completo</Label>
                                    <Input
                                        id="name"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData(prev => ({...prev, name: e.target.value}))}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData(prev => ({...prev, email: e.target.value}))}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <Input
                                        id="phone"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData(prev => ({...prev, phone: e.target.value}))}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="current_password">Contraseña actual</Label>
                                    <Input
                                        id="current_password"
                                        type="password"
                                        value={profileData.current_password}
                                        onChange={(e) => setProfileData(prev => ({...prev, current_password: e.target.value}))}
                                        placeholder="Solo si quieres cambiar contraseña"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="password">Nueva contraseña</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={profileData.password}
                                        onChange={(e) => setProfileData(prev => ({...prev, password: e.target.value}))}
                                        placeholder="Solo si quieres cambiar contraseña"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="password_confirmation">Confirmar nueva contraseña</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={profileData.password_confirmation}
                                        onChange={(e) => setProfileData(prev => ({...prev, password_confirmation: e.target.value}))}
                                        placeholder="Solo si quieres cambiar contraseña"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit">Guardar Cambios</Button>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => setIsEditingProfile(false)}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Nombre completo</Label>
                                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <span>{currentUser?.name}</span>
                                    </div>
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                        <Mail className="h-4 w-4 text-gray-500" />
                                        <span>{currentUser?.email}</span>
                                    </div>
                                </div>
                                <div>
                                    <Label>Teléfono</Label>
                                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        <span>{currentUser?.phone || 'No especificado'}</span>
                                    </div>
                                </div>
                            </div>
                            <Button onClick={() => setIsEditingProfile(true)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar Información
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        );

        const addressesSection = (
            <Card style={cardStyles}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            {content.addressesTitle || 'Direcciones de Envío'}
                        </CardTitle>
                        <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
                            <DialogTrigger asChild>
                                <Button onClick={() => {
                                    setEditingAddress(null);
                                    resetAddressForm();
                                }}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar Dirección
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingAddress ? 'Editar Dirección' : 'Nueva Dirección'}
                                    </DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddressSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="address_line_1">Dirección principal *</Label>
                                            <Input
                                                id="address_line_1"
                                                value={addressData.address_line_1}
                                                onChange={(e) => setAddressData(prev => ({...prev, address_line_1: e.target.value}))}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="address_line_2">Dirección secundaria</Label>
                                            <Input
                                                id="address_line_2"
                                                value={addressData.address_line_2}
                                                onChange={(e) => setAddressData(prev => ({...prev, address_line_2: e.target.value}))}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="postal_code">Código postal</Label>
                                            <Input
                                                id="postal_code"
                                                value={addressData.postal_code}
                                                onChange={(e) => setAddressData(prev => ({...prev, postal_code: e.target.value}))}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone_number">Teléfono</Label>
                                            <Input
                                                id="phone_number"
                                                value={addressData.phone_number}
                                                onChange={(e) => setAddressData(prev => ({...prev, phone_number: e.target.value}))}
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* País, Estado, Ciudad */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="country_id">País</Label>
                                            <Select
                                                name="country_id"
                                                id="country_id"
                                                options={countryOptions}
                                                value={countryOptions.find(option => option.value === addressData.country_id)}
                                                onChange={(selectedOption) => setAddressData(prev => ({...prev, country_id: selectedOption?.value || null}))}
                                                styles={customStyles}
                                                isClearable
                                                placeholder="Seleccionar país"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="state_id">Estado</Label>
                                            <Select
                                                name="state_id"
                                                id="state_id"
                                                options={stateOptions}
                                                value={stateOptions.find(option => option.value === addressData.state_id)}
                                                onChange={(selectedOption) => setAddressData(prev => ({...prev, state_id: selectedOption?.value || null}))}
                                                styles={customStyles}
                                                isClearable
                                                placeholder="Seleccionar estado"
                                                isDisabled={!addressData.country_id}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="city_id">Ciudad</Label>
                                            <Select
                                                name="city_id"
                                                id="city_id"
                                                options={cityOptions}
                                                value={cityOptions.find(option => option.value === addressData.city_id)}
                                                onChange={(selectedOption) => setAddressData(prev => ({...prev, city_id: selectedOption?.value || null}))}
                                                styles={customStyles}
                                                isClearable
                                                placeholder="Seleccionar ciudad"
                                                isDisabled={!addressData.state_id}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="notes">Notas adicionales</Label>
                                        <Input
                                            id="notes"
                                            value={addressData.notes}
                                            onChange={(e) => setAddressData(prev => ({...prev, notes: e.target.value}))}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="is_default"
                                            checked={addressData.is_default}
                                            onChange={(e) => setAddressData(prev => ({...prev, is_default: e.target.checked}))}
                                        />
                                        <Label htmlFor="is_default">Establecer como dirección principal</Label>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button type="submit">
                                            {editingAddress ? 'Actualizar' : 'Agregar'}
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={() => setIsAddingAddress(false)}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    {userDeliveryLocations.length === 0 ? (
                        <div className="text-center py-8">
                            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-gray-600">No tienes direcciones guardadas</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {userDeliveryLocations.map((address) => (
                                <div key={address.id} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        {address.is_default && (
                                            <Badge variant="secondary">Principal</Badge>
                                        )}
                                        <div className="flex gap-1">
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => startEditAddress(address)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => handleDeleteAddress(address.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium">{address.address_line_1}</p>
                                    {address.address_line_2 && (
                                        <p className="text-sm text-gray-600">{address.address_line_2}</p>
                                    )}
                                    <p className="text-sm text-gray-600">{address.full_address}</p>
                                    {address.phone_number && (
                                        <p className="text-sm text-gray-600">{address.phone_number}</p>
                                    )}
                                    {address.notes && (
                                        <p className="text-sm text-gray-500 italic">{address.notes}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        );

        const giftCardsSection = (
            <Card style={cardStyles}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        {content.giftCardsTitle || 'Mis Gift Cards'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {userGiftCards.length === 0 ? (
                        <div className="text-center py-8">
                            <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-gray-600">No tienes gift cards disponibles</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {userGiftCards.map((giftCard) => (
                                <div key={giftCard.id} className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge variant="outline">Gift Card</Badge>
                                        <CreditCard className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <p className="text-lg font-mono font-bold text-gray-800 mb-2">
                                        {giftCard.code}
                                    </p>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Saldo disponible:</span>
                                            <span className="font-semibold text-green-600">
                                                ${giftCard.current_balance}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Saldo inicial:</span>
                                            <span className="text-gray-800">
                                                ${giftCard.initial_balance}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Expira:</span>
                                            <span className="text-gray-800">
                                                {new Date(giftCard.expiration_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        );

        // Renderizar según el tipo de layout
        if (layoutType === 'grid') {
            return (
                <div className="space-y-6">
                    {/* Grid Layout - Todo visible a la vez */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Información Personal - ocupa 2 columnas */}
                        <div className="lg:col-span-2">
                            {profileSection}
                        </div>

                        {/* Resumen - ocupa 1 columna */}
                        <div>
                            <Card style={cardStyles}>
                                <CardHeader>
                                    <CardTitle>Resumen</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Direcciones</span>
                                        <Badge>{userDeliveryLocations.length}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Gift Cards</span>
                                        <Badge>{userGiftCards.length}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Pedidos</span>
                                        <Badge>0</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Direcciones de Envío - ancho completo */}
                    {addressesSection}

                    {/* Gift Cards - ancho completo */}
                    {giftCardsSection}
                </div>
            );
        } else {
            // Tabs Layout - Contenido organizado en pestañas
            return (
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="profile">Perfil</TabsTrigger>
                        <TabsTrigger value="addresses">Direcciones</TabsTrigger>
                        <TabsTrigger value="giftcards">Gift Cards</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-6">
                        {profileSection}
                    </TabsContent>

                    <TabsContent value="addresses" className="space-y-6">
                        {addressesSection}
                    </TabsContent>

                    <TabsContent value="giftcards" className="space-y-6">
                        {giftCardsSection}
                    </TabsContent>
                </Tabs>
            );
        }
    };

    return (
        <div style={containerStyles}>
            <h1 style={titleStyles}>
                {content.title || 'Mi Perfil'}
            </h1>
            
            {renderProfileContent()}
        </div>
    );
}