import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import Loader from '@/Components/ui/loader';
import { lazy, Suspense } from 'react';
import { toast } from 'sonner';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
const OrdersForm = lazy(() => import('./OrdersForm'));

export default function Create({ paymentMethods, products, users, discounts, shippingRates, stores }) {
// console.log(products)
    const initialValues = {
        status: 'pending', // Estado inicial por defecto
        payment_status: 'pending',
        delivery_type: 'delivery',
        subtotal: 0,
        tax_amount: 0,
        total: 0,
        totaldiscounts: 0,
        totalshipping: 0.00,
        payments_method_id: null, // Primer método de pago por defecto
        order_origin: 'web', // Origen de la orden
        order_items: [], // Array vacío para los productos de la orden
        user_id: null, // Inicializa user_id como null
        delivery_location_id: null,
        shipping_rate_id: null,
        store_id: null, // AGREGAR: store_id inicial
    }
    const { data, setData, errors, post, processing } = useForm(initialValues)

    // Función para manejar el envío del formulario
    const submit = (e) => {
        e.preventDefault();
        // Si es pickup, asegurarse de no enviar delivery_location_id
        const formData = { ...data };
        if (formData.delivery_type === 'pickup') {
            formData.delivery_location_id = null;
        }

// console.log(data)
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
                <div className='flex justify-start items-center'>
                    <Link href={route('orders.index')}>
                        <ArrowLongLeftIcon className='size-6' />
                    </Link>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Crear Pedido
                    </h2>
                </div>
            }
        >
            <Head className="capitalize" title="Pedido" />

            <Suspense fallback={<Loader />}>
                <form onSubmit={submit} className='space-y-6'> {/* Espaciado aumentado */}
                    {/* Renderiza el componente OrdersForm */}
                    <OrdersForm
                        products={products}
                        paymentMethods={paymentMethods}
                        users={users} // Pasa la prop users al OrdersForm
                        discounts={discounts} // Pasa los descuentos al OrdersForm
                        shippingRates={shippingRates}
                        stores={stores} // AGREGAR: Pasa las tiendas
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
            </Suspense>
        </AuthenticatedLayout>
    )
}