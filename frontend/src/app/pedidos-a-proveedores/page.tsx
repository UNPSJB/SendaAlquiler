'use client';

import Link from 'next/link';

import Skeleton from 'react-loading-skeleton';

import { OrderSupplier, SupplierOrdersQuery } from '@/api/graphql';
import { useSupplierOrders } from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import DataTable from '@/modules/data-table/DataTable';
import DataTableDropdown from '@/modules/data-table/DataTableDropdown';
import DataTablePagination from '@/modules/data-table/DataTablePagination';

import Button from '@/components/Button';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import { TD, TR } from '@/components/Table';

const columns = [
    { key: 'date', label: 'Fecha creado' },
    { key: 'supplier', label: 'Proveedor' },
    { key: 'office', label: 'Sucursal' },
    { key: 'status', label: 'Estado' },
    { key: 'dropdown', label: '' },
];

const SkeletonRowRenderer = (key: number) => (
    <TR key={key}>
        {[...new Array(columns.length)].map((_, index) => (
            <TD key={index}>
                <Skeleton width={100}></Skeleton>
            </TD>
        ))}
    </TR>
);

const SupplierOrderRowRenderer = (handleRemove: (id: OrderSupplier['id']) => void) => {
    const renderer = (
        supplierOrder: ArrayElement<SupplierOrdersQuery['supplierOrders']['results']>,
    ) => (
        <TR key={supplierOrder.id}>
            <TD>
                <Link
                    className="text-violet-600"
                    href={`/pedidos-a-proveedores/${supplierOrder.id}`}
                >
                    {new Date(supplierOrder.createdOn).toLocaleDateString('es-ES')}
                </Link>
            </TD>
            <TD>{supplierOrder.supplier.name}</TD>
            <TD>{supplierOrder.officeDestination.name}</TD>
            <TD>{supplierOrder.currentHistory?.status}</TD>
            <TD>
                <DataTableDropdown onRemove={() => handleRemove(supplierOrder.id)} />
            </TD>
        </TR>
    );

    return renderer;
};

const Page = () => {
    const { hasPreviousPage, hasNextPage, activePage, noPages, queryResult } =
        useSupplierOrders();

    const handleRemove = (id: OrderSupplier['id']) => {
        console.log(`remove ${id}`);
    };

    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>
                        Pedidos a Proveedores
                    </DashboardLayoutBigTitle>

                    <Button href="/pedidos-a-proveedores/add">+ Añadir pedido</Button>
                </div>
            }
        >
            <FetchedDataRenderer
                {...queryResult}
                Loading={
                    <div className="pr-container flex-1 py-5 pl-10">
                        <DataTable
                            columns={columns}
                            data={[...new Array(5)].map((_, index) => index)}
                            rowRenderer={SkeletonRowRenderer}
                        />
                    </div>
                }
                Error={
                    <div className="flex w-full flex-1 items-center justify-center">
                        <FetchStatusMessageWithDescription
                            title="Ha ocurrido un error"
                            line1="Hubo un error al cargar los pedidos a proveedores."
                            line2="Prueba de nuevo más tarde."
                        />
                    </div>
                }
            >
                {({ supplierOrders: { results: supplierOrders } }) => {
                    if (supplierOrders.length === 0) {
                        return (
                            <FetchStatusMessageWithButton
                                message="Aún no hay pedidos a proveedores"
                                btnHref="/pedidos-a-proveedores/add"
                                btnText="Agrega tu primer pedidos a proveedor"
                            />
                        );
                    }

                    return (
                        <div className="pr-container flex-1 py-5 pl-10">
                            <DataTable
                                columns={columns}
                                data={supplierOrders}
                                rowRenderer={SupplierOrderRowRenderer(handleRemove)}
                            />

                            <DataTablePagination
                                currentPage={activePage}
                                hasPrevious={hasPreviousPage}
                                hasNext={hasNextPage}
                                totalPages={noPages}
                            />
                        </div>
                    );
                }}
            </FetchedDataRenderer>
        </DashboardLayout>
    );
};

export default Page;
