import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import DivSection from '@/Components/ui/div-section';
import Loader from '@/Components/ui/loader';

// Define TaxesForm as a lazy component
const TaxesForm = lazy(() => import('./TaxesForm'));

export default function Edit({ tax }) {
    const initialValues = {
        tax_name: tax.tax_name,
        tax_description: tax.tax_description,
        tax_rate: tax.tax_rate,
    }

    const { data, setData, errors, post } = useForm(initialValues);

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
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center '>
                    <div className="flex justify-start items-center">
                        <Link href={route('tax.index')} >
                            <ArrowLongLeftIcon className='size-6' />
                        </Link>
                        <h2 className="ms-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Actualizar {tax.tax_name}
                        </h2>
                    </div>
                </div>
            }
        >
            <Head className="capitalize" title="Impuesto" />

            <div className="max-w-7xl mx-auto ">
                <div className=" overflow-hidden">
                    <div className=" text-gray-900 dark:text-gray-100">
                        <form onSubmit={submit} className='space-y-4'>
                            <DivSection>
                                <Suspense fallback={<Loader />}>
                                    <TaxesForm data={data} setData={setData} errors={errors} />
                                </Suspense>
                            </DivSection>

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