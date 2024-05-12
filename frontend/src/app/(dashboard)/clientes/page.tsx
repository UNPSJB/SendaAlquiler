'use client';

import Link from 'next/link';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';

import { ClientsQuery } from '@/api/graphql';
import { useAllLocalities } from '@/api/hooks';
import { useClients, useDeleteClient } from '@/api/hooks/clients';
import { useExportClientsCsv } from '@/api/hooks/csv-export';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';

import { AdminDataTable } from '@/components/admin-data-table';
import { AdminDataTableLoading } from '@/components/admin-data-table-skeleton';
import { AdminTableFilter } from '@/components/admin-table-filter';
import DeprecatedButton, { ButtonVariant } from '@/components/Button';
import ButtonWithSpinner from '@/components/ButtonWithSpinner';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

const columnsHelper = createColumnHelper<Client>();

const columns: ColumnDef<Client, any>[] = [
    columnsHelper.accessor('firstName', {
        id: 'name',
        header: 'Cliente',
        cell: (props) => {
            const client = props.row.original;

            return (
                <Link className="text-violet-600" href={`/clientes/${client.id}`}>
                    <p>
                        {client.firstName} {client.lastName}
                    </p>

                    <p>
                        <span className="text-muted-foreground">{client.email}</span>
                    </p>
                </Link>
            );
        },
    }),
    columnsHelper.accessor('phoneCode', {
        id: 'phone',
        header: 'Teléfono',
        cell: (props) => {
            const client = props.row.original;

            return (
                <p>
                    +{client.phoneCode}
                    {client.phoneNumber}
                </p>
            );
        },
    }),
    columnsHelper.accessor('locality', {
        id: 'locality',
        header: 'Ciudad',
        cell: (props) => {
            const client = props.row.original;

            return <p>{client.locality.name}</p>;
        },
    }),
    columnsHelper.accessor('streetName', {
        id: 'address',
        header: 'Dirección',
        cell: (props) => {
            const client = props.row.original;

            return (
                <p>
                    {client.streetName} {client.houseNumber}
                </p>
            );
        },
    }),
    columnsHelper.display({
        id: 'actions',
        cell: (props) => {
            const client = props.row.original;
            return (
                <div className="flex justify-end">
                    <RowActions client={client} />
                </div>
            );
        },
    }),
] as const;

const RowActions = ({ client }: { client: Client }) => {
    const deleteMutation = useDeleteClient({
        onSuccess: () => {
            toast.success('Cliente eliminado correctamente');
        },
        onError: () => {
            toast.error('Ha ocurrido un error al eliminar el cliente');
        },
    });

    const [open, setOpen] = useState(false);

    return (
        <Dialog
            onOpenChange={(next) => {
                if (deleteMutation.isPending) {
                    return;
                }

                setOpen(next);
            }}
            open={open}
        >
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <MoreVertical className="h-5 w-5" />
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    <DialogTrigger asChild>
                        <DropdownMenuItem>Eliminar</DropdownMenuItem>
                    </DialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmar eliminación</DialogTitle>
                    <DialogDescription>
                        ¿Estás seguro de que quieres eliminar al cliente &ldquo;
                        <strong>
                            <em>{client.email}</em>
                        </strong>
                        &rdquo;?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Cancelar</Button>
                    </DialogClose>

                    <ButtonWithSpinner
                        onClick={() => {
                            deleteMutation.mutate(client.id, {
                                onSuccess: () => {
                                    toast.success(
                                        `El cliente ${client.email} ha sido eliminado.`,
                                    );
                                    setOpen(false);
                                },
                                onError: () => {
                                    toast.error(
                                        `No se pudo eliminar el cliente ${client.email}`,
                                    );
                                },
                            });
                        }}
                        variant="destructive"
                        showSpinner={deleteMutation.isPending}
                    >
                        Eliminar
                    </ButtonWithSpinner>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

type Client = ArrayElement<ClientsQuery['clients']['results']>;

const Page = () => {
    const { activePage, noPages, queryResult, variables, setVariables } = useClients();

    const allLocalitiesQuery = useAllLocalities();

    const { exportCsv } = useExportClientsCsv();

    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>Clientes</DashboardLayoutBigTitle>

                    <div className="flex space-x-8">
                        <DeprecatedButton
                            onClick={() => {
                                exportCsv({});
                            }}
                            variant={ButtonVariant.GRAY}
                        >
                            Exportar a CSV
                        </DeprecatedButton>
                        <DeprecatedButton href="/clientes/add">
                            + Añadir cliente
                        </DeprecatedButton>
                    </div>
                </div>
            }
        >
            <div className="pr-container mb-4 flex space-x-2 pl-8 pt-5">
                <Input
                    placeholder="Buscar por email, nombre, apellido o dni"
                    value={variables.query || ''}
                    onChange={(e) => {
                        setVariables('query', e.target.value || '');
                    }}
                    className="max-w-xs"
                />

                <FetchedDataRenderer
                    {...allLocalitiesQuery}
                    Loading={
                        <div className="flex space-x-2">
                            <Skeleton width={100}></Skeleton>
                            <Skeleton width={100}></Skeleton>
                        </div>
                    }
                    Error={null}
                >
                    {({ allLocalities }) => {
                        return (
                            <AdminTableFilter
                                title="Filtrar por ciudad"
                                options={allLocalities.map((locality) => ({
                                    label: locality.name,
                                    value: locality.id,
                                }))}
                                onSelect={(selected) => {
                                    setVariables('localities', selected);
                                }}
                                selectedValues={(variables.localities as []) || []}
                                onClear={() => {
                                    setVariables('localities', []);
                                }}
                            />
                        );
                    }}
                </FetchedDataRenderer>
            </div>

            <FetchedDataRenderer
                {...queryResult}
                Loading={
                    <div className="pr-container flex-1 py-5 pl-8">
                        <AdminDataTableLoading columns={columns} />
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
                    if (
                        results.length === 0 &&
                        !variables.query &&
                        (!variables.localities || variables.localities.length === 0)
                    ) {
                        return (
                            <FetchStatusMessageWithButton
                                message="Aún no hay clientes"
                                btnHref="/clientes/add"
                                btnText="Agrega tu primer cliente"
                            />
                        );
                    }

                    return (
                        <div className="pr-container flex-1 pl-8">
                            <AdminDataTable
                                columns={columns}
                                data={results}
                                numberOfPages={noPages}
                                currentPage={activePage}
                                onPageChange={(page: number) => {
                                    setVariables('page', page);
                                }}
                            />
                        </div>
                    );
                }}
            </FetchedDataRenderer>
        </DashboardLayout>
    );
};

export default Page;
