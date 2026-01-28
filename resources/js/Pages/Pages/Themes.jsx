import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react'; // Add Link import
import { buttonVariants } from '@/Components/ui/button';
import ThemeGallery from './partials/ThemeGallery';
import { Palette, ArrowLeft } from 'lucide-react';
import DivSection from '@/Components/ui/div-section';

export default function Themes({ themes, currentThemeId }) {
    return (
        <AuthenticatedLayout
            header={
                <div className='flex justify-between items-center'>
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('pages.index')}
                            className={buttonVariants({ variant: "ghost", size: "icon" })}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <h2 className="capitalize font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            Galería de Temas
                        </h2>
                    </div>
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
