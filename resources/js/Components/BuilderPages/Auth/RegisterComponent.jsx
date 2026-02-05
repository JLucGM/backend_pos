import React, { useEffect, useState } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';
import { Button } from '@/Components/ui/button';
import { Link, usePage, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { getThemeWithDefaults, getComponentStyles, getResolvedFont } from '@/utils/themeUtils';

// Helper para añadir unidad (px) si es solo número
const withUnit = (value, unit = 'px') => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'string' && isNaN(Number(value))) return value;
    return `${value}${unit}`;
};

const RegisterComponent = ({
    comp,
    getStyles,
    onEdit,
    onDelete,
    themeSettings,
    appliedTheme,
    isPreview,
    hoveredComponentId,
    setHoveredComponentId,
    mode = 'builder' // 'builder' o 'frontend'
}) => {
    const { props } = usePage();
    const sessionDomain = props.env.SESSION_DOMAIN || '.pos.test';
    const styles = comp.styles || {};
    const content = comp.content || {};
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);
    const themeAuthStyles = getComponentStyles(themeWithDefaults, 'auth', appliedTheme);

    const [registerUrl, setRegisterUrl] = useState('');
    const [loginUrl, setLoginUrl] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        terms: false
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // 1. Contenedor principal que usa el fondo del tema
    const outerContainerStyles = {
        width: '100%',
        minHeight: mode === 'frontend' ? '100vh' : 'auto',
        backgroundColor: themeWithDefaults.background || { h: 0, s: 0, l: 100 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: mode === 'frontend' ? '20px' : '0',
    };

    // 2. Contenedor de la tarjeta del formulario
    const containerStyles = {
        ...getStyles(comp),
        backgroundColor: themeWithDefaults.background || { h: 0, s: 0, l: 100 } || styles.backgroundColor || themeAuthStyles.backgroundColor,
        paddingTop: withUnit(styles.paddingTop || styles.padding || '32px'),
        paddingRight: withUnit(styles.paddingRight || styles.padding || '32px'),
        paddingBottom: withUnit(styles.paddingBottom || styles.padding || '32px'),
        paddingLeft: withUnit(styles.paddingLeft || styles.padding || '32px'),
        borderColor: styles.borderColor || themeWithDefaults.borders,
        borderWidth: withUnit(styles.borderWidth || '1px'),
        borderStyle: 'solid',
        borderRadius: withUnit(styles.borderRadius || '12px'),
        maxWidth: withUnit(styles.maxWidth || '400px', styles.maxWidthUnit || (styles.maxWidth?.toString().includes('%') ? '%' : 'px')),
        width: '100%',
        margin: styles.margin || '0',
        boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`,
    };

    // Función para obtener la ruta de registro correcta
    const getRegisterRoute = () => {
        const hostname = window.location.hostname;

        if (hostname.endsWith(sessionDomain)) {
            const subdomain = hostname.split('.')[0];
            return route('frontend.register.store', { subdomain });
        }

        const domain = hostname;
        return route('frontend.register.store.custom', { domain });
    };

    // Función para obtener la ruta de login correcta
    const getLoginRoute = () => {
        const hostname = window.location.hostname;

        if (hostname.endsWith(sessionDomain)) {
            const subdomain = hostname.split('.')[0];
            return route('frontend.login', { subdomain });
        }

        const domain = hostname;
        return route('frontend.login.custom', { domain });
    };

    useEffect(() => {
        if (mode === 'frontend') {
            try {
                const regRoute = getRegisterRoute();
                const logRoute = getLoginRoute();
                setRegisterUrl(regRoute);
                setLoginUrl(logRoute);
            } catch (error) {
                console.error('Error generating routes:', error);
                toast.error('Error de configuración de rutas');
            }
        }
    }, [mode]);

    // Solo permitir edición en modo builder (no en frontend o preview)
    const handleClick = () => {
        if (mode === 'builder' && !isPreview && onEdit) {
            onEdit(comp);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (mode === 'frontend') {
            setIsLoading(true);
            setErrors({});

            if (content.showPassword && content.showConfirmPassword &&
                formData.password !== formData.password_confirmation) {
                setErrors({ password_confirmation: 'Las contraseñas no coinciden' });
                setIsLoading(false);
                return;
            }

            if (content.showTerms && !formData.terms) {
                toast.error('Debes aceptar los términos y condiciones');
                setIsLoading(false);
                return;
            }

            try {
                const hostname = window.location.hostname;
                const companyId = props.companyId || props.page?.company_id;

                router.post(registerUrl, {
                    name: formData.name,
                    email: formData.email,
                    phone: content.showPhone ? formData.phone : undefined,
                    password: formData.password,
                    password_confirmation: formData.password_confirmation,
                    terms: content.showTerms ? formData.terms : undefined,
                    company_id: companyId,
                }, {
                    onSuccess: () => {
                        toast.success('¡Registro exitoso! Bienvenido');
                        router.reload();
                    },
                    onError: (errors) => {
                        setErrors(errors);
                        if (errors.email) {
                            toast.error(errors.email);
                        } else if (errors.password) {
                            toast.error(errors.password);
                        } else if (errors.name) {
                            toast.error(errors.name);
                        } else {
                            toast.error('Error al registrar la cuenta');
                        }
                    },
                    onFinish: () => {
                        setIsLoading(false);
                    }
                });
            } catch (error) {
                console.error('Register error:', error);
                toast.error('Error al procesar la solicitud');
                setIsLoading(false);
            }
        }
    };

    // CORRECCIÓN: Usar heading del tema para el título
    const titleStyles = {
        fontSize: withUnit(styles.titleSize || themeWithDefaults.heading1_fontSize || '28px', styles.titleSizeUnit || 'px'),
        color: styles.titleColor || themeWithDefaults.heading, // <-- Usa heading del tema
        fontFamily: getResolvedFont(themeWithDefaults, 'heading_font', appliedTheme),
        marginBottom: '8px',
        textAlign: 'center',
        fontWeight: 'bold'
    };

    // CORRECCIÓN: Usar text del tema para el subtítulo
    const subtitleStyles = {
        fontSize: withUnit(styles.subtitleSize || themeWithDefaults.paragraph_fontSize || '16px', styles.subtitleSizeUnit || 'px'),
        color: styles.subtitleColor || themeWithDefaults.text, // <-- Usa text del tema
        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
        marginBottom: '24px',
        textAlign: 'center'
    };

    // CORRECCIÓN: Usar text del tema para las etiquetas
    const labelStyles = {
        color: styles.labelColor || themeWithDefaults.text, // <-- Usa text del tema
        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
        marginBottom: '8px'
    };

    const inputStyles = {
        borderColor: styles.inputBorderColor || themeWithDefaults.input_border,
        borderRadius: withUnit(styles.inputBorderRadius || themeWithDefaults.input_corner_radius),
        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
        color: themeWithDefaults.text, // <-- Color del texto dentro del input
        backgroundColor: styles.inputBackgroundColor || themeWithDefaults.input_background,
    };

    const buttonStyles = {
        backgroundColor: styles.buttonBackgroundColor || themeWithDefaults.primary_button_background,
        color: styles.buttonColor || themeWithDefaults.primary_button_text,
        borderRadius: withUnit(styles.buttonBorderRadius || themeWithDefaults.primary_button_corner_radius),
        fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
        width: '100%'
    };

    // Determinar si los inputs deben estar deshabilitados
    const isInputDisabled = mode === 'frontend' ? isLoading : (isPreview || isLoading);

    return (
        <div
            style={outerContainerStyles}
            className={mode === 'builder' && !isPreview ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
            onClick={handleClick}
        >
            <div style={containerStyles}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <h2 style={titleStyles}>
                            {content.title || 'Crear Cuenta'}
                        </h2>
                        {content.subtitle && (
                            <p style={subtitleStyles}>
                                {content.subtitle}
                            </p>
                        )}
                    </div>

                    {content.showName !== false && (
                        <div>
                            <Label htmlFor="name" style={labelStyles}>Nombre completo</Label>
                            <Input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                required={mode === 'frontend' && content.showName}
                                style={inputStyles}
                                disabled={isInputDisabled}
                                placeholder="Tu nombre"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                            )}
                        </div>
                    )}

                    {content.showEmail !== false && (
                        <div>
                            <Label htmlFor="email" style={labelStyles}>Email</Label>
                            <Input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                required={mode === 'frontend' && content.showEmail}
                                style={inputStyles}
                                disabled={isInputDisabled}
                                placeholder="ejemplo@correo.com"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                            )}
                        </div>
                    )}

                    {content.showPhone && (
                        <div>
                            <Label htmlFor="phone" style={labelStyles}>Teléfono (opcional)</Label>
                            <Input
                                type="tel"
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                style={inputStyles}
                                disabled={isInputDisabled}
                                placeholder="+1234567890"
                            />
                            {errors.phone && (
                                <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                            )}
                        </div>
                    )}

                    {content.showPassword !== false && (
                        <div>
                            <Label htmlFor="password" style={labelStyles}>Contraseña</Label>
                            <Input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                required={mode === 'frontend' && content.showPassword}
                                style={inputStyles}
                                disabled={isInputDisabled}
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                            )}
                        </div>
                    )}

                    {content.showConfirmPassword !== false && (
                        <div>
                            <Label htmlFor="password_confirmation" style={labelStyles}>Confirmar Contraseña</Label>
                            <Input
                                type="password"
                                id="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={(e) => handleChange('password_confirmation', e.target.value)}
                                required={mode === 'frontend' && content.showConfirmPassword}
                                style={inputStyles}
                                disabled={isInputDisabled}
                                placeholder="••••••••"
                            />
                            {errors.password_confirmation && (
                                <p className="text-sm text-red-600 mt-1">{errors.password_confirmation}</p>
                            )}
                        </div>
                    )}

                    {content.showTerms && (
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="terms"
                                checked={formData.terms}
                                onCheckedChange={(checked) => handleChange('terms', checked)}
                                disabled={isInputDisabled}
                                required={mode === 'frontend' && content.showTerms}
                            />
                            <Label
                                htmlFor="terms"
                                className="text-sm"
                                style={labelStyles}
                            >
                                {content.termsText || 'Acepto los términos y condiciones'}
                            </Label>
                        </div>
                    )}

                    {mode === 'frontend' ? (
                        <Button
                            type="submit"
                            style={buttonStyles}
                            disabled={isLoading || (content.showTerms && !formData.terms)}
                            className="hover:opacity-90 transition-opacity"
                        >
                            {isLoading ? 'Procesando...' : (content.buttonText || 'Crear Cuenta')}
                        </Button>
                    ) : (
                        <div style={buttonStyles} className="py-2 px-4 text-center rounded">
                            {content.buttonText || 'Crear Cuenta'}
                        </div>
                    )}

                    {content.showLoginLink && mode === 'frontend' && loginUrl && (
                        <div className="text-center pt-4 border-t">
                            <p className="text-sm" style={{ color: styles.subtitleColor || themeWithDefaults.text }}>
                                {content.loginText || '¿Ya tienes una cuenta? '}
                                <Link
                                    href={content.loginUrl || loginUrl}
                                    className="font-medium text-blue-600 hover:text-blue-800"
                                >
                                    Inicia sesión
                                </Link>
                            </p>
                        </div>
                    )}

                    {/* Para modo builder, mostrar texto estático */}
                    {content.showLoginLink && mode === 'builder' && !isPreview && (
                        <div className="text-center pt-4 border-t">
                            <p className="text-sm" style={{ color: styles.subtitleColor || themeWithDefaults.text }}>
                                {content.loginText || '¿Ya tienes una cuenta? Inicia sesión'}
                            </p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default RegisterComponent;
