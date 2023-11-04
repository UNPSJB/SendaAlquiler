import { Controller, useFormContext } from 'react-hook-form';
import ReactSelect, { Props as ReactSelectProps } from 'react-select';

import { Office, OfficesQuery } from '@/api/graphql';
import { useOffices } from '@/api/hooks';

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

type OfficesSelectOption = {
    label: React.ReactNode;
    value: Office['id'];
    data: OfficeOptionProps['office'];
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

type Props = {
    name: string;
    placeholder: string;
    officeToExclude: Office['id'] | undefined;
};

const OfficesField: React.FC<Props> = ({ name, placeholder, officeToExclude }) => {
    const { control: contextControl } = useFormContext();
    const { data, isLoading } = useOffices();

    return (
        <Controller
            name={name}
            control={contextControl}
            render={({ field: { onChange, value } }) => (
                <ReactSelect
                    isClearable
                    isLoading={isLoading}
                    classNamePrefix="react-select"
                    options={(data ? data.offices : [])
                        .filter((office) => {
                            return office.id !== officeToExclude;
                        })
                        .map((office) => {
                            return {
                                label: <OfficeOption office={office} />,
                                value: office.id,
                                data: office,
                            } as OfficesSelectOption;
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
                    onChange={(val) => {
                        if (val && 'data' in val) {
                            onChange({
                                value: val.value,
                                label: val.data.name,
                            });
                        } else {
                            onChange(null);
                        }
                    }}
                />
            )}
        />
    );
};

export default OfficesField;
