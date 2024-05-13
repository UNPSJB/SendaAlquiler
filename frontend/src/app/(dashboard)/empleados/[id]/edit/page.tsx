'use client';

import { useParams } from 'next/navigation';

import { useEmployeeById } from '@/api/hooks';

import DashboardLayout from '@/modules/dashboard/DashboardLayout';
import { EmployeeFormEditor } from '@/modules/editors/employee/employee-form-editor';

import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import { DashboardLayoutContentLoading } from '@/components/page-loading';

const Page = () => {
    const { id } = useParams();
    const useEmployeeByIdResult = useEmployeeById(id as string);

    return (
        <DashboardLayout>
            <FetchedDataRenderer
                {...useEmployeeByIdResult}
                Error={
                    <FetchStatusMessageWithButton
                        message="Hubo un error al cargar el empleado"
                        btnText="Volver a intentar"
                        btnHref={`/empleados/${id}`}
                    />
                }
                Loading={<DashboardLayoutContentLoading />}
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
                        <EmployeeFormEditor
                            cancelHref={`/empleados/${id}`}
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
                            idToUpdate={id as string}
                        />
                    );
                }}
            </FetchedDataRenderer>
        </DashboardLayout>
    );
};

export default Page;
