import { useFormContext } from 'react-hook-form';

import LocalityField from '@/modules/create-forms/components/fields/LocalityField';
import { RHFFormField } from '@/modules/forms/FormField';
import Input from '@/modules/forms/Input';

import { CreateOrUpdateClientFormValues } from '.';

const ClientLocationFormFields: React.FC = () => {
    const {
        formState: { errors },
        control,
        setValue,
    } = useFormContext<CreateOrUpdateClientFormValues>();

    return (
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
                        hasError={!!errors.streetName}
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
                        hasError={!!errors.houseNumber}
                        control={control}
                        rules={{ required: true }}
                    />
                </RHFFormField>
            </div>

            <RHFFormField
                fieldID="houseUnit"
                label="Apartamento, habitación, unidad, etc"
            >
                <Input
                    id="houseUnit"
                    name="houseUnit"
                    hasError={!!errors.houseUnit}
                    control={control}
                    rules={{ required: false }}
                />
            </RHFFormField>
        </>
    );
};

export default ClientLocationFormFields;
