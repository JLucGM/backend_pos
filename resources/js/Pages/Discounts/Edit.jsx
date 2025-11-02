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
    console.log('Discount para edit:', discount); // Debug: Verifica products con pivot

    // NUEVO: Mapea product_selections desde discount.products (con pivot combination_id)
    const productSelections = discount.applies_to === 'product' ?
        discount.products.map(product => ({
            product_id: product.id,
            combination_id: product.pivot.combination_id // Del pivot (null para simples, ID para variables)
        })) : [];

    // Mapea category_ids desde discount.categories
    const categoryIds = discount.applies_to === 'category' ?
        discount.categories.map(category => category.id) : [];

    const initialValues = {
        name: discount.name || '',
        code: discount.code || '',
        description: discount.description || '',
        discount_type: discount.discount_type || 'percentage',
        value: discount.value || '',
        start_date: discount.start_date ? new Date(discount.start_date) : null, // Para DatePicker
        end_date: discount.end_date ? new Date(discount.end_date) : null,
        automatic: discount.automatic || false,
        is_active: discount.is_active || 0,
        usage_limit: discount.usage_limit || 0,
        minimum_order_amount: discount.minimum_order_amount || 0,
        applies_to: discount.applies_to || 'product',
        product_selections: productSelections, // NUEVO: Array de {product_id, combination_id} para edit
        category_ids: categoryIds, // Array de IDs para edit
    };

    const { data, setData, errors, post, processing } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        // console.log('Update data:', data); // Debug selections en edit
        post(route('discounts.update', discount), { // Usa ID para route
            onSuccess: () => {
                toast.success("Descuento actualizado con éxito.");
            },
            onError: (error) => {
                console.error("Error al actualizar:", error);
                toast.error("Error al actualizar el descuento. Revisa los errores.");
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Link href={route('discounts.index')}>
                            <ArrowLongLeftIcon className='size-6' />
                        </Link>
                        <h2 className="mx-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Actualizar {discount.name}
                        </h2>
                        <Badge variant={discount.is_active === true ? 'success' : 'info'}>
                            {discount.is_active === true ? 'Publicado' : 'Borrador'}
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
            <Head title={`Editar ${discount.name}`} />

            <div className="text-gray-900 dark:text-gray-100">
                <form onSubmit={submit} className='space-y-4'>
                    
                            <Suspense fallback={<Loader />}>
                                <DiscountsForm
                                    data={data}
                                    products={products} // Incluye combinations para options
                                    categories={categories}
                                    setData={setData}
                                    errors={errors}
                                    isEdit={true} // NUEVO: Prop para detectar modo edit (opcional, para lógica en form)
                                />
                            </Suspense>
                        

                    <div className="flex justify-end p-2.5 gap-2">
                        {/* <Link href={route('discounts.index')} className={buttonVariants({ variant: "outline" })}>
                            Cancelar
                        </Link> */}
                        <Button variant="default" type="submit" disabled={processing}>
                            Actualizar
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
