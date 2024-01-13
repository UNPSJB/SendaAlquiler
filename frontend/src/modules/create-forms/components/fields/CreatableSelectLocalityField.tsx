import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Props as ReactSelectProps } from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { Locality } from '@/api/graphql';
import { useAllLocalities, useCreateLocality } from '@/api/hooks';

import CreateOrUpdateLocalityForm, {
    CreateOrUpdateLocalityFormValues,
} from '@/modules/create-forms/CreateOrUpdateLocalityForm';

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

type RHFProps = {
    onChange: (value: LocalityFieldValue | null) => void;
    disabled?: boolean;
};

const CreatableSelectLocalityField = ({ disabled, onChange, ...props }: RHFProps) => {
    const { data, isLoading } = useAllLocalities();

    const [localityToCreate, setLocalityToCreate] = useState<string | null>(null);

    const onCreateOption = (inputValue: string) => {
        setLocalityToCreate(inputValue);
    };

    const onCancelModalCreation = () => {
        setLocalityToCreate(null);
    };

    const { mutate, isLoading: isCreating } = useCreateLocality({
        onSuccess: ({ createLocality }) => {
            const error = createLocality?.error;
            const locality = createLocality?.locality;

            if (error) {
                toast.error(error);
            }

            if (locality) {
                const nextValue: LocalityFieldValue = {
                    label: locality.name,
                    value: locality.id,
                    data: locality,
                };

                onChange(nextValue);
                setLocalityToCreate(null);
            }
        },
        onError: () => {
            toast.error('No se pudo crear la localidad');
        },
    });

    const onSubmit: SubmitHandler<CreateOrUpdateLocalityFormValues> = ({
        name,
        state,
        ...data
    }) => {
        mutate({
            name,
            state: state.value,
            ...data,
        });
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
            <CreatableSelect
                {...props}
                onChange={(value) => {
                    if (value) {
                        onChange(value as LocalityFieldValue);
                    } else {
                        onChange(null);
                    }
                }}
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

            <ModalWithBox
                show={!!localityToCreate}
                onCancel={onCancelModalCreation}
                closeOnOutsideClick
            >
                <CreateOrUpdateLocalityForm
                    mutate={onSubmit}
                    isMutating={isCreating}
                    onCancel={onCancelModalCreation}
                    defaultValues={{
                        name: localityToCreate || undefined,
                    }}
                />
            </ModalWithBox>
        </>
    );
};

export default CreatableSelectLocalityField;
