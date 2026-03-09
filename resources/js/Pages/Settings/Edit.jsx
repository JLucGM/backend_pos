import SettingsLayout from '@/Layouts/SettingsLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import DivSection from '@/Components/ui/div-section';
import Loader from '@/Components/ui/loader';

// Define SettingsForm as a lazy component
const SettingsForm = lazy(() => import('@/Pages/Settings/SettingsForm'));

export default function Edit({ setting, currencies, companyCurrencies }) {
    const initialValues = {
        name: setting.company.name,
        currency_id: setting.currency_id || '',
        email: setting.company.email,
        address: setting.company.address,
        phone: setting.company.phone,
        company_currencies: companyCurrencies || [],
        selected_currencies: (companyCurrencies || []).map(cc => cc.currency_id), // IDs de monedas activas
    }

    const { data, setData, errors, post } = useForm(initialValues)

    const submit = (e) => {
        e.preventDefault();
        post(route('setting.update', setting), {
            onSuccess: () => {
                toast.success("Configuración actualizada exitosamente");
            },
            onError: (error) => {
                console.error("Error al actualizar:", error);
                toast.error("Error al actualizar la configuración");
            }
        });
    }

    return (
        <SettingsLayout>
            <Head className="capitalize" title="Configuración General" />

            <div className="space-y-6">
                <form onSubmit={submit} className="space-y-6">
                    <DivSection>
                        <Suspense fallback={<Loader />}>
                            <SettingsForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                setting={setting}
                                currencies={currencies}
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