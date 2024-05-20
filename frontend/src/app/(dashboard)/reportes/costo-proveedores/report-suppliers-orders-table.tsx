import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useState } from 'react';

import { CostReportQuery } from '@/api/graphql';

import { BaseTable } from '@/components/base-table';
import { ComboboxSimple } from '@/components/combobox';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { formatNumberAsPrice, formatNumberWithThousandsSeparator } from '@/lib/utils';

type TopProductItem = NonNullable<
    CostReportQuery['costReport']
>['productCostDetails'][0]['numbersBySupplier'][0];

const columnHelper = createColumnHelper<TopProductItem>();

const COLUMNS_AMOUNT: ColumnDef<TopProductItem, any>[] = [
    columnHelper.accessor('supplier.name', {
        header: 'Proveedor',
    }),
    columnHelper.accessor('avgPrice', {
        header: 'Precio promedio',
        cell: (cell) => {
            return <span>${formatNumberAsPrice(cell.getValue())}</span>;
        },
    }),
    columnHelper.accessor('numOrders', {
        header: 'Cantidad de pedidos',
        cell: (cell) => {
            return <span>{formatNumberWithThousandsSeparator(cell.getValue())}</span>;
        },
    }),
    columnHelper.accessor('totalCost', {
        header: 'Total',
        cell: (cell) => {
            return <span>${formatNumberAsPrice(cell.getValue())}</span>;
        },
    }),
];

type Props = {
    report: NonNullable<CostReportQuery['costReport']>;
};

export const ReportSuppliersOrdersTable = ({ report }: Props) => {
    const [tab, setTab] = useState<{
        label: string;
        value: string;
    } | null>(
        report.productCostDetails.length > 0
            ? {
                  label: report.productCostDetails[0].product.name,
                  value: report.productCostDetails[0].product.id,
              }
            : null,
    );

    return (
        <Tabs value={tab?.value || ''}>
            <div className="flex items-center bg-white p-1">
                <ComboboxSimple
                    onChange={(value) => setTab(value || null)}
                    options={report.productCostDetails.map((item) => ({
                        label: item.product.name,
                        value: item.product.id,
                    }))}
                    value={tab}
                />
            </div>

            {report.productCostDetails.map((detail) => (
                <TabsContent
                    className="bg-white"
                    key={detail.product.id}
                    value={detail.product.id}
                >
                    <BaseTable
                        columns={COLUMNS_AMOUNT}
                        data={detail.numbersBySupplier.sort(
                            (a, b) =>
                                b.numOrders - a.numOrders ||
                                b.totalCost - a.totalCost ||
                                a.supplier.name.localeCompare(b.supplier.name),
                        )}
                    />
                </TabsContent>
            ))}
        </Tabs>
    );
};
