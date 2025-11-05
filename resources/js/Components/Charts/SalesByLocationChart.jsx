"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart, Sector } from "recharts"  // Removí Label y PieSectorDataItem

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export default function SalesByLocationChart({ data, title }) {
  // Transformar datos: [{ location: 'País A', sales: 1000, fill: 'hsl(var(--chart-1))' }, ...]
  const chartData = Object.keys(data).map((key, index) => ({
    location: key,
    sales: data[key],
    fill: `hsl(var(--chart-${(index % 5) + 1}))`,  // Usa hsl() para interpretar HSL
  }));

  // Configuración dinámica del gráfico
  const chartConfig = {
    sales: {
      label: "Ventas",
    },
    ...Object.keys(data).reduce((acc, key, index) => {
      acc[key.toLowerCase().replace(/\s+/g, '')] = {
        label: key,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,  // Usa hsl() aquí también
      };
      return acc;
    }, {}),
  };

  // Calcular el total y el porcentaje del más grande para el footer
  const total = chartData.reduce((sum, item) => sum + item.sales, 0);
  const maxItem = chartData.reduce((max, item) => item.sales > max.sales ? item : max, { sales: 0 });
  const trend = total > 0 ? ((maxItem.sales / total) * 100).toFixed(1) : 0;

  // Calcular activeIndex: índice del item con más ventas
  const activeIndex = chartData.findIndex(item => item.sales === maxItem.sales);

  return (
    <div className="">

        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
          >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
              />
            <Pie
              data={chartData}
              dataKey="sales"
              nameKey="location"
              innerRadius={60}  // Hace el donut
              strokeWidth={5}  // Grosor del borde
              activeIndex={activeIndex}  // Sector activo (el más grande)
              activeShape={({ outerRadius = 0, ...props }) => (
                <Sector {...props} outerRadius={outerRadius + 10} />  // Expande el sector activo
              )}
            />
          </PieChart>
        </ChartContainer>
        <div className="flex items-center gap-2 leading-none font-medium">
          {maxItem.location} representa {trend}% del total <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Mostrando ventas totales por zona
        </div>
              </div>
  );
}