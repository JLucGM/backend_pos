import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/Components/InputError';

export default function SubscriptionCreate({ plans, companies }) {
    const { data, setData, post, processing, errors } = useForm({
        company_id: '',
        subscription_plan_id: '',
        billing_cycle: 'monthly',
        status: 'active',
        starts_at: new Date().toISOString().split('T')[0],
        ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 días después
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.subscriptions.store'));
    };

    const handlePlanChange = (planId) => {
        setData('subscription_plan_id', planId);
        
        // Actualizar fecha de fin basada en el ciclo de facturación
        const startDate = new Date(data.starts_at);
        let endDate;
        
        if (data.billing_cycle === 'yearly') {
            endDate = new Date(startDate);
            endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
            endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);
        }
        
        setData('ends_at', endDate.toISOString().split('T')[0]);
    };

    const handleBillingCycleChange = (cycle) => {
        setData('billing_cycle', cycle);
        
        // Actualizar fecha de fin basada en el nuevo ciclo
        const startDate = new Date(data.starts_at);
        let endDate;
        
        if (cycle === 'yearly') {
            endDate = new Date(startDate);
            endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
            endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);
        }
        
        setData('ends_at', endDate.toISOString().split('T')[0]);
    };

    const selectedPlan = plans.find(plan => plan.id == data.subscription_plan_id);

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
                        Crear Nueva Suscripción
                    </h2>
                </div>
            }
        >
            <Head title="Crear Suscripción" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Nueva Suscripción</CardTitle>
                            <CardDescription>
                                Crear una suscripción manualmente para una empresa
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Empresa */}
                                <div className="space-y-2">
                                    <Label htmlFor="company_id">Empresa</Label>
                                    <Select value={data.company_id} onValueChange={(value) => setData('company_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar empresa" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companies.map((company) => (
                                                <SelectItem key={company.id} value={company.id.toString()}>
                                                    {company.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.company_id} />
                                </div>

                                {/* Plan */}
                                <div className="space-y-2">
                                    <Label htmlFor="subscription_plan_id">Plan de Suscripción</Label>
                                    <Select value={data.subscription_plan_id} onValueChange={handlePlanChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar plan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {plans.map((plan) => (
                                                <SelectItem key={plan.id} value={plan.id.toString()}>
                                                    {plan.name} - ${plan.price}/{plan.billing_cycle === 'yearly' ? 'año' : 'mes'}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.subscription_plan_id} />
                                </div>

                                {/* Ciclo de Facturación */}
                                <div className="space-y-2">
                                    <Label htmlFor="billing_cycle">Ciclo de Facturación</Label>
                                    <Select value={data.billing_cycle} onValueChange={handleBillingCycleChange}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="monthly">Mensual</SelectItem>
                                            <SelectItem value="yearly">Anual</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.billing_cycle} />
                                </div>

                                {/* Estado */}
                                <div className="space-y-2">
                                    <Label htmlFor="status">Estado</Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Activa</SelectItem>
                                            <SelectItem value="inactive">Inactiva</SelectItem>
                                            <SelectItem value="trial">Prueba</SelectItem>
                                            <SelectItem value="cancelled">Cancelada</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} />
                                </div>

                                {/* Fechas */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="starts_at">Fecha de Inicio</Label>
                                        <Input
                                            id="starts_at"
                                            type="date"
                                            value={data.starts_at}
                                            onChange={(e) => setData('starts_at', e.target.value)}
                                        />
                                        <InputError message={errors.starts_at} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="ends_at">Fecha de Vencimiento</Label>
                                        <Input
                                            id="ends_at"
                                            type="date"
                                            value={data.ends_at}
                                            onChange={(e) => setData('ends_at', e.target.value)}
                                        />
                                        <InputError message={errors.ends_at} />
                                    </div>
                                </div>

                                {/* Resumen */}
                                {selectedPlan && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold mb-2">Resumen</h3>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <span>Plan:</span>
                                                <span className="font-medium">{selectedPlan.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Precio:</span>
                                                <span className="font-medium">
                                                    ${data.billing_cycle === 'yearly' && selectedPlan.yearly_price 
                                                        ? selectedPlan.yearly_price 
                                                        : selectedPlan.price
                                                    } {selectedPlan.currency}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Ciclo:</span>
                                                <span className="font-medium">
                                                    {data.billing_cycle === 'yearly' ? 'Anual' : 'Mensual'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Botones */}
                                <div className="flex justify-end space-x-4">
                                    <Button type="button" variant="outline" asChild>
                                        <Link href={route('admin.subscriptions.index')}>
                                            Cancelar
                                        </Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Creando...' : 'Crear Suscripción'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}