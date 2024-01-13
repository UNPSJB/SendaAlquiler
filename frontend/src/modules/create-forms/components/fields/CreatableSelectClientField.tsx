import { useState } from 'react';
import toast from 'react-hot-toast';
import CreatableSelect from 'react-select/creatable';

import { AllClientsQuery, Client } from '@/api/graphql';
import { useAllClients, useCreateClient } from '@/api/hooks';

import CreateOrUpdateClientForm from '../../CreateOrUpdateClientForm';
import ModalWithBox from '../ModalWithBox';

type ClientOptionProps = {
    client: AllClientsQuery['allClients'][0];
};

const SelectOption: React.FC<ClientOptionProps> = ({ client }) => (
    <div>
        <p className="font-bold">
            {client.firstName} {client.lastName}
        </p>

        <p className="text-gray-500">DNI: {client.dni}</p>
        <p className="text-gray-500">Email: {client.email}</p>
    </div>
);

export type ClientFieldValue = {
    value: Client['id'];
    label: string;
    data: ClientOptionProps['client'];
};

type RHFProps = {
    onChange: (value: ClientFieldValue | null) => void;
    disabled?: boolean;
};

const CreatableSelectClientField = ({ disabled, onChange, ...props }: RHFProps) => {
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

                onChange(nextValue);
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
            <CreatableSelect<
                | ClientFieldValue
                | {
                      __isNew__: boolean;
                      label: string;
                      value: string;
                  }
            >
                {...props}
                onChange={(value) => {
                    if (value) {
                        onChange(value as ClientFieldValue);
                    } else {
                        onChange(null);
                    }
                }}
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
                        return <SelectOption client={val.data} />;
                    }

                    return <span>{val.label}</span>;
                }}
                onCreateOption={onCreateOption}
                filterOption={(option, rawInput) => {
                    if ('__isNew__' in option) {
                        return true;
                    }

                    if (!('data' in option.data)) {
                        return true;
                    }

                    const input = rawInput.toLowerCase();
                    const client = option.data.data;
                    const fullName = `${client.firstName} ${client.lastName}`;
                    const dni = client.dni.toLowerCase();
                    const email = client.email.toLowerCase();

                    return (
                        fullName.includes(input) ||
                        dni.includes(input) ||
                        email.includes(input)
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

export default CreatableSelectClientField;
