'use client';

import { useRouter } from 'next/navigation';

import CreateLocalityForm from '@/modules/create-forms/CreateLocalityForm';

const Page = () => {
    const router = useRouter();

    return (
        <CreateLocalityForm
            cancelHref="/localidades"
            onSuccess={() => {
                router.push('/localidades');
            }}
        />
    );
};

export default Page;
