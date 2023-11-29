'use client';

import { useFormContext } from 'react-hook-form';

import InternalOrderFormOfficesFields from './InternalOrderFormOfficesFields';
import InternalOrderFormProductsFields from './InternalOrderFormProductsFields';

import { OfficesFieldValue } from '../components/fields/OfficesField';
import { ProductsFromOfficeFieldValue } from '../components/fields/ProductsFromOfficeField';
import ModableFormLayout, {
    ModableFormComponentProps,
    ModableFormLayoutStep,
} from '../ModableFormLayout';

export type CreateOrUpdateInternalOrderFormValues = {
    officeBranch: OfficesFieldValue;
    officeDestination: OfficesFieldValue;
    products: ProductsFromOfficeFieldValue['products'];
};

const ProductsDataStepDescription = () => {
    const { watch } = useFormContext<CreateOrUpdateInternalOrderFormValues>();
    const originOffice = watch('officeBranch');
    const destinationOffice = watch('officeDestination');

    return (
        <>
            Lista de productos a pedir desde{' '}
            <b>
                <em>{originOffice?.label}</em>
            </b>{' '}
            a{' '}
            <b>
                <em>{destinationOffice?.label}</em>
            </b>
        </>
    );
};

const STEPS: ModableFormLayoutStep<CreateOrUpdateInternalOrderFormValues>[] = [
    {
        key: 'suppliers-data',
        title: 'Origen y destino',
        description: () => 'Información de origen y destino del pedido',
        Component: InternalOrderFormOfficesFields,
        fields: ['officeBranch', 'officeDestination'],
    },
    {
        key: 'products-data',
        title: 'Productos',
        description: ProductsDataStepDescription,
        Component: InternalOrderFormProductsFields,
        fields: ['products'],
    },
];

type Props = ModableFormComponentProps<CreateOrUpdateInternalOrderFormValues>;

const CreateOrUpdateInternalOrderForm: React.FC<Props> = ({
    defaultValues,
    ...props
}) => {
    return (
        <ModableFormLayout<CreateOrUpdateInternalOrderFormValues>
            steps={STEPS}
            defaultValues={defaultValues}
            title={defaultValues ? 'Editar pedido interno' : 'Nuevo pedido interno'}
            {...props}
        />
    );
};

export default CreateOrUpdateInternalOrderForm;
