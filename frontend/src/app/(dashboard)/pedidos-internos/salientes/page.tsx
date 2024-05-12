'use client';

import Link from 'next/link';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import {
    InternalOrderHistoryStatusChoices,
    InternalOrderQueryDirection,
    InternalOrdersQuery,
} from '@/api/graphql';
import {
    useDeleteInternalOrder,
    useExportInternalOrdersCsv,
    usePaginatedInternalOrders,
} from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';

import { useOfficeContext } from '@/app/OfficeProvider';

import { AdminDataTable } from '@/components/admin-data-table';
import { AdminDataTableLoading } from '@/components/admin-data-table-skeleton';
import { AdminTableFilter } from '@/components/admin-table-filter';
import { InternalOrderStatusBadge } from '@/components/badges';
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
    columnsHelper.accessor('sourceOffice.name', {
        id: 'office',
        header: 'Origen',
    }),
    columnsHelper.accessor('targetOffice.name', {
        id: 'destination',
        header: 'Destino',
    }),
    columnsHelper.accessor('latestHistoryEntry.status', {
        id: 'status',
        header: 'Estado',
        cell: (props) => {
            const internalOrder = props.row.original;

            if (!internalOrder.latestHistoryEntry) {
                return '-';
            }

            return (
                <InternalOrderStatusBadge
                    status={internalOrder.latestHistoryEntry.status}
                />
            );
        },
    }),
    columnsHelper.display({
        id: 'actions',
        cell: (props) => {
            const internalOrder = props.row.original;

            return (
                <div className="flex justify-end">
                    <RowActions internalOrder={internalOrder} />
                </div>
            );
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

const Page = () => {
    const { setVariables, activePage, noPages, queryResult, variables } =
        usePaginatedInternalOrders(InternalOrderQueryDirection.Outgoing);

    const { exportCsv } = useExportInternalOrdersCsv();
    const officeContext = useOfficeContext();

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
            <div className="pr-container mb-4 flex space-x-2 pl-8 pt-5">
                <AdminTableFilter
                    title="Filtrar por estado"
                    options={[
                        {
                            label: 'Pendiente',
                            value: InternalOrderHistoryStatusChoices.Pending,
                        },
                        {
                            label: 'En progreso',
                            value: InternalOrderHistoryStatusChoices.InProgress,
                        },
                        {
                            label: 'Completado',
                            value: InternalOrderHistoryStatusChoices.Completed,
                        },
                        {
                            label: 'Cancelado',
                            value: InternalOrderHistoryStatusChoices.Canceled,
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
                        <div className="pr-container flex-1 pl-8">
                            <AdminDataTable
                                columns={columns}
                                currentPage={activePage}
                                data={internalOrders.filter((order) => {
                                    return (
                                        order.sourceOffice.id === officeContext.office?.id
                                    );
                                })}
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
