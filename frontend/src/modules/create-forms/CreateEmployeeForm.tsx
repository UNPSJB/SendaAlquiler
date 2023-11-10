'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';
import { useState } from 'react';
import {
    FormProvider,
    FormState,
    SubmitHandler,
    UseFormRegister,
    useForm,
} from 'react-hook-form';
import toast from 'react-hot-toast';

import { CreateEmployeeMutationVariables } from '@/api/graphql';
import { useCreateEmployee } from '@/api/hooks';

import { RHFFormField } from '@/modules/forms/FormField';
import Input from '@/modules/forms/Input';

import NavigationButtons, { NavigationButtonsCancelProps } from './NavigationButtons';

type FormValues = CreateEmployeeMutationVariables['employeeData'];

type FieldsComponentProps = {
    formErrors: FormState<FormValues>['errors'];
    register: UseFormRegister<FormValues>;
};

const PersonalDataStep: React.FC<FieldsComponentProps> = ({ formErrors, register }) => (
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
                    placeholder="Bruno"
                    hasError={!!formErrors.firstName}
                    {...register('firstName', { required: true })}
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
                    placeholder="Díaz"
                    hasError={!!formErrors.lastName}
                    {...register('lastName', { required: true })}
                />
            </RHFFormField>
        </div>

        <RHFFormField fieldID="email" label="Correo electrónico" showRequired>
            <Input
                type="email"
                id="email"
                placeholder="brunodiaz@gmail.com"
                hasError={!!formErrors.email}
                {...register('email', { required: true })}
            />
        </RHFFormField>

        <RHFFormField fieldID="password" label="Contraseña" showRequired>
            <Input
                type="password"
                id="password"
                placeholder="**********"
                hasError={!!formErrors.password}
                maxLength={10}
                {...register('password', {
                    required: true,
                    maxLength: 10,
                })}
            />
        </RHFFormField>

        <RHFFormField fieldID="confirm-password" label="Confirme contraseña" showRequired>
            <Input
                type="password"
                id="confirm-password"
                placeholder="**********"
                hasError={!!formErrors.password}
                maxLength={10}
                {...register('password', {
                    required: true,
                    maxLength: 10,
                })}
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
    }
];

const CreateEmployeeForm: React.FC<NavigationButtonsCancelProps> = (props) => {
    const useFormMethods = useForm<FormValues>();
    const { register, handleSubmit, formState, trigger } = useFormMethods;
    const formErrors = formState.errors;

    const router = useRouter();
    const [activeStep, setActiveStep] = useState(0);

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
        mutate({
            employeeData: {
                ...data,
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

                        <span className="text-xs text-gray-500">
                            Paso {activeStep + 1} de {STEPS.length}
                        </span>
                    </div>

                    <FormProvider {...useFormMethods}>
                        {STEPS.map(({ title, description, Component, key }, index) => (
                            <div
                                className={clsx(
                                    'mb-20 w-9/12',
                                    activeStep !== index && 'hidden',
                                )}
                                key={key}
                            >
                                <h2 className="text-lg font-bold">{title}</h2>
                                <p className="mb-6 text-gray-600">{description}</p>

                                <form className="space-y-4">
                                    <Component
                                        formErrors={formErrors}
                                        register={register}
                                    />
                                </form>
                            </div>
                        ))}
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