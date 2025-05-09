import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import DivSection from '@/Components/ui/div-section';

// Define SettingsForm as a lazy component
const SettingsForm = lazy(() => import('@/Pages/Settings/SettingsForm'));

export default function Edit({ setting }) {
    const initialValues = {
        app_name: setting.app_name,
        default_currency: setting.default_currency,
        admin_email: setting.admin_email,
        admin_phone: setting.admin_phone,
        shipping_base_price: setting.shipping_base_price,
    }

    const { data, setData, errors, post } = useForm(initialValues)

    const submit = (e) => {
        e.preventDefault();
        post(route('setting.update', setting), {
            onSuccess: () => {
                toast.success("Configuración actualizada exitosamente");
            },
            onError: (error) => {
                toast.error("Error al actualizar la configuración");
            }
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center '>
                    <div className="flex justify-start items-center">
                        <h2 className="ms-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            {setting.app_name}
                        </h2>
                    </div>
                </div>
            }
        >
            <Head className="capitalize" title={setting.app_name} />

            <div className="max-w-7xl mx-auto ">
                <div className=" overflow-hidden">
                    <div className="text-gray-900 dark:text-gray-100">
                        <form onSubmit={submit} >
                            <div className="grid grid-cols-1 gap-4">
                                <DivSection>
                                    <Suspense fallback={<div>Cargando formulario de configuración...</div>}>
                                        <SettingsForm
                                            data={data}
                                            setData={setData}
                                            errors={errors}
                                            setting={setting}
                                        />
                                    </Suspense>
                                </DivSection>
                            </div>

                            <div className="flex justify-end p-2.5">
                                <Button
                                    variant="default"
                                    size="sm"
                                    type="submit"
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