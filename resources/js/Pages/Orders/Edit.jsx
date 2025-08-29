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
    // console.log(orders); // Para depuración

    const initialValues = {
        status: orders.status,
        tax_amount: parseFloat(orders.tax_amount) || 0, // Asegúrate de que sea un número
        total: parseFloat(orders.total) || 0,
        subtotal: parseFloat(orders.subtotal) || 0,
        totaldiscounts: parseFloat(orders.totaldiscounts) || 0,
        user_id: orders.user_id || null,
        payments_method_id: orders.payments_method_id || null,
        // order_items: orders.order_items ? orders.order_items.map(item => {
        //     const quantity = parseInt(item.quantity || 1);
        //     const priceProduct = parseFloat(item.price_product || 0);
        //     const calculatedSubtotal = quantity * priceProduct;
        //     return {
        //         id: String(item.id),
        //         product_id: item.product_id || null,
        //         name_product: item.name_product || '',
        //         product_price: priceProduct,
        //         quantity: quantity,
        //         subtotal: calculatedSubtotal,
        //         tax_amount: parseFloat(item.tax_amount || 0),
        //         combination_id: item.combination_id || null,
        //         product_details: item.product_details || null,
        //         is_combination: item.is_combination ?? (item.combination_id !== null),
        //     };
        // }) : [],
        order_items: orders.order_items ? orders.order_items.map(item => {
            const quantity = parseInt(item.quantity || 1);
            const priceProduct = parseFloat(item.price_product || 0);
            const taxRate = item.product && item.product.taxes
                ? parseFloat(item.product.taxes.tax_rate)
                : 0;
            const calculatedSubtotal = quantity * priceProduct;
            const calculatedTaxAmount = calculatedSubtotal * (taxRate / 100);

            return {
                id: String(item.id),
                product_id: item.product_id || null,
                name_product: item.name_product || '',
                product_price: priceProduct,
                quantity: quantity,
                subtotal: calculatedSubtotal,
                tax_rate: taxRate,
                tax_amount: calculatedTaxAmount,
                combination_id: item.combination_id || null,
                product_details: item.product_details || null,
                is_combination: item.is_combination ?? (item.combination_id !== null),
                product: item.product || null, // Mantener referencia al producto
            };
        }) : [],

    };

    const { data, setData, errors, post, processing } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        console.log(data);
        post(route('orders.update', orders.id), {
            _method: 'put', // Esto es crucial para que Laravel reconozca la petición como PUT
            onSuccess: () => {
                toast.success("Pedido actualizado con éxito.");
            },
            onError: (err) => {
                console.error("Error updating order:", err); // Para depuración
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