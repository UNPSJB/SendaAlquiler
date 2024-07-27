import Link from 'next/link';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { PropsWithChildren } from 'react';

import { ContractsByClientIdQuery } from '@/api/graphql';
import { useContractsByClientId } from '@/api/hooks';

import { formatDateTimeHr } from '@/modules/dayjs/utils';
import { formatDateTime } from '@/modules/dayjs/utils';

import { ContractsByClientIdTabComponentProps } from './page';

import { ContractStatusBadge } from '@/components/badges';
import { BaseTable } from '@/components/base-table';
import DeprecatedButton from '@/components/Button';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import { DashboardLayoutContentLoading } from '@/components/page-loading';
import { formatNumberAsPrice } from '@/lib/utils';

const LI: React.FC<PropsWithChildren> = ({ children }) => {
    return <li className="my-2">{children}</li>;
};

const SN: React.FC<PropsWithChildren> = ({ children }) => {
    return <span className="font-medium text-black">{children}</span>;
};

type Item = NonNullable<
    ContractsByClientIdQuery['contractsByClientId']
>[0]['contractItems'][0];

const productColumnsHelper = createColumnHelper<Item>();

const productColumns: ColumnDef<Item, any>[] = [
    productColumnsHelper.accessor('product.name', {
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
        size: 225,
    }),
    productColumnsHelper.accessor('quantity', {
        header: 'Cantidad',
    }),
    productColumnsHelper.accessor('productPrice', {
        header: 'Precio u. x día',
        cell: (cell) => {
            const value = cell.getValue();
            return `$${formatNumberAsPrice(value)}`;
        },
    }),
    productColumnsHelper.accessor('productSubtotal', {
        header: 'Subtotal',
        cell: (cell) => {
            const value = cell.getValue();
            return `$${formatNumberAsPrice(value)}`;
        },
        footer: (props) => {
            const value = props.table
                .getFilteredRowModel()
                .rows.reduce((acc, row) => acc + row.original.productSubtotal, 0);
            return `$${formatNumberAsPrice(value)}`;
        },
    }),
    productColumnsHelper.accessor('productDiscount', {
        header: 'Descuento',
        cell: (cell) => {
            const value = cell.getValue();
            return `$${formatNumberAsPrice(value)}`;
        },
        footer: (props) => {
            const value = props.table
                .getFilteredRowModel()
                .rows.reduce((acc, row) => acc + row.original.productDiscount, 0);
            return `$${formatNumberAsPrice(value)}`;
        },
    }),
    productColumnsHelper.accessor('total', {
        header: 'Total',
        cell: (cell) => {
            const value = cell.row.original;
            return `$${formatNumberAsPrice(value.productSubtotal - value.productDiscount)}`;
        },
        footer: (props) => {
            const value = props.table
                .getFilteredRowModel()
                .rows.reduce((acc, row) => acc + row.original.total, 0);
            return `$${formatNumberAsPrice(value)}`;
        },
    }),
];

type ServiceRowType = Item['serviceItems'][0] & {
    product: Item['product'];
};
const serviceColumnsHelper = createColumnHelper<ServiceRowType>();

const serviceColumns: ColumnDef<ServiceRowType, any>[] = [
    serviceColumnsHelper.accessor('service.name', {
        header: 'Descripción',
        cell: (cell) => {
            const value = cell.getValue();
            return (
                <div>
                    <p className="font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground">
                        {cell.row.original.product.name} -{' '}
                        {cell.row.original.product.brand?.name || 'Sin marca'}
                    </p>
                </div>
            );
        },
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

const ClientByIdContractsTab: React.FC<ContractsByClientIdTabComponentProps> = ({
    id,
}) => {
    const useContractsByClientIdResult = useContractsByClientId(id);

    return (
        <FetchedDataRenderer
            {...useContractsByClientIdResult}
            Loading={<DashboardLayoutContentLoading />}
            Error={
                <FetchStatusMessageWithDescription
                    title="Error al obtener los contratos"
                    line1="Hubo un error al obtener los contratos del cliente."
                />
            }
        >
            {({ contractsByClientId }) => (
                <>
                    <div className="flex items-center justify-between">
                        <h1 className="pt-4 text-xl font-bold">
                            Contratos{' '}
                            <span className="text-base font-extralight">
                                ({contractsByClientId.length})
                            </span>
                        </h1>
                        <DeprecatedButton
                            href={`/contratos/add?client=${id}`}
                            className="mr-4 mt-8"
                        >
                            + Añadir Contrato
                        </DeprecatedButton>
                    </div>

                    <ul className="mt-8 space-y-8">
                        {contractsByClientId.map((contract) => (
                            <div
                                className="mb-4 mr-4 mt-8 rounded-md border bg-white "
                                key={contract.id}
                            >
                                <div className="flex justify-between border-b px-4 py-3">
                                    <h2 className="mt-2">
                                        {formatDateTimeHr(contract.contractStartDatetime)}{' '}
                                        - {formatDateTimeHr(contract.contractEndDatetime)}
                                    </h2>

                                    <ContractStatusBadge
                                        status={contract.latestHistoryEntry!.status}
                                    />
                                </div>

                                <div className="h-full border-b px-4 py-2 text-gray-400">
                                    <LI>
                                        <SN>Contrato creado el:</SN>{' '}
                                        {formatDateTime(contract.createdOn)}
                                    </LI>
                                    <LI>
                                        <SN>Fecha Vencimiento:</SN>{' '}
                                        {formatDateTime(contract.expirationDate)}{' '}
                                    </LI>
                                    <LI>
                                        <SN>Locación:</SN> {contract.streetName}{' '}
                                        {contract.houseNumber}, {contract.locality.name},{' '}
                                        {contract.locality.state}
                                    </LI>
                                </div>

                                <div className="space-y-4 p-4">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-bold">Productos</h3>

                                        <BaseTable
                                            columns={productColumns}
                                            data={contract.contractItems}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-sm font-bold">Servicios</h3>

                                        <BaseTable
                                            columns={serviceColumns}
                                            data={contract.contractItems.flatMap(
                                                (item) => {
                                                    return item.serviceItems.map(
                                                        (serviceItem) => ({
                                                            ...serviceItem,
                                                            product: item.product,
                                                        }),
                                                    );
                                                },
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="mr-2 flex justify-between border-b p-2">
                                    <p className="ml-2 font-bold">Total</p>
                                    <b className="text-xl font-normal">
                                        ${formatNumberAsPrice(contract.total)}
                                    </b>
                                </div>
                                <div className="flex justify-end">
                                    <Link
                                        href={`/contratos/${contract.id}`}
                                        className="border-x px-8 py-4  text-gray-400 duration-300 ease-in-out hover:bg-gray-200 hover:text-gray-700"
                                    >
                                        Ver mas detalles
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </ul>
                </>
            )}
        </FetchedDataRenderer>
    );
};

export default ClientByIdContractsTab;
