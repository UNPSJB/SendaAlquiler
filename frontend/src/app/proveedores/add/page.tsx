'use client';

import { useRouter } from 'next/navigation';

import { SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useCreateSupplier } from '@/api/hooks';

import CreateOrUpdateSupplierForm, {
    CreateOrUpdateSupplierFormValues,
} from '@/modules/create-forms/CreateOrUpdateSupplierForm';

const Page = () => {
    const router = useRouter();

    const { mutate, isLoading } = useCreateSupplier({
        onSuccess: (data) => {
            const error = data.createSupplier?.error;
            const supplier = data.createSupplier?.supplier;
            if (error) {
                toast.error(error);
            }

            if (supplier) {
                toast.success('Proveedor creado exitosamente');
                router.push('/proveedores');
            }
        },
        onError: () => {
            toast.error('No se pudo crear el proveedor');
        },
    });

    const onSubmit: SubmitHandler<CreateOrUpdateSupplierFormValues> = (data) => {
        mutate({
            data: {
                cuit: data.cuit,
                email: data.email,
                name: data.name,
                houseNumber: data.houseNumber,
                houseUnit: data.houseUnit,
                phoneCode: data.phoneCode,
                phoneNumber: data.phoneNumber,
                streetName: data.streetName,
                locality: data.locality.value,
                note: data.note,
            },
        });
    };

    return (
        <CreateOrUpdateSupplierForm
            cancelHref="/proveedores"
            mutate={onSubmit}
            isMutating={isLoading}
        />
    );
};

export default Page;
