'use client';

import Link from 'next/link';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { PurchasesQuery } from '@/api/graphql';
import { useDeletePurchase, useExportPurchasesCsv, usePurchases } from '@/api/hooks';

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

type Purchase = PurchasesQuery['purchases']['results'][0];

const columnsHelper = createColumnHelper<Purchase>();

const columns: ColumnDef<Purchase, any>[] = [
    columnsHelper.accessor('client.firstName', {
        id: 'client',
        header: 'Cliente',
        cell: (props) => {
            const purchase = props.row.original;

            return (
                <Link href={`/ventas/${purchase.id}`}>
                    <p className="text-violet-600">
                        {purchase.client.firstName} {purchase.client.lastName}
                    </p>

                    <p>
                        <span className="text-muted-foreground">
                            {purchase.client.email}
                        </span>
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

            return `$${total}`;
        },
    }),
    columnsHelper.display({
        id: 'actions',
        cell: (props) => {
            const purchase = props.row.original;
            return <RowActions purchase={purchase} />;
        },
    }),
];

const RowActions = ({ purchase }: { purchase: Purchase }) => {
    const deleteMutation = useDeletePurchase({
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
                if (deleteMutation.isLoading) {
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
                        ¿Estás seguro de que quieres eliminar la venta de &ldquo;
                        <strong>
                            <em>
                                {purchase.client.firstName} {purchase.client.lastName}
                            </em>
                        </strong>
                        &rdquo; por un total de &ldquo;
                        <strong>
                            <em>${purchase.total}</em>
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
                            deleteMutation.mutate(purchase.id);
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
    const { setVariables, activePage, noPages, queryResult } = usePurchases();

    const { exportCsv } = useExportPurchasesCsv();

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
            <FetchedDataRenderer
                {...queryResult}
                Loading={
                    <div className="pr-container flex-1 py-5 pl-10">
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
                            <AdminDataTable
                                columns={columns}
                                data={purchases}
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
