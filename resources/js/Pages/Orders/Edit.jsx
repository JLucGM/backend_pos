import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/Components/ui/badge';
import { WalletCards } from 'lucide-react';

// Define OrdersForm as a lazy component
const OrdersForm = lazy(() => import('./OrdersForm'));

export default function Edit({ orders, paymentMethods }) {
    const initialValues = {
        status: orders.status,
        total: orders.total,
        direction_delivery: orders.direction_delivery,
        payments_method_id: orders.payments_method_id,
    };

    const { data, setData, errors, post, processing } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        post(route('orders.update', orders.id), {
            onSuccess: () => {
                toast.success("Pedido actualizado con éxito.");
            },
            onError: () => {
                toast.error("Error al actualizar el pedido.");
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <div className='flex justify-between items-center '>
                        <div className="flex justify-start items-center">
                            <Link href={route('orders.index')} >
                                <ArrowLongLeftIcon className='size-6' />
                            </Link>
                            <h2 className="ms-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                                #{orders.id}
                            </h2>
                            <Badge className='mx-2'>{orders.status}</Badge>
                        </div>
                    </div>
                    <div className="flex items-center justify-start space-x-1 ps-7 mt-1">
                        <WalletCards className='size-4 text-gray-700' />
                        <p className='capitalize text-sm font-medium text-gray-700 dark:text-gray-300'>
                            {orders.order_origin} - {(orders.stores && orders.stores.length > 0 ? orders.stores[0].store_name : "Sin tienda")}
                        </p>
                    </div>
                </div>
            }
        >
            <Head className="capitalize" title={`Orden #${orders.id}`} />
            <div className="max-w-7xl mx-auto ">
                <div className=" overflow-hidden">
                    <div className=" text-gray-900 dark:text-gray-100">
                        <form onSubmit={submit} className='space-y-4'>
                            <div className="grid grid-cols-1 gap-4">
                                <Suspense fallback={<div>Cargando formulario de orden...</div>}>
                                    <OrdersForm
                                        data={data}
                                        orders={orders}
                                        paymentMethods={paymentMethods}
                                        setData={setData}
                                        errors={errors}
                                    />
                                </Suspense>
                            </div>

                            <div className="flex justify-end p-2.5">
                                <Button
                                    variant="default"
                                    size="sm"
                                    disabled={processing}
                                    type="submit"
                                >
                                    {processing ? "Guardando..." : "Guardar"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
