import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState, Suspense, lazy } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import DivSection from '@/Components/ui/div-section';
import { Button } from '@/Components/ui/button';
import { categoriesColumns } from './Columns';
import Loader from '@/Components/ui/loader';

// Cargar los componentes de forma diferida
const DataTable = lazy(() => import('@/Components/DataTable'));
const CategoriesForm = lazy(() => import('./CategoriesForm'));

export default function Index({ categories, permission }) {
    let [isOpen, setIsOpen] = useState(false);
    const { data, setData, errors, post } = useForm({
        category_name: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('category.store'), {
            onSuccess: () => {
                toast("Categoría creado con éxito.");
            },
            onError: () => {
                toast.error("Error al crear el categoría.");
            }
        });
        setData({
            category_name: "",
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Categorias
                    </h2>
                    {permission.some(perm => perm.name === 'admin.category.create') && (
                        <Button variant="default" size="sm" onClick={() => setIsOpen(true)}>
                            Añadir categoria
                        </Button>
                    )}
                </div>
            }
        >
            <Head className="capitalize" title="Categorias" />

            <DivSection>
                {categories.length > 0 ? (
                    <Suspense fallback={<Loader />}>
                        <DataTable
                            columns={categoriesColumns}
                            data={categories}
                            routeEdit={'category.edit'}
                            routeDestroy={'category.destroy'}
                            editPermission={'admin.category.edit'}
                            deletePermission={'admin.category.delete'}
                            permissions={permission}
                        />
                    </Suspense>
                ) : (
                    <p>no hay nada</p>
                )}
            </DivSection>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50 ">
                <DialogBackdrop className="fixed inset-0 bg-black/40" />

                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="w-[40rem] space-y-4 border bg-white p-8 dark:bg-gray-800 rounded-2xl">
                        <DialogTitle className="text-lg font-bold text-gray-700 dark:text-gray-300 capitalize">Crear categoria</DialogTitle>
                        <Description className={'text-gray-700 dark:text-gray-300'}>Ingresa la información del categoria</Description>
                        <form onSubmit={submit} className='space-y-4'>

                            <Suspense fallback={<div>Cargando formulario...</div>}>
                                <CategoriesForm data={data} setData={setData} errors={errors} />
                            </Suspense>

                            <div className="flex justify-end p-2.5">
                                <Button
                                    variant="default"
                                >
                                    Guardar
                                </Button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </Dialog>
        </AuthenticatedLayout>
    )
}
