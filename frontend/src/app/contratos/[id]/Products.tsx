import {
    RowData,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    CellContext as TanCellContext,
    HeaderContext,
} from '@tanstack/react-table';

import { ContractByIdTabComponentProps } from './page';

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatNumberAsPrice } from '@/lib/utils';

type CellContext<TData extends RowData, TValue> = TanCellContext<TData, TValue> & {
    numberOfRentalDays: number;
    numberOfContractItems: number;
};

type Item = ContractByIdTabComponentProps['contract']['contractItems'][0];

const columnHelper = createColumnHelper<Item>();

const columns = [
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
    }),
    columnHelper.accessor('quantity', {
        header: 'Cantidad',
    }),
    columnHelper.accessor('productPrice', {
        header: 'Precio u. x día',
        cell: (cell) => {
            const value = cell.getValue();
            return value ? `$${formatNumberAsPrice(value)}` : '-';
        },
    }),
    columnHelper.accessor('service.name', {
        header: 'Servicio',
        cell: (cell) => {
            const value = cell.getValue();
            return value ?? '-';
        },
    }),
    columnHelper.accessor('servicePrice', {
        header: 'Precio Servicio x día',
        cell: (cell) => {
            const value = cell.getValue();
            return value ? `$${formatNumberAsPrice(value)}` : '-';
        },
    }),
    columnHelper.accessor('productSubtotal', {
        id: 'subtotalPerDay',
        header: 'Subtotal x día',
        cell: (cell) => {
            const subtotal = cell.getValue();
            const { numberOfRentalDays } = cell as CellContext<Item, number>;

            if (!subtotal || !numberOfRentalDays) {
                return '-';
            }

            const subtotalPerDay = subtotal / numberOfRentalDays;

            return `$${formatNumberAsPrice(subtotalPerDay)}`;
        },
        footer: (info) => {
            const total = info.table.getFilteredRowModel().rows.reduce((acc, row) => {
                const subtotal =
                    row.original.productSubtotal +
                    row.original.serviceSubtotal +
                    row.original.shippingSubtotal;

                const { numberOfRentalDays } = info as HeaderContext<Item, unknown> & {
                    numberOfRentalDays: number;
                };

                if (!subtotal || !numberOfRentalDays) {
                    return acc;
                }

                return acc + subtotal / numberOfRentalDays;
            }, 0);

            return `$${formatNumberAsPrice(total)}`;
        },
    }),
    columnHelper.accessor('total', {
        id: 'totalPerDay',
        header: 'Total x día',
        cell: (cell) => {
            const total = cell.getValue();
            const { numberOfRentalDays } = cell as CellContext<Item, number>;

            if (!total || !numberOfRentalDays) {
                return '-';
            }

            const totalPerDay = total / numberOfRentalDays;

            return `$${formatNumberAsPrice(totalPerDay)}`;
        },
        footer: (info) => {
            const total = info.table.getFilteredRowModel().rows.reduce((acc, row) => {
                const total = row.original.total;
                const { numberOfRentalDays } = info as HeaderContext<Item, unknown> & {
                    numberOfRentalDays: number;
                };

                if (!total || !numberOfRentalDays) {
                    return acc;
                }

                return acc + total / numberOfRentalDays;
            }, 0);

            return `$${formatNumberAsPrice(total)}`;
        },
    }),
    // columnHelper.accessor('subtotal', {
    //     header: 'Subtotal',
    //     cell: (cell) => {
    //         const value = cell.getValue();
    //         return value ? `$${formatNumberAsPrice(value)}` : '-';
    //     },
    //     footer: (info) => {
    //         const total = info.table.getFilteredRowModel().rows.reduce((acc, row) => {
    //             const value = row.original.subtotal;
    //             return value ? acc + value : acc;
    //         }, 0);

    //         return `$${formatNumberAsPrice(total)}`;
    //     },
    // }),
    // columnHelper.accessor('discount', {
    //     header: 'Descuento',
    //     cell: (cell) => {
    //         const value = cell.getValue();
    //         return value ? `$${formatNumberAsPrice(value)}` : '-';
    //     },
    //     footer: (info) => {
    //         const total = info.table.getFilteredRowModel().rows.reduce((acc, row) => {
    //             const value = row.original.discount;
    //             return value ? acc + value : acc;
    //         }, 0);

    //         return `$${formatNumberAsPrice(total)}`;
    //     },
    // }),
    columnHelper.accessor('total', {
        header: 'Total',
        cell: (cell) => {
            const value = cell.getValue();
            return value ? `$${formatNumberAsPrice(value)}` : '-';
        },
        footer: (info) => {
            const total = info.table.getFilteredRowModel().rows.reduce((acc, row) => {
                const value = row.original.total;
                return value ? acc + value : acc;
            }, 0);

            return `$${formatNumberAsPrice(total)}`;
        },
    }),
];

const ContractsByIdProductsTab: React.FC<ContractByIdTabComponentProps> = ({
    contract,
}) => {
    const table = useReactTable({
        data: contract.contractItems,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="pr-container pt-8">
            <h1 className="text-2xl font-bold text-gray-800">Productos del contrato</h1>

            <p className="mb-4">Días de renta: {contract.numberOfRentalDays}</p>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, {
                                                ...cell.getContext(),
                                                numberOfRentalDays:
                                                    contract.numberOfRentalDays,
                                                numberOfContractItems:
                                                    contract.contractItems.length,
                                            })}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        {table.getFooterGroups().map((footerGroup) => {
                            return (
                                <TableRow key={footerGroup.id}>
                                    {footerGroup.headers.map((footer) => {
                                        return (
                                            <TableHead key={footer.id}>
                                                {footer.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          footer.column.columnDef.footer,
                                                          {
                                                              ...footer.getContext(),
                                                              numberOfRentalDays:
                                                                  contract.numberOfRentalDays,
                                                          },
                                                      )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableFooter>
                </Table>
            </div>
        </div>
    );
};

export default ContractsByIdProductsTab;
