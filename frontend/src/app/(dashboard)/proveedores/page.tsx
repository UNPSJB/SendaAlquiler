'use client';

import Link from 'next/link';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { SuppliersQuery } from '@/api/graphql';
import {
    useDeleteSupplier,
    useExportSuppliersCsv,
    usePaginatedSuppliers,
} from '@/api/hooks';

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

type Supplier = SuppliersQuery['suppliers']['results'][0];
const columnsHelper = createColumnHelper<Supplier>();

const columns: ColumnDef<Supplier, any>[] = [
    columnsHelper.accessor('name', {
        id: 'name',
        header: 'Nombre',
        cell: (props) => {
            const supplier = props.row.original;

            return (
                <Link href={`/proveedores/${supplier.id}`}>
                    <p className="text-violet-600">{supplier.name}</p>

                    <p className="text-muted-foreground">{supplier.email}</p>
                </Link>
            );
        },
    }),
    columnsHelper.accessor('phoneCode', {
        id: 'phone',
        header: 'Celular',
        cell: (props) => {
            const supplier = props.row.original;

            return (
                <>
                    +{supplier.phoneCode}
                    {supplier.phoneNumber}
                </>
            );
        },
    }),
    columnsHelper.accessor('streetName', {
        id: 'address',
        header: 'Domicilio',
        cell: (props) => {
            const supplier = props.row.original;

            return (
                <>
                    {supplier.streetName} {supplier.houseNumber}
                </>
            );
        },
    }),
    columnsHelper.accessor('locality', {
        id: 'locality',
        header: 'Localidad',
        cell: (props) => {
            const supplier = props.row.original;

            return supplier.locality.name;
        },
    }),
    columnsHelper.display({
        id: 'actions',
        cell: (props) => {
            const supplier = props.row.original;
            return (
                <div className="flex justify-end">
                    <RowActions supplier={supplier} />
                </div>
            );
        },
    }),
];

const RowActions = ({ supplier }: { supplier: Supplier }) => {
    const deleteMutation = useDeleteSupplier();

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
                        ¿Estás seguro de que quieres eliminar el proveedor &ldquo;
                        <strong>
                            <em>{supplier.name}</em>
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
                            deleteMutation.mutate(supplier.id, {
                                onSuccess: () => {
                                    toast.success(
                                        `Proveedor ${supplier.name} eliminado correctamente`,
                                    );
                                    setOpen(false);
                                },
                                onError: () => {
                                    toast.error(
                                        `Ha ocurrido un error al eliminar el proveedor ${supplier.name}`,
                                    );
                                },
                            });
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
    const { setVariables, activePage, noPages, queryResult, variables } =
        usePaginatedSuppliers();

    const { exportCsv } = useExportSuppliersCsv();

    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>Proveedores</DashboardLayoutBigTitle>

                    <div className="flex space-x-8">
                        <DeprecatedButton
                            variant={ButtonVariant.GRAY}
                            onClick={() => {
                                exportCsv({});
                            }}
                        >
                            Exportar a CSV
                        </DeprecatedButton>

                        <DeprecatedButton href="/proveedores/add">
                            + Añadir proveedor
                        </DeprecatedButton>
                    </div>
                </div>
            }
        >
            <div className="pr-container mb-4 flex space-x-2 pl-8 pt-5">
                <Input
                    placeholder="Buscar por email, nombre o cuit"
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
                            line1="Hubo un error al cargar los proveedores."
                            line2="Prueba de nuevo más tarde."
                        />
                    </div>
                }
            >
                {({ suppliers: { results: suppliers } }) => {
                    if (suppliers.length === 0 && !variables.query) {
                        return (
                            <FetchStatusMessageWithButton
                                message="Aún no hay proveedores"
                                btnHref="/proveedores/add"
                                btnText="Agrega tu primer proveedor"
                            />
                        );
                    }

                    return (
                        <div className="pr-container flex-1 pl-8">
                            <AdminDataTable
                                columns={columns}
                                currentPage={activePage}
                                data={suppliers}
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
