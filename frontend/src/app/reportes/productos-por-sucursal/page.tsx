'use client';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import { AdminReportMostSoldProductsQuery } from '@/api/graphql';
import { useReportMostSoldProducts } from '@/api/hooks/reports';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';

import { BaseTable } from '@/components/base-table';
import { PageLoading } from '@/components/page-loading';
import { formatNumberAsPrice, formatNumberWithThousandsSeparator } from '@/lib/utils';

type Item = NonNullable<
    AdminReportMostSoldProductsQuery['reportMostSoldProducts']['general']
>['items'][0];
type ItemByOffice = NonNullable<
    AdminReportMostSoldProductsQuery['reportMostSoldProducts']['byOffice'][0]
>['items'][0];

const productColumnsHelper = createColumnHelper<Item>();
const productByOfficeColumnHelper = createColumnHelper<ItemByOffice>();

type OfficeTableProps = {
    data: AdminReportMostSoldProductsQuery['reportMostSoldProducts']['byOffice'][0];
};

const OfficeTable = ({ data }: OfficeTableProps) => {
    const productByOfficeColumn: ColumnDef<ItemByOffice, any>[] = [
        productByOfficeColumnHelper.accessor('product.name', {
            header: 'Descripción',
            cell: (cell) => {
                const value = cell.getValue();
                return (
                    <div>
                        <div>
                            <p className="mb-1">{value}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            SKU: {cell.row.original.product.sku}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Marca: {cell.row.original.product.brand?.name || 'Sin marca'}
                        </p>
                    </div>
                );
            },
            size: 300,
        }),
        productColumnsHelper.accessor('quantity', {
            header: () => {
                return (
                    <div className="flex">
                        <div className="flex flex-col items-end">
                            <p className="mb-2">Cantidad de ventas</p>
                            <p className="font-bold text-black">{data.totalQuantity}</p>
                            <p className="font-bold">100% del total</p>
                        </div>
                    </div>
                );
            },
            size: 200,
        }),
        productColumnsHelper.accessor('totalAmount', {
            header: () => {
                return (
                    <div className="flex py-2">
                        <div className="flex flex-col items-end">
                            <p className="mb-2">Total de ventas</p>
                            <p className="font-bold text-black">
                                ${formatNumberAsPrice(data.totalAmount)}
                            </p>
                            <p className="font-bold">100% del total</p>
                        </div>
                    </div>
                );
            },
            cell: (cell) => {
                const value = cell.getValue();
                return <span>${formatNumberAsPrice(value)}</span>;
            },
            size: 200,
        }),
    ];

    return <BaseTable columns={productByOfficeColumn} data={data.items} />;
};

type MainTableProps = {
    data: AdminReportMostSoldProductsQuery['reportMostSoldProducts']['general'];
};

const MainTable = ({ data }: MainTableProps) => {
    const productColumns: ColumnDef<Item, any>[] = [
        productColumnsHelper.accessor('product.name', {
            header: 'Descripción',
            cell: (cell) => {
                const value = cell.getValue();
                return (
                    <div>
                        <div>
                            <p className="mb-1">{value}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            SKU: {cell.row.original.product.sku}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Marca: {cell.row.original.product.brand?.name || 'Sin marca'}
                        </p>
                    </div>
                );
            },
            minSize: 400,
        }),
        productColumnsHelper.accessor('quantity', {
            header: () => {
                return (
                    <div className="flex py-2">
                        <div className="flex flex-col items-end">
                            <p className="mb-2">Cantidad de ventas</p>
                            <p className="font-bold text-black">
                                {formatNumberWithThousandsSeparator(data.totalQuantity)}
                            </p>
                            <p className="font-bold">100% del total</p>
                        </div>
                    </div>
                );
            },
            size: 200,
        }),
        productColumnsHelper.accessor('totalAmount', {
            header: () => {
                return (
                    <div className="flex">
                        {' '}
                        <div className="flex flex-col items-end">
                            <p className="mb-2">Total de ventas</p>
                            <p className="font-bold text-black">
                                ${formatNumberAsPrice(data.totalAmount)}
                            </p>
                            <p className="font-bold">100% del total</p>
                        </div>
                    </div>
                );
            },
            cell: (cell) => {
                const value = cell.getValue();
                return <span>${formatNumberAsPrice(value)}</span>;
            },
            size: 200,
        }),
    ];

    return <BaseTable columns={productColumns} data={data.items} />;
};

const Products = () => {
    const result = useReportMostSoldProducts();
    if (result.isFetching) {
        return <PageLoading />;
    }
    if (result.error || !result.data) {
        return <p>Error</p>;
    }

    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>
                        Productos mas vendidos
                    </DashboardLayoutBigTitle>
                </div>
            }
        >
            <div className="pr-container bg-muted py-8 pl-8">
                <div className="mb-8 flex rounded-lg bg-card p-4 text-card-foreground shadow-sm">
                    <div className="rounded-xl bg-gray-100 px-2 py-1 text-xs">
                        {' '}
                        los ultimos 28 dias
                    </div>
                    <p className="mx-4">23 feb</p>
                </div>

                <div className="mb-4 flex justify-between">
                    <span className="text-xl font-bold">Vista general</span>
                </div>

                <div className="space-y-2">
                    <div className="rounded-md bg-white">
                        <MainTable data={result.data.reportMostSoldProducts.general} />
                    </div>
                </div>

                <div className="my-4 text-xl font-bold">Por sucursal</div>

                <div className="mb-4 grid grid-cols-2 gap-8">
                    {result.data.reportMostSoldProducts.byOffice.map((report) => (
                        <div className="space-y-2" key={report.office.id}>
                            <div className="flex justify-between">
                                <p className="text-sm font-bold">{report.office.name}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="rounded-md bg-white">
                                    <OfficeTable data={report} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Products;
