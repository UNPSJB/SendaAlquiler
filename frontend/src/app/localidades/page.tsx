'use client';

import Skeleton from 'react-loading-skeleton';

import { LocalitiesQuery, Locality } from '@/api/graphql';
import { useLocalities } from '@/api/hooks';

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
    { key: 'cp', label: 'Código Postal' },
    { key: 'state', label: 'Provincia' },
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

const LocalityRowRenderer = (handleRemove: (id: Locality['id']) => void) => {
    const renderer = (locality: ArrayElement<LocalitiesQuery['localities']>) => (
        <TR key={locality.id}>
            <TD>{locality.name}</TD>
            <TD>{locality.postalCode}</TD>
            <TD>{locality.state}</TD>
            <TD>
                <DataTableDropdown onRemove={() => handleRemove(locality.id)} />
            </TD>
        </TR>
    );

    return renderer;
};

const Page = () => {
    const useLocalitiesResult = useLocalities();

    const handlePrevious = () => {
        console.log('previous');
    };

    const handleNext = () => {
        console.log('next');
    };

    const handleRemove = (id: Locality['id']) => {
        console.log(`remove ${id}`);
    };

    return (
        <DashboardLayout
            header={<DashboardLayoutBigTitle>Localidades</DashboardLayoutBigTitle>}
        >
            <FetchedDataRenderer
                {...useLocalitiesResult}
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
                {({ localities }) => {
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
                                rowRenderer={LocalityRowRenderer(handleRemove)}
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
