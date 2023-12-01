import {
    UseMutationOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import usePaginatedQuery from '@/modules/usePaginatedQuery';

import { queryKeys } from './constants';

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
} from '../graphql';
import { clientGraphqlQuery } from '../graphqlclient';

export const useContracts = () => {
    return usePaginatedQuery(
        queryKeys.contractsPaginatedList,
        ContractsDocument,
        'rentalContracts',
        {
            page: 'number',
        },
    );
};

export const useContractById = (id: string | undefined) => {
    return useQuery(
        queryKeys.contractDetailsById(id),
        () => {
            return clientGraphqlQuery(ContractByIdDocument, {
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
            return clientGraphqlQuery(CreateRentalContractDocument, data);
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
            return clientGraphqlQuery(DeleteRentalContractDocument, {
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
        return clientGraphqlQuery(PayContractDepositDocument, {
            id,
        });
    });
};

export const usePayTotalContract = () => {
    return useMutation((id: string) => {
        return clientGraphqlQuery(PayTotalContractDocument, {
            id,
        });
    });
};
