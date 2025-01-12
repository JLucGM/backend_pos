import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import ProductsForm from './ProductsForm';
import { toast } from 'sonner';

export default function Create({ taxes, categories }) {
    const { data, setData, errors, post } = useForm({
        product_name: "",
        product_description: "",
        product_price: "",
        tax_id: taxes[0].id,
        categories: categories.length > 0 ? [categories[0].id] : [],
        attribute_names: [""],
        attribute_values: [[]], // Inicializa como un array de arrays
        product_price_discount: "",
        status: 0,
    });

    const addAttribute = () => {
        setData('attribute_names', [...data.attribute_names, ""]);
        setData('attribute_values', [...data.attribute_values, [""]]); // Inicializa un nuevo array para los valores
    };

    const handleAttributeChange = (index, value) => {
        const newAttributes = [...data.attribute_names];
        newAttributes[index] = value;
        setData('attribute_names', newAttributes);
    };

    const handleAttributeValueChange = (attributeIndex, valueIndex, value) => {
        const newValues = [...data.attribute_values];
        newValues[attributeIndex][valueIndex] = value;
        setData('attribute_values', newValues);
    };

    const addAttributeValue = (index) => {
        const newValues = [...data.attribute_values];
        newValues[index].push(""); // Agrega un nuevo valor vacío para el atributo
        setData('attribute_values', newValues);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('products.store'));
    };
    console.log(data)
    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Crear Producto
                    </h2>
                </div>
            }
        >
            <Head className="capitalize" title="Producto" />

            <div className="text-gray-900 dark:text-gray-100">
                <form onSubmit={submit} className='space-y-4'>
                    <div className="grid grid-cols-3 gap-4">
                        <ProductsForm
                            data={data}
                            setData={setData}
                            errors={errors}
                            taxes={taxes}
                            categories={categories}
                            addAttribute={addAttribute}
                            handleAttributeChange={handleAttributeChange}
                            handleAttributeValueChange={handleAttributeValueChange} // Asegúrate de pasar esto
                            addAttributeValue={addAttributeValue} // Asegúrate de pasar esto
                        />
                    </div>

                    <div className="flex justify-end p-2.5">
                        <Button
                            variant="default"
                            onClick={() =>
                                toast("Creado.", {
                                    description: "Se ha creado con éxito.",
                                })
                            }
                        >
                            Guardar
                        </Button>
                    </div>
                </form>
            </div>

        </AuthenticatedLayout>
    );
}