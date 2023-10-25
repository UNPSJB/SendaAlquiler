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

import { CreateClientMutationVariables } from '@/api/graphql';
import { useCreateClient } from '@/api/hooks';

import LocalityField from '@/modules/create-forms/LocalityField';
import { RHFFormField } from '@/modules/forms/FormField';
import Input from '@/modules/forms/Input';

import NavigationButtons, { NavigationButtonsCancelProps } from './NavigationButtons';

type FormValues = CreateClientMutationVariables['clientData'];

type FieldsComponentProps = {
    formErrors: FormState<FormValues>['errors'];
    register: UseFormRegister<FormValues>;
};

const ContactDataStep: React.FC<FieldsComponentProps> = ({ formErrors, register }) => (
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

        <RHFFormField fieldID="dni" label="DNI" showRequired>
            <Input
                type="number"
                id="dni"
                placeholder="DNI del cliente"
                hasError={!!formErrors.dni}
                maxLength={10}
                {...register('dni', {
                    required: true,
                    maxLength: 10,
                })}
            />
        </RHFFormField>

        <RHFFormField fieldID="phoneCode" label="Código de área" showRequired>
            <Input
                type="number"
                id="phoneCode"
                placeholder="549"
                hasError={!!formErrors.phoneCode}
                maxLength={4}
                {...register('phoneCode', {
                    required: true,
                    maxLength: 4,
                })}
            />
        </RHFFormField>

        <RHFFormField fieldID="phoneNumber" label="Número de celular" showRequired>
            <Input
                type="number"
                id="phoneNumber"
                placeholder="2804123456"
                hasError={!!formErrors.phoneNumber}
                maxLength={10}
                {...register('phoneNumber', {
                    required: true,
                    maxLength: 10,
                })}
            />
        </RHFFormField>
    </>
);

const LocationDataStep: React.FC<FieldsComponentProps> = ({ formErrors, register }) => (
    <>
        <RHFFormField fieldID="locality" label="Localidad" showRequired>
            <LocalityField />
        </RHFFormField>

        <div className="flex space-x-4">
            <RHFFormField
                className="flex-1"
                fieldID="streetName"
                label="Calle"
                showRequired
            >
                <Input
                    id="streetName"
                    hasError={!!formErrors.streetName}
                    {...register('streetName', { required: true })}
                />
            </RHFFormField>

            <RHFFormField
                className="flex-1"
                fieldID="houseNumber"
                label="N° de casa"
                showRequired
            >
                <Input
                    id="houseNumber"
                    hasError={!!formErrors.houseNumber}
                    {...register('houseNumber', { required: true })}
                />
            </RHFFormField>
        </div>

        <RHFFormField fieldID="houseUnit" label="Apartamento, habitación, unidad, etc">
            <Input
                id="houseUnit"
                hasError={!!formErrors.houseUnit}
                {...register('houseUnit')}
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
        key: 'contact-data',
        title: 'Información de contacto',
        description: 'Información de contacto del cliente',
        Component: ContactDataStep,
        fields: ['firstName', 'lastName', 'email', 'dni', 'phoneCode', 'phoneNumber'],
    },
    {
        key: 'location-data',
        title: 'Información de ubicación',
        description: 'Información de ubicación del cliente',
        Component: LocationDataStep,
        fields: ['streetName', 'houseNumber', 'houseUnit'],
    },
];

const CreateClientForm: React.FC<NavigationButtonsCancelProps> = (props) => {
    const useFormMethods = useForm<FormValues>();
    const { register, handleSubmit, formState, trigger } = useFormMethods;
    const formErrors = formState.errors;

    const router = useRouter();
    const [activeStep, setActiveStep] = useState(0);

    const { mutate } = useCreateClient({
        onSuccess: (data) => {
            const error = data.createClient?.error;
            const client = data.createClient?.client;
            if (error) {
                toast.error(error);
            }

            if (client) {
                toast.success('Cliente creado exitosamente');
                router.push('/clientes');
            }
        },
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        mutate({
            clientData: {
                ...data,
                localityId: (data.localityId as any).value,
            },
        });
    };

    const handlePreviousStep = () => {
        if (activeStep === 0) {
            return;
        }

        setActiveStep(activeStep - 1);
    };

    const handleNextStep = async () => {
        if (activeStep === STEPS.length - 1) {
            return;
        }

        const currentStepFields = STEPS[activeStep].fields;
        const stepFieldsAreValid = await trigger(currentStepFields);

        if (stepFieldsAreValid) {
            setActiveStep(activeStep + 1);
        }
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
                        <h1 className="text-2xl font-bold">Crea un cliente</h1>

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
                        isLastStep={activeStep === STEPS.length - 1}
                        onPrevious={handlePreviousStep}
                        onNext={handleNextStep}
                        onSubmit={handleSubmit(onSubmit)}
                        {...props}
                    />
                </div>
            </div>
        </main>
    );
};

export default CreateClientForm;
