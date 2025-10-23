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

export default function SalesByCategoryChart({ data = {} }) {
  const chartData = Object.entries(data).map(([categoria, total]) => ({
    categoria,
    total,
  }));

  const chartConfig = {
    total: {
      label: "Total",
      color: "#10b981", // verde
    },
  };

  const COLORS = [
    '#2563eb', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f43f5e', '#6366f1', '#eab308',
  ];

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full ">
      <PieChart>
        <Pie
          data={chartData}
          dataKey="total"
          nameKey="categoria"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ categoria, total }) => `${categoria}: ${total.toFixed(2)}`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
      </PieChart>
    </ChartContainer>
  );
}
