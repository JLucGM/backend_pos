import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export default function PaymentMethodsChart({ data }) {
  // Transforma datos: asume que data es { metodo: cantidad }
  const chartData = Object.entries(data || {}).map(([metodo, cantidad]) => ({
    metodo,
    cantidad: cantidad || 0,
  }));

  const chartConfig = {
    cantidad: {
      label: "Cantidad de Pedidos:",
      color: "#8b5cf6", // Púrpura para métodos de pago
    },
  };

  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        data={chartData}
        layout="vertical" // Como en tu ejemplo: barras "horizontales" con layout vertical
        margin={{
          left: -10, // Como en tu ejemplo
        }}
      >
        <XAxis type="number" dataKey="cantidad" /> {/* Eje X para valores, oculto */}
        <YAxis
          dataKey="metodo"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)} // Corta etiquetas largas (opcional)
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="cantidad" fill="var(--color-cantidad)" radius={5} />
      </BarChart>
    </ChartContainer>
  );
}
