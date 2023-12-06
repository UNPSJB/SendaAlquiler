'use client';

import { CreateEmployeeMutationVariables } from '@/api/graphql';

import EmployeeInfoFormFields from './EmployeeInfoFormFields';

import { OfficesFieldValue } from '../components/fields/OfficesField';
import ModableFormLayout, {
    ModableFormComponentProps,
    ModableFormLayoutStep,
} from '../ModableFormLayout';

export type CreateOrUpdateEmployeeFormValues = Omit<
    CreateEmployeeMutationVariables['employeeData'],
    'offices'
> & {
    confirmPassword: string;
    offices: OfficesFieldValue[];
};

const STEPS: ModableFormLayoutStep<CreateOrUpdateEmployeeFormValues>[] = [
    {
        key: 'personal-data',
        title: 'Información personal',
        description: 'Información personal del empleado',
        Component: EmployeeInfoFormFields,
        fields: ['firstName', 'lastName', 'email'],
    },
];

type Props = ModableFormComponentProps<CreateOrUpdateEmployeeFormValues>;

const CreateOrUpdateEmployeeForm: React.FC<Props> = ({ defaultValues, ...props }) => (
    <ModableFormLayout
        title={defaultValues ? 'Editar empleado' : 'Crear empleado'}
        steps={STEPS}
        defaultValues={defaultValues}
        {...props}
    />
);

export default CreateOrUpdateEmployeeForm;
