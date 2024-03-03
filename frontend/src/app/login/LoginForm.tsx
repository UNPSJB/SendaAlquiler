'use client';

import { useSearchParams, useRouter } from 'next/navigation';

import { signIn } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { getCleanErrorMessage } from '@/modules/utils';

import DeprecatedButton from '@/components/Button';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Form,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useUserContext } from '../UserProvider';

export type LoginFormValues = {
    email: string;
    password: string;
};

const LoginForm = () => {
    const router = useRouter();
    const formMethods = useForm<LoginFormValues>();
    const { update } = useUserContext();

    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const next = searchParams.get('next') || '/';

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (error) {
            toast.error(decodeURIComponent(error), {
                id: 'login-error',
            });
        }
    }, [error]);

    const onSubmit: SubmitHandler<LoginFormValues> = useCallback(
        async (values) => {
            const callbackUrl = next;

            try {
                setIsLoading(true);
                const data = await signIn('credentials', {
                    email: values.email,
                    password: values.password,
                    callbackUrl: next ? callbackUrl : undefined,
                    redirect: false,
                });

                const url = data?.url;
                if (!url) {
                    if (data?.error) {
                        throw new Error(data.error);
                    } else {
                        throw new Error('Hubo un error al iniciar sesión');
                    }
                }

                toast.success('Te estamos redirigiendo a tu cuenta');

                await update();
                router.push(url);
            } catch (error) {
                setIsLoading(false);
                toast.error(getCleanErrorMessage(error as Error));
            }
        },
        [next, router, update],
    );

    return (
        <Form {...formMethods}>
            <form
                data-cy="login-form"
                className="mx-auto lg:w-6/12"
                onSubmit={formMethods.handleSubmit(onSubmit)}
            >
                <div className="mb-4 space-y-4">
                    <FormField
                        name="email"
                        rules={{
                            required: 'El correo electrónico es requerido',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: 'Correo electrónico inválido',
                            },
                        }}
                        control={formMethods.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Correo electrónico</FormLabel>

                                <FormControl>
                                    <Input
                                        data-cy="login-email-input"
                                        placeholder="brunodiaz@gmail.com"
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="password"
                        rules={{ required: 'La contraseña es requerida' }}
                        control={formMethods.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contraseña</FormLabel>

                                <FormControl>
                                    <Input
                                        data-cy="login-password-input"
                                        type="password"
                                        placeholder="********"
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <DeprecatedButton data-cy="login-submit-button" fullWidth type="submit">
                    Iniciar sesión
                </DeprecatedButton>
            </form>
        </Form>
    );
};

export default LoginForm;
