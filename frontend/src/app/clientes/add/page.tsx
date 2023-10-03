'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';
import { useState } from 'react';
import {
    Controller,
    FormProvider,
    FormState,
    SubmitHandler,
    UseFormRegister,
    useForm,
    useFormContext,
} from 'react-hook-form';
import toast from 'react-hot-toast';
import { Props as ReactSelectProps } from 'react-select';
import CreatableSelect from 'react-select/creatable';

import {
    CreateClientMutationVariables,
    CreateLocalityMutationVariables,
    Locality,
    StateChoices,
} from '@/api/graphql';
import { useCreateClient, useCreateLocality, useLocalities } from '@/api/hooks';

import { RHFFormField } from '@/modules/forms/FormField';
import Input from '@/modules/forms/Input';
import RHFSelect from '@/modules/forms/Select';
import ChevronLeft from '@/modules/icons/ChevronLeft';

import ModalWithBox from './modal-with-box';

import Button from '@/components/Button';
import { STATES_OPTIONS } from '@/constants';

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

type LocalityOptionProps = {
    locality: Pick<Locality, 'id' | 'name' | 'postalCode' | 'state'>;
};

const LocalityOption: React.FC<LocalityOptionProps> = ({ locality }) => (
    <div>
        <span className="block font-bold">{locality.name}</span>
        <div className="flex justify-between text-gray-500">
            <p>
                <span>Provincia:</span> <span>{locality.state}</span>
            </p>
            <p>
                <span>Código Postal:</span> <span>{locality.postalCode}</span>
            </p>
        </div>
    </div>
);

type LocalitiesSelectOption = {
    label: React.ReactNode;
    value: Locality['id'];
    data: LocalityOptionProps['locality'];
};

const removeAccents = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const customFilter: ReactSelectProps<
    | LocalitiesSelectOption
    | {
          __isNew__: boolean;
          label: string;
          value: string;
      },
    false
>['filterOption'] = (option, searchText: string) => {
    if ('__isNew__' in option) {
        return true;
    }

    if (!('data' in option.data)) {
        return true;
    }

    const { name, postalCode, state } = option.data.data;
    const searchTextNoAccents = removeAccents(searchText);

    const nameNoAccents = removeAccents(name);
    const postalCodeNoAccents = removeAccents(postalCode);
    const stateNoAccents = removeAccents(state);

    const searchRegex = new RegExp(searchTextNoAccents, 'i');

    if (
        searchRegex.test(nameNoAccents) ||
        searchRegex.test(postalCodeNoAccents) ||
        searchRegex.test(stateNoAccents)
    ) {
        return true;
    } else {
        return false;
    }
};

type CreateLocalityFormValues = Omit<
    CreateLocalityMutationVariables,
    'state' | 'name'
> & {
    name: string | null;
    state: {
        label: string;
        value: StateChoices;
    };
};

const LocalityField: React.FC = () => {
    const { control: contextControl, setValue: setContextValue } = useFormContext();
    const { data } = useLocalities();

    const useFormMethods = useForm<CreateLocalityFormValues>();
    const {
        handleSubmit,
        register,
        formState: { errors },
        control: modalControl,
        watch,
        setValue,
    } = useFormMethods;

    const { mutate } = useCreateLocality({
        onSuccess: ({ createLocality }) => {
            const error = createLocality?.error;
            const locality = createLocality?.locality;

            if (error) {
                toast.error(error);
            }

            if (locality) {
                setContextValue('localityId', {
                    label: locality.name,
                    value: locality.id,
                });
                setValue('name', null);
            }
        },
    });

    const onSubmit: SubmitHandler<CreateLocalityFormValues> = ({
        name,
        state,
        ...data
    }) => {
        if (name) {
            mutate({
                name,
                state: state.value,
                ...data,
            });
        }
    };

    const handleCreate = (inputValue: string) => {
        setValue('name', inputValue);
    };

    const localityToCreate = watch('name');

    return (
        <>
            <Controller
                name="localityId"
                control={contextControl}
                render={({ field: { onChange, value } }) => (
                    <CreatableSelect
                        classNamePrefix="react-select"
                        isDisabled={!!localityToCreate}
                        isLoading={!!localityToCreate}
                        options={(data ? data.localities : []).map((locality) => {
                            return {
                                label: <LocalityOption locality={locality} />,
                                value: locality.id,
                                data: locality,
                            } as LocalitiesSelectOption;
                        })}
                        filterOption={customFilter}
                        placeholder="Selecciona una localidad"
                        formatCreateLabel={(input) => {
                            return (
                                <span className="font-headings">
                                    Crea la localidad <b>&quot;{input}&quot;</b>
                                </span>
                            );
                        }}
                        formatOptionLabel={(val) => {
                            if ('data' in val) {
                                return <LocalityOption locality={val.data} />;
                            }

                            return <span>{val.label}</span>;
                        }}
                        onCreateOption={handleCreate}
                        value={value}
                        onChange={(val) => {
                            if (val && 'data' in val) {
                                onChange({
                                    value: val.value,
                                    label: val.data.name,
                                });
                            } else {
                                onChange(null);
                            }
                        }}
                    />
                )}
            />

            <ModalWithBox
                show={!!localityToCreate}
                onCancel={() => {
                    watch('name', null);
                }}
                closeOnOutsideClick
            >
                <main className="flex min-h-screen items-center justify-center bg-gray-100 py-14 text-black">
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
                                <h1 className="text-2xl font-bold">Crea una localidad</h1>
                            </div>

                            <div className="mb-20 w-9/12">
                                <FormProvider {...useFormMethods}>
                                    <form className="space-y-4">
                                        <RHFFormField
                                            fieldID="name"
                                            label="Nombre"
                                            showRequired
                                        >
                                            <Input
                                                id="name"
                                                hasError={!!errors.name}
                                                {...register('name', {
                                                    required: true,
                                                })}
                                            />
                                        </RHFFormField>

                                        <RHFFormField
                                            fieldID="postalCode"
                                            label="Código Postal"
                                            showRequired
                                        >
                                            <Input
                                                id="postalCode"
                                                hasError={!!errors.postalCode}
                                                {...register('postalCode', {
                                                    required: true,
                                                })}
                                            />
                                        </RHFFormField>

                                        <RHFFormField
                                            fieldID="state"
                                            label="Provincia"
                                            showRequired
                                        >
                                            <RHFSelect<CreateLocalityFormValues>
                                                id="state"
                                                name="state"
                                                control={modalControl}
                                                options={STATES_OPTIONS}
                                                placeholder="Selecciona una provincia"
                                                rules={{
                                                    required: true,
                                                }}
                                            />
                                        </RHFFormField>
                                    </form>
                                </FormProvider>
                            </div>

                            <NavigationButtons
                                isUniqueStep
                                onCancel={() => {
                                    setValue('name', null);
                                }}
                                onSubmit={handleSubmit(onSubmit)}
                            />
                        </div>
                    </div>
                </main>
            </ModalWithBox>
        </>
    );
};

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

type NavigationButtonsProps = {
    isUniqueStep?: boolean;
    isLastStep?: boolean;
    onPrevious?: () => void;
    onNext?: () => void;
    onCancel: () => void;
    onSubmit: () => void;
};

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
    isUniqueStep,
    isLastStep,
    onPrevious,
    onNext,
    onCancel,
    onSubmit,
}) => {
    if (isUniqueStep) {
        return (
            <div className="mt-auto flex justify-end space-x-16 border-t border-gray-200 py-6">
                <button onClick={onCancel} className="font-headings text-sm">
                    Cancelar
                </button>
                <Button onClick={onSubmit}>Guardar</Button>
            </div>
        );
    }

    if (!isLastStep) {
        return (
            <div className="mt-auto flex justify-end space-x-16 border-t border-gray-200 py-6">
                <button onClick={onCancel} className="font-headings text-sm">
                    Cancelar
                </button>
                <Button onClick={onNext}>Siguiente</Button>
            </div>
        );
    }

    return (
        <div className="mt-auto flex justify-between border-t border-gray-200 py-6">
            <button
                onClick={onPrevious}
                className="flex items-center space-x-3 font-headings text-sm"
            >
                <ChevronLeft /> <span>Atrás</span>
            </button>

            <div className="flex justify-end space-x-16">
                <button className="font-headings text-sm" onClick={onCancel}>
                    Cancelar
                </button>
                <Button onClick={onSubmit}>Guardar</Button>
            </div>
        </div>
    );
};

const Page = () => {
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
        console.log(data);
        if (data) {
            mutate({
                clientData: {
                    ...data,
                    localityId: data.localityId.value,
                },
            });
        }
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
                        onCancel={() => {
                            /* handle cancel logic */
                        }}
                        onSubmit={handleSubmit(onSubmit)}
                    />
                </div>
            </div>
        </main>
    );
};

export default Page;
