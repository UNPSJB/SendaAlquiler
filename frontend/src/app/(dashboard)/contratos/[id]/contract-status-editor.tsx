'use client';

import { CellContext, ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';

import {
    ContractByIdQuery,
    ContractHistoryStatusChoices,
    ContractItemDevolutionInput,
} from '@/api/graphql';
import { useChangeContractStatus } from '@/api/hooks';

import { ContractStatusEditorFormValues } from './page';

import { BaseTable } from '@/components/base-table';
import ButtonWithSpinner from '@/components/ButtonWithSpinner';
import { ComboboxSimple } from '@/components/combobox';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { formatNumberAsPrice, inputToNumber } from '@/lib/utils';

type Props = {
    contract: NonNullable<ContractByIdQuery['contractById']>;
};

const getStatusOptions = (
    currentStatus: ContractHistoryStatusChoices,
): {
    label: string;
    value: ContractHistoryStatusChoices | 'DEVOLUCION';
}[] => {
    if (
        currentStatus === ContractHistoryStatusChoices.DevolucionExitosa ||
        currentStatus === ContractHistoryStatusChoices.DevolucionFallida
    ) {
        return [
            {
                label: 'Con depósito',
                value: ContractHistoryStatusChoices.ConDeposito,
            },
            {
                label: 'Pagado',
                value: ContractHistoryStatusChoices.Pagado,
            },
            {
                label: 'Cancelado',
                value: ContractHistoryStatusChoices.Cancelado,
            },
        ];
    }

    if (currentStatus === ContractHistoryStatusChoices.Presupuestado) {
        return [
            {
                label: 'Con depósito',
                value: ContractHistoryStatusChoices.ConDeposito,
            },
            {
                label: 'Pagado',
                value: ContractHistoryStatusChoices.Pagado,
            },
            {
                label: 'Cancelado',
                value: ContractHistoryStatusChoices.Cancelado,
            },
        ];
    }

    if (currentStatus === ContractHistoryStatusChoices.ConDeposito) {
        return [
            {
                label: 'Pagado',
                value: ContractHistoryStatusChoices.Pagado,
            },
            {
                label: 'Activo',
                value: ContractHistoryStatusChoices.Activo,
            },
            {
                label: 'Cancelado',
                value: ContractHistoryStatusChoices.Cancelado,
            },
        ];
    }

    if (currentStatus === ContractHistoryStatusChoices.Pagado) {
        return [
            {
                label: 'Activo',
                value: ContractHistoryStatusChoices.Activo,
            },
            {
                label: 'Cancelado',
                value: ContractHistoryStatusChoices.Cancelado,
            },
        ];
    }

    if (currentStatus === ContractHistoryStatusChoices.Activo) {
        return [
            {
                label: 'Finalizado',
                value: ContractHistoryStatusChoices.Finalizado,
            },
        ];
    }

    if (currentStatus === ContractHistoryStatusChoices.Finalizado) {
        return [
            {
                label: 'Devolución',
                value: 'DEVOLUCION',
            },
        ];
    }

    return [];
};

type QuantityReceivedColumnProps = {
    cell: CellContext<Item, any>;
};

const QuantityReceivedColumn = ({ cell }: QuantityReceivedColumnProps) => {
    const formMethods = useFormContext<ContractStatusEditorFormValues>();
    const max = cell.row.original.quantity;

    return (
        <div>
            <FormField
                name={`ordersById.${cell.row.original.id}.quantityReceived`}
                control={formMethods.control}
                rules={{
                    required: 'Este campo es requerido',
                    max: {
                        value: max,
                        message: `La cantidad recibida no puede ser mayor a ${max}`,
                    },
                }}
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input
                                {...field}
                                onChange={(e) => {
                                    field.onChange(
                                        inputToNumber(e.target.value, {
                                            min: 0,
                                            max,
                                        }),
                                    );
                                }}
                                value={field.value ?? ''}
                            />
                        </FormControl>

                        <div className="flex space-x-4">
                            <FormMessage className="flex-1" />

                            <button
                                className="ml-auto rounded-md border border-primary px-3 py-1.5 text-sm text-primary"
                                onClick={() => field.onChange(max)}
                            >
                                Llenar
                            </button>
                        </div>
                    </FormItem>
                )}
            />
        </div>
    );
};

type Item = Props['contract']['contractItems'][0];
const devolutionColumnsHelper = createColumnHelper<Item>();
const devolutionColumns: ColumnDef<Item, any>[] = [
    devolutionColumnsHelper.accessor('product.name', {
        header: 'Descripción',
        cell: (cell) => {
            const value = cell.getValue();
            return (
                <div>
                    <p className="font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground">
                        {cell.row.original.product.brand?.name || 'Sin marca'}
                    </p>
                </div>
            );
        },
        size: 225,
    }),
    devolutionColumnsHelper.accessor('quantity', {
        header: 'Cantidad',
    }),
    devolutionColumnsHelper.display({
        id: 'quantityReturned',
        header: 'Cantidad devuelta',
        cell: (cell) => {
            return <QuantityReceivedColumn cell={cell} />;
        },
    }),
];

export const ContractStatusEditor = ({ contract }: Props) => {
    const formMethods = useFormContext<ContractStatusEditorFormValues>();
    const changeStatusMutation = useChangeContractStatus();
    const watchedStatus = formMethods.watch('status');
    const { setValue } = formMethods;
    const [openDevolutionDialog, setOpenDevolutionDialog] = useState(false);

    const onSubmit = (data: ContractStatusEditorFormValues) => {
        if (!contract || !data.status?.value) {
            return;
        }

        changeStatusMutation.mutate(
            {
                id: contract.id,
                note: data.note || null,
                status: data.status.value,
                cashPayment: data.cashPayment || null,
                devolutions: contract.contractItems.map((item) => {
                    const next: ContractItemDevolutionInput = {
                        itemId: item.id,
                        quantity: data.ordersById![item.id]?.quantityReceived || 0,
                    };

                    return next;
                }),
            },
            {
                onSuccess: (data) => {
                    if (data.changeContractStatus?.contract) {
                        toast.success('Estado actualizado');
                        setOpenDevolutionDialog(false);
                        formMethods.reset();
                    }

                    if (data.changeContractStatus?.error) {
                        toast.error(data.changeContractStatus?.error);
                    }
                },
                onError: () => {
                    toast.error('Error al actualizar el estado');
                },
            },
        );
    };

    useEffect(() => {
        if (watchedStatus?.value === ContractHistoryStatusChoices.Pagado) {
            setValue('cashPayment', contract.total - contract.firstDepositAmount);
        }
    }, [watchedStatus?.value, contract.total, contract.firstDepositAmount, setValue]);

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
                            options={getStatusOptions(
                                contract.latestHistoryEntry!.status,
                            )}
                            onChange={field.onChange}
                            value={field.value || null}
                        />

                        <FormMessage />
                    </FormItem>
                )}
            />

            {ContractHistoryStatusChoices.ConDeposito === watchedStatus?.value && (
                <FormField
                    name="cashPayment"
                    control={formMethods.control}
                    rules={{
                        required: 'Este campo es requerido',
                    }}
                    render={({ field }) => (
                        <FormItem className="flex flex-col space-y-2">
                            <FormLabel required>Monto del Depósito</FormLabel>

                            <FormControl>
                                <Input
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(
                                            inputToNumber(e.target.value, {
                                                min: 0,
                                                max: contract.total,
                                            }),
                                        );
                                    }}
                                    value={
                                        typeof field.value === 'number'
                                            ? formatNumberAsPrice(field.value)
                                            : ''
                                    }
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            {ContractHistoryStatusChoices.Pagado === watchedStatus?.value && (
                <>
                    <FormField
                        name="cashPayment"
                        control={formMethods.control}
                        rules={{
                            required: 'Este campo es requerido',
                        }}
                        render={({ field }) => {
                            const correctValue =
                                contract.total - contract.firstDepositAmount;

                            return (
                                <FormItem className="flex flex-col space-y-2">
                                    <FormLabel required>Monto del Pago</FormLabel>

                                    <FormControl>
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(
                                                    inputToNumber(e.target.value, {
                                                        min: correctValue,
                                                        max: correctValue,
                                                    }),
                                                );
                                            }}
                                            value={
                                                typeof field.value === 'number'
                                                    ? formatNumberAsPrice(field.value)
                                                    : ''
                                            }
                                            readOnly
                                            disabled
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    <FormField
                        name="cashPaymentIsCorrect"
                        control={formMethods.control}
                        rules={{
                            required: 'Debes confirmar que el monto es correcto',
                            validate: (value) => {
                                if (value !== true) {
                                    return 'Debes confirmar que el monto es correcto';
                                }

                                return true;
                            },
                        }}
                        render={({ field }) => (
                            <FormItem className="flex flex-col space-y-2">
                                <FormLabel required>
                                    Confirmo que he recibido{' '}
                                    <b>
                                        $
                                        {formatNumberAsPrice(
                                            contract.total - contract.firstDepositAmount,
                                        )}
                                    </b>
                                </FormLabel>

                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </>
            )}

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

            {'DEVOLUCION' === watchedStatus?.value ? (
                <Dialog
                    open={openDevolutionDialog}
                    onOpenChange={(next) => {
                        if (changeStatusMutation.isPending) {
                            return;
                        }

                        setOpenDevolutionDialog(next);
                    }}
                >
                    <DialogTrigger asChild>
                        <Button className="w-full" onClick={() => {}}>
                            Detallar cambios
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="w-8/12 max-w-full">
                        <DialogHeader>
                            <DialogTitle>Detallar devolución</DialogTitle>
                            <DialogDescription>
                                Aquí debes detallar la cantidad de elementos que has
                                recibido de vuelta.
                            </DialogDescription>
                        </DialogHeader>

                        <BaseTable
                            columns={devolutionColumns}
                            data={contract.contractItems}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    Cancelar
                                </Button>
                            </DialogClose>

                            <ButtonWithSpinner
                                showSpinner={changeStatusMutation.isPending}
                                type="submit"
                                onClick={formMethods.handleSubmit(onSubmit)}
                            >
                                Guardar y enviar devolución
                            </ButtonWithSpinner>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            ) : (
                <ButtonWithSpinner
                    className="w-full"
                    showSpinner={changeStatusMutation.isPending}
                    type="submit"
                    onClick={formMethods.handleSubmit(onSubmit)}
                >
                    Guardar
                </ButtonWithSpinner>
            )}
        </div>
    );
};
