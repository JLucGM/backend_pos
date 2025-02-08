import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import ProductsForm from './ProductsForm';
import { toast } from 'sonner';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';

export default function Create({ taxes, categories, stores }) {
    const { data, setData, errors, post, processing } = useForm({
        product_name: "",
        product_description: "",
        product_price: "",
        product_price_discount: "",
        status: 0,
        categories: categories.length > 0 ? [categories[0].id] : [],
        attribute_names: [""],
        attribute_values: [[]],
        tax_id: taxes.length > 0 ? taxes[0].id : null,
        quantity: 0,
        store_id: stores.length > 0 ? stores[0].id : null,
        prices: {},
        images: []
    });
    const submit = (e) => {
        e.preventDefault();
        // console.log(data); // Verifica el contenido de data aquí
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
                    <div className="grid grid-cols-3 gap-4">
                        <ProductsForm
                            data={data}
                            setData={setData}
                            errors={errors}
                            taxes={taxes}
                            categories={categories}
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
        </AuthenticatedLayout>
    );
}