'use client';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { LocalitiesQuery } from '@/api/graphql';
import { useDeleteLocality, useExportLocalitiesCsv, useLocalities } from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';

import { AdminDataTable } from '@/components/admin-data-table';
import { AdminDataTableLoading } from '@/components/admin-data-table-skeleton';
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

type Locality = LocalitiesQuery['localities']['results'][0];

const columnsHelper = createColumnHelper<Locality>();

const columns: ColumnDef<Locality, any>[] = [
    columnsHelper.accessor('name', {
        id: 'name',
        header: 'Nombre',
    }),
    columnsHelper.accessor('postalCode', {
        id: 'cp',
        header: 'Código Postal',
    }),
    columnsHelper.accessor('state', {
        id: 'state',
        header: 'Provincia',
    }),
    columnsHelper.display({
        id: 'actions',
        cell: (props) => {
            const locality = props.row.original;

            return (
                <div className="flex justify-end">
                    <RowActions locality={locality} />
                </div>
            );
        },
    }),
];

const RowActions = ({ locality }: { locality: Locality }) => {
    const deleteMutation = useDeleteLocality();

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
                    <MoreVertical className="size-5" />
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
                        ¿Estás seguro de que quieres eliminar la localidad &ldquo;
                        <strong>
                            <em>{locality.name}</em>
                        </strong>
                        &rdquo;?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Cancelar</Button>
                    </DialogClose>

                    <ButtonWithSpinner
                        showSpinner={deleteMutation.isPending}
                        onClick={() => {
                            deleteMutation.mutate(locality.id, {
                                onSuccess: () => {
                                    toast.success(
                                        `La localidad ${locality.name} ha sido eliminado.`,
                                    );
                                    setOpen(false);
                                },
                                onError: () => {
                                    toast.error(
                                        `No se pudo eliminar la localidad ${locality.name}.`,
                                    );
                                },
                            });
                        }}
                        variant="destructive"
                    >
                        Eliminar
                    </ButtonWithSpinner>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const Page = () => {
    const { setVariables, activePage, noPages, queryResult } = useLocalities();

    const { exportCsv } = useExportLocalitiesCsv();

    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>Localidades</DashboardLayoutBigTitle>

                    <div className="flex space-x-8">
                        <DeprecatedButton
                            variant={ButtonVariant.GRAY}
                            onClick={() => {
                                exportCsv({});
                            }}
                        >
                            Exportar a CSV
                        </DeprecatedButton>

                        <DeprecatedButton href="/localidades/add">
                            + Añadir localidad
                        </DeprecatedButton>
                    </div>
                </div>
            }
        >
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
                            line1="Hubo un error al cargar las localidades."
                            line2="Prueba de nuevo más tarde."
                        />
                    </div>
                }
            >
                {({ localities: { results: localities } }) => {
                    if (localities.length === 0) {
                        return (
                            <FetchStatusMessageWithButton
                                message="Aún no hay localidades"
                                btnHref="/localidades/add"
                                btnText="Agrega tu primer localidad"
                            />
                        );
                    }

                    return (
                        <div className="pr-container flex-1 pl-8">
                            <AdminDataTable
                                columns={columns}
                                currentPage={activePage}
                                data={localities}
                                numberOfPages={noPages}
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
