import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { lazy, Suspense } from 'react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import Loader from '@/Components/ui/loader';
import DivSection from '@/Components/ui/div-section';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';

const DiscountsForm = lazy(() => import('./DiscountsForm'));

export default function Create({ products, categories }) {
    // console.log('Products con combinations:', products); // Debug

    const initialValues = {
        name: "",
        slug: "",
        description: "",
        discount_type: "percentage",
        value: "",
        applies_to: "product",
        start_date: new Date(),
        end_date: new Date(),
        automatic: false,
        minimum_order_amount: 0,
        usage_limit: 1,
        code: "",
        is_active: 0,
        product_selections: [], // NUEVO: Array de {product_id, combination_id} – directo para pivot
        category_ids: [],
    };

    const { data, setData, errors, post } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        // console.log('Submit con selections:', data); // Debug array
        post(route('discounts.store'), {
            onSuccess: () => toast.success("Descuento creado con éxito."),
            onError: (error) => {
                console.error('Error:', error);
                toast.error("Error al crear el descuento.");
            }
        });
    };

    return (
        <AuthenticatedLayout header={
            <div className='flex justify-between items-center'>
                <div className="flex justify-start items-center">
                    <Link href={route('discounts.index')}>
                        <ArrowLongLeftIcon className='size-6' />
                    </Link>
                    <h2 className="ms-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Crear descuento
                    </h2>
                </div>
            </div>
        }>
            <Head title="Descuento" />

            <div className="max-w-7xl mx-auto">
                <div className="text-gray-900 dark:text-gray-100">
                    <form onSubmit={submit} className='space-y-4'>
                        <Suspense fallback={<Loader />}>
                            <DiscountsForm
                                data={data}
                                products={products}
                                categories={categories}
                                setData={setData}
                                errors={errors}
                            />
                        </Suspense>

                        <div className="flex justify-end p-2.5">
                            <Button variant="default" type="submit">
                                Guardar
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
