'use client';

import { useParams, useRouter } from 'next/navigation';

import toast from 'react-hot-toast';

import { useEmployeeById, useUpdateEmployee } from '@/api/hooks';

import CreateOrUpdateEmployeeForm from '@/modules/create-forms/CreateOrUpdateEmployeeForm';

import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import Spinner from '@/components/Spinner/Spinner';

const Page = () => {
    const { id } = useParams();
    const useEmployeeByIdResult = useEmployeeById(id as string);

    const router = useRouter();
    const { mutate, isLoading } = useUpdateEmployee({
        onSuccess: (data) => {
            const error = data.updateEmployee?.error;
            const employee = data.updateEmployee?.employee;
            if (error) {
                toast.error(error);
            }

            if (employee) {
                toast.success('Empleado actualizado exitosamente');
                router.push(`/empleados/${id}`);
            }
        },
        onError: () => {
            toast.error('Hubo un error al actualizar el empleado');
        },
    });

    return (
        <FetchedDataRenderer
            {...useEmployeeByIdResult}
            Error={
                <FetchStatusMessageWithButton
                    message="Hubo un error al cargar el empleado"
                    btnText="Volver a intentar"
                    btnHref={`/empleados/${id}`}
                />
            }
            Loading={
                <div className="flex w-full flex-1 items-center justify-center">
                    <Spinner />
                </div>
            }
        >
            {({ employeeById }) => {
                if (!employeeById) {
                    return (
                        <FetchStatusMessageWithButton
                            message="Parece que el empleado que buscas no existe."
                            btnHref="/empleados"
                            btnText='Volver a "Empleados"'
                        />
                    );
                }

                return (
                    <CreateOrUpdateEmployeeForm
                        defaultValues={{
                            email: employeeById.user.email,
                            firstName: employeeById.user.firstName,
                            lastName: employeeById.user.lastName,
                            offices: employeeById.offices.map((office) => {
                                return {
                                    data: office,
                                    label: office.name,
                                    value: office.id,
                                };
                            }),
                        }}
                        mutate={(data) => {
                            mutate({
                                id: id as string,
                                employeeData: {
                                    email: data.email,
                                    firstName: data.firstName,
                                    lastName: data.lastName,
                                    offices: data.offices.map((office) => office.value),
                                },
                            });
                        }}
                        cancelHref={`/empleados/${id}`}
                        isMutating={isLoading}
                    />
                );
            }}
        </FetchedDataRenderer>
    );
};

export default Page;
