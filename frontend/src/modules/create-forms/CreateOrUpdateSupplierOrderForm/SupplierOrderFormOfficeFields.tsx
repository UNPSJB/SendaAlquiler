import { useFormContext } from 'react-hook-form';

import { RHFFormField } from '@/modules/forms/FormField';

import { CreateOrUpdateSupplierOrderFormValues } from '.';
import RHFOfficesField from '../components/fields/OfficesField';
import RHFSupplierField from '../components/fields/SupplierField';

const SupplierOrderFormOfficeFields: React.FC = () => {
    const { control } = useFormContext<CreateOrUpdateSupplierOrderFormValues>();

    return (
        <>
            <RHFFormField fieldID="supplier" label="Proveedor" showRequired>
                <RHFSupplierField<CreateOrUpdateSupplierOrderFormValues, 'supplier'>
                    control={control}
                    placeholder="Selecciona un proveedor"
                    name="supplier"
                />
            </RHFFormField>

            <RHFFormField fieldID="targetOffice" label="Sucursal de destino" showRequired>
                <RHFOfficesField
                    control={control}
                    placeholder="Selecciona una sucursal"
                    name="targetOffice"
                    officeToExclude={undefined}
                />
            </RHFFormField>
        </>
    );
};

export default SupplierOrderFormOfficeFields;
