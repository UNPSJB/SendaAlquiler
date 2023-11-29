'use client';

import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';

import { useCreateClient } from '@/api/hooks';

import CreateOrUpdateClientForm from '@/modules/create-forms/CreateOrUpdateClientForm';

const Page = () => {
    const router = useRouter();
    const { mutate, isLoading } = useCreateClient({
        onSuccess: (data) => {
            const error = data.createClient?.error;
            const client = data.createClient?.client;
            if (error) {
                toast.error(error);
            }

            if (client) {
                toast.success('Cliente creado exitosamente');
                router.push('/clientes');
            }
        },
        onError: () => {
            toast.error('No se pudo crear el cliente');
        },
    });

    return (
        <CreateOrUpdateClientForm
            mutate={(data) => {
                mutate({
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
            cancelHref="/clientes"
            isMutating={isLoading}
        />
    );
};

export default Page;
