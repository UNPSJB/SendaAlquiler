import {
    UseMutationOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import usePaginatedQuery from '@/modules/usePaginatedQuery';

import { queryKeys } from './constants';

import {
    PurchasesDocument,
    CreatePurchaseMutation,
    CreatePurchaseMutationVariables,
    PurchaseByIdDocument,
    CreatePurchaseDocument,
    DeletePurchaseDocument,
    DeletePurchaseMutation,
} from '../graphql';
import { clientGraphqlQuery } from '../graphqlclient';

export const usePurchases = () => {
    return usePaginatedQuery(
        queryKeys.purchasesPaginatedList,
        PurchasesDocument,
        'purchases',
        {
            page: 'number',
        },
    );
};

export const usePurchaseById = (id: string | undefined) => {
    return useQuery(
        queryKeys.purchaseDetailsById(id),
        () => {
            return clientGraphqlQuery(PurchaseByIdDocument, {
                id: id as string,
            });
        },
        {
            enabled: typeof id === 'string',
        },
    );
};

type UseCreatePurchaseOptions = UseMutationOptions<
    CreatePurchaseMutation,
    Error,
    CreatePurchaseMutationVariables
>;

export const useCreatePurchase = ({
    onSuccess,
    ...options
}: UseCreatePurchaseOptions = {}) => {
    const client = useQueryClient();

    return useMutation<CreatePurchaseMutation, Error, CreatePurchaseMutationVariables>(
        (data) => {
            return clientGraphqlQuery(CreatePurchaseDocument, data);
        },
        {
            onSuccess: (data, variables, context) => {
                const purchase = data.createPurchase?.purchase;

                if (purchase) {
                    client.invalidateQueries(queryKeys.purchasesPaginatedList());
                }

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};

export const useDeletePurchase = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeletePurchaseMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeletePurchaseMutation, Error, string>(
        (id: string) => {
            return clientGraphqlQuery(DeletePurchaseDocument, {
                id,
            });
        },
        {
            onSuccess: (data, variables, context) => {
                client.invalidateQueries(queryKeys.purchasesPaginatedList());

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};
