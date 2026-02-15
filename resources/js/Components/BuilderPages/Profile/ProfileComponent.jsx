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
import { getThemeWithDefaults, getComponentStyles, getResolvedFont, resolveStyleValue } from '@/utils/themeUtils';
import { User, MapPin, Plus, Edit, Trash2, Phone, Mail, CreditCard } from 'lucide-react';
import Select from 'react-select';
import { customStyles } from '@/hooks/custom-select';
import { mapToSelectOptions } from '@/utils/mapToSelectOptions';

// Helper para añadir unidad (px) si es solo número
const withUnit = (value, unit = 'px') => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'string' && isNaN(Number(value))) return value;
    return `${value}${unit}`;
};

export default function ProfileComponent({
    comp,
    themeSettings,
    appliedTheme,
    isPreview = false,
    currentUser = null,
    userDeliveryLocations = [],
    userGiftCards = [],
    mode = 'builder',
    countries = [],
    states = [],
    cities = []
}) {
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    // ===========================================
    // FUNCIÓN PARA RESOLVER REFERENCIAS
    // ===========================================
    const resolveValue = (value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    };

    // Resolver estilos personalizados del componente
    const rawStyles = comp?.styles || {};
    const styles = {};
    Object.keys(rawStyles).forEach(key => {
        styles[key] = resolveValue(rawStyles[key]);
    });

    // Resolver contenido del componente
    const rawContent = comp?.content || {};
    const content = {};
    Object.keys(rawContent).forEach(key => {
        content[key] = resolveValue(rawContent[key]);
    });

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

    // Aplicar estilos del tema
    const themeProfileStyles = getComponentStyles(themeWithDefaults, 'profile', appliedTheme);
    const themeProfileCardStyles = getComponentStyles(themeWithDefaults, 'profile-card', appliedTheme);

    // 1. Contenedor principal que usa el fondo del tema (sin fallback de objeto)
    const outerContainerStyles = {
        width: '100%',
        minHeight: mode === 'frontend' ? '100vh' : 'auto',
        backgroundColor: resolveValue(themeWithDefaults.background),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: mode === 'frontend' ? 'flex-start' : 'center',
        padding: mode === 'frontend' ? '20px' : '0',
    };

    // 2. Contenedor interno del perfil
    const containerStyles = {
        backgroundColor: resolveValue(styles.backgroundColor || themeProfileStyles.backgroundColor || themeWithDefaults.background),
        paddingTop: withUnit(styles.paddingTop || '40px'),
        paddingRight: withUnit(styles.paddingRight || '20px'),
        paddingBottom: withUnit(styles.paddingBottom || '40px'),
        paddingLeft: withUnit(styles.paddingLeft || '20px'),
        maxWidth: withUnit(styles.maxWidth || '1200px', styles.maxWidthUnit || (styles.maxWidth?.toString().includes('%') ? '%' : 'px')),
        width: '100%',
        margin: '0 auto',
        borderRadius: withUnit(styles.borderRadius || '0px'),
        minHeight: mode === 'frontend' ? 'auto' : '100%',
    };

    const titleStyles = {
        color: resolveValue(styles.titleColor || themeWithDefaults.heading),
        fontSize: withUnit(styles.titleSize || '32px', styles.titleSizeUnit || 'px'),
        fontWeight: styles.titleWeight || 'bold',
        marginBottom: '24px',
        textAlign: styles.titleAlignment || 'left',
        fontFamily: getResolvedFont(themeWithDefaults, 'heading_font', appliedTheme),
    };

    const cardStyles = {
        backgroundColor: resolveValue(styles.cardBackgroundColor || themeProfileCardStyles.backgroundColor || themeWithDefaults.background),
        borderRadius: withUnit(styles.cardBorderRadius || '12px'),
        border: resolveValue(styles.cardBorder || `1px solid ${themeWithDefaults.borders}`),
        padding: withUnit(styles.cardPadding || '24px')
    };

    // Estilos para etiquetas
    const labelStyles = {
        color: resolveValue(themeWithDefaults.text),
        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
        marginBottom: '8px'
    };

    // Estilos para inputs
    const inputStyles = {
        borderColor: resolveValue(themeWithDefaults.input_border),
        borderRadius: withUnit(resolveValue(themeWithDefaults.input_corner_radius) || '6px'),
        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
        color: resolveValue(themeWithDefaults.text),
        backgroundColor: resolveValue(themeWithDefaults.input_background),
    };

    // Estilos para botones primarios
    const primaryButtonStyles = {
        backgroundColor: resolveValue(themeWithDefaults.primary_button_background),
        color: resolveValue(themeWithDefaults.primary_button_text),
        borderRadius: withUnit(resolveValue(themeWithDefaults.primary_button_corner_radius) || '8px'),
        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
    };

    // Estilos para botones secundarios/outline
    const outlineButtonStyles = {
        borderColor: resolveValue(themeWithDefaults.borders),
        color: resolveValue(themeWithDefaults.text),
        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
    };

    // Efectos para filtrar estados y ciudades (sin cambios)
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

    // Si no hay usuario autenticado y estamos en preview
    if (!currentUser && isPreview) {
        return (
            <div style={outerContainerStyles}>
                <div style={containerStyles} className="text-center">
                    <div style={{
                        backgroundColor: resolveValue(themeWithDefaults.background),
                        border: `1px solid ${resolveValue(themeWithDefaults.borders)}`,
                        borderRadius: '12px',
                        padding: '40px',
                        maxWidth: '500px',
                        width: '100%',
                    }}>
                        <User className="mx-auto h-12 w-12" style={{ color: resolveValue(themeWithDefaults.heading) }} />
                        <h3 style={{
                            color: resolveValue(themeWithDefaults.heading),
                            fontSize: '24px',
                            fontWeight: 'bold',
                            marginBottom: '8px',
                            fontFamily: getResolvedFont(themeWithDefaults, 'heading_font', appliedTheme),
                        }}>
                            {content.loginRequiredTitle || 'Inicia sesión para ver tu perfil'}
                        </h3>
                        <p style={{
                            color: resolveValue(themeWithDefaults.text),
                            marginBottom: '16px',
                            fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                        }}>
                            {content.loginRequiredMessage || 'Necesitas iniciar sesión para acceder a tu perfil y gestionar tus datos.'}
                        </p>
                        <Button
                            onClick={() => router.visit('/iniciar-sesion')}
                            style={primaryButtonStyles}
                        >
                            {content.loginButtonText || 'Iniciar Sesión'}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Modo builder - mostrar vista de ejemplo respetando el layoutType
    if (mode === 'builder') {
        const layoutType = content.layoutType || 'tabs';

        // Componentes de ejemplo para el builder (todos con estilos resueltos)
        const exampleProfileSection = (
            <Card style={cardStyles}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2" style={{ color: resolveValue(themeWithDefaults.heading) }}>
                        <User className="h-5 w-5" />
                        {content.personalInfoTitle || 'Información Personal'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label style={labelStyles}>Nombre completo</Label>
                            <Input value="Usuario Ejemplo" disabled style={inputStyles} />
                        </div>
                        <div>
                            <Label style={labelStyles}>Email</Label>
                            <Input value="usuario@ejemplo.com" disabled style={inputStyles} />
                        </div>
                        <div>
                            <Label style={labelStyles}>Teléfono</Label>
                            <Input value="+1 234 567 8900" disabled style={inputStyles} />
                        </div>
                    </div>
                    <Button variant="outline" disabled style={outlineButtonStyles}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Información
                    </Button>
                </CardContent>
            </Card>
        );

        const exampleAddressesSection = (
            <Card style={cardStyles}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2" style={{ color: resolveValue(themeWithDefaults.heading) }}>
                        <MapPin className="h-5 w-5" />
                        {content.addressesTitle || 'Direcciones de Envío'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4" style={{
                            borderColor: resolveValue(themeWithDefaults.borders),
                            backgroundColor: resolveValue(themeWithDefaults.background)
                        }}>
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant="secondary">Principal</Badge>
                                <Button variant="ghost" size="sm" disabled style={{ color: resolveValue(themeWithDefaults.text) }}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-sm font-medium" style={{ color: resolveValue(themeWithDefaults.text) }}>Calle Principal 123</p>
                            <p className="text-sm" style={{ color: resolveValue(themeWithDefaults.text) }}>Apartamento 4B</p>
                            <p className="text-sm" style={{ color: resolveValue(themeWithDefaults.text) }}>Ciudad, Estado 12345</p>
                            <p className="text-sm" style={{ color: resolveValue(themeWithDefaults.text) }}>+1 234 567 8900</p>
                        </div>
                    </div>
                    <Button variant="outline" className="mt-4" disabled style={outlineButtonStyles}>
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Nueva Dirección
                    </Button>
                </CardContent>
            </Card>
        );

        const exampleGiftCardsSection = (
            <Card style={cardStyles}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2" style={{ color: resolveValue(themeWithDefaults.heading) }}>
                        <CreditCard className="h-5 w-5" />
                        {content.giftCardsTitle || 'Mis Gift Cards'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4" style={{
                            borderColor: resolveValue(themeWithDefaults.borders),
                            backgroundColor: resolveValue(themeWithDefaults.background),
                            background: `linear-gradient(135deg, ${resolveValue(themeWithDefaults.primary_button_background)}20, ${resolveValue(themeWithDefaults.secondary_button_background)}20)`
                        }}>
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline">Gift Card</Badge>
                                <CreditCard className="h-5 w-5" style={{ color: resolveValue(themeWithDefaults.primary_button_background) }} />
                            </div>
                            <p className="text-lg font-mono font-bold mb-2" style={{ color: resolveValue(themeWithDefaults.heading) }}>
                                GIFT-123456
                            </p>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span style={{ color: resolveValue(themeWithDefaults.text) }}>Saldo disponible:</span>
                                    <span className="font-semibold" style={{ color: resolveValue(themeWithDefaults.primary_button_background) }}>$75.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span style={{ color: resolveValue(themeWithDefaults.text) }}>Expira:</span>
                                    <span style={{ color: resolveValue(themeWithDefaults.text) }}>31/12/2024</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );

        return (
            <div style={outerContainerStyles}>
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
                                            <CardTitle style={{ color: resolveValue(themeWithDefaults.heading) }}>Resumen</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm" style={{ color: resolveValue(themeWithDefaults.text) }}>Direcciones</span>
                                                <Badge>2</Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm" style={{ color: resolveValue(themeWithDefaults.text) }}>Gift Cards</span>
                                                <Badge>1</Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm" style={{ color: resolveValue(themeWithDefaults.text) }}>Pedidos</span>
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
                            <TabsList className="grid w-full grid-cols-3" style={{
                                backgroundColor: resolveValue(themeWithDefaults.background),
                                borderBottom: `1px solid ${resolveValue(themeWithDefaults.borders)}`
                            }}>
                                <TabsTrigger value="profile" style={{ color: resolveValue(themeWithDefaults.text) }}>Perfil</TabsTrigger>
                                <TabsTrigger value="addresses" style={{ color: resolveValue(themeWithDefaults.text) }}>Direcciones</TabsTrigger>
                                <TabsTrigger value="giftcards" style={{ color: resolveValue(themeWithDefaults.text) }}>Gift Cards</TabsTrigger>
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
            </div>
        );
    }

    // Funciones para manejar el perfil (sin cambios)
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

    // Renderizar contenido según el tipo de layout (todo con estilos resueltos)
    const renderProfileContent = () => {
        const profileSection = (
            <Card style={cardStyles}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2" style={{ color: resolveValue(themeWithDefaults.heading) }}>
                        <User className="h-5 w-5" />
                        {content.personalInfoTitle || 'Información Personal'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isEditingProfile ? (
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name" style={labelStyles}>Nombre completo</Label>
                                    <Input
                                        id="name"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                                        required
                                        style={inputStyles}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email" style={labelStyles}>Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                                        required
                                        style={inputStyles}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone" style={labelStyles}>Teléfono</Label>
                                    <Input
                                        id="phone"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                                        style={inputStyles}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="current_password" style={labelStyles}>Contraseña actual</Label>
                                    <Input
                                        id="current_password"
                                        type="password"
                                        value={profileData.current_password}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, current_password: e.target.value }))}
                                        placeholder="Solo si quieres cambiar contraseña"
                                        style={inputStyles}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="password" style={labelStyles}>Nueva contraseña</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={profileData.password}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, password: e.target.value }))}
                                        placeholder="Solo si quieres cambiar contraseña"
                                        style={inputStyles}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="password_confirmation" style={labelStyles}>Confirmar nueva contraseña</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={profileData.password_confirmation}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, password_confirmation: e.target.value }))}
                                        placeholder="Solo si quieres cambiar contraseña"
                                        style={inputStyles}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" style={primaryButtonStyles}>
                                    Guardar Cambios
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditingProfile(false)}
                                    style={outlineButtonStyles}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label style={labelStyles}>Nombre completo</Label>
                                    <div className="flex items-center gap-2 p-2 rounded" style={{
                                        backgroundColor: `${resolveValue(themeWithDefaults.background)}50`,
                                        color: resolveValue(themeWithDefaults.text)
                                    }}>
                                        <User className="h-4 w-4" />
                                        <span>{currentUser?.name}</span>
                                    </div>
                                </div>
                                <div>
                                    <Label style={labelStyles}>Email</Label>
                                    <div className="flex items-center gap-2 p-2 rounded" style={{
                                        backgroundColor: `${resolveValue(themeWithDefaults.background)}50`,
                                        color: resolveValue(themeWithDefaults.text)
                                    }}>
                                        <Mail className="h-4 w-4" />
                                        <span>{currentUser?.email}</span>
                                    </div>
                                </div>
                                <div>
                                    <Label style={labelStyles}>Teléfono</Label>
                                    <div className="flex items-center gap-2 p-2 rounded" style={{
                                        backgroundColor: `${resolveValue(themeWithDefaults.background)}50`,
                                        color: resolveValue(themeWithDefaults.text)
                                    }}>
                                        <Phone className="h-4 w-4" />
                                        <span>{currentUser?.phone || 'No especificado'}</span>
                                    </div>
                                </div>
                            </div>
                            <Button onClick={() => setIsEditingProfile(true)} style={primaryButtonStyles}>
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
                        <CardTitle className="flex items-center gap-2" style={{ color: resolveValue(themeWithDefaults.heading) }}>
                            <MapPin className="h-5 w-5" />
                            {content.addressesTitle || 'Direcciones de Envío'}
                        </CardTitle>
                        <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
                            <DialogTrigger asChild>
                                <Button onClick={() => {
                                    setEditingAddress(null);
                                    resetAddressForm();
                                }} style={primaryButtonStyles}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar Dirección
                                </Button>
                            </DialogTrigger>
                            <DialogContent style={{
                                backgroundColor: resolveValue(themeWithDefaults.background),
                                borderColor: resolveValue(themeWithDefaults.borders),
                            }}>
                                <DialogHeader>
                                    <DialogTitle style={{ color: resolveValue(themeWithDefaults.heading) }}>
                                        {editingAddress ? 'Editar Dirección' : 'Nueva Dirección'}
                                    </DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddressSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="address_line_1" style={labelStyles}>Dirección principal *</Label>
                                            <Input
                                                id="address_line_1"
                                                value={addressData.address_line_1}
                                                onChange={(e) => setAddressData(prev => ({ ...prev, address_line_1: e.target.value }))}
                                                required
                                                style={inputStyles}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="address_line_2" style={labelStyles}>Dirección secundaria</Label>
                                            <Input
                                                id="address_line_2"
                                                value={addressData.address_line_2}
                                                onChange={(e) => setAddressData(prev => ({ ...prev, address_line_2: e.target.value }))}
                                                style={inputStyles}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="postal_code" style={labelStyles}>Código postal</Label>
                                            <Input
                                                id="postal_code"
                                                value={addressData.postal_code}
                                                onChange={(e) => setAddressData(prev => ({ ...prev, postal_code: e.target.value }))}
                                                style={inputStyles}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone_number" style={labelStyles}>Teléfono</Label>
                                            <Input
                                                id="phone_number"
                                                value={addressData.phone_number}
                                                onChange={(e) => setAddressData(prev => ({ ...prev, phone_number: e.target.value }))}
                                                style={inputStyles}
                                            />
                                        </div>
                                    </div>

                                    {/* País, Estado, Ciudad */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="country_id" style={labelStyles}>País</Label>
                                            <Select
                                                name="country_id"
                                                id="country_id"
                                                options={countryOptions}
                                                value={countryOptions.find(option => option.value === addressData.country_id)}
                                                onChange={(selectedOption) => setAddressData(prev => ({ ...prev, country_id: selectedOption?.value || null }))}
                                                styles={{
                                                    ...customStyles,
                                                    control: (base) => ({
                                                        ...base,
                                                        borderColor: resolveValue(themeWithDefaults.input_border),
                                                        backgroundColor: resolveValue(themeWithDefaults.input_background),
                                                    }),
                                                    menu: (base) => ({
                                                        ...base,
                                                        backgroundColor: resolveValue(themeWithDefaults.background),
                                                    }),
                                                    option: (base, { isFocused }) => ({
                                                        ...base,
                                                        backgroundColor: isFocused ? `${resolveValue(themeWithDefaults.primary_button_background)}20` : 'transparent',
                                                        color: resolveValue(themeWithDefaults.text),
                                                    }),
                                                    singleValue: (base) => ({
                                                        ...base,
                                                        color: resolveValue(themeWithDefaults.text),
                                                    }),
                                                    input: (base) => ({
                                                        ...base,
                                                        color: resolveValue(themeWithDefaults.text),
                                                    }),
                                                }}
                                                isClearable
                                                placeholder="Seleccionar país"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="state_id" style={labelStyles}>Estado</Label>
                                            <Select
                                                name="state_id"
                                                id="state_id"
                                                options={stateOptions}
                                                value={stateOptions.find(option => option.value === addressData.state_id)}
                                                onChange={(selectedOption) => setAddressData(prev => ({ ...prev, state_id: selectedOption?.value || null }))}
                                                styles={{
                                                    ...customStyles,
                                                    control: (base) => ({
                                                        ...base,
                                                        borderColor: resolveValue(themeWithDefaults.input_border),
                                                        backgroundColor: resolveValue(themeWithDefaults.input_background),
                                                    }),
                                                    menu: (base) => ({
                                                        ...base,
                                                        backgroundColor: resolveValue(themeWithDefaults.background),
                                                    }),
                                                    option: (base, { isFocused }) => ({
                                                        ...base,
                                                        backgroundColor: isFocused ? `${resolveValue(themeWithDefaults.primary_button_background)}20` : 'transparent',
                                                        color: resolveValue(themeWithDefaults.text),
                                                    }),
                                                    singleValue: (base) => ({
                                                        ...base,
                                                        color: resolveValue(themeWithDefaults.text),
                                                    }),
                                                    input: (base) => ({
                                                        ...base,
                                                        color: resolveValue(themeWithDefaults.text),
                                                    }),
                                                }}
                                                isClearable
                                                placeholder="Seleccionar estado"
                                                isDisabled={!addressData.country_id}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="city_id" style={labelStyles}>Ciudad</Label>
                                            <Select
                                                name="city_id"
                                                id="city_id"
                                                options={cityOptions}
                                                value={cityOptions.find(option => option.value === addressData.city_id)}
                                                onChange={(selectedOption) => setAddressData(prev => ({ ...prev, city_id: selectedOption?.value || null }))}
                                                styles={{
                                                    ...customStyles,
                                                    control: (base) => ({
                                                        ...base,
                                                        borderColor: resolveValue(themeWithDefaults.input_border),
                                                        backgroundColor: resolveValue(themeWithDefaults.input_background),
                                                    }),
                                                    menu: (base) => ({
                                                        ...base,
                                                        backgroundColor: resolveValue(themeWithDefaults.background),
                                                    }),
                                                    option: (base, { isFocused }) => ({
                                                        ...base,
                                                        backgroundColor: isFocused ? `${resolveValue(themeWithDefaults.primary_button_background)}20` : 'transparent',
                                                        color: resolveValue(themeWithDefaults.text),
                                                    }),
                                                    singleValue: (base) => ({
                                                        ...base,
                                                        color: resolveValue(themeWithDefaults.text),
                                                    }),
                                                    input: (base) => ({
                                                        ...base,
                                                        color: resolveValue(themeWithDefaults.text),
                                                    }),
                                                }}
                                                isClearable
                                                placeholder="Seleccionar ciudad"
                                                isDisabled={!addressData.state_id}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="notes" style={labelStyles}>Notas adicionales</Label>
                                        <Input
                                            id="notes"
                                            value={addressData.notes}
                                            onChange={(e) => setAddressData(prev => ({ ...prev, notes: e.target.value }))}
                                            style={inputStyles}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="is_default"
                                            checked={addressData.is_default}
                                            onChange={(e) => setAddressData(prev => ({ ...prev, is_default: e.target.checked }))}
                                            style={{ accentColor: resolveValue(themeWithDefaults.primary_button_background) }}
                                        />
                                        <Label htmlFor="is_default" style={labelStyles}>Establecer como dirección principal</Label>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button type="submit" style={primaryButtonStyles}>
                                            {editingAddress ? 'Actualizar' : 'Agregar'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsAddingAddress(false)}
                                            style={outlineButtonStyles}
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
                            <MapPin className="mx-auto h-12 w-12" style={{ color: `${resolveValue(themeWithDefaults.text)}50` }} />
                            <p style={{ color: resolveValue(themeWithDefaults.text) }}>No tienes direcciones guardadas</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {userDeliveryLocations.map((address) => (
                                <div key={address.id} className="border rounded-lg p-4" style={{
                                    borderColor: resolveValue(themeWithDefaults.borders),
                                    backgroundColor: resolveValue(themeWithDefaults.background)
                                }}>
                                    <div className="flex items-center justify-between mb-2">
                                        {address.is_default && (
                                            <Badge variant="secondary">Principal</Badge>
                                        )}
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => startEditAddress(address)}
                                                style={{ color: resolveValue(themeWithDefaults.text) }}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteAddress(address.id)}
                                                style={{ color: resolveValue(themeWithDefaults.text) }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium" style={{ color: resolveValue(themeWithDefaults.text) }}>{address.address_line_1}</p>
                                    {address.address_line_2 && (
                                        <p className="text-sm" style={{ color: resolveValue(themeWithDefaults.text) }}>{address.address_line_2}</p>
                                    )}
                                    <p className="text-sm" style={{ color: resolveValue(themeWithDefaults.text) }}>{address.full_address}</p>
                                    {address.phone_number && (
                                        <p className="text-sm" style={{ color: resolveValue(themeWithDefaults.text) }}>{address.phone_number}</p>
                                    )}
                                    {address.notes && (
                                        <p className="text-sm italic" style={{ color: `${resolveValue(themeWithDefaults.text)}80` }}>{address.notes}</p>
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
                    <CardTitle className="flex items-center gap-2" style={{ color: resolveValue(themeWithDefaults.heading) }}>
                        <CreditCard className="h-5 w-5" />
                        {content.giftCardsTitle || 'Mis Gift Cards'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {userGiftCards.length === 0 ? (
                        <div className="text-center py-8">
                            <CreditCard className="mx-auto h-12 w-12" style={{ color: `${resolveValue(themeWithDefaults.text)}50` }} />
                            <p style={{ color: resolveValue(themeWithDefaults.text) }}>No tienes gift cards disponibles</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {userGiftCards.map((giftCard) => (
                                <div key={giftCard.id} className="border rounded-lg p-4" style={{
                                    borderColor: resolveValue(themeWithDefaults.borders),
                                    backgroundColor: resolveValue(themeWithDefaults.background),
                                    background: `linear-gradient(135deg, ${resolveValue(themeWithDefaults.primary_button_background)}20, ${resolveValue(themeWithDefaults.secondary_button_background)}20)`
                                }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge variant="outline">Gift Card</Badge>
                                        <CreditCard className="h-5 w-5" style={{ color: resolveValue(themeWithDefaults.primary_button_background) }} />
                                    </div>
                                    <p className="text-lg font-mono font-bold mb-2" style={{ color: resolveValue(themeWithDefaults.heading) }}>
                                        {giftCard.code}
                                    </p>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span style={{ color: resolveValue(themeWithDefaults.text) }}>Saldo disponible:</span>
                                            <span className="font-semibold" style={{ color: resolveValue(themeWithDefaults.primary_button_background) }}>
                                                ${giftCard.current_balance}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span style={{ color: resolveValue(themeWithDefaults.text) }}>Saldo inicial:</span>
                                            <span style={{ color: resolveValue(themeWithDefaults.text) }}>
                                                ${giftCard.initial_balance}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span style={{ color: resolveValue(themeWithDefaults.text) }}>Expira:</span>
                                            <span style={{ color: resolveValue(themeWithDefaults.text) }}>
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

        if (layoutType === 'grid') {
            return (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            {profileSection}
                        </div>
                        <div>
                            <Card style={cardStyles}>
                                <CardHeader>
                                    <CardTitle style={{ color: resolveValue(themeWithDefaults.heading) }}>Resumen</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm" style={{ color: resolveValue(themeWithDefaults.text) }}>Direcciones</span>
                                        <Badge>{userDeliveryLocations.length}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm" style={{ color: resolveValue(themeWithDefaults.text) }}>Gift Cards</span>
                                        <Badge>{userGiftCards.length}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm" style={{ color: resolveValue(themeWithDefaults.text) }}>Pedidos</span>
                                        <Badge>0</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    {addressesSection}
                    {giftCardsSection}
                </div>
            );
        } else {
            return (
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-3" style={{
                        backgroundColor: resolveValue(themeWithDefaults.background),
                        borderBottom: `1px solid ${resolveValue(themeWithDefaults.borders)}`
                    }}>
                        <TabsTrigger value="profile" style={{ color: resolveValue(themeWithDefaults.text) }}>Perfil</TabsTrigger>
                        <TabsTrigger value="addresses" style={{ color: resolveValue(themeWithDefaults.text) }}>Direcciones</TabsTrigger>
                        <TabsTrigger value="giftcards" style={{ color: resolveValue(themeWithDefaults.text) }}>Gift Cards</TabsTrigger>
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
        <div style={outerContainerStyles}>
            <div style={containerStyles}>
                <h1 style={titleStyles}>
                    {content.title || 'Mi Perfil'}
                </h1>

                {renderProfileContent()}
            </div>
        </div>
    );
}