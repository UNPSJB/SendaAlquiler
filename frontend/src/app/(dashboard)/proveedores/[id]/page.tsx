'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useState } from 'react';

import { SupplierByIdQuery } from '@/api/graphql';
import { useSupplierById } from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import Tabs from '@/modules/details-page/Tabs';
import ChevronRight from '@/modules/icons/ChevronRight';

import SupplierByIdDetailsTab from './Details';
import SupplierByIdOrdersTab from './Orders';

import Avatar from '@/components/Avatar';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import { DashboardLayoutContentLoading } from '@/components/page-loading';
import { Button } from '@/components/ui/button';

const getAvatarText = (firstName: string) => {
    return firstName[0].toUpperCase();
};

const getDasboardTitle = (
    supplier: SupplierByIdQuery['supplierById'] | undefined,
    id: string,
) => {
    if (!supplier) {
        return <DashboardLayoutBigTitle>Proveedores</DashboardLayoutBigTitle>;
    }

    return (
        <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
                <DashboardLayoutBigTitle>Proveedores</DashboardLayoutBigTitle>
                <ChevronRight />
                <span className="font-headings text-sm">{supplier.name}</span>
            </div>

            <Button asChild>
                <Link href={`/proveedores/${id}/edit`}>Editar</Link>
            </Button>
        </div>
    );
};

export type SupplierByIdTabComponentProps = {
    supplier: NonNullable<SupplierByIdQuery['supplierById']>;
};

export type SupplierOrderBySupplierIdTabComponentProps = {
    id: string;
};

const tabs = [
    {
        label: 'Detalles',
        key: 'details',
        Component: SupplierByIdDetailsTab,
    },
    {
        label: 'Pedidos realizados',
        key: 'contracts',
        Component: SupplierByIdOrdersTab,
    },
];

const Page = () => {
    const { id } = useParams();
    const useSupplierByIdResult = useSupplierById(id as string);

    const [activeTab, setActiveTab] = useState(tabs[0].key);

    const supplier = useSupplierByIdResult.data?.supplierById;
    const Component = tabs.find((tab) => tab.key === activeTab)!.Component;

    return (
        <DashboardLayout header={getDasboardTitle(supplier, id as string)}>
            <FetchedDataRenderer
                {...useSupplierByIdResult}
                Loading={<DashboardLayoutContentLoading />}
                Error={
                    <div className="flex w-full flex-1 items-center justify-center">
                        <FetchStatusMessageWithDescription
                            title="Ha ocurrido un error"
                            line1="Hubo un error al cargar al cliente."
                            line2="Prueba de nuevo más tarde."
                        />
                    </div>
                }
            >
                {({ supplierById: supplier }) => {
                    if (!supplier) {
                        return (
                            <div className="flex w-full flex-1 items-center justify-center">
                                <FetchStatusMessageWithButton
                                    message="Parece que el proveedor que buscas no existe."
                                    btnHref="/proveedor"
                                    btnText='Volver a "Proveedores"'
                                />
                            </div>
                        );
                    }

                    return (
                        <div className="flex  flex-1 flex-col">
                            <header className="border-b pl-8">
                                <div className="mb-10 flex items-center">
                                    <Avatar>{getAvatarText(supplier.name)}</Avatar>
                                    <div className="pl-6">
                                        <h1 className="my-2 mt-10 text-xl font-bold">
                                            {supplier.name}
                                        </h1>
                                        <p>{supplier.email}</p>
                                    </div>
                                </div>

                                <Tabs
                                    tabs={tabs.map((tab) => {
                                        return {
                                            ...tab,
                                            isActive: tab.key === activeTab,
                                            onClick: setActiveTab,
                                        };
                                    })}
                                />
                            </header>

                            <div className="flex flex-1 bg-gray-100">
                                <section className="pr-container flex w-full flex-1 flex-col pl-8">
                                    <Component id={id as string} supplier={supplier} />
                                </section>
                            </div>
                        </div>
                    );
                }}
            </FetchedDataRenderer>
        </DashboardLayout>
    );
};

export default Page;
