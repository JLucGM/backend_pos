import React, { useEffect, useState } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';
import { Button } from '@/Components/ui/button';
import { Link, usePage, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { getThemeWithDefaults, getComponentStyles, hslToCss, getResolvedFont } from '@/utils/themeUtils';

const RegisterComponent = ({
    comp,
    getStyles,
    onEdit,
    onDelete,
    themeSettings,
    isPreview,
    hoveredComponentId,
    setHoveredComponentId,
    mode = 'builder' // 'builder' o 'frontend'
}) => {
    const { props } = usePage();
    const sessionDomain = props.env.SESSION_DOMAIN || '.pos.test';
    const styles = comp.styles || {};
    const content = comp.content || {};
    const themeWithDefaults = getThemeWithDefaults(themeSettings);
    const themeAuthStyles = getComponentStyles(themeWithDefaults, 'auth');
    const themeAuthTitleStyles = getComponentStyles(themeWithDefaults, 'auth-title');
    const themeAuthSubtitleStyles = getComponentStyles(themeWithDefaults, 'auth-subtitle');
    
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

    const containerStyles = {
        ...getStyles(comp),
        backgroundColor: styles.backgroundColor || themeAuthStyles.backgroundColor,
        padding: styles.padding || '32px',
        borderRadius: styles.borderRadius || '12px',
        maxWidth: styles.maxWidth || '400px',
        margin: styles.margin || '0 auto',
    };

    // Función para obtener la ruta de registro correcta
    const getRegisterRoute = () => {
        const hostname = window.location.hostname;
        
        // Si estamos en un subdominio (ej: tienda.pos.test)
        if (hostname.endsWith(sessionDomain)) {
            const subdomain = hostname.split('.')[0];
            return route('frontend.register.store', { subdomain });
        }
        
        // Si estamos en un dominio personalizado (ej: mitienda.com)
        const domain = hostname;
        return route('frontend.register.store.custom', { domain });
    };

    // Función para obtener la ruta de login correcta
    const getLoginRoute = () => {
        const hostname = window.location.hostname;
        
        // Si estamos en un subdominio (ej: tienda.pos.test)
        if (hostname.endsWith(sessionDomain)) {
            const subdomain = hostname.split('.')[0];
            return route('frontend.login', { subdomain });
        }
        
        // Si estamos en un dominio personalizado (ej: mitienda.com)
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
                
                console.log('Register URL:', regRoute);
                console.log('Login URL:', logRoute);
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
        // Limpiar error al cambiar
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (mode === 'frontend') {
            setIsLoading(true);
            setErrors({});

            // Validaciones básicas
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
                
                console.log('Registering for company ID:', companyId);
                console.log('Posting to URL:', registerUrl);
                
                // Usar router.post con la URL generada
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

    const titleStyles = {
        fontSize: styles.titleSize || themeAuthTitleStyles.fontSize,
        color: styles.titleColor || themeAuthTitleStyles.color,
        fontFamily: getResolvedFont(themeWithDefaults, 'heading_font'),
        marginBottom: '8px',
        textAlign: 'center'
    };

    const subtitleStyles = {
        fontSize: styles.subtitleSize || themeAuthSubtitleStyles.fontSize,
        color: styles.subtitleColor || themeAuthSubtitleStyles.color,
        fontFamily: getResolvedFont(themeWithDefaults, 'body_font'),
        marginBottom: '24px',
        textAlign: 'center'
    };

    const labelStyles = {
        color: styles.labelColor || hslToCss(themeWithDefaults.text),
        fontFamily: getResolvedFont(themeWithDefaults, 'body_font'),
        marginBottom: '8px'
    };

    const inputStyles = {
        borderColor: styles.inputBorderColor || hslToCss(themeWithDefaults.input_border),
        borderRadius: styles.inputBorderRadius || themeWithDefaults.input_corner_radius,
        fontFamily: getResolvedFont(themeWithDefaults, 'body_font'),
    };

    const buttonStyles = {
        backgroundColor: styles.buttonBackgroundColor || hslToCss(themeWithDefaults.primary_button_background),
        color: styles.buttonColor || hslToCss(themeWithDefaults.primary_button_text),
        borderRadius: styles.buttonBorderRadius || themeWithDefaults.primary_button_corner_radius,
        fontFamily: getResolvedFont(themeWithDefaults, 'body_font'),
        width: '100%'
    };

    // Determinar si los inputs deben estar deshabilitados
    const isInputDisabled = mode === 'frontend' ? isLoading : (isPreview || isLoading);

    return (
        <div
            style={containerStyles}
            onClick={handleClick}
            className={mode === 'builder' && !isPreview ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        >
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
                        <p className="text-sm" style={{ color: styles.subtitleColor || '#666666' }}>
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
                        <p className="text-sm" style={{ color: styles.subtitleColor || '#666666' }}>
                            {content.loginText || '¿Ya tienes una cuenta? Inicia sesión'}
                        </p>
                    </div>
                )}
            </form>
        </div>
    );
};

export default RegisterComponent;