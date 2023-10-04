import Link from 'next/link';

import {
    Controller,
    FormProvider,
    SubmitHandler,
    useForm,
    useFormContext,
} from 'react-hook-form';
import toast from 'react-hot-toast';
import { Props as ReactSelectProps } from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { CreateLocalityMutationVariables, Locality, StateChoices } from '@/api/graphql';
import { useCreateLocality, useLocalities } from '@/api/hooks';

import { RHFFormField } from '@/modules/forms/FormField';
import Input from '@/modules/forms/Input';
import RHFSelect from '@/modules/forms/Select';

import ModalWithBox from './modal-with-box';
import NavigationButtons from './NavigationButtons';

import { STATES_OPTIONS } from '@/constants';

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

type CreateLocalityFormValues = Omit<
    CreateLocalityMutationVariables,
    'state' | 'name'
> & {
    name: string | null;
    state: {
        label: string;
        value: StateChoices;
    };
};

const LocalityField: React.FC = () => {
    const { control: contextControl, setValue: setContextValue } = useFormContext();
    const { data } = useLocalities();

    const useFormMethods = useForm<CreateLocalityFormValues>();
    const {
        handleSubmit,
        register,
        formState: { errors },
        control: modalControl,
        watch,
        setValue,
    } = useFormMethods;

    const { mutate } = useCreateLocality({
        onSuccess: ({ createLocality }) => {
            const error = createLocality?.error;
            const locality = createLocality?.locality;

            if (error) {
                toast.error(error);
            }

            if (locality) {
                setContextValue('localityId', {
                    label: locality.name,
                    value: locality.id,
                });
                setValue('name', null);
            }
        },
    });

    const onSubmit: SubmitHandler<CreateLocalityFormValues> = ({
        name,
        state,
        ...data
    }) => {
        if (name) {
            mutate({
                name,
                state: state.value,
                ...data,
            });
        }
    };

    const handleCreate = (inputValue: string) => {
        setValue('name', inputValue);
    };

    const localityToCreate = watch('name');

    return (
        <>
            <Controller
                name="localityId"
                control={contextControl}
                render={({ field: { onChange, value } }) => (
                    <CreatableSelect
                        classNamePrefix="react-select"
                        isDisabled={!!localityToCreate}
                        isLoading={!!localityToCreate}
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
                        onCreateOption={handleCreate}
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

            <ModalWithBox
                show={!!localityToCreate}
                onCancel={() => {
                    watch('name', null);
                }}
                closeOnOutsideClick
            >
                <main className="flex min-h-screen items-center justify-center bg-gray-100 py-14 text-black">
                    <div className="container flex flex-1">
                        <div className="w-3/12 rounded-l-xl bg-gray-300 pl-8 pt-6">
                            <Link
                                href="/"
                                className="block font-headings text-3xl font-black tracking-widest text-gray-700"
                            >
                                SENDA
                            </Link>
                        </div>

                        <div className="flex w-9/12 flex-col rounded-r-xl bg-white px-14 pt-6">
                            <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
                                <h1 className="text-2xl font-bold">Crea una localidad</h1>
                            </div>

                            <div className="mb-20 w-9/12">
                                <FormProvider {...useFormMethods}>
                                    <form className="space-y-4">
                                        <RHFFormField
                                            fieldID="name"
                                            label="Nombre"
                                            showRequired
                                        >
                                            <Input
                                                id="name"
                                                hasError={!!errors.name}
                                                {...register('name', {
                                                    required: true,
                                                })}
                                            />
                                        </RHFFormField>

                                        <RHFFormField
                                            fieldID="postalCode"
                                            label="Código Postal"
                                            showRequired
                                        >
                                            <Input
                                                id="postalCode"
                                                hasError={!!errors.postalCode}
                                                {...register('postalCode', {
                                                    required: true,
                                                })}
                                            />
                                        </RHFFormField>

                                        <RHFFormField
                                            fieldID="state"
                                            label="Provincia"
                                            showRequired
                                        >
                                            <RHFSelect<CreateLocalityFormValues>
                                                id="state"
                                                name="state"
                                                control={modalControl}
                                                options={STATES_OPTIONS}
                                                placeholder="Selecciona una provincia"
                                                rules={{
                                                    required: true,
                                                }}
                                            />
                                        </RHFFormField>
                                    </form>
                                </FormProvider>
                            </div>

                            <NavigationButtons
                                isUniqueStep
                                onCancel={() => {
                                    setValue('name', null);
                                }}
                                onSubmit={handleSubmit(onSubmit)}
                            />
                        </div>
                    </div>
                </main>
            </ModalWithBox>
        </>
    );
};

export default LocalityField;
