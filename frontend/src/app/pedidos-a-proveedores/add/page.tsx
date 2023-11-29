'use client';

import { useRouter } from 'next/navigation';

import { SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useCreateSupplierOrder } from '@/api/hooks';

import CreateOrUpdateSupplierOrderForm, {
    CreateOrUpdateSupplierOrderFormValues,
} from '@/modules/create-forms/CreateOrUpdateSupplierOrderForm';

const Page = () => {
    const router = useRouter();

    const { mutate, isLoading } = useCreateSupplierOrder({
        onSuccess: (data) => {
            const error = data.createSupplierOrder?.error;
            const supplierOrder = data.createSupplierOrder?.supplierOrder;

            if (error) {
                toast.error(error);
            }

            if (supplierOrder) {
                toast.success('Pedido creado exitosamente');
                router.push('/pedidos-a-proveedores');
            }
        },
        onError: () => {
            toast.error('No se pudo crear el pedido');
        },
    });

    const onSubmit: SubmitHandler<CreateOrUpdateSupplierOrderFormValues> = (data) => {
        const { supplier, officeDestination, products } = data;
        if (!supplier || !officeDestination || !products) return;

        mutate({
            data: {
                supplierId: supplier.value,
                officeDestinationId: officeDestination.value,
                products: products.map((product) => {
                    return {
                        id: product.product.value,
                        quantity: parseInt(product.quantity.toString(), 10),
                    };
                }),
            },
        });
    };

    return (
        <CreateOrUpdateSupplierOrderForm
            cancelHref="/pedidos-a-proveedores"
            mutate={onSubmit}
            isMutating={isLoading}
        />
    );
};

export default Page;
