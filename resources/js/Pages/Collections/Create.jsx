import React, { Suspense, lazy } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import Loader from '@/Components/ui/loader';

const CollectionForm = lazy(() => import('./CollectionForm'));

export default function Create({ products, categories }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        type: 'manual',
        conditions: [],
        conditions_match: 'all',
        is_active: true,
        starts_at: '',
        ends_at: '',
        product_ids: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('collections.store'), {
            onSuccess: () => toast('Colección creada con éxito.'),
            onError: () => toast.error('Error al crear la colección.'),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-start items-center">
                    <Link href={route('collections.index')}>
                        <ArrowLongLeftIcon className="size-6" />
                    </Link>
                    <h2 className="mx-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Nueva colección
                    </h2>
                </div>
            }
        >
            <Head title="Nueva colección" />

            <Suspense fallback={<Loader />}>
                <div className="text-gray-900 dark:text-gray-100">
                    <form onSubmit={submit} className="space-y-4">
                        <CollectionForm
                            data={data}
                            setData={setData}
                            errors={errors}
                            products={products}
                            categories={categories}
                        />

                        <div className="flex justify-end p-2.5">
                            <Button variant="default" type="submit" disabled={processing}>
                                {processing ? 'Guardando...' : 'Guardar'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Suspense>
        </AuthenticatedLayout>
    );
}
