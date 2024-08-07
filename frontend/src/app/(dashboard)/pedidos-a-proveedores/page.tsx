'use client';

import Link from 'next/link';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { SupplierOrderHistoryStatusChoices, SupplierOrdersQuery } from '@/api/graphql';
import {
    useDeleteSupplierOrder,
    useExportSupplierOrdersCsv,
    usePaginatedSupplierOrders,
} from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';

import { AdminDataTable } from '@/components/admin-data-table';
import { AdminDataTableLoading } from '@/components/admin-data-table-skeleton';
import { AdminTableFilter } from '@/components/admin-table-filter';
import { SupplierOrderStatusBadge } from '@/components/badges';
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

type OrderSupplier = SupplierOrdersQuery['supplierOrders']['results'][0];

const columnsHelper = createColumnHelper<OrderSupplier>();

const columns: ColumnDef<OrderSupplier, any>[] = [
    columnsHelper.accessor('createdOn', {
        id: 'date',
        header: 'Fecha creado',
        cell: (props) => {
            const supplierOrder = props.row.original;

            return (
                <Link
                    className="text-violet-600"
                    href={`/pedidos-a-proveedores/${supplierOrder.id}`}
                >
                    {new Date(supplierOrder.createdOn).toLocaleDateString('es-ES')}
                </Link>
            );
        },
    }),
    columnsHelper.accessor('supplier.name', {
        id: 'supplier',
        header: 'Proveedor',
    }),
    columnsHelper.accessor('targetOffice.name', {
        id: 'office',
        header: 'Sucursal',
    }),
    columnsHelper.accessor('latestHistoryEntry.status', {
        id: 'status',
        header: 'Estado',
        cell: (props) => {
            const order = props.row.original;

            if (!order.latestHistoryEntry) {
                return '-';
            }

            return <SupplierOrderStatusBadge status={order.latestHistoryEntry.status} />;
        },
    }),
    columnsHelper.display({
        id: 'actions',
        cell: (props) => {
            const supplierOrder = props.row.original;

            return (
                <div className="flex justify-end">
                    <RowActions supplierOrder={supplierOrder} />
                </div>
            );
        },
    }),
];

const RowActions = ({ supplierOrder }: { supplierOrder: OrderSupplier }) => {
    const deleteMutation = useDeleteSupplierOrder();

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
                        ¿Estás seguro de que quieres eliminar el pedido a proveedor
                        &ldquo;
                        <strong>
                            <em>
                                {new Date(supplierOrder.createdOn).toLocaleDateString(
                                    'es-ES',
                                )}
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
                            deleteMutation.mutate(supplierOrder.id, {
                                onSuccess: () => {
                                    toast.success(
                                        `Pedido a proveedor #${supplierOrder.id} para "${supplierOrder.supplier.name}" eliminado correctamente`,
                                    );
                                    setOpen(false);
                                },
                                onError: () => {
                                    toast.error(
                                        `Ha ocurrido un error al eliminar el pedido a proveedor #${supplierOrder.id}`,
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
        usePaginatedSupplierOrders();

    const { exportCsv } = useExportSupplierOrdersCsv();

    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>
                        Pedidos a Proveedores
                    </DashboardLayoutBigTitle>

                    <div className="flex space-x-8">
                        <DeprecatedButton
                            variant={ButtonVariant.GRAY}
                            onClick={() => {
                                exportCsv({});
                            }}
                        >
                            Exportar a CSV
                        </DeprecatedButton>

                        <DeprecatedButton href="/pedidos-a-proveedores/add">
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
                            value: SupplierOrderHistoryStatusChoices.Pending,
                        },
                        {
                            label: 'En progreso',
                            value: SupplierOrderHistoryStatusChoices.InProgress,
                        },
                        {
                            label: 'Completado',
                            value: SupplierOrderHistoryStatusChoices.Completed,
                        },
                        {
                            label: 'Cancelado',
                            value: SupplierOrderHistoryStatusChoices.Canceled,
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
                            line1="Hubo un error al cargar los pedidos a proveedores."
                            line2="Prueba de nuevo más tarde."
                        />
                    </div>
                }
            >
                {({ supplierOrders: { results: supplierOrders } }) => {
                    if (supplierOrders.length === 0) {
                        return (
                            <FetchStatusMessageWithButton
                                message="Aún no hay pedidos a proveedores"
                                btnHref="/pedidos-a-proveedores/add"
                                btnText="Agrega tu primer pedidos a proveedor"
                            />
                        );
                    }

                    return (
                        <div className="pr-container flex-1 pl-8">
                            <AdminDataTable
                                columns={columns}
                                currentPage={activePage}
                                data={supplierOrders}
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
