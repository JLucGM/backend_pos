import SettingsLayout from '@/Layouts/SettingsLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { lazy, Suspense } from 'react';
import Loader from '@/Components/ui/loader';
import DivSection from '@/Components/ui/div-section';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';

// Define UserForm como un componente cargado de forma lazy
const UserForm = lazy(() => import('./UserForm'));

export default function Create({ roles, role }) {
    const initialValues = {
        name: "",
        phone: "",
        email: "",
        identification: "",
        password: "",
        is_active: false,
        avatar: null,
        role: roles.length > 0 ? roles[0].id : null,
    };

    const { data, setData, errors, post, processing } = useForm(initialValues);

    const submit = (e) => {
        e.preventDefault();
        post(route('user.store'));
    };

    return (
        <SettingsLayout>
            <Head className="capitalize" title="Nuevo Staff" />

            <div className="space-y-6">
                <div className='flex justify-start items-center'>
                    <Link href={route('user.index')} >
                        <ArrowLongLeftIcon className='size-6' />
                    </Link>
                    <h2 className="mx-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Crear usuario
                    </h2>
                </div>

                <form onSubmit={submit} className='space-y-6'>
                    <Suspense fallback={<Loader />}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <UserForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                roles={roles}
                                role={role}
                            />
                        </div>
                    </Suspense>

                    <div className="flex justify-end p-2.5">
                        <Button
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? 'Guardando...' : 'Crear Usuario'}
                        </Button>
                    </div>
                </form>
            </div>
        </SettingsLayout>
    );
}