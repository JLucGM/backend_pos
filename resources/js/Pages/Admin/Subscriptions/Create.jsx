import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import InputError from '@/Components/InputError';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';

export default function SubscriptionCreate({ plans, companies }) {
    const { data, setData, post, processing, errors } = useForm({
        creation_mode: 'existing', // 'existing' o 'new'
        company_id: '',
        // Campos para nueva empresa/dueño
        owner_name: '',
        owner_email: '',
        owner_password: '',
        company_name: '',
        subdomain: '',

        subscription_plan_id: '',
        billing_cycle: 'monthly',
        status: 'active',
        starts_at: new Date().toISOString().split('T')[0],
        ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.subscriptions.store'));
    };

    const handlePlanChange = (planId) => {
        setData('subscription_plan_id', planId);

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
                <div className='flex justify-start items-center'>
                    <Link href={route('admin.subscriptions.index')} >
                        <ArrowLongLeftIcon className='size-6' />
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Crear Nueva Suscripción
                    </h2>
                </div>
            }
        >
            <Head title="Crear Suscripción" />

            <div className="text-gray-900 dark:text-gray-100">
                <Card>
                    <CardHeader>
                        <CardTitle>Nueva Suscripción</CardTitle>
                        <CardDescription>
                            Configura la suscripción y los detalles del cliente
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Modo de Creación */}
                            <div className="space-y-2 pb-4 border-b">
                                <Label>Modo de Creación</Label>
                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        variant={data.creation_mode === 'existing' ? 'default' : 'outline'}
                                        onClick={() => setData('creation_mode', 'existing')}
                                        className="flex-1"
                                    >
                                        Empresa Existente
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={data.creation_mode === 'new' ? 'default' : 'outline'}
                                        onClick={() => setData('creation_mode', 'new')}
                                        className="flex-1"
                                    >
                                        Nueva Empresa y Dueño
                                    </Button>
                                </div>
                            </div>

                            {data.creation_mode === 'existing' ? (
                                /* Empresa Existente */
                                <div className="space-y-2">
                                    <Label htmlFor="company_id">Seleccionar Empresa</Label>
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
                            ) : (
                                /* Nueva Empresa y Dueño */
                                <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2 text-sm font-semibold text-blue-600 border-b pb-1 col-span-full">
                                            Datos del Dueño (Owner)
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="owner_name">Nombre Completo</Label>
                                            <Input
                                                id="owner_name"
                                                value={data.owner_name}
                                                onChange={e => setData('owner_name', e.target.value)}
                                                placeholder="Ej. Juan Pérez"
                                            />
                                            <InputError message={errors.owner_name} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="owner_email">Correo Electrónico</Label>
                                            <Input
                                                id="owner_email"
                                                type="email"
                                                value={data.owner_email}
                                                onChange={e => setData('owner_email', e.target.value)}
                                                placeholder="juan@ejemplo.com"
                                            />
                                            <InputError message={errors.owner_email} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="owner_password">Contraseña Provisional</Label>
                                            <Input
                                                id="owner_password"
                                                type="password"
                                                value={data.owner_password}
                                                onChange={e => setData('owner_password', e.target.value)}
                                            />
                                            <InputError message={errors.owner_password} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2 text-sm font-semibold text-blue-600 border-b pb-1 col-span-full">
                                            Datos de la Empresa
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="company_name">Nombre de la Empresa</Label>
                                            <Input
                                                id="company_name"
                                                value={data.company_name}
                                                onChange={e => {
                                                    setData(d => ({
                                                        ...d,
                                                        company_name: e.target.value,
                                                        subdomain: e.target.value.toLowerCase().replace(/\s+/g, '-')
                                                    }))
                                                }}
                                                placeholder="Mi Tienda S.A."
                                            />
                                            <InputError message={errors.company_name} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subdomain">Subdominio</Label>
                                            <Input
                                                id="subdomain"
                                                value={data.subdomain}
                                                onChange={e => setData('subdomain', e.target.value)}
                                                placeholder="mitienda"
                                            />
                                            <InputError message={errors.subdomain} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2 text-sm font-semibold text-blue-600 border-b pb-1">
                                Detalles de la Suscripción
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Plan */}
                                <div className="space-y-2">
                                    <Label htmlFor="subscription_plan_id">Plan</Label>
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
                                    <Label htmlFor="billing_cycle">Ciclo</Label>
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
                                    <Label htmlFor="status">Estado Inicial</Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Activa</SelectItem>
                                            <SelectItem value="inactive">Inactiva (Esperando Pago)</SelectItem>
                                            <SelectItem value="trial">Prueba Gratuita</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} />
                                </div>

                                {/* Fechas */}
                                <div className="space-y-2">
                                    <Label htmlFor="ends_at">Vencimiento</Label>
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
                                <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                                    <h3 className="font-semibold mb-2 text-blue-800">Resumen del Plan</h3>
                                    <div className="space-y-1 text-sm text-blue-700">
                                        <div className="flex justify-between">
                                            <span>Plan:</span>
                                            <span className="font-bold">{selectedPlan.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Importe Inicial:</span>
                                            <span className="font-bold">
                                                ${data.billing_cycle === 'yearly' && selectedPlan.yearly_price
                                                    ? selectedPlan.yearly_price
                                                    : selectedPlan.price
                                                } {selectedPlan.currency}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Botones */}
                            <div className="flex justify-end space-x-4 pt-4 border-t">
                                <Button type="button" variant="outline" asChild>
                                    <Link href={route('admin.subscriptions.index')}>
                                        Cancelar
                                    </Link>
                                </Button>
                                <Button type="submit" disabled={processing} className="px-8">
                                    {processing ? 'Procesando...' : 'Crear Todo'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
