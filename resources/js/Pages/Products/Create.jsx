import React, { Suspense, lazy } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import Loader from '@/Components/ui/loader';

// Lazy load ProductsForm
const ProductsForm = lazy(() => import('./ProductsForm'));

export default function Create({ categories, taxes, stores }) {
    // Encontrar la tienda con ecommerce activo por defecto
    const defaultStore = stores.find(store => store.is_ecommerce_active) || stores[0];

    const { data, setData, errors, post, processing } = useForm({
        product_name: "",
        product_description: "",
        product_price: "0",
        product_price_discount: "",
        product_sku: "",
        product_barcode: "",
        is_active: false,
        product_status_pos: 0,
        categories: categories.length > 0 ? [categories[0].id] : [],
        attribute_names: [""],
        attribute_values: [[]],
        quantity: 0,
        // Para productos simples: datos por tienda
        stores_data: stores.reduce((acc, store) => ({
            ...acc,
            [store.id]: {
                quantity: 0,
                product_barcode: "",
                product_sku: ""
            }
        }), {}),
        // Para productos con atributos
        prices: [],
        current_store_id: defaultStore?.id || null,
        images: [],
        tax_id: taxes.length > 0 ? taxes[0].id : null,
    });

    const submit = (e) => {
        e.preventDefault();
        console.log('Enviando datos del nuevo producto:', data);
        post(route('products.store'), {
            onSuccess: () => {
                toast("Producto creado con éxito.");
            },
            onError: (error) => {
                console.error("Error al crear el producto:", error);
                toast.error("Error al crear el producto.");
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-start items-center'>
                    <Link href={route('products.index')} >
                        <ArrowLongLeftIcon className='size-6' />
                    </Link>
                    <h2 className="mx-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Crear Producto
                    </h2>
                </div>
            }
        >
            <Head title="Crear Producto" />

            <Suspense fallback={<Loader />}>
                <div className="text-gray-900 dark:text-gray-100">
                    <form onSubmit={submit} className='space-y-4'>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <ProductsForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                categories={categories}
                                taxes={taxes}
                                stores={stores}
                            />
                        </div>

                        <div className="flex justify-end p-2.5">
                            <Button variant="default" type="submit" disabled={processing}>
                                {processing ? "Guardando..." : "Guardar"}
                            </Button>
                        </div>
                    </form>
                </div>
            </Suspense>
        </AuthenticatedLayout>
    );
}