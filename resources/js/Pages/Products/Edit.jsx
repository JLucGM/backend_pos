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


export default function Edit({ product, taxes, categories, stores }) {
    // Log the initial product data to verify its structure
    console.log("Product data:", product);

    // Map selected categories for the form's initial state
    const selectedCategories = product.categories.map(category => category.id);

    // Create a map to group attributes and their values for display
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

    // --- START: Logic to merge stocks and combinations data ---
    // Create a map for quick lookup of stock data by combination_id
    // This allows us to easily find the stock, barcode, and SKU for each combination.
    const stockMap = {};
    product.stocks.forEach(stock => {
        stockMap[stock.combination_id] = {
            quantity: stock.quantity,
            product_barcode: stock.product_barcode,
            product_sku: stock.product_sku,
        };
    });

    // Merge combination data with stock data
    // This creates a new array where each combination object also includes its
    // corresponding stock quantity, barcode, and SKU.
    const mergedCombinationsData = product.combinations.map(combination => {
        // Find the stock data for the current combination, or use defaults if not found
        const stockData = stockMap[combination.id] || { quantity: "0", product_barcode: '', product_sku: '' };
        return {
            ...combination, // Spread existing combination properties
            stock: stockData.quantity, // Add stock quantity
            product_barcode: stockData.product_barcode, // Add product barcode
            product_sku: stockData.product_sku, // Add product SKU
        };
    });
    // --- END: Merging stocks and combinations data ---

    // Initialize form values using the product data and merged combinations
    const initialValues = {
        product_name: product.product_name,
        product_description: product.product_description,
        product_price: product.product_price || "0",
        product_price_discount: product.product_price_discount,
        tax_id: product.tax_id,
        status: product.status,
        product_status_pos: product.product_status_pos,
        // For products without combinations (simple products), use the first stock entry
        product_sku: (product.stocks.length > 0 && product.stocks[0].combination_id == null) ? product.stocks[0].product_sku : '',
        product_barcode: (product.stocks.length > 0 && product.stocks[0].combination_id == null) ? product.stocks[0].product_barcode : '',
        categories: selectedCategories,
        quantity: (product.stocks.length > 0 && product.stocks[0].combination_id == null) ? product.stocks[0].quantity : 0,
        store_id: (product.stocks.length > 0) ? product.stocks[0].store_id : null, // Assuming store_id is on stock
        attribute_names: Object.keys(attributeMap),
        attribute_values: Object.values(attributeMap),
        // Use mergedCombinationsData for the `prices` field in the form's state.
        // This array will now contain all details (price, stock, barcode, SKU, attributes) for each combination.
        prices: mergedCombinationsData.map(c => ({
            id: c.id,
            combination_price: c.combination_price,
            stock: c.stock,
            product_barcode: c.product_barcode,
            product_sku: c.product_sku,
            combination_attribute_value: c.combination_attribute_value // Keep original attribute values for display
        })),
        // Initialize stocks, barcodes, and skus as objects keyed by combination ID
        // This is useful if ProductsForm expects these as separate, keyed objects.
        stocks: {},
        barcodes: {},
        skus: {},
    };

    // Populate the `stocks`, `barcodes`, and `skus` objects in `initialValues`
    // using the data from `mergedCombinationsData`.
    mergedCombinationsData.forEach(combination => {
        initialValues.stocks[combination.id] = combination.stock;
        initialValues.barcodes[combination.id] = combination.product_barcode;
        initialValues.skus[combination.id] = combination.product_sku;
    });

    // Use `useForm` to manage the form's state, initialized with our prepared values
    const { data, setData, errors, post, processing } = useForm(initialValues);

    // Log the final `data` object after `useForm` initialization for debugging
    // console.log("data (after useForm init):", data);
    // Log the `mergedCombinationsData` that will be passed to ProductsForm
    // console.log("mergedCombinationsData (passed to ProductsForm):", mergedCombinationsData);

    // Handle form submission to update the product
    const submit = (e) => {
        e.preventDefault();
        console.log(data);
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

    // Handle product duplication
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
            <Head title="Editar Producto" />

            <Suspense fallback={<Loader />}>
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
                                // Pass the newly merged data to ProductsForm
                                combinationsWithPrices={mergedCombinationsData}
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