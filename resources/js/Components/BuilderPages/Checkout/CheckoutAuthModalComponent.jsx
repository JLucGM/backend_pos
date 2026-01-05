import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { router } from '@inertiajs/react';

const CheckoutAuthModalComponent = ({ onClose, companyId, onSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Función para obtener la URL de login basada en el hostname actual
    const getLoginUrl = () => {
        if (typeof window === 'undefined') return '';
        
        const hostname = window.location.hostname;
        
        // Si estamos en un subdominio (ej: tienda.pos.test)
        if (hostname.includes('.pos.test') && hostname.split('.').length > 2) {
            const subdomain = hostname.split('.')[0];
            return route('frontend.login.store', { subdomain });
        }
        
        // Para dominio personalizado
        const domain = hostname;
        return route('frontend.login.store.custom', { domain });
    };

    // Función para obtener la URL de registro basada en el hostname actual
    const getRegisterUrl = () => {
        if (typeof window === 'undefined') return '';
        
        const hostname = window.location.hostname;
        
        // Si estamos en un subdominio (ej: tienda.pos.test)
        if (hostname.includes('.pos.test') && hostname.split('.').length > 2) {
            const subdomain = hostname.split('.')[0];
            return route('frontend.register.store', { subdomain });
        }
        
        // Para dominio personalizado
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
        company_id: companyId,
    });

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        
        try {
            const loginUrl = getLoginUrl();
            
            await router.post(loginUrl, {
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
            
            await router.post(registerUrl, {
                name: registerForm.data.name,
                email: registerForm.data.email,
                password: registerForm.data.password,
                password_confirmation: registerForm.data.password_confirmation,
                phone: registerForm.data.phone,
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        disabled={isLoading}
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Mostrar errores generales */}
                {errors.general && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-700 text-sm">{errors.general}</p>
                    </div>
                )}

                {isLogin ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                value={loginForm.data.email}
                                onChange={(e) => loginForm.setData('email', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña *
                            </label>
                            <input
                                type="password"
                                value={loginForm.data.password}
                                onChange={(e) => loginForm.setData('password', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={isLoading}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>
                        
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={loginForm.data.remember}
                                onChange={(e) => loginForm.setData('remember', e.target.checked)}
                                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                disabled={isLoading}
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                                Recordar sesión
                            </label>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre completo *
                            </label>
                            <input
                                type="text"
                                value={registerForm.data.name}
                                onChange={(e) => registerForm.setData('name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={isLoading}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                value={registerForm.data.email}
                                onChange={(e) => registerForm.setData('email', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Teléfono *
                            </label>
                            <input
                                type="tel"
                                value={registerForm.data.phone}
                                onChange={(e) => registerForm.setData('phone', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={isLoading}
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña *
                            </label>
                            <input
                                type="password"
                                value={registerForm.data.password}
                                onChange={(e) => registerForm.setData('password', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={isLoading}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirmar contraseña *
                            </label>
                            <input
                                type="password"
                                value={registerForm.data.password_confirmation}
                                onChange={(e) => registerForm.setData('password_confirmation', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-green-600 text-white py-2.5 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                        </button>
                    </form>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        disabled={isLoading}
                        className="w-full text-center text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
                    >
                        {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión aquí'}
                    </button>
                </div>

                <div className="mt-4">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-full text-center text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                    >
                        Continuar como invitado
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutAuthModalComponent;