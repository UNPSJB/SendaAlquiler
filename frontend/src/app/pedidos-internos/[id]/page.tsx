'use client';

import { useParams } from 'next/navigation';

import { useForm } from 'react-hook-form';

import { InternalOrderByIdQuery, InternalOrderHistoryStatusChoices } from '@/api/graphql';
import { useInternalOrderById } from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import ChevronRight from '@/modules/icons/ChevronRight';

import { InternalOrderDetails } from './internal-order-details';
import { InternalOrderHistorEntriesTracker } from './internal-order-history-entries-tracker';
import { InternalOrderSourceAndTarget } from './internal-order-source-and-target';
import { InternalOrderStatusEditor } from './internal-order-status-editor';

import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import Spinner from '@/components/Spinner/Spinner';
import { Form } from '@/components/ui/form';

const useHeader = (
    internalOrder: InternalOrderByIdQuery['internalOrderById'] | undefined,
) => {
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
        </div>
    );
};

export type InternalOrderByIdTabComponentProps = {
    internalOrder: NonNullable<InternalOrderByIdQuery['internalOrderById']>;
};

export type InternalOrderStatusEditorFormValues = Partial<{
    status: {
        value: InternalOrderHistoryStatusChoices;
        label: string;
    };
    note: string;
    ordersById: Partial<
        Record<string, { quantityReceived: number | null; quantitySent: number | null }>
    >;
}>;

const Page = () => {
    const { id } = useParams();
    const useInternalOrderByIdResult = useInternalOrderById(id as string);

    const internalOrder = useInternalOrderByIdResult.data?.internalOrderById;

    const header = useHeader(internalOrder);

    const formMethods = useForm<InternalOrderStatusEditorFormValues>({
        defaultValues: {
            ordersById: {},
        },
    });

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
                        <Form {...formMethods}>
                            <div className="flex-1 bg-muted pb-8">
                                <section className="pr-container grid grid-cols-12 gap-4 pl-8 pt-8">
                                    <div className="col-span-9">
                                        <InternalOrderDetails
                                            internalOrder={internalOrder}
                                        />
                                    </div>

                                    <div className="col-span-3 flex flex-col space-y-4">
                                        {[
                                            InternalOrderHistoryStatusChoices.InProgress,
                                            InternalOrderHistoryStatusChoices.Pending,
                                        ].includes(
                                            internalOrder.latestHistoryEntry!.status!,
                                        ) && (
                                            <InternalOrderStatusEditor
                                                internalOrder={internalOrder}
                                            />
                                        )}

                                        <InternalOrderSourceAndTarget
                                            internalOrder={internalOrder}
                                        />

                                        <InternalOrderHistorEntriesTracker
                                            internalOrder={internalOrder}
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
