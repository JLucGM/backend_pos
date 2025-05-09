import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import DivSection from '@/Components/ui/div-section';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import { lazy, Suspense } from 'react';

// Cargar el componente de forma diferida
const CategoriesForm = lazy(() => import('./CategoriesForm'));

export default function Edit({ category }) {
    const initialValues = {
        category_name: category.category_name,
    }

    const { data, setData, errors, post } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        post(route('category.update', category));
    }

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center '>
                    <div className="flex justify-start items-center">
                        <Link href={route('category.index')} >
                            <ArrowLongLeftIcon className='size-6' />
                        </Link>
                        <h2 className="ms-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Actualizar {category.category_name}
                        </h2>
                    </div>
                </div>
            }
        >
            <Head className="capitalize" title="Categorias" />

            <div className="text-gray-900 dark:text-gray-100">
                <form onSubmit={submit} className='space-y-4'>

                    <div className="grid grid-cols-1 gap-4">
                        <DivSection>
                            <Suspense fallback={<div>Cargando formulario...</div>}>
                                <CategoriesForm data={data} setData={setData} errors={errors} />
                            </Suspense>
                        </DivSection>
                    </div>

                    <div className="flex justify-end p-2.5">
                        <Button
                            variant="default"
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
        </AuthenticatedLayout>
    )
}