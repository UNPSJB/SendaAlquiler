import { Controller, useFormContext } from 'react-hook-form';
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

const BrandField: React.FC = () => {
    const { control: contextControl, setValue: setContextValue } = useFormContext();
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

                    setContextValue('brandId', {
                        label: brand.name,
                        value: brand.id,
                    });
                },
            },
        );
    };

    return (
        <Controller
            name="brandId"
            control={contextControl}
            render={({ field: { onChange, value } }) => (
                <CreatableSelect
                    classNamePrefix="react-select"
                    isDisabled={!!creating}
                    isLoading={!!creating || isLoading}
                    options={(data ? data.brands : []).map((brand) => {
                        return {
                            label: brand.name,
                            value: brand.id,
                        } as BrandSelectOption;
                    })}
                    filterOption={customFilter}
                    placeholder="Selecciona una localidad"
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
