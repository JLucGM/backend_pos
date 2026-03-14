import { useEffect, useState, useMemo } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import FilterDate from "@/Components/FilterDate";
import StatusOrdersChart from "@/Components/Charts/StatusOrdersChart";
import OrdersByDays from "@/Components/Charts/OrdersByDays";
import PaymentMethodsChart from "@/Components/Charts/PaymentMethodsChart";
import SalesByCategoryChart from "@/Components/Charts/SalesByCategoryChart";
import CurrencyDisplay from '@/Components/CurrencyDisplay';
import DeliveryTypeChart from "@/Components/Charts/DeliveryTypeChart";
import SalesByLocationChart from "@/Components/Charts/SalesByLocationChart";
import {
    TrendingUp,
    TrendingDown,
    ShoppingBag,
    CheckCircle2,
    Clock,
    XCircle,
    DollarSign,
    Package,
    ArrowUpRight,
    MapPin,
    CreditCard,
    Store as StoreIcon,
    ChevronDown,
    Filter,
    Coins
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { AlertCircle, Eye, UserCheck, BadgeAlert } from "lucide-react";
import { Badge } from "@/Components/ui/badge";

// Componente para Mini Tarjetas de KPI con diseño premium
const KPICard = ({ title, value, icon: Icon, trend, trendValue, colorClass }) => (
    <Card className="overflow-hidden border-none shadow-md bg-white dark:bg-slate-900 transition-all hover:shadow-lg">
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
                    {trendValue && (
                        <div className={`flex items-center mt-2 text-xs font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                            {trendValue}
                            <span className="text-slate-400 ml-1 font-normal text-[10px]">vs. periodo anterior</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-10`}>
                    <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
                </div>
            </div>
        </CardContent>
    </Card>
);

export default function Index({
    desde,
    hasta,
    store_id,
    stores = [],
    totalVentas = 0,
    totalCompletados = 0,
    totalPedidos = 0,
    pedidosPorDia = {},
    totalDiscounts = 0,
    totalShipping = 0,
    taxAmount = 0,
    totalCancelados = 0,
    totalPendientes = 0,
    ordersByPaymentMethod = {},
    ventasPorCategoria = {},
    ordersByDeliveryType = {},
    totalReembolsos = 0,
    ventasNetas = 0,
    ventasPorTienda = {},
    topProductos = [],
    currency_id = null,
    currencies = [],
    currency = null,
    topClientes = [],
    lowStockProducts = [],
    topVistos = [],
}) {
    const { settings } = usePage().props;

    // Usar la moneda del servidor o la de settings como fallback
    const activeCurrency = currency || settings.currency;

    const handleStoreChange = (id) => {
        router.get(route('reports.index'), {
            desde,
            hasta,
            store_id: id === 'all' ? null : id,
            currency_id: currency_id
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCurrencyChange = (id) => {
        router.get(route('reports.index'), {
            desde,
            hasta,
            store_id: store_id,
            currency_id: id === 'all' ? null : id
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };
    // Formatear datos para el gráfico de barras por tienda
    const storeChartData = useMemo(() => {
        return Object.entries(ventasPorTienda).map(([name, data]) => ({
            name,
            total: data.total,
            count: data.count
        }));
    }, [ventasPorTienda]);

    const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Analítica de Negocio
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Visualiza el rendimiento de tu tienda en tiempo real.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Selector de Tienda */}
                        <div className="w-full sm:w-64">
                            <Select
                                value={store_id?.toString() || 'all'}
                                onValueChange={handleStoreChange}
                            >
                                <SelectTrigger className="w-full bg-white dark:bg-slate-800 border-none shadow-sm h-11 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <StoreIcon className="w-4 h-4 text-indigo-500" />
                                        <SelectValue placeholder="Todas las Tiendas" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="all">Todas las Tiendas</SelectItem>
                                    {stores.map(store => (
                                        <SelectItem key={store.id} value={store.id.toString()}>
                                            {store.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Selector de Moneda */}
                        <div className="w-full sm:w-64">
                            <Select
                                value={currency_id?.toString() || currencies.find(c => c.is_base)?.id.toString()}
                                onValueChange={handleCurrencyChange}
                            >
                                <SelectTrigger className="w-full bg-white dark:bg-slate-800 border-none shadow-sm h-11 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <Coins className="w-4 h-4 text-emerald-500" />
                                        <SelectValue placeholder="Seleccionar Moneda" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                    {currencies.map(c => (
                                        <SelectItem key={c.id} value={c.id.toString()}>
                                            {c.name} ({c.symbol}) {c.is_base && '(Base)'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Filtro de Fecha */}
                        <FilterDate desde={desde} hasta={hasta} params={{ store_id, currency_id }} />
                    </div>
                </div>
            }
        >
            <Head title="Reportes y Analíticas" />

            <div className="space-y-8 pb-12">
                {/* Fila de KPIs Principales */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard
                        title="Ventas Totales"
                        value={<CurrencyDisplay currency={activeCurrency} amount={totalVentas} />}
                        icon={DollarSign}
                        colorClass="bg-indigo-600"
                        trend="up"
                        trendValue="+12.5%"
                    />
                    <KPICard
                        title="Ventas Netas"
                        value={<CurrencyDisplay currency={activeCurrency} amount={ventasNetas} />}
                        icon={TrendingUp}
                        colorClass="bg-emerald-600"
                    />
                    <KPICard
                        title="Órdenes Totales"
                        value={totalPedidos}
                        icon={ShoppingBag}
                        colorClass="bg-amber-600"
                        trend="up"
                        trendValue="+5.2%"
                    />
                    <KPICard
                        title="Ticket Promedio"
                        value={<CurrencyDisplay currency={activeCurrency} amount={totalPedidos > 0 ? totalVentas / totalPedidos : 0} />}
                        icon={ArrowUpRight}
                        colorClass="bg-violet-600"
                    />
                </div>

                {/* Grid de Gráficos Principales */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Tendencia de Ventas (Grande) */}
                    <Card className="lg:col-span-8 border-none shadow-md overflow-hidden bg-white dark:bg-slate-900">
                        <CardHeader className="flex flex-row items-center justify-between pb-8">
                            <div>
                                <CardTitle className="text-lg font-bold">Resumen de Actividad</CardTitle>
                                <CardDescription>Pedidos realizados por día en el periodo seleccionado.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[350px] w-full">
                                <OrdersByDays data={pedidosPorDia} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Comparativo de Ventas por Tienda */}
                    <Card className="lg:col-span-4 border-none shadow-md overflow-hidden bg-white dark:bg-slate-900">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Ventas por Local</CardTitle>
                            <CardDescription>Comparativa entre tus sucursales.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={storeChartData} layout="vertical" margin={{ left: -20, right: 10 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            width={100}
                                            tick={{ fontSize: 11, fontWeight: 500 }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            cursor={{ fill: '#f8fafc' }}
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="bg-white p-3 shadow-xl rounded-xl border-none">
                                                            <p className="text-sm font-bold mb-1 text-slate-800">{payload[0].payload.name}</p>
                                                            <p className="text-xs text-indigo-600 font-bold">
                                                                <CurrencyDisplay currency={activeCurrency} amount={payload[0].value} />
                                                            </p>
                                                            <p className="text-[10px] text-slate-400 mt-1">{payload[0].payload.count} órdenes</p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={20}>
                                            {storeChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tercera Fila: Top Productos y Desglose Financiero */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Top Productos */}
                    <Card className="lg:col-span-7 border-none shadow-md overflow-hidden bg-white dark:bg-slate-900">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <Package className="w-5 h-5 text-indigo-500" /> Top Productos
                                </CardTitle>
                                <CardDescription>Productos con mayores ingresos.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-medium">
                                        <tr>
                                            <th className="px-6 py-3">Producto</th>
                                            <th className="px-6 py-3 text-center">Cantidad</th>
                                            <th className="px-6 py-3 text-right">Ventas</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {topProductos.length > 0 ? topProductos.map((p, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">{p.name}</td>
                                                <td className="px-6 py-4 text-center">{p.qty}</td>
                                                <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                                                    <CurrencyDisplay currency={activeCurrency} amount={p.revenue} />
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-8 text-center text-slate-400">No hay datos suficientes en este periodo.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Desglose Financiero */}
                    <Card className="lg:col-span-5 border-none shadow-md overflow-hidden bg-white dark:bg-slate-900">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Desglose Financiero</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Ventas Brutas</span>
                                        <span className="font-semibold"><CurrencyDisplay currency={activeCurrency} amount={totalVentas} /></span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-rose-600 font-medium">
                                        <span>Descuentos Aplicados</span>
                                        <span>- <CurrencyDisplay currency={activeCurrency} amount={totalDiscounts} /></span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span>Costos de Envío</span>
                                        <span className="font-semibold text-emerald-600">+ <CurrencyDisplay currency={activeCurrency} amount={totalShipping} /></span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span>Impuestos Recaudados</span>
                                        <span className="font-semibold"><CurrencyDisplay currency={activeCurrency} amount={taxAmount} /></span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-rose-500">
                                        <span>Reembolsos</span>
                                        <span>- <CurrencyDisplay currency={activeCurrency} amount={totalReembolsos} /></span>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-indigo-600 text-white flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-indigo-200" />
                                        <span className="font-bold">Ingresos Netos Estimados</span>
                                    </div>
                                    <span className="text-xl font-extrabold">
                                        <CurrencyDisplay currency={activeCurrency} amount={ventasNetas} />
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Cuarta Fila: Estados y Métodos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-none shadow-md bg-white dark:bg-slate-900">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Estados Logísticos
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[250px] w-full">
                                    <StatusOrdersChart
                                        completados={totalCompletados}
                                        pendientes={totalPendientes}
                                        cancelados={totalCancelados}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md bg-white dark:bg-slate-900">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-emerald-500" /> Métodos de Pago
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[250px] w-full">
                                    <PaymentMethodsChart data={ordersByPaymentMethod} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quinta Fila: Fidelidad e Interés */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Clientes */}
                        <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-slate-900">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <UserCheck className="w-5 h-5 text-indigo-500" /> Fidelidad: Top Clientes
                                    </CardTitle>
                                    <CardDescription>Clientes que más aportan a tu negocio.</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-medium">
                                            <tr>
                                                <th className="px-6 py-3">Cliente</th>
                                                <th className="px-6 py-3 text-center">Pedidos</th>
                                                <th className="px-6 py-3 text-right">Total Gastado</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {topClientes.length > 0 ? topClientes.map((c, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-slate-900 dark:text-white">{c.name}</div>
                                                        <div className="text-xs text-slate-400">{c.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center font-medium bg-slate-50/30 dark:bg-slate-800/20">{c.orders_count}</td>
                                                    <td className="px-6 py-4 text-right font-bold text-indigo-600 dark:text-indigo-400">
                                                        <CurrencyDisplay currency={activeCurrency} amount={c.total} />
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="3" className="px-6 py-8 text-center text-slate-400">Sin clientes registrados en este periodo.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Vistos (Interés) */}
                        <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-slate-900 border-l-4 border-amber-500">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2 text-amber-600">
                                    <Eye className="w-5 h-5" /> Interés: Más Vistos en Storefront
                                </CardTitle>
                                <CardDescription>Productos que atraen más atención online.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="max-h-[300px] overflow-y-auto">
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {topVistos.length > 0 ? topVistos.map((p, idx) => (
                                            <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-xs">
                                                        #{idx + 1}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-800 dark:text-slate-200">{p.product_name}</div>
                                                        <div className="text-xs text-slate-400 font-medium">
                                                            <CurrencyDisplay currency={activeCurrency} amount={p.product_price} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <div className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                                                        {p.views_count} <Eye className="w-3 h-3 text-slate-300" />
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 uppercase tracking-tighter">Vistas Totales</div>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="p-12 text-center">
                                                <p className="text-slate-400">No hay datos de vistas aún.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sexta Fila: Stock Crítico - Ancho Completo */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Alertas de Stock */}
                        <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-slate-900 border-l-4 border-rose-500">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2 text-rose-600">
                                    <BadgeAlert className="w-5 h-5" /> Inventario Crítico
                                </CardTitle>
                                <CardDescription>Productos con stock bajo (menos de 5 unidades).</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="max-h-[400px] overflow-y-auto">
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {lowStockProducts.length > 0 ? lowStockProducts.map((p, idx) => (
                                            <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                                <div>
                                                    <div className="font-semibold text-slate-800 dark:text-slate-200">{p.name}</div>
                                                    <div className="text-xs text-slate-400">SKU: {p.sku} | <span className="text-indigo-400">{p.store}</span></div>
                                                </div>
                                                <Badge variant="destructive" className="bg-rose-100 text-rose-600 hover:bg-rose-100 border-none px-3 py-1">
                                                    {p.quantity} unid.
                                                </Badge>
                                            </div>
                                        )) : (
                                            <div className="p-12 text-center">
                                                <CheckCircle2 className="w-12 h-12 text-emerald-200 mx-auto mb-3" />
                                                <p className="text-slate-400">Inventario saludable. No hay alertas.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
        </AuthenticatedLayout>
    );
}
