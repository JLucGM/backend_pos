import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import CategoriesForm from './StatesForm';
import { Button } from '@/Components/ui/button';

export default function Create({ }) {

    const initialValues = {
        name: "",
    }

    const { data, setData, errors, post } = useForm(initialValues)

    const submit = (e) => {
        e.preventDefault();
        post(route('category.store'))
        // console.log(data)
    }
    
    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center px-6'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Crear Categoria
                    </h2>
                </div>
            }
        >
            <Head className="capitalize" title="Categoria" />

            <div className="max-w-7xl mx-auto">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
                    <div className="text-gray-900 dark:text-gray-100">
                        <form onSubmit={submit} className='space-y-4'>

                            <div className="grid grid-cols-2 gap-4">
                                <CategoriesForm data={data} setData={setData} errors={errors} />
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
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}