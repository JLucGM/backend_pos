import React, { useEffect, useState } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';
import { Button } from '@/Components/ui/button';
import { Link, usePage, router } from '@inertiajs/react';
import { toast } from 'sonner';

const LoginComponent = ({
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
    const [loginUrl, setLoginUrl] = useState('');
    const [registerUrl, setRegisterUrl] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const containerStyles = {
        ...getStyles(comp),
        backgroundColor: styles.backgroundColor || '#ffffff',
        padding: styles.padding || '32px',
        borderRadius: styles.borderRadius || '12px',
        maxWidth: styles.maxWidth || '400px',
        margin: styles.margin || '0 auto',
    };

    // Función para obtener la ruta de login correcta
const getLoginRoute = () => {
    const hostname = window.location.hostname;
    
    if (hostname.endsWith(sessionDomain)) {
        const subdomain = hostname.split('.')[0];
        return route('frontend.login.store', { subdomain });
    }
    
    const domain = hostname;
    return route('frontend.login.store.custom', { domain });
};

    // Función para obtener la ruta de registro correcta
    const getRegisterRoute = () => {
        const hostname = window.location.hostname;
        
        // Si estamos en un subdominio (ej: tienda.pos.test)
        if (hostname.endsWith(sessionDomain)) {
            const subdomain = hostname.split('.')[0];
            return route('frontend.register', { subdomain });
        }
        
        // Si estamos en un dominio personalizado (ej: mitienda.com)
        const domain = hostname;
        return route('frontend.register.custom', { domain });
    };

    useEffect(() => {
    if (mode === 'frontend') {
        try {
            const hostname = window.location.hostname;
            console.log('Current hostname:', hostname);
            console.log('Session domain:', sessionDomain);
            
            const logRoute = getLoginRoute();
            const regRoute = getRegisterRoute();
            setLoginUrl(logRoute);
            setRegisterUrl(regRoute);
            
            console.log('Generated Login URL:', logRoute);
            console.log('Generated Register URL:', regRoute);
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

        try {
            console.log('Submitting to login URL:', loginUrl);
            console.log('Current loginUrl state:', loginUrl);
            
            // Verificar si loginUrl es válido
            if (!loginUrl) {
                toast.error('Error: URL de login no configurada');
                setIsLoading(false);
                return;
            }
            
            router.post(loginUrl, {
                email: formData.email,
                password: formData.password,
                remember: formData.remember
            }, {
                onSuccess: () => {
                    toast.success('¡Inicio de sesión exitoso!');
                    router.reload();
                },
                onError: (errors) => {
                    console.error('Login errors:', errors);
                    setErrors(errors);
                    if (errors.email) {
                        toast.error(errors.email);
                    } else if (errors.password) {
                        toast.error(errors.password);
                    } else {
                        toast.error('Error al iniciar sesión');
                    }
                },
                onFinish: () => {
                    setIsLoading(false);
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Error al procesar la solicitud');
            setIsLoading(false);
        }
    }
};

    const titleStyles = {
        fontSize: styles.titleSize || '28px',
        color: styles.titleColor || '#000000',
        fontFamily: themeSettings?.heading_font,
        marginBottom: '8px',
        textAlign: 'center'
    };

    const subtitleStyles = {
        fontSize: styles.subtitleSize || '16px',
        color: styles.subtitleColor || '#666666',
        fontFamily: themeSettings?.body_font,
        marginBottom: '24px',
        textAlign: 'center'
    };

    const labelStyles = {
        color: styles.labelColor || '#374151',
        fontFamily: themeSettings?.body_font,
        marginBottom: '8px'
    };

    const inputStyles = {
        borderColor: styles.inputBorderColor || '#d1d5db',
        borderRadius: styles.inputBorderRadius || '8px',
        fontFamily: themeSettings?.body_font,
    };

    const buttonStyles = {
        backgroundColor: styles.buttonBackgroundColor || '#3b82f6',
        color: styles.buttonColor || '#ffffff',
        borderRadius: styles.buttonBorderRadius || '8px',
        fontFamily: themeSettings?.button_font_family || 'inherit',
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
                        {content.title || 'Iniciar Sesión'}
                    </h2>
                    {content.subtitle && (
                        <p style={subtitleStyles}>
                            {content.subtitle}
                        </p>
                    )}
                </div>

                {content.showEmail !== false && (
                    <div>
                        <Label htmlFor="email" style={labelStyles}>Email</Label>
                        <Input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            required={mode === 'frontend'}
                            style={inputStyles}
                            disabled={isInputDisabled}
                            placeholder="ejemplo@correo.com"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-600 mt-1">{errors.email}</p>
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
                            required={mode === 'frontend'}
                            style={inputStyles}
                            disabled={isInputDisabled}
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                        )}
                    </div>
                )}

                <div className="flex justify-between items-center">
                    {content.showRemember && (
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                checked={formData.remember}
                                onCheckedChange={(checked) => handleChange('remember', checked)}
                                disabled={isInputDisabled}
                            />
                            <Label
                                htmlFor="remember"
                                className="text-sm"
                                style={labelStyles}
                            >
                                {content.rememberText || 'Recordarme'}
                            </Label>
                        </div>
                    )}

                    {/* {content.showForgotPassword && mode === 'frontend' && (
                        <Link
                            href={route('frontend.password.request')}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            {content.forgotPasswordText || '¿Olvidaste tu contraseña?'}
                        </Link>
                    )} */}
                </div>

                {mode === 'frontend' ? (
                    <Button
                        type="submit"
                        style={buttonStyles}
                        disabled={isLoading}
                        className="hover:opacity-90 transition-opacity"
                    >
                        {isLoading ? 'Procesando...' : (content.buttonText || 'Iniciar Sesión')}
                    </Button>
                ) : (
                    <div style={buttonStyles} className="py-2 px-4 text-center rounded">
                        {content.buttonText || 'Iniciar Sesión'}
                    </div>
                )}

                {content.showRegisterLink && mode === 'frontend' && registerUrl && (
                    <div className="text-center pt-4 border-t">
                        <p className="text-sm" style={{ color: styles.subtitleColor || '#666666' }}>
                            {content.registerText || '¿No tienes una cuenta? '}
                            <Link
                                href={content.registerUrl || registerUrl}
                                className="font-medium text-blue-600 hover:text-blue-800"
                            >
                                Regístrate
                            </Link>
                        </p>
                    </div>
                )}

                {/* Para modo builder, mostrar texto estático */}
                {content.showRegisterLink && mode === 'builder' && !isPreview && (
                    <div className="text-center pt-4 border-t">
                        <p className="text-sm" style={{ color: styles.subtitleColor || '#666666' }}>
                            {content.registerText || '¿No tienes una cuenta?'}
                        </p>
                    </div>
                )}
            </form>
        </div>
    );
};

export default LoginComponent;