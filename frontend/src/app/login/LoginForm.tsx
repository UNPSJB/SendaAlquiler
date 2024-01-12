'use client';

import { useSearchParams, useRouter } from 'next/navigation';

import { signIn } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import Input from '@/modules/forms/DeprecatedInput';
import { RHFFormField } from '@/modules/forms/FormField';
import { getCleanErrorMessage } from '@/modules/utils';

import Button from '@/components/Button';

import { useUserContext } from '../UserProvider';

export type LoginFormValues = {
    email: string;
    password: string;
};

const LoginForm = () => {
    const router = useRouter();
    const useFormMethods = useForm<LoginFormValues>();
    const { control, handleSubmit } = useFormMethods;
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
        <FormProvider {...useFormMethods}>
            <form className="mx-auto lg:w-6/12" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4 space-y-4">
                    <RHFFormField fieldID="email" label="Correo electrónico">
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="brunodiaz@gmail.com"
                            hasError={!!useFormMethods.formState.errors.email}
                            control={control}
                            rules={{ required: true }}
                        />
                    </RHFFormField>

                    <RHFFormField fieldID="password" label="Contraseña">
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="********"
                            hasError={!!useFormMethods.formState.errors.password}
                            control={control}
                            rules={{ required: true }}
                        />
                    </RHFFormField>
                </div>

                <Button fullWidth type="submit">
                    Iniciar sesión
                </Button>
            </form>
        </FormProvider>
    );
};

export default LoginForm;
