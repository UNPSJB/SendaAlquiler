import { useFormContext } from 'react-hook-form';

import { RHFFormField } from '@/modules/forms/FormField';
import RHFInput from '@/modules/forms/Input';

import { CreateOrUpdateSupplierFormValues } from '.';
import LocalityField from '../components/fields/LocalityField';

const SupplierFormLocationFields: React.FC = () => {
    const {
        control,
        formState: { errors: formErrors },
        setValue,
    } = useFormContext<CreateOrUpdateSupplierFormValues>();

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
                    <RHFInput
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
                    <RHFInput
                        id="houseNumber"
                        name="houseNumber"
                        hasError={!!formErrors.houseNumber}
                        control={control}
                        rules={{ required: true }}
                    />
                </RHFFormField>
            </div>

            <RHFFormField
                fieldID="houseUnit"
                label="Apartamento, habitación, unidad, etc"
            >
                <RHFInput
                    id="houseUnit"
                    name="houseUnit"
                    hasError={!!formErrors.houseUnit}
                    control={control}
                    rules={{ required: false }}
                />
            </RHFFormField>
        </>
    );
};

export default SupplierFormLocationFields;
