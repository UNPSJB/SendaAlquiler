import { useFormContext } from 'react-hook-form';

import fetchClient from '@/api/fetch-client';
import { EmployeeExistsDocument } from '@/api/graphql';

import { RHFFormField } from '@/modules/forms/FormField';
import RHFInput from '@/modules/forms/Input';

import { CreateOrUpdateEmployeeFormValues } from '.';
import RHFOfficesField from '../components/fields/OfficesField';
import { ModableFormLayoutStepComponentProps } from '../ModableFormLayout';

const EmployeeInfoFormFields: React.FC<
    ModableFormLayoutStepComponentProps<CreateOrUpdateEmployeeFormValues>
> = ({ isUpdate, defaultValues }) => {
    const {
        control,
        formState: { errors },
        getValues,
    } = useFormContext<CreateOrUpdateEmployeeFormValues>();

    return (
        <>
            <div className="flex space-x-4">
                <RHFFormField
                    className="flex-1"
                    fieldID="firstName"
                    label="Nombre"
                    showRequired
                >
                    <RHFInput
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
                    <RHFInput
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
                <RHFInput
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

                            const response = await fetchClient(EmployeeExistsDocument, {
                                email: value,
                            });

                            return response.employeeExists
                                ? 'Ya existe un empleado con ese correo'
                                : true;
                        },
                    }}
                />
            </RHFFormField>

            {!isUpdate && (
                <>
                    <RHFFormField fieldID="password" label="Contraseña" showRequired>
                        <RHFInput
                            type="password"
                            id="password"
                            name="password"
                            placeholder="**********"
                            hasError={!!errors.password}
                            minLength={8}
                            control={control}
                            rules={{ required: true }}
                        />
                    </RHFFormField>

                    <RHFFormField
                        fieldID="confirmPassword"
                        label="Confirme contraseña"
                        showRequired
                    >
                        <RHFInput
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="**********"
                            hasError={!!errors.confirmPassword}
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
            )}

            <RHFFormField fieldID="offices" label="Oficinas" showRequired>
                <RHFOfficesField<CreateOrUpdateEmployeeFormValues, 'offices', true>
                    isMulti
                    name="offices"
                    control={control}
                    placeholder="Oficinas"
                    officeToExclude={undefined}
                    rules={{
                        required: true,
                        validate: (value) => {
                            const isValid = value.length > 0;
                            return isValid || 'Debes seleccionar al menos una oficina';
                        },
                    }}
                />
            </RHFFormField>
        </>
    );
};

export default EmployeeInfoFormFields;
