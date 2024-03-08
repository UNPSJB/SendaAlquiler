'use client';

import { useParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { ContractByIdQuery, ContractHistoryStatusChoices } from '@/api/graphql';
import { useContractById } from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import ChevronRight from '@/modules/icons/ChevronRight';

import { ContractDetails } from './contract-details';
import { ContractHistorEntriesTracker } from './contract-history-entries-tracker';
import { ContractStatusEditor } from './contract-status-editor';

import ButtonWithSpinner from '@/components/ButtonWithSpinner';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import { DashboardLayoutContentLoading } from '@/components/page-loading';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

type HeaderProps = {
    contract: ContractByIdQuery['contractById'] | undefined;
};

const Header = ({ contract }: HeaderProps) => {
    const printPDFMutation = useMutation({
        mutationFn: async (contractId: string) => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/api/download-contract-pdf/${contractId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/pdf',
                    },
                },
            );

            if (!response.ok) {
                throw new Error('Error al descargar el PDF');
            }

            const blob = await response.blob();

            // Create a new object URL for the blob
            const url = window.URL.createObjectURL(blob);

            // Create a link and programmatically click it to download the file
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'file.pdf');
            document.body.appendChild(link);
            link.click();

            // Remove the link when done
            document.body.removeChild(link);
        },
        onError: () => {
            toast.error('Error al descargar el PDF');
        },
    });

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

            <ButtonWithSpinner
                onClick={() => {
                    printPDFMutation.mutate(contract.id);
                }}
                showSpinner={printPDFMutation.isPending}
            >
                Imprimir PDF
            </ButtonWithSpinner>
        </div>
    );
};

export type ContractByIdTabComponentProps = {
    contract: NonNullable<ContractByIdQuery['contractById']>;
};

export type ContractStatusEditorFormValues = Partial<{
    status: {
        value: ContractHistoryStatusChoices | 'DEVOLUCION';
        label: string;
    };
    note: string;
    ordersById: Partial<Record<string, { quantityReceived: number | null }>>;
    cashPayment: number | null;
    cashPaymentIsCorrect: boolean;
}>;

const Page = () => {
    const { id } = useParams();
    const useContractByIdResult = useContractById(id as string);

    const contract = useContractByIdResult.data?.contractById;

    const formMethods = useForm<ContractStatusEditorFormValues>({
        defaultValues: {
            ordersById: {},
        },
    });

    return (
        <DashboardLayout header={<Header contract={contract} />}>
            <FetchedDataRenderer
                {...useContractByIdResult}
                Loading={<DashboardLayoutContentLoading />}
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
                                        {![
                                            ContractHistoryStatusChoices.DevolucionExitosa,
                                            ContractHistoryStatusChoices.DevolucionFallida,
                                            ContractHistoryStatusChoices.Cancelado,
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
