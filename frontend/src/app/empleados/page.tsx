'use client';

import Link from 'next/link';

import Skeleton from 'react-loading-skeleton';

import { Employee, EmployeesQuery } from '@/api/graphql';
import { useEmployees } from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import DataTable from '@/modules/data-table/DataTable';
import DataTableDropdown from '@/modules/data-table/DataTableDropdown';
import DataTablePagination from '@/modules/data-table/DataTablePagination';

import Button from '@/components/Button';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import { TD, TR } from '@/components/Table';

const columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Correo' },
    { key: 'active', label: 'Activo' },
    { key: 'dropdown', label: '' },
];

const SkeletonRowRenderer = (key: number) => (
    <TR key={key}>
        {[...new Array(columns.length)].map((_, index) => (
            <TD key={index}>
                <Skeleton width={100}></Skeleton>
            </TD>
        ))}
    </TR>
);

const EmployeeRowRenderer = (handleRemove: (id: Employee['id']) => void) => {
    const renderer = (employee: ArrayElement<EmployeesQuery['users']>) => (
        <TR key={employee.id}>
            <TD>
                <Link className="text-violet-600" href={`/empleados/${employee.id}`}>
                    {employee.firstName} {employee.lastName}
                </Link>
            </TD>
            <TD>{employee.email}</TD>
            <TD>{employee.isActive ? 'Sí' : 'No'}</TD>
            <TD>
                <DataTableDropdown onRemove={() => handleRemove(employee.id)} />
            </TD>
        </TR>
    );
    return renderer;
};

const Page = () => {
    const useEmployeesResult = useEmployees();

    const handlePrevious = () => {
        console.log('previous');
    };

    const handleNext = () => {
        console.log('next');
    };

    const handleRemove = (id: Employee['id']) => {
        console.log(`remove ${id}`);
    };

    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>Empleados</DashboardLayoutBigTitle>

                    <Button href="/empleados/add">+ Añadir empleado</Button>
                </div>
            }
        >
            <FetchedDataRenderer
                {...useEmployeesResult}
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
                {({ users }) => {
                    if (users.length === 0) {
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
                                data={users}
                                rowRenderer={EmployeeRowRenderer(handleRemove)}
                            />

                            <DataTablePagination
                                onPrevious={handlePrevious}
                                onNext={handleNext}
                            />
                        </div>
                    );
                }}
            </FetchedDataRenderer>
        </DashboardLayout>
    );
};

export default Page;