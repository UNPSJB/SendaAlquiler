'use client';

import Link from 'next/link';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { InternalOrderHistoryStatusChoices, InternalOrdersQuery } from '@/api/graphql';
import {
    useDeleteInternalOrder,
    useExportInternalOrdersCsv,
    usePaginatedInternalOrders,
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

type InternalOrder = InternalOrdersQuery['internalOrders']['results'][0];

const columnsHelper = createColumnHelper<InternalOrder>();

const columns: ColumnDef<InternalOrder, any>[] = [
    columnsHelper.accessor('createdOn', {
        id: 'date',
        header: 'Fecha',
        cell: (props) => {
            const internalOrder = props.row.original;

            return (
                <Link
                    className="text-violet-600"
                    href={`/pedidos-internos/${internalOrder.id}`}
                >
                    {new Date(internalOrder.createdOn).toLocaleDateString()}
                </Link>
            );
        },
    }),
    columnsHelper.accessor('officeBranch.name', {
        id: 'office',
        header: 'Origen',
    }),
    columnsHelper.accessor('officeDestination.name', {
        id: 'destination',
        header: 'Destino',
    }),
    columnsHelper.accessor('currentHistory.status', {
        id: 'status',
        header: 'Estado',
        cell: (props) => {
            const internalOrder = props.row.original;

            if (!internalOrder.currentHistory) {
                return '-';
            }

            return <Status status={internalOrder.currentHistory.status} />;
        },
    }),
    columnsHelper.display({
        id: 'actions',
        cell: (props) => {
            const internalOrder = props.row.original;

            return <RowActions internalOrder={internalOrder} />;
        },
    }),
];

const RowActions = ({ internalOrder }: { internalOrder: InternalOrder }) => {
    const deleteMutation = useDeleteInternalOrder({
        onSuccess: () => {
            toast.success('Pedido interno eliminado correctamente');
        },
        onError: () => {
            toast.error('Ha ocurrido un error al eliminar el pedido interno');
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
                        ¿Estás seguro de que quieres eliminar el pedido interno &ldquo;
                        <strong>
                            <em>
                                {new Date(internalOrder.createdOn).toLocaleDateString()}
                            </em>
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
                            deleteMutation.mutate(internalOrder.id);
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

const Status = ({ status }: { status: InternalOrderHistoryStatusChoices }) => {
    if (status === InternalOrderHistoryStatusChoices.Completed) {
        return (
            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                Completado
            </span>
        );
    }

    if (status === InternalOrderHistoryStatusChoices.InProgress) {
        return (
            <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800">
                En progreso
            </span>
        );
    }

    if (status === InternalOrderHistoryStatusChoices.Pending) {
        return (
            <span className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-5 text-yellow-800">
                Pendiente
            </span>
        );
    }

    return (
        <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
            Cancelado
        </span>
    );
};

const Page = () => {
    const { setVariables, activePage, noPages, queryResult } =
        usePaginatedInternalOrders();

    const { exportCsv } = useExportInternalOrdersCsv();

    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>Pedidos Internos</DashboardLayoutBigTitle>

                    <div className="flex space-x-8">
                        <DeprecatedButton
                            variant={ButtonVariant.GRAY}
                            onClick={() => {
                                exportCsv({});
                            }}
                        >
                            Exportar a CSV
                        </DeprecatedButton>

                        <DeprecatedButton href="/pedidos-internos/add">
                            + Añadir pedido
                        </DeprecatedButton>
                    </div>
                </div>
            }
        >
            <FetchedDataRenderer
                {...queryResult}
                Loading={
                    <div className="pr-container flex-1 py-5 pl-10">
                        <AdminDataTableLoading columns={columns} />
                    </div>
                }
                Error={
                    <div className="flex w-full flex-1 items-center justify-center">
                        <FetchStatusMessageWithDescription
                            title="Ha ocurrido un error"
                            line1="Hubo un error al cargar los pedidos internos."
                            line2="Prueba de nuevo más tarde."
                        />
                    </div>
                }
            >
                {({ internalOrders: { results: internalOrders } }) => {
                    if (internalOrders.length === 0) {
                        return (
                            <FetchStatusMessageWithButton
                                message="Aún no hay pedidos internos"
                                btnHref="/pedidos-internos/add"
                                btnText="Agrega tu primer pedido interno"
                            />
                        );
                    }

                    return (
                        <div className="pr-container flex-1 py-5 pl-10">
                            <AdminDataTable
                                columns={columns}
                                currentPage={activePage}
                                data={internalOrders}
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
