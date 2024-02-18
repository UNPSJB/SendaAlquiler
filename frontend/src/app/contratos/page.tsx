'use client';

import Link from 'next/link';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { ContractsQuery } from '@/api/graphql';
import {
    useContracts,
    useDeleteRentalContract,
    useExportRentalContractsCsv,
} from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';

import { AdminDataTable } from '@/components/admin-data-table';
import { AdminDataTableLoading } from '@/components/admin-data-table-skeleton';
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

type RentalContract = ContractsQuery['rentalContracts']['results'][0];

const columnsHelper = createColumnHelper<RentalContract>();

const columns: ColumnDef<RentalContract, any>[] = [
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
    columnsHelper.accessor('currentHistory.status', {
        id: 'status',
        header: 'Estado',
    }),
    columnsHelper.display({
        id: 'actions',
        cell: (props) => {
            const contract = props.row.original;

            return <RowActions contract={contract} />;
        },
    }),
];

const RowActions = ({ contract }: { contract: RentalContract }) => {
    const deleteMutation = useDeleteRentalContract({
        onSuccess: () => {
            toast.success('Contrato eliminado correctamente');
        },
        onError: () => {
            toast.error('Ha ocurrido un error al eliminar el contrato');
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
                            deleteMutation.mutate(contract.id);
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
    const { setVariables, activePage, noPages, queryResult } = useContracts();

    const { exportCsv } = useExportRentalContractsCsv();

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
                            line1="Hubo un error al cargar los contratos."
                            line2="Prueba de nuevo más tarde."
                        />
                    </div>
                }
            >
                {({ rentalContracts }) => {
                    if (rentalContracts.results.length === 0) {
                        return (
                            <FetchStatusMessageWithButton
                                message="Aún no hay contratos"
                                btnHref="/contratos/add"
                                btnText="Agrega tu primer contrato"
                            />
                        );
                    }

                    return (
                        <div className="pr-container flex-1 py-5 pl-10">
                            <AdminDataTable
                                columns={columns}
                                currentPage={activePage}
                                data={rentalContracts.results}
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
