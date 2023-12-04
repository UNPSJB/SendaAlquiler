import CreateContractForm from '@/modules/create-forms/CreateContractForm';

const Page = ({ searchParams }: { searchParams: { client?: string } }) => {
    const clientId = searchParams.client;

    return (
        <CreateContractForm
            cancelHref={clientId ? `/clientes/${clientId}` : '/contratos'}
        />
    );
};

export default Page;
