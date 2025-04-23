import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import OrdersForm from './OrdersForm';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/Components/ui/badge';
import { WalletCards } from 'lucide-react';

export default function Edit({ orders, paymentMethods }) {
    // console.log(orders)
    const initialValues = {
        status: orders.status,
        total: orders.total,
        direction_delivery: orders.direction_delivery,
        // client_id: orders.client.id, // Cambiado para que solo contenga el ID
        payments_method_id: orders.payments_method_id, // Agrega este campo
    }

    // if (orders.client_id !== null) {
    //     initialValues.client_id = orders.client.id;
    // } else {
    //     initialValues.user_id = orders.user_id; // Asigna user_id si client_id es nulo
    // }

    // const items = [
    //     {
    //         name: 'Dashboard',
    //         href: 'dashboard',
    //         icon: {
    //             path: 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z',
    //         },
    //     },
    //     {
    //         name: 'Lista de usuario',
    //         href: 'orders.index',
    //         icon: {
    //             path: 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z',
    //         },
    //     },
    //     {
    //         name: 'Actualizar usuarios',
    //         icon: {
    //             path: 'M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z',
    //         },
    //     },
    // ];

    const { data, setData, errors, post, processing } = useForm(initialValues)

    const submit = (e) => {
        e.preventDefault();
        post(route('orders.update', orders)), {
            onSuccess: () => {
                toast("Pedido actualizado con éxito.");
            },
            onError: () => {
                toast.error("Error al actualizar el pedido.");
            }
        }
        // console.log(data)
    }
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
                    <div className="flex bg-red- items-center justify-start space-x-1 ps-7 mt-1">
                        <WalletCards className='size-4 text-gray-700' />
                        <p className='capitalize text-sm font-medium text-gray-700 dark:text-gray-300'>
                        {orders.order_origin} - {(orders.stores && orders.stores.length > 0 ? orders.stores[0].store_name : "Sin tienda")}
                        </p>
                    </div>
                </div>
            }
        >
            {/* <Breadcrumb items={items} /> */}

            <Head className="capitalize" title={`Orden #${orders.id}`} />

            <div className="max-w-7xl mx-auto ">
                <div className=" overflow-hidden">
                    <div className=" text-gray-900 dark:text-gray-100">
                        <form onSubmit={submit} className='space-y-4'>
                            <div className="grid grid-cols-1 gap-4">
                                <OrdersForm
                                    data={data}
                                    orders={orders}
                                    paymentMethods={paymentMethods}
                                    setData={setData}
                                    errors={errors}
                                />
                            </div>

                            <div className="flex justify-end p-2.5">
                                <Button
                                    variant="default"
                                    size="sm"
                                    disabled={processing}
                                    type="submit"
                                // onClick={() =>
                                //     toast("Actualizado.", {
                                //         description: "Se ha actualizado con éxito.",
                                //     })
                                // }
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