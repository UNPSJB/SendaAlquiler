'use client';

import Link from 'next/link';

import Skeleton from 'react-loading-skeleton';

import { Supplier, SuppliersQuery } from '@/api/graphql';
import { useSuppliers } from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import DataTable from '@/modules/data-table/DataTable';
import DataTableDropdown from '@/modules/data-table/DataTableDropdown';
import DataTablePagination from '@/modules/data-table/DataTablePagination';

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

const SupplierRowRenderer = (handleRemove: (id: Supplier['id']) => void) => {
    const renderer = (supplier: ArrayElement<SuppliersQuery['suppliers']>) => (
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
            <TD>
                <DataTableDropdown onRemove={() => handleRemove(supplier.id)} />
            </TD>
        </TR>
    );

    return renderer;
};

const Page = () => {
    const useSuppliersResult = useSuppliers();

    const handlePrevious = () => {
        console.log('previous');
    };

    const handleNext = () => {
        console.log('next');
    };

    const handleRemove = (id: Supplier['id']) => {
        console.log(`remove ${id}`);
    };

    return (
        <DashboardLayout
            header={<DashboardLayoutBigTitle>Proveedores</DashboardLayoutBigTitle>}
        >
            <FetchedDataRenderer
                {...useSuppliersResult}
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
                {({ suppliers }) => {
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
                                rowRenderer={SupplierRowRenderer(handleRemove)}
                            />

                            <DataTablePagination
                                onPrevious={handlePrevious}
                                onNext={handleNext}
                            />
                        </div>
                    );
                }}
            </FetchedDataRenderer>
        </DashboardLayout>
    );
};

export default Page;
