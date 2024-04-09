'use client';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import { ReportMostSoldProductsQuery } from '@/api/graphql';
import { useReportMostSoldProducts } from '@/api/hooks/reports';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';

import { BaseTable } from '@/components/base-table';
import { PageLoading } from '@/components/page-loading';
import {
    Table,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatNumberAsPrice } from '@/lib/utils';

type Item = NonNullable<ReportMostSoldProductsQuery['general']>['items'][0];
type ItemByOffice = NonNullable<ReportMostSoldProductsQuery['byOffice'][0]>['items'][0];

const productColumnsHelper = createColumnHelper<Item>();
const productByOfficeColumnHelper = createColumnHelper<ItemByOffice>();

const productColumns: ColumnDef<Item, any>[] = [
    productColumnsHelper.accessor('product.name', {
        header: 'Descripción',
        cell: (cell) => {
            const value = cell.getValue();
            return (
                <div>
                    <div>
                        <p className="font-medium">{value}</p>
                    </div>
                    <p className="text-muted-foreground">
                        SKU: {cell.row.original.product.sku}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Marca: {cell.row.original.product.brand?.name || 'Sin marca'}
                    </p>
                </div>
            );
        },
        size: 225,
    }),
    productColumnsHelper.accessor('quantity', {
        header: () => {
            return (
                <div className="flex">
                    {' '}
                    <div className="flex flex-col items-end">
                        <p>Cantidad de ventas</p>
                        <p className="font-bold text-black">94.403</p>
                        <p className="font-bold">100% del total</p>
                    </div>
                </div>
            );
        },
    }),
    productColumnsHelper.accessor('totalAmount', {
        header: () => {
            return (
                <div className="flex">
                    {' '}
                    <div className="flex flex-col items-end">
                        <p>Total de ventas</p>
                        <p className="font-bold text-black">70.000.000</p>
                        <p className="font-bold">100% del total</p>
                    </div>
                </div>
            );
        },
    }),
];

const productByOfficeColumn: ColumnDef<ItemByOffice, any>[] = [
    productByOfficeColumnHelper.accessor('product.name', {
        header: 'Descripción',
        cell: (cell) => {
            const value = cell.getValue();
            return (
                <div>
                    <div>
                        <p className="font-medium">{value}</p>
                    </div>
                    <p className="text-muted-foreground">
                        SKU: {cell.row.original.product.sku}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Marca: {cell.row.original.product.brand?.name || 'Sin marca'}
                    </p>
                </div>
            );
        },
        size: 225,
    }),
    productColumnsHelper.accessor('quantity', {
        header: () => {
            return (
                <div className="flex">
                    {' '}
                    <div className="flex flex-col items-end">
                        <p>Cantidad de ventas</p>
                        <p className="font-bold text-black">94.403</p>
                        <p className="font-bold">100% del total</p>
                    </div>
                </div>
            );
        },
    }),
];

const Products = () => {
    // const [selectedOffice, setSelectedOfficeId] = useState<string | null>(null);
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
            <div className="container bg-muted py-8">
                <div className="flex rounded-lg bg-card p-4 text-card-foreground shadow-sm">
                    <div className="rounded-xl bg-gray-100 px-2 py-1 text-xs">
                        {' '}
                        los ultimos 28 dias
                    </div>
                    <p className="mx-4">23 feb</p>
                </div>
                <div className="my-4 text-xl font-bold">Vista Global</div>

                <div className="space-y-2">
                    <div className="rounded-md  bg-white">
                        <BaseTable
                            columns={productColumns}
                            data={result.data.reportMostSoldProducts.general.items}
                        />
                    </div>
                </div>

                <div className="my-4 text-xl font-bold">Por sucursal</div>

                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div className="space-y-2  p-2">
                        <div className="flex justify-between">
                            <p className="text-sm font-bold">
                                {
                                    result.data.reportMostSoldProducts.byOffice[0].office
                                        .name
                                }
                            </p>
                            {/* <button onClick={() => setSelectedOfficeId(<>)} className="text-sm text-blue-700">
                                {' '}
                                Ver mas detalles
                            </button> */}
                            <p className="text-sm text-blue-700">Ver mas detalles</p>
                        </div>
                        <div className="space-y-2">
                            <div className="rounded-md  bg-white">
                                <BaseTable
                                    columns={productByOfficeColumn}
                                    data={
                                        result.data.reportMostSoldProducts.byOffice[0]
                                            .items
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Products;
