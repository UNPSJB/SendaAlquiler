import { useFormContext } from 'react-hook-form';

import CreatableSelectLocalityField from '@/modules/create-forms/components/fields/CreatableSelectLocalityField';
import Input from '@/modules/forms/DeprecatedInput';
import { RHFFormField } from '@/modules/forms/FormField';

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import { CreateOrUpdateClientFormValues } from '.';

const ClientLocationFormFields: React.FC = () => {
    const {
        formState: { errors },
        control,
    } = useFormContext<CreateOrUpdateClientFormValues>();

    return (
        <>
            <FormField
                name="locality"
                control={control}
                rules={{
                    required: true,
                }}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel required>Localidad</FormLabel>

                        <FormControl>
                            <CreatableSelectLocalityField {...field} />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />

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
