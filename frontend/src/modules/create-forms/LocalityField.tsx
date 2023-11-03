import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Props as ReactSelectProps } from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { CreateLocalityMutation, Locality } from '@/api/graphql';
import { useLocalities } from '@/api/hooks';

import CreateLocalityForm from '@/modules/create-forms/CreateLocalityForm';

import ModalWithBox from './ModalWithBox';

type LocalityOptionProps = {
    locality: Pick<Locality, 'id' | 'name' | 'postalCode' | 'state'>;
};

const LocalityOption: React.FC<LocalityOptionProps> = ({ locality }) => (
    <div>
        <span className="block font-bold">{locality.name}</span>
        <div className="flex justify-between text-gray-500">
            <p>
                <span>Provincia:</span> <span>{locality.state}</span>
            </p>
            <p>
                <span>Código Postal:</span> <span>{locality.postalCode}</span>
            </p>
        </div>
    </div>
);

type LocalitiesSelectOption = {
    label: React.ReactNode;
    value: Locality['id'];
    data: LocalityOptionProps['locality'];
};

const removeAccents = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const customFilter: ReactSelectProps<
    | LocalitiesSelectOption
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

    const { name, postalCode, state } = option.data.data;
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

const LocalityField: React.FC = () => {
    const { control: contextControl, setValue: setContextValue } = useFormContext();
    const { data, isLoading } = useLocalities();

    const [localityToCreate, setLocalityToCreate] = useState<string | null>(null);

    const onCreateOption = (inputValue: string) => {
        setLocalityToCreate(inputValue);
    };

    const onCancelModalCreation = () => {
        setLocalityToCreate(null);
    };

    const onLocalityCreation = (
        locality: NonNullable<
            NonNullable<CreateLocalityMutation['createLocality']>['locality']
        >,
    ) => {
        setContextValue('localityId', {
            label: locality.name,
            value: locality.id,
        });
        setLocalityToCreate(null);
    };

    return (
        <>
            <Controller
                name="localityId"
                control={contextControl}
                render={({ field: { onChange, value } }) => (
                    <CreatableSelect
                        classNamePrefix="react-select"
                        isDisabled={!!localityToCreate}
                        isLoading={!!localityToCreate || isLoading}
                        options={(data ? data.localities : []).map((locality) => {
                            return {
                                label: <LocalityOption locality={locality} />,
                                value: locality.id,
                                data: locality,
                            } as LocalitiesSelectOption;
                        })}
                        filterOption={customFilter}
                        placeholder="Selecciona una localidad"
                        formatCreateLabel={(input) => {
                            return (
                                <span className="font-headings">
                                    Crea la localidad <b>&quot;{input}&quot;</b>
                                </span>
                            );
                        }}
                        formatOptionLabel={(val) => {
                            if ('data' in val) {
                                return <LocalityOption locality={val.data} />;
                            }

                            return <span>{val.label}</span>;
                        }}
                        onCreateOption={onCreateOption}
                        value={value}
                        onChange={(val) => {
                            // if (val && 'data' in val) {
                            onChange({
                                value: val.value,
                                label: val.data.name,
                            });
                            // } else {
                            //     onChange(null);
                            // }
                        }}
                    />
                )}
            />

            <ModalWithBox
                show={!!localityToCreate}
                onCancel={onCancelModalCreation}
                closeOnOutsideClick
            >
                <CreateLocalityForm
                    onSuccess={onLocalityCreation}
                    onCancel={onCancelModalCreation}
                    defaultValues={{
                        name: localityToCreate || undefined,
                    }}
                />
            </ModalWithBox>
        </>
    );
};

export default LocalityField;
