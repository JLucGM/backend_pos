import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { AspectRatio } from '@/Components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Link, useForm, usePage } from '@inertiajs/react';
import { toast } from 'sonner';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    // const user = usePage().props.auth.user;
    const { user, avatarUrl } = usePage().props;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            avatar: avatarUrl
        });

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            data: {
                name: data.name,
                email: data.email,
                avatar: data.avatar,
            },
            onSuccess: () => {
                // console.log('Perfil actualizado con éxito');
                toast("Perfil actualizado con éxito.");
            },
            onError: (errors) => {
                // console.error('Error al actualizar el perfil:', errors);
                toast('Error al actualizar el perfil:', errors);
            },
        });
    };

    return (

        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Update your account's profile information and email address.
                </p>
            </header>
            <div className="w-[250px]">
                <AspectRatio ratio={1 / 1} className='w-full h-full '>
                    <Avatar className="w-auto h-auto" >
                        <AvatarImage src={avatarUrl || 'https://github.com/shadcn.png'} />
                        <AvatarFallback className="h-56 w-56 object-cover bg-slate-200 border-2 border-slate-400">
                            CN</AvatarFallback>
                    </Avatar>
                </AspectRatio>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-6" encType="multipart/form-data">

                <div>
                    <InputLabel htmlFor="avatar" value="avatar" />

                    <Input
                        id="avatar"
                        className="mt-1 block w-full"
                        onChange={(e) => setData('avatar', e.target.files[0])} // Asegúrate de que esto esté correcto
                        type="file"
                    />

                    <InputError className="mt-2" message={errors.avatar} />
                </div>

                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <Button variants="default" disabled={processing}>
                        {processing ? "Guardando..." : "Guardar"}
                    </Button>

                </div>
            </form>
        </section>
    );
}
