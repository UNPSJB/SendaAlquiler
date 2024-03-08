'use client';

import Link from 'next/link';

import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useSendPasswordRecoveryEmail } from '@/api/hooks/profile';

import ButtonWithSpinner from '@/components/ButtonWithSpinner';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type FormValues = {
    email: string;
};

const PasswordResetPage = () => {
    const [sent, setSent] = useState(false);
    const formMethods = useForm<FormValues>();

    const { mutate, isPending } = useSendPasswordRecoveryEmail();

    const onSubmit: SubmitHandler<FormValues> = (values) => {
        mutate(values, {
            onSuccess: (data) => {
                const error = data?.sendPasswordRecoveryEmail?.error;
                const success = data?.sendPasswordRecoveryEmail?.success;

                if (error) {
                    toast.error(error);
                } else if (success) {
                    setSent(true);
                }
            },
            onError: () => {
                toast.error('Hubo un error. Por favor, intenta de nuevo más tarde');
            },
        });
    };

    return (
        <div className="container flex min-h-screen items-center">
            <div className="absolute inset-x-0 top-0 py-4">
                <div className="container">
                    <Link
                        className="text-sm font-bold uppercase tracking-wider text-white hover:opacity-50"
                        href="/"
                    >
                        SENDA
                    </Link>
                </div>
            </div>

            {sent ? (
                <div className="w-full py-24 text-center md:mx-auto md:w-8/12">
                    <h1 className="font-bold">Enlace enviado con éxito</h1>
                    <p>
                        Te hemos enviado un mensaje a tu correo con el enlace para
                        reestablecer tu contraseña.
                    </p>
                </div>
            ) : (
                <div className="w-full py-24 md:mx-auto md:w-10/12">
                    <div className="mb-12 text-center">
                        <h1 className="mb-4 text-2xl font-bold">
                            Reestablecimiento de contraseña
                        </h1>

                        <div>
                            <p>
                                Pon la <b>dirección de correo electrónico</b> que usabas
                                para iniciar sesión.
                            </p>
                            <p>
                                Te enviaremos un mensaje con un enlace para restablecer tu
                                contraseña.
                            </p>
                        </div>
                    </div>

                    <Form {...formMethods}>
                        <form
                            className="space-y-2 md:mx-auto md:w-6/12"
                            onSubmit={formMethods.handleSubmit(onSubmit)}
                        >
                            <FormField
                                name="email"
                                control={formMethods.control}
                                rules={{
                                    required: 'El correo electrónico es requerido',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                        message: 'El correo electrónico no es válido',
                                    },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel required>Correo electrónico</FormLabel>

                                        <Input {...field} value={field.value || ''} />

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-center">
                                <ButtonWithSpinner type="submit" showSpinner={isPending}>
                                    Enviar
                                </ButtonWithSpinner>
                            </div>
                        </form>
                    </Form>
                </div>
            )}
        </div>
    );
};

export default PasswordResetPage;
