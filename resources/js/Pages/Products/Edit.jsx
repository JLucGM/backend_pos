import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import ProductsForm from './ProductsForm';

export default function Edit({ product, taxes, categories }) {
    // Extraer las categorías asociadas al producto
    // console.log(product);
    const selectedCategories = product.categories.map(category => category.id);

    // Extraer los atributos y sus valores asociados al producto
    const attributeData = product.attributes.reduce((acc, attribute) => {
        // Verificar si el atributo ya existe en el acumulador
        const existingAttribute = acc.find(item => item.name === attribute.attribute_name);
        
        // Si existe, agregar los valores únicos
        if (existingAttribute) {
            const uniqueValues = new Set(existingAttribute.values);
            attribute.attribute_values.forEach(value => uniqueValues.add(value.attribute_value_name));
            existingAttribute.values = Array.from(uniqueValues); // Convertir de nuevo a array
        } else {
            // Si no existe, crear un nuevo objeto para el atributo
            acc.push({
                name: attribute.attribute_name,
                values: attribute.attribute_values.map(value => value.attribute_value_name)
            });
        }
        return acc;
    }, []);
console.log(attributeData);
    const initialValues = {
        product_name: product.product_name,
        product_description: product.product_description,
        product_price: product.product_price,
        tax_id: product.tax_id,
        categories: selectedCategories, // Establece las categorías seleccionadas
        attribute_names: attributeData.map(attr => attr.name), // Nombres de atributos
        attribute_values: attributeData.map(attr => attr.values) // Valores de atributos
    };

    const { data, setData, errors, post } = useForm(initialValues);

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

    const addAttribute = () => {
        setData('attribute_names', [...data.attribute_names, ""]); // Agrega un nuevo campo vacío
        setData('attribute_values', [...data.attribute_values, [""]]); // Inicializa un nuevo array para los valores
    };

    const addAttributeValue = (index) => {
        const newValues = [...data.attribute_values];
        newValues[index].push(""); // Agrega un nuevo valor vacío para el atributo
        setData('attribute_values', newValues);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('products.update', product)); // Asegúrate de enviar el ID del producto
    };

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
                            <div className="grid grid-cols-1 gap-4">
                                <ProductsForm 
                                    data={data} 
                                    setData={setData} 
                                    errors={errors} 
                                    taxes={taxes} 
                                    categories={categories}
                                    addAttribute={addAttribute}
                                    handleAttributeChange={handleAttributeChange}
                                    handleAttributeValueChange={handleAttributeValueChange}
                                    addAttributeValue={addAttributeValue}
                                />
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