'use client';

import { useParams, useRouter } from 'next/navigation';

import toast from 'react-hot-toast';

import { useProductById, useUpdateClient } from '@/api/hooks';

import CreateOrUpdateProductForm from '@/modules/create-forms/CreateOrUpdateProductForm';

import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import Spinner from '@/components/Spinner/Spinner';

const Page = () => {
    const { id } = useParams();
    const useProductByIdResult = useProductById(id as string);

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
            {...useProductByIdResult}
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
            {({ productById }) => {
                if (!productById) {
                    return (
                        <FetchStatusMessageWithButton
                            message="Parece que el cliente que buscas no existe."
                            btnHref="/clientes"
                            btnText='Volver a "Clientes"'
                        />
                    );
                }

                return (
                    <CreateOrUpdateProductForm
                        defaultValues={{
                            brand: {
                                value: productById.brand.id,
                                label: productById.brand.name,
                            },
                            description: productById.description,
                            name: productById.name,
                            price: productById.price,
                            services: productById.services.map((service) => {
                                return {
                                    name: service.name,
                                    price: service.price,
                                };
                            }),
                            sku: productById.sku,
                            stock: productById.stock.map((stock) => {
                                return {
                                    office: {
                                        value: stock.office.id,
                                        label: stock.office.name,
                                    },
                                    stock: stock.stock,
                                };
                            }),
                            suppliers: [],
                            type: {
                                value: productById.type,
                                label: productById.type,
                            },
                        }}
                        mutate={(data) => {
                            // mutate({
                            //     id: id as string,
                            //     clientData: {
                            //     },
                            // });
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
