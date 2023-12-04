'use client';

import Link from 'next/link';

import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';

import {
    InternalOrder,
    InternalOrderHistoryStatusChoices,
    InternalOrdersQuery,
} from '@/api/graphql';
import {
    useDeleteInternalOrder,
    useExportInternalOrdersCsv,
    usePaginatedInternalOrders,
} from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import DataTable from '@/modules/data-table/DataTable';
import DataTablePagination from '@/modules/data-table/DataTablePagination';

import Button, { ButtonVariant } from '@/components/Button';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import { TD, TR } from '@/components/Table';

const columns = [
    { key: 'name', label: 'Fecha' },
    { key: 'email', label: 'Origen' },
    { key: 'phone', label: 'Destino' },
    { key: 'address', label: 'Estado' },
];

const SkeletonRowRenderer = () => {
    const renderer = (key: number) => (
        <TR key={key}>
            {[...new Array(columns.length)].map((_, index) => (
                <TD key={index}>
                    <Skeleton width={100}></Skeleton>
                </TD>
            ))}
        </TR>
    );

    return renderer;
};

const Status = ({ status }: { status: InternalOrderHistoryStatusChoices }) => {
    if (status === InternalOrderHistoryStatusChoices.Completed) {
        return (
            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                Completado
            </span>
        );
    }

    if (status === InternalOrderHistoryStatusChoices.InProgress) {
        return (
            <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800">
                En progreso
            </span>
        );
    }

    if (status === InternalOrderHistoryStatusChoices.Pending) {
        return (
            <span className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-5 text-yellow-800">
                Pendiente
            </span>
        );
    }

    return (
        <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
            Cancelado
        </span>
    );

    return <span>{status}</span>;
};

const InternalOrderRowRenderer = (extraData: React.ReactNode) => {
    const renderer = (
        supplier: ArrayElement<InternalOrdersQuery['internalOrders']['results']>,
    ) => {
        const humanReadableDate = new Date(supplier.createdOn).toLocaleDateString();

        return (
            <TR key={supplier.id}>
                <TD>
                    <Link
                        className="text-violet-600"
                        href={`/pedidos-internos/${supplier.id}`}
                    >
                        {humanReadableDate}
                    </Link>
                </TD>
                <TD>{supplier.officeBranch.name}</TD>
                <TD>{supplier.officeDestination.name}</TD>
                <TD>
                    {supplier.currentHistory ? (
                        <Status status={supplier.currentHistory.status} />
                    ) : (
                        '-'
                    )}
                </TD>
                {extraData}
            </TR>
        );
    };

    return renderer;
};

const Page = () => {
    const { hasPreviousPage, hasNextPage, activePage, noPages, queryResult } =
        usePaginatedInternalOrders();

    const { mutate, isLoading: isDeleting } = useDeleteInternalOrder({
        onSuccess: () => {
            toast.success('El pedido interno ha sido eliminado');
            queryResult.refetch();
        },
        onError: () => {
            toast.error('Ha ocurrido un error al eliminar el pedido interno');
        },
    });

    const handleRemove = (id: InternalOrder['id']) => {
        mutate(id);
    };

    const { exportCsv } = useExportInternalOrdersCsv();

    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>Pedidos Internos</DashboardLayoutBigTitle>

                    <div className="flex space-x-8">
                        <Button
                            variant={ButtonVariant.GRAY}
                            onClick={() => {
                                exportCsv({});
                            }}
                        >
                            Exportar a CSV
                        </Button>

                        <Button href="/pedidos-internos/add">+ Añadir pedido</Button>
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
                            line1="Hubo un error al cargar los pedidos internos."
                            line2="Prueba de nuevo más tarde."
                        />
                    </div>
                }
            >
                {({ internalOrders: { results: internalOrders } }) => {
                    if (internalOrders.length === 0) {
                        return (
                            <FetchStatusMessageWithButton
                                message="Aún no hay pedidos internos"
                                btnHref="/pedidos-internos/add"
                                btnText="Agrega tu primer pedido interno"
                            />
                        );
                    }

                    return (
                        <div className="pr-container flex-1 py-5 pl-10">
                            <DataTable
                                columns={columns}
                                data={internalOrders}
                                rowRenderer={InternalOrderRowRenderer}
                                deleteOptions={{
                                    confirmationText: (internalOrder) => (
                                        <>
                                            ¿Estás seguro que deseas eliminar el pedido
                                            interno{' '}
                                            <span className="font-bold">
                                                {new Date(
                                                    internalOrder.createdOn,
                                                ).toLocaleDateString()}
                                            </span>
                                            ?
                                        </>
                                    ),
                                    onDeleteClick: (internalOrder) => {
                                        handleRemove(internalOrder.id);
                                    },
                                    isDeleting,
                                }}
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
