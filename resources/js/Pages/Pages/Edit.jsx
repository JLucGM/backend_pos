import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SettingsLayout from '@/Layouts/SettingsLayout'; // Importar el nuevo layout
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import DivSection from '@/Components/ui/div-section';
import Loader from '@/Components/ui/loader';

// Define PagesForm como un componente cargado de forma lazy
const PagesForm = lazy(() => import('./PagesForm'));

export default function Edit({ page }) {
    const isPolicy = page.page_type === 'policy';
    const Layout = isPolicy ? SettingsLayout : AuthenticatedLayout;

    const initialValues = {
        title: page.title,
        content: page.content,
        is_published: page.is_published,
    };

    const { data, setData, errors, post, processing } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        post(route('pages.update', page), {
            onSuccess: () => {
                toast.success("Página actualizada con éxito.");
            },
            onError: () => {
                toast.error("Error al actualizar la página.");
            }
        });
    };

    return (
        <Layout
            {...(!isPolicy && {
                header: (
                    <div className='flex justify-between items-center '>
                        <div className="flex justify-start items-center">
                            <Link href={route('pages.index')} >
                                <ArrowLongLeftIcon className='size-6' />
                            </Link>
                            <h2 className="ms-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                                {page.title}
                            </h2>
                        </div>
                    </div>
                )
            })}
        >
            <Head className="capitalize" title={isPolicy ? `Editar Política: ${page.title}` : page.title} />

            <div className={isPolicy ? "space-y-6" : "text-gray-900 dark:text-gray-100"}>
                {isPolicy && (
                    <div className="flex justify-start items-center">
                        <Link href={route('policy.index')} >
                            <ArrowLongLeftIcon className='size-6' />
                        </Link>
                        <h2 className="ms-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Editar Política</h2>
                    </div>
                )}

                <form onSubmit={submit} className='space-y-6'>
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
                            disabled={processing}
                        >
                            {processing ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

