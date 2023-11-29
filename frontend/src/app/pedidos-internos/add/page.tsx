'use client';

import { useRouter } from 'next/navigation';

import { SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useCreateInternalOrder } from '@/api/hooks';

import CreateOrUpdateInternalOrderForm, {
    CreateOrUpdateInternalOrderFormValues,
} from '@/modules/create-forms/CreateOrUpdateInternalOrderForm';

const Page = () => {
    const router = useRouter();

    const { mutate, isLoading } = useCreateInternalOrder({
        onSuccess: (data) => {
            const error = data.createInternalOrder?.error;
            const internalOrder = data.createInternalOrder?.internalOrder;

            if (error) {
                toast.error(error);
            }

            if (internalOrder) {
                toast.success('Pedido creado exitosamente');
                router.push('/pedidos-internos');
            }
        },
        onError: () => {
            toast.error('No se pudo crear el pedido');
        },
    });

    const onSubmit: SubmitHandler<CreateOrUpdateInternalOrderFormValues> = (data) => {
        const { officeBranch, officeDestination, products } = data;
        if (!officeBranch || !officeDestination || !products) return;

        mutate({
            data: {
                officeBranchId: officeBranch.value,
                officeDestinationId: officeDestination.value,
                products: products
                    .filter((product) => {
                        return product.product && product.quantity;
                    })
                    .map((product) => {
                        return {
                            id: product.product!.value,
                            quantity: parseInt(product.quantity, 10),
                        };
                    }),
            },
        });
    };

    return (
        <CreateOrUpdateInternalOrderForm
            cancelHref="/pedidos-internos"
            mutate={onSubmit}
            isMutating={isLoading}
        />
    );
};

export default Page;
