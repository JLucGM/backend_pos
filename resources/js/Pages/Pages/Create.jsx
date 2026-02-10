import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import Loader from '@/Components/ui/loader';

// Define PagesForm como un componente cargado de forma lazy
const PagesForm = lazy(() => import('./PagesForm'));

export default function Create({ }) {
    const initialValues = {
        title: "",
        content: "",
        // is_default: "",
        is_published: false,
        // is_homepage: "",
    };

    const { data, setData, errors, post, recentlySuccessful } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        post(route('pages.store'), {
            onSuccess: () => {
                toast("Pagina actualizado con éxito.");
            },
            onError: () => {
                toast.error("Error al actualizar el pagina.");
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center '>
                    <div className="flex justify-start items-center">
                        <Link href={route('pages.index')} >
                            <ArrowLongLeftIcon className='size-6' />
                        </Link>
                        <h2 className="ms-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Crear página
                        </h2>
                    </div>
                </div>
            }
        >
            <Head className="capitalize" title="Crear página" />

            <div className=" text-gray-900 dark:text-gray-100">
                <form onSubmit={submit} className='space-y-4'>
                    <Suspense fallback={<Loader />}>
                        <PagesForm
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                    </Suspense>
                    <div className="flex justify-end p-2.5">
                        <Button
                            variant="default"
                        >
                            Guardar
                        </Button>
                    </div>
                </form>
            </div>

        </AuthenticatedLayout>
    );
}

