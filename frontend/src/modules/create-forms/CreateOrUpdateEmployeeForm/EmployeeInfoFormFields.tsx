import { useFormContext } from 'react-hook-form';

import { RHFFormField } from '@/modules/forms/FormField';
import RHFInput from '@/modules/forms/Input';

import { CreateOrUpdateEmployeeFormValues } from '.';

const EmployeeInfoFormFields: React.FC = () => {
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
                    rules={{ required: true }}
                />
            </RHFFormField>

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
    );
};

export default EmployeeInfoFormFields;
