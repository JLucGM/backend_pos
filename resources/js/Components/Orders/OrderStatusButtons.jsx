import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog'; // Importa Dialog
import RefundForm from '@/Pages/Orders/RefundForm';
import { toast } from 'sonner';

export default function OrderStatusButtons({ orders }) {
    const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false); // Estado para el dialog

    const handleStatusChange = (newStatus) => {
        router.post(route('orders.changeStatus', orders), { status: newStatus }, {
            _method: 'patch',
            onSuccess: () => {
                toast.success(`Status cambiado a ${newStatus}.`);
                // window.location.reload();
            },
            onError: (err) => {
                toast.error(err.error || 'Error al cambiar status.');
            }
        });
    };

    return (
        <div className="flex gap-2">
            {orders.status === 'pending' && (
                <Button onClick={() => handleStatusChange('processing')} variant="outline" size="sm">
                    En Proceso
                </Button>
            )}
            {orders.status === 'processing' && (
                <Button onClick={() => handleStatusChange('shipped')} variant="outline" size="sm">
                    Enviado
                </Button>
            )}
            {orders.status === 'shipped' && (
                <Button onClick={() => handleStatusChange('delivered')} variant="outline" size="sm">
                    Entregado
                </Button>
            )}
            {orders.status === 'delivered' && (
                <Button onClick={() => handleStatusChange('completed')} variant="outline" size="sm">
                    Completado
                </Button>
            )}
            {/* {orders.status !== 'cancelled' && orders.status !== 'refunded' && (
                <Button onClick={() => handleStatusChange('cancelled')} variant="outline" size="sm">
                    Cancelar
                </Button>
            )} */}

            {/* Botón de Reembolso - Aparece siempre excepto si cancelled o refunded */}
            {orders.status !== 'cancelled' && orders.status !== 'refunded' && (
                <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            Cancelar/Reembolsar
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>Reembolso</DialogTitle>
                        </DialogHeader>
                        <RefundForm order={orders} onClose={() => setIsRefundDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}