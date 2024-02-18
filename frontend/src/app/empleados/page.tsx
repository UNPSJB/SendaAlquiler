'use client';

import Link from 'next/link';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { EmployeesQuery } from '@/api/graphql';
import { useDeleteEmployee, useEmployees, useExportEmployeesCsv } from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';

import { AdminDataTable } from '@/components/admin-data-table';
import { AdminDataTableLoading } from '@/components/admin-data-table-skeleton';
import DeprecatedButton, { ButtonVariant } from '@/components/Button';
import ButtonWithSpinner from '@/components/ButtonWithSpinner';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Employee = EmployeesQuery['employees']['results'][0];

const columnsHelper = createColumnHelper<Employee>();

const columns: ColumnDef<Employee, any>[] = [
    columnsHelper.accessor('user.firstName', {
        id: 'name',
        header: 'Empleado',
        cell: (props) => {
            const employee = props.row.original;

            return (
                <Link className="text-violet-600" href={`/empleados/${employee.id}`}>
                    <p>
                        {employee.user.firstName} {employee.user.lastName}
                    </p>

                    <p>
                        <span className="text-muted-foreground">
                            {employee.user.email}
                        </span>
                    </p>
                </Link>
            );
        },
    }),
    columnsHelper.accessor('user.isActive', {
        id: 'active',
        header: 'Activo',
        cell: (props) => {
            const isActive = props.getValue();

            return isActive ? 'Sí' : 'No';
        },
    }),
    columnsHelper.display({
        id: 'actions',
        cell: (props) => {
            const employee = props.row.original;
            return <RowActions employee={employee} />;
        },
    }),
];

const RowActions = ({ employee }: { employee: Employee }) => {
    const deleteMutation = useDeleteEmployee({
        onSuccess: () => {
            toast.success('Empleado eliminado correctamente');
        },
        onError: () => {
            toast.error('Ha ocurrido un error al eliminar el empleado');
        },
    });

    const [open, setOpen] = useState(false);

    return (
        <Dialog
            onOpenChange={(next) => {
                if (deleteMutation.isLoading) {
                    return;
                }

                setOpen(next);
            }}
            open={open}
        >
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <MoreVertical className="h-5 w-5" />
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    <DialogTrigger asChild>
                        <DropdownMenuItem>Eliminar</DropdownMenuItem>
                    </DialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmar eliminación</DialogTitle>
                    <DialogDescription>
                        ¿Estás seguro de que quieres eliminar al empleado &ldquo;
                        <strong>
                            <em>
                                {employee.user.firstName} {employee.user.lastName}
                            </em>
                        </strong>
                        &rdquo;?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Cancelar</Button>
                    </DialogClose>

                    <ButtonWithSpinner
                        onClick={() => {
                            deleteMutation.mutate(employee.id, {
                                onSuccess: () => {
                                    toast.success(
                                        `El empleado ${employee.user.firstName} ${employee.user.lastName} ha sido eliminado.`,
                                    );
                                    setOpen(false);
                                },
                                onError: () => {
                                    toast.error(
                                        `No se pudo eliminar el empleado ${employee.user.firstName} ${employee.user.lastName}`,
                                    );
                                },
                            });
                        }}
                        variant="destructive"
                        showSpinner={deleteMutation.isLoading}
                    >
                        Eliminar
                    </ButtonWithSpinner>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const Page = () => {
    const { setVariables, activePage, noPages, queryResult } = useEmployees();

    const { exportCsv } = useExportEmployeesCsv();

    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>Empleados</DashboardLayoutBigTitle>

                    <div className="flex space-x-8">
                        <DeprecatedButton
                            variant={ButtonVariant.GRAY}
                            onClick={() => {
                                exportCsv({});
                            }}
                        >
                            Exportar a CSV
                        </DeprecatedButton>

                        <DeprecatedButton href="/empleados/add">
                            + Añadir empleado
                        </DeprecatedButton>
                    </div>
                </div>
            }
        >
            <FetchedDataRenderer
                {...queryResult}
                Loading={
                    <div className="pr-container flex-1 py-5 pl-10">
                        <AdminDataTableLoading columns={columns} />{' '}
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
                            <AdminDataTable
                                columns={columns}
                                data={employees}
                                numberOfPages={noPages}
                                currentPage={activePage}
                                onPageChange={(page: number) => {
                                    setVariables('page', page);
                                }}
                            />
                        </div>
                    );
                }}
            </FetchedDataRenderer>
        </DashboardLayout>
    );
};

export default Page;
