'use client';

import Link from 'next/link';

import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';

import { ClientsQuery } from '@/api/graphql';
import { useClients, useDeleteClient } from '@/api/hooks/clients';
import { useExportClientsCsv } from '@/api/hooks/csv-export';

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
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Correo' },
    { key: 'phone', label: 'Celular' },
    { key: 'address', label: 'Domicilio' },
    { key: 'locality', label: 'Localidad' },
];

const SkeletonRowRenderer = () => {
    const renderer = (data: number) => (
        <TR key={data}>
            {[...new Array(columns.length)].map((_, index) => (
                <TD key={index}>
                    <Skeleton width={100}></Skeleton>
                </TD>
            ))}
        </TR>
    );

    return renderer;
};

type Client = ArrayElement<ClientsQuery['clients']['results']>;

const ClientRowRenderer = (extraData: React.ReactNode) => {
    const renderer = (client: Client) => (
        <TR key={client.id}>
            <TD>
                <Link className="text-violet-600" href={`/clientes/${client.id}`}>
                    {client.firstName} {client.lastName}
                </Link>
            </TD>
            <TD>{client.email}</TD>
            <TD>
                {client.phoneCode}
                {client.phoneNumber}
            </TD>
            <TD>
                {client.streetName} {client.houseNumber}
            </TD>
            <TD>{client.locality.name}</TD>
            {extraData}
        </TR>
    );

    return renderer;
};

const Page = () => {
    const { hasPreviousPage, hasNextPage, activePage, noPages, queryResult } =
        useClients();

    const { mutate, isLoading: isDeleting } = useDeleteClient({
        onSuccess: () => {
            toast.success('Cliente eliminado correctamente');
            queryResult.refetch();
        },
        onError: () => {
            toast.error('Ha ocurrido un error al eliminar el cliente');
        },
    });

    const handleRemove = (client: Client) => {
        mutate(client.id);
    };

    const { exportCsv } = useExportClientsCsv();

    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>Clientes</DashboardLayoutBigTitle>

                    <div className="flex space-x-8">
                        <Button
                            onClick={() => {
                                exportCsv({});
                            }}
                            variant={ButtonVariant.GRAY}
                        >
                            Exportar
                        </Button>
                        <Button href="/clientes/add">+ Añadir cliente</Button>
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
                            line1="Hubo un error al cargar los clientes."
                            line2="Prueba de nuevo más tarde."
                        />
                    </div>
                }
            >
                {({ clients: { results } }) => {
                    if (results.length === 0) {
                        return (
                            <FetchStatusMessageWithButton
                                message="Aún no hay clientes"
                                btnHref="/clientes/add"
                                btnText="Agrega tu primer cliente"
                            />
                        );
                    }

                    return (
                        <div className="pr-container flex-1 py-5 pl-10">
                            <DataTable
                                columns={columns}
                                data={results}
                                rowRenderer={ClientRowRenderer}
                                deleteOptions={{
                                    confirmationText: (client: Client) => (
                                        <>
                                            ¿Estás seguro que quieres eliminar a{' '}
                                            <span className="font-bold">
                                                {client.firstName} {client.lastName}
                                            </span>
                                        </>
                                    ),
                                    isDeleting: isDeleting,
                                    onDeleteClick: handleRemove,
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
