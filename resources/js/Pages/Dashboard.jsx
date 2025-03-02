import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/Components/ui/chart';
import DivSection from '@/Components/ui/div-section';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Separator } from '@/Components/ui/separator';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

export default function Dashboard({ client, orders, ordersCount, clientsCount, todayOrdersCount, lowStockProducts, ordersByPaymentMethod }) {
    const user = usePage().props.auth.user;

    console.log(lowStockProducts);
    // Convertir los datos de client a un formato adecuado para el gráfico
    const chartData = Object.keys(client).map(month => ({
        month,
        desktop: client[month], // Suponiendo que 'desktop' es el número de clientes
    }));

    const chartConfig = {
        desktop: {
            label: "Clientes registrados",
            color: "#2563eb",
        },
    };

    const chartDataOrders = Object.keys(orders).map(month => ({
        month,
        desktop: orders[month], // Suponiendo que 'desktop' es el número de clientes
    }));

    const chartConfigOrders = {
        desktop: {
            label: "Ordenes realizados",
            color: "#2563eb",
        },
    };

    return (
        <AuthenticatedLayout
            header={
                <DivSection className='flex items-center gap-4'>

                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Bienvenidos {user.name}
                    </h2>
                </DivSection>
            }
        >
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-4 p- pt-0">
                <div className="grid auto-rows-min gap-4 md:grid-cols-6">

                    <DivSection className="col-span-2">
                        {ordersCount} Ordenes totales
                    </DivSection>
                    <DivSection className="col-span-2">
                        {clientsCount} Clientes totales
                    </DivSection>
                    <DivSection className="col-span-2">
                        {todayOrdersCount} Órdenes del día

                    </DivSection>
                    {/*<DivSection className="col-span-1">
                        {ordersCount}
                    </DivSection>
                    <DivSection className="col-span-1">
                        {ordersCount}
                    </DivSection>
                    <DivSection className="col-span-1">
                        {ordersCount}
                    </DivSection> */}

                    <DivSection className="col-span-3">

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
                                <ChartLegend content={<ChartLegendContent />} />
                                <ChartTooltip content={<ChartTooltipContent />} />

                                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </DivSection>

                    <DivSection className="col-span-3">
                        <ChartContainer config={chartConfigOrders} className="min-h-[200px] w-full col-span-3">
                            <BarChart data={chartDataOrders}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <ChartLegend content={<ChartLegendContent />} />
                                <ChartTooltip content={<ChartTooltipContent />} />

                                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </DivSection>

                    <DivSection className="col-span-2">
                        <div className="aspect-video rounded-xl col-span-2">

                            {/* Mostrar el contador de órdenes por método de pago */}
                            <ScrollArea className="h-52 max-h-52 ">
                                <h3 className="text-md font-semibold">Órdenes del dia por método de pago:</h3>
                                <ul>
                                    {Object.entries(ordersByPaymentMethod).map(([paymentMethod, count]) => (
                                        <div className="">

                                            <li key={paymentMethod}>
                                                {count} órdenes con {paymentMethod}
                                            </li>
                                            <Separator />
                                        </div>
                                    ))}
                                </ul>
                            </ScrollArea>
                        </div>
                    </DivSection>

                    <DivSection className="col-span-2">
                        <h3 className="text-lg font-semibold">Productos con bajo stock:</h3>
                        <ScrollArea className="h-52 max-h-52 ">

                            <ul className="mt-2">
                                {lowStockProducts.length > 0 ? (
                                    lowStockProducts.map(product => (
                                        <div className="">

                                            <li key={product.id} className="flex justify-between py-2">
                                                <p>{product.product_name}</p>
                                                <p>{product.stocks.reduce((total, stock) => total + stock.quantity, 0)}</p>
                                            </li>
                                            <Separator />
                                        </div>
                                    ))
                                ) : (
                                    <li>No hay productos con bajo stock.</li>
                                )}
                            </ul>
                        </ScrollArea>
                    </DivSection>

                    <div className="aspect-video rounded-xl bg-red-400/50" />
                    <div className="aspect-video rounded-xl bg-red-400/50" />
                </div>
                <div className="min-h-[100vh] flex-1 rounded-xl bg-red-400/50 md:min-h-min" />
            </div>

        </AuthenticatedLayout>
    );
}