import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { lazy, Suspense } from 'react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import Loader from '@/Components/ui/loader';
import DivSection from '@/Components/ui/div-section';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';

const SubscriptionPlanForm = lazy(() => import('./SubscriptionPlanForm'));

export default function Create() {

    const initialValues = {
        name: "",
        description: "",
        price: 0,
        yearly_price: 0,
        currency: "USD",
        is_active: 1,
        is_trial: false,
        is_featured: false,
        trial_days: 0,
        features: [],
        limits: [],
        sort_order: 0
    };

    const { data, setData, errors, post } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        // console.log('Submit con selections:', data); // Debug array
        post(route('admin.subscriptionPlan.store'), {
            onSuccess: () => toast.success("Plan de suscripción creado con éxito."),
            onError: (error) => {
                console.error('Error:', error);
                toast.error("Error al crear el plan de suscripción.");
            }
        });
    };

    return (
        <AuthenticatedLayout header={
            <div className='flex justify-between items-center'>
                <div className="flex justify-start items-center">
                    <Link href={route('admin.subscriptionPlan.index')}>
                        <ArrowLongLeftIcon className='size-6' />
                    </Link>
                    <h2 className="ms-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Crear plan de suscripción
                    </h2>
                </div>
            </div>
        }>
            <Head title="Plan de suscripción" />

            <div className="max-w-7xl mx-auto">
                <div className="text-gray-900 dark:text-gray-100">
                    <form onSubmit={submit} className='space-y-4'>
                        <Suspense fallback={<Loader />}>
                            <SubscriptionPlanForm
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                        </Suspense>

                        <div className="flex justify-end p-2.5">
                            <Button variant="default" type="submit">
                                Guardar
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
