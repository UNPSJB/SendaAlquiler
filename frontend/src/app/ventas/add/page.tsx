'use client';

import CreatePurchaseForm from '@/modules/create-forms/CreatePurchase';

const Page = ({ searchParams }: { searchParams: { client?: string } }) => {
    const clientId = searchParams.client;

    return (
        <CreatePurchaseForm cancelHref={clientId ? `/clientes/${clientId}` : '/ventas'} />
    );
};

export default Page;
