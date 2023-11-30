'use client';

import Link from 'next/link';

import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';

import { Client, ClientsQuery } from '@/api/graphql';
import { useClients, useDeleteClient, useExportClientsCsv } from '@/api/hooks';

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
    { key: 'email', label: 'Correo' },
    { key: 'phone', label: 'Celular' },
    { key: 'address', label: 'Domicilio' },
    { key: 'locality', label: 'Localidad' },
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

const ClientRowRenderer = (handleRemove: (id: Client['id']) => void) => {
    const renderer = (client: ArrayElement<ClientsQuery['clients']['results']>) => (
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
            <TD>
                <DataTableDropdown onRemove={() => handleRemove(client.id)} />
            </TD>
        </TR>
    );

    return renderer;
};

const Page = () => {
    const { hasPreviousPage, hasNextPage, activePage, noPages, queryResult } =
        useClients();

    const { mutate } = useDeleteClient({
        onSuccess: () => {
            toast.success('Cliente eliminado correctamente');
            queryResult.refetch();
        },
        onError: () => {
            toast.error('Ha ocurrido un error al eliminar el cliente');
        },
    });

    const handleRemove = (id: Client['id']) => {
        mutate(id);
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
                                rowRenderer={ClientRowRenderer(handleRemove)}
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
