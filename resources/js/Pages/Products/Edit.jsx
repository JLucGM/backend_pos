import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import ProductsForm from './ProductsForm';

export default function Edit({ product, taxes, categories }) {
    // Extraer las categorías asociadas al producto
    const selectedCategories = product.categories.map(category => category.id);

    const initialValues = {
        product_name: product.product_name,
        product_description: product.product_description,
        product_price: product.product_price, // Corrige aquí, debería ser product.product_price
        tax_id: product.tax_id,
        categories: selectedCategories // Establece las categorías seleccionadas
    };

    const { data, setData, errors, post } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        post(route('products.update', product)); // Asegúrate de enviar el ID del producto
    };
    console.log(data)
    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center '>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Actualizar producto
                    </h2>
                </div>
            }
        >
            <Head title="Productos" />

            <div className="max-w-7xl mx-auto ">
                <div className="bg-white dark:bg-gray-800 overflow-hidden">
                    <div className="text-gray-900 dark:text-gray-100">
                        <form onSubmit={submit} className='space-y-4'>
                            <div className="grid grid-cols-2 gap-4">
                                <ProductsForm data={data} setData={setData} errors={errors} taxes={taxes} categories={categories} />
                            </div>

                            <div className="flex justify-end p-2.5">
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        toast("Actualizado.", {
                                            description: "Se ha actualizado con éxito.",
                                        })
                                    }
                                >
                                    Guardar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}