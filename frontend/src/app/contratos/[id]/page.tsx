'use client';

import { useParams } from 'next/navigation';

import { useForm } from 'react-hook-form';

import { ContractByIdQuery, ContractHistoryStatusChoices } from '@/api/graphql';
import { useContractById } from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import ChevronRight from '@/modules/icons/ChevronRight';

import { ContractDetails } from './contract-details';
import { ContractHistorEntriesTracker } from './contract-history-entries-tracker';
import { ContractStatusEditor } from './contract-status-editor';

import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import Spinner from '@/components/Spinner/Spinner';
import { Form } from '@/components/ui/form';

const useHeader = (contract: ContractByIdQuery['contractById'] | undefined) => {
    if (!contract) {
        return <DashboardLayoutBigTitle>Contratos</DashboardLayoutBigTitle>;
    }

    return (
        <div className="flex justify-between">
            <div className="flex items-center space-x-4">
                <DashboardLayoutBigTitle>Contratos</DashboardLayoutBigTitle>
                <ChevronRight />
                <span className="font-headings text-sm">Contrato #{contract.id}</span>
            </div>
        </div>
    );
};

export type ContractByIdTabComponentProps = {
    contract: NonNullable<ContractByIdQuery['contractById']>;
};

export type ContractStatusEditorFormValues = Partial<{
    status: {
        value: ContractHistoryStatusChoices;
        label: string;
    };
    note: string;
    ordersById: Partial<
        Record<string, { quantityReceived: number | null; quantitySent: number | null }>
    >;
}>;

const Page = () => {
    const { id } = useParams();
    const useContractByIdResult = useContractById(id as string);

    const contract = useContractByIdResult.data?.contractById;

    const header = useHeader(contract);

    const formMethods = useForm<ContractStatusEditorFormValues>({
        defaultValues: {
            ordersById: {},
        },
    });

    return (
        <DashboardLayout header={header}>
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
                                    btnText='Volver a "Contrato"'
                                />
                            </div>
                        );
                    }

                    return (
                        <Form {...formMethods}>
                            <div className="flex-1 bg-muted pb-8">
                                <section className="pr-container grid grid-cols-12 gap-4 pl-8 pt-8">
                                    <div className="col-span-9 space-y-4">
                                        <ContractDetails contract={contract} />
                                    </div>

                                    <div className="col-span-3 flex flex-col space-y-4">
                                        {[
                                            ContractHistoryStatusChoices.Presupuestado,
                                            ContractHistoryStatusChoices.Finalizado,
                                        ].includes(
                                            contract.latestHistoryEntry!.status!,
                                        ) && <ContractStatusEditor contract={contract} />}

                                        <ContractHistorEntriesTracker
                                            contract={contract}
                                        />
                                    </div>
                                </section>
                            </div>
                        </Form>
                    );
                }}
            </FetchedDataRenderer>
        </DashboardLayout>
    );
};

export default Page;
