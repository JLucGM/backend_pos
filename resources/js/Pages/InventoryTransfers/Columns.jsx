import { Badge } from "@/Components/ui/badge";
import { buttonVariants } from "@/Components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { Link } from "@inertiajs/react";
import { Ellipsis, Eye } from "lucide-react";

export const InventoryTransferColumns = [
    {
        header: "Referencia",
        accessorKey: "reference_number",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-bold text-gray-900 dark:text-gray-100 ">
                    {row.original.reference_number || `#${row.original.id}`}
                </span>
                {/* <span className="text-[10px] text-gray-500">ID: {row.original.id}</span> */}
            </div>
        )
    },
    // {
    //     header: "Contenido",
    //     accessorKey: "items",
    //     cell: ({ row }) => {
    //         const itemCount = row.original.items?.length || 0;
    //         return (
    //             <div className="flex flex-col">
    //                 <span className=" font-medium">{itemCount} {itemCount === 1 ? 'Producto' : 'Productos'}</span>
    //                 {row.original.items?.length > 0 && (
    //                     <span className="text-[10px] text-gray-400 truncate max-w-[150px]">
    //                         {row.original.items[0].product?.product_name}
    //                         {itemCount > 1 && ` + ${itemCount - 1} más`}
    //                     </span>
    //                 )}
    //             </div>
    //         );
    //     }
    // },
    {
        header: "Origen",
        accessorKey: "fromStore.name",
        cell: ({ row }) => <span className="">{row.original.from_store?.name}</span>
    },
    {
        header: "Destino",
        accessorKey: "toStore.name",
        cell: ({ row }) => <span className="">{row.original.to_store?.name}</span>
    },
    {
        header: "Estado",

        accessorKey: "status",
        cell: ({ row }) => {
            const status = row.original.status;
            const variants = {
                pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200",
                ready: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200",
                shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200",
                received: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200",
                cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200",
            };
            const labels = {
                pending: "En espera",
                ready: "Listo",
                shipped: "Enviado",
                received: "Recibido",
                cancelled: "Cancelado",
            };
            return (
                <Badge variant="outline" className={`${variants[status] || ""}  px-1 py-0 h-5`}>
                    {labels[status] || status}
                </Badge>
            );
        }
    },
    // {
    //     header: "Fecha",
    //     accessorKey: "created_at",
    //     cell: ({ row }) => <span className="">{format(new Date(row.original.created_at), "dd/MM/yy", { locale: es })}</span>,
    // },
    {
        header: "Acciones",
        id: "actions",
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Ellipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>

                        <Link
                            href={route('inventory-transfers.show', row.original.id)}
                            className={buttonVariants({ variant: 'ghost' }) + ' w-full'}
                        >
                            <Eye />
                            Mostrar
                        </Link>

                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
];
