import {
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export default function StatusOrdersChart({ completados = 0, pendientes = 0, cancelados = 0 }) {
  const data = [
    { estado: 'Completado', cantidad: completados || 0 },
    { estado: 'Pendiente', cantidad: pendientes || 0 },
    { estado: 'Cancelado', cantidad: cancelados || 0 },
  ];

  const chartConfig = {
    cantidad: {
      label: "Cantidad",
      color: "#2563eb",
    },
  };

  // Colores para cada segmento del pastel
  const COLORS = ['#2563eb', '#f59e0b', '#ef4444']; // Azul para completados, amarillo para pendientes, rojo para cancelados

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full flex justify-center items-center">
      <PieChart>
        <Pie
          data={data}
          dataKey="cantidad"
          nameKey="estado"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label={({ estado, cantidad }) => `${estado}: ${cantidad}`} // Etiqueta opcional en cada segmento
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
      </PieChart>
    </ChartContainer>
  );
}
