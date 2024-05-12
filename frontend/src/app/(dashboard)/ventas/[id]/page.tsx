'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import { SaleByIdQuery } from '@/api/graphql';
import { useSaleById } from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import { formatDateTime } from '@/modules/dayjs/utils';
import ChevronRight from '@/modules/icons/ChevronRight';

import Avatar from '@/components/Avatar';
import { BaseTable } from '@/components/base-table';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import { DashboardLayoutContentLoading } from '@/components/page-loading';
import { Button } from '@/components/ui/button';
import { formatNumberAsPrice } from '@/lib/utils';

const getAvatarText = (firstName: string, lastName: string) => {
    return (firstName[0] + lastName[0]).toUpperCase();
};

const getDasboardTitle = (sale: SaleByIdQuery['saleById'] | undefined) => {
    if (!sale) {
        return <DashboardLayoutBigTitle>Ventas</DashboardLayoutBigTitle>;
    }

    return (
        <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
                <DashboardLayoutBigTitle>Ventas</DashboardLayoutBigTitle>
                <ChevronRight />
                <span className="font-headings text-sm">
                    {sale.client.firstName} {sale.client.lastName} / #{sale.id}
                </span>
            </div>

            <Button asChild>
                <Link href={`/ventas/add?duplicateId=${sale.id}`}>Duplicar venta</Link>
            </Button>
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

                                    <Button variant="link" asChild className="pl-0">
                                        <Link href={`/clientes/${sale.client.id}`}>
                                            Ver cliente
                                        </Link>
                                    </Button>
                                </div>
                            </header>

                            <div className="flex-1 bg-gray-100 py-8">
                                <section className="items-center space-y-4 bg-white px-8 py-4">
                                    <div>
                                        <h1 className="text-xl font-bold">
                                            Venta #{sale.id}
                                        </h1>
                                        <p className=" text-base">
                                            {formatDateTime(sale.createdOn)}
                                        </p>
                                    </div>

                                    <BaseTable columns={columns} data={sale.saleItems} />
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
