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
    CreateRentalContractDocument,
    CreateRentalContractMutation,
    CreateRentalContractMutationVariables,
    DeleteRentalContractDocument,
    DeleteRentalContractMutation,
    PayContractDepositDocument,
    PayTotalContractDocument,
    RentalContractsByClientIdDocument,
} from '../graphql';

export const useContracts = () => {
    return usePaginatedQuery(
        queryKeys.contractsPaginatedList,
        ContractsDocument,
        'rentalContracts',
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
    return useQuery(
        queryKeys.contractDetailsById(id),
        () => {
            return fetchClient(ContractByIdDocument, {
                id: id as string,
            });
        },
        {
            enabled: typeof id === 'string',
        },
    );
};

type UseCreateRentalContractOptions = UseMutationOptions<
    CreateRentalContractMutation,
    Error,
    CreateRentalContractMutationVariables
>;

export const useCreateRentalContract = ({
    onSuccess,
    ...options
}: UseCreateRentalContractOptions = {}) => {
    const client = useQueryClient();

    return useMutation<
        CreateRentalContractMutation,
        Error,
        CreateRentalContractMutationVariables
    >(
        (data) => {
            return fetchClient(CreateRentalContractDocument, data);
        },
        {
            onSuccess: (data, variables, context) => {
                const rentalContract = data.createRentalContract?.rentalContract;

                if (rentalContract) {
                    client.invalidateQueries(queryKeys.contractsPaginatedList());
                }

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};

export const useDeleteRentalContract = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeleteRentalContractMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeleteRentalContractMutation, Error, string>(
        (id: string) => {
            return fetchClient(DeleteRentalContractDocument, {
                id,
            });
        },
        {
            onSuccess: (data, variables, context) => {
                client.invalidateQueries(queryKeys.contractsPaginatedList());

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};

export const usePayContractDeposit = () => {
    return useMutation((id: string) => {
        return fetchClient(PayContractDepositDocument, {
            id,
        });
    });
};

export const usePayTotalContract = () => {
    return useMutation((id: string) => {
        return fetchClient(PayTotalContractDocument, {
            id,
        });
    });
};

export const useRentalContractsByClientId = (id: string | undefined) => {
    return useQuery(
        queryKeys.contractsListByClientId(id),
        () => {
            return fetchClient(RentalContractsByClientIdDocument, {
                id: id as string,
            });
        },
        {
            enabled: typeof id === 'string',
        },
    );
};

export const usePayContractDepositMutation = () => {
    const client = useQueryClient();
    return useMutation(
        (id: string) => {
            return fetchClient(PayContractDepositDocument, {
                id,
            });
        },
        {
            onSuccess: (data) => {
                const updatedId = data.payContractDeposit?.rentalContract?.id;
                const updatedHistory =
                    data.payContractDeposit?.rentalContract?.currentHistory;

                if (!updatedId || !updatedHistory) {
                    return;
                }

                client.invalidateQueries([queryDomains.contracts]);
            },
        },
    );
};

export const usePayTotalContractMutation = () => {
    const client = useQueryClient();

    return useMutation(
        (id: string) => {
            return fetchClient(PayTotalContractDocument, {
                id,
            });
        },
        {
            onSuccess: (data) => {
                const updatedId = data.payTotalContract?.rentalContract?.id;
                const updatedHistory =
                    data.payTotalContract?.rentalContract?.currentHistory;

                if (!updatedId || !updatedHistory) {
                    return;
                }

                client.invalidateQueries([queryDomains.contracts]);
            },
        },
    );
};
