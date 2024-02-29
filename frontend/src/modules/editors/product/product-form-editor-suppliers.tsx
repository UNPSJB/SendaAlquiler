import { Trash } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { useAllSuppliers } from '@/api/hooks';

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
import { formatNumberAsPrice, inputToNumber } from '@/lib/utils';

const MAX_PRICE = 9999999999;

export const ProductFormEditorSuppliers = () => {
    const formMethods = useFormContext<ProductFormEditorValues>();

    const suppliersFieldArray = useFieldArray({
        name: 'suppliers',
        control: formMethods.control,
    });

    const suppliersQuery = useAllSuppliers();

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold">Proveedores</h2>

            {suppliersFieldArray.fields.map((supplier, index) => {
                return (
                    <div className="flex space-x-4" key={supplier.id}>
                        <div className="flex flex-1 space-x-4">
                            <FormField
                                name={`suppliers.${index}.supplier`}
                                control={formMethods.control}
                                rules={{
                                    required: 'El proveedor es requerido',
                                }}
                                render={({ field }) => (
                                    <FormItem className="flex w-1/2 flex-col">
                                        <FormLabel required>Proveedor</FormLabel>

                                        <FormControl>
                                            <ComboboxSimple
                                                placeholder="Selecciona un proveedor"
                                                options={(suppliersQuery.data
                                                    ? suppliersQuery.data.allSuppliers
                                                    : []
                                                )
                                                    .filter((supplier) => {
                                                        const isSelected =
                                                            suppliersFieldArray.fields
                                                                .map(
                                                                    (field) =>
                                                                        field.supplier
                                                                            ?.value,
                                                                )
                                                                .includes(supplier.id);
                                                        const isSelectedInCurrentIndex =
                                                            suppliersFieldArray.fields[
                                                                index
                                                            ].supplier?.value ===
                                                            supplier.id;

                                                        return (
                                                            isSelectedInCurrentIndex ||
                                                            !isSelected
                                                        );
                                                    })
                                                    .map((supplier) => {
                                                        return {
                                                            label: supplier.name,
                                                            value: supplier.id,
                                                        };
                                                    })}
                                                onChange={(option) => {
                                                    field.onChange(option);
                                                }}
                                                value={field.value || null}
                                                isDisabled={suppliersQuery.isLoading}
                                                isLoading={suppliersQuery.isLoading}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name={`suppliers.${index}.price`}
                                control={formMethods.control}
                                rules={{
                                    validate: (value) => {
                                        if (!value) {
                                            return 'El precio es requerido';
                                        }

                                        if (value < 0) {
                                            return 'El precio no puede ser negativo';
                                        }

                                        if (value > MAX_PRICE) {
                                            return 'El precio no puede ser mayor a 99.999.999,99';
                                        }

                                        return true;
                                    },
                                }}
                                render={({ field }) => {
                                    // last two digits are the cents
                                    const valueAsPrice = field.value
                                        ? formatNumberAsPrice(field.value)
                                        : '';

                                    return (
                                        <FormItem className="flex w-1/2 flex-col">
                                            <FormLabel required>Precio</FormLabel>

                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(
                                                            inputToNumber(
                                                                e.target.value,
                                                                {
                                                                    min: 0,
                                                                    max: MAX_PRICE,
                                                                },
                                                            ),
                                                        );
                                                    }}
                                                    value={valueAsPrice}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                        </div>

                        <div className="flex pt-7">
                            <button
                                className="h-4 w-4"
                                type="button"
                                onClick={() => {
                                    if (supplier.supplier) {
                                        formMethods.setValue('suppliersIdsToDelete', [
                                            ...(formMethods.getValues()
                                                .suppliersIdsToDelete || []),
                                            supplier.supplier.value,
                                        ]);
                                    }

                                    suppliersFieldArray.remove(index);
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
                    suppliersFieldArray.append({
                        supplier: null,
                        price: 0,
                    });
                }}
            >
                + Agregar proveedor
            </Button>
        </div>
    );
};
