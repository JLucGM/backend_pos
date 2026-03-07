import React, { Suspense, lazy } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, buttonVariants } from '@/Components/ui/button';
import { ArrowLongLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/Components/ui/badge';
import { toast } from 'sonner';
import Loader from '@/Components/ui/loader';

const CollectionForm = lazy(() => import('./CollectionForm'));

export default function Edit({ collection, products, categories, smartProducts = [], libraryMedia = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        title: collection.title || '',
        description: collection.description || '',
        type: collection.type || 'manual',
        conditions: collection.conditions || [],
        conditions_match: collection.conditions_match || 'all',
        is_active: !!collection.is_active,
        starts_at: collection.starts_at || '',
        ends_at: collection.ends_at || '',
        product_ids: collection.type === 'manual'
            ? (collection.products ?? []).map((p) => p.id)
            : [],
        library_media_ids: [],
        // SEO fields
        meta_title: collection.meta_title || "",
        meta_description: collection.meta_description || "",
        meta_keywords: collection.meta_keywords || [],
        og_title: collection.og_title || "",
        og_description: collection.og_description || "",
        og_image: collection.og_image || "",
        twitter_title: collection.twitter_title || "",
        twitter_description: collection.twitter_description || "",
        twitter_image: collection.twitter_image || "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('collections.update', collection.slug), {
            onSuccess: () => toast('Colección actualizada con éxito.'),
            onError: () => toast.error('Error al actualizar la colección.'),
        });
    };

    const handleDelete = () => {
        if (!confirm('¿Estás seguro de eliminar esta colección?')) return;
        // uses Inertia Link method delete via the button
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Link href={route('collections.index')}>
                            <ArrowLongLeftIcon className="size-6" />
                        </Link>
                        <h2 className="mx-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            {collection.title}
                        </h2>
                        <Badge variant={collection.is_active ? 'success' : 'info'}>
                            {collection.is_active ? 'Activa' : 'Inactiva'}
                        </Badge>
                    </div>

                    <Link
                        className={buttonVariants({ variant: 'outlineDestructive' })}
                        href={route('collections.destroy', collection.slug)}
                        method="delete"
                        as="button"
                    >
                        <TrashIcon className="size-5" />
                        Eliminar colección
                    </Link>
                </div>
            }
        >
            <Head title={`Editar: ${collection.title}`} />

            <Suspense fallback={<Loader />}>
                <div className="text-gray-900 dark:text-gray-100">
                    <form onSubmit={submit} className="space-y-4">
                        <CollectionForm
                            data={data}
                            setData={setData}
                            errors={errors}
                            products={products}
                            categories={categories}
                            smartProducts={smartProducts}
                            collection={collection}
                            libraryMedia={libraryMedia}
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
