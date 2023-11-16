'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';
import {
    Control,
    FormProvider,
    FormState,
    SubmitHandler,
    UseFormSetValue,
    UseFormGetValues,
    UseFormRegister,
    useForm,
} from 'react-hook-form';
import toast from 'react-hot-toast';

import { CreateEmployeeMutationVariables } from '@/api/graphql';
import { useCreateEmployee } from '@/api/hooks';

import { RHFFormField } from '@/modules/forms/FormField';
import Input from '@/modules/forms/Input';

import NavigationButtons, { NavigationButtonsCancelProps } from './NavigationButtons';

type FormValues = CreateEmployeeMutationVariables['employeeData'] & {
    confirmPassword: string;
};

type FieldsComponentProps = {
    formErrors: FormState<FormValues>['errors'];
    register: UseFormRegister<FormValues>;
    control: Control<FormValues>;
    setValue: UseFormSetValue<FormValues>;
    getValues: UseFormGetValues<FormValues>;
};

const PersonalDataStep: React.FC<FieldsComponentProps> = ({
    formErrors, control, getValues
}) => (
    <>
        <div className="flex space-x-4">
            <RHFFormField
                className="flex-1"
                fieldID="firstName"
                label="Nombre"
                showRequired
            >
                <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Bruno"
                    hasError={!!formErrors.firstName}
                    control={control}
                    rules={{ required: true }}
                />
            </RHFFormField>

            <RHFFormField
                className="flex-1"
                fieldID="lastName"
                label="Apellido"
                showRequired
            >
                <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Díaz"
                    hasError={!!formErrors.lastName}
                    control={control}
                    rules={{ required: true }}
                />
            </RHFFormField>
        </div>

        <RHFFormField fieldID="email" label="Correo electrónico" showRequired>
            <Input
                type="email"
                id="email"
                name="email"
                placeholder="brunodiaz@gmail.com"
                hasError={!!formErrors.email}
                control={control}
                rules={{ required: true }}
            />
        </RHFFormField>

        <RHFFormField fieldID="password" label="Contraseña" showRequired>
            <Input
                type="password"
                id="password"
                name="password"
                placeholder="**********"
                hasError={!!formErrors.password}
                minLength={8}
                control={control}
                rules={{ required: true }}
            />
        </RHFFormField>

        <RHFFormField fieldID="confirmPassword" label="Confirme contraseña" showRequired>
            <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="**********"
                hasError={!!formErrors.confirmPassword}
                control={control}
                rules={{
                    required: true,
                    minLength: 8,
                    validate: (value) => {
                        const isValid = value === getValues('password');
                        return isValid || 'Las contraseñas no coinciden';
                    },
                }}
            />
        </RHFFormField>
    </>
);

type Step = {
    key: string;
    title: string;
    description: string;
    Component: React.FC<FieldsComponentProps>;
    fields: (keyof FormValues)[];
};

const STEPS: Step[] = [
    {
        key: 'personal-data',
        title: 'Información personal',
        description: 'Información personal del empleado',
        Component: PersonalDataStep,
        fields: ['firstName', 'lastName', 'email'],
    },
];

const CreateEmployeeForm: React.FC<NavigationButtonsCancelProps> = (props) => {
    const useFormMethods = useForm<FormValues>({
        reValidateMode: 'onChange',
    });
    const { register, handleSubmit, formState, getValues, setValue, control } = useFormMethods;
    const formErrors = formState.errors;

    const router = useRouter();

    const { mutate } = useCreateEmployee({
        onSuccess: (data) => {
            const error = data.createEmployee?.error;
            const client = data.createEmployee?.employee;
            if (error) {
                toast.error(error);
            }

            if (client) {
                toast.success('Empleado creado exitosamente');
                router.push('/empleados');
            }
        },
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        const password = data.password;
        const confirmPassword = data['confirmPassword'];
        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        mutate({
            employeeData: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
            },
        });
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100 py-14">
            <div className="container flex flex-1">
                <div className="w-3/12 rounded-l-xl bg-gray-300 pl-8 pt-6">
                    <Link
                        href="/"
                        className="block font-headings text-3xl font-black tracking-widest text-gray-700"
                    >
                        SENDA
                    </Link>
                </div>
                <div className="flex w-9/12 flex-col rounded-r-xl bg-white px-14 pt-6">
                    <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
                        <h1 className="text-2xl font-bold">Crea un empleado</h1>
                    </div>

                    <FormProvider {...useFormMethods}>
                        <div className={clsx('mb-20 w-9/12')}>
                            <h2 className="text-lg font-bold">{STEPS[0].title}</h2>
                            <p className="mb-6 text-gray-600">{STEPS[0].description}</p>

                            <form className="space-y-4">
                                <PersonalDataStep
                                    formErrors={formErrors}
                                    register={register}                                 
                                    control={control}
                                    getValues={getValues}
                                    setValue={setValue}
                                />
                            </form>
                        </div>
                    </FormProvider>

                    <NavigationButtons
                        isUniqueStep
                        onSubmit={handleSubmit(onSubmit)}
                        {...props}
                    />
                </div>
            </div>
        </main>
    );
};

export default CreateEmployeeForm;
