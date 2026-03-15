import SettingsLayout from '@/Layouts/SettingsLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, buttonVariants } from '@/Components/ui/button';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';
import Loader from '@/Components/ui/loader';
import { Badge } from '@/Components/ui/badge';
import { TrashIcon } from 'lucide-react';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';

// Define PaymentMethodForm como un componente cargado de forma lazy
const PaymentMethodForm = lazy(() => import('./PaymentMethodForm'));

export default function Edit({ payment_method }) {
    const initialValues = {
        payment_method_name: payment_method.payment_method_name,
        description: payment_method.description || "",
        is_active: payment_method.is_active,
    };

    const { data, setData, errors, post, processing } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        post(route('paymentmethod.update', payment_method), {
            onSuccess: () => {
                toast.success("Método de pago actualizado con éxito.");
            },
            onError: (err) => {
                console.error("Error al actualizar el método de pago:", err);
                toast.error("Error al actualizar el método de pago.");
            },
        });
    };

    return (
        <SettingsLayout>
            <Head title={`Editar Pago: ${payment_method.payment_method_name}`} />

            <div className="space-y-6">
                <div className='flex justify-between items-start'>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <Link href={route('paymentmethod.index')} >
                                <ArrowLongLeftIcon className='size-6' />
                            </Link>
                            <h2 className="mx-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                                Editar Método de Pago
                            </h2>
                            <Badge variant={payment_method.is_active === true ? 'success' : 'info'}>
                                {payment_method.is_active === true ? 'Activo' : 'Inactivo'}
                            </Badge>
                        </div>
                        <p className="text-slate-500">Configura los detalles de <strong>{payment_method.payment_method_name}</strong>.</p>
                    </div>

                    <Link
                        className={buttonVariants({ variant: "outlineDestructive", size: "sm" })}
                        href={route('paymentmethod.destroy', [payment_method])}
                        method='delete'
                        as="button"
                    >
                        <TrashIcon className='size-4 mr-2' />
                        Eliminar
                    </Link>
                </div>

                <form onSubmit={submit} className='space-y-6'>
                    <Suspense fallback={<Loader />}>
                        <PaymentMethodForm
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                    </Suspense>

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
    );
}