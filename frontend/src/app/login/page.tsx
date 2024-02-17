'use client';

import LoginFooter from './LoginFooter';
import LoginForm from './LoginForm';
import LoginHeader from './LoginHeader';

const LoginPage = () => {
    return (
        <>
            <LoginHeader />

            <main className="flex min-h-screen items-center py-24">
                <div className="container">
                    <div className="mb-8 text-center">
                        <h1
                            data-cy="login-page-title"
                            className="mb-1 text-3xl font-bold"
                        >
                            Hola de nuevo
                        </h1>
                        <p className="text-muted-foreground lg:text-base">
                            Ingresa tus credenciales para acceder a tu cuenta
                        </p>
                    </div>

                    <LoginForm />
                </div>
            </main>

            <LoginFooter />
        </>
    );
};

export default LoginPage;
