'use client';

import { useParams, useRouter } from 'next/navigation';

import toast from 'react-hot-toast';

import { useClientById, useUpdateClient } from '@/api/hooks';

import CreateOrUpdateClientForm from '@/modules/create-forms/CreateOrUpdateClientForm';

import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import Spinner from '@/components/Spinner/Spinner';

const Page = () => {
    const { id } = useParams();
    const useClientByIdResult = useClientById(id as string);

    const router = useRouter();
    const { mutate, isLoading } = useUpdateClient({
        onSuccess: (data) => {
            const error = data.updateClient?.error;
            const client = data.updateClient?.client;
            if (error) {
                toast.error(error);
            }

            if (client) {
                toast.success('Cliente actualizado exitosamente');
                router.push(`/clientes/${id}`);
            }
        },
    });

    return (
        <FetchedDataRenderer
            {...useClientByIdResult}
            Error={
                <FetchStatusMessageWithButton
                    message="Hubo un error al cargar el cliente"
                    btnText="Volver a intentar"
                    btnHref={`/clientes/${id}`}
                />
            }
            Loading={
                <div className="flex w-full flex-1 items-center justify-center">
                    <Spinner />
                </div>
            }
        >
            {({ clientById }) => {
                if (!clientById) {
                    return (
                        <FetchStatusMessageWithButton
                            message="Parece que el cliente que buscas no existe."
                            btnHref="/clientes"
                            btnText='Volver a "Clientes"'
                        />
                    );
                }

                return (
                    <CreateOrUpdateClientForm
                        defaultValues={{
                            dni: clientById.dni,
                            email: clientById.email,
                            firstName: clientById.firstName,
                            houseNumber: clientById.houseNumber,
                            houseUnit: clientById.houseUnit,
                            lastName: clientById.lastName,
                            phoneCode: clientById.phoneCode,
                            phoneNumber: clientById.phoneNumber,
                            streetName: clientById.streetName,
                            locality: {
                                label: clientById.locality.name,
                                value: clientById.locality.id,
                                data: clientById.locality,
                            },
                        }}
                        mutate={(data) => {
                            mutate({
                                id: id as string,
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
                        cancelHref={`/clientes/${id}`}
                        isMutating={isLoading}
                    />
                );
            }}
        </FetchedDataRenderer>
    );
};

export default Page;
