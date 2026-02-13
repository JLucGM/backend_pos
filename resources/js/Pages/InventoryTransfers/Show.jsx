import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ChevronLeft, Send, CheckCircle, Package, Truck, Store, User, Hash, Info, History, Clock } from 'lucide-react';
import DivSection from '@/Components/ui/div-section';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Badge } from '@/Components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";

export default function Show({ transfer }) {
    const { data, setData, put, processing, errors } = useForm({
        status: '',
        items: transfer.items.map(item => ({
            id: item.id,
            shipped_quantity: item.shipped_quantity ?? item.requested_quantity,
            received_quantity: item.received_quantity ?? item.shipped_quantity ?? item.requested_quantity,
        })),
        reason: transfer.reason || '',
    });

    const handleStatusUpdate = (status) => {
        data.status = status;
        put(route('inventory-transfers.update', transfer.id), {
            preserveScroll: true,
        });
    };

    const updateItemQuantity = (id, field, value) => {
        setData('items', data.items.map(item =>
            item.id === id ? { ...item, [field]: parseInt(value) || 0 } : item
        ));
    };

    const statusLabels = {
        pending: { label: "En espera", variant: "bg-yellow-100 text-yellow-800" },
        ready: { label: "Listo para envío", variant: "bg-blue-100 text-blue-800" },
        shipped: { label: "Enviado", variant: "bg-purple-100 text-purple-800" },
        received: { label: "Recibido", variant: "bg-green-100 text-green-800" },
        cancelled: { label: "Cancelado", variant: "bg-red-100 text-red-800" },
    };

    const currentStatus = statusLabels[transfer.status] || { label: transfer.status, variant: "bg-gray-100" };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex items-center gap-4'>
                    <Link href={route('inventory-transfers.index')} className="text-gray-500 hover:text-gray-700">
                        <ChevronLeft className="size-5" />
                    </Link>
                    <div className="flex flex-col">
                        <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Transferencia {transfer.reference_number || `#${transfer.id}`}
                        </h2>
                        {/* <span className="text-xs text-gray-500 font-mono">ID: {transfer.id}</span> */}
                    </div>
                    <Badge className={currentStatus.variant}>{currentStatus.label}</Badge>
                </div>
            }
        >
            <Head title={`Transferencia ${transfer.reference_number || transfer.id}`} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Columna Principal: Información de Items y Ruta */}
                <div className="lg:col-span-3 space-y-6">
                    <DivSection title="Productos en Transferencia">
                        <div className="p-0 overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Producto</TableHead>
                                        <TableHead className="text-center w-24">Solicitado</TableHead>
                                        <TableHead className="text-center w-24">Enviado</TableHead>
                                        <TableHead className="text-center w-24">Recibido</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transfer.items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <p className="font-medium">{item.product.product_name}</p>
                                                {item.combination && (
                                                    <Badge variant="outline" className="text-[10px]">
                                                        {item.combination.combination_attribute_value
                                                            .map(cav => cav.attribute_value?.attribute_value_name)
                                                            .join(', ')}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center font-bold">
                                                {item.requested_quantity}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={item.shipped_quantity !== null ? 'secondary' : 'outline'}>
                                                    {item.shipped_quantity ?? '-'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={item.received_quantity !== null ? 'success' : 'outline'} className={item.received_quantity !== null ? 'bg-green-100 text-green-800' : ''}>
                                                    {item.received_quantity ?? '-'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </DivSection>

                    <DivSection title="Ruta de Transferencia">
                        <div className="p-6 flex items-center justify-between relative">
                            <div className="text-center z-10 bg-background px-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-full inline-block mb-2 border border-blue-100">
                                    <Store className="size-6" />
                                </div>
                                <p className="text-xs text-gray-500">Origen</p>
                                <p className="font-bold">{transfer.from_store.name}</p>
                            </div>

                            <div className="flex-1 h-px bg-gray-200 border-t border-dashed border-gray-400 mx-4 relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                                    <Truck className="size-5 text-gray-400" />
                                </div>
                            </div>

                            <div className="text-center z-10 bg-background px-4">
                                <div className="p-3 bg-green-50 text-green-600 rounded-full inline-block mb-2 border border-green-100">
                                    <Store className="size-6" />
                                </div>
                                <p className="text-xs text-gray-500">Destino</p>
                                <p className="font-bold">{transfer.to_store.name}</p>
                            </div>
                        </div>
                    </DivSection>

                    {/* Historial Timeline */}
                    {/* <DivSection> */}
                    <div className="flex items-center gap-2">
                        <History className="size-4" />
                        <span>Historial de Movimientos</span>
                    </div>
                    <div className="p-6 space-y-6">
                        {transfer.histories && transfer.histories.length > 0 ? (
                            <div className="relative space-y-4 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                {transfer.histories.map((entry, index) => (
                                    <div key={entry.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        {/* Icono de estado */}
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                            <Clock className="size-4" />
                                        </div>
                                        {/* Contenido */}
                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 bg-white shadow">
                                            <div className="flex items-center justify-between space-x-2 mb-1">
                                                <Badge className={statusLabels[entry.status]?.variant + " text-[10px] h-4"}>
                                                    {statusLabels[entry.status]?.label || entry.status}
                                                </Badge>
                                                <time className="font-mono text-xs text-indigo-500">
                                                    {format(new Date(entry.created_at), "dd/MM/yy HH:mm", { locale: es })}
                                                </time>
                                            </div>
                                            <div className="text-slate-500 text-sm">
                                                {entry.notes}
                                            </div>
                                            <div className="mt-2 text-[10px] text-gray-400 flex items-center gap-1">
                                                <User className="size-3" /> {entry.user?.name}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-sm text-gray-500 italic">No hay registros de historial disponibles.</p>
                        )}
                    </div>
                    {/* </DivSection> */}
                </div>

                {/* Columna Lateral: Gestión */}
                <div className="space-y-6">
                    <DivSection title="Gestionar Envío/Recepción">
                        <div className="p-4 space-y-4">
                            {transfer.status === 'pending' && (
                                <Button className="w-full justify-start" variant="outline" onClick={() => handleStatusUpdate('ready')} disabled={processing}>
                                    <Package className="size-4 mr-2" /> Marcar como Listo
                                </Button>
                            )}

                            {(transfer.status === 'pending' || transfer.status === 'ready') && (
                                <div className="space-y-4 border-t pt-4">
                                    <Label className="text-purple-700 font-bold">Paso 1: Confirmar Cantidades a Enviar</Label>
                                    <div className="space-y-3">
                                        {transfer.items.map(item => (
                                            <div key={item.id} className="text-xs space-y-1 border-b pb-2 last:border-0">
                                                <p className="font-medium truncate">{item.product.product_name}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-500">Solicitado: {item.requested_quantity}</span>
                                                    <Input
                                                        type="number"
                                                        className="h-7 text-xs w-20"
                                                        value={data.items.find(i => i.id === item.id)?.shipped_quantity}
                                                        onChange={(e) => updateItemQuantity(item.id, 'shipped_quantity', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => handleStatusUpdate('shipped')} disabled={processing}>
                                        <Send className="size-4 mr-2" /> Realizar Envío
                                    </Button>
                                </div>
                            )}

                            {transfer.status === 'shipped' && (
                                <div className="space-y-4">
                                    <Label className="text-green-700 font-bold">Paso 2: Confirmar Recepción</Label>
                                    <div className="space-y-3">
                                        {transfer.items.map(item => (
                                            <div key={item.id} className="text-xs space-y-1 border-b pb-2 last:border-0">
                                                <p className="font-medium truncate">{item.product.product_name}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-500">Enviado: {item.shipped_quantity}</span>
                                                    <Input
                                                        type="number"
                                                        className="h-7 text-xs w-20"
                                                        value={data.items.find(i => i.id === item.id)?.received_quantity}
                                                        onChange={(e) => updateItemQuantity(item.id, 'received_quantity', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Observaciones (Opcional)</Label>
                                        <Textarea
                                            value={data.reason}
                                            onChange={e => setData('reason', e.target.value)}
                                            placeholder="¿Algún problema con la recepción?"
                                            rows={3}
                                            className="text-xs"
                                        />
                                    </div>
                                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleStatusUpdate('received')} disabled={processing}>
                                        <CheckCircle className="size-4 mr-2" /> Recibir Inventario
                                    </Button>
                                </div>
                            )}

                            {['pending', 'ready', 'shipped'].includes(transfer.status) && (
                                <div className="pt-4 mt-4 border-t">
                                    <Button variant="destructive" className="w-full h-8 text-xs" onClick={() => {
                                        if (confirm('¿Estás seguro de cancelar esta transferencia?')) {
                                            handleStatusUpdate('cancelled');
                                        }
                                    }} disabled={processing}>
                                        Cancelar Transferencia
                                    </Button>
                                </div>
                            )}

                            {(transfer.status === 'received' || transfer.status === 'cancelled') && (
                                <p className="text-center text-sm text-gray-500 italic py-4">
                                    Este proceso ya ha finalizado.
                                </p>
                            )}
                        </div>
                    </DivSection>

                    <DivSection title="Detalles del Registro">
                        <div className="p-4 space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Solicitado por:</span>
                                <span className="font-medium flex items-center gap-1">
                                    <User className="size-3" /> {transfer.user.name}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Fecha Solicitud:</span>
                                <span className="font-medium">{format(new Date(transfer.created_at), "dd/MM/yyyy", { locale: es })}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Última Act.:</span>
                                <span className="font-medium">{format(new Date(transfer.updated_at), "dd/MM/yyyy HH:mm", { locale: es })}</span>
                            </div>
                        </div>
                    </DivSection>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
