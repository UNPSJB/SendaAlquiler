import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useState } from 'react';

import { InternalOrderReportQuery } from '@/api/graphql';

import { BaseTable } from '@/components/base-table';
import { ComboboxSimple } from '@/components/combobox';
import { Tabs, TabsContent } from '@/components/ui/tabs';

type TopProductItem = NonNullable<
    InternalOrderReportQuery['internalOrderReport']
>['topProductsOrderedByOffice'][0]['topProducts'][0];

const columnHelper = createColumnHelper<TopProductItem>();

const COLUMNS_AMOUNT: ColumnDef<TopProductItem, any>[] = [
    columnHelper.accessor('productName', {
        header: 'Proveedor',
    }),
    columnHelper.accessor('totalQuantity', {
        header: 'N° Pedidos',
    }),
];

type Props = {
    report: NonNullable<InternalOrderReportQuery['internalOrderReport']>;
};

export const ReportSuppliersOrdersTable = ({ report }: Props) => {
    const [tab, setTab] = useState<{
        label: string;
        value: string;
    } | null>(
        report.topProductsOrderedByOffice.length > 0
            ? {
                  label: report.topProductsOrderedByOffice[0].officeName,
                  value: report.topProductsOrderedByOffice[0].officeId,
              }
            : null,
    );

    return (
        <Tabs value={tab?.value || ''}>
            <div className="flex items-center bg-white p-1">
                <ComboboxSimple
                    onChange={(value) => setTab(value || null)}
                    options={report.topProductsOrderedByOffice.map((item) => ({
                        label: item.officeName,
                        value: item.officeId,
                    }))}
                    value={tab}
                />
            </div>

            {report.topProductsOrderedByOffice.map((detail) => (
                <TabsContent
                    className="bg-white"
                    key={detail.officeId}
                    value={detail.officeId}
                >
                    <BaseTable
                        columns={COLUMNS_AMOUNT}
                        data={detail.topProducts.sort((a, b) => {
                            return (
                                b.totalQuantity - a.totalQuantity ||
                                a.productName.localeCompare(b.productName)
                            );
                        })}
                    />
                </TabsContent>
            ))}
        </Tabs>
    );
};
