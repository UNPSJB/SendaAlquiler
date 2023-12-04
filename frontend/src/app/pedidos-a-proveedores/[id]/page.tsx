'use client';

import { useParams } from 'next/navigation';

import { useState } from 'react';
import toast from 'react-hot-toast';

import {
    CoreSupplierOrderHistoryModelStatusChoices,
    SupplierOrderByIdQuery,
} from '@/api/graphql';
import { useReceiveOrderSupplierOrder, useSupplierOrderById } from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import Tabs from '@/modules/details-page/Tabs';
import ChevronRight from '@/modules/icons/ChevronRight';

import { useOfficeContext } from '@/app/OfficeProvider';

import SupplierOrderByIddDetailsTab from './Details';
import SupplierOrderByIdProductsTab from './Products';

import Avatar from '@/components/Avatar';
import ButtonWithSpinner from '@/components/ButtonWithSpinner';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import Spinner from '@/components/Spinner/Spinner';

const getAvatarText = (firstName: string) => {
    return firstName[0].toUpperCase();
};

const useDashboardTitle = (
    supplierOrder: SupplierOrderByIdQuery['supplierOrderById'] | undefined,
) => {
    const { office } = useOfficeContext();
    const { mutate, isLoading } = useReceiveOrderSupplierOrder();

    if (!supplierOrder) {
        return <DashboardLayoutBigTitle>Pedidos a Proveedores</DashboardLayoutBigTitle>;
    }

    return (
        <div className="flex justify-between">
            <div className="flex items-center space-x-4">
                <DashboardLayoutBigTitle>Pedidos a Proveedores</DashboardLayoutBigTitle>
                <ChevronRight />
                <span className="font-headings text-sm">Pedido #{supplierOrder.id}</span>
            </div>

            {supplierOrder.currentHistory?.status ===
                CoreSupplierOrderHistoryModelStatusChoices.Pending &&
                supplierOrder.officeDestination.id === office && (
                    <ButtonWithSpinner
                        isLoading={isLoading}
                        onClick={() => {
                            mutate(supplierOrder.id, {
                                onSuccess: () => {
                                    toast.success('Pedido completado');
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
        </div>
    );
};

export type SupplierOrderByIdTabComponentProps = {
    supplierOrder: NonNullable<SupplierOrderByIdQuery['supplierOrderById']>;
};

const tabs = [
    {
        label: 'Detalles',
        key: 'details',
        Component: SupplierOrderByIddDetailsTab,
    },
    {
        label: 'Productos',
        key: 'products',
        Component: SupplierOrderByIdProductsTab,
    },
];

const Page = () => {
    const { id } = useParams();
    const useSupplierOrderByIdResult = useSupplierOrderById(id as string);

    const [activeTab, setActiveTab] = useState(tabs[0].key);

    const supplierOrder = useSupplierOrderByIdResult.data?.supplierOrderById;
    const Component = tabs.find((tab) => tab.key === activeTab)!.Component;

    return (
        <DashboardLayout header={useDashboardTitle(supplierOrder)}>
            <FetchedDataRenderer
                {...useSupplierOrderByIdResult}
                Loading={
                    <div className="flex w-full flex-1 items-center justify-center">
                        <Spinner />
                    </div>
                }
                Error={
                    <div className="flex w-full flex-1 items-center justify-center">
                        <FetchStatusMessageWithDescription
                            title="Ha ocurrido un error"
                            line1="Hubo un error al cargar el pedidos."
                            line2="Prueba de nuevo más tarde."
                        />
                    </div>
                }
            >
                {({ supplierOrderById: supplierOrder }) => {
                    if (!supplierOrder) {
                        return (
                            <div className="flex w-full flex-1 items-center justify-center">
                                <FetchStatusMessageWithButton
                                    message="Parece que el pedido que buscas no existe."
                                    btnHref="/pedidos-a-proveedores"
                                    btnText='Volver a "Pedido a Proveedores"'
                                />
                            </div>
                        );
                    }

                    return (
                        <div className="flex flex-1 flex-col">
                            <header className="border-b pl-10">
                                <div className="mb-10 flex items-center">
                                    <Avatar>
                                        {getAvatarText(supplierOrder.supplier.name)}
                                    </Avatar>
                                    <div className="pl-6">
                                        <h1 className="my-2 mt-10 text-xl font-bold">
                                            {supplierOrder.supplier.name}
                                        </h1>
                                        <p>{supplierOrder.supplier.email}</p>
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
                                    <Component supplierOrder={supplierOrder} />
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
