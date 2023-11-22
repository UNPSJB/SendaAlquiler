'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';
import { useState } from 'react';
import {
    Control,
    FormProvider,
    FormState,
    SubmitHandler,
    UseFormRegister,
    UseFormSetValue,
    useForm,
} from 'react-hook-form';
import toast from 'react-hot-toast';

import { CreateSupplierInput } from '@/api/graphql';
import { useCreateSupplier } from '@/api/hooks';

import LocalityField, {
    LocalityFieldValue,
} from '@/modules/create-forms/fields/LocalityField';
import { RHFFormField } from '@/modules/forms/FormField';
import Input from '@/modules/forms/Input';

import NavigationButtons, { NavigationButtonsCancelProps } from './NavigationButtons';

type FormValues = Omit<CreateSupplierInput, 'locality'> & {
    locality: LocalityFieldValue;
};

type FieldsComponentProps = {
    formErrors: FormState<FormValues>['errors'];
    register: UseFormRegister<FormValues>;
    control: Control<FormValues>;
    setValue: UseFormSetValue<FormValues>;
};

const ContactDataStep: React.FC<FieldsComponentProps> = ({ formErrors, control }) => (
    <>
        <div className="flex space-x-4">
            <RHFFormField
                className="flex-1"
                fieldID="firstName"
                label="Nombre"
                showRequired
            >
                <Input
                    id="name"
                    name="name"
                    placeholder="Entidad"
                    hasError={!!formErrors.name}
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
                placeholder="entidad@gmail.com"
                hasError={!!formErrors.email}
                control={control}
                rules={{ required: true }}
            />
        </RHFFormField>

        <RHFFormField fieldID="cuit" label="Cuit" showRequired>
            <Input
                type="number"
                id="cuit"
                name="cuit"
                placeholder="Cuit de la empresa"
                hasError={!!formErrors.cuit}
                maxLength={10}
                control={control}
                rules={{
                    required: true,
                    maxLength: 10,
                }}
            />
        </RHFFormField>

        <RHFFormField fieldID="phoneCode" label="Código de área" showRequired>
            <Input
                type="number"
                id="phoneCode"
                name="phoneCode"
                placeholder="549"
                hasError={!!formErrors.phoneCode}
                maxLength={4}
                control={control}
                rules={{ required: true, maxLength: 4 }}
            />
        </RHFFormField>

        <RHFFormField fieldID="phoneNumber" label="Número de celular" showRequired>
            <Input
                type="number"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="2804123456"
                hasError={!!formErrors.phoneNumber}
                maxLength={10}
                control={control}
                rules={{
                    required: true,
                    maxLength: 10,
                }}
            />
        </RHFFormField>
    </>
);

const LocationDataStep: React.FC<FieldsComponentProps> = ({
    formErrors,
    control,
    setValue,
}) => (
    <>
        <RHFFormField fieldID="locality" label="Localidad" showRequired>
            <LocalityField name="locality" control={control} setValue={setValue} />
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
                    name="streetName"
                    hasError={!!formErrors.streetName}
                    control={control}
                    rules={{ required: true }}
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
                    name="houseNumber"
                    hasError={!!formErrors.houseNumber}
                    control={control}
                    rules={{ required: true }}
                />
            </RHFFormField>
        </div>

        <RHFFormField fieldID="houseUnit" label="Apartamento, habitación, unidad, etc">
            <Input
                id="houseUnit"
                name="houseUnit"
                hasError={!!formErrors.houseUnit}
                control={control}
                rules={{ required: false }}
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
        fields: ['name', 'email', 'cuit', 'phoneCode', 'phoneNumber'],
    },
    {
        key: 'location-data',
        title: 'Información de ubicación',
        description: 'Información de ubicación del cliente',
        Component: LocationDataStep,
        fields: ['streetName', 'houseNumber', 'houseUnit'],
    },
];

const CreateSupplierForm: React.FC<NavigationButtonsCancelProps> = (props) => {
    const useFormMethods = useForm<FormValues>();
    const { register, handleSubmit, formState, trigger, setValue, control } =
        useFormMethods;
    const formErrors = formState.errors;

    const router = useRouter();
    const [activeStep, setActiveStep] = useState(0);

    const { mutate } = useCreateSupplier({
        onSuccess: (data) => {
            const error = data.createSupplier?.error;
            const supplier = data.createSupplier?.supplier;
            if (error) {
                toast.error(error);
            }

            if (supplier) {
                toast.success('Proveedor creado exitosamente');
                router.push('/proveedores');
            }
        },
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        mutate({
            data: {
                cuit: data.cuit,
                email: data.email,
                name: data.name,
                houseNumber: data.houseNumber,
                houseUnit: data.houseUnit,
                phoneCode: data.phoneCode,
                phoneNumber: data.phoneNumber,
                streetName: data.streetName,
                locality: data.locality.value,
                note: data.note,
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
                        <h1 className="text-2xl font-bold">Crea un proveedor</h1>

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
                                        control={control}
                                        setValue={setValue}
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

export default CreateSupplierForm;
