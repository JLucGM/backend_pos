import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
// import Breadcrumb from '@/Components/Breadcrumb';
import { ordersColumns } from './Columns';
import DivSection from '@/Components/ui/div-section';
import { Store } from 'lucide-react';

export default function Index({ orders, permission }) {

    // const { data, setData, errors, post } = useForm({
    //     country_name: "",
    // });

    // const items = [
    //     {
    //         name: 'Dashboard',
    //         href: 'dashboard',
    //         icon: {
    //             path: 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z',
    //         },
    //     },
    //     {
    //         name: 'Lista de usuarios',
    //         icon: {
    //             path: 'M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z',
    //         },
    //     },
    // ];

    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Pedidos
                    </h2>
                </div>
            }
        >
            {/* <Breadcrumb items={items} /> */}

            <Head className="capitalize" title="Pedidos" />

            <DivSection>
                {orders.length > 0 ? (
                    <DataTable
                        columns={ordersColumns}
                        data={orders}
                        routeEdit={'orders.edit'}
                        // routeDestroy={'orders.destroy'}
                        editPermission={'admin.orders.edit'} // Pasa el permiso de editar
                        // deletePermission={'admin.orders.delete'} // Pasa el permiso de eliminar
                        // downloadPdfPermission={'downloadPdfPermission'} // Pasa el permiso de descargar PDF
                        permissions={permission}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-96">
                        <Store size={64} />
                        <p>No hay órdenes registradas.</p>
                    </div>
                )}
            </DivSection>
        </AuthenticatedLayout>
    )
}