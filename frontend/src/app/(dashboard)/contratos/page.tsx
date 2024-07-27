'use client';

import Link from 'next/link';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { ContractsQuery, ContractHistoryStatusChoices } from '@/api/graphql';
import {
    usePaginatedContracts,
    useDeleteContract,
    useExportContractsCsv,
} from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';

import { AdminDataTable } from '@/components/admin-data-table';
import { AdminDataTableLoading } from '@/components/admin-data-table-skeleton';
import { AdminTableFilter } from '@/components/admin-table-filter';
import { ContractStatusBadge } from '@/components/badges';
import DeprecatedButton, { ButtonVariant } from '@/components/Button';
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

type Contract = ContractsQuery['contracts']['results'][0];

const columnsHelper = createColumnHelper<Contract>();

const columns: ColumnDef<Contract, any>[] = [
    columnsHelper.accessor('createdOn', {
        id: 'date',
        header: 'Fecha',
        cell: (props) => {
            const contract = props.row.original;

            return (
                <Link className="text-violet-600" href={`/contratos/${contract.id}`}>
                    {new Date(contract.createdOn).toLocaleDateString()}
                </Link>
            );
        },
    }),
    columnsHelper.accessor('office.name', {
        id: 'office',
        header: 'Sucursal',
    }),
    columnsHelper.accessor('latestHistoryEntry.status', {
        id: 'status',
        header: 'Estado',
        cell: (props) => {
            const contract = props.row.original;

            if (!contract.latestHistoryEntry) {
                return '-';
            }

            return <ContractStatusBadge status={contract.latestHistoryEntry.status} />;
        },
    }),
    columnsHelper.display({
        id: 'actions',
        cell: (props) => {
            const contract = props.row.original;

            return (
                <div className="flex justify-end">
                    <RowActions contract={contract} />
                </div>
            );
        },
    }),
];

const RowActions = ({ contract }: { contract: Contract }) => {
    const deleteMutation = useDeleteContract();

    const [open, setOpen] = useState(false);

    return (
        <Dialog
            onOpenChange={(next) => {
                if (deleteMutation.isPending) {
                    return;
                }

                setOpen(next);
            }}
            open={open}
        >
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <MoreVertical className="size-5" />
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
                        ¿Estás seguro de que quieres eliminar el contrato &ldquo;
                        <strong>
                            <em>{new Date(contract.createdOn).toLocaleDateString()}</em>
                        </strong>
                        &rdquo;?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Cancelar</Button>
                    </DialogClose>

                    <Button
                        onClick={() => {
                            deleteMutation.mutate(contract.id, {
                                onSuccess: () => {
                                    toast.success(
                                        `El contract #${contract.id} ha sido eliminado.`,
                                    );
                                    setOpen(false);
                                },
                                onError: () => {
                                    toast.error(
                                        `No se pudo eliminar el contract #${contract.id}.`,
                                    );
                                },
                            });
                        }}
                        variant="destructive"
                    >
                        Eliminar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const Page = () => {
    const { setVariables, activePage, noPages, queryResult, variables } =
        usePaginatedContracts();

    const { exportCsv } = useExportContractsCsv();

    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>Contratos</DashboardLayoutBigTitle>

                    <div className="flex space-x-8">
                        <DeprecatedButton
                            variant={ButtonVariant.GRAY}
                            onClick={() => {
                                exportCsv({});
                            }}
                        >
                            Exportar a CSV
                        </DeprecatedButton>

                        <DeprecatedButton href="/contratos/add">
                            + Presupuestar contrato
                        </DeprecatedButton>
                    </div>
                </div>
            }
        >
            <div className="pr-container mb-4 flex space-x-2 pl-8 pt-5">
                <AdminTableFilter
                    title="Filtrar por estado"
                    options={[
                        {
                            label: 'Activo',
                            value: ContractHistoryStatusChoices.Activo,
                        },
                        {
                            label: 'Cancelado',
                            value: ContractHistoryStatusChoices.Cancelado,
                        },
                        {
                            label: 'Con deposito',
                            value: ContractHistoryStatusChoices.ConDeposito,
                        },
                        {
                            label: 'Devolucion exitosa',
                            value: ContractHistoryStatusChoices.DevolucionExitosa,
                        },
                        {
                            label: 'Devolucion fallida',
                            value: ContractHistoryStatusChoices.DevolucionFallida,
                        },
                        {
                            label: 'Finalizado',
                            value: ContractHistoryStatusChoices.Finalizado,
                        },
                        {
                            label: 'Pagado',
                            value: ContractHistoryStatusChoices.Pagado,
                        },
                        {
                            label: 'Presupuestado',
                            value: ContractHistoryStatusChoices.Presupuestado,
                        },
                        {
                            label: 'Vencido',
                            value: ContractHistoryStatusChoices.Vencido,
                        },
                    ]}
                    onSelect={(selected) => {
                        setVariables('status', selected);
                    }}
                    selectedValues={variables.status}
                    onClear={() => {
                        setVariables('status', []);
                    }}
                />
            </div>
            <FetchedDataRenderer
                {...queryResult}
                Loading={
                    <div className="pr-container flex-1 py-5 pl-8">
                        <AdminDataTableLoading columns={columns} />{' '}
                    </div>
                }
                Error={
                    <div className="flex w-full flex-1 items-center justify-center">
                        <FetchStatusMessageWithDescription
                            title="Ha ocurrido un error"
                            line1="Hubo un error al cargar los contratos."
                            line2="Prueba de nuevo más tarde."
                        />
                    </div>
                }
            >
                {({ contracts }) => {
                    if (contracts.results.length === 0) {
                        return (
                            <FetchStatusMessageWithButton
                                message="Aún no hay contratos"
                                btnHref="/contratos/add"
                                btnText="Agrega tu primer contrato"
                            />
                        );
                    }

                    return (
                        <div className="pr-container flex-1 pl-8">
                            <AdminDataTable
                                columns={columns}
                                currentPage={activePage}
                                data={contracts.results}
                                numberOfPages={noPages}
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
