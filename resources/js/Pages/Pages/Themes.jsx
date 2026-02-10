import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react'; // Add Link import
import { buttonVariants } from '@/Components/ui/button';
import ThemeGallery from './partials/ThemeGallery';
import DivSection from '@/Components/ui/div-section';

export default function Themes({ themes, role, permission, currentThemeId, homepage }) {
    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>

                    <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight flex items-center gap-2">
                        Galería de Temas
                    </h2>

                    {homepage && permission.some(perm => perm.name === 'admin.pages.edit') && (
                        <div className="flex gap-2">
                            <Link
                                className={buttonVariants({ size: "sm" })}
                                href={route('pages.builder', homepage)}
                            >
                                Editar Tema
                            </Link>
                        </div>
                    )}
                </div>
            }
        >
            <Head className="capitalize" title="Galería de Temas" />

            <DivSection>
                <div className="mb-6">
                    <h3 className="text-lg font-medium">Selecciona un tema para tu sitio</h3>
                    <p className="text-gray-500 text-sm">El tema seleccionado se aplicará a todas las páginas dinámicas de tu sitio web.</p>
                </div>

                <ThemeGallery themes={themes} currentThemeId={currentThemeId} />
            </DivSection>

        </AuthenticatedLayout>
    );
}
