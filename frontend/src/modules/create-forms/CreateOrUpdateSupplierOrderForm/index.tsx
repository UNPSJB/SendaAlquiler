'use client';

import { useFormContext } from 'react-hook-form';

import SupplierOrderFormOfficeFields from './SupplierOrderFormOfficeFields';
import SupplierOrderFormProductsFields from './SupplierOrderFormProductsFields';

import { OfficesFieldValue } from '../components/fields/OfficesField';
import { SupplierFieldValue } from '../components/fields/SupplierField';
import ModableFormLayout, {
    ModableFormComponentProps,
    ModableFormLayoutStep,
} from '../ModableFormLayout';

export type CreateOrUpdateSupplierOrderFormValues = {
    supplier: SupplierFieldValue;
    targetOffice: OfficesFieldValue;
    products: {
        product: {
            value: string;
            label: string;
        };
        quantity: number;
    }[];
};

const ProductsDataStepDescription = () => {
    const { watch } = useFormContext<CreateOrUpdateSupplierOrderFormValues>();
    const supplier = watch('supplier');
    const destinationOffice = watch('targetOffice');

    return (
        <>
            Lista de productos a pedir desde{' '}
            <b>
                <em>{supplier?.label}</em>
            </b>{' '}
            a{' '}
            <b>
                <em>{destinationOffice?.label}</em>
            </b>
        </>
    );
};

const STEPS: ModableFormLayoutStep<CreateOrUpdateSupplierOrderFormValues>[] = [
    {
        key: 'suppliers-data',
        title: 'Origen y destino',
        description: () => 'Información de origen y destino del pedido',
        Component: SupplierOrderFormOfficeFields,
        fields: ['supplier', 'targetOffice'],
    },
    {
        key: 'products-data',
        title: 'Productos',
        description: ProductsDataStepDescription,
        Component: SupplierOrderFormProductsFields,
        fields: ['products'],
    },
];

type Props = ModableFormComponentProps<CreateOrUpdateSupplierOrderFormValues>;

const CreateOrUpdateSupplierOrderForm: React.FC<Props> = ({
    defaultValues,
    ...props
}) => (
    <ModableFormLayout
        defaultValues={defaultValues}
        title={defaultValues ? 'Editar pedido' : 'Nuevo pedido'}
        steps={STEPS}
        {...props}
    />
);

export default CreateOrUpdateSupplierOrderForm;
