'use client';

import { useForm } from 'react-hook-form';

import { CreateLocalityMutationVariables, StateChoices } from '@/api/graphql';

import { STATES_OPTIONS } from '@/constants';

import Input from '../../forms/DeprecatedInput';
import { RHFFormField } from '../../forms/FormField';
import RHFSelect from '../../forms/Select';
import ModableFormLayout, {
    ModableFormComponentProps,
    ModableFormLayoutStep,
} from '../ModableFormLayout';

export type CreateOrUpdateLocalityFormValues = Omit<
    CreateLocalityMutationVariables,
    'state' | 'name'
> & {
    name: string;
    state: {
        label: string;
        value: StateChoices;
    };
};

const Fields = () => {
    const {
        control: modalControl,
        formState: { errors },
    } = useForm<CreateOrUpdateLocalityFormValues>();

    return (
        <>
            <RHFFormField fieldID="name" label="Nombre" showRequired>
                <Input
                    id="name"
                    name="name"
                    control={modalControl}
                    hasError={!!errors.name}
                    rules={{ required: true }}
                />
            </RHFFormField>

            <RHFFormField fieldID="postalCode" label="Código Postal" showRequired>
                <Input
                    id="postalCode"
                    name="postalCode"
                    hasError={!!errors.postalCode}
                    control={modalControl}
                    rules={{ required: true }}
                />
            </RHFFormField>

            <RHFFormField fieldID="state" label="Provincia" showRequired>
                <RHFSelect<CreateOrUpdateLocalityFormValues, 'state'>
                    name="state"
                    control={modalControl}
                    options={STATES_OPTIONS}
                    placeholder="Selecciona una provincia"
                    rules={{ required: true }}
                />
            </RHFFormField>
        </>
    );
};

const steps: ModableFormLayoutStep<CreateOrUpdateLocalityFormValues>[] = [
    {
        key: '1',
        title: 'Información',
        description: 'Completa la información de la localidad',
        Component: Fields,
        fields: ['name', 'postalCode', 'state'],
    },
];

type Props = ModableFormComponentProps<CreateOrUpdateLocalityFormValues>;

const CreateOrUpdateLocalityForm: React.FC<Props> = ({ defaultValues, ...props }) => (
    <ModableFormLayout
        defaultValues={defaultValues}
        title={defaultValues ? 'Editar localidad' : 'Crear localidad'}
        steps={steps}
        {...props}
    />
);

export default CreateOrUpdateLocalityForm;
