'use client';

import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';

import { InternalOrderByIdQuery, InternalOrderHistoryStatusChoices } from '@/api/graphql';
import {
    useSetInternalOrderAsCanceled,
    useSetInternalOrderAsCompleted,
    useSetInternalOrderAsInProgress,
} from '@/api/hooks';

import { useOfficeContext } from '@/app/OfficeProvider';

import { InternalOrderStatusEditorFormValues } from './page';

import ButtonWithSpinner from '@/components/ButtonWithSpinner';
import { ComboboxSimple } from '@/components/combobox';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    internalOrder: NonNullable<InternalOrderByIdQuery['internalOrderById']>;
};

export const InternalOrderStatusEditor = ({ internalOrder }: Props) => {
    const formMethods = useFormContext<InternalOrderStatusEditorFormValues>();
    const statusToInProgressMutation = useSetInternalOrderAsInProgress();
    const statusToCompletedMutation = useSetInternalOrderAsCompleted();
    const statusToCanceledMutation = useSetInternalOrderAsCanceled();

    const { office } = useOfficeContext();

    const onSubmit = (data: InternalOrderStatusEditorFormValues) => {
        if (!internalOrder) return;

        if (data.status?.value === InternalOrderHistoryStatusChoices.InProgress) {
            statusToInProgressMutation.mutate(
                {
                    id: internalOrder.id,
                    note: data.note || null,
                    items: internalOrder.orderItems.map((orderItem) => ({
                        id: orderItem.id,
                        quantitySent: data.ordersById![orderItem.id]!.quantitySent!,
                    })),
                },
                {
                    onSuccess: (data) => {
                        if (
                            !data.inProgressInternalOrder ||
                            data.inProgressInternalOrder?.error
                        ) {
                            toast.error(
                                'Hubo un error al actualizar el estado del pedido',
                            );
                            return;
                        }

                        formMethods.reset();
                    },
                    onError: () => {
                        toast.error('Hubo un error al actualizar el estado del pedido');
                    },
                },
            );
        }

        if (data.status?.value === InternalOrderHistoryStatusChoices.Completed) {
            statusToCompletedMutation.mutate(
                {
                    id: internalOrder.id,
                    note: data.note || null,
                    items: internalOrder.orderItems.map((orderItem) => ({
                        id: orderItem.id,
                        quantityReceived:
                            data.ordersById![orderItem.id]!.quantityReceived!,
                    })),
                },
                {
                    onSuccess: (data) => {
                        if (
                            !data.receiveInternalOrder ||
                            data.receiveInternalOrder?.error
                        ) {
                            toast.error(
                                'Hubo un error al actualizar el estado del pedido',
                            );
                            return;
                        }

                        formMethods.reset();
                    },
                    onError: () => {
                        toast.error('Hubo un error al actualizar el estado del pedido');
                    },
                },
            );
        }

        if (data.status?.value === InternalOrderHistoryStatusChoices.Canceled) {
            statusToCanceledMutation.mutate(
                {
                    id: internalOrder.id,
                    note: data.note || null,
                },
                {
                    onSuccess: (data) => {
                        if (
                            !data.cancelInternalOrder ||
                            data.cancelInternalOrder?.error
                        ) {
                            toast.error(
                                'Hubo un error al actualizar el estado del pedido',
                            );
                            return;
                        }

                        formMethods.reset();
                    },
                    onError: () => {
                        toast.error('Hubo un error al actualizar el estado del pedido');
                    },
                },
            );
        }
    };

    return (
        <div className="space-y-4 bg-white p-4">
            <h3 className="text-sm text-muted-foreground">Asignación de estado</h3>

            <FormField
                name="status"
                rules={{
                    required: 'Este campo es requerido',
                }}
                control={formMethods.control}
                render={({ field }) => (
                    <FormItem className="flex flex-col space-y-2">
                        <FormLabel required>Nuevo estado</FormLabel>

                        <ComboboxSimple
                            placeholder="Selecciona un estado"
                            options={
                                internalOrder.latestHistoryEntry?.status ===
                                InternalOrderHistoryStatusChoices.Pending
                                    ? [
                                          ...(office?.id === internalOrder.sourceOffice.id
                                              ? [
                                                    {
                                                        value: InternalOrderHistoryStatusChoices.InProgress,
                                                        label: 'En progreso',
                                                    },
                                                ]
                                              : []),
                                          {
                                              value: InternalOrderHistoryStatusChoices.Canceled,
                                              label: 'Cancelar',
                                          },
                                          ...((office?.id ===
                                              internalOrder.targetOffice.id && [
                                              {
                                                  value: InternalOrderHistoryStatusChoices.Completed,
                                                  label: 'Completar',
                                              },
                                          ]) ||
                                              []),
                                      ]
                                    : internalOrder.latestHistoryEntry?.status ===
                                            InternalOrderHistoryStatusChoices.InProgress &&
                                        office?.id === internalOrder.targetOffice.id
                                      ? [
                                            {
                                                value: InternalOrderHistoryStatusChoices.Completed,
                                                label: 'Completar',
                                            },
                                        ]
                                      : []
                            }
                            onChange={field.onChange}
                            value={field.value || null}
                        />

                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                name="note"
                control={formMethods.control}
                render={({ field }) => (
                    <FormItem className="flex flex-col space-y-2">
                        <FormLabel>Nota</FormLabel>

                        <FormControl>
                            <Textarea {...field} value={field.value || ''} />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />

            <ButtonWithSpinner
                className="w-full"
                showSpinner={
                    statusToInProgressMutation.isPending ||
                    statusToCompletedMutation.isPending ||
                    statusToCanceledMutation.isPending
                }
                type="submit"
                onClick={formMethods.handleSubmit(onSubmit)}
            >
                Guardar
            </ButtonWithSpinner>
        </div>
    );
};
