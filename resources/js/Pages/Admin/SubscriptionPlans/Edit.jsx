import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, buttonVariants } from '@/Components/ui/button';
import { toast } from 'sonner';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import { lazy, Suspense } from 'react';
import Loader from '@/Components/ui/loader';
import { Badge } from '@/Components/ui/badge';
import { TrashIcon } from 'lucide-react';

const SubscriptionPlanForm = lazy(() => import('./SubscriptionPlanForm'));


export default function Edit({ subscriptionPlan }) {
    const initialValues = {
        name: subscriptionPlan.name || '',
        description: subscriptionPlan.description || '',
        price: subscriptionPlan.price || 0,
        yearly_price: subscriptionPlan.yearly_price || 0,
        currency: subscriptionPlan.currency || 'USD',
        is_active: subscriptionPlan.is_active || false,
        is_trial: subscriptionPlan.is_trial || false,
        is_featured: subscriptionPlan.is_featured || false,
        trial_days: subscriptionPlan.trial_days || 0,
        features: subscriptionPlan.features || [],
        limits: subscriptionPlan.limits || {},
        sort_order: subscriptionPlan.sort_order || 0
    };


    const { data, setData, errors, post, processing } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.subscriptionPlan.update', subscriptionPlan), {
            onSuccess: () => {
                toast.success("Plan de suscripción actualizado con éxito.");
            },
            onError: (error) => {
                console.error("Error al actualizar:", error);
                toast.error("Error al actualizar el plan de suscripción. Revisa los errores.");
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Link href={route('admin.subscriptionPlan.index')}>
                            <ArrowLongLeftIcon className='size-6' />
                        </Link>
                        <h2 className="mx-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Actualizar {subscriptionPlan.name}
                        </h2>
                        <Badge variant={subscriptionPlan.is_active ? 'success' : 'info'}>
                            {subscriptionPlan.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
                    </div>
                    <div className="">
                        <Link
                            className={buttonVariants({ variant: "outlineDestructive" })}
                            href={route('admin.subscriptionPlan.destroy', [subscriptionPlan])} method='delete' as="button">
                            <TrashIcon className='size-6' />
                            Eliminar plan
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Editar ${subscriptionPlan.name}`} />

            <div className="max-w-7xl mx-auto">
                <div className="text-gray-900 dark:text-gray-100">
                    <form onSubmit={submit} className='space-y-4'>
                        <Suspense fallback={<Loader />}>
                            <SubscriptionPlanForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                isEdit={true}
                            />
                        </Suspense>

                        <div className="flex justify-end p-2.5 gap-2">
                            <Button variant="default" type="submit" disabled={processing}>
                                Actualizar
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
