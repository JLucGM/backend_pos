import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, buttonVariants } from '@/Components/ui/button';
import { toast } from 'sonner';
import DivSection from '@/Components/ui/div-section';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import { lazy, Suspense } from 'react';
import Loader from '@/Components/ui/loader';
import { Badge } from '@/Components/ui/badge';
import { TrashIcon } from 'lucide-react';
import { formatDate } from '@/utils/dateFormatter';

// Cargar el componente de forma diferida
const DiscountsForm = lazy(() => import('./DiscountsForm'));

export default function Edit({ discount, products, categories }) {

    const initialValues = {
        name: discount.name,
        code: discount.code,
        description: discount.description,
        discount_type: discount.discount_type,
        value: discount.value,
        start_date: formatDate(discount.start_date), // Formatear la fecha de inicio
        end_date: formatDate(discount.end_date),
        automatic: discount.automatic,
        is_active: discount.is_active,
        usage_limit: discount.usage_limit,
        minimum_order_amount: discount.minimum_order_amount,
        applies_to: discount.applies_to,
        product_ids: discount.products.map(product => product.id) || [], // Obtener IDs de productos seleccionados
        category_ids: discount.categories.map(category => category.id) || [], // Obtener IDs de categorías seleccionadas
    }

    const { data, setData, errors, post } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        post(route('discounts.update', discount), {
            onSuccess: () => {
                toast("Descuento actualizado con éxito.");
            },
            onError: (error) => {
                console.error("Error al actualizar el descuento:", error);
                if (error.response && error.response.status === 422) {
                    toast.error("Por favor, corrige los errores en el formulario.");
                } else {
                    console.error("Error inesperado:", error);
                    toast.error("Error inesperado al actualizar el descuento.");
                }
                toast.error("Error al actualizar el descuento.");
            }
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Link href={route('discounts.index')} >
                            <ArrowLongLeftIcon className='size-6' />
                        </Link>
                        <h2 className="mx-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Actualizar {discount.name}
                        </h2>
                        <Badge variant={discount.is_active === 1 ? 'success' : 'info'}>
                            {discount.is_active === 1 ? 'Publicado' : 'Borrador'}
                        </Badge>
                    </div>
                    <div className="">
                        <Link
                            className={buttonVariants({ variant: "outlineDestructive" })}
                            href={route('discounts.destroy', [discount])} method='delete' as="button">
                            <TrashIcon className='size-6' />
                            Eliminar descuento
                        </Link>
                    </div>
                </div>
            }
        >
            <Head className="capitalize" title={`Descuento ${discount.name}`} />

            <div className="text-gray-900 dark:text-gray-100">
                <form onSubmit={submit} className='space-y-4'>

                    <div className="grid grid-cols-1 gap-4">
                        <DivSection>
                            <Suspense fallback={<Loader />}>
                                <DiscountsForm
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                    products={products}
                                    categories={categories}
                                />
                            </Suspense>
                        </DivSection>
                    </div>

                    <div className="flex justify-end p-2.5">
                        <Button
                            variant="default"
                        >
                            Guardar
                        </Button>
                    </div>

                </form>
            </div>
        </AuthenticatedLayout>
    )
}