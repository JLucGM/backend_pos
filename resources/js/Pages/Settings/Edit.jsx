import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import SettingsForm from '@/Pages/Settings/SettingsForm';
import DivSection from '@/Components/ui/div-section';

export default function Edit({ setting }) {

    const initialValues = {
        app_name: setting.app_name,
        default_currency: setting.default_currency,
        admin_email: setting.admin_email,
        admin_phone: setting.admin_phone,
        shipping_base_price: setting.shipping_base_price,
    }

    // const items = [
    //     {
    //         name: 'Dashboard',
    //         href: 'dashboard',
    //         icon: {
    //             path: 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z',
    //         },
    //     },
    //     {
    //         name: 'Lista de usuario',
    //         href: 'setting.index',
    //         icon: {
    //             path: 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z',
    //         },
    //     },
    //     {
    //         name: 'Actualizar usuarios',
    //         icon: {
    //             path: 'M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z',
    //         },
    //     },
    // ];

    const { data, setData, errors, post } = useForm(initialValues)

    const submit = (e) => {
        e.preventDefault();
        post(route('setting.update', setting))
        // console.log(data)
    }
    
    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center '>
                    <div className="flex justify-start items-center">
                        {/* <Link href={route('settings.index')} >
                            <ArrowLongLeftIcon className='size-6' />
                        </Link> */}
                        <h2 className="ms-2 capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            {setting.app_name}
                        </h2>
                    </div>
                    {/* <Link href={route('setting.create')}
                        className="capitalize py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                        Crear
                    </Link> */}
                </div>
            }
        >
            {/* <Breadcrumb items={items} /> */}

            <Head className="capitalize" title={setting.app_name} />

            <div className="max-w-7xl mx-auto ">
                <div className=" overflow-hidden">
                    <div className="text-gray-900 dark:text-gray-100">
                        <form onSubmit={submit} >

                            <div className="grid grid-cols-1 gap-4">
                                <DivSection>
                                    <SettingsForm
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                        setting={setting}
                                    />
                                </DivSection>
                            </div>

                            <div className="flex justify-end p-2.5">
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() =>
                                        toast("Actualizado.", {
                                            description: "Se ha actualizado con éxito.",
                                        })
                                    }
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