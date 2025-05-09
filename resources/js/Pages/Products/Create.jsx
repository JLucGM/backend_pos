import React, { Suspense, lazy } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';

// Lazy load ProductsForm
const ProductsForm = lazy(() => import('./ProductsForm'));

export default function Create({ taxes, categories, stores }) {
    const { data, setData, errors, post, processing } = useForm({
        product_name: "",
        product_description: "",
        product_price: "0",
        product_price_discount: "",
        product_sku: "",
        product_barcode: "",
        barcodes: {}, // Nuevo campo para almacenar códigos de barras por combinación
        skus: {}, // Nuevo campo para almacenar SKUs por combinación
        status: 0,
        product_status_pos: 0,
        categories: categories.length > 0 ? [categories[0].id] : [],
        attribute_names: [""],
        attribute_values: [[]],
        // tax_id: taxes.length > 0 ? taxes[0].id : null,
        tax_id: 1,
        quantity: 0,
        store_id: stores.length > 0 ? stores[0].id : null,
        prices: {},
        stocks: {},
        images: []
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('products.store'), {
            onSuccess: () => {
                toast("Producto creado con éxito.");
            },
            onError: () => {
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

            <div className="text-gray-900 dark:text-gray-100">
                <form onSubmit={submit} className='space-y-4'>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Suspense fallback={<div>Cargando formulario...</div>}>
                            <ProductsForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                taxes={taxes}
                                categories={categories}
                                stores={stores}
                            />
                        </Suspense>
                    </div>

                    <div className="flex justify-end p-2.5">
                        <Button variant="default" type="submit" disabled={processing}>
                            {processing ? "Guardando..." : "Guardar"}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
