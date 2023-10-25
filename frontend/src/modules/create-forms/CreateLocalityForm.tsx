'use client';

import Link from 'next/link';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import {
    CreateLocalityMutation,
    CreateLocalityMutationVariables,
    StateChoices,
} from '@/api/graphql';
import { useCreateLocality } from '@/api/hooks';

import NavigationButtons, { NavigationButtonsCancelProps } from './NavigationButtons';

import { STATES_OPTIONS } from '@/constants';

import { RHFFormField } from '../forms/FormField';
import Input from '../forms/Input';
import RHFSelect from '../forms/Select';

type CreateLocalityFormValues = Omit<
    CreateLocalityMutationVariables,
    'state' | 'name'
> & {
    name: string;
    state: {
        label: string;
        value: StateChoices;
    };
};

type Props = {
    onSuccess?: (
        locality: NonNullable<
            NonNullable<CreateLocalityMutation['createLocality']>['locality']
        >,
    ) => void;
    defaultValues?: Partial<CreateLocalityFormValues>;
} & NavigationButtonsCancelProps;

const CreateLocalityForm: React.FC<Props> = ({
    onSuccess,
    defaultValues,
    ...cancelProps
}) => {
    const useFormMethods = useForm<CreateLocalityFormValues>({
        defaultValues,
    });

    const {
        handleSubmit,
        register,
        formState: { errors },
        control: modalControl,
    } = useFormMethods;

    const { mutate } = useCreateLocality({
        onSuccess: ({ createLocality }) => {
            const error = createLocality?.error;
            const locality = createLocality?.locality;

            if (error) {
                toast.error(error);
            }

            if (locality && onSuccess) {
                onSuccess(locality);
            }
        },
    });

    const onSubmit: SubmitHandler<CreateLocalityFormValues> = ({
        name,
        state,
        ...data
    }) => {
        mutate({
            name,
            state: state.value,
            ...data,
        });
    };

    return (
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
                                <RHFFormField fieldID="name" label="Nombre" showRequired>
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
                        onSubmit={handleSubmit(onSubmit)}
                        {...cancelProps}
                    />
                </div>
            </div>
        </main>
    );
};

export default CreateLocalityForm;
