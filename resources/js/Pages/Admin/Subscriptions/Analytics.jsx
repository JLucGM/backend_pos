import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { ArrowLeft, CheckCircle, XCircle, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/Components/ui/chart';
import CurrencyDisplay from '@/Components/CurrencyDisplay';

export default function SubscriptionAnalytics({ 
    subscriptionsByMonth, 
    revenueByMonth, 
    planDistribution, 
    pendingPayments 
}) {
    // Preparar datos para gráficos
    const chartData = subscriptionsByMonth.map(item => ({
        month: item.month,
        subscriptions: item.count,
        revenue: revenueByMonth.find(r => r.month === item.month)?.revenue || 0
    }));

    const planChartData = planDistribution.map(item => ({
        name: item.plan?.name || 'Plan Desconocido',
        value: item.count,
        color: getRandomColor()
    }));

    function getRandomColor() {
        const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    const totalRevenue = revenueByMonth.reduce((sum, item) => sum + parseFloat(item.revenue || 0), 0);
    const totalSubscriptions = subscriptionsByMonth.reduce((sum, item) => sum + item.count, 0);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.subscriptions.index')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver
                        </Link>
                    </Button>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Analytics de Suscripciones
                    </h2>
                </div>
            }
        >
            <Head title="Analytics de Suscripciones" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Métricas Principales */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Suscripciones (12 meses)</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalSubscriptions}</div>
                                <p className="text-xs text-muted-foreground">
                                    Total en los últimos 12 meses
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Ingresos (12 meses)</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    <CurrencyDisplay currency={{ symbol: '$', code: 'USD' }} amount={totalRevenue} />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Total en los últimos 12 meses
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{pendingPayments.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    Requieren revisión
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Gráficos */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Suscripciones por Mes */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Suscripciones por Mes</CardTitle>
                                <CardDescription>
                                    Nuevas suscripciones en los últimos 12 meses
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={{
                                        subscriptions: {
                                            label: "Suscripciones",
                                            color: "#8884d8",
                                        },
                                    }}
                                    className="h-[300px]"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Bar dataKey="subscriptions" fill="#8884d8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        {/* Ingresos por Mes */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Ingresos por Mes</CardTitle>
                                <CardDescription>
                                    Ingresos generados en los últimos 12 meses
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={{
                                        revenue: {
                                            label: "Ingresos",
                                            color: "#82ca9d",
                                        },
                                    }}
                                    className="h-[300px]"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        {/* Distribución por Planes */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Distribución por Planes</CardTitle>
                                <CardDescription>
                                    Popularidad de cada plan de suscripción
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={{}}
                                    className="h-[300px]"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={planChartData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {planChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        {/* Pagos Pendientes */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Pagos Pendientes de Aprobación</CardTitle>
                                <CardDescription>
                                    Pagos que requieren revisión manual
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {pendingPayments.length > 0 ? (
                                    <div className="space-y-4 max-h-[300px] overflow-y-auto">
                                        {pendingPayments.map((payment) => (
                                            <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">{payment.subscription?.company?.name}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {payment.subscription?.plan?.name} - {' '}
                                                        <CurrencyDisplay 
                                                            currency={{ symbol: '$', code: payment.currency }} 
                                                            amount={payment.amount} 
                                                        />
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(payment.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline" className="text-green-600">
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="text-red-600">
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        No hay pagos pendientes de aprobación.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}