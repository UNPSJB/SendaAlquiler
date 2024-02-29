import { useFormContext } from 'react-hook-form';

import { RHFFormField } from '@/modules/forms/FormField';

import { CreateOrUpdateInternalOrderFormValues } from '.';
import RHFOfficesField from '../components/fields/OfficesField';

const InternalOrderFormOfficesFields: React.FC = () => {
    const { watch, control } = useFormContext<CreateOrUpdateInternalOrderFormValues>();
    const sourceOffice = watch('sourceOffice');
    const targetOffice = watch('targetOffice');

    return (
        <>
            <RHFFormField fieldID="sourceOffice" label="Sucursal de origen" showRequired>
                <RHFOfficesField<CreateOrUpdateInternalOrderFormValues, 'sourceOffice'>
                    control={control}
                    placeholder="Selecciona una sucursal"
                    name="sourceOffice"
                    officeToExclude={targetOffice?.value}
                />
            </RHFFormField>

            <RHFFormField fieldID="targetOffice" label="Sucursal de destino" showRequired>
                <RHFOfficesField
                    control={control}
                    placeholder="Selecciona una sucursal"
                    name="targetOffice"
                    officeToExclude={sourceOffice?.value}
                />
            </RHFFormField>
        </>
    );
};

export default InternalOrderFormOfficesFields;
