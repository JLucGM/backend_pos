import SettingsLayout from '@/Layouts/SettingsLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import DivSection from '@/Components/ui/div-section';
import Loader from '@/Components/ui/loader';

const CurrencyForm = lazy(() => import('@/Pages/Settings/CurrencyForm'));

export default function Currencies({ setting, currencies, companyCurrencies }) {
    const initialValues = {
        currency_id: setting.currency_id || '',
        name: setting.company.name, // Se necesita para la validación del controlador aunque no se edite aquí
        company_currencies: companyCurrencies || [],
        selected_currencies: (companyCurrencies || []).map(cc => cc.currency_id),
    }

    const { data, setData, errors, post } = useForm(initialValues)

    const submit = (e) => {
        e.preventDefault();
        post(route('setting.updateCurrencies', setting), {
            onSuccess: () => {
                toast.success("Configuración de monedas actualizada");
            }
        });
    }

    return (
        <SettingsLayout>
            <Head className="capitalize" title="Configuración de Monedas" />

            <div className="space-y-6">
                <form onSubmit={submit} className="space-y-6">
                    <DivSection>
                        <Suspense fallback={<Loader />}>
                            <CurrencyForm
                                data={data}
                                setData={setData}
                                errors={errors}
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
