'use client';

import Link from 'next/link';

import Skeleton from 'react-loading-skeleton';

import { RentalContract, ContractsQuery, Supplier } from '@/api/graphql';
import { useContracts } from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import DataTable from '@/modules/data-table/DataTable';
import DataTableDropdown from '@/modules/data-table/DataTableDropdown';
import DataTablePagination from '@/modules/data-table/DataTablePagination';

import Button from '@/components/Button';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import { TD, TR } from '@/components/Table';

const columns = [
    { key: 'name', label: 'Fecha' },
    { key: 'office', label: 'Sucursal' },
    { key: 'address', label: 'Estado' },
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

const RowRenderer = (handleRemove: (id: RentalContract['id']) => void) => {
    const renderer = (contract: ArrayElement<ContractsQuery['rentalContracts']>) => {
        const humanReadableDate = new Date(contract.createdOn).toLocaleDateString();

        return (
            <TR key={contract.id}>
                <TD>
                    <Link className="text-violet-600" href={`/contratos/${contract.id}`}>
                        {humanReadableDate}
                    </Link>
                </TD>
                <TD>{contract.office.name}</TD>
                <TD>{contract.currentHistory?.status}</TD>
                <TD>
                    <DataTableDropdown onRemove={() => handleRemove(contract.id)} />
                </TD>
            </TR>
        );
    };

    return renderer;
};

const Page = () => {
    const useContractsResult = useContracts();

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
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>Contratos</DashboardLayoutBigTitle>

                    <Button href="/contratos/add">+ Presupuestar contrato</Button>
                </div>
            }
        >
            <FetchedDataRenderer
                {...useContractsResult}
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
                            line1="Hubo un error al cargar los contratos."
                            line2="Prueba de nuevo más tarde."
                        />
                    </div>
                }
            >
                {({ rentalContracts }) => {
                    if (rentalContracts.length === 0) {
                        return (
                            <FetchStatusMessageWithButton
                                message="Aún no hay contratos"
                                btnHref="/contratos/add"
                                btnText="Agrega tu primer contrato"
                            />
                        );
                    }

                    return (
                        <div className="pr-container flex-1 py-5 pl-10">
                            <DataTable
                                columns={columns}
                                data={rentalContracts}
                                rowRenderer={RowRenderer(handleRemove)}
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
