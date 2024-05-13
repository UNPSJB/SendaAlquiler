import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import { ReportSalesQuery } from '@/api/graphql';

import { BaseTable } from '@/components/base-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatNumberAsPrice } from '@/lib/utils';

type TopProductItem = NonNullable<
    ReportSalesQuery['salesReport']
>['topProductsByAmount'][0];

const columnHelper = createColumnHelper<TopProductItem>();

const COLUMNS_AMOUNT: ColumnDef<TopProductItem, any>[] = [
    columnHelper.accessor('productName', {
        header: 'Producto',
        size: 2000,
    }),
    columnHelper.accessor('totalSoldAmount', {
        header: 'Monto vendido',
        cell: (cell) => {
            return <span>${formatNumberAsPrice(cell.getValue())}</span>;
        },
        size: 2000,
    }),
];

type Props = {
    report: NonNullable<ReportSalesQuery['salesReport']>;
};

export const ReportSalesTableAmount = ({ report }: Props) => {
    const globalData = report.topProductsByAmount;
    const dataByOffice = report.officeData.reduce(
        (acc, office) => {
            acc[office.officeId] = office.topProductsByAmount;
            return acc;
        },
        {} as Record<string, TopProductItem[]>,
    );

    return (
        <Tabs defaultValue="all">
            <div className="flex items-center bg-white p-1">
                <TabsList>
                    <TabsTrigger value="all">Global</TabsTrigger>

                    {report.officeData.map((office) => (
                        <TabsTrigger
                            key={office.officeId}
                            value={office.officeId.toString()}
                        >
                            {office.officeName}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>

            <TabsContent value="all" className="bg-white">
                <BaseTable columns={COLUMNS_AMOUNT} data={globalData} />
            </TabsContent>

            {report.officeData.map((office) => (
                <TabsContent
                    className="bg-white"
                    key={office.officeId}
                    value={office.officeId.toString()}
                >
                    <BaseTable
                        columns={COLUMNS_AMOUNT}
                        data={dataByOffice[office.officeId]}
                    />
                </TabsContent>
            ))}
        </Tabs>
    );
};
