import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/Components/ui/chart';
import DivSection from '@/Components/ui/div-section';
import { ScrollArea } from '@/Components/ui/scroll-area';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Badge } from "@/Components/ui/badge"
import SummaryCard from '@/Components/SummaryCard';
import CurrencyDisplay from '@/Components/CurrencyDisplay';
import SubscriptionStatus from '@/Components/SubscriptionStatus';
import { CheckCircle2, Circle, Settings, ShoppingBag, Globe, ShieldCheck, CreditCard, Truck } from 'lucide-react';

import { usePermission } from '@/hooks/usePermission';

export default function Dashboard({ user, usersCount, orders, ordersCount, totalTodayOrdersAmount, todayOrdersCount, lowStockProducts, ordersByPaymentMethod, company, currentSubscription, setupChecklist }) {
    const { roles, isSuperAdmin, user: userAuth } = usePermission();
    const settings = usePage().props.settings;

    const isCustomerService = roles?.includes('customer service');
    
    // Solo mostrar el checklist a los Owners, pero NO a los Super Admin
    const isOwner = roles?.includes('owner') && !isSuperAdmin;

    const checklistItems = [
        { id: 'products', label: 'Crear tus primeros productos', completed: setupChecklist?.has_products, link: route('products.create'), icon: ShoppingBag },
        { id: 'logo', label: 'Subir logo de la empresa', completed: setupChecklist?.has_logo, link: route('setting.index'), icon: Settings },
        { id: 'domain', label: 'Configurar dominio propio', completed: setupChecklist?.has_domain, link: route('setting.index'), icon: Globe },
        { id: 'policies', label: 'Modificar políticas legales', completed: setupChecklist?.has_policies, link: route('policy.index'), icon: ShieldCheck },
        { id: 'payment', label: 'Configurar métodos de pago', completed: setupChecklist?.has_payment_methods, link: route('paymentmethod.index'), icon: CreditCard },
        { id: 'shipping', label: 'Ajustar tarifas de envío', completed: setupChecklist?.has_shipping_rates, link: route('shippingrate.index'), icon: Truck },
    ];

    const allCompleted = checklistItems.every(item => item.completed);

    return (
        <AuthenticatedLayout
            header={
                <DivSection className='flex items-center gap-4 mx-4'>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Bienvenido, {userAuth.name}
                    </h2>
                </DivSection>
            }
        >
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                {/* Estado de Suscripción */}
                <SubscriptionStatus company={company} currentSubscription={currentSubscription} />

                {/* Checklist de Configuración para Owners (desaparece al completar todo) */}
                {isOwner && !allCompleted && (
                    <DivSection className="border-l-4 border-l-purple-500 bg-purple-50/30 dark:bg-purple-950/20">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-purple-700 dark:text-purple-400">Pasos para lanzar tu tienda</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Completa estas tareas para optimizar tu negocio.</p>
                            </div>
                            <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
                                {checklistItems.filter(i => i.completed).length} de {checklistItems.length} completados
                            </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {checklistItems.map((item) => (
                                <Link 
                                    key={item.id} 
                                    href={item.link}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-md ${
                                        item.completed 
                                            ? 'bg-white dark:bg-gray-800 border-green-100 dark:border-green-900/30' 
                                            : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-purple-200'
                                    }`}
                                >
                                    <div className={`p-2 rounded-lg ${item.completed ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${item.completed ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}>
                                            {item.label}
                                        </p>
                                    </div>
                                    {item.completed ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </DivSection>
                )}

                <div className="grid auto-rows-min gap-4 lg:grid-cols-6">
                    <SummaryCard label="Órdenes Totales" value={ordersCount} className="col-span-2" />
                    <SummaryCard label="Usuarios Totales" value={usersCount} className="col-span-1" />
                    <SummaryCard label="Órdenes del Día" value={todayOrdersCount} className="col-span-1" />
                    
                    {/* Restricción para Customer Service */}
                    {!isCustomerService && (
                        <SummaryCard 
                            label="Recaudado Hoy" 
                            value={<CurrencyDisplay currency={settings.currency} amount={totalTodayOrdersAmount} />} 
                            className="col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-100 dark:border-blue-900/30 font-bold" 
                        />
                    )}

                    <DivSection className={`${isCustomerService ? 'col-span-6' : 'col-span-3'}`}>
                        <h3 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-200">Productos con Bajo Stock</h3>
                        <ScrollArea className="h-60">
                            <ul className="mt-2 space-y-2">
                                {lowStockProducts.length > 0 ? (
                                    lowStockProducts.map(product => (
                                        <li key={product.id} className="flex justify-between items-center py-2 px-3 border-b last:border-0 border-gray-50 dark:border-gray-800">
                                            <div className="flex items-center">
                                                <img
                                                    src={product.media && product.media.length > 0 ? product.media[0].original_url : "/product-example.png"}
                                                    alt={product.product_name}
                                                    className="w-10 h-10 object-cover rounded-xl aspect-square mr-2 border border-gray-100"
                                                    onError={(e) => { e.target.src = "/product-example.png"; }}
                                                />
                                                <Link href={route('products.edit', product.slug)} className='capitalize text-blue-600 hover:text-blue-800 font-medium text-sm'>
                                                    {product.product_name}
                                                </Link>
                                            </div>
                                            <Badge variant="destructive" className="rounded-full px-2">
                                                {product.stocks.reduce((total, stock) => total + parseInt(stock.quantity, 10), 0)}
                                            </Badge>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500 dark:text-gray-400 p-4 text-center">No hay productos con bajo stock.</li>
                                )}
                            </ul>
                        </ScrollArea>
                    </DivSection>

                    {/* Restricción para Customer Service */}
                    {!isCustomerService && (
                        <DivSection className="col-span-3">
                            <h3 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-200">Órdenes y Método de Pago del Día</h3>
                            <ScrollArea className="h-60 max-h-52">
                                <ul className="mt-2 space-y-2">
                                    {Object.entries(ordersByPaymentMethod).length > 0 ? (
                                        Object.entries(ordersByPaymentMethod).map(([paymentMethod, count]) => (
                                            <li key={paymentMethod} className="flex justify-between items-center py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                                                <span className='font-semibold text-gray-700 dark:text-gray-300'>{count} órdenes</span>
                                                <Badge variant="secondary" className="capitalize bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none">{paymentMethod}</Badge>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-500 dark:text-gray-400 p-4 text-center">No hay ventas registradas hoy.</li>
                                    )}
                                </ul>
                            </ScrollArea>
                        </DivSection>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

