'use client';

import { useParams } from 'next/navigation';

import { useState } from 'react';

import { InternalOrderByIdQuery } from '@/api/graphql';
import { useInternalOrderById } from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import Tabs from '@/modules/details-page/Tabs';
import ChevronRight from '@/modules/icons/ChevronRight';

import InternalOrderByIddDetailsTab from './Details';
import InternalOrderByIdProductsTab from './Products';

import Avatar from '@/components/Avatar';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import Spinner from '@/components/Spinner/Spinner';

const getAvatarText = (firstName: string) => {
    return firstName[0].toUpperCase();
};

const getDashboardTitle = (
    internalOrder: InternalOrderByIdQuery['internalOrderById'] | undefined,
) => {
    if (!internalOrder) {
        return <DashboardLayoutBigTitle>Pedidos Internos</DashboardLayoutBigTitle>;
    }

    return (
        <div className="flex items-center space-x-4">
            <DashboardLayoutBigTitle>Pedidos Internos</DashboardLayoutBigTitle>
            <ChevronRight />
            <span className="font-headings text-sm">Pedido #{internalOrder.id}</span>
        </div>
    );
};

export type InternalOrderByIdTabComponentProps = {
    internalOrder: NonNullable<InternalOrderByIdQuery['internalOrderById']>;
};

const tabs = [
    {
        label: 'Detalles',
        key: 'details',
        Component: InternalOrderByIddDetailsTab,
    },
    {
        label: 'Productos',
        key: 'products',
        Component: InternalOrderByIdProductsTab,
    },
];

const Page = () => {
    const { id } = useParams();
    const useInternalOrderByIdResult = useInternalOrderById(id as string);

    const [activeTab, setActiveTab] = useState(tabs[0].key);

    const internalOrder = useInternalOrderByIdResult.data?.internalOrderById;
    const Component = tabs.find((tab) => tab.key === activeTab)!.Component;

    return (
        <DashboardLayout header={getDashboardTitle(internalOrder)}>
            <FetchedDataRenderer
                {...useInternalOrderByIdResult}
                Loading={
                    <div className="flex w-full flex-1 items-center justify-center">
                        <Spinner />
                    </div>
                }
                Error={
                    <div className="flex w-full flex-1 items-center justify-center">
                        <FetchStatusMessageWithDescription
                            title="Ha ocurrido un error"
                            line1="Hubo un error al cargar el pedido."
                            line2="Prueba de nuevo más tarde."
                        />
                    </div>
                }
            >
                {({ internalOrderById: internalOrder }) => {
                    if (!internalOrder) {
                        return (
                            <div className="flex w-full flex-1 items-center justify-center">
                                <FetchStatusMessageWithButton
                                    message="Parece que el pedido que buscas no existe."
                                    btnHref="/pedidos-internos"
                                    btnText='Volver a "Pedido Internos"'
                                />
                            </div>
                        );
                    }

                    return (
                        <div className="flex flex-1 flex-col">
                            <header className="border-b pl-10">
                                <div className="mb-10 flex items-center">
                                    <Avatar>
                                        {getAvatarText(internalOrder.officeBranch.name)}
                                    </Avatar>
                                    <div className="pl-6">
                                        <h1 className="my-2 mt-10 text-xl font-bold">
                                            {internalOrder.officeBranch.name}
                                        </h1>
                                        <p>
                                            {internalOrder.officeBranch.street}{' '}
                                            {internalOrder.officeBranch.houseNumber}
                                        </p>
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

                            <div className="flex-1 bg-gray-100 px-0">
                                <section className="pl-10">
                                    <Component internalOrder={internalOrder} />
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
