'use client';

import Link from 'next/link';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { SalesQuery } from '@/api/graphql';
import { useDeleteSale, useExportSalesCsv, useSales } from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';

import { AdminDataTable } from '@/components/admin-data-table';
import { AdminDataTableLoading } from '@/components/admin-data-table-skeleton';
import DeprecatedButton, { ButtonVariant } from '@/components/Button';
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
import { formatNumberAsPrice } from '@/lib/utils';

type Sale = SalesQuery['sales']['results'][0];

const columnsHelper = createColumnHelper<Sale>();

const columns: ColumnDef<Sale, any>[] = [
    columnsHelper.accessor('client.firstName', {
        id: 'client',
        header: 'Cliente',
        cell: (props) => {
            const sale = props.row.original;

            return (
                <Link href={`/ventas/${sale.id}`}>
                    <p className="text-violet-600">
                        {sale.client.firstName} {sale.client.lastName}
                    </p>

                    <p>
                        <span className="text-muted-foreground">{sale.client.email}</span>
                    </p>
                </Link>
            );
        },
    }),
    columnsHelper.accessor('createdOn', {
        id: 'date',
        header: 'Fecha',
        cell: (props) => {
            const date = props.getValue();

            return new Date(date).toLocaleDateString('es-ES');
        },
    }),
    columnsHelper.accessor('total', {
        id: 'totalPrice',
        header: 'Total',
        cell: (props) => {
            const total = props.getValue();

            return `$${formatNumberAsPrice(total)}`;
        },
    }),
    columnsHelper.display({
        id: 'actions',
        cell: (props) => {
            const sale = props.row.original;
            return (
                <div className="flex justify-end">
                    <RowActions sale={sale} />
                </div>
            );
        },
    }),
];

const RowActions = ({ sale }: { sale: Sale }) => {
    const deleteMutation = useDeleteSale({
        onSuccess: () => {
            toast.success('Venta eliminada correctamente');
        },
        onError: () => {
            toast.error('Ha ocurrido un error al eliminar la venta');
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
                        ¿Estás seguro de que quieres eliminar la venta de &ldquo;
                        <strong>
                            <em>
                                {sale.client.firstName} {sale.client.lastName}
                            </em>
                        </strong>
                        &rdquo; por un total de &ldquo;
                        <strong>
                            <em>${sale.total}</em>
                        </strong>
                        &rdquo;?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Cancelar</Button>
                    </DialogClose>

                    <Button
                        onClick={() => {
                            deleteMutation.mutate(sale.id);
                        }}
                        variant="destructive"
                    >
                        Eliminar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const Page = () => {
    const { setVariables, activePage, noPages, queryResult, variables } = useSales();

    const { exportCsv } = useExportSalesCsv();

    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>Ventas</DashboardLayoutBigTitle>

                    <div className="flex space-x-8">
                        <DeprecatedButton
                            variant={ButtonVariant.GRAY}
                            onClick={() => {
                                exportCsv({});
                            }}
                        >
                            Exportar a CSV
                        </DeprecatedButton>

                        <DeprecatedButton href="/ventas/add">
                            + Realizar venta
                        </DeprecatedButton>
                    </div>
                </div>
            }
        >
            <div className="pr-container mb-4 flex space-x-2 pl-8 pt-5">
                <Input
                    placeholder="Buscar por email, nombre o apellido"
                    value={variables.query || ''}
                    onChange={(e) => {
                        setVariables('query', e.target.value || '');
                    }}
                    className="max-w-xs"
                />
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
                            line1="Hubo un error al cargar las ventas."
                            line2="Prueba de nuevo más tarde."
                        />
                    </div>
                }
            >
                {({ sales: { results: sales } }) => {
                    if (sales.length === 0) {
                        return (
                            <FetchStatusMessageWithButton
                                message="Aún no hay ventas"
                                btnHref="/ventas/add"
                                btnText="Agrega tu primer venta"
                            />
                        );
                    }

                    return (
                        <div className="pr-container flex-1 pl-8">
                            <AdminDataTable
                                columns={columns}
                                data={sales}
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
