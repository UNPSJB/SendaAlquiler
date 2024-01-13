'use client';

import { CreateSupplierInput } from '@/api/graphql';

import { LocalityFieldValue } from '@/modules/create-forms/components/fields/CreatableSelectLocalityField';

import SupplierFormContactFields from './SupplierFormContactFields';
import SupplierFormLocationFields from './SupplierFormLocationFields';

import ModableFormLayout, {
    ModableFormComponentProps,
    ModableFormLayoutStep,
} from '../ModableFormLayout';

export type CreateOrUpdateSupplierFormValues = Omit<CreateSupplierInput, 'locality'> & {
    locality: LocalityFieldValue;
};

const STEPS: ModableFormLayoutStep<CreateOrUpdateSupplierFormValues>[] = [
    {
        key: 'contact-data',
        title: 'Información de contacto',
        description: 'Información de contacto del cliente',
        Component: SupplierFormContactFields,
        fields: ['name', 'email', 'cuit', 'phoneCode', 'phoneNumber'],
    },
    {
        key: 'location-data',
        title: 'Información de ubicación',
        description: 'Información de ubicación del cliente',
        Component: SupplierFormLocationFields,
        fields: ['streetName', 'houseNumber', 'houseUnit'],
    },
];

type Props = ModableFormComponentProps<CreateOrUpdateSupplierFormValues>;

const CreateOrUpdateSupplierForm: React.FC<Props> = ({ defaultValues, ...props }) => (
    <ModableFormLayout
        defaultValues={defaultValues}
        title={defaultValues ? 'Editar proveedor' : 'Crear proveedor'}
        steps={STEPS}
        {...props}
    />
);

export default CreateOrUpdateSupplierForm;
