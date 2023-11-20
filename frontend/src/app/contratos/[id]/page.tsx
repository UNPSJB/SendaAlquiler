'use client';

import { useParams } from 'next/navigation';

import { useState } from 'react';

import { ContractByIdQuery } from '@/api/graphql';
import { useContractById } from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import Tabs from '@/modules/details-page/Tabs';
import ChevronRight from '@/modules/icons/ChevronRight';

import ContractsByIdDetailsTab from './Details';
import ContractsByIdProductsTab from './Products';

import Avatar from '@/components/Avatar';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import Spinner from '@/components/Spinner/Spinner';

const getAvatarText = (firstName: string, lastName: string) => {
    return (firstName[0] + lastName[0]).toUpperCase();
};

const getDashboardTitle = (contract: ContractByIdQuery['contractById'] | undefined) => {
    if (!contract) {
        return <DashboardLayoutBigTitle>Contratos</DashboardLayoutBigTitle>;
    }

    return (
        <div className="flex items-center space-x-4">
            <DashboardLayoutBigTitle>Contratos</DashboardLayoutBigTitle>
            <ChevronRight />
            <span className="font-headings text-sm">
                {contract.client.firstName} {contract.client.lastName}
            </span>
        </div>
    );
};

export type ContractByIdTabComponentProps = {
    contract: NonNullable<ContractByIdQuery['contractById']>;
};

const tabs = [
    {
        label: 'Detalles',
        key: 'details',
        Component: ContractsByIdDetailsTab,
    },
    {
        label: 'Compras',
        key: 'purchases',
        Component: ContractsByIdProductsTab,
    },
];

const Page = () => {
    const { id } = useParams();
    const useContractByIdResult = useContractById(id as string);

    const [activeTab, setActiveTab] = useState(tabs[0].key);

    const contract = useContractByIdResult.data?.contractById;
    const Component = tabs.find((tab) => tab.key === activeTab)!.Component;

    return (
        <DashboardLayout header={getDashboardTitle(contract)}>
            <FetchedDataRenderer
                {...useContractByIdResult}
                Loading={
                    <div className="flex w-full flex-1 items-center justify-center">
                        <Spinner />
                    </div>
                }
                Error={
                    <div className="flex w-full flex-1 items-center justify-center">
                        <FetchStatusMessageWithDescription
                            title="Ha ocurrido un error"
                            line1="Hubo un error al cargar el contrato."
                            line2="Prueba de nuevo más tarde."
                        />
                    </div>
                }
            >
                {({ contractById: contract }) => {
                    if (!contract) {
                        return (
                            <div className="flex w-full flex-1 items-center justify-center">
                                <FetchStatusMessageWithButton
                                    message="Parece que el contrato que buscas no existe."
                                    btnHref="/contrato"
                                    btnText='Volver a "Contratos"'
                                />
                            </div>
                        );
                    }

                    return (
                        <div className="flex  flex-1 flex-col">
                            <header className="border-b pl-10">
                                <div className="mb-10 flex items-center">
                                    <Avatar>
                                        {getAvatarText(
                                            contract.client.firstName,
                                            contract.client.lastName,
                                        )}
                                    </Avatar>
                                    <div className="pl-6">
                                        <h1 className="my-2 mt-10 text-xl font-bold">
                                            {contract.client.firstName}{' '}
                                            {contract.client.lastName}
                                        </h1>
                                        <p>{contract.client.email}</p>
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
                                <section className="pl-10 ">
                                    <Component contract={contract} />
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
