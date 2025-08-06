import React, { Suspense, lazy } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, buttonVariants } from '@/Components/ui/button';
import { toast } from 'sonner';
import { ArrowLongLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/Components/ui/badge';
import Loader from '@/Components/ui/loader';
// Lazy load ProductsForm
const ProductsForm = lazy(() => import('./ProductsForm'));


export default function Edit({ product, categories, taxes }) {
    const selectedCategories = product.categories.map(category => category.id);

    const attributeMap = {};
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

    const stockMap = {};
    product.stocks.forEach(stock => {
        stockMap[stock.combination_id] = {
            quantity: stock.quantity,
            product_barcode: stock.product_barcode,
            product_sku: stock.product_sku,
        };
    });

    const mergedCombinationsData = product.combinations.map(combination => {
        const stockData = stockMap[combination.id] || { quantity: "0", product_barcode: '', product_sku: '' };
        return {
            ...combination, // Spread existing combination properties
            stock: stockData.quantity, // Add stock quantity
            product_barcode: stockData.product_barcode, // Add product barcode
            product_sku: stockData.product_sku, // Add product SKU
        };
    });
 
    const initialValues = {
        product_name: product.product_name,
        product_description: product.product_description,
        product_price: product.product_price || "0",
        product_price_discount: product.product_price_discount,
        status: product.status,
        product_status_pos: product.product_status_pos,
        product_sku: (product.stocks.length > 0 && product.stocks[0].combination_id == null) ? product.stocks[0].product_sku : '',
        product_barcode: (product.stocks.length > 0 && product.stocks[0].combination_id == null) ? product.stocks[0].product_barcode : '',
        categories: selectedCategories,
        quantity: (product.stocks.length > 0 && product.stocks[0].combination_id == null) ? product.stocks[0].quantity : 0,
        attribute_names: Object.keys(attributeMap),
        attribute_values: Object.values(attributeMap),
        prices: mergedCombinationsData.map(c => ({
            id: c.id,
            combination_price: c.combination_price,
            stock: c.stock,
            product_barcode: c.product_barcode,
            product_sku: c.product_sku,
            combination_attribute_value: c.combination_attribute_value // Keep original attribute values for display
        })),
        stocks: {},
        barcodes: {},
        skus: {},
        tax_id: product.tax_id || null,
    };

    mergedCombinationsData.forEach(combination => {
        initialValues.stocks[combination.id] = combination.stock;
        initialValues.barcodes[combination.id] = combination.product_barcode;
        initialValues.skus[combination.id] = combination.product_sku;
    });

    const { data, setData, errors, post, processing } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();

        post(route('products.update', product), {
            onSuccess: () => {
                toast("Producto actualizado con éxito.");
            },
            onError: (error) => {
                console.error("Error updating product:", error); // Log detailed error
                toast.error("Error al actualizar el producto.");
            }
        });
    };

    const handleDuplicate = () => {
        post(route('products.duplicate', product), {
            onSuccess: () => {
                toast("Producto duplicado con éxito."); // Updated toast message for duplication
            },
            onError: (error) => {
                console.error("Error duplicating product:", error); // Log detailed error
                toast.error("Error al duplicar el producto.");
            }
        });
    };

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
            <Head title={`Editar Producto ${product.product_name}`} />

            <Suspense fallback={<Loader />}>
                <div className="text-gray-900 dark:text-gray-100">
                    <form onSubmit={submit} className='space-y-4'>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <ProductsForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                categories={categories}
                                combinationsWithPrices={mergedCombinationsData}
                                product={product}
                                taxes={taxes}
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