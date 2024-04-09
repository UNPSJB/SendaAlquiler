'use client';

import Link from 'next/link';

import clsx from 'clsx';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useChangePasswordWithToken } from '@/api/hooks/profile';

import ButtonWithSpinner from '@/components/ButtonWithSpinner';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type FormValues = {
    password: string;
    password_confirmation: string;
};

type Props = {
    token: string;
};

const ReestablishPasswordPage: React.FC<Props> = ({ token }) => {
    const [reestablished, setReestablished] = useState(false);
    const formMethods = useForm<FormValues>({
        defaultValues: {},
    });

    const { mutate, isPending } = useChangePasswordWithToken();

    const onSubmit: SubmitHandler<FormValues> = (values) => {
        if (
            !token ||
            !values.password ||
            !values.password_confirmation ||
            values.password !== values.password_confirmation
        ) {
            return;
        }

        mutate(
            {
                newPassword: values.password,
                token,
            },
            {
                onSuccess: (data) => {
                    const error = data?.changePasswordWithToken?.error;
                    const success = data?.changePasswordWithToken?.success;

                    if (error) {
                        toast.error(error);
                    } else if (success) {
                        setReestablished(true);
                    }
                },
                onError: () => {
                    toast.error('Hubo un error. Inténtalo de nuevo más tarde.');
                },
            },
        );
    };

    const passwordValue = formMethods.watch('password');
    const passwordConfirmValue = formMethods.watch('password_confirmation');
    const passwordsMatch = passwordValue === passwordConfirmValue;
    const passwordIsValid = passwordValue && passwordValue.length >= 8 && passwordsMatch;

    return (
        <div className="container flex min-h-screen items-center">
            <div className="absolute inset-x-0 top-0 py-4">
                <div className="container">
                    <Link
                        className="text-sm font-bold uppercase tracking-wider text-white hover:opacity-50"
                        href="/"
                    >
                        BuenaOnda Talks
                    </Link>
                </div>
            </div>

            {reestablished ? (
                <div className="w-full py-24 text-center md:mx-auto md:w-8/12">
                    <h1 className="mb-2 text-lg font-bold">Contraseña reestablecida</h1>
                    <p>Tu contraseña ha sido reestablecida exitosamente.</p>
                    <p>
                        Ahora puedes{' '}
                        <Link className="underline" href="/login">
                            iniciar sesión
                        </Link>
                        .
                    </p>
                </div>
            ) : (
                <div className="w-full py-24 md:mx-auto md:w-10/12">
                    <div className="mb-12 text-center">
                        <h1 className="mb-4 text-2xl font-bold">
                            Restablecimiento de contraseña
                        </h1>
                    </div>

                    <Form {...formMethods}>
                        <form
                            className="space-y-6 md:mx-auto md:w-6/12"
                            onSubmit={formMethods.handleSubmit(onSubmit)}
                        >
                            <div className="space-y-6">
                                <FormField
                                    name="password"
                                    control={formMethods.control}
                                    rules={{
                                        required: 'La contraseña es requerida',
                                        minLength: {
                                            value: 8,
                                            message:
                                                'La contraseña debe tener al menos 8 caracteres',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel required>
                                                Nueva contraseña
                                            </FormLabel>

                                            <Input
                                                {...field}
                                                value={field.value || ''}
                                                type="password"
                                            />

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="password_confirmation"
                                    control={formMethods.control}
                                    rules={{
                                        required:
                                            'La confirmación de la contraseña es requerida',
                                        validate: (value) => value === passwordValue,
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel required>
                                                Confirma la contraseña
                                            </FormLabel>
                                            <Input
                                                {...field}
                                                value={field.value || ''}
                                                type="password"
                                            />
                                        </FormItem>
                                    )}
                                />

                                {passwordValue && passwordConfirmValue && (
                                    <>
                                        {passwordsMatch ? (
                                            <small className="text-green-600">
                                                Las contraseñas coinciden
                                            </small>
                                        ) : (
                                            <small className="text-red-500">
                                                Las contraseñas no coinciden
                                            </small>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className={clsx('flex justify-center')}>
                                <ButtonWithSpinner type="submit" showSpinner={isPending}>
                                    Reestablecer contraseña
                                </ButtonWithSpinner>
                            </div>
                        </form>
                    </Form>
                </div>
            )}
        </div>
    );
};

export default ReestablishPasswordPage;
