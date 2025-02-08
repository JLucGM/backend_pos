import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import ProductsForm from './ProductsForm';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/Components/ui/badge';

export default function Edit({ product, taxes, categories, stores, combinationsWithPrices }) {
    const selectedCategories = product.categories.map(category => category.id);

    const attributeMap = {};
    // Agrupar atributos y valores
    product.combinations.forEach(combination => {
        combination.combination_attribute_value.forEach(attrValue => {
            // Verificar si attribute_value y attribute están definidos
            if (attrValue.attribute_value && attrValue.attribute_value.attribute) {
                const attributeName = attrValue.attribute_value.attribute.attribute_name;
                const valueName = attrValue.attribute_value.attribute_value_name;

                // Si el atributo no existe en el mapa, inicialízalo
                if (!attributeMap[attributeName]) {
                    attributeMap[attributeName] = [];
                }

                // Agregar el valor si no está ya en la lista
                if (!attributeMap[attributeName].includes(valueName)) {
                    attributeMap[attributeName].push(valueName);
                }
            } 
        });
    });

    const initialValues = {
        product_name: product.product_name,
        product_description: product.product_description,
        product_price: product.product_price,
        product_price_discount: product.product_price_discount,
        tax_id: product.tax_id,
        status: product.status,
        categories: selectedCategories,
        quantity: (product.stocks && product.stocks.length > 0) ? product.stocks[0].quantity : 0,
        store_id: (product.stocks && product.stocks.length > 0) ? product.stocks[0].store_id : null,
        attribute_names: Object.keys(attributeMap), // Nombres de atributos únicos
        attribute_values: Object.values(attributeMap),
        prices: combinationsWithPrices,
    };

    const { data, setData, errors, post, processing } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        post(route('products.update', product), {
            onSuccess: () => {
                toast("Producto actualizado con éxito.");
            },
            onError: () => {
                toast.error("Error al actualizar el producto.");
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-start items-center '>
                    <Link href={route('products.index')} >
                        <ArrowLongLeftIcon className='size-6' />
                    </Link>
                    <h2 className="mx-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        {product.product_name}
                    </h2>
                    <Badge variant={product.status === 1 ? 'success' : 'info'}>
                        {product.status === 1 ? 'Publicado' : 'Borrador'}
                    </Badge>
                </div>
            }
        >
            <Head title="Editar Producto" />

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
                            combinationsWithPrices={combinationsWithPrices}
                            product={product}
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