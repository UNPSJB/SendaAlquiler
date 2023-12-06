'use client';

import { useRouter } from 'next/navigation';

import { SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useCreateEmployee } from '@/api/hooks';

import CreateOrUpdateEmployeeForm, {
    CreateOrUpdateEmployeeFormValues,
} from '@/modules/create-forms/CreateOrUpdateEmployeeForm';

const Page = () => {
    const router = useRouter();

    const { mutate, isLoading } = useCreateEmployee({
        onSuccess: (data) => {
            const error = data.createEmployee?.error;
            const client = data.createEmployee?.employee;
            if (error) {
                toast.error(error);
            }

            if (client) {
                toast.success('Empleado creado exitosamente');
                router.push('/empleados');
            }
        },
        onError: () => {
            toast.error('No se pudo crear el empleado');
        },
    });

    const onSubmit: SubmitHandler<CreateOrUpdateEmployeeFormValues> = (data) => {
        const password = data.password;
        const confirmPassword = data['confirmPassword'];
        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        mutate({
            employeeData: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                offices: data.offices.map((office) => office.value),
            },
        });
    };

    return (
        <CreateOrUpdateEmployeeForm
            cancelHref="/empleados"
            mutate={onSubmit}
            isMutating={isLoading}
        />
    );
};

export default Page;
