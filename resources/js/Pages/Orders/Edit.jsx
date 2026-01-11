import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/Components/ui/badge';
import { WalletCards } from 'lucide-react';
import Loader from '@/Components/ui/loader';
import OrderStatusButtons from '@/Components/Orders/OrderStatusButtons';

const OrdersForm = lazy(() => import('./OrdersForm'));

export default function Edit({ orders, paymentMethods, products, users, discounts, shippingRates, appliedGiftCard  }) {
console.log(orders)
    const { flash } = usePage().props;
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);

    const initialValues = {
        status: orders.status,
        payment_status: orders.payment_status || 'pending',
        delivery_type: orders.delivery_type || 'delivery',
        tax_amount: parseFloat(orders.tax_amount) || 0,
        total: parseFloat(orders.total) || 0,
        subtotal: parseFloat(orders.subtotal) || 0,
        totaldiscounts: parseFloat(orders.totaldiscounts) || 0,
        totalshipping: parseFloat(orders.totalshipping) || 0,
        user_id: orders.user_id || null,
        payments_method_id: orders.payments_method_id || null,
        manual_discount_code: orders.manual_discount_code || null,
        manual_discount_amount: parseFloat(orders.manual_discount_amount) || 0,
         gift_card_id: appliedGiftCard?.id || null, // NUEVO: Desde appliedGiftCard
        gift_card_amount: parseFloat(appliedGiftCard?.amount_used) || 0, // NUEVO: Desde appliedGiftCard
        shipping_rate_id: orders.shipping_rate_id || null,
        order_items: orders.order_items ? orders.order_items.map((item, index) => {
            const quantity = parseInt(item.quantity || 1);
            const originalPrice = parseFloat(item.price_product || 0); // FIX: Original de DB price_product ($10)
            const discountedPrice = parseFloat(item.discounted_price || originalPrice); // Post-descuento ($9)
            const taxRate = item.product && item.product.taxes ? parseFloat(item.product.taxes.tax_rate) : 0;
            const calculatedSubtotal = parseFloat(item.subtotal || (quantity * discountedPrice)); // Preserva $9 post
            const calculatedTaxAmount = parseFloat(item.tax_amount || (calculatedSubtotal * (taxRate / 100)));

            // FIX: Parse product_details JSON para attributes_display (muestra variaciones)
            let attributesDisplay = null;
            if (item.product_details) {
                try {
                    const details = typeof item.product_details === 'string' ? JSON.parse(item.product_details) : item.product_details;
                    attributesDisplay = details.attributes || null;
                } catch (e) {
                    console.warn('Error parsing product_details:', e);
                }
            }

            const mappedItem = {
                id: String(item.id),
                product_id: item.product_id || null,
                name_product: item.name_product || '',
                product_price: originalPrice, // FIX CRÍTICO: Original $10 para columna "Precio Unitario" (tachado)
                original_price: originalPrice, // Opcional para recálculos
                discounted_price: discountedPrice, // $9 para post/tachado en columnas
                quantity: quantity,
                subtotal: calculatedSubtotal, // $9 post para "Subtotal"
                tax_rate: taxRate,
                tax_amount: calculatedTaxAmount, // $1.62
                discount_id: item.discount_id || null,
                discount_amount: parseFloat(item.discount_amount || 0), // $1 – Preserva de DB
                discount_type: item.discount_type || null,
                combination_id: item.combination_id || null,
                product_details: item.product_details || null,
                attributes_display: attributesDisplay, // FIX: Para mostrar "Talla S, Color Rojo" en DataTable
                categories: item.categories || (item.product?.categories || []),
                is_combination: item.combination_id !== null,
                product: item.product || null,
                index: index, // FIX: Agrega index para DataTable (qty/actions)
            };

            return mappedItem;
        }) : [],
    };

    const { data, setData, errors, post, processing } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();

        post(route('orders.update', orders), {
            _method: 'put',
            onSuccess: () => {
                toast.success('Pedido actualizado con éxito.');
            },
            onError: (err) => {
                console.error('Error updating order:', err);
                if (err && err.errors) {
                    Object.values(err.errors).forEach(messages => {
                        messages.forEach(message => toast.error(message));
                    });
                } else {
                    toast.error('Error al actualizar el pedido. Revisa la consola.');
                }
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <div className='flex justify-between items-center'>
                        <div className="flex justify-start items-center">
                            <Link href={route('orders.index')}>
                                <ArrowLongLeftIcon className='size-6' />
                            </Link>
                            <h2 className="ms-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                                #{orders.id}
                            </h2>
                            <Badge className='mx-2'>{orders.status}</Badge>
                            <Badge
                                variant={orders.payment_status === 'paid' ? 'success' : 'warning'}
                            >
                                {orders.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}
                            </Badge>
                        </div>
                        <OrderStatusButtons orders={orders} />
                    </div>
                    {/* <div className="flex items-center justify-start space-x-1 ps-7 mt-1">
                        <WalletCards className='size-4 text-gray-700' />
                        <p className='capitalize text-sm font-medium text-gray-700 dark:text-gray-300'>
                            {orders.order_origin} - {(orders.stores && orders.stores.length > 0 ? orders.stores[0].store_name : "Sin tienda")}
                        </p>
                    </div> */}
                </div>
            }
        >
            <Head className="capitalize" title={`Orden #${orders.id}`} />

            <Suspense fallback={<Loader />}>
                <form onSubmit={submit} className='space-y-4'>
                    <div className="grid grid-cols-1 gap-4">
                        <OrdersForm
                            data={data}
                            orders={orders}
                            paymentMethods={paymentMethods}
                            products={products}
                            users={users}
                            discounts={discounts}
                            shippingRates={shippingRates}
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
                        >
                            {processing ? "Guardando..." : "Guardar"}
                        </Button>
                    </div>
                </form>
            </Suspense>
        </AuthenticatedLayout>
    );
}