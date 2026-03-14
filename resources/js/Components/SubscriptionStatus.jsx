import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent } from '@/Components/ui/card';
import { AlertTriangle, Clock, CheckCircle, Crown } from 'lucide-react';
import { usePermission } from '@/hooks/usePermission';

export default function SubscriptionStatus({ company, currentSubscription }) {
    const { isSuperAdmin } = usePermission();

    // Si no hay empresa o el usuario es Super Admin, no mostrar nada
    if (!company || isSuperAdmin) return null;

    // Calcular días restantes
    const getDaysRemaining = () => {
        if (company.is_trial && company.trial_ends_at) {
            const trialEnd = new Date(company.trial_ends_at);
            const now = new Date();
            const diffTime = trialEnd - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return Math.max(0, diffDays);
        }
        
        if (currentSubscription && currentSubscription.ends_at) {
            const subscriptionEnd = new Date(currentSubscription.ends_at);
            const now = new Date();
            const diffTime = subscriptionEnd - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return Math.max(0, diffDays);
        }
        
        return 0;
    };

    const daysRemaining = getDaysRemaining();

    // Si está en período de prueba
    if (company.is_trial) {
        const isExpired = daysRemaining === 0;
        
        return (
            <Card className={`mb-6 ${isExpired ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'}`}>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            {isExpired ? (
                                <AlertTriangle className="h-6 w-6 text-red-500" />
                            ) : (
                                <Clock className="h-6 w-6 text-yellow-500" />
                            )}
                            <div>
                                <h3 className={`font-semibold ${isExpired ? 'text-red-900' : 'text-yellow-900'}`}>
                                    {isExpired ? 'Período de Prueba Expirado' : 'Período de Prueba'}
                                </h3>
                                <p className={`text-sm ${isExpired ? 'text-red-700' : 'text-yellow-700'}`}>
                                    {isExpired 
                                        ? 'Tu período de prueba ha terminado. Selecciona un plan para continuar.'
                                        : `Te quedan ${daysRemaining} día${daysRemaining !== 1 ? 's' : ''} de prueba gratuita.`
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Badge variant={isExpired ? 'destructive' : 'secondary'}>
                                {isExpired ? 'Expirado' : 'Prueba Gratuita'}
                            </Badge>
                            <Button asChild size="sm">
                                <Link href={route('subscriptions.index')}>
                                    {isExpired ? 'Seleccionar Plan' : 'Ver Planes'}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Si tiene suscripción activa
    if (currentSubscription) {
        const isExpiringSoon = daysRemaining <= 10 && daysRemaining > 0;
        const isExpired = daysRemaining === 0;
        const isActive = currentSubscription.status === 'active';

        if (!isActive || isExpired) {
            return (
                <Card className="mb-6 border-red-500 bg-red-50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <AlertTriangle className="h-6 w-6 text-red-500" />
                                <div>
                                    <h3 className="font-semibold text-red-900">
                                        Suscripción {isExpired ? 'Expirada' : 'Inactiva'}
                                    </h3>
                                    <p className="text-sm text-red-700">
                                        {isExpired 
                                            ? 'Tu suscripción ha expirado. Renueva para continuar usando todas las funcionalidades.'
                                            : 'Tu suscripción está inactiva. Contacta con soporte si crees que es un error.'
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Badge variant="destructive">
                                    {isExpired ? 'Expirada' : 'Inactiva'}
                                </Badge>
                                <Button asChild size="sm">
                                    <Link href={route('subscriptions.payment', currentSubscription.id)}>
                                        Renovar Plan
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        if (isExpiringSoon) {
            return (
                <Card className="mb-6 border-2 border-orange-500 bg-orange-50 shadow-md">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="bg-orange-200 p-2 rounded-full">
                                    <Clock className="h-6 w-6 text-orange-700" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-orange-900">
                                        ¡Atención! Tu suscripción vence pronto
                                    </h3>
                                    <p className="text-sm text-orange-800">
                                        El plan <strong>{currentSubscription.plan?.name}</strong> caduca en {daysRemaining} día{daysRemaining !== 1 ? 's' : ''}. Renueva ahora para evitar interrupciones.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Badge variant="secondary" className="bg-orange-200 text-orange-900 border-orange-300">
                                    {currentSubscription.plan?.name}
                                </Badge>
                                <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg">
                                    <Link href={route('subscriptions.payment', currentSubscription.id)}>
                                        Renovar Ahora
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        // Si está activa y NO expira pronto, no mostrar nada para no estorbar la vista
        return null;
    }

    // No debería llegar aquí, pero por seguridad
    return null;
}