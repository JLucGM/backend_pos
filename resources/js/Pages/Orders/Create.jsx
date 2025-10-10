import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import Loader from '@/Components/ui/loader';
import { lazy, Suspense } from 'react';
import { toast } from 'sonner';
const OrdersForm = lazy(() => import('./OrdersForm'));

export default function Create({ paymentMethods, products, users, discounts  }) { // Asegúrate de recibir 'users' aquí
    console.log(products)

    const initialValues = {
        status: 'pending', // Estado inicial por defecto
        subtotal: 0,
        tax_amount: 0,
        total: 0,
        totaldiscounts: 0,
        payments_method_id: paymentMethods.length > 0 ? paymentMethods[0].id : null, // Primer método de pago por defecto
        order_origin: 'web', // Origen de la orden
        order_items: [], // Array vacío para los productos de la orden
        user_id: null, // Inicializa user_id como null
        delivery_location_id: null,
    }

    const { data, setData, errors, post, processing } = useForm(initialValues)

    // Función para manejar el envío del formulario
    const submit = (e) => {
        // console.log('data', data);

        e.preventDefault();
        post(route('orders.store'), {
            onSuccess: () => {
                toast.success("Pedido creado con éxito.");
            },
            onError: (err) => {
                console.error("Error al crear el pedido:", err);
                toast.error("Error al crear el pedido. Por favor, revisa los campos.");
            }
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Crear Pedido
                    </h2>
                </div>
            }
        >
            <Head className="capitalize" title="Pedido" />

            <Suspense fallback={<Loader />}>
                <div className="max-w-7xl mx-auto "> {/* Añadido padding para mejor diseño */}
                    <div className="overflow-hidden "> {/* Añadido bordes redondeados */}
                        <div className=" text-gray-900 dark:text-gray-100"> {/* Añadido padding */}
                            <form onSubmit={submit} className='space-y-6'> {/* Espaciado aumentado */}

                                {/* Renderiza el componente OrdersForm */}
                                <OrdersForm
                                    products={products}
                                    paymentMethods={paymentMethods}
                                    users={users} // Pasa la prop users al OrdersForm
                                    discounts={discounts} // Pasa los descuentos al OrdersForm
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                    isDisabled={processing} // Deshabilita el formulario mientras se envía
                                />

                                <div className="flex justify-end p-2.5"> {/* Borde superior y padding */}
                                    <Button
                                        variant="default" // Variante por defecto para la acción principal
                                        disabled={processing} // Deshabilita el botón mientras se envía
                                    >
                                        {processing ? 'Guardando...' : 'Guardar Pedido'}
                                    </Button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </Suspense>

        </AuthenticatedLayout>
    )
}