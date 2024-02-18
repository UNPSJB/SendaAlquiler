import {
    UseMutationOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import usePaginatedQuery from '@/modules/usePaginatedQuery';

import { queryKeys } from './constants';

import fetchClient from '../fetch-client';
import {
    PurchasesDocument,
    CreatePurchaseMutation,
    CreatePurchaseMutationVariables,
    PurchaseByIdDocument,
    CreatePurchaseDocument,
    DeletePurchaseDocument,
    DeletePurchaseMutation,
    PurchasesByClientIdDocument,
} from '../graphql';

export const usePurchases = () => {
    return usePaginatedQuery(
        queryKeys.purchasesPaginatedList,
        PurchasesDocument,
        'purchases',
        {},
        {
            page: { type: 'int' },
        },
    );
};

export const usePurchaseById = (id: string | undefined) => {
    return useQuery(
        queryKeys.purchaseDetailsById(id),
        () => {
            return fetchClient(PurchaseByIdDocument, {
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
            return fetchClient(CreatePurchaseDocument, data);
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
            return fetchClient(DeletePurchaseDocument, {
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

export const usePurchasesByClientId = (id: string | undefined) => {
    return useQuery(
        queryKeys.purchasesListByClientId(id),
        () => {
            return fetchClient(PurchasesByClientIdDocument, {
                id: id as string,
            });
        },
        {
            enabled: typeof id === 'string',
        },
    );
};
