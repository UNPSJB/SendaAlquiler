'use client';

import { useParams } from 'next/navigation';

import { useForm } from 'react-hook-form';

import { SupplierOrderByIdQuery, SupplierOrderHistoryStatusChoices } from '@/api/graphql';
import { useSupplierOrderById } from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import ChevronRight from '@/modules/icons/ChevronRight';

import { SupplierOrderDetails } from './supplier-order-details';
import { SupplierOrderHistorEntriesTracker } from './supplier-order-history-entries-tracker';
import { SupplierOrderSourceAndTarget } from './supplier-order-source-and-target';
import { SupplierOrderStatusEditor } from './supplier-order-status-editor';

import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import { DashboardLayoutContentLoading } from '@/components/page-loading';
import { Form } from '@/components/ui/form';

const useHeader = (
    supplierOrder: SupplierOrderByIdQuery['supplierOrderById'] | undefined,
) => {
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
        </div>
    );
};

export type SupplierOrderByIdTabComponentProps = {
    supplierOrder: NonNullable<SupplierOrderByIdQuery['supplierOrderById']>;
};

export type SupplierOrderStatusEditorFormValues = Partial<{
    status: {
        value: SupplierOrderHistoryStatusChoices;
        label: string;
    };
    note: string;
    ordersById: Partial<
        Record<string, { quantityReceived: number | null; quantitySent: number | null }>
    >;
}>;

const Page = () => {
    const { id } = useParams();
    const useSupplierOrderByIdResult = useSupplierOrderById(id as string);

    const supplierOrder = useSupplierOrderByIdResult.data?.supplierOrderById;

    const header = useHeader(supplierOrder);

    const formMethods = useForm<SupplierOrderStatusEditorFormValues>({
        defaultValues: {
            ordersById: {},
        },
    });

    return (
        <DashboardLayout header={header}>
            <FetchedDataRenderer
                {...useSupplierOrderByIdResult}
                Loading={<DashboardLayoutContentLoading />}
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
                {({ supplierOrderById: supplierOrder }) => {
                    if (!supplierOrder) {
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
                                        <SupplierOrderDetails
                                            supplierOrder={supplierOrder}
                                        />
                                    </div>

                                    <div className="col-span-3 flex flex-col space-y-4">
                                        {[
                                            SupplierOrderHistoryStatusChoices.InProgress,
                                            SupplierOrderHistoryStatusChoices.Pending,
                                        ].includes(
                                            supplierOrder.latestHistoryEntry!.status!,
                                        ) && (
                                            <SupplierOrderStatusEditor
                                                supplierOrder={supplierOrder}
                                            />
                                        )}

                                        <SupplierOrderSourceAndTarget
                                            supplierOrder={supplierOrder}
                                        />

                                        <SupplierOrderHistorEntriesTracker
                                            supplierOrder={supplierOrder}
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
