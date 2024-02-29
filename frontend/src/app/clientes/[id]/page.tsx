'use client';

import { useParams } from 'next/navigation';

import { useState } from 'react';

import { ClientByIdQuery } from '@/api/graphql';
import { useClientById } from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import Tabs from '@/modules/details-page/Tabs';
import ChevronRight from '@/modules/icons/ChevronRight';

import ClientByIdContractsTab from './Contracts';
import ClientByIdDetailsTab from './Details';
import ClientByIdSalesTab from './Sales';

import Avatar from '@/components/Avatar';
import DeprecatedButton from '@/components/Button';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import Spinner from '@/components/Spinner/Spinner';

const getAvatarText = (firstName: string, lastName: string) => {
    return (firstName[0] + lastName[0]).toUpperCase();
};

const getDasboardTitle = (client: ClientByIdQuery['clientById'] | undefined) => {
    if (!client) {
        return <DashboardLayoutBigTitle>Clientes</DashboardLayoutBigTitle>;
    }

    return (
        <div className="flex items-center space-x-4">
            <DashboardLayoutBigTitle>Clientes</DashboardLayoutBigTitle>
            <ChevronRight />
            <span className="font-headings text-sm">
                {client.firstName} {client.lastName}
            </span>
        </div>
    );
};

export type ClientByIdTabComponentProps = {
    client: NonNullable<ClientByIdQuery['clientById']>;
};

export type ContractsByClientIdTabComponentProps = {
    id: string;
};

export type SalesByClientIdTabComponentProps = {
    id: string;
};

const tabs = [
    {
        label: 'Detalles',
        key: 'details',
        Component: ClientByIdDetailsTab,
    },
    {
        label: 'Compras',
        key: 'sales',
        Component: ClientByIdSalesTab,
    },
    {
        label: 'Contratos',
        key: 'contracts',
        Component: ClientByIdContractsTab,
    },
];

const Page = () => {
    const { id } = useParams();
    const useClientByIdResult = useClientById(id as string);

    const [activeTab, setActiveTab] = useState(tabs[0].key);

    const client = useClientByIdResult.data?.clientById;
    const Component = tabs.find((tab) => tab.key === activeTab)!.Component;

    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    {getDasboardTitle(client)}

                    <DeprecatedButton href={`/clientes/${id}/edit`}>
                        Editar cliente
                    </DeprecatedButton>
                </div>
            }
        >
            <FetchedDataRenderer
                {...useClientByIdResult}
                Loading={
                    <div className="flex w-full flex-1 items-center justify-center">
                        <Spinner />
                    </div>
                }
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
                {({ clientById: client }) => {
                    if (!client) {
                        return (
                            <div className="flex w-full flex-1 items-center justify-center">
                                <FetchStatusMessageWithButton
                                    message="Parece que el cliente que buscas no existe."
                                    btnHref="/clientes"
                                    btnText='Volver a "Clientes"'
                                />
                            </div>
                        );
                    }

                    return (
                        <div className="flex  flex-1 flex-col">
                            <header className="border-b pl-8">
                                <div className="mb-10 flex items-center">
                                    <Avatar>
                                        {getAvatarText(client.firstName, client.lastName)}
                                    </Avatar>
                                    <div className="pl-6">
                                        <h1 className="my-2 mt-10 text-xl font-bold">
                                            {client.firstName} {client.lastName}
                                        </h1>
                                        <p>{client.email}</p>
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
                                <section className="pl-8 ">
                                    <Component client={client} id={id as string} />
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
