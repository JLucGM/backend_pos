// Layouts/GuestLayout.jsx
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children, testimonial }) {
    return (
        <div className="flex min-h-screen">
            {/* Columna izquierda - Formulario */}
            <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-lg lg:w-96">
                    <div className="mb-8">
                        <Link href="/">
                            {/* <ApplicationLogo className="h-10 w-10" /> */}
                            RUBICON
                        </Link>
                    </div>
                    {children}
                </div>
            </div>

            {/* Columna derecha - Testimonio (oculto en móvil) */}
            <div className="hidden lg:block relative flex-1 bg-[url('https://images.unsplash.com/photo-1682778418889-4be65dce59a2?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-no-repeat bg-cover rounded-l-[5rem]">
                <div className="absolute inset-0 flex items-end justify-center p-8">
                    {/* <div className="max-w-lg bg-black/30 backdrop-blur-md p-6 rounded-lg border-2 border-white/40">
                        {testimonial ? (
                            testimonial
                        ) : (
                            <div>
                                <blockquote className="text-xl font-medium text-white">
                                    "We've been using Untitled to kick start every new project and can't imagine working without it."
                                </blockquote>
                                <div className="mt-4">
                                    <p className="font-semibold text-white">Amélie Laurent</p>
                                    <p className="text-white">Lead Designer, Layers</p>
                                    <p className="text-white">Web Development Agency</p>
                                </div>
                            </div>
                        )}
                    </div> */}
                </div>
            </div>
        </div>
    );
}