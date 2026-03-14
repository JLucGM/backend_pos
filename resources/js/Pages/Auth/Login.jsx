// Pages/Login.jsx
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Iniciar sesión" />

            {/* {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )} */}

            <div className="max-w-md mx-auto">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
                    <p className="mt-2 text-sm text-gray-600">Please enter your details to access your account.</p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            placeholder="Enter your email"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            placeholder="*********"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span className="ml-2 text-sm text-gray-600">Remember for 30 days</span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>

                    <div className="pt-2">
                        <PrimaryButton className="w-full justify-center py-3 text-base shadow-sm" disabled={processing}>
                            Sign in
                        </PrimaryButton>
                    </div>

                    <div className="text-center text-sm pt-4 border-t border-gray-100">
                        <span className="text-gray-600 text-base">Don't have an account?</span>{' '}
                        <Link href={route('register')} className="font-semibold text-indigo-600 hover:text-indigo-500 text-base">
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}