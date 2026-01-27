import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { lazy, Suspense } from 'react';
import Loader from '@/Components/ui/loader';
import MenusForm from './MenusForm';
import { toast } from 'sonner';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';

/**
 * @param {object} props
 * @param {object} props.menu - Objeto del menú (contiene id, name).
 * @param {Array<object>} props.menuItems - Array plano de los ítems existentes en DB (con parent_id y order).
 */
export default function Edit({ menu, menuItems, dynamicPages }) {
    const initialValues = {
        name: menu.name,
        // Enviamos el array plano (con id, parent_id, order) a MenusForm para que buildTree lo procese
        items: menuItems || [], 
    };
console.log(menu, menuItems)
    const { data, setData, errors, post, processing } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
console.log(data)
        // 🚨 CAMBIO CLAVE: Enviamos data.items que YA es la estructura anidada 
        // generada por MenusForm (vía handleTreeChange).
        
        const submissionData = {
            name: data.name,
            items: data.items, // Se envía la estructura ANIDADA y saneada
            _method: 'put', 
        };

        // Usamos la ruta de actualización
        post(route('menus.update', menu.id), submissionData, {
            onSuccess: () => {
                toast("Menú actualizado con éxito.");
            },
            onError: (err) => {
                console.error("Error al actualizar el menú:", err);
                toast.error("Error al actualizar el menú. Revisa los campos y enlaces.");
            }
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-start items-center'>
                    <Link href={route('menus.index')}>
                        <ArrowLongLeftIcon className='size-6' />
                    </Link>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Editando: {menu.name}
                    </h2>
                </div>
            }
        >
            <Head className="capitalize" title={`Editar ${menu.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <Suspense fallback={<Loader />}>
                            <form onSubmit={submit} className='space-y-4'>
                                <MenusForm
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                    dynamicPages={dynamicPages}
                                />

                                <div className="flex justify-end p-2.5">
                                    <Button disabled={processing}>
                                        {processing ? 'Actualizando...' : 'Guardar Cambios'}
                                    </Button>
                                </div>
                            </form>
                        </Suspense>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}