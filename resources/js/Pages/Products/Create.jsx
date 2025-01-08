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
                <div className='flex justify-between items-center px-6'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Crear Producto
                    </h2>
                </div>
            }
        >
            <Head className="capitalize" title="Producto" />

            <div className="max-w-7xl mx-auto">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
                    <div className="text-gray-900 dark:text-gray-100">
                        <form onSubmit={submit} className='space-y-4'>
                            <div className="grid grid-cols-1 gap-4">
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
                                    variant="outline"
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
                        {/* <Button type="button" onClick={addAttribute}>
                            Agregar Atributo
                        </Button> */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}