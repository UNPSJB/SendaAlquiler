import { useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import toast from 'react-hot-toast';
import CreatableSelect from 'react-select/creatable';

import { AllClientsQuery, Client } from '@/api/graphql';
import { useAllClients, useCreateClient } from '@/api/hooks';

import CreateOrUpdateClientForm from '../../CreateOrUpdateClientForm';
import ModalWithBox from '../ModalWithBox';

type ClientOptionProps = {
    client: AllClientsQuery['allClients'][0];
};

const LocalityOption: React.FC<ClientOptionProps> = ({ client }) => (
    <span>
        {client.firstName} {client.lastName}
    </span>
);

export type ClientFieldValue = {
    value: Client['id'];
    label: string;
    data: ClientOptionProps['client'];
};

// Define a custom SetValue type that allows setting a LocalityFieldValue
type CustomSetValue<
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>,
> = (name: TName, value: ClientFieldValue) => void;

type RHFProps<TFieldValues extends FieldValues, TName extends Path<TFieldValues>> = {
    name: TName;
    control: Control<TFieldValues>;
    setValue: CustomSetValue<TFieldValues, TName>;
} & (TFieldValues[Extract<keyof TFieldValues, TName>] extends ClientFieldValue
    ? object
    : never);

const ClientField = <TFieldValues extends FieldValues, TName extends Path<TFieldValues>>(
    props: RHFProps<TFieldValues, TName>,
) => {
    const { name, control, setValue } = props;
    const { data, isLoading } = useAllClients();

    const [clientToCreate, setClientToCreate] = useState<string | null>(null);

    const onCreateOption = (inputValue: string) => {
        setClientToCreate(inputValue);
    };

    const onCancelModalCreation = () => {
        setClientToCreate(null);
    };

    const { mutate: createClient, isLoading: createIsLoading } = useCreateClient({
        onSuccess: (data) => {
            const error = data.createClient?.error;
            const client = data.createClient?.client;
            if (error) {
                toast.error(error);
            }

            if (client) {
                toast.success('Cliente creado exitosamente');

                const nextValue: ClientFieldValue = {
                    label: client.firstName + ' ' + client.lastName,
                    value: client.id,
                    data: client,
                };

                setValue(name, nextValue);
                setClientToCreate(null);
            }
        },
        onError: () => {
            toast.error('No se pudo crear el cliente');
        },
    });

    const getOptions = (): ClientFieldValue[] => {
        if (!data) {
            return [];
        }

        return data.allClients.map((client) => ({
            label: client.firstName + ' ' + client.lastName,
            value: client.id,
            data: client,
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
                            | ClientFieldValue
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
                            isDisabled={!!clientToCreate || disabled}
                            isLoading={!!clientToCreate || isLoading}
                            options={getOptions()}
                            placeholder="Selecciona una localidad"
                            formatCreateLabel={(input) => {
                                return (
                                    <span className="font-headings">
                                        Crea el cliente <b>&quot;{input}&quot;</b>
                                    </span>
                                );
                            }}
                            formatOptionLabel={(val) => {
                                if ('data' in val) {
                                    return <LocalityOption client={val.data} />;
                                }

                                return <span>{val.label}</span>;
                            }}
                            onCreateOption={onCreateOption}
                        />
                    );
                }}
            />

            <ModalWithBox
                show={!!clientToCreate}
                onCancel={onCancelModalCreation}
                closeOnOutsideClick
            >
                <CreateOrUpdateClientForm
                    mutate={(data) => {
                        createClient({
                            clientData: {
                                dni: data.dni,
                                email: data.email,
                                firstName: data.firstName,
                                houseNumber: data.houseNumber,
                                houseUnit: data.houseUnit,
                                lastName: data.lastName,
                                phoneCode: data.phoneCode,
                                phoneNumber: data.phoneNumber,
                                streetName: data.streetName,
                                localityId: data.locality.value,
                            },
                        });
                    }}
                    onCancel={() => {
                        setClientToCreate(null);
                    }}
                    isMutating={createIsLoading}
                    defaultValues={{
                        firstName: clientToCreate || undefined,
                    }}
                />
            </ModalWithBox>
        </>
    );
};

export default ClientField;
