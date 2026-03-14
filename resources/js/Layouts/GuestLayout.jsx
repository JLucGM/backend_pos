// Layouts/GuestLayout.jsx
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children, testimonial }) {
    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 items-center justify-center p-6">
            <div className="w-full">
                <div className="mx-auto w-full">
                    <div className="mb-10 flex justify-center">
                        <Link href="/">
                            <ApplicationLogo className="h-24 w-auto" />
                        </Link>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}