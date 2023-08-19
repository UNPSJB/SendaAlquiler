'use client';

import { useLogin } from '@/api/hooks';
import { RHFFormField } from '@/modules/forms/FormField';
import Input from '@/modules/forms/Input';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type FormValues = {
    email: string;
    password: string;
};

const HomePage = () => {
    const { mutate } = useLogin({
        onSuccess: ({ login }) => {
            if (!login) return;

            toast.success(`Has iniciado sesión con ${login.user.email}`);
        },
        onError: () => {
            toast.error(`Hubo un error al iniciar sesión`);
        },
    });

    const useFormMethods = useForm<FormValues>();
    const { register, handleSubmit } = useFormMethods;

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        mutate(data);
    };

    return (
        <main className="min-h-screen flex items-center relative py-24">
            <div className="absolute top-0 inset-x-0 pt-6">
                <div className="container">
                    <span className="font-black tracking-widest text-xl select-none font-headings">
                        SENDA
                    </span>
                </div>
            </div>

            <div className="container">
                <div className="text-center mb-8">
                    <h1 className="font-bold text-3xl mb-1">Hola de nuevo</h1>
                    <p className="text-gray-500 lg:text-base">
                        Ingresa tus credenciales para acceder a tu cuenta
                    </p>
                </div>

                <FormProvider {...useFormMethods}>
                    <form className="lg:w-6/12 mx-auto" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4 mb-4">
                            <RHFFormField fieldID="email" label="Correo electrónico">
                                <Input
                                    type="email"
                                    id="email"
                                    placeholder="brunodiaz@gmail.com"
                                    hasError={!!useFormMethods.formState.errors.email}
                                    {...register('email', {
                                        required: true,
                                    })}
                                />
                            </RHFFormField>

                            <RHFFormField fieldID="password" label="Contraseña">
                                <Input
                                    type="password"
                                    id="password"
                                    placeholder="********"
                                    hasError={!!useFormMethods.formState.errors.password}
                                    {...register('password', {
                                        required: true,
                                    })}
                                />
                            </RHFFormField>
                        </div>

                        <button
                            className="bg-black text-white text-sm font-bold font-headings block w-full p-3 rounded"
                            type="submit"
                        >
                            Iniciar sesión
                        </button>
                    </form>
                </FormProvider>
            </div>

            <div className="absolute bottom-6 text-center inset-x-0 text-xs">
                <div className="container">
                    Hecho con ❤️ por Santiago Toro, Brian Barrio, Scott Ellis e Ignacio
                    Guzmán.
                </div>
            </div>
        </main>
    );
};

export default HomePage;
