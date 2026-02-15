import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { router } from '@inertiajs/react';
import { getThemeWithDefaults, getComponentStyles, getResolvedFont, getButtonStyles, getInputStyles } from '@/utils/themeUtils';

const CheckoutAuthModalComponent = ({ onClose, companyId, onSuccess, themeSettings, appliedTheme }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);
    const themeAuthStyles = getComponentStyles(themeWithDefaults, 'auth', appliedTheme);
    const themeInputStyles = getInputStyles(themeWithDefaults);
    const primaryButtonStyles = getButtonStyles(themeWithDefaults, 'primary', appliedTheme);
    const secondaryButtonStyles = getButtonStyles(themeWithDefaults, 'secondary', appliedTheme);

    // Función para obtener la URL de login basada en el hostname actual
    const getLoginUrl = () => {
        if (typeof window === 'undefined') return '';

        const hostname = window.location.hostname;

        if (hostname.includes('.pos.test') && hostname.split('.').length > 2) {
            const subdomain = hostname.split('.')[0];
            return route('frontend.login.store', { subdomain });
        }

        const domain = hostname;
        return route('frontend.login.store.custom', { domain });
    };

    // Función para obtener la URL de registro basada en el hostname actual
    const getRegisterUrl = () => {
        if (typeof window === 'undefined') return '';

        const hostname = window.location.hostname;

        if (hostname.includes('.pos.test') && hostname.split('.').length > 2) {
            const subdomain = hostname.split('.')[0];
            return route('frontend.register.store', { subdomain });
        }

        const domain = hostname;
        return route('frontend.register.store.custom', { domain });
    };

    // Formulario de login
    const loginForm = useForm({
        email: '',
        password: '',
        remember: false,
        company_id: companyId,
    });

    // Formulario de registro
    const registerForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        terms: false,
        company_id: companyId,
    });

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            const loginUrl = getLoginUrl();

            router.post(loginUrl, {
                email: loginForm.data.email,
                password: loginForm.data.password,
                remember: loginForm.data.remember,
                company_id: companyId,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    onSuccess?.();
                    onClose?.();
                    window.location.reload();
                },
                onError: (errors) => {
                    setErrors(errors);
                },
                onFinish: () => {
                    setIsLoading(false);
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            setErrors({ general: 'Error al iniciar sesión. Intenta nuevamente.' });
            setIsLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            const registerUrl = getRegisterUrl();

            router.post(registerUrl, {
                name: registerForm.data.name,
                email: registerForm.data.email,
                password: registerForm.data.password,
                password_confirmation: registerForm.data.password_confirmation,
                phone: registerForm.data.phone,
                terms: registerForm.data.terms,
                company_id: companyId,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    onSuccess?.();
                    onClose?.();
                    window.location.reload();
                },
                onError: (errors) => {
                    setErrors(errors);
                },
                onFinish: () => {
                    setIsLoading(false);
                }
            });
        } catch (error) {
            console.error('Register error:', error);
            setErrors({ general: 'Error al registrar. Intenta nuevamente.' });
            setIsLoading(false);
        }
    };

    // Helper para añadir unidad (px) si es solo número
    const withUnit = (value, unit = 'px') => {
        if (value === undefined || value === null || value === '') return undefined;
        if (typeof value === 'string' && isNaN(Number(value))) return value;
        return `${value}${unit}`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
                className="rounded-lg p-6 max-w-md w-full mx-auto max-h-[90vh] overflow-y-auto"
                style={{
                    backgroundColor: themeAuthStyles.backgroundColor || themeWithDefaults.background,
                    fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                    color: themeWithDefaults.text,
                }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2
                        className="text-xl font-semibold"
                        style={{
                            color: themeWithDefaults.heading,
                            fontFamily: getResolvedFont(themeWithDefaults, 'heading_font', appliedTheme),
                        }}
                    >
                        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="hover:opacity-70 transition-colors"
                        style={{ color: themeWithDefaults.text }}
                        disabled={isLoading}
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Mostrar errores generales */}
                {errors.general && (
                    <div className="mb-4 p-3 rounded-md" style={{
                        backgroundColor: themeWithDefaults.danger_color + '20', // 20% opacidad
                        border: `1px solid ${themeWithDefaults.danger_color}`,
                        color: themeWithDefaults.danger_color,
                    }}>
                        <p className="text-sm">{errors.general}</p>
                    </div>
                )}

                {isLogin ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: themeWithDefaults.text }}>
                                Email *
                            </label>
                            <input
                                type="email"
                                value={loginForm.data.email}
                                onChange={(e) => loginForm.setData('email', e.target.value)}
                                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                                style={{
                                    ...themeInputStyles,
                                    fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                                    borderColor: errors.email ? themeWithDefaults.danger_color : themeInputStyles.borderColor,
                                }}
                                required
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm" style={{ color: themeWithDefaults.danger_color }}>{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: themeWithDefaults.text }}>
                                Contraseña *
                            </label>
                            <input
                                type="password"
                                value={loginForm.data.password}
                                onChange={(e) => loginForm.setData('password', e.target.value)}
                                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                                style={{
                                    ...themeInputStyles,
                                    fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                                    borderColor: errors.password ? themeWithDefaults.danger_color : themeInputStyles.borderColor,
                                }}
                                required
                                disabled={isLoading}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm" style={{ color: themeWithDefaults.danger_color }}>{errors.password}</p>
                            )}
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={loginForm.data.remember}
                                onChange={(e) => loginForm.setData('remember', e.target.checked)}
                                className="h-4 w-4 rounded focus:ring-2"
                                style={{
                                    accentColor: themeWithDefaults.primary_color,
                                }}
                                disabled={isLoading}
                            />
                            <label htmlFor="remember" className="ml-2 text-sm" style={{ color: themeWithDefaults.text }}>
                                Recordar sesión
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2.5 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                ...primaryButtonStyles,
                                fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                            }}
                        >
                            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: themeWithDefaults.text }}>
                                Nombre completo *
                            </label>
                            <input
                                type="text"
                                value={registerForm.data.name}
                                onChange={(e) => registerForm.setData('name', e.target.value)}
                                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                                style={{
                                    ...themeInputStyles,
                                    fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                                    borderColor: errors.name ? themeWithDefaults.danger_color : themeInputStyles.borderColor,
                                }}
                                required
                                disabled={isLoading}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm" style={{ color: themeWithDefaults.danger_color }}>{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: themeWithDefaults.text }}>
                                Email *
                            </label>
                            <input
                                type="email"
                                value={registerForm.data.email}
                                onChange={(e) => registerForm.setData('email', e.target.value)}
                                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                                style={{
                                    ...themeInputStyles,
                                    fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                                    borderColor: errors.email ? themeWithDefaults.danger_color : themeInputStyles.borderColor,
                                }}
                                required
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm" style={{ color: themeWithDefaults.danger_color }}>{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: themeWithDefaults.text }}>
                                Teléfono *
                            </label>
                            <input
                                type="tel"
                                value={registerForm.data.phone}
                                onChange={(e) => registerForm.setData('phone', e.target.value)}
                                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                                style={{
                                    ...themeInputStyles,
                                    fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                                    borderColor: errors.phone ? themeWithDefaults.danger_color : themeInputStyles.borderColor,
                                }}
                                required
                                disabled={isLoading}
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm" style={{ color: themeWithDefaults.danger_color }}>{errors.phone}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: themeWithDefaults.text }}>
                                Contraseña *
                            </label>
                            <input
                                type="password"
                                value={registerForm.data.password}
                                onChange={(e) => registerForm.setData('password', e.target.value)}
                                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                                style={{
                                    ...themeInputStyles,
                                    fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                                    borderColor: errors.password ? themeWithDefaults.danger_color : themeInputStyles.borderColor,
                                }}
                                required
                                disabled={isLoading}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm" style={{ color: themeWithDefaults.danger_color }}>{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: themeWithDefaults.text }}>
                                Confirmar contraseña *
                            </label>
                            <input
                                type="password"
                                value={registerForm.data.password_confirmation}
                                onChange={(e) => registerForm.setData('password_confirmation', e.target.value)}
                                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                                style={{
                                    ...themeInputStyles,
                                    fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                                    borderColor: errors.password_confirmation ? themeWithDefaults.danger_color : themeInputStyles.borderColor,
                                }}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={registerForm.data.terms}
                                onChange={(e) => registerForm.setData('terms', e.target.checked)}
                                className="h-4 w-4 rounded focus:ring-2"
                                style={{
                                    accentColor: themeWithDefaults.primary_color,
                                }}
                                required
                                disabled={isLoading}
                            />
                            <label htmlFor="terms" className="ml-2 text-sm" style={{ color: themeWithDefaults.text }}>
                                Acepto los términos y condiciones
                            </label>
                        </div>
                        {errors.terms && (
                            <p className="mt-1 text-sm" style={{ color: themeWithDefaults.danger_color }}>{errors.terms}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2.5 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                ...secondaryButtonStyles,
                                fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                            }}
                        >
                            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                        </button>
                    </form>
                )}

                <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${themeWithDefaults.borders}` }}>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        disabled={isLoading}
                        className="w-full text-center transition-colors disabled:opacity-50"
                        style={{
                            color: themeWithDefaults.links,
                            fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                        }}
                    >
                        {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión aquí'}
                    </button>
                </div>

                <div className="mt-4">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-full text-center transition-colors disabled:opacity-50"
                        style={{
                            color: themeWithDefaults.text,
                            fontFamily: getResolvedFont(themeWithDefaults, 'body_font', appliedTheme),
                        }}
                    >
                        Continuar como invitado
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutAuthModalComponent;