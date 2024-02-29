import { Trash } from 'lucide-react';
import { UseFieldArrayReturn, useFormContext } from 'react-hook-form';

import { useProductStocksInDateRange } from '@/api/hooks';

import { ContractFormEditorValues } from './contract-form-editor';

import { ComboboxSimple } from '@/components/combobox';
import { Button } from '@/components/ui/button';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { dateToInputValue, inputToNumber } from '@/lib/utils';

type ContractFormEditorOrderItemAllocationProps = {
    product: NonNullable<NonNullable<ContractFormEditorValues['orders']>[0]['product']>;
    orderIndex: number;
    index: number;
    allocationsFieldArray: UseFieldArrayReturn<
        ContractFormEditorValues,
        `orders.${number}.allocations`,
        'id'
    >;
};

export const ContractFormEditorOrderItemAllocation = ({
    orderIndex,
    product,
    index,
    allocationsFieldArray,
}: ContractFormEditorOrderItemAllocationProps) => {
    const formMethods = useFormContext<ContractFormEditorValues>();

    const startDatetime = formMethods.watch('startDatetime');
    const endDatetime = formMethods.watch('endDatetime');

    const stocksQuery = useProductStocksInDateRange({
        productId: product.data.id,
        startDate: startDatetime ? dateToInputValue(startDatetime) : undefined,
        endDate: endDatetime ? dateToInputValue(endDatetime) : undefined,
    });

    const watchedField = formMethods.watch(`orders.${orderIndex}.allocations.${index}`);
    const office = watchedField.office;

    const watchedAllocations =
        formMethods.watch(`orders.${orderIndex}.allocations`) || [];
    const officesStocksNotSelectedYet =
        stocksQuery.data?.productStocksInDateRange?.filter((stock) => {
            return !watchedAllocations.some(
                (allocation) => allocation.office?.value === stock.office.id,
            );
        }) ?? [];

    const maxItemQuantity = office?.data.quantity ?? 0;

    return (
        <div className="space-y-2 rounded-lg bg-gray-100 p-4">
            <div className="flex items-center justify-between">
                <h3 className="font-bold italic">Sucursal #{index + 1}</h3>

                <Button
                    variant="outline"
                    onClick={() => {
                        allocationsFieldArray.remove(index);
                    }}
                >
                    <Trash className="h-4 w-4" />
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    name={`orders.${orderIndex}.allocations.${index}.office`}
                    control={formMethods.control}
                    rules={{ required: 'Este campo es requerido' }}
                    render={({ field }) => (
                        <FormItem className="flex flex-col space-y-2">
                            <FormLabel>Oficina</FormLabel>

                            <ComboboxSimple
                                options={[
                                    ...(field.value ? [field.value] : []),
                                    ...officesStocksNotSelectedYet.map((stock) => ({
                                        value: stock.office.id,
                                        label: `${stock.office.name} (${stock.quantity})`,
                                        data: stock,
                                    })),
                                ]}
                                onChange={(option) => {
                                    const quantity = watchedField.quantity;
                                    if (
                                        quantity &&
                                        option &&
                                        quantity > option.data.quantity
                                    ) {
                                        formMethods.setValue(
                                            `orders.${orderIndex}.allocations.${index}.quantity`,
                                            option.data.quantity,
                                        );
                                    }

                                    field.onChange(option);
                                }}
                                value={field.value || null}
                                placeholder="Selecciona una oficina"
                            />

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name={`orders.${orderIndex}.allocations.${index}.quantity`}
                    control={formMethods.control}
                    rules={{
                        validate: (val) => {
                            if (!val) {
                                return 'Este campo es requerido';
                            }

                            if (val > maxItemQuantity) {
                                return `La cantidad máxima es ${maxItemQuantity}`;
                            }

                            return true;
                        },
                    }}
                    render={({ field }) => (
                        <FormItem className="flex flex-col space-y-2">
                            <FormLabel>Cantidad</FormLabel>

                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value ?? ''}
                                    onChange={(e) => {
                                        const val = inputToNumber(e.target.value, {
                                            min: 0,
                                            max: maxItemQuantity,
                                        });

                                        field.onChange(val);
                                    }}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
};
