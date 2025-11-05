// PedidosPorDiaChart.jsx
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  YAxis,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export default function OrdersByDays({ data }) {
  // const chartData = Object.entries(data).map(([fecha, cantidad]) => ({
  //   fecha,
  //   cantidad,
  // }));

  const chartData = Object.entries(data || {}).map(([fecha, cantidad]) => ({
  fecha,
  cantidad,
}));


  const chartConfig = {
  cantidad: {
    label: "Cantidad",
    color: "#2563eb",
  },
};

return (
  <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
    <LineChart data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="fecha" />
      <YAxis dataKey="cantidad" allowDecimals={false} />
      <ChartTooltip content={<ChartTooltipContent />} />
      <Line type="monotone" dataKey="cantidad" stroke="var(--color-cantidad)" />
    </LineChart>
  </ChartContainer>
);
}
