import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/Components/ui/badge';
import { WalletCards } from 'lucide-react';
import Loader from '@/Components/ui/loader';

// Define OrdersForm as a lazy component
const OrdersForm = lazy(() => import('./OrdersForm'));

// Asegúrate de recibir 'products' y 'users' como props aquí
export default function Edit({ orders, paymentMethods, products, users }) {
    console.log(orders)
    // Inicialización de los valores del formulario
    const initialValues = {
        status: orders.status,
        total: parseFloat(orders.total || 0), // Asegurar que sea número
        direction_delivery: orders.direction_delivery || "",
        payments_method_id: orders.payments_method_id,
        subtotal: parseFloat(orders.subtotal || 0), // Asegurar que sea número
        totaldiscounts: parseFloat(orders.totaldiscounts || 0), // Asegurar que sea número
        user_id: orders.user_id || null, // Asegurar que user_id esté presente y sea null si no existe

        // Mapear order_items para asegurar tipos y presencia de campos, y recalcular subtotal
        order_items: orders.order_items ? orders.order_items.map(item => {
            const quantity = parseInt(item.quantity || 1);
            // Aseguramos que price_product se parsea correctamente
            const priceProduct = parseFloat(item.price_product || 0);
            const calculatedSubtotal = quantity * priceProduct;

            // console.log(`Edit.jsx Init - Item ID: ${item.id}, DB Price: ${item.price_product}, Parsed Price: ${priceProduct}, DB Qty: ${item.quantity}, Parsed Qty: ${quantity}, Calculated Subtotal: ${calculatedSubtotal}`);

            return {
                id: String(item.id), // Siempre como string para la validación de Laravel
                product_id: item.product_id || null, // Aseguramos que product_id esté presente
                name_product: item.name_product || '',
                product_price: priceProduct, // Usamos el precio parseado
                original_display_price: parseFloat(item.original_display_price || 0),
                quantity: quantity,
                subtotal: calculatedSubtotal, // Usamos el subtotal recalculado
                combination_id: item.combination_id || null,
                product_details: item.product_details || null,
                is_combination: item.is_combination ?? (item.combination_id !== null),
            };
        }) : [], // Asegura que order_items siempre sea un array
    };

    const { data, setData, errors, post, processing } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        // console.log("Submitting order data:", data); // Para depuración
        // Para actualizar un recurso existente, usa el método PUT o PATCH en Laravel.
        // Inertia.js lo maneja con _method: 'put' o '_method: 'patch'.
        post(route('orders.update', orders.id), {
            _method: 'put', // Esto es crucial para que Laravel reconozca la petición como PUT
            onSuccess: () => {
                toast.success("Pedido actualizado con éxito.");
            },
            onError: (err) => {
                console.error("Error updating order:", err); // Para depuración
                // Puedes mostrar errores específicos si 'err' los contiene
                if (err && err.errors) {
                    Object.values(err.errors).forEach(messages => {
                        messages.forEach(message => toast.error(message));
                    });
                } else {
                    toast.error("Error al actualizar el pedido. Por favor, revisa la consola para más detalles.");
                }
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

            <Suspense fallback={<Loader />}>
                <div className="max-w-7xl mx-auto ">
                    <div className=" overflow-hidden">
                        <div className=" text-gray-900 dark:text-gray-100">
                            <form onSubmit={submit} className='space-y-4'>
                                <div className="grid grid-cols-1 gap-4">
                                    <OrdersForm
                                        data={data}
                                        orders={orders}
                                        paymentMethods={paymentMethods}
                                        products={products}
                                        users={users}
                                        setData={setData}
                                        errors={errors}
                                    // Puedes añadir una prop isDisabled si quieres que los campos no sean editables en ciertas condiciones
                                    // isDisabled={false}
                                    />
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
            </Suspense>
        </AuthenticatedLayout>
    )
}