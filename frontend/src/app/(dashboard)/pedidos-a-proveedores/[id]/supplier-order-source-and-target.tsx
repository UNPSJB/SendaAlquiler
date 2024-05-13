'use client';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import { SupplierOrderByIdQuery, SupplierOrderHistoryStatusChoices } from '@/api/graphql';

import { BaseTable } from '@/components/base-table';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    VerticalProgressTracker,
    VerticalProgressTrackerStageStatus as StageStatus,
} from '@/components/vertical-progress-tracker';

const getSourceOfficeStateStatus = (
    latestHistoryEntry: NonNullable<
        SupplierOrderByIdQuery['supplierOrderById']
    >['latestHistoryEntry'],
) => {
    if (latestHistoryEntry?.status === SupplierOrderHistoryStatusChoices.Canceled) {
        return StageStatus.Upcoming;
    }

    if (latestHistoryEntry?.status === SupplierOrderHistoryStatusChoices.Pending) {
        return StageStatus.Upcoming;
    }

    if (latestHistoryEntry?.status === SupplierOrderHistoryStatusChoices.InProgress) {
        return StageStatus.InProgress;
    }

    if (latestHistoryEntry?.status === SupplierOrderHistoryStatusChoices.Completed) {
        return StageStatus.Completed;
    }

    return StageStatus.Upcoming;
};

const getTargetOfficeStateStatus = (
    latestHistoryEntry: NonNullable<
        SupplierOrderByIdQuery['supplierOrderById']
    >['latestHistoryEntry'],
) => {
    if (latestHistoryEntry?.status === SupplierOrderHistoryStatusChoices.Pending) {
        return StageStatus.Upcoming;
    }

    if (latestHistoryEntry?.status === SupplierOrderHistoryStatusChoices.InProgress) {
        return StageStatus.Upcoming;
    }

    if (latestHistoryEntry?.status === SupplierOrderHistoryStatusChoices.Completed) {
        return StageStatus.Completed;
    }

    if (latestHistoryEntry?.status === SupplierOrderHistoryStatusChoices.Canceled) {
        return StageStatus.Upcoming;
    }

    return StageStatus.Upcoming;
};

type Props = {
    supplierOrder: NonNullable<SupplierOrderByIdQuery['supplierOrderById']>;
};

type Item = NonNullable<SupplierOrderByIdQuery['supplierOrderById']>['orderItems'][0];

const columnHelper = createColumnHelper<Item>();

const targetOfficeColumns: ColumnDef<Item, any>[] = [
    columnHelper.accessor('product.name', {
        header: 'Descripción',
        cell: (cell) => {
            const value = cell.getValue();
            return (
                <div>
                    <p className="font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground">
                        {cell.row.original.product.brand?.name || 'Sin marca'}
                    </p>
                </div>
            );
        },
        size: 225,
    }),
    columnHelper.accessor('targetOfficeQuantityBeforeReceive', {
        header: 'Stock antes de recibir',
        size: 225,
    }),
    columnHelper.accessor('quantityReceived', {
        header: 'Cantidad recibida',
        size: 225,
    }),
    columnHelper.accessor('targetOfficeQuantityAfterReceive', {
        header: () => <b>Stock después de recibir</b>,
        size: 225,
        cell: (cell) => {
            return <b>{cell.getValue()}</b>;
        },
    }),
];

export const SupplierOrderSourceAndTarget = ({ supplierOrder }: Props) => {
    const stages = [
        {
            id: 'source',
            status: getSourceOfficeStateStatus(supplierOrder.latestHistoryEntry),
            children: (
                <div>
                    <h3 className="text-sm text-muted-foreground">Origen</h3>
                    <p>{supplierOrder.supplier.name}</p>
                </div>
            ),
        },
        {
            id: 'target',
            status: getTargetOfficeStateStatus(supplierOrder.latestHistoryEntry),
            children: (
                <div>
                    <h3 className="text-sm text-muted-foreground">Destino</h3>
                    <p>{supplierOrder.targetOffice.name}</p>

                    {[SupplierOrderHistoryStatusChoices.Completed].includes(
                        supplierOrder.latestHistoryEntry!.status,
                    ) && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="mt-2 w-full"
                                    size="sm"
                                >
                                    Ver detalle de movimientos
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="w-8/12 max-w-full">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Movimientos de stock en sucursal &ldquo;
                                        {supplierOrder.targetOffice.name}
                                        &rdquo;
                                    </AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogDescription>
                                    <BaseTable
                                        columns={targetOfficeColumns}
                                        data={supplierOrder.orderItems}
                                    />
                                </AlertDialogDescription>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cerrar</AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-4 bg-white p-4">
            <h3 className="text-sm text-muted-foreground">Origen y destino</h3>

            <VerticalProgressTracker stages={stages} />
        </div>
    );
};
