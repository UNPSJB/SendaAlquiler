import { useFormContext } from 'react-hook-form';

import RHFDeprecatedInput from '@/modules/forms/DeprecatedInput';
import { RHFFormField } from '@/modules/forms/FormField';

import { CreateOrUpdateEmployeeFormValues } from '.';
import RHFOfficesField from '../components/fields/OfficesField';
import { ModableFormLayoutComponentProps } from '../ModableFormLayout';

const EmployeeInfoFormFields: React.FC<ModableFormLayoutComponentProps> = ({
    isEditing,
}) => {
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
                    <RHFDeprecatedInput
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
                    <RHFDeprecatedInput
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
                <RHFDeprecatedInput
                    type="email"
                    id="email"
                    name="email"
                    placeholder="brunodiaz@gmail.com"
                    hasError={!!errors.email}
                    control={control}
                    rules={{ required: true }}
                />
            </RHFFormField>

            {!isEditing && (
                <>
                    <RHFFormField fieldID="password" label="Contraseña" showRequired>
                        <RHFDeprecatedInput
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
                        <RHFDeprecatedInput
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
                    name="offices"
                    control={control}
                    placeholder="Oficinas"
                    officeToExclude={undefined}
                    isMulti
                />
            </RHFFormField>
        </>
    );
};

export default EmployeeInfoFormFields;
