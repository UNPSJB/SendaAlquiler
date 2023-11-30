'use client';

import Link from 'next/link';

import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';

import { Purchase, PurchasesQuery } from '@/api/graphql';
import { useDeletePurchase, useExportPurchasesCsv, usePurchases } from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import DataTable from '@/modules/data-table/DataTable';
import DataTableDropdown from '@/modules/data-table/DataTableDropdown';
import DataTablePagination from '@/modules/data-table/DataTablePagination';

import Button, { ButtonVariant } from '@/components/Button';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import { TD, TR } from '@/components/Table';

const columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'date', label: 'Fecha' },
    { key: 'totalPrice', label: 'Total' },
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

const PurchaseRowRenderer = (handleRemove: (id: Purchase['id']) => void) => {
    const renderer = (purchase: ArrayElement<PurchasesQuery['purchases']['results']>) => (
        <TR key={purchase.id}>
            <TD>
                <Link className="text-violet-600" href={`/ventas/${purchase.id}`}>
                    {purchase.client.firstName} {purchase.client.lastName}
                </Link>
            </TD>
            <TD>{new Date(purchase.createdOn).toLocaleDateString('es-ES')}</TD>
            <TD>${purchase.total}</TD>
            <TD>
                <DataTableDropdown onRemove={() => handleRemove(purchase.id)} />
            </TD>
        </TR>
    );

    return renderer;
};

const Page = () => {
    const { hasPreviousPage, hasNextPage, activePage, noPages, queryResult } =
        usePurchases();

    const { mutate } = useDeletePurchase({
        onSuccess: () => {
            toast.success('Venta eliminada con éxito');
            queryResult.refetch();
        },
        onError: () => {
            toast.error('Hubo un error al eliminar la venta');
        },
    });

    const handleRemove = (id: Purchase['id']) => {
        mutate(id);
    };

    const { exportCsv } = useExportPurchasesCsv();

    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>Ventas</DashboardLayoutBigTitle>

                    <div className="flex space-x-8">
                        <Button
                            variant={ButtonVariant.GRAY}
                            onClick={() => {
                                exportCsv({});
                            }}
                        >
                            Exportar a CSV
                        </Button>

                        <Button href="/ventas/add">+ Realizar venta</Button>
                    </div>
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
                            line1="Hubo un error al cargar las ventas."
                            line2="Prueba de nuevo más tarde."
                        />
                    </div>
                }
            >
                {({ purchases: { results: purchases } }) => {
                    if (purchases.length === 0) {
                        return (
                            <FetchStatusMessageWithButton
                                message="Aún no hay ventas"
                                btnHref="/ventas/add"
                                btnText="Agrega tu primer venta"
                            />
                        );
                    }

                    return (
                        <div className="pr-container flex-1 py-5 pl-10">
                            <DataTable
                                columns={columns}
                                data={purchases}
                                rowRenderer={PurchaseRowRenderer(handleRemove)}
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
