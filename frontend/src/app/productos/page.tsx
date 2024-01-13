'use client';

import Link from 'next/link';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';

import { Product, ProductListItemFragment } from '@/api/graphql';
import {
    useDeleteProduct,
    useExportProductsCsv,
    usePaginatedProducts,
} from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import DataTable from '@/modules/data-table/DataTable';
import DataTablePagination from '@/modules/data-table/DataTablePagination';
import { Input } from '@/modules/forms/DeprecatedInput';

import Button, { ButtonVariant } from '@/components/Button';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import { TD, TR } from '@/components/Table';

const columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'brand', label: 'Marca' },
    { key: 'type', label: 'Tipo' },
    { key: 'price', label: 'Precio' },
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

const ProductRowRenderer = (extraData: React.ReactNode) => {
    const renderer = (product: ProductListItemFragment) => (
        <TR key={product.id}>
            <TD>
                <Link className="text-violet-600" href={`/productos/${product.id}`}>
                    {product.name}
                </Link>
            </TD>
            <TD>{product.brand?.name || '-'}</TD>
            <TD>{product.type}</TD>
            <TD>$ {product.price}</TD>
            {extraData}
        </TR>
    );

    return renderer;
};

const Page = () => {
    const {
        hasPreviousPage,
        hasNextPage,
        queryResult,
        activePage,
        noPages,
        variables,
        setVariables,
    } = usePaginatedProducts();

    const { mutate, isLoading: isDeleting } = useDeleteProduct({
        onSuccess: () => {
            toast.success('Producto eliminado correctamente');
            queryResult.refetch();
        },
        onError: () => {
            toast.error('Hubo un error al eliminar el producto');
        },
    });

    const handleRemove = (id: Product['id']) => {
        mutate(id);
    };

    const { exportCsv } = useExportProductsCsv();
    const [query, setQuery] = useState(variables.query || '');

    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>Productos</DashboardLayoutBigTitle>

                    <div className="flex space-x-8">
                        <Button
                            variant={ButtonVariant.GRAY}
                            onClick={() => {
                                exportCsv({});
                            }}
                        >
                            Exportar a CSV
                        </Button>

                        <Button href="/productos/add">+ Añadir producto</Button>
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
                            line1="Hubo un error al cargar los productos."
                            line2="Prueba de nuevo más tarde."
                        />
                    </div>
                }
            >
                {({ products: data }) => {
                    const edges = data?.results;

                    if ((!edges || edges.length === 0) && query.length <= 0) {
                        return (
                            <FetchStatusMessageWithButton
                                message="Aún no hay productos"
                                btnHref="/productos/add"
                                btnText="Agrega tu primer producto"
                            />
                        );
                    }

                    if (query.length > 0 && (!edges || edges.length === 0)) {
                        return (
                            <div className="flex flex-1 flex-col">
                                <div className="container py-8">
                                    <form
                                        onSubmit={() => {
                                            setVariables({
                                                page: null,
                                                query,
                                            });
                                        }}
                                    >
                                        <Input
                                            id="query"
                                            name="query"
                                            value={query}
                                            placeholder="Ingresa un termino de busqueda"
                                            onChange={(val) => {
                                                setQuery(val);
                                            }}
                                        />
                                    </form>
                                </div>

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
                        <div>
                            <div className="container pt-8">
                                <form
                                    onSubmit={() => {
                                        setVariables({
                                            page: null,
                                            query,
                                        });
                                    }}
                                >
                                    <Input
                                        id="query"
                                        name="query"
                                        value={query}
                                        placeholder="Ingresa un termino de busqueda"
                                        onChange={(val) => {
                                            setQuery(val);
                                        }}
                                    />
                                </form>
                            </div>

                            <div className="pr-container flex-1 py-5 pl-10">
                                <DataTable
                                    columns={columns}
                                    data={edges.map((edge) => edge)}
                                    rowRenderer={ProductRowRenderer}
                                    deleteOptions={{
                                        confirmationText: (product) => (
                                            <>
                                                ¿Estás seguro de que quieres eliminar el
                                                producto <strong>{product.name}</strong>?
                                            </>
                                        ),
                                        onDeleteClick: (product) => {
                                            handleRemove(product.id);
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
                        </div>
                    );
                }}
            </FetchedDataRenderer>
        </DashboardLayout>
    );
};

export default Page;
