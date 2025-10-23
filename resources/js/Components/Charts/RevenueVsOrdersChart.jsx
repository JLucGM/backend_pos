"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export default function RevenueVsOrdersChart({ data }) {
  const chartData = Object.entries(data || {}).map(([fecha, cantidad]) => ({
    fecha,
    pedidos: cantidad,
    ingresos: cantidad * 100, // reemplaza con valor real si lo tienes
  }))

  const chartConfig = {
    pedidos: {
      label: "Pedidos",
      color: "var(--chart-1)",
    },
    ingresos: {
      label: "Ingresos",
      color: "var(--chart-2)",
    },
  }

  return (
    <ChartContainer config={chartConfig}>
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="fecha"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(5)} // muestra solo MM-DD
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <Bar dataKey="pedidos" fill="var(--color-pedidos)" radius={4} />
        <Bar dataKey="ingresos" fill="var(--color-ingresos)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
