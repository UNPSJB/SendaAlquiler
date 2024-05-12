'use client';

import { CellContext, ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useFormContext } from 'react-hook-form';

import { SupplierOrderByIdQuery, SupplierOrderHistoryStatusChoices } from '@/api/graphql';

import { SupplierOrderStatusEditorFormValues } from './page';

import { SupplierOrderStatusBadge } from '@/components/badges';
import { BaseTable } from '@/components/base-table';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { inputToNumber } from '@/lib/utils';

type Item = NonNullable<SupplierOrderByIdQuery['supplierOrderById']>['orderItems'][0];

type QuantityReceivedColumnProps = {
    cell: CellContext<Item, any>;
};

const QuantityReceivedColumn = ({ cell }: QuantityReceivedColumnProps) => {
    const value = cell.getValue();
    const formMethods = useFormContext<SupplierOrderStatusEditorFormValues>();
    const watchedStatus = formMethods.watch('status');
    const max = cell.row.original.quantityOrdered;

    return (
        <div>
            {watchedStatus?.value === SupplierOrderHistoryStatusChoices.Completed ? (
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
    columnHelper.accessor('quantityReceived', {
        header: 'Cantidad recibida',
        cell: (cell) => {
            return <QuantityReceivedColumn cell={cell} />;
        },
        size: 225,
    }),
];

type Props = {
    supplierOrder: NonNullable<SupplierOrderByIdQuery['supplierOrderById']>;
};

export const SupplierOrderDetails = ({ supplierOrder }: Props) => {
    return (
        <div className="space-y-4 bg-white p-4">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-bold">Pedido #{supplierOrder.id}</h2>

                    <p className="text-sm text-muted-foreground">
                        Creado el{' '}
                        {format(new Date(supplierOrder.createdOn), 'dd/MM/yyyy')}
                    </p>
                </div>

                <SupplierOrderStatusBadge
                    status={supplierOrder.latestHistoryEntry!.status!}
                />
            </div>

            <div className="space-y-2">
                <h3 className="text-sm text-muted-foreground">Productos</h3>

                <BaseTable columns={productColumns} data={supplierOrder.orderItems} />
            </div>
        </div>
    );
};
