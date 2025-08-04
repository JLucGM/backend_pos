import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import DivSection from '@/Components/ui/div-section';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import { lazy, Suspense } from 'react';
import Loader from '@/Components/ui/loader';
import { Separator } from '@/Components/ui/separator';
import { Badge } from '@/Components/ui/badge';

// Cargar el componente de forma diferida
const GiftCardsForm = lazy(() => import('./GiftCardsForm'));

export default function Edit({ giftCard, users }) {
    console.log(giftCard);
    const initialValues = {
        code: giftCard.code,
        description: giftCard.description,
        initial_balance: giftCard.initial_balance,
        expiration_date: giftCard.expiration_date,
        is_active: giftCard.is_active === 1, // Convertir 1 a true y 0 a false
        user_id: giftCard.user_id,
    };

    const { data, setData, errors, post } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        post(route('giftCards.update', giftCard), {
            onSuccess: () => {
                toast("Tarjeta de regalo actualizada con éxito.");
            },
            onError: (error) => {
                console.error("Error al actualizar la tarjeta de regalo:", error);
                toast.error("Error al actualizar la tarjeta de regalo.");
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center '>
                    <div className="flex justify-start items-center">
                        <Link href={route('giftCards.index')} >
                            <ArrowLongLeftIcon className='size-6' />
                        </Link>
                        <h2 className="mx-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Actualizar {giftCard.code}
                        </h2>
                        <Badge variant={giftCard.is_active === 1 ? 'success' : 'info'}>
                            {giftCard.is_active === 1 ? 'Publicado' : 'Borrador'}
                        </Badge>
                    </div>
                </div>
            }
        >
            <Head className="capitalize" title={`Actualizar tarjeta de regalo ${giftCard.code}`} />

            <DivSection className="grid grid-cols-3 smd:grid-cols-3">
                <div >
                    <h3>Saldo actual</h3>
                    <p className='font-semibold text-lg'>{giftCard.current_balance}</p>
                </div>
                <div >
                    <Separator orientation="vertical" className="h-full mx-auto" />
                </div>
                <div >
                    <h3>Saldo inicial</h3>
                    <p className='font-semibold text-lg'>{giftCard.initial_balance}</p>
                </div>

            </DivSection>
            <div className="text-gray-900 dark:text-gray-100">
                <form onSubmit={submit} className='space-y-4'>

                    <div className="grid grid-cols-1 gap-4">
                        <DivSection>
                            <Suspense fallback={<Loader />}>
                                <GiftCardsForm
                                    data={data}
                                    users={users}
                                    setData={setData}
                                    errors={errors} />
                            </Suspense>
                        </DivSection>
                    </div>

                    <div className="flex justify-end p-2.5">
                        <Button
                            variant="default"
                        >
                            Guardar
                        </Button>
                    </div>

                </form>
            </div>
        </AuthenticatedLayout>
    );
}
