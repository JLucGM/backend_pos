import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Input } from '@/Components/ui/input'; // Asumo que esto es para el input de tipo 'file'
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    // 1. Añadir los campos de la empresa al estado de useForm
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', // Nombre del usuario
        email: '',
        password: '',
        password_confirmation: '',
        avatar: null, // Inicializar avatar como null para archivos
        // Campos de la empresa
        company_name: '',
        company_phone: '',
        company_address: '',
        // company_slug: '', // Opcional, si lo vas a usar para subdominios
    });

    const submit = (e) => {
        e.preventDefault();

        // Al enviar el formulario, Inertia.js automáticamente serializará el objeto 'data'
        // y lo enviará al endpoint 'register' en Laravel.
        // Asegúrate de que tu acción `CreateNewUser` en Laravel esté preparada para recibir
        // todos estos campos (tanto de usuario como de empresa).
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            {/* Es crucial usar encType="multipart/form-data" si estás enviando archivos */}
            <form onSubmit={submit} encType="multipart/form-data">

                {/* Sección de Datos del Usuario */}
                <h2 className="text-xl font-semibold mb-4">Datos del Usuario</h2>

                {/* Avatar del Usuario */}
                <div>
                    <InputLabel htmlFor="avatar" value="Avatar" />
                    <Input
                        id="avatar"
                        className="mt-1 block w-full"
                        name="avatar"
                        // Para archivos, setData debe capturar el primer archivo del FileList
                        onChange={(e) => setData('avatar', e.target.files[0])}
                        type="file"
                    />
                    <InputError className="mt-2" message={errors.avatar} />
                </div>

                {/* Nombre del Usuario */}
                <div className="mt-4">
                    <InputLabel htmlFor="name" value="Tu Nombre" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                {/* Email del Usuario */}
                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Contraseña del Usuario */}
                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Contraseña" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Confirmar Contraseña del Usuario */}
                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar Contraseña"
                    />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                {/* Sección de Datos de la Empresa */}
                <h2 className="text-xl font-semibold mt-8 mb-4">Datos de la Empresa</h2>

                {/* Nombre de la Empresa */}
                <div className="mt-4">
                    {/* IMPORTANTE: Cambiar id y name para evitar conflictos con el 'name' del usuario */}
                    <InputLabel htmlFor="company_name" value="Nombre de la Empresa" />
                    <TextInput
                        id="company_name"
                        name="company_name"
                        value={data.company_name}
                        className="mt-1 block w-full"
                        autoComplete="organization" // AutoComplete semántico para nombre de organización
                        onChange={(e) => setData('company_name', e.target.value)}
                        required
                    />
                    <InputError message={errors.company_name} className="mt-2" />
                </div>

                {/* Teléfono de la Empresa */}
                <div className="mt-4">
                    <InputLabel htmlFor="company_phone" value="Teléfono de la Empresa" />
                    <TextInput
                        id="company_phone"
                        name="company_phone"
                        value={data.company_phone}
                        className="mt-1 block w-full"
                        autoComplete="tel" // AutoComplete semántico para teléfono
                        onChange={(e) => setData('company_phone', e.target.value)}
                        // required // Decide si este campo es obligatorio
                    />
                    <InputError message={errors.company_phone} className="mt-2" />
                </div>

                {/* Dirección de la Empresa */}
                <div className="mt-4">
                    <InputLabel htmlFor="company_address" value="Dirección de la Empresa" />
                    <TextInput
                        id="company_address"
                        name="company_address"
                        value={data.company_address}
                        className="mt-1 block w-full"
                        autoComplete="street-address" // AutoComplete semántico para dirección
                        onChange={(e) => setData('company_address', e.target.value)}
                        // required // Decide si este campo es obligatorio
                    />
                    <InputError message={errors.company_address} className="mt-2" />
                </div>

                {/* Opcional: Slug de la Empresa (si se va a ingresar manualmente) */}
                {/* Si generas el slug automáticamente en el backend, no necesitas este campo aquí */}
                {/* <div className="mt-4">
                    <InputLabel htmlFor="company_slug" value="URL de la Empresa (ej. mi-empresa)" />
                    <TextInput
                        id="company_slug"
                        name="company_slug"
                        value={data.company_slug}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('company_slug', e.target.value)}
                    />
                    <InputError message={errors.company_slug} className="mt-2" />
                </div> */}


                {/* Términos y Condiciones (si usas Jetstream) */}
                {/* Asegúrate de que esta sección esté presente si tu configuración de Jetstream la requiere */}
                {/* @if (Laravel\Jetstream\Jetstream::hasTermsAndPrivacyPolicyFeature()) */}
                    {/* <div className="mt-4">
                        <InputLabel htmlFor="terms">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="terms"
                                    id="terms"
                                    checked={data.terms}
                                    onChange={(e) => setData('terms', e.target.checked)}
                                    required
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                />
                                <div className="ms-2 text-sm text-gray-600">
                                    I agree to the <Link target="_blank" href={route('terms.show')} className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Terms of Service</Link> and <Link target="_blank" href={route('policy.show')} className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Privacy Policy</Link>
                                </div>
                            </div>
                            <InputError message={errors.terms} className="mt-2" />
                        </InputLabel>
                    </div> */}
                {/* @endif */}

                {/* Botones de acción */}
                <div className="flex items-center justify-end mt-4">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                    >
                        ¿Ya estás registrado?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Registrarse
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
