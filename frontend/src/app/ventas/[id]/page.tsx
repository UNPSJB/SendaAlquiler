'use client';

import { useParams } from 'next/navigation';

import {
    ColumnDef,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

import { SaleByIdQuery } from '@/api/graphql';
import { useSaleById } from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import { formatDateTime } from '@/modules/dayjs/utils';
import ChevronRight from '@/modules/icons/ChevronRight';

import Avatar from '@/components/Avatar';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import { DashboardLayoutContentLoading } from '@/components/page-loading';
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

const getAvatarText = (firstName: string, lastName: string) => {
    return (firstName[0] + lastName[0]).toUpperCase();
};

const getDasboardTitle = (sale: SaleByIdQuery['saleById'] | undefined) => {
    if (!sale) {
        return <DashboardLayoutBigTitle>Ventas</DashboardLayoutBigTitle>;
    }

    return (
        <div className="flex items-center space-x-4">
            <DashboardLayoutBigTitle>Ventas</DashboardLayoutBigTitle>
            <ChevronRight />
            <span className="font-headings text-sm">
                {sale.client.firstName} {sale.client.lastName} / #{sale.id}
            </span>
        </div>
    );
};

type SaleItemDetail = NonNullable<SaleByIdQuery['saleById']>['saleItems'][0];

const columnsHelper = createColumnHelper<SaleItemDetail>();

const columns: ColumnDef<SaleItemDetail, any>[] = [
    columnsHelper.accessor('product.name', {
        id: 'product',
        header: 'Producto',
        cell: (props) => {
            return props.getValue();
        },
    }),
    columnsHelper.accessor('product.brand.name', {
        id: 'brand',
        header: 'Marca',
        cell: (props) => {
            return props.getValue();
        },
    }),
    columnsHelper.accessor('product.price', {
        id: 'price',
        header: 'Precio',
        cell: (props) => {
            return `$${formatNumberAsPrice(props.getValue() || 0)}`;
        },
    }),
    columnsHelper.accessor('quantity', {
        id: 'quantity',
        header: 'Cantidad',
        cell: (props) => {
            return props.getValue();
        },
    }),
    columnsHelper.accessor('subtotal', {
        id: 'subtotal',
        header: 'Subtotal',
        cell: (props) => {
            return `$${formatNumberAsPrice(props.getValue() || 0)}`;
        },
    }),
    columnsHelper.accessor('discount', {
        id: 'discount',
        header: 'Descuento',
        cell: (props) => {
            return `$${formatNumberAsPrice(props.getValue() || 0)}`;
        },
    }),

    columnsHelper.accessor('total', {
        id: 'total',
        header: 'Total',
        cell: (props) => {
            return `$${formatNumberAsPrice(props.getValue() || 0)}`;
        },
        footer: (props) => {
            const total = props.table
                .getFilteredRowModel()
                .rows.reduce((acc, row) => acc + row.original.total, 0);

            return `$${formatNumberAsPrice(total)}`;
        },
    }),
];

type MyTableProps = {
    data: SaleItemDetail[];
};

const MyTable = ({ data }: MyTableProps) => {
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
        <div className="rounded-md border bg-white">
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
            </Table>
        </div>
    );
};

const Page = () => {
    const { id } = useParams();
    const useSaleByIdResult = useSaleById(id as string);

    const sale = useSaleByIdResult.data?.saleById;

    return (
        <DashboardLayout header={getDasboardTitle(sale)}>
            <FetchedDataRenderer
                {...useSaleByIdResult}
                Loading={<DashboardLayoutContentLoading />}
                Error={
                    <div className="flex w-full flex-1 items-center justify-center">
                        <FetchStatusMessageWithDescription
                            title="Ha ocurrido un error"
                            line1="Hubo un error al cargar la venta."
                            line2="Prueba de nuevo más tarde."
                        />
                    </div>
                }
            >
                {({ saleById: sale }) => {
                    if (!sale) {
                        return (
                            <div className="flex w-full flex-1 items-center justify-center">
                                <FetchStatusMessageWithButton
                                    message="Parece que la venta que buscas no existe."
                                    btnHref="/ventas"
                                    btnText='Volver a "Ventas"'
                                />
                            </div>
                        );
                    }

                    return (
                        <div className="flex flex-1 flex-col">
                            <header className="flex items-center space-x-6 border-b p-8">
                                <Avatar>
                                    {getAvatarText(
                                        sale.client.firstName,
                                        sale.client.lastName,
                                    )}
                                </Avatar>

                                <div>
                                    <h1 className="text-xl font-bold">
                                        {sale.client.firstName} {sale.client.lastName}
                                    </h1>

                                    <p>
                                        {sale.client.email} | {sale.client.phoneCode}
                                        {sale.client.phoneNumber}
                                    </p>
                                </div>
                            </header>

                            <div className="flex-1 bg-gray-100 py-8">
                                <section className="items-center space-y-4 px-8">
                                    <div>
                                        <h1 className="text-xl font-bold">
                                            Venta #{sale.id}
                                        </h1>
                                        <p className=" text-base">
                                            {formatDateTime(sale.createdOn)}
                                        </p>
                                    </div>

                                    <MyTable data={sale.saleItems} />
                                </section>
                            </div>
                        </div>
                    );
                }}
            </FetchedDataRenderer>
        </DashboardLayout>
    );
};

export default Page;
