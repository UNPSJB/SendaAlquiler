'use client';

import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';

import { LocalitiesQuery, Locality } from '@/api/graphql';
import { useDeleteLocality, useExportLocalitiesCsv, useLocalities } from '@/api/hooks';

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
    { key: 'cp', label: 'Código Postal' },
    { key: 'state', label: 'Provincia' },
    { key: 'dropdown', label: '' },
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

const LocalityRowRenderer = (extraData: React.ReactNode) => {
    const renderer = (
        locality: ArrayElement<LocalitiesQuery['localities']['results']>,
    ) => (
        <TR key={locality.id}>
            <TD>{locality.name}</TD>
            <TD>{locality.postalCode}</TD>
            <TD>{locality.state}</TD>

            {extraData}
        </TR>
    );

    return renderer;
};

const Page = () => {
    const { hasPreviousPage, hasNextPage, activePage, noPages, queryResult } =
        useLocalities();

    const { mutate, isLoading: isDeleting } = useDeleteLocality({
        onSuccess: () => {
            toast.success('Localidad eliminada correctamente');
            queryResult.refetch();
        },
        onError: () => {
            toast.error('Hubo un error al eliminar la localidad');
        },
    });

    const handleRemove = (id: Locality['id']) => {
        mutate(id);
    };

    const { exportCsv } = useExportLocalitiesCsv();

    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>Localidades</DashboardLayoutBigTitle>

                    <div className="flex space-x-8">
                        <Button
                            variant={ButtonVariant.GRAY}
                            onClick={() => {
                                exportCsv({});
                            }}
                        >
                            Exportar a CSV
                        </Button>

                        <Button href="/localidades/add">+ Añadir localidad</Button>
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
                        <div className="pr-container flex-1 py-5 pl-10">
                            <DataTable
                                columns={columns}
                                data={localities}
                                rowRenderer={LocalityRowRenderer}
                                deleteOptions={{
                                    confirmationText: (locality) => (
                                        <>
                                            ¿Estás seguro que deseas eliminar la localidad{' '}
                                            <b>{locality.name}</b>?
                                        </>
                                    ),
                                    onDeleteClick: (locality) => {
                                        handleRemove(locality.id);
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
