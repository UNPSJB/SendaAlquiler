import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    ColumnDef,
} from '@tanstack/react-table';

import { ContractByIdTabComponentProps } from './page';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

type Item = ContractByIdTabComponentProps['contract']['contractItems'][0];

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
    columnHelper.accessor('productSubtotal', {
        header: 'Subtotal',
        cell: (cell) => {
            const value = cell.getValue();
            return value ? `$${formatNumberAsPrice(value)}` : '-';
        },
    }),
    columnHelper.accessor('productDiscount', {
        header: 'Descuento',
        cell: (cell) => {
            const value = cell.getValue();
            return value ? `$${formatNumberAsPrice(value)}` : '-';
        },
    }),
    columnHelper.accessor('total', {
        header: 'Total',
        cell: (cell) => {
            const value = cell.row.original;
            return value
                ? `$${formatNumberAsPrice(value.productSubtotal - value.productDiscount)}`
                : '-';
        },
    }),
];

const serviceColumnsHelper = createColumnHelper<Item['serviceItems'][0]>();

const serviceColumns: ColumnDef<Item['serviceItems'][0], any>[] = [
    serviceColumnsHelper.accessor('service.name', {
        header: 'Descripción',
    }),
    serviceColumnsHelper.accessor('price', {
        header: 'Precio',
        cell: (cell) => {
            const value = cell.getValue();
            return value ? `$${formatNumberAsPrice(value)}` : '-';
        },
    }),
    serviceColumnsHelper.accessor('billingType', {
        header: 'Tipo de facturación',
        cell: (cell) => {
            const value = cell.getValue();
            return value;
        },
    }),
    serviceColumnsHelper.accessor('billingPeriod', {
        header: 'Periodo de facturación',
        cell: (cell) => {
            const value = cell.getValue();
            return value ? `${value} días` : '-';
        },
    }),
    serviceColumnsHelper.accessor('subtotal', {
        header: 'Subtotal',
        cell: (cell) => {
            const value = cell.getValue();
            return value ? `$${formatNumberAsPrice(value)}` : '-';
        },
    }),
    serviceColumnsHelper.accessor('discount', {
        header: 'Descuento',
        cell: (cell) => {
            const value = cell.getValue();
            return value ? `$${formatNumberAsPrice(value)}` : '-';
        },
        footer: (props) => {
            const value = props.table
                .getFilteredRowModel()
                .rows.reduce((acc, row) => acc + row.original.discount, 0);
            return value ? `$${formatNumberAsPrice(value)}` : '-';
        },
    }),
    serviceColumnsHelper.accessor('total', {
        header: 'Total',
        cell: (cell) => {
            const value = cell.getValue();
            return value ? `$${formatNumberAsPrice(value)}` : '-';
        },
        footer: (props) => {
            const value = props.table
                .getFilteredRowModel()
                .rows.reduce((acc, row) => acc + row.original.total, 0);
            return value ? `$${formatNumberAsPrice(value)}` : '-';
        },
    }),
];

type BaseTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
};

const BaseTable = <TData, TValue>({ columns, data }: BaseTableProps<TData, TValue>) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        defaultColumn: {
            minSize: 0,
            size: Number.MAX_SAFE_INTEGER,
            maxSize: Number.MAX_SAFE_INTEGER,
        },
    });

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead
                                        style={{
                                            width:
                                                header.getSize() ===
                                                Number.MAX_SAFE_INTEGER
                                                    ? 'auto'
                                                    : header.getSize(),
                                        }}
                                        key={header.id}
                                    >
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
                                    <TableCell
                                        style={{
                                            width:
                                                cell.column.getSize() ===
                                                Number.MAX_SAFE_INTEGER
                                                    ? 'auto'
                                                    : cell.column.getSize(),
                                        }}
                                        key={cell.id}
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
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
                                No se encontraron resultados.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>

                {table
                    .getFooterGroups()
                    .map((group) =>
                        group.headers.map((header) => header.column.columnDef.footer),
                    )
                    .flat()
                    .filter(Boolean).length > 0 && (
                    <TableFooter>
                        {table.getFooterGroups().map((footerGroup) => (
                            <TableRow key={footerGroup.id}>
                                {footerGroup.headers.map((footer) => {
                                    return (
                                        <TableCell key={footer.id}>
                                            {flexRender(
                                                footer.column.columnDef.footer,
                                                footer.getContext(),
                                            )}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableFooter>
                )}
            </Table>
        </div>
    );
};

type ProductItemTableProps = {
    item: Item;
};

const ProductItemTable: React.FC<ProductItemTableProps> = ({ item }) => {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <h2 className="text-sm font-medium">Producto</h2>
                <BaseTable columns={productColumns} data={[item]} />
            </div>

            <div className="space-y-2">
                <h2 className="text-sm font-medium">Servicios</h2>
                {item.serviceItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        Este producto no tiene servicios asociados.
                    </p>
                ) : (
                    <BaseTable columns={serviceColumns} data={item.serviceItems} />
                )}
            </div>

            <div className="space-y-2">
                <h2 className="text-sm font-medium">Total</h2>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Total productos</TableHead>
                                <TableHead>Total servicios</TableHead>
                                <TableHead>Total</TableHead>
                            </TableRow>

                            <TableRow>
                                <TableCell>
                                    $
                                    {formatNumberAsPrice(
                                        item.productSubtotal - item.productDiscount,
                                    )}
                                </TableCell>
                                <TableCell>
                                    $
                                    {formatNumberAsPrice(
                                        item.serviceItems.reduce(
                                            (acc, service) => acc + service.total,
                                            0,
                                        ),
                                    )}
                                </TableCell>
                                <TableCell>
                                    $
                                    {formatNumberAsPrice(
                                        item.productSubtotal -
                                            item.productDiscount +
                                            item.serviceItems.reduce(
                                                (acc, service) => acc + service.total,
                                                0,
                                            ),
                                    )}
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                    </Table>
                </div>
            </div>
        </div>
    );
};

const ContractsByIdProductsTab: React.FC<ContractByIdTabComponentProps> = ({
    contract,
}) => {
    return (
        <div className="pr-container pt-8">
            <h1 className="text-2xl font-bold text-gray-800">Productos del contrato</h1>
            <p className="mb-4">Días de renta: {contract.numberOfRentalDays}</p>

            <div className="space-y-4">
                <div className="rounded-md border bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Concepto</TableHead>
                                <TableHead>Subtotal</TableHead>
                                <TableHead>Descuento</TableHead>
                                <TableHead>Total</TableHead>
                            </TableRow>

                            <TableRow>
                                <TableCell>Productos</TableCell>
                                <TableCell>
                                    $
                                    {formatNumberAsPrice(
                                        contract.contractItems.reduce(
                                            (acc, item) => acc + item.productSubtotal,
                                            0,
                                        ),
                                    )}
                                </TableCell>
                                <TableCell>
                                    $
                                    {formatNumberAsPrice(
                                        contract.contractItems.reduce(
                                            (acc, item) => acc + item.productDiscount,
                                            0,
                                        ),
                                    )}
                                </TableCell>
                                <TableCell>
                                    $
                                    {formatNumberAsPrice(
                                        contract.contractItems.reduce(
                                            (acc, item) =>
                                                acc +
                                                item.productSubtotal -
                                                item.productDiscount +
                                                0,
                                            0,
                                        ),
                                    )}
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>Servicios</TableCell>
                                <TableCell>
                                    $
                                    {formatNumberAsPrice(
                                        contract.contractItems.reduce(
                                            (acc, item) =>
                                                acc +
                                                item.serviceItems.reduce(
                                                    (acc, service) =>
                                                        acc + service.subtotal,
                                                    0,
                                                ),
                                            0,
                                        ),
                                    )}
                                </TableCell>
                                <TableCell>
                                    $
                                    {formatNumberAsPrice(
                                        contract.contractItems.reduce(
                                            (acc, item) =>
                                                acc +
                                                item.serviceItems.reduce(
                                                    (acc, service) =>
                                                        acc + service.discount,
                                                    0,
                                                ),
                                            0,
                                        ),
                                    )}
                                </TableCell>
                                <TableCell>
                                    $
                                    {formatNumberAsPrice(
                                        contract.contractItems.reduce(
                                            (acc, item) =>
                                                acc +
                                                item.serviceItems.reduce(
                                                    (acc, service) => acc + service.total,
                                                    0,
                                                ),
                                            0,
                                        ),
                                    )}
                                </TableCell>
                            </TableRow>

                            <TableRow className="font-bold">
                                <TableCell>Total contrato</TableCell>
                                <TableCell>
                                    $
                                    {formatNumberAsPrice(
                                        contract.contractItems.reduce(
                                            (acc, item) =>
                                                acc +
                                                item.productSubtotal -
                                                item.productDiscount +
                                                item.serviceItems.reduce(
                                                    (acc, service) => acc + service.total,
                                                    0,
                                                ),
                                            0,
                                        ),
                                    )}
                                </TableCell>
                                <TableCell>
                                    $
                                    {formatNumberAsPrice(
                                        contract.contractItems.reduce(
                                            (acc, item) =>
                                                acc +
                                                item.productDiscount +
                                                item.serviceItems.reduce(
                                                    (acc, service) =>
                                                        acc + service.discount,
                                                    0,
                                                ),
                                            0,
                                        ),
                                    )}
                                </TableCell>
                                <TableCell>
                                    $
                                    {formatNumberAsPrice(
                                        contract.contractItems.reduce(
                                            (acc, item) =>
                                                acc +
                                                item.productSubtotal -
                                                item.productDiscount +
                                                item.serviceItems.reduce(
                                                    (acc, service) => acc + service.total,
                                                    0,
                                                ),
                                            0,
                                        ),
                                    )}
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                    </Table>
                </div>

                {contract.contractItems.map((item, index) => (
                    <Card key={item.id} className="mb-4">
                        <CardHeader>
                            <CardTitle className="text-sm">
                                Producto #{index + 1}
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <ProductItemTable item={item} />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ContractsByIdProductsTab;
