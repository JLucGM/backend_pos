import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react'; // Añadido Link
import { lazy, Suspense } from 'react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline'; // Añadido icono

// Cargar el componente de forma diferida
const CategoriesForm = lazy(() => import('./CategoriesForm'));

export default function Create() {
    const initialValues = {
        name: "",
    }

    const { data, setData, errors, post } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        post(route('category.store'), {
            onSuccess: () => {
                toast("Categoría creada con éxito.");
            },
            onError: () => {
                toast.error("Error al crear la categoría.");
            }
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-start items-center px-6'>
                    <Link href={route('category.index')} >
                        <ArrowLongLeftIcon className='size-6' />
                    </Link>
                    <h2 className="mx-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Crear Categoría
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
                                <Suspense fallback={<div>Cargando formulario...</div>}>
                                    <CategoriesForm data={data} setData={setData} errors={errors} />
                                </Suspense>
                            </div>

                            <div className="flex justify-end p-2.5">
                                <Button
                                    variant="outline"
                                    // onClick={() =>
                                    //     toast("Creado.", {
                                    //         description: "Se ha creado con éxito.",
                                    //     })
                                    // }
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