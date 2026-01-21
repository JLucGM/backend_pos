import { useEffect, useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import DivSection from "@/Components/ui/div-section";
import Loader from "@/Components/ui/loader";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Suspense } from "react";
import FilterDate from "@/Components/FilterDate";
import StatusOrdersChart from "@/Components/Charts/StatusOrdersChart";
import OrdersByDays from "@/Components/Charts/OrdersByDays";
import RevenueVsOrdersChart from "@/Components/Charts/RevenueVsOrdersChart";
import { Component } from 'react'; // Para ErrorBoundary
import PaymentMethodsChart from "@/Components/Charts/PaymentMethodsChart";
import SalesByCategoryChart from "@/Components/Charts/SalesByCategoryChart";
import SummaryCard from "@/Components/SummaryCard";
import CurrencyDisplay from '@/Components/CurrencyDisplay';
import DeliveryTypeChart from "@/Components/Charts/DeliveryTypeChart";
import SalesByLocationChart from "@/Components/Charts/SalesByLocationChart";

// ErrorBoundary simple para capturar errores en gráficos
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error en gráfico:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-500">Error al cargar el gráfico. Verifica los datos.</div>;
    }
    return this.props.children;
  }
}

export default function Index({
  desde,
  hasta,
  totalVentas = 0,
  totalCompletados = 0,
  totalPedidos = 0,
  pedidosPorDia = {}, // Valor por defecto
  totalDiscounts = 0,
  totalShipping = 0,
  taxAmount = 0,
  totalCancelados = 0,
  totalPendientes = 0,
  ordersByPaymentMethod = 0,
  ventasPorCategoria = {},
  ordersByDeliveryType = {},
  totalReembolsos = 0,
  ventasPorPais = {},
  ventasPorEstado = {},
  ventasPorCiudad = {},
}) {
  const { settings } = usePage().props;

  useEffect(() => {
    // console.log('Datos actualizados');
  }, [totalVentas, totalCompletados, totalPedidos]);

  const pendientes = totalPendientes;
  const cancelados = totalCancelados;

  return (
    <AuthenticatedLayout
      header={
        <div className="flex justify-between items-center">
          <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Reporte
          </h2>
        </div>
      }
    >
      <Head title="Reporte" />

      <Suspense fallback={<Loader />}>
        {/* Debug temporal - remover después */}
        {process.env.NODE_ENV === 'development' && (
          <div className="p-2 bg-yellow-100 border rounded text-xs mb-4">
            <strong>Debug:</strong> totalVentas = {totalVentas}, 
            currency = {settings?.currency?.symbol || 'null'}
          </div>
        )}
        <FilterDate desde={desde} hasta={hasta} />
        <div className="flex justify-between items-center">
          <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Reporte
          </h2>
        </div>


        <div className="grid grid-cols-3 gap-4">
          <SummaryCard 
            label="Total recaudado" 
            value={<CurrencyDisplay currency={settings.currency} amount={totalVentas} />} 
          />
          <SummaryCard label="Órdenes Completadas" value={totalCompletados} />
          <SummaryCard label="Total Pedidos Realizados" value={totalPedidos} />
        </div>


        {/* Reorganización de Gráficos: Grid responsiva para mejor disposición */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6"> {/* Grid principal: 1 col (móvil), 2 (tablet), 3 (desktop) */}
          {/* Primera fila: OrdersByDays y RevenueVsOrdersChart lado a lado en desktop */}
          <DivSection className="col-span-full md:col-span-1 lg:col-span-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Pedidos por Día</h3>

            <ErrorBoundary>
              <OrdersByDays data={pedidosPorDia} />
            </ErrorBoundary>
          </DivSection>

          {/* <DivSection className="col-span-full md:col-span-1 lg:col-span-3">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Pedidos por Día</h3>
            <ErrorBoundary>
              <RevenueVsOrdersChart data={pedidosPorDia} />
            </ErrorBoundary>
          </DivSection> */}

          <DivSection className="col-span-full md:col-span-1 lg:col-span-2 ">
            <ul className="list-none space-y-1 [&>li]:flex [&>li]:mb-4 [&>li]:justify-between">
              <li>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Desglose de Ventas</h3>
              </li>
              <li className="flex justify-between"><strong>Descuentos:</strong><CurrencyDisplay currency={settings.currency} amount={totalDiscounts} /></li>
              <li className="flex justify-between"><strong>Envíos:</strong><CurrencyDisplay currency={settings.currency} amount={totalShipping} /></li>
              <li className="flex justify-between"><strong>Impuestos:</strong><CurrencyDisplay currency={settings.currency} amount={taxAmount} /></li>
              <li className="flex justify-between"><strong>Reembolsos:</strong><CurrencyDisplay currency={settings.currency} amount={Number(totalReembolsos || 0)} /></li>
              <li className="flex justify-between"><strong>Total Recaudado:</strong><CurrencyDisplay currency={settings.currency} amount={totalVentas} /></li>
            </ul>
          </DivSection>

          {/* Segunda fila: StatusOrdersChart centrado o full width */}
          <DivSection className="col-span-3"> {/* Ocupa full width en desktop para centrado */}
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Estado de Órdenes</h3>
            <ErrorBoundary>
              <StatusOrdersChart completados={totalCompletados} pendientes={pendientes} cancelados={cancelados} />
            </ErrorBoundary>
          </DivSection>

          <DivSection className="col-span-3">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Ventas por Categoría</h3>
            <ErrorBoundary>
              <SalesByCategoryChart data={ventasPorCategoria} />
            </ErrorBoundary>
          </DivSection>

          <DivSection className="col-span-3 ">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Órdenes por Método de Pago</h3>
            <ErrorBoundary>
              <PaymentMethodsChart data={ordersByPaymentMethod} /> {/* Nuevo: pasa ordersByPaymentMethod */}
            </ErrorBoundary>
          </DivSection>

          <DivSection className="col-span-3">  {/* Ajusta el span según el espacio */}
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Órdenes por Tipo de Entrega</h3>
            <ErrorBoundary>
              <DeliveryTypeChart data={ordersByDeliveryType} />
            </ErrorBoundary>
          </DivSection>

          <DivSection className="col-span-2">
            <ErrorBoundary>
              <SalesByLocationChart data={ventasPorPais} title="Ventas por País" />
            </ErrorBoundary>
          </DivSection>
          <DivSection className="col-span-2">
            <ErrorBoundary>
              <SalesByLocationChart data={ventasPorEstado} title="Ventas por Estado" />
            </ErrorBoundary>
          </DivSection>
          <DivSection className="col-span-2">
            <ErrorBoundary>
              <SalesByLocationChart data={ventasPorCiudad} title="Ventas por Ciudad" />
            </ErrorBoundary>
          </DivSection>


        </div>
      </Suspense>
    </AuthenticatedLayout>
  );
}
