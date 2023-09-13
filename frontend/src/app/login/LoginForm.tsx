import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import { RHFFormField } from '@/modules/forms/FormField';
import Input from '@/modules/forms/Input';

export type LoginFormValues = {
    email: string;
    password: string;
};

const LoginForm = ({ onSubmit }: { onSubmit: SubmitHandler<LoginFormValues> }) => {
    const useFormMethods = useForm<LoginFormValues>();
    const { register, handleSubmit } = useFormMethods;

    return (
        <FormProvider {...useFormMethods}>
            <form className="mx-auto lg:w-6/12" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4 space-y-4">
                    <RHFFormField fieldID="email" label="Correo electrónico">
                        <Input
                            type="email"
                            id="email"
                            placeholder="brunodiaz@gmail.com"
                            hasError={!!useFormMethods.formState.errors.email}
                            {...register('email', { required: true })}
                        />
                    </RHFFormField>

                    <RHFFormField fieldID="password" label="Contraseña">
                        <Input
                            type="password"
                            id="password"
                            placeholder="********"
                            hasError={!!useFormMethods.formState.errors.password}
                            {...register('password', { required: true })}
                        />
                    </RHFFormField>
                </div>
                <button
                    className="block w-full rounded bg-black p-3 font-headings text-sm font-bold text-white"
                    type="submit"
                >
                    Iniciar sesión
                </button>
            </form>
        </FormProvider>
    );
};

export default LoginForm;
