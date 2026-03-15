import SettingsLayout from '@/Layouts/SettingsLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import DivSection from '@/Components/ui/div-section';
import Loader from '@/Components/ui/loader';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';

// Define TaxesForm as a lazy component
const TaxesForm = lazy(() => import('./TaxesForm'));

export default function Edit({ tax }) {
    const initialValues = {
        tax_name: tax.tax_name,
        tax_description: tax.tax_description,
        tax_rate: tax.tax_rate,
    }

    const { data, setData, errors, post, processing } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        post(route('tax.update', tax), {
            onSuccess: () => {
                toast.success("Impuesto actualizado con éxito");
            },
            onError: (error) => {
                toast.error("Error al actualizar impuesto");
            }
        });
    }

    return (
        <SettingsLayout>
            <Head className="capitalize" title={`Editar ${tax.tax_name}`} />

            <div className="space-y-6">
                <div className='flex justify-start items-center'>

                    <Link href={route('products.index')} >
                        <ArrowLongLeftIcon className='size-6' />
                    </Link>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Actualizar Impuesto: {tax.tax_name}</h2>
                </div>

                <form onSubmit={submit} className='space-y-6'>
                    <DivSection>
                        <Suspense fallback={<Loader />}>
                            <TaxesForm data={data} setData={setData} errors={errors} />
                        </Suspense>
                    </DivSection>

                    <div className="flex justify-end pt-4 border-t">
                        <Button
                            variant="default"
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? "Guardando..." : "Guardar"}
                        </Button>
                    </div>
                </form>
            </div>
        </SettingsLayout>
    )
}