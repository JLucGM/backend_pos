import { Badge } from '@/Components/ui/badge';
import { buttonVariants } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis, Pen, Trash } from 'lucide-react';
import { Link } from '@inertiajs/react';
import ConfirmDeleteDialog from "@/Components/ConfirmDeleteDialog";

export const CollectionColumns = [
    {
        header: 'Título',
        accessorKey: 'title',
    },
    {
        header: 'Tipo',
        accessorKey: 'type',
        cell: ({ row }) => (
            <Badge variant={row.original.type === 'smart' ? 'info' : 'secondary'}>
                {row.original.type === 'smart' ? 'Inteligente' : 'Manual'}
            </Badge>
        ),
    },
    {
        header: 'Estado',
        accessorKey: 'is_active',
        cell: ({ row }) => (
            <Badge variant={row.original.is_active ? 'success' : 'secondary'}>
                {row.original.is_active ? 'Activa' : 'Inactiva'}
            </Badge>
        ),
    },
    {
        header: 'Productos',
        accessorKey: 'products_count',
        cell: ({ row }) => (
            <span className="text-sm text-gray-600 dark:text-gray-400">
                {row.original.type === 'smart'
                    ? '—'
                    : row.original.products_count ?? 0}
            </span>
        ),
    },
    {
        header: 'Vigencia',
        accessorKey: 'starts_at',
        cell: ({ row }) => {
            const { starts_at, ends_at } = row.original;
            if (!starts_at && !ends_at) return <span className="text-gray-400 text-sm">Siempre</span>;
            const fmt = (d) => new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
            return (
                <span className="text-sm">
                    {starts_at ? fmt(starts_at) : '—'} → {ends_at ? fmt(ends_at) : '—'}
                </span>
            );
        },
    },
    {
        header: 'Acciones',
        accessorKey: 'actions',
        cell: ({ row, table }) => {
            const { isSuperAdmin, permissions = [] } = table.options.meta || {};
            const canEdit = isSuperAdmin || permissions.includes('admin.collections.edit');
            const canDelete = isSuperAdmin || permissions.includes('admin.collections.delete');

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {canEdit && (
                            <DropdownMenuItem>
                                <Link
                                    className={buttonVariants({ variant: 'ghost' }) + ' w-full'}
                                    href={route('collections.edit', row.original.slug)}
                                >
                                    <Pen /> Editar
                                </Link>
                            </DropdownMenuItem>
                        )}
                        {canDelete && (
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <ConfirmDeleteDialog url={route('collections.destroy', row.original.slug)} />
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
