import {
    UseMutationOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import usePaginatedQuery from '@/modules/usePaginatedQuery';

import { queryKeys } from './constants';

import { fetchClient } from '../fetch-client';
import {
    CreateInternalOrderDocument,
    CreateInternalOrderMutation,
    CreateInternalOrderMutationVariables,
    InternalOrdersDocument,
    DeleteInternalOrderDocument,
    DeleteInternalOrderMutation,
    InternalOrderByIdDocument,
} from '../graphql';

export const useInternalOrderById = (id: string | undefined) => {
    return useQuery(
        queryKeys.internalOrdersDetailsById(id),
        () => {
            return fetchClient(InternalOrderByIdDocument, {
                id: id as string,
            });
        },
        {
            enabled: typeof id === 'string',
        },
    );
};

export const usePaginatedInternalOrders = () => {
    return usePaginatedQuery(
        queryKeys.internalOrdersPaginatedList,
        InternalOrdersDocument,
        'internalOrders',
        {
            page: 'number',
        },
    );
};

type UseCreateInternalOrderOptions = UseMutationOptions<
    CreateInternalOrderMutation,
    Error,
    CreateInternalOrderMutationVariables
>;

export const useCreateInternalOrder = ({
    onSuccess,
    ...options
}: UseCreateInternalOrderOptions = {}) => {
    const client = useQueryClient();

    return useMutation<
        CreateInternalOrderMutation,
        Error,
        CreateInternalOrderMutationVariables
    >(
        (data) => {
            return fetchClient(CreateInternalOrderDocument, data);
        },
        {
            onSuccess: (data, variables, context) => {
                if (data.createInternalOrder?.internalOrder) {
                    client.invalidateQueries(queryKeys.internalOrdersPaginatedList());
                }

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};

export const useDeleteInternalOrder = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeleteInternalOrderMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeleteInternalOrderMutation, Error, string>(
        (id: string) => {
            return fetchClient(DeleteInternalOrderDocument, {
                id,
            });
        },
        {
            onSuccess: (data, variables, context) => {
                client.invalidateQueries(queryKeys.internalOrdersPaginatedList());

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};
