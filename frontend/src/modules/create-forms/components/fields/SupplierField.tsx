import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import { Supplier } from '@/api/graphql';
import { useAllSuppliers } from '@/api/hooks';

import { CustomSelect } from '@/modules/forms/Select';

export type SupplierFieldValue = {
    label: string;
    value: Supplier['id'];
};

type Props<TFieldValues extends FieldValues, TName extends Path<TFieldValues>> = {
    name: TName;
    control: Control<TFieldValues>;
    placeholder: string;
} & (TFieldValues[Extract<keyof TFieldValues, TName>] extends SupplierFieldValue
    ? object
    : never);

const RHFSupplierField = <
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>,
>({
    name,
    control,
    placeholder,
}: Props<TFieldValues, TName>) => {
    const { data, isLoading } = useAllSuppliers();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => (
                <CustomSelect
                    isClearable
                    isLoading={isLoading}
                    options={
                        (data ? data.allSuppliers : []).map((supplier) => {
                            return {
                                label: supplier.name,
                                value: supplier.id,
                            } as SupplierFieldValue;
                        }) as any
                    }
                    placeholder={placeholder}
                    value={value}
                    onChange={(val) => {
                        if (val) {
                            onChange(val);
                        } else {
                            onChange(null);
                        }
                    }}
                />
            )}
        />
    );
};

export default RHFSupplierField;
