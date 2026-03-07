import React from 'react';
import { Badge } from '@/Components/ui/badge';
import { Button, buttonVariants } from "@/Components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"
import { Ellipsis, Trash, Info, Copy, CheckCircle2 } from "lucide-react";
import { Link, router } from "@inertiajs/react";
import { toast } from 'sonner';

export const MediaColumns = (onShowDetails, copyingId, setCopyingId) => [
    {
        header: "",
        accessorKey: "thumb",
        cell: ({ row }) => (
            <div className="flex items-center cursor-pointer" onClick={() => onShowDetails(row.original)}>
                <img
                    src={row.original.thumb || row.original.url}
                    alt={row.original.name}
                    className="h-10 w-10 rounded-md object-cover border"
                />
            </div>
        ),
    },
    {
        header: "Nombre",
        accessorKey: "name",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium text-sm truncate max-w-[200px]">{row.original.name}</span>
                <span className="text-[10px] text-muted-foreground truncate max-w-[200px]">{row.original.file_name}</span>
            </div>
        )
    },
    {
        header: "Tamaño",
        accessorKey: "size",
        cell: ({ row }) => <span className="text-xs">{row.original.size}</span>
    },
    {
        header: "Uso",
        accessorKey: "usage",
        cell: ({ row }) => (
            <div className="flex gap-1">
                {row.original.usage_products > 0 && (
                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
                        {row.original.usage_products} Prod.
                    </Badge>
                )}
                {row.original.usage_collections > 0 && (
                    <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">
                        {row.original.usage_collections} Coll.
                    </Badge>
                )}
                {!(row.original.usage_products > 0) && !(row.original.usage_collections > 0) && (
                    <span className="text-xs text-muted-foreground italic text-[10px]">Sin uso</span>
                )}
            </div>
        )
    },
    {
        header: "Subido",
        accessorKey: "created_at",
        cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.created_at}</span>
    },
    {
        header: "Acciones",
        accessorKey: "actions",
        cell: ({ row }) => {
            const copyToClipboard = (e) => {
                e.preventDefault();
                navigator.clipboard.writeText(row.original.url);
                setCopyingId(row.original.id);
                toast.success('URL copiada');
                setTimeout(() => setCopyingId(null), 2000);
            };

            const handleDelete = (e) => {
                e.preventDefault();
                if (confirm('¿Estás seguro de eliminar esta imagen?')) {
                    router.delete(route('media.destroy', row.original.id));
                }
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <Ellipsis className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onShowDetails(row.original)}>
                            <Info className="mr-2 h-4 w-4" /> Detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={copyToClipboard}>
                            {copyingId === row.original.id ? (
                                <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                            ) : (
                                <Copy className="mr-2 h-4 w-4" />
                            )}
                            Copiar URL
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                            <Trash className="mr-2 h-4 w-4" /> Eliminar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }
];
