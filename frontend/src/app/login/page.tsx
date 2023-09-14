'use client';

import { SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useLogin } from '@/api/hooks';

import LoginFooter from './LoginFooter';
import LoginForm, { LoginFormValues } from './LoginForm';
import LoginHeader from './LoginHeader';

const LoginPage = () => {
    const { mutate } = useLogin({
        onSuccess: ({ login }) => {
            if (login) toast.success(`Has iniciado sesión con ${login.user.email}`);
        },
        onError: () => {
            toast.error(`Hubo un error al iniciar sesión`);
        },
    });

    const handleLoginSubmit: SubmitHandler<LoginFormValues> = (data) => {
        mutate(data);
    };

    return (
        <>
            <LoginHeader />

            <main className="flex min-h-screen items-center py-24">
                <div className="container">
                    <div className="mb-8 text-center">
                        <h1 className="mb-1 text-3xl font-bold">Hola de nuevo</h1>
                        <p className="text-gray-500 lg:text-base">
                            Ingresa tus credenciales para acceder a tu cuenta
                        </p>
                    </div>

                    <LoginForm onSubmit={handleLoginSubmit} />
                </div>
            </main>

            <LoginFooter />
        </>
    );
};

export default LoginPage;
