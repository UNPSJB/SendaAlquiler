'use client';

import { useMutation } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';

import { ContractByIdQuery, ContractHistoryStatusChoices } from '@/api/graphql';

import { ContractStatusEditorFormValues } from './page';

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
    contract: NonNullable<ContractByIdQuery['contractById']>;
};

export const ContractStatusEditor = ({ contract }: Props) => {
    const formMethods = useFormContext<ContractStatusEditorFormValues>();
    const statusToCompletedMutation = useMutation({});
    const statusToCanceledMutation = useMutation({});

    const onSubmit = (data: ContractStatusEditorFormValues) => {
        if (!contract) return;

        if (data.status?.value === ContractHistoryStatusChoices.Completed) {
            statusToCompletedMutation.mutate(
                {
                    id: contract.id,
                    note: data.note || null,
                    items: contract.orderItems.map((orderItem) => ({
                        id: orderItem.id,
                        quantityReceived:
                            data.ordersById![orderItem.id]!.quantityReceived!,
                    })),
                },
                {
                    onSuccess: (data) => {
                        if (!data.receiveContract || data.receiveContract?.error) {
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

        if (data.status?.value === ContractHistoryStatusChoices.Canceled) {
            statusToCanceledMutation.mutate(
                {
                    id: contract.id,
                    note: data.note || null,
                },
                {
                    onSuccess: (data) => {
                        if (!data.cancelContract || data.cancelContract?.error) {
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
                            options={[
                                {
                                    label: 'Activo',
                                    value: ContractHistoryStatusChoices.Activo,
                                },
                                {
                                    label: 'Cancelado',
                                    value: ContractHistoryStatusChoices.Cancelado,
                                },
                                {
                                    label: 'Con depósito',
                                    value: ContractHistoryStatusChoices.ConDeposito,
                                },
                                {
                                    label: 'Devolución exitosa',
                                    value: ContractHistoryStatusChoices.DevolucionExitosa,
                                },
                                {
                                    label: 'Devolución fallida',
                                    value: ContractHistoryStatusChoices.DevolucionFallida,
                                },
                                {
                                    label: 'Finalizado',
                                    value: ContractHistoryStatusChoices.Finalizado,
                                },
                                {
                                    label: 'Pagado',
                                    value: ContractHistoryStatusChoices.Pagado,
                                },
                                {
                                    label: 'Presupuestado',
                                    value: ContractHistoryStatusChoices.Presupuestado,
                                },
                                {
                                    label: 'Vencido',
                                    value: ContractHistoryStatusChoices.Vencido,
                                },
                            ]}
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
