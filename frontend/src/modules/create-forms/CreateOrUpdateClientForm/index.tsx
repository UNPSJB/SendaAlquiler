'use client';

import { CreateClientInput } from '@/api/graphql';

import { LocalityFieldValue } from '@/modules/create-forms/components/fields/CreatableSelectLocalityField';

import ClientContactFormFields from './ClientContactFormFields';
import ClientLocationFormFields from './ClientLocationFormFields';

import ModableFormLayout, {
    ModableFormComponentProps,
    ModableFormLayoutStep,
} from '../ModableFormLayout';

export type CreateOrUpdateClientFormValues = Omit<CreateClientInput, 'localityId'> & {
    locality: LocalityFieldValue;
};

const STEPS: ModableFormLayoutStep<CreateOrUpdateClientFormValues>[] = [
    {
        key: 'contact-data',
        title: 'Información de contacto',
        description: 'Información de contacto del cliente',
        Component: ClientContactFormFields,
        fields: ['firstName', 'lastName', 'email', 'dni', 'phoneCode', 'phoneNumber'],
    },
    {
        key: 'location-data',
        title: 'Información de ubicación',
        description: 'Información de ubicación del cliente',
        Component: ClientLocationFormFields,
        fields: ['streetName', 'houseNumber', 'houseUnit'],
    },
];

type Props = ModableFormComponentProps<CreateOrUpdateClientFormValues>;

const CreateOrUpdateClientForm: React.FC<Props> = ({ defaultValues, ...props }) => (
    <ModableFormLayout<CreateOrUpdateClientFormValues>
        steps={STEPS}
        title={defaultValues?.dni ? 'Editar cliente' : 'Crear cliente'}
        defaultValues={defaultValues}
        {...props}
    />
);

export default CreateOrUpdateClientForm;
