'use client';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import { InternalOrderByIdQuery, InternalOrderHistoryStatusChoices } from '@/api/graphql';

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
        InternalOrderByIdQuery['internalOrderById']
    >['latestHistoryEntry'],
) => {
    if (latestHistoryEntry?.status === InternalOrderHistoryStatusChoices.Canceled) {
        return StageStatus.Upcoming;
    }

    if (latestHistoryEntry?.status === InternalOrderHistoryStatusChoices.Pending) {
        return StageStatus.Upcoming;
    }

    if (latestHistoryEntry?.status === InternalOrderHistoryStatusChoices.InProgress) {
        return StageStatus.InProgress;
    }

    if (latestHistoryEntry?.status === InternalOrderHistoryStatusChoices.Completed) {
        return StageStatus.Completed;
    }

    return StageStatus.Upcoming;
};

const getTargetOfficeStateStatus = (
    latestHistoryEntry: NonNullable<
        InternalOrderByIdQuery['internalOrderById']
    >['latestHistoryEntry'],
) => {
    if (latestHistoryEntry?.status === InternalOrderHistoryStatusChoices.Pending) {
        return StageStatus.Upcoming;
    }

    if (latestHistoryEntry?.status === InternalOrderHistoryStatusChoices.InProgress) {
        return StageStatus.Upcoming;
    }

    if (latestHistoryEntry?.status === InternalOrderHistoryStatusChoices.Completed) {
        return StageStatus.Completed;
    }

    if (latestHistoryEntry?.status === InternalOrderHistoryStatusChoices.Canceled) {
        return StageStatus.Upcoming;
    }

    return StageStatus.Upcoming;
};

type Props = {
    internalOrder: NonNullable<InternalOrderByIdQuery['internalOrderById']>;
};

type Item = NonNullable<InternalOrderByIdQuery['internalOrderById']>['orderItems'][0];

const columnHelper = createColumnHelper<Item>();

const sourceStockDetailsColumns: ColumnDef<Item, any>[] = [
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
    columnHelper.accessor('sourceOfficeQuantityBeforeSend', {
        header: 'Stock antes de enviar',
        size: 225,
    }),
    columnHelper.accessor('quantitySent', {
        header: 'Cantidad enviada',
        size: 225,
    }),
    columnHelper.accessor('sourceOfficeQuantityAfterSend', {
        header: () => <b>Stock después de enviar</b>,
        size: 225,
        cell: (cell) => {
            return <b>{cell.getValue()}</b>;
        },
    }),
];

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

export const InternalOrderSourceAndTarget = ({ internalOrder }: Props) => {
    const stages = [
        {
            id: 'source',
            status: getSourceOfficeStateStatus(internalOrder.latestHistoryEntry),
            children: (
                <div>
                    <h3 className="text-sm text-muted-foreground">Origen</h3>
                    <p>{internalOrder.sourceOffice.name}</p>

                    {[
                        InternalOrderHistoryStatusChoices.InProgress,
                        InternalOrderHistoryStatusChoices.Completed,
                    ].includes(internalOrder.latestHistoryEntry!.status) && (
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
                                        {internalOrder.sourceOffice.name}
                                        &rdquo;
                                    </AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogDescription>
                                    <BaseTable
                                        columns={sourceStockDetailsColumns}
                                        data={internalOrder.orderItems}
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
        {
            id: 'target',
            status: getTargetOfficeStateStatus(internalOrder.latestHistoryEntry),
            children: (
                <div>
                    <h3 className="text-sm text-muted-foreground">Destino</h3>
                    <p>{internalOrder.targetOffice.name}</p>

                    {[InternalOrderHistoryStatusChoices.Completed].includes(
                        internalOrder.latestHistoryEntry!.status,
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
                                        {internalOrder.targetOffice.name}
                                        &rdquo;
                                    </AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogDescription>
                                    <BaseTable
                                        columns={targetOfficeColumns}
                                        data={internalOrder.orderItems}
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
