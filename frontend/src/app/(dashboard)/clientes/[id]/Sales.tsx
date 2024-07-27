import Link from 'next/link';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import { SalesByClientIdQuery } from '@/api/graphql';
import { useSalesByClientId } from '@/api/hooks';

import { formatDateTime } from '@/modules/dayjs/utils';

import { SalesByClientIdTabComponentProps } from './page';

import { BaseTable } from '@/components/base-table';
import DeprecatedButton from '@/components/Button';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import { DashboardLayoutContentLoading } from '@/components/page-loading';
import { formatNumberAsPrice } from '@/lib/utils';

type SaleDetail = NonNullable<SalesByClientIdQuery['salesByClientId']>[0];
type SaleItemDetail = SaleDetail['saleItems'][0];

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
    columnsHelper.accessor('productPrice', {
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

const ClientByIdSalesTab: React.FC<SalesByClientIdTabComponentProps> = ({ id }) => {
    const useSalesByClientIdResult = useSalesByClientId(id);

    return (
        <FetchedDataRenderer
            {...useSalesByClientIdResult}
            Loading={<DashboardLayoutContentLoading />}
            Error={
                <FetchStatusMessageWithDescription
                    title="Error al obtener las compras"
                    line1="Hubo un error al obtener las compras del cliente."
                />
            }
        >
            {({ salesByClientId }) => (
                <div className="pr-container pb-8">
                    <div className="flex items-center justify-between">
                        <h1 className="pt-4 text-xl font-bold">
                            Compras{' '}
                            <span className="text-base font-extralight">
                                ({salesByClientId.length})
                            </span>
                        </h1>
                        <DeprecatedButton
                            href={`/ventas/add?client=${id}`}
                            className="mr-4 mt-8"
                        >
                            + Añadir Compra
                        </DeprecatedButton>
                    </div>

                    <ul className="space-y-8">
                        {salesByClientId.map((sale) => (
                            <div key={sale.id}>
                                <div className="flex">
                                    <h2 className="relative mb-[-1px] rounded-t-xl border-x border-t border-gray-300 bg-white px-4 pb-1 pt-4 font-bold">
                                        {formatDateTime(sale.createdOn)}
                                    </h2>
                                </div>

                                <div className="border border-gray-300 bg-white">
                                    <BaseTable columns={columns} data={sale.saleItems} />

                                    <div className="flex justify-end">
                                        <Link
                                            href={`/ventas/${sale.id}`}
                                            passHref
                                            className=" px-8 py-4  font-bold text-muted-foreground duration-300 ease-in-out hover:bg-gray-200 hover:text-gray-700"
                                        >
                                            Ver mas detalles
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </ul>
                </div>
            )}
        </FetchedDataRenderer>
    );
};

export default ClientByIdSalesTab;
