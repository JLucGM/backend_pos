import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/Components/ui/chart';
import DivSection from '@/Components/ui/div-section';
import { ScrollArea } from '@/Components/ui/scroll-area';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Badge } from "@/Components/ui/badge"
import SummaryCard from '@/Components/SummaryCard';

export default function Dashboard({ user, usersCount, orders, ordersCount, totalTodayOrdersAmount, todayOrdersCount, lowStockProducts, ordersByPaymentMethod }) {
    const userAuth = usePage().props.auth.user;
    const settings = usePage().props.settings;

    // Convertir los datos de user a un formato adecuado para el gráfico
    const chartData = Object.keys(user).map(month => ({
        month,
        usersRegistrados: user[month], // Renombrado para mayor claridad
    }));

    const chartConfig = {
        usersRegistrados: {
            label: "Usuarios Registrados", // Etiqueta más descriptiva
            color: "#2563eb",
        },
    };

    const chartDataOrders = Object.keys(orders).map(month => ({
        month,
        ordenesRealizadas: orders[month],  // Renombrado para mayor claridad
    }));

    const chartConfigOrders = {
        ordenesRealizadas: {
            label: "Órdenes Realizadas", // Etiqueta más descriptiva
            color: "#2563eb",
        },
    };

    return (
        <AuthenticatedLayout
            header={
                <DivSection className='flex items-center gap-4'>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Bienvenido, {userAuth.name}
                    </h2>
                </DivSection>
            }
        >
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid auto-rows-min gap-4 lg:grid-cols-6">
                    <SummaryCard label="Órdenes Totales" value={ordersCount} className="col-span-2" />
                    <SummaryCard label="Usuarios Totales" value={usersCount} className="col-span-1" />
                    <SummaryCard label="Órdenes del Día" value={todayOrdersCount} className="col-span-1" />
                    <SummaryCard label="Recaudado Hoy" value={totalTodayOrdersAmount} prefix={settings.default_currency} className="col-span-2" />

                    <DivSection className="col-span-3">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Usuarios Registrados por Mes</h3>
                        <ChartContainer config={chartConfig} className="min-h-[200px] w-full ">
                            <BarChart data={chartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickCount={10}
                                />
                                <ChartLegend content={<ChartLegendContent />} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="usersRegistrados" fill="var(--color-desktop)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </DivSection>

                    <DivSection className="col-span-3">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Órdenes Realizadas por Mes</h3>
                        <ChartContainer config={chartConfigOrders} className="min-h-[200px] w-full">
                            <BarChart data={chartDataOrders}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickCount={10}
                                />
                                <ChartLegend content={<ChartLegendContent />} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="ordenesRealizadas" fill="var(--color-desktop)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </DivSection>

                    <DivSection className="col-span-3">
                        <h3 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-200">Órdenes y Método de Pago del Día</h3>
                        <ScrollArea className="h-60 max-h-52">
                            <ul className="mt-2 space-y-2">
                                {Object.entries(ordersByPaymentMethod).map(([paymentMethod, count]) => (
                                    <li key={paymentMethod} className="flex justify-between items-center py-2 px-3">
                                        <span className='font-semibold'>{count}</span>
                                        <Badge variant="secondary" className="capitalize">{paymentMethod}</Badge>
                                    </li>
                                ))}
                            </ul>
                        </ScrollArea>
                    </DivSection>

                    <DivSection className="col-span-3">
                        <h3 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-200">Productos con Bajo Stock</h3>
                        <ScrollArea className="h-60">
                            <ul className="mt-2 space-y-2">
                                {lowStockProducts.length > 0 ? (
                                    lowStockProducts.map(product => (
                                        <li key={product.id} className="flex justify-between items-center py-2 px-3">
                                            <div className="flex items-center">
                                                {product.media && product.media.length > 0 ? (
                                                    <img
                                                        src={product.media[0].original_url}
                                                        alt={product.media[0].name}
                                                        className="w-10 h-10 object-cover rounded-xl aspect-square mr-2"
                                                    />
                                                ) : (
                                                    <img
                                                        src="https://placehold.co/10x10"
                                                        alt="Placeholder"
                                                        className="w-10 h-10 object-cover rounded-xl aspect-square mr-2"
                                                    />
                                                )}
                                                <Link href={route('products.edit', product.slug)} className='capitalize text-blue-500 hover:text-blue-700'>
                                                    {product.product_name}
                                                </Link>
                                            </div>
                                            <Badge variant="destructive">
                                                {product.stocks.reduce((total, stock) => total + parseInt(stock.quantity, 10), 0)}
                                            </Badge>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500 dark:text-gray-400">No hay productos con bajo stock.</li>
                                )}
                            </ul>
                        </ScrollArea>
                    </DivSection>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

