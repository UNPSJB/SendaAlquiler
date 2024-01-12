import { useFormContext } from 'react-hook-form';

import RHFDeprecatedInput from '@/modules/forms/DeprecatedInput';
import { RHFFormField } from '@/modules/forms/FormField';

import { CreateOrUpdateSupplierFormValues } from '.';
import CreatableSelectLocalityField from '../components/fields/CreatableSelectLocalityField';

const SupplierFormLocationFields: React.FC = () => {
    const {
        control,
        formState: { errors: formErrors },
        setValue,
    } = useFormContext<CreateOrUpdateSupplierFormValues>();

    return (
        <>
            <RHFFormField fieldID="locality" label="Localidad" showRequired>
                <CreatableSelectLocalityField
                    name="locality"
                    control={control}
                    setValue={setValue}
                />
            </RHFFormField>

            <div className="flex space-x-4">
                <RHFFormField
                    className="flex-1"
                    fieldID="streetName"
                    label="Calle"
                    showRequired
                >
                    <RHFDeprecatedInput
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
                    <RHFDeprecatedInput
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
                <RHFDeprecatedInput
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
