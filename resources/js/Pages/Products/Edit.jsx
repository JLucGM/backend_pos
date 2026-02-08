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

export default function Edit({ product, categories, taxes, stores, combinationsData }) {
    const selectedCategories = product.categories.map(category => category.id);

    // Encontrar la tienda con ecommerce activo por defecto
    const defaultStore = stores.find(store => store.is_ecommerce_active) || stores[0];

    // Preparar datos de stocks por tienda para productos simples
    // Filtrar stocks simples (sin combination_id)
    const simpleStocks = product.stocks.filter(stock => stock.combination_id === null);

    // Crear objeto stores_data con los datos de stocks existentes
    const initialStoresData = {};
    stores.forEach(store => {
        // Buscar stock para esta tienda - ahora buscamos por store_id
        // Si no encuentra por store_id, asignamos valores por defecto
        const stock = simpleStocks.find(s => s.store_id === store.id);

        initialStoresData[store.id] = {
            quantity: stock ? stock.quantity : 0,
            product_barcode: stock ? stock.product_barcode : '',
            product_sku: stock ? stock.product_sku : '',
        };
    });

    // Si no se encontraron stocks con store_id, pero tenemos stocks, asignamos el primero a la primera tienda
    // Esto es un fallback temporal hasta que los datos se corrijan
    if (simpleStocks.length > 0 && Object.values(initialStoresData).every(data => data.quantity === 0)) {
        // console.log('Usando fallback: asignando stocks existentes a tiendas');
        stores.forEach((store, index) => {
            if (simpleStocks[index]) {
                initialStoresData[store.id] = {
                    quantity: simpleStocks[index].quantity,
                    product_barcode: simpleStocks[index].product_barcode || '',
                    product_sku: simpleStocks[index].product_sku || '',
                };
            }
        });
    }

    // Extraer atributos de las combinaciones si existen
    let attributeNames = [];
    let attributeValues = [];

    if (combinationsData.length > 0) {
        const attributeMap = {};
        combinationsData.forEach(combination => {
            combination.combination_attribute_value.forEach(attrVal => {
                const attributeName = attrVal.attribute_value.attribute.attribute_name;
                const valueName = attrVal.attribute_value.attribute_value_name;

                if (!attributeMap[attributeName]) {
                    attributeMap[attributeName] = new Set();
                }
                attributeMap[attributeName].add(valueName);
            });
        });

        attributeNames = Object.keys(attributeMap);
        attributeValues = Object.values(attributeMap).map(set => Array.from(set));
    }

    // Para productos simples, usar el primer stock como datos base (para compatibilidad con formulario)
    const firstSimpleStock = simpleStocks.length > 0 ? simpleStocks[0] : null;

    const initialValues = {
        product_name: product.product_name,
        product_description: product.product_description,
        product_price: product.product_price || "0",
        product_price_discount: product.product_price_discount,
        is_active: product.is_active,
        product_status_pos: product.product_status_pos,
        categories: selectedCategories,
        // Para productos simples: datos por tienda
        stores_data: initialStoresData,
        // Para compatibilidad con campos antiguos (se usarán solo si hay una sola tienda)
        product_sku: firstSimpleStock ? firstSimpleStock.product_sku : '',
        product_barcode: firstSimpleStock ? firstSimpleStock.product_barcode : '',
        quantity: firstSimpleStock ? firstSimpleStock.quantity : 0,
        // Para productos con atributos
        attribute_names: attributeNames,
        attribute_values: attributeValues,
        prices: combinationsData,
        current_store_id: defaultStore?.id || null,
        tax_id: product.tax_id || null,
    };

    const { data, setData, errors, post, processing } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        console.log('Datos enviados:', data);
        post(route('products.update', product), {
            onSuccess: () => {
                toast("Producto actualizado con éxito.");
            },
            onError: (error) => {
                console.error("Error updating product:", error);
                toast.error("Error al actualizar el producto.");
            }
        });
    };

    const handleDuplicate = () => {
        post(route('products.duplicate', product), {
            onSuccess: () => {
                toast("Producto duplicado con éxito.");
            },
            onError: (error) => {
                console.error("Error duplicating product:", error);
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
                        <Badge variant={product.is_active === true ? 'success' : 'info'}>
                            {product.is_active === true ? 'Publicado' : 'Borrador'}
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
                                taxes={taxes}
                                stores={stores}
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
            </Suspense>
        </AuthenticatedLayout>
    );
}