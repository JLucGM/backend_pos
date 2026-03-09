import { buttonVariants } from "@/Components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Ellipsis, Pen, Trash } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { formatDate } from "@/utils/dateFormatter";
import { Badge } from "@/Components/ui/badge";
import CurrencyDisplay from '@/Components/CurrencyDisplay';
import ConfirmDeleteDialog from "@/Components/ConfirmDeleteDialog";

export const ordersColumns = [
    {
        header: "",
        accessorKey: "id",
        cell: ({ row }) => {
            return (
                <p>#{row.original.id}</p>
            );
        },
    },
    {
        header: "Cliente",
        accessorKey: "user_id",
        cell: ({ row }) => {
            return (
                <p>{row.original.user?.name}</p>
            );
        },
    },
    {
        header: "Estado",
        accessorKey: "status",
        cell: ({ row }) => {
            return (
                <Badge>
                    {row.original.status}
                    </Badge>
            );
        },
    },
    {
        header: "Pago",
        accessorKey: "payment_status",
        cell: ({ row }) => {
            return (
                <Badge
                    variant={row.original.payment_status === 'paid' ? 'success' : 'warning'}
                >
                    {row.original.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}
                </Badge>
            );
        },
    },
    // {
    //     header: "Origen",
    //     accessorKey: "order_origin",
    // },

    // {
    //     header: "Tienda",
    //     accessorKey: "stores",
    //     cell: ({ row }) => {
    //         const storeName = row.original.stores.length > 0 ? row.original.stores[0].store_name : "N/A";
    //         return (
    //             <p>{storeName}</p>
    //         );
    //     },
    // },
    {
        header: "Fecha",
        accessorKey: "created_at",
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            const formattedDate = formatDate(date);
            return (
                <p>{formattedDate}</p>
            );
        },
    },
    {
        header: "Total",
        accessorKey: "total",
        cell: ({ row }) => {
            const { settings } = usePage().props;
            // Priorizamos la moneda capturada en la orden (snapshot)
            // Si no existe (órdenes antiguas), usamos la global de settings
            return (
                <p><CurrencyDisplay 
                    currency={row.original.currency || settings?.currency} 
                    amount={row.original.total} 
                /></p>
            );
        },
    },
    {
        header: "Acciones",
        accessorKey: "actions",
        cell: ({ row, table }) => {
            const { isSuperAdmin, permissions = [] } = table.options.meta || {};
            const canEdit = isSuperAdmin || permissions.includes('admin.orders.edit');
            const canDelete = isSuperAdmin || permissions.includes('admin.orders.delete');

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {canEdit && (
                            <DropdownMenuItem>
                                <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('orders.edit', row.original)}>
                                    <Pen /> Editar
                                </Link>
                            </DropdownMenuItem>
                        )}
                        {canDelete && (
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <ConfirmDeleteDialog url={route('orders.destroy', [row.original])} />
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }
];