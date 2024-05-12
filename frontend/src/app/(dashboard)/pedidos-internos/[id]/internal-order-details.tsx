'use client';

import { useQuery } from '@tanstack/react-query';
import { CellContext, ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useFormContext } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';

import fetchClient from '@/api/fetch-client';
import {
    InternalOrderByIdQuery,
    InternalOrderHistoryStatusChoices,
    ProductStockInOfficeDocument,
} from '@/api/graphql';

import { useOfficeContext } from '@/app/OfficeProvider';

import { InternalOrderStatusEditorFormValues } from './page';

import { InternalOrderStatusBadge } from '@/components/badges';
import { BaseTable } from '@/components/base-table';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { inputToNumber } from '@/lib/utils';

type Item = NonNullable<InternalOrderByIdQuery['internalOrderById']>['orderItems'][0];

type QuantityReceivedColumnProps = {
    cell: CellContext<Item, any>;
};

const QuantityReceivedColumn = ({ cell }: QuantityReceivedColumnProps) => {
    const value = cell.getValue();
    const formMethods = useFormContext<InternalOrderStatusEditorFormValues>();
    const watchedStatus = formMethods.watch('status');
    const max = cell.row.original.quantitySent;

    return (
        <div>
            {watchedStatus?.value === InternalOrderHistoryStatusChoices.Completed ? (
                <FormField
                    name={`ordersById.${cell.row.original.id}.quantityReceived`}
                    control={formMethods.control}
                    rules={{
                        required: 'Este campo es requerido',
                        max: {
                            value: max,
                            message: `La cantidad recibida no puede ser mayor a ${max}`,
                        },
                    }}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(
                                            inputToNumber(e.target.value, {
                                                min: 0,
                                                max,
                                            }),
                                        );
                                    }}
                                    value={field.value ?? ''}
                                />
                            </FormControl>

                            <div className="flex space-x-4">
                                <FormMessage className="flex-1" />

                                <button
                                    className="ml-auto rounded-md border border-primary px-3 py-1.5 text-sm text-primary"
                                    onClick={() => field.onChange(max)}
                                >
                                    Llenar
                                </button>
                            </div>
                        </FormItem>
                    )}
                />
            ) : (
                value ?? '-'
            )}
        </div>
    );
};

const QuantitySentColumn = ({ cell }: QuantityReceivedColumnProps) => {
    const value = cell.getValue();
    const formMethods = useFormContext<InternalOrderStatusEditorFormValues>();
    const watchedStatus = formMethods.watch('status');
    const officeContext = useOfficeContext();
    const stockQuery = useQuery({
        queryKey: [
            'product-by-id',
            'stock-in-office',
            {
                officeId: officeContext.office!.id,
                productId: cell.row.original.product.id,
            },
        ],
        queryFn: () => {
            return fetchClient(ProductStockInOfficeDocument, {
                officeId: officeContext.office!.id,
                productId: cell.row.original.product.id,
            });
        },
    });
    const max = Math.min(
        stockQuery.data?.productStockInOffice?.quantity || 0,
        cell.row.original.quantityOrdered,
    );

    return (
        <div>
            {watchedStatus?.value === InternalOrderHistoryStatusChoices.InProgress ? (
                <FormField
                    name={`ordersById.${cell.row.original.id}.quantitySent`}
                    control={formMethods.control}
                    rules={{
                        required: 'Este campo es requerido',
                        max: {
                            value: max,
                            message: `La cantidad enviada no puede ser mayor a ${max}`,
                        },
                    }}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(
                                            inputToNumber(e.target.value, {
                                                min: 0,
                                                max,
                                            }),
                                        );
                                    }}
                                    value={field.value ?? ''}
                                />
                            </FormControl>

                            <FormDescription>
                                Stock disponible: {stockQuery.isPending && <Skeleton />}
                                {stockQuery.data?.productStockInOffice?.quantity ?? 0}
                            </FormDescription>

                            <div className="flex space-x-4">
                                <FormMessage className="flex-1" />

                                <button
                                    className="ml-auto rounded-md border border-primary px-3 py-1.5 text-sm text-primary"
                                    onClick={() => field.onChange(max)}
                                >
                                    Llenar
                                </button>
                            </div>
                        </FormItem>
                    )}
                />
            ) : (
                value ?? '-'
            )}
        </div>
    );
};

const columnHelper = createColumnHelper<Item>();

const productColumns: ColumnDef<Item, any>[] = [
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
    columnHelper.accessor('quantityOrdered', {
        header: 'Cantidad solicitada',
        size: 225,
    }),
    columnHelper.accessor('quantitySent', {
        header: 'Cantidad enviada',
        size: 225,
        cell: (cell) => {
            return <QuantitySentColumn cell={cell} />;
        },
    }),
    columnHelper.accessor('quantityReceived', {
        header: 'Cantidad recibida',
        cell: (cell) => {
            return <QuantityReceivedColumn cell={cell} />;
        },
        size: 225,
    }),
];

type Props = {
    internalOrder: NonNullable<InternalOrderByIdQuery['internalOrderById']>;
};

export const InternalOrderDetails = ({ internalOrder }: Props) => {
    return (
        <div className="space-y-4 bg-white p-4">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-bold">Pedido #{internalOrder.id}</h2>

                    <p className="text-sm text-muted-foreground">
                        Creado el{' '}
                        {format(new Date(internalOrder.createdOn), 'dd/MM/yyyy')}
                    </p>
                </div>

                <InternalOrderStatusBadge
                    status={internalOrder.latestHistoryEntry!.status!}
                />
            </div>

            <div className="space-y-2">
                <h3 className="text-sm text-muted-foreground">Productos</h3>

                <BaseTable columns={productColumns} data={internalOrder.orderItems} />
            </div>
        </div>
    );
};
