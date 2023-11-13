import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import { RHFFormField } from '@/modules/forms/FormField';
import Input from '@/modules/forms/Input';

import Button from '@/components/Button';

export type LoginFormValues = {
    email: string;
    password: string;
};

const LoginForm = ({ onSubmit }: { onSubmit: SubmitHandler<LoginFormValues> }) => {
    const useFormMethods = useForm<LoginFormValues>();
    const { control, handleSubmit } = useFormMethods;

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
