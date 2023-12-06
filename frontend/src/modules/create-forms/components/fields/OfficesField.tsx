import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Props as ReactSelectProps } from 'react-select';

import { Office, OfficesQuery } from '@/api/graphql';
import { useOffices } from '@/api/hooks';

import { CustomSelect } from '@/modules/forms/Select';

type OfficeOptionProps = {
    office: OfficesQuery['offices'][0];
};

const OfficeOption: React.FC<OfficeOptionProps> = ({ office }) => (
    <div>
        <span className="block font-bold">{office.name}</span>
        <div className="flex justify-between text-gray-500">
            <p>
                <span>Provincia:</span> <span>{office.locality.state}</span>
            </p>
            <p>
                <span>Código Postal:</span> <span>{office.locality.postalCode}</span>
            </p>
        </div>
    </div>
);

type OfficesSelectOption =
    | {
          label: React.ReactNode;
          value: Office['id'];
          data: OfficeOptionProps['office'];
      }
    | {
          __isNew__: boolean;
          label: string;
          value: string;
      };

const removeAccents = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const customFilter: ReactSelectProps<
    | OfficesSelectOption
    | {
          __isNew__: boolean;
          label: string;
          value: string;
      },
    false
>['filterOption'] = (option, searchText: string) => {
    if ('__isNew__' in option) {
        return true;
    }

    if (!('data' in option.data)) {
        return true;
    }

    const {
        name,
        locality: { postalCode, state },
    } = option.data.data;
    const searchTextNoAccents = removeAccents(searchText);

    const nameNoAccents = removeAccents(name);
    const postalCodeNoAccents = removeAccents(postalCode);
    const stateNoAccents = removeAccents(state);

    const searchRegex = new RegExp(searchTextNoAccents, 'i');

    if (
        searchRegex.test(nameNoAccents) ||
        searchRegex.test(postalCodeNoAccents) ||
        searchRegex.test(stateNoAccents)
    ) {
        return true;
    } else {
        return false;
    }
};

export type OfficesFieldValue = {
    label: string;
    value: Office['id'];
    data: OfficeOptionProps['office'];
};

type Props<
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>,
    TIsMulti extends boolean = false,
> = Omit<
    ReactSelectProps<OfficesSelectOption, TIsMulti>,
    | 'options'
    | 'name'
    | 'placeholder'
    | 'filterOption'
    | 'formatOptionLabel'
    | 'value'
    | 'onChange'
    | 'isLoading'
> & {
    name: TName;
    control: Control<TFieldValues>;
    placeholder: string;
    officeToExclude: Office['id'] | undefined;
} & (TIsMulti extends true
        ? TFieldValues[Extract<keyof TFieldValues, TName>] extends OfficesFieldValue[]
            ? object
            : never
        : TFieldValues[Extract<keyof TFieldValues, TName>] extends OfficesFieldValue
          ? object
          : never);

const RHFOfficesField = <
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>,
    TIsMulti extends boolean = false,
>({
    name,
    control,
    placeholder,
    officeToExclude,
    ...props
}: Props<TFieldValues, TName, TIsMulti>) => {
    const { data, isLoading } = useOffices();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => {
                console.log(data);
                console.log(value);

                return (
                    <CustomSelect<OfficesSelectOption, TIsMulti>
                        isLoading={isLoading}
                        options={(data ? data.offices : [])
                            .filter((office) => {
                                return office.id !== officeToExclude;
                            })
                            .map((office) => {
                                return {
                                    label: office.name,
                                    value: office.id,
                                    data: office,
                                };
                            })}
                        filterOption={customFilter}
                        placeholder={placeholder}
                        formatOptionLabel={(val) => {
                            if ('data' in val) {
                                return <OfficeOption office={val.data} />;
                            }

                            return <span>{val.label}</span>;
                        }}
                        value={value}
                        onChange={onChange}
                        isClearable
                        {...props}
                    />
                );
            }}
        />
    );
};

export default RHFOfficesField;
