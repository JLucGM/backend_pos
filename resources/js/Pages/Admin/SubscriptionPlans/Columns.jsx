import { Badge } from "@/Components/ui/badge";
import { buttonVariants } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Ellipsis, Pen, Trash } from "lucide-react";

export const subscriptionPlansColumns = [
    {
        header: "Nombre",
        accessorKey: "name",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2">
                    <span>{row.original.name}</span>
                    {row.original.is_featured && (
                        <Badge variant="default" className="text-xs">Destacado</Badge>
                    )}
                </div>
            );
        }
    },
    {
        header: "Precio Mensual",
        accessorKey: "price",
        cell: ({ row }) => {
            return `$${parseFloat(row.original.price).toFixed(2)} ${row.original.currency || 'USD'}`;
        }
    },
    {
        header: "Precio Anual",
        accessorKey: "yearly_price",
        cell: ({ row }) => {
            return row.original.yearly_price
                ? `$${parseFloat(row.original.yearly_price).toFixed(2)} ${row.original.currency || 'USD'}`
                : '-';
        }
    },
    {
        header: "Tipo",
        accessorKey: "is_trial",
        cell: ({ row }) => {
            return (
                <Badge variant={row.original.is_trial ? "secondary" : "outline"}>
                    {row.original.is_trial ? `Prueba (${row.original.trial_days} días)` : 'Pago'}
                </Badge>
            );
        }
    },
    {
        header: "Estado",
        accessorKey: "is_active",
        cell: ({ row }) => {
            return (
                <Badge variant={row.original.is_active ? "success" : "destructive"}>
                    {row.original.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
            );
        }
    },
    {
        header: "Acciones",
        accessorKey: "actions",
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('admin.subscriptionPlan.edit', row.original)}>
                                <Pen /> Editar
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('admin.subscriptionPlan.destroy', [row.original])} method="delete">
                                <Trash /> Eliminar
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }
];
