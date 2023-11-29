'use client';

import { CreateEmployeeMutationVariables } from '@/api/graphql';

import EmployeeInfoFormFields from './EmployeeInfoFormFields';

import ModableFormLayout, {
    ModableFormComponentProps,
    ModableFormLayoutStep,
} from '../ModableFormLayout';

export type CreateOrUpdateEmployeeFormValues =
    CreateEmployeeMutationVariables['employeeData'] & {
        confirmPassword: string;
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
        {...props}
        steps={STEPS}
    />
);

export default CreateOrUpdateEmployeeForm;
