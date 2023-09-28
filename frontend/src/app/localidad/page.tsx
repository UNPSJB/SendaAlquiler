'use client'

import { PropsWithChildren, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import { Locality } from '@/api/graphql';
import { useLocalities} from '@/api/hooks';

import DashboardLayout from '@/modules/dashboard/DashboardLayout';

import Button, { ButtonVariant } from '@/components/Button';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import { TD, TH, TR, Table } from '@/components/Table';
import ViewError from '@/components/ViewError';

const LocalitySkeleton = () => {
    return (
        <TR>
            {[...new Array(6)].map((_, i) => (
                <TD key={i}>
                    <Skeleton width={100}></Skeleton>
                </TD>
            ))}
        </TR>
    );
};

const LocalitesTable = ({ children }: PropsWithChildren) => {
    return (
        <Table>
            <thead>
                <tr>
                    <TH>Nombre</TH>
                    <TH>Cod.Postal</TH>
                    <TH>Provincia</TH>
                    <TH></TH>
                </tr>
            </thead>
            <tbody>{children}</tbody>
        </Table>
    );
};

const Page = () => {
     const [activeLocalityId, setActiveLocalityId] = useState<Locality['id'] | null>(null);
     const useLocalitiesResult = useLocalities();


     return (
        <DashboardLayout title="Localidades">
            <div className="pr-container py-5 pl-10">
                <FetchedDataRenderer
                    {...useLocalitiesResult}
                    // isLoading
                    Loading={
                        <LocalitesTable>
                            <LocalitySkeleton />
                            <LocalitySkeleton />
                            <LocalitySkeleton />
                            <LocalitySkeleton />
                            <LocalitySkeleton />
                        </LocalitesTable>
                    }
                    Error={<ViewError />}
                >
                    {({ localities }) => {
                        return (
                            <LocalitesTable>
                                {localities.map((locality) => (
                                    <TR key={locality.id}>
                                        <TD>
                                            {locality.name} 
                                        </TD>
                                        <TD>{locality.postalCode}</TD>
                                        <TD>
                                            {locality.state}
                                        </TD>
                                        <TD>
                                        <button
                                                onClick={() => {
                                                    setActiveLocalityId((prev) => {
                                                        if (prev === locality.id) {
                                                            return null;
                                                        }

                                                        return locality.id;
                                                    });
                                                }}
                                            >
                                                <svg
                                                    className="pointer-events-none"
                                                    width="6"
                                                    height="24"
                                                    viewBox="0 0 6 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M3 16.875C2.30381 16.875 1.63613 17.1516 1.14384 17.6438C0.651562 18.1361 0.375 18.8038 0.375 19.5C0.375 20.1962 0.651562 20.8639 1.14384 21.3562C1.63613 21.8484 2.30381 22.125 3 22.125C3.69619 22.125 4.36387 21.8484 4.85616 21.3562C5.34844 20.8639 5.625 20.1962 5.625 19.5C5.625 18.8038 5.34844 18.1361 4.85616 17.6438C4.36387 17.1516 3.69619 16.875 3 16.875ZM3 9.375C2.30381 9.375 1.63613 9.65156 1.14384 10.1438C0.651562 10.6361 0.375 11.3038 0.375 12C0.375 12.6962 0.651562 13.3639 1.14384 13.8562C1.63613 14.3484 2.30381 14.625 3 14.625C3.69619 14.625 4.36387 14.3484 4.85616 13.8562C5.34844 13.3639 5.625 12.6962 5.625 12C5.625 11.3038 5.34844 10.6361 4.85616 10.1438C4.36387 9.65156 3.69619 9.375 3 9.375ZM5.625 4.5C5.625 3.80381 5.34844 3.13613 4.85616 2.64384C4.36387 2.15156 3.69619 1.875 3 1.875C2.30381 1.875 1.63613 2.15156 1.14384 2.64384C0.651562 3.13613 0.375 3.80381 0.375 4.5C0.375 5.19619 0.651562 5.86387 1.14384 6.35616C1.63613 6.84844 2.30381 7.125 3 7.125C3.69619 7.125 4.36387 6.84844 4.85616 6.35616C5.34844 5.86387 5.625 5.19619 5.625 4.5Z"
                                                        fill="black"
                                                        className=""
                                                    />
                                                </svg>
                                            </button>

                                            {activeLocalityId === locality.id && (
                                                <div className="relative">
                                                    <div className="absolute right-0 top-full -mt-1 overflow-hidden rounded border border-gray-300 bg-white shadow">
                                                        <ul className="divide-y divide-gray-200 text-sm">
                                                            <li>
                                                                <button
                                                                    onClick={() => {
                                                                        setActiveLocalityId(
                                                                            null,
                                                                        );
                                                                    }}
                                                                    className="px-6 py-2 font-headings font-bold first:rounded-t last:rounded-b"
                                                                >
                                                                    Eliminar
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}
                                        </TD>
                                    </TR>
                                ))}
                            </LocalitesTable>
                        );
                    }}
                </FetchedDataRenderer>

                <div className="flex justify-between pt-8">
                    <Button variant={ButtonVariant.OUTLINE_WHITE}>{'<-'} Anterior</Button>
                    <Button variant={ButtonVariant.OUTLINE_WHITE}>
                        Siguiente {'->'}
                    </Button>
                </div>
            </div>
        </DashboardLayout>
    );

};

export default Page;
