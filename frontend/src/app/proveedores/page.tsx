'use client';

import Link from 'next/link';

import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';

import { Supplier, SuppliersQuery } from '@/api/graphql';
import {
    useDeleteSupplier,
    useExportSuppliersCsv,
    usePaginatedSuppliers,
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
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Correo' },
    { key: 'phone', label: 'Celular' },
    { key: 'address', label: 'Domicilio' },
    { key: 'locality', label: 'Localidad' },
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

const SupplierRowRenderer = (extraData: React.ReactNode) => {
    const renderer = (supplier: ArrayElement<SuppliersQuery['suppliers']['results']>) => (
        <TR key={supplier.id}>
            <TD>
                <Link className="text-violet-600" href={`/proveedores/${supplier.id}`}>
                    {supplier.name}
                </Link>
            </TD>
            <TD>{supplier.email}</TD>
            <TD>
                {supplier.phoneCode}
                {supplier.phoneNumber}
            </TD>
            <TD>
                {supplier.streetName} {supplier.houseNumber}
            </TD>
            <TD>{supplier.locality.name}</TD>
            {extraData}
        </TR>
    );

    return renderer;
};

const Page = () => {
    const { hasPreviousPage, hasNextPage, activePage, noPages, queryResult } =
        usePaginatedSuppliers();

    const { mutate, isLoading: isDeleting } = useDeleteSupplier({
        onSuccess: () => {
            toast.success('Proveedor eliminado correctamente');
            queryResult.refetch();
        },
        onError: () => {
            toast.error('Hubo un error al eliminar el proveedor');
        },
    });

    const handleRemove = (id: Supplier['id']) => {
        mutate(id);
    };

    const { exportCsv } = useExportSuppliersCsv();

    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>Proveedores</DashboardLayoutBigTitle>

                    <div className="flex space-x-8">
                        <Button
                            variant={ButtonVariant.GRAY}
                            onClick={() => {
                                exportCsv({});
                            }}
                        >
                            Exportar a CSV
                        </Button>

                        <Button href="/proveedores/add">+ Añadir proveedor</Button>
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
                            line1="Hubo un error al cargar los proveedores."
                            line2="Prueba de nuevo más tarde."
                        />
                    </div>
                }
            >
                {({ suppliers: { results: suppliers } }) => {
                    if (suppliers.length === 0) {
                        return (
                            <FetchStatusMessageWithButton
                                message="Aún no hay proveedores"
                                btnHref="/proveedores/add"
                                btnText="Agrega tu primer proveedor"
                            />
                        );
                    }

                    return (
                        <div className="pr-container flex-1 py-5 pl-10">
                            <DataTable
                                columns={columns}
                                data={suppliers}
                                rowRenderer={SupplierRowRenderer}
                                deleteOptions={{
                                    confirmationText: (supplier) => (
                                        <>
                                            ¿Estás seguro de que quieres eliminar el
                                            proveedor <strong>{supplier.name}</strong>?
                                        </>
                                    ),
                                    onDeleteClick: (supplier) => {
                                        handleRemove(supplier.id);
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
