import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import { lazy, Suspense } from 'react'; // Eliminamos 'useState'
import Loader from '@/Components/ui/loader';
import MenusForm from './MenusForm';
import { toast } from 'sonner';

export default function Create({ dynamicPages, role }) {
    const initialValues = {
        name: "",
        items: [], // <--- ¡AQUÍ ESTÁ LA CLAVE!
    };

    console.log(dynamicPages)
    // 'items' ahora es parte del objeto 'data'
    const { data, setData, errors, post, processing } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        // Enviamos 'data' directamente. Ya contiene { name: "...", items: [...] }
        post(route('menus.store'), {
            onSuccess: () => {
                toast("Menú creado con éxito.");
            },
            onError: (err) => {
                console.error("Error al crear el menú:", err);
                toast.error("Error al crear el menú. Revisa los campos y enlaces.");
            }
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-start items-center'>
                    <Link href={route('menus.index')}> {/* Cambiado a 'menus.index' */}
                        <ArrowLongLeftIcon className='size-6' />
                    </Link>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Crear Menú
                    </h2>
                </div>
            }
        >
            <Head className="capitalize" title="Crear menú" />

            <Suspense fallback={<Loader />}>
                <div className="text-gray-900 dark:text-gray-100">
                    <form onSubmit={submit} className='space-y-4'>
                        <MenusForm
                            data={data}
                            setData={setData}
                            errors={errors}
                            // role={role}
                            dynamicPages={dynamicPages}
                        />

                        <div className="flex justify-end p-2.5">
                            <Button disabled={processing}>
                                {processing ? 'Guardando...' : 'Guardar'}
                            </Button>
                        </div>
                    </form>
                </div>

            </Suspense>
        </AuthenticatedLayout>
    );
}