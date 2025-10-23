import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
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
}) {
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
        <FilterDate desde={desde} hasta={hasta} />

        <div className="grid grid-cols-3 gap-4">
          <SummaryCard label="Total recaudado" value={totalVentas.toFixed(2)} prefix="$" />
          <SummaryCard label="Órdenes Completadas" value={totalCompletados} />
          <SummaryCard label="Total Pedidos Realizados" value={totalPedidos} />
        </div>


        {/* Reorganización de Gráficos: Grid responsiva para mejor disposición */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> {/* Grid principal: 1 col (móvil), 2 (tablet), 3 (desktop) */}
          {/* Primera fila: OrdersByDays y RevenueVsOrdersChart lado a lado en desktop */}
          {/* <DivSection className="col-span-1 md:col-span-1 lg:col-span-2"> 
            <ErrorBoundary>
              <OrdersByDays data={pedidosPorDia} />
            </ErrorBoundary>
          </DivSection> */}

          <DivSection className="col-span-full md:col-span-1 lg:col-span-3">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Pedidos por Día</h3>
            <ErrorBoundary>
              <RevenueVsOrdersChart data={pedidosPorDia} />
            </ErrorBoundary>
          </DivSection>

          <DivSection className="col-span-full md:col-span-1 lg:col-span-1 ">
            <ul className="list-none space-y-1">
              <li>Desglose de Ventas</li>
              <li className="flex justify-between"><strong>Descuentos:</strong> {totalDiscounts.toFixed(2)}</li>
              <li className="flex justify-between"><strong>Envíos:</strong> {totalShipping.toFixed(2)}</li>
              <li className="flex justify-between"><strong>Impuestos:</strong> {taxAmount.toFixed(2)}</li>
              <li className="flex justify-between"><strong>Total Recaudado:</strong> {totalVentas.toFixed(2)}</li>
            </ul>
          </DivSection>

          {/* Segunda fila: StatusOrdersChart centrado o full width */}
          <DivSection className="col-span-2"> {/* Ocupa full width en desktop para centrado */}
            <ErrorBoundary>
              <StatusOrdersChart completados={totalCompletados} pendientes={pendientes} cancelados={cancelados} />
            </ErrorBoundary>
          </DivSection>

          <DivSection className="col-span-2">
            <ErrorBoundary>
              <SalesByCategoryChart data={ventasPorCategoria} />
            </ErrorBoundary>
          </DivSection>

          <DivSection className="col-span-2 ">
            <ErrorBoundary>
              <PaymentMethodsChart data={ordersByPaymentMethod} /> {/* Nuevo: pasa ordersByPaymentMethod */}
            </ErrorBoundary>
          </DivSection>


        </div>
      </Suspense>
    </AuthenticatedLayout>
  );
}
