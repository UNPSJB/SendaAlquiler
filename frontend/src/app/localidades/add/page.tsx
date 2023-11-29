'use client';

import { useRouter } from 'next/navigation';

import { SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useCreateLocality } from '@/api/hooks';

import CreateOrUpdateLocalityForm, {
    CreateOrUpdateLocalityFormValues,
} from '@/modules/create-forms/CreateOrUpdateLocalityForm';

const Page = () => {
    const router = useRouter();

    const { mutate, isLoading } = useCreateLocality({
        onSuccess: ({ createLocality }) => {
            const error = createLocality?.error;
            const locality = createLocality?.locality;

            if (error) {
                toast.error(error);
            }

            if (locality) {
                router.push('/localidades');
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

    return (
        <CreateOrUpdateLocalityForm
            cancelHref="/localidades"
            mutate={onSubmit}
            isMutating={isLoading}
        />
    );
};

export default Page;
