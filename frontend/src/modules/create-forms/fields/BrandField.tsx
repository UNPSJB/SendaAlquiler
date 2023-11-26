import { Control, Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import { Props as ReactSelectProps } from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { Brand } from '@/api/graphql';
import { useBrands, useCreateBrand } from '@/api/hooks';

type BrandSelectOption = {
    label: string;
    value: Brand['id'];
};

const removeAccents = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const customFilter: ReactSelectProps<
    | BrandSelectOption
    | {
          __isNew__: boolean;
          label: string;
          value: string;
      },
    false
>['filterOption'] = (option, searchText: string) => {
    if ('__isNew__' in option.data) {
        return true;
    }

    const searchTextNoAccents = removeAccents(searchText);
    const nameNoAccents = removeAccents(option.label);

    const searchRegex = new RegExp(searchTextNoAccents, 'i');

    return searchRegex.test(nameNoAccents);
};

export type BrandFieldValue = {
    label: string;
    value: Brand['id'];
};

type Props<TFieldValues extends FieldValues, TName extends Path<TFieldValues>> = {
    name: TName;
    control: Control<TFieldValues>;
    placeholder: string;
} & (TFieldValues[Extract<keyof TFieldValues, TName>] extends BrandFieldValue
    ? object
    : never);

const BrandField = <TFieldValues extends FieldValues, TName extends Path<TFieldValues>>({
    name,
    control,
    placeholder,
}: Props<TFieldValues, TName>) => {
    const { setValue: setContextValue } = useFormContext<TFieldValues>();
    const { data, isLoading } = useBrands();

    const { mutate, isLoading: creating } = useCreateBrand();

    const onCreateOption = (inputValue: string) => {
        mutate(
            {
                name: inputValue.trim(),
            },
            {
                onSuccess: (data) => {
                    const brand = data.createBrand?.brand;
                    if (!brand) return;

                    setContextValue<TName>(name, {
                        label: brand.name,
                        value: brand.id,
                    } as any);
                },
            },
        );
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => (
                <CreatableSelect<BrandSelectOption, false>
                    classNamePrefix="react-select"
                    isDisabled={!!creating}
                    isLoading={!!creating || isLoading}
                    options={(data ? data.brands : []).map((brand) => {
                        return {
                            label: brand.name,
                            value: brand.id,
                        };
                    })}
                    filterOption={customFilter}
                    placeholder={placeholder}
                    formatCreateLabel={(input) => {
                        return (
                            <span className="font-headings">
                                Crea la marca <b>&quot;{input}&quot;</b>
                            </span>
                        );
                    }}
                    onCreateOption={onCreateOption}
                    value={value}
                    onChange={(val) => {
                        if (!val) return;

                        onChange({
                            value: val.value,
                            label: val.label,
                        });
                    }}
                />
            )}
        />
    );
};

export default BrandField;
