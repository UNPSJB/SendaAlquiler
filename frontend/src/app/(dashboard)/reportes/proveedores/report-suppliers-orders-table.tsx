import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import { ReportSupplierOrdersQuery } from '@/api/graphql';

import { BaseTable } from '@/components/base-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatNumberWithThousandsSeparator } from '@/lib/utils';

type TopProductItem = NonNullable<
    ReportSupplierOrdersQuery['supplierOrdersReport']
>['officeOrderDetails'][0]['mostOrderedProducts'][0];

const columnHelper = createColumnHelper<TopProductItem>();

const COLUMNS_AMOUNT: ColumnDef<TopProductItem, any>[] = [
    columnHelper.accessor('product.name', {
        header: 'Producto',
    }),
    columnHelper.accessor('numOrders', {
        header: 'Cantidad de pedidos',
        cell: (cell) => {
            return <span>{formatNumberWithThousandsSeparator(cell.getValue())}</span>;
        },
    }),
    columnHelper.accessor('totalQuantity', {
        header: 'Unidades ordenadas',
        cell: (cell) => {
            return <span>{formatNumberWithThousandsSeparator(cell.getValue())}</span>;
        },
    }),
];

type Props = {
    report: NonNullable<ReportSupplierOrdersQuery['supplierOrdersReport']>;
};

export const ReportSuppliersOrdersTable = ({ report }: Props) => {
    const dataByOffice = report.officeOrderDetails.reduce(
        (acc, office) => {
            acc[office.office.id] = office.mostOrderedProducts;
            return acc;
        },
        {} as Record<string, TopProductItem[]>,
    );

    return (
        <Tabs defaultValue="all">
            <div className="flex items-center bg-white p-1">
                <TabsList>
                    <TabsTrigger value="all">Global</TabsTrigger>

                    {report.officeOrderDetails.map((office) => (
                        <TabsTrigger
                            key={office.office.id}
                            value={office.office.id.toString()}
                        >
                            {office.office.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>

            <TabsContent value="all" className="bg-white">
                <BaseTable columns={COLUMNS_AMOUNT} data={report.mostOrderedProducts} />
            </TabsContent>

            {report.officeOrderDetails.map((office) => (
                <TabsContent
                    className="bg-white"
                    key={office.office.id}
                    value={office.office.id.toString()}
                >
                    <BaseTable
                        columns={COLUMNS_AMOUNT}
                        data={dataByOffice[office.office.id]}
                    />
                </TabsContent>
            ))}
        </Tabs>
    );
};
