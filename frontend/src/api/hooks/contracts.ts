import {
    UseMutationOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import usePaginatedQuery from '@/modules/usePaginatedQuery';

import { queryDomains, queryKeys } from './constants';

import { fetchClient } from '../fetch-client';
import {
    ContractByIdDocument,
    ContractsDocument,
    CreateContractDocument,
    CreateContractMutation,
    CreateContractMutationVariables,
    DeleteContractDocument,
    DeleteContractMutation,
    PayContractDepositDocument,
    PayTotalContractDocument,
    ContractsByClientIdDocument,
} from '../graphql';

export const useContracts = () => {
    return usePaginatedQuery(
        queryKeys.contractsPaginatedList,
        ContractsDocument,
        'contracts',
        {
            page: null,
        },
        {
            page: {
                type: 'int',
            },
        },
    );
};

export const useContractById = (id: string | undefined) => {
    return useQuery({
        queryKey: ['contract', id],
        queryFn: () => {
            return fetchClient(ContractByIdDocument, {
                id: id as string,
            });
        },
        enabled: typeof id === 'string',
    });
};

type UseCreateContractOptions = UseMutationOptions<
    CreateContractMutation,
    Error,
    CreateContractMutationVariables
>;

export const useCreateContract = ({
    onSuccess,
    ...options
}: UseCreateContractOptions = {}) => {
    const client = useQueryClient();

    return useMutation<CreateContractMutation, Error, CreateContractMutationVariables>({
        mutationFn: (data) => {
            return fetchClient(CreateContractDocument, data);
        },
        onSuccess: (data, variables, context) => {
            const contract = data.createContract?.contractId;

            if (contract) {
                client.invalidateQueries({
                    queryKey: [queryDomains.contracts],
                    refetchType: 'all',
                    type: 'all',
                });
            }

            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...options,
    });
};

export const useDeleteContract = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeleteContractMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeleteContractMutation, Error, string>({
        mutationFn: (id: string) => {
            return fetchClient(DeleteContractDocument, {
                id,
            });
        },
        onSuccess: (data, variables, context) => {
            client.invalidateQueries({
                queryKey: [queryDomains.contracts],
                refetchType: 'all',
                type: 'all',
            });

            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...options,
    });
};

export const usePayContractDeposit = () => {
    return useMutation({
        mutationFn: (id: string) => {
            return fetchClient(PayContractDepositDocument, {
                id,
            });
        },
    });
};

export const usePayTotalContract = () => {
    return useMutation({
        mutationFn: (id: string) => {
            return fetchClient(PayTotalContractDocument, {
                id,
            });
        },
    });
};

export const useContractsByClientId = (id: string | undefined) => {
    return useQuery({
        queryKey: [queryKeys.contractsListByClientId, id],
        queryFn: () => {
            return fetchClient(ContractsByClientIdDocument, {
                id: id as string,
            });
        },
        enabled: typeof id === 'string',
    });
};

export const usePayContractDepositMutation = () => {
    const client = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => {
            return fetchClient(PayContractDepositDocument, {
                id,
            });
        },
        onSuccess: (data) => {
            const updatedId = data.payContractDeposit?.contract?.id;
            const updatedHistory = data.payContractDeposit?.contract?.latestHistoryEntry;

            if (!updatedId || !updatedHistory) {
                return;
            }

            client.invalidateQueries({
                queryKey: [queryDomains.contracts],
                refetchType: 'all',
                type: 'all',
            });
        },
    });
};

export const usePayTotalContractMutation = () => {
    const client = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => {
            return fetchClient(PayTotalContractDocument, {
                id,
            });
        },
        onSuccess: (data) => {
            const updatedId = data.payTotalContract?.contract?.id;
            const updatedHistory = data.payTotalContract?.contract?.latestHistoryEntry;

            if (!updatedId || !updatedHistory) {
                return;
            }

            client.invalidateQueries({
                queryKey: [queryDomains.contracts],
                refetchType: 'all',
                type: 'all',
            });
        },
    });
};
