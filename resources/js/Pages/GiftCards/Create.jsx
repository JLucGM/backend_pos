import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { lazy, Suspense } from 'react';
import { Button, buttonVariants } from '@/Components/ui/button';
import { toast } from 'sonner';
import Loader from '@/Components/ui/loader';
import DivSection from '@/Components/ui/div-section';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';

// Cargar el componente de forma diferida
const GiftCardsForm = lazy(() => import('./GiftCardsForm'));

export default function Create({ users }) {
    const initialValues = {
        code: "",
        description: "",
        initial_balance: "10.00",
        // current_balance: "",
        expiration_date: "",
        is_active: false,
        user_id: null,
    }

    const { data, setData, errors, post } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        post(route('giftCards.store'), {
            onSuccess: () => {
                toast("Gift Card creada con éxito.");
            },
            onError: (error) => {
                console.error("Error al crear la Gift Card:", error);
                toast.error("Error al crear la Gift Card.");
            }
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-start items-center'>
                    <Link href={route('giftCards.index')}    >
                            <ArrowLongLeftIcon className='size-6' />
                        </Link>
                    <h2 className="mx-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Crear Gift Card
                    </h2>
                </div>
            }
        >
            <Head className="capitalize" title="Gift Card" />

            <div className="max-w-7xl mx-auto">
                <div className="text-gray-900 dark:text-gray-100">
                    <form onSubmit={submit} className='space-y-4'>

                        <div className="grid grid-cols-1 gap-4">
                            <Suspense fallback={<Loader />}>
                                <DivSection>
                                    <GiftCardsForm
                                        data={data}
                                        users={users}
                                        setData={setData}
                                        errors={errors}
                                    />
                                </DivSection>
                            </Suspense>
                        </div>

                        <div className="flex justify-end p-2.5">
                            <Button
                                variant="default">
                                Guardar
                            </Button>
                        </div>

                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}