'use client';

import Link from 'next/link';

import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';

import { Employee, EmployeesQuery } from '@/api/graphql';
import { useDeleteEmployee, useEmployees, useExportEmployeesCsv } from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import DataTable from '@/modules/data-table/DataTable';
import DataTablePagination from '@/modules/data-table/DataTablePagination';

import Button, { ButtonVariant } from '@/components/Button';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import { TD, TR } from '@/components/Table';

const columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Correo' },
    { key: 'active', label: 'Activo' },
];

const SkeletonRowRenderer = () => {
    const renderer = (key: number) => (
        <TR key={key}>
            {[...new Array(columns.length)].map((_, index) => (
                <TD key={index}>
                    <Skeleton width={100}></Skeleton>
                </TD>
            ))}
        </TR>
    );

    return renderer;
};

const EmployeeRowRenderer = (extraData: React.ReactNode) => {
    const renderer = (employee: ArrayElement<EmployeesQuery['employees']['results']>) => (
        <TR key={employee.id}>
            <TD>
                <Link className="text-violet-600" href={`/empleados/${employee.id}`}>
                    {employee.user.firstName} {employee.user.lastName}
                </Link>
            </TD>
            <TD>{employee.user.email}</TD>
            <TD>{employee.user.isActive ? 'Sí' : 'No'}</TD>
            {extraData}
        </TR>
    );
    return renderer;
};

const Page = () => {
    const { hasPreviousPage, hasNextPage, activePage, noPages, queryResult } =
        useEmployees();

    const { mutate, isLoading: isDeleting } = useDeleteEmployee({
        onSuccess: () => {
            toast.success('El empleado ha sido eliminado');
            queryResult.refetch();
        },
        onError: () => {
            toast.error('Ha ocurrido un error al eliminar al empleado');
        },
    });

    const handleRemove = (id: Employee['id']) => {
        mutate(id);
    };

    const { exportCsv } = useExportEmployeesCsv();

    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>Empleados</DashboardLayoutBigTitle>

                    <div className="flex space-x-8">
                        <Button
                            variant={ButtonVariant.GRAY}
                            onClick={() => {
                                exportCsv({});
                            }}
                        >
                            Exportar a CSV
                        </Button>

                        <Button href="/empleados/add">+ Añadir empleado</Button>
                    </div>
                </div>
            }
        >
            <FetchedDataRenderer
                {...queryResult}
                Loading={
                    <div className="pr-container flex-1 py-5 pl-10">
                        <DataTable
                            columns={columns}
                            data={[...new Array(5)].map((_, index) => index)}
                            rowRenderer={SkeletonRowRenderer}
                        />
                    </div>
                }
                Error={
                    <div className="flex w-full flex-1 items-center justify-center">
                        <FetchStatusMessageWithDescription
                            title="Ha ocurrido un error"
                            line1="Hubo un error al cargar los empleados."
                            line2="Prueba de nuevo más tarde."
                        />
                    </div>
                }
            >
                {({ employees: { results: employees } }) => {
                    if (employees.length === 0) {
                        return (
                            <FetchStatusMessageWithButton
                                message="Aún no hay empleados"
                                btnHref="/empleados/add"
                                btnText="Agrega tu primer empleado"
                            />
                        );
                    }

                    return (
                        <div className="pr-container flex-1 py-5 pl-10">
                            <DataTable
                                columns={columns}
                                data={employees}
                                rowRenderer={EmployeeRowRenderer}
                                deleteOptions={{
                                    confirmationText: (employee) => (
                                        <>
                                            ¿Estás seguro que deseas eliminar a{' '}
                                            <span className="font-bold">
                                                {employee.user.firstName}{' '}
                                                {employee.user.lastName}
                                            </span>
                                            ?
                                        </>
                                    ),
                                    isDeleting: isDeleting,
                                    onDeleteClick: (employee) => {
                                        handleRemove(employee.id);
                                    },
                                }}
                            />

                            <DataTablePagination
                                currentPage={activePage}
                                hasPrevious={hasPreviousPage}
                                hasNext={hasNextPage}
                                totalPages={noPages}
                            />
                        </div>
                    );
                }}
            </FetchedDataRenderer>
        </DashboardLayout>
    );
};

export default Page;
