import SettingsLayout from '@/Layouts/SettingsLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { lazy, Suspense } from 'react';
import Loader from '@/Components/ui/loader';
import DivSection from '@/Components/ui/div-section';

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
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Crear Staff</h2>
                    <p className="text-slate-500">Añade un nuevo miembro al personal administrativo de tu tienda.</p>
                </div>

                <form onSubmit={submit} className='space-y-6'>
                    <DivSection>
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
                    </DivSection>

                    <div className="flex justify-end pt-4 border-t">
                        <Button 
                            type="submit" 
                            disabled={processing}
                            size="lg"
                            className="px-12 rounded-xl shadow-xl shadow-blue-100"
                        >
                            {processing ? 'Guardando...' : 'Crear Usuario'}
                        </Button>
                    </div>
                </form>
            </div>
        </SettingsLayout>
    );
}