import { useState } from "react";
import { router } from "@inertiajs/react";
import { Button } from "./ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "@heroicons/react/24/outline";

export default function FilterDate({ desde, hasta }) {
  const [range, setRange] = useState({
    from: new Date(desde),
    to: new Date(hasta),
  });
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (!range?.from || !range?.to) return;

    const fechaDesde = format(range.from, "yyyy-MM-dd");
    const fechaHasta = format(range.to, "yyyy-MM-dd");

    router.get("/dashboard/reports", {
      desde: fechaDesde,
      hasta: fechaHasta,
    }, {
      only: [
        "totalVentas",
        "totalCompletados",
        "totalPedidos",
        "totalCancelados",
        "totalPendientes",
        "ordersByPaymentMethod",
        "ventasPorCategoria",
        "pedidosPorDia",
        "totalDiscounts",
        "totalShipping",
        "taxAmount",
      ],
      preserveScroll: true,
      preserveState: true,
    });
  };

  return (
    <div className="mb-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <CalendarIcon className="h-4 w-4" />
            {range?.from && range?.to
              ? `Del ${format(range.from, "dd MMM yyyy", { locale: es })} al ${format(range.to, "dd MMM yyyy", { locale: es })}`
              : "Seleccionar rango de fechas"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={range?.from}
            selected={range}
            onSelect={setRange}
            numberOfMonths={2}
          />
          <div className="flex justify-end gap-2 m-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              handleSubmit();
              setOpen(false);
            }}>
              Aplicar
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
