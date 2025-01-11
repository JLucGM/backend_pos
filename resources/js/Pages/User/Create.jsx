import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import UserForm from './UserForm';
import { Button } from '@/Components/ui/button';

export default function Create({ roles, role }) {

    const initialValues = {
        name: "",
        phone: "",
        email: "",
        password: "",
        status: 0, // o 1, dependiendo del valor predeterminado que desees
        avatar: null,
        role: "",
    }

    const { data, setData, errors, post } = useForm(initialValues)

    const submit = (e) => {
        e.preventDefault();
        post(route('user.store'))
        console.log(data)
    }
    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center px-6'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Crear Usuario
                    </h2>
                </div>
            }
        >
            <Head className="capitalize" title="Usuario" />

            <div className="text-gray-900 dark:text-gray-100">

                <form onSubmit={submit} className='space-y-4'>

                    <div className="grid grid-cols-3 gap-4">
                        <UserForm data={data} setData={setData} errors={errors} roles={roles} role={role} />
                    </div>

                    <div className="flex justify-end p-2.5">
                        <Button
                            variant="outline"
                            onClick={() =>
                                toast("Creado.", {
                                    description: "Se ha creado con éxito.",
                                })
                            }
                        >
                            Guardar
                        </Button>
                    </div>

                </form>
            </div>

        </AuthenticatedLayout>
    )
}