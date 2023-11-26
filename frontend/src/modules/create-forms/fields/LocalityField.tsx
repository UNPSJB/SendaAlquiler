import { useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Props as ReactSelectProps } from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { CreateLocalityMutation, Locality } from '@/api/graphql';
import { useAllLocalities } from '@/api/hooks';

import CreateLocalityForm from '@/modules/create-forms/CreateLocalityForm';

import ModalWithBox from '../ModalWithBox';

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

type LocalityFieldSelectOption = {
    label: React.ReactNode;
    value: Locality['id'];
    data: LocalityOptionProps['locality'];
};

const removeAccents = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const customFilter: ReactSelectProps<
    | LocalityFieldSelectOption
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

export type LocalityFieldValue = {
    value: Locality['id'];
    label: Locality['name'];
    data: LocalityOptionProps['locality'];
};

// Define a custom SetValue type that allows setting a LocalityFieldValue
type CustomSetValue<
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>,
> = (name: TName, value: LocalityFieldValue) => void;

type RHFProps<TFieldValues extends FieldValues, TName extends Path<TFieldValues>> = {
    name: TName;
    control: Control<TFieldValues>;
    setValue: CustomSetValue<TFieldValues, TName>;
} & (TFieldValues[Extract<keyof TFieldValues, TName>] extends LocalityFieldValue
    ? object
    : never);

const LocalityField = <
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>,
>(
    props: RHFProps<TFieldValues, TName>,
) => {
    const { name, control, setValue } = props;
    const { data, isLoading } = useAllLocalities();

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
        const nextValue: LocalityFieldValue = {
            label: locality.name,
            value: locality.id,
            data: locality,
        };

        setValue(name, nextValue);
        setLocalityToCreate(null);
    };

    const getOptions = (): LocalityFieldValue[] => {
        if (!data) {
            return [];
        }

        return data.allLocalities.map((locality) => ({
            label: locality.name,
            value: locality.id,
            data: locality,
        }));
    };

    return (
        <>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value, ref, onBlur, disabled } }) => {
                    return (
                        <CreatableSelect<
                            | LocalityFieldValue
                            | {
                                  __isNew__: boolean;
                                  label: string;
                                  value: string;
                              }
                        >
                            ref={ref}
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            name={name}
                            classNamePrefix="react-select"
                            isDisabled={!!localityToCreate || disabled}
                            isLoading={!!localityToCreate || isLoading}
                            options={getOptions()}
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
                        />
                    );
                }}
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
