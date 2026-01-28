import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { lazy, Suspense } from 'react'
import { buttonVariants } from '@/Components/ui/button';
import { pagesColumns } from './Columns';
import DivSection from '@/Components/ui/div-section';
import Loader from '@/Components/ui/loader';

const DataTable = lazy(() => import('@/Components/DataTable'));
import { Palette } from 'lucide-react';

export default function Index({ pages, permission }) {
    // console.log(pages);
    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Gestión de Sitio
                    </h2>
                    {permission.some(perm => perm.name === 'admin.pages.create') && (
                        <div className="flex gap-2">
                            <Link
                                className={buttonVariants({ variant: "outline", size: "sm" })}
                                href={route('pages.themes')}
                            >
                                <Palette className="w-4 h-4 mr-2" />
                                Temas
                            </Link>
                            <Link className={buttonVariants({ variant: "default", size: "sm" })} href={route('pages.create')}
                            >
                                Crear Página
                            </Link>
                        </div>
                    )}
                </div>
            }
        >
            <Head className="capitalize" title="Gestión de Sitio" />

            <Suspense fallback={<Loader />}>
                <DivSection>
                    {pages.length > 0 ? (
                        <DataTable
                            columns={pagesColumns}
                            data={pages}
                            routeEdit={'pages.edit'}
                            routeDestroy={'pages.destroy'}
                            editPermission={'admin.pages.edit'}
                            deletePermission={'admin.pages.delete'}
                            permissions={permission}
                        />
                    ) : (
                        null
                    )}
                </DivSection>
            </Suspense>

        </AuthenticatedLayout>
    )
}