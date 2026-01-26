import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Eye, Plus, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';
import CurrencyDisplay from '@/Components/CurrencyDisplay';

export default function SubscriptionsAdminIndex({ subscriptions, stats }) {
    const getStatusColor = (status) => {
        const colors = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-gray-100 text-gray-800',
            trial: 'bg-blue-100 text-blue-800',
            cancelled: 'bg-red-100 text-red-800',
            expired: 'bg-orange-100 text-orange-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status) => {
        const texts = {
            active: 'Activa',
            inactive: 'Inactiva',
            trial: 'Prueba',
            cancelled: 'Cancelada',
            expired: 'Expirada',
        };
        return texts[status] || status;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Administración de Suscripciones
                    </h2>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href={route('admin.subscriptions.analytics')}>
                                <TrendingUp className="h-4 w-4 mr-2" />
                                Analytics
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={route('admin.subscriptions.create')}>
                                <Plus className="h-4 w-4 mr-2" />
                                Nueva Suscripción
                            </Link>
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title="Administración de Suscripciones" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Suscripciones</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_subscriptions}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Suscripciones Activas</CardTitle>
                                <Users className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{stats.active_subscriptions}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">En Prueba</CardTitle>
                                <Clock className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">{stats.trial_subscriptions}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
                                <DollarSign className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    <CurrencyDisplay currency={{ symbol: '$', code: 'USD' }} amount={stats.monthly_revenue} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                                <TrendingUp className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    <CurrencyDisplay currency={{ symbol: '$', code: 'USD' }} amount={stats.total_revenue} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabla de Suscripciones */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Suscripciones Recientes</CardTitle>
                            <CardDescription>
                                Lista de todas las suscripciones del sistema
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Empresa</TableHead>
                                        <TableHead>Plan</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Ciclo</TableHead>
                                        <TableHead>Monto</TableHead>
                                        <TableHead>Vence</TableHead>
                                        <TableHead>Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {subscriptions.data.map((subscription) => (
                                        <TableRow key={subscription.id}>
                                            <TableCell className="font-medium">
                                                {subscription.company?.name}
                                            </TableCell>
                                            <TableCell>
                                                {subscription.plan?.name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(subscription.status)}>
                                                    {getStatusText(subscription.status)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {subscription.billing_cycle === 'yearly' ? 'Anual' : 'Mensual'}
                                            </TableCell>
                                            <TableCell>
                                                <CurrencyDisplay 
                                                    currency={{ symbol: '$', code: subscription.currency }} 
                                                    amount={subscription.amount} 
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {subscription.ends_at ? 
                                                    new Date(subscription.ends_at).toLocaleDateString() : 
                                                    'N/A'
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={route('admin.subscriptions.show', subscription.id)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Paginación */}
                            {subscriptions.links && (
                                <div className="flex justify-center space-x-2 mt-4">
                                    {subscriptions.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-2 text-sm rounded-md ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : link.url
                                                        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}