import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, buttonVariants } from '@/Components/ui/button';
import { toast } from 'sonner';
import ProductsForm from './ProductsForm';
import { ArrowLongLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/Components/ui/badge';

export default function Edit({ product, taxes, categories, stores, combinationsWithPrices }) {
    const selectedCategories = product.categories.map(category => category.id);

    const attributeMap = {};
    // Agrupar atributos y valores
    product.combinations.forEach(combination => {
        combination.combination_attribute_value.forEach(attrValue => {
            if (attrValue.attribute_value && attrValue.attribute_value.attribute) {
                const attributeName = attrValue.attribute_value.attribute.attribute_name;
                const valueName = attrValue.attribute_value.attribute_value_name;

                if (!attributeMap[attributeName]) {
                    attributeMap[attributeName] = [];
                }

                if (!attributeMap[attributeName].includes(valueName)) {
                    attributeMap[attributeName].push(valueName);
                }
            }
        });
    });

    // Inicializar valores
    const initialValues = {
        product_name: product.product_name,
        product_description: product.product_description,
        product_price: product.product_price || "0",
        product_price_discount: product.product_price_discount,
        tax_id: product.tax_id,
        status: product.status,
        product_status_pos: product.product_status_pos,
        product_sku: (product.stocks[0].combination_id == null) ? product.stocks[0].product_sku : '', // Asegúrate de que este valor se asigne
        product_barcode: (product.stocks[0].combination_id == null) ? product.stocks[0].product_barcode : '', // Asegúrate de que este valor se asigne
        categories: selectedCategories,
        quantity: (product.stocks && product.stocks.length > 0) ? product.stocks[0].quantity : 0,
        store_id: (product.stocks && product.stocks.length > 0) ? product.stocks[0].store_id : null,
        attribute_names: Object.keys(attributeMap),
        attribute_values: Object.values(attributeMap),
        prices: combinationsWithPrices,
        stocks: {}, // Inicializa stocks como un objeto vacío
        barcodes: {}, // Nuevo campo para almacenar códigos de barras por combinación
        skus: {}, // Nuevo campo para almacenar SKUs por combinación
    };
    // Asigna el stock correspondiente
    for (const combination in combinationsWithPrices) {
        initialValues.stocks[combination] = combinationsWithPrices[combination].stock || 0; // Asigna el stock correspondiente
        initialValues.barcodes[combination] = combinationsWithPrices[combination].product_barcode || ''; // Asigna el código de barras correspondiente
        initialValues.skus[combination] = combinationsWithPrices[combination].product_sku || ''; // Asigna el SKU correspondiente
    }

    console.log(initialValues.stocks)

    // Usar useForm para manejar el estado del formulario
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

    const handleDuplicate = () => {
        post(route('products.duplicate', product), {
            onSuccess: () => {
                toast("Producto actualizado con éxito.");
            },
            onError: () => {
                toast.error("Error al actualizar el producto.");
            }
        });
    };

    // console.log("initialValues:", initialValues); // Verifica los valores iniciales
    // console.log("Form Data:", initialValues.stocks); // Verifica los datos del formulario
    // console.log("Initial Stocks:", initialValues.stocks); // Verifica los valores iniciales
    console.log(data)
    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center '>
                    <div className="flex items-center space-x-2">
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

                    <div className="">
                        <Button variant="ghost" onClick={handleDuplicate} >
                            Duplicar
                        </Button>

                        <Link
                            className={buttonVariants({ variant: "outlineDestructive" })}
                            href={route('products.destroy', [product])} method='delete' as="button">
                            <TrashIcon className='size-6' />
                            Eliminar producto
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Editar Producto" />

            <div className="text-gray-900 dark:text-gray-100">
                <form onSubmit={submit} className='space-y-4'>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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