import { useFormContext } from 'react-hook-form';

import { RHFFormField } from '@/modules/forms/FormField';

import { CreateOrUpdateInternalOrderFormValues } from '.';
import RHFOfficesField from '../components/fields/OfficesField';

const InternalOrderFormOfficesFields: React.FC = () => {
    const { watch, control } = useFormContext<CreateOrUpdateInternalOrderFormValues>();
    const officeBranch = watch('officeBranch');
    const officeDestination = watch('officeDestination');

    return (
        <>
            <RHFFormField fieldID="officeBranch" label="Sucursal de origen" showRequired>
                <RHFOfficesField<CreateOrUpdateInternalOrderFormValues, 'officeBranch'>
                    control={control}
                    placeholder="Selecciona una sucursal"
                    name="officeBranch"
                    officeToExclude={officeDestination?.value}
                />
            </RHFFormField>

            <RHFFormField
                fieldID="officeDestination"
                label="Sucursal de destino"
                showRequired
            >
                <RHFOfficesField
                    control={control}
                    placeholder="Selecciona una sucursal"
                    name="officeDestination"
                    officeToExclude={officeBranch?.value}
                />
            </RHFFormField>
        </>
    );
};

export default InternalOrderFormOfficesFields;
