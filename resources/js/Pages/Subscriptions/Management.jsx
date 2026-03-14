import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { 
    CreditCard, 
    Calendar, 
    CheckCircle2, 
    AlertCircle, 
    History, 
    ArrowRight,
    Clock,
    ShieldCheck
} from 'lucide-react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/Components/ui/table";

export default function Management({ subscription, company, plans }) {
    
    const formatPrice = (price, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(price);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-500 hover:bg-green-600 px-3 py-1">Activa</Badge>;
            case 'trial':
                return <Badge className="bg-blue-500 hover:bg-blue-600 px-3 py-1">Prueba</Badge>;
            case 'expired':
                return <Badge variant="destructive" className="px-3 py-1">Expirada</Badge>;
            case 'cancelled':
                return <Badge variant="outline" className="text-gray-500 px-3 py-1">Cancelada</Badge>;
            default:
                return <Badge variant="secondary" className="px-3 py-1">{status}</Badge>;
        }
    };

    const daysRemaining = subscription ? Math.ceil((new Date(subscription.ends_at) - new Date()) / (1000 * 60 * 60 * 24)) : 0;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-bold leading-tight text-gray-800">
                    Mi Suscripción y Facturación
                </h2>
            }
        >
            <Head title="Mi Suscripción" />

            <div className="py-8 space-y-8 max-w-7xl mx-auto">
                
                {/* Banner de Estado */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-l-4 border-l-blue-500 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Plan Actual</CardTitle>
                            <ShieldCheck className="w-4 h-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{subscription?.plan?.name || 'Sin Plan'}</div>
                            <div className="mt-1">{getStatusBadge(subscription?.status)}</div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-orange-500 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Vencimiento</CardTitle>
                            <Clock className="w-4 h-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {subscription ? new Date(subscription.ends_at).toLocaleDateString() : '-'}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 text-orange-600 font-medium">
                                {daysRemaining > 0 ? `Quedan ${daysRemaining} días` : 'Expiró'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-indigo-500 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Inversión</CardTitle>
                            <CreditCard className="w-4 h-4 text-indigo-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {subscription ? formatPrice(subscription.amount, subscription.currency) : '-'}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 capitalize">
                                Ciclo {subscription?.billing_cycle === 'yearly' ? 'Anual' : 'Mensual'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Acciones principales */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Gestión de Plan</CardTitle>
                                <CardDescription>Opciones para mantener tu cuenta al día</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 border rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer" 
                                     onClick={() => router.get(route('subscriptions.index'))}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                            <ArrowRight className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <span className="font-semibold">Cambiar de Plan</span>
                                    </div>
                                    <p className="text-sm text-gray-600">Mejora tus funciones o ajusta tu presupuesto.</p>
                                </div>
                                
                                {subscription && (
                                    <div className="p-4 border rounded-xl hover:bg-green-50 transition-colors group cursor-pointer border-green-100"
                                         onClick={() => router.get(route('subscriptions.payment', subscription.id))}>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                                                <History className="w-5 h-5 text-green-600" />
                                            </div>
                                            <span className="font-semibold">Pagar Siguiente Mes</span>
                                        </div>
                                        <p className="text-sm text-gray-600">Renueva anticipadamente para no perder acceso.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <History className="w-5 h-5" />
                                    Últimos Pagos
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {subscription?.payments?.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Fecha</TableHead>
                                                <TableHead>Método</TableHead>
                                                <TableHead>Monto</TableHead>
                                                <TableHead>Estado</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {subscription.payments.map((payment) => (
                                                <TableRow key={payment.id}>
                                                    <TableCell className="text-sm">
                                                        {new Date(payment.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-sm capitalize">
                                                        {payment.payment_method.replace('_', ' ')}
                                                    </TableCell>
                                                    <TableCell className="text-sm font-medium">
                                                        {formatPrice(payment.amount, payment.currency)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={payment.status === 'completed' ? 'success' : 'secondary'} className="text-[10px] uppercase">
                                                            {payment.status === 'completed' ? 'Completado' : 'Pendiente'}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-8 text-gray-500 italic">
                                        No se han registrado pagos todavía.
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Link href={route('subscriptions.payments')} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                    Ver historial completo <ArrowRight className="w-3 h-3" />
                                </Link>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Información Lateral */}
                    <div className="space-y-6">
                        <Card className="bg-slate-900 text-white">
                            <CardHeader>
                                <CardTitle className="text-slate-100">Estado de Empresa</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <span className="text-xs text-slate-400 uppercase tracking-wider">Empresa</span>
                                    <p className="text-lg font-medium">{company.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-slate-400 uppercase tracking-wider">Subdominio</span>
                                    <p className="text-lg font-medium">{company.subdomain}.audaz.pro</p>
                                </div>
                                <div className="space-y-1 pt-4 border-t border-slate-800">
                                    <div className="flex items-center gap-2 text-green-400">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span className="text-sm font-medium">Cuenta Verificada</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
                            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-blue-900 mb-1">¿Necesitas Ayuda?</h4>
                                <p className="text-xs text-blue-800 leading-relaxed">
                                    Si tienes problemas con tu facturación o quieres solicitar un plan corporativo, escríbenos a soporte@audaz.pro
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
