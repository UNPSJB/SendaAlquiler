import { useFormContext } from 'react-hook-form';

import fetchClient from '@/api/fetch-client';
import { ClientExistsDocument } from '@/api/graphql';

import { RHFFormField } from '@/modules/forms/FormField';
import Input from '@/modules/forms/Input';

import { CreateOrUpdateClientFormValues } from '.';
import { ModableFormLayoutStepComponentProps } from '../ModableFormLayout';

const ClientContactFormFields: React.FC<
    ModableFormLayoutStepComponentProps<CreateOrUpdateClientFormValues>
> = ({ isUpdate, defaultValues }) => {
    const {
        formState: { errors },
        control,
    } = useFormContext<CreateOrUpdateClientFormValues>();

    return (
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
                        hasError={!!errors.firstName}
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
                        hasError={!!errors.lastName}
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
                    hasError={!!errors.email}
                    control={control}
                    rules={{
                        required: true,
                        validate: async (value) => {
                            const shouldValidate =
                                !isUpdate || (isUpdate && value !== defaultValues?.email);

                            if (!shouldValidate) {
                                return;
                            }

                            const response = await fetchClient(ClientExistsDocument, {
                                email: value,
                                dni: null,
                            });

                            return response.clientExists
                                ? 'Ya existe un cliente con ese correo'
                                : true;
                        },
                    }}
                />
            </RHFFormField>

            <RHFFormField fieldID="dni" label="DNI" showRequired>
                <Input
                    type="number"
                    id="dni"
                    name="dni"
                    placeholder="DNI del cliente"
                    hasError={!!errors.dni}
                    maxLength={10}
                    control={control}
                    rules={{
                        required: true,
                        maxLength: 10,
                        validate: async (value) => {
                            const shouldValidate =
                                !isUpdate || (isUpdate && value !== defaultValues?.dni);

                            if (!shouldValidate) {
                                return;
                            }

                            const response = await fetchClient(ClientExistsDocument, {
                                email: null,
                                dni: value,
                            });

                            return response.clientExists
                                ? 'Ya existe un cliente con ese DNI'
                                : true;
                        },
                    }}
                />
            </RHFFormField>

            <RHFFormField fieldID="phoneCode" label="Código de área" showRequired>
                <Input
                    type="number"
                    id="phoneCode"
                    name="phoneCode"
                    placeholder="549"
                    hasError={!!errors.phoneCode}
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
                    hasError={!!errors.phoneNumber}
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
};

export default ClientContactFormFields;
