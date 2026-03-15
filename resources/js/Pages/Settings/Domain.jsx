import SettingsLayout from '@/Layouts/SettingsLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import DivSection from '@/Components/ui/div-section';
import Loader from '@/Components/ui/loader';

const DomainForm = lazy(() => import('@/Pages/Settings/DomainForm'));

export default function Domain({ setting }) {
    const initialValues = {
        name: setting.company.name, // Requerido para validación
        subdomain: setting.company.subdomain || '',
        domain: setting.company.domain || '',
        currency_id: setting.currency_id, // Requerido para validación
    }

    const { data, setData, errors, post } = useForm(initialValues)

    const submit = (e) => {
        e.preventDefault();
        post(route('setting.updateDomain', setting), {
            onSuccess: () => {
                toast.success("Configuración de dominio actualizada");
            }
        });
    }

    return (
        <SettingsLayout>
            <Head className="capitalize" title="Configuración de Dominio" />

            <div className="space-y-6">
                <form onSubmit={submit} className="space-y-6">
                    <DivSection>
                        <Suspense fallback={<Loader />}>
                            <DomainForm
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                        </Suspense>
                    </DivSection>

                    <div className="flex justify-end pt-4 border-t">
                        <Button size="lg" className="px-12 rounded-xl shadow-xl shadow-blue-100">
                            Guardar Cambios
                        </Button>
                    </div>
                </form>
            </div>
        </SettingsLayout>
    )
}
