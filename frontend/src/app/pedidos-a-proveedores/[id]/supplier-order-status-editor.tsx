'use client';

import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';

import { SupplierOrderByIdQuery, SupplierOrderHistoryStatusChoices } from '@/api/graphql';
import {
    useSetSupplierOrderAsCanceled,
    useSetSupplierOrderAsCompleted,
} from '@/api/hooks';

import { SupplierOrderStatusEditorFormValues } from './page';

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
    supplierOrder: NonNullable<SupplierOrderByIdQuery['supplierOrderById']>;
};

export const SupplierOrderStatusEditor = ({ supplierOrder }: Props) => {
    const formMethods = useFormContext<SupplierOrderStatusEditorFormValues>();
    const statusToCompletedMutation = useSetSupplierOrderAsCompleted();
    const statusToCanceledMutation = useSetSupplierOrderAsCanceled();

    const onSubmit = (data: SupplierOrderStatusEditorFormValues) => {
        if (!supplierOrder) return;

        if (data.status?.value === SupplierOrderHistoryStatusChoices.Completed) {
            statusToCompletedMutation.mutate(
                {
                    id: supplierOrder.id,
                    note: data.note || null,
                    items: supplierOrder.orderItems.map((orderItem) => ({
                        id: orderItem.id,
                        quantityReceived:
                            data.ordersById![orderItem.id]!.quantityReceived!,
                    })),
                },
                {
                    onSuccess: (data) => {
                        if (
                            !data.receiveSupplierOrder ||
                            data.receiveSupplierOrder?.error
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

        if (data.status?.value === SupplierOrderHistoryStatusChoices.Canceled) {
            statusToCanceledMutation.mutate(
                {
                    id: supplierOrder.id,
                    note: data.note || null,
                },
                {
                    onSuccess: (data) => {
                        if (
                            !data.cancelSupplierOrder ||
                            data.cancelSupplierOrder?.error
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
                                supplierOrder.latestHistoryEntry?.status ===
                                SupplierOrderHistoryStatusChoices.Pending
                                    ? [
                                          {
                                              value: SupplierOrderHistoryStatusChoices.Canceled,
                                              label: 'Cancelar',
                                          },
                                          {
                                              value: SupplierOrderHistoryStatusChoices.Completed,
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
