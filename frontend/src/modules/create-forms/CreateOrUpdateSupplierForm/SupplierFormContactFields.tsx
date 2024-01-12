import { useFormContext } from 'react-hook-form';

import RHFDeprecatedInput from '@/modules/forms/DeprecatedInput';
import { RHFFormField } from '@/modules/forms/FormField';

import { CreateOrUpdateSupplierFormValues } from '.';

const SupplierFormContactFields: React.FC = () => {
    const {
        control,
        formState: { errors },
    } = useFormContext<CreateOrUpdateSupplierFormValues>();

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
                        id="name"
                        name="name"
                        placeholder="Entidad"
                        hasError={!!errors.name}
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
                    placeholder="entidad@gmail.com"
                    hasError={!!errors.email}
                    control={control}
                    rules={{ required: true }}
                />
            </RHFFormField>

            <RHFFormField fieldID="cuit" label="Cuit" showRequired>
                <RHFDeprecatedInput
                    type="number"
                    id="cuit"
                    name="cuit"
                    placeholder="Cuit de la empresa"
                    hasError={!!errors.cuit}
                    maxLength={10}
                    control={control}
                    rules={{
                        required: true,
                        maxLength: 10,
                    }}
                />
            </RHFFormField>

            <RHFFormField fieldID="phoneCode" label="Código de área" showRequired>
                <RHFDeprecatedInput
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
                <RHFDeprecatedInput
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

export default SupplierFormContactFields;
