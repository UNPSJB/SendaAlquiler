'use client';

import { useParams } from 'next/navigation';

import { useState } from 'react';
import toast from 'react-hot-toast';

import { InternalOrderByIdQuery, InternalOrderHistoryStatusChoices } from '@/api/graphql';
import {
    useInternalOrderById,
    useSetInternalOrderAsCompleted,
    useSetInternalOrderAsInProgress,
} from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import Tabs from '@/modules/details-page/Tabs';
import ChevronRight from '@/modules/icons/ChevronRight';

import { useOfficeContext } from '@/app/OfficeProvider';

import InternalOrderByIddDetailsTab from './Details';
import InternalOrderByIdProductsTab from './Products';

import Avatar from '@/components/Avatar';
import ButtonWithSpinner from '@/components/ButtonWithSpinner';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import Spinner from '@/components/Spinner/Spinner';

const getAvatarText = (firstName: string) => {
    return firstName[0].toUpperCase();
};

const useHeader = (
    internalOrder: InternalOrderByIdQuery['internalOrderById'] | undefined,
) => {
    const { office } = useOfficeContext();
    const { mutate: markAsInProgress, isLoading: isMarkAsInProgressLoading } =
        useSetInternalOrderAsInProgress();
    const { mutate: markAsCompleted, isLoading: isMarkAsCompletedLoading } =
        useSetInternalOrderAsCompleted();

    if (!internalOrder) {
        return <DashboardLayoutBigTitle>Pedidos Internos</DashboardLayoutBigTitle>;
    }

    return (
        <div className="flex justify-between">
            <div className="flex items-center space-x-4">
                <DashboardLayoutBigTitle>Pedidos Internos</DashboardLayoutBigTitle>
                <ChevronRight />
                <span className="font-headings text-sm">Pedido #{internalOrder.id}</span>
            </div>

            {internalOrder.latestHistoryEntry?.status ===
                InternalOrderHistoryStatusChoices.Pending &&
                internalOrder.sourceOffice.id === office?.id && (
                    <ButtonWithSpinner
                        showSpinner={isMarkAsInProgressLoading}
                        onClick={() => {
                            markAsInProgress(internalOrder.id, {
                                onSuccess: () => {
                                    toast.success('Pedido en progreso');
                                },
                                onError: () => {
                                    toast.error('Ha ocurrido un error');
                                },
                            });
                        }}
                    >
                        Pasar pedido a en progreso
                    </ButtonWithSpinner>
                )}

            {internalOrder.latestHistoryEntry?.status ===
                InternalOrderHistoryStatusChoices.InProgress &&
                internalOrder.targetOffice.id === office?.id && (
                    <ButtonWithSpinner
                        showSpinner={isMarkAsCompletedLoading}
                        onClick={() => {
                            markAsCompleted(internalOrder.id, {
                                onSuccess: () => {
                                    toast.success('Pedido completado');
                                },
                                onError: () => {
                                    toast.error('Ha ocurrido un error');
                                },
                            });
                        }}
                    >
                        Pasar pedido a completado
                    </ButtonWithSpinner>
                )}
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

    const header = useHeader(internalOrder);

    return (
        <DashboardLayout header={header}>
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
                            <header className="border-b pl-8">
                                <div className="mb-10 flex items-center">
                                    <Avatar>
                                        {getAvatarText(internalOrder.sourceOffice.name)}
                                    </Avatar>
                                    <div className="pl-6">
                                        <h1 className="my-2 mt-10 text-xl font-bold">
                                            {internalOrder.sourceOffice.name}
                                        </h1>
                                        <p>
                                            {internalOrder.sourceOffice.street}{' '}
                                            {internalOrder.sourceOffice.houseNumber}
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

                            <div className="flex-1 bg-gray-100">
                                <section className="px-8">
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
