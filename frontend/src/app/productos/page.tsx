'use client';

import Link from 'next/link';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { ProductListItemFragment, ProductTypeChoices } from '@/api/graphql';
import {
    useDeleteProduct,
    useExportProductsCsv,
    usePaginatedProducts,
} from '@/api/hooks';

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
import { Badge } from '@/components/ui/badge';
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

const columnsHelper = createColumnHelper<ProductListItemFragment>();

const columns: ColumnDef<ProductListItemFragment, any>[] = [
    columnsHelper.accessor('name', {
        id: 'name',
        header: 'Producto',
        cell: (props) => {
            const product = props.row.original;

            return (
                <Link className="text-violet-600" href={`/productos/${product.id}`}>
                    {product.name}
                </Link>
            );
        },
        size: 300,
    }),
    columnsHelper.accessor('sku', {
        id: 'sku',
        header: 'SKU',
        cell: (props) => props.row.original.sku || '-',
        size: 200,
    }),
    columnsHelper.accessor('brand', {
        id: 'brand',
        header: 'Marca',
        cell: (props) => props.row.original.brand?.name || '-',
        size: 200,
    }),
    columnsHelper.accessor('type', {
        id: 'type',
        header: 'Tipo',
        cell: (props) => {
            const type = props.getValue();

            if (type === ProductTypeChoices.Alquilable) {
                return <Badge variant="outline">Alquilable</Badge>;
            }

            if (type === ProductTypeChoices.Comerciable) {
                return <Badge variant="outline">Comerciable</Badge>;
            }

            return <Badge variant="outline">-</Badge>;
        },
        size: 200,
    }),
    columnsHelper.accessor('price', {
        id: 'price',
        header: 'Precio',
        cell: (props) => {
            const price = props.getValue();
            return `$${formatNumberAsPrice(price)}`;
        },
        size: 100,
    }),
    columnsHelper.display({
        id: 'actions',
        cell: (props) => {
            return (
                <div className="flex justify-end">
                    <RowActions product={props.row.original} />
                </div>
            );
        },
        size: 20,
    }),
];

const RowActions = ({ product }: { product: ProductListItemFragment }) => {
    const deleteMutation = useDeleteProduct({
        onSuccess: () => {
            toast.success('Producto eliminado correctamente');
        },
        onError: () => {
            toast.error('Ha ocurrido un error al eliminar el producto');
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
                        ¿Estás seguro de que quieres eliminar al producto &ldquo;
                        <strong>
                            <em>{product.name}</em>
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
                            deleteMutation.mutate(product.id, {
                                onSuccess: () => {
                                    toast.success(
                                        `El producto ${product.name} ha sido eliminado.`,
                                    );
                                    setOpen(false);
                                },
                                onError: () => {
                                    toast.error(
                                        `No se pudo eliminar el producto ${product.name}`,
                                    );
                                },
                            });
                        }}
                        variant="destructive"
                        showSpinner={deleteMutation.isLoading}
                    >
                        Eliminar
                    </ButtonWithSpinner>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const Page = () => {
    const { queryResult, activePage, noPages, variables, setVariables } =
        usePaginatedProducts();

    const { exportCsv } = useExportProductsCsv();

    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>Productos</DashboardLayoutBigTitle>

                    <div className="flex space-x-8">
                        <DeprecatedButton
                            variant={ButtonVariant.GRAY}
                            onClick={() => {
                                exportCsv({});
                            }}
                        >
                            Exportar a CSV
                        </DeprecatedButton>

                        <DeprecatedButton href="/productos/add">
                            + Añadir producto
                        </DeprecatedButton>
                    </div>
                </div>
            }
        >
            <div className="pr-container mb-4 flex space-x-2 pl-8 pt-5">
                <Input
                    placeholder="Buscar por nombre"
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
                    <div className="pr-container flex-1 pl-8">
                        <AdminDataTableLoading columns={columns} />
                    </div>
                }
                Error={
                    <div className="flex w-full flex-1 items-center justify-center">
                        <FetchStatusMessageWithDescription
                            title="Ha ocurrido un error"
                            line1="Hubo un error al cargar los productos."
                            line2="Prueba de nuevo más tarde."
                        />
                    </div>
                }
            >
                {({ products: data }) => {
                    const edges = data?.results;

                    if ((!edges || edges.length === 0) && !variables.query) {
                        return (
                            <FetchStatusMessageWithButton
                                message="Aún no hay productos"
                                btnHref="/productos/add"
                                btnText="Agrega tu primer producto"
                            />
                        );
                    }

                    if (
                        variables.query &&
                        variables.query.length > 0 &&
                        (!edges || edges.length === 0)
                    ) {
                        return (
                            <div className="flex flex-1 flex-col">
                                <div className="flex h-full w-full flex-1 items-center justify-center">
                                    <FetchStatusMessageWithDescription
                                        title="No se encontraron resultados"
                                        line1="No se encontraron productos con el termino de busqueda"
                                    />
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div className="pr-container flex-1 pl-8">
                            <AdminDataTable
                                columns={columns}
                                data={edges}
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
