import { Trash } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { useOffices } from '@/api/hooks';

import { ProductFormEditorValues } from './product-form-editor';

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
import { formatNumberWithThousandsSeparator, inputToNumber } from '@/lib/utils';

export const ProductFormEditorStocks = () => {
    const formMethods = useFormContext<ProductFormEditorValues>();

    const stocksFieldArray = useFieldArray({
        name: 'stocks',
        control: formMethods.control,
    });

    const officesQuery = useOffices();

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold">Stock</h2>

            {stocksFieldArray.fields.map((stock, index) => {
                return (
                    <div className="flex space-x-4" key={stock.id}>
                        <div className="flex flex-1 space-x-4">
                            <FormField
                                name={`stocks.${index}.office`}
                                control={formMethods.control}
                                rules={{
                                    required: 'La sucursal es requerida',
                                }}
                                render={({ field }) => (
                                    <FormItem className="flex w-1/2 flex-col">
                                        <FormLabel required>Sucursal</FormLabel>

                                        <FormControl>
                                            <ComboboxSimple
                                                placeholder="Selecciona una sucursal"
                                                options={(officesQuery.data
                                                    ? officesQuery.data.offices
                                                    : []
                                                )
                                                    .filter((office) => {
                                                        const isSelected =
                                                            stocksFieldArray.fields
                                                                .map(
                                                                    (field) =>
                                                                        field.office
                                                                            ?.value,
                                                                )
                                                                .includes(office.id);
                                                        const isSelectedInCurrentIndex =
                                                            stocksFieldArray.fields[index]
                                                                .office?.value ===
                                                            office.id;

                                                        return (
                                                            isSelectedInCurrentIndex ||
                                                            !isSelected
                                                        );
                                                    })
                                                    .map((office) => {
                                                        return {
                                                            label: office.name,
                                                            value: office.id,
                                                        };
                                                    })}
                                                onChange={(option) => {
                                                    field.onChange(option);
                                                }}
                                                value={field.value || null}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name={`stocks.${index}.quantity`}
                                control={formMethods.control}
                                rules={{
                                    required: 'El stock es requerido',
                                }}
                                render={({ field }) => (
                                    <FormItem className="flex w-1/2 flex-col">
                                        <FormLabel required>Stock</FormLabel>

                                        <FormControl>
                                            <Input
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(
                                                        inputToNumber(e.target.value, {
                                                            min: 0,
                                                            max: 1000000000,
                                                        }),
                                                    );
                                                }}
                                                value={
                                                    typeof field.value === 'number'
                                                        ? formatNumberWithThousandsSeparator(
                                                              field.value,
                                                          )
                                                        : ''
                                                }
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex pt-7">
                            <button
                                className="h-4 w-4"
                                type="button"
                                onClick={() => {
                                    if (stock.office) {
                                        formMethods.setValue('stockIdsToDelete', [
                                            ...(formMethods.getValues()
                                                .stockIdsToDelete || []),
                                            stock.office.value,
                                        ]);
                                    }

                                    stocksFieldArray.remove(index);
                                }}
                            >
                                <Trash className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                );
            })}

            <Button
                type="button"
                variant="outline"
                onClick={() => {
                    stocksFieldArray.append({
                        office: null,
                        quantity: null,
                    });
                }}
            >
                + Agregar stock
            </Button>
        </div>
    );
};
