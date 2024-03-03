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
    InProgressInternalOrderDocument,
    InternalOrderByIdQuery,
    ReceiveInternalOrderDocument,
    InProgressInternalOrderMutation,
    ReceiveInternalOrderMutationVariables,
    InProgressInternalOrderMutationVariables,
    ReceiveInternalOrderMutation,
    CancelInternalOrderDocument,
    CancelInternalOrderMutationVariables,
    CancelInternalOrderMutation,
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
        {},
        {
            page: { type: 'int' },
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

const updateInternalOrderStatus = (
    client: ReturnType<typeof useQueryClient>,
    id: string,
    responseOrder:
        | NonNullable<
              NonNullable<
                  InProgressInternalOrderMutation['inProgressInternalOrder']
              >['internalOrder']
          >
        | NonNullable<
              NonNullable<
                  ReceiveInternalOrderMutation['receiveInternalOrder']
              >['internalOrder']
          >
        | NonNullable<
              NonNullable<
                  CancelInternalOrderMutation['cancelInternalOrder']
              >['internalOrder']
          >,
) => {
    client.invalidateQueries(queryKeys.internalOrdersPaginatedList());
    client.setQueryData<InternalOrderByIdQuery>(
        queryKeys.internalOrdersDetailsById(id),
        (prev) => {
            const prevOrder = prev?.internalOrderById;

            if (!prev || !prevOrder) {
                return prev;
            }

            const next: InternalOrderByIdQuery = {
                ...prev,
                internalOrderById: {
                    ...prevOrder,
                    latestHistoryEntry: {
                        status: responseOrder.latestHistoryEntry!.status,
                    },
                    historyEntries: responseOrder.historyEntries,
                    orderItems:
                        'orderItems' in responseOrder
                            ? responseOrder.orderItems
                            : 'orderItems' in prevOrder
                              ? prevOrder.orderItems
                              : [],
                },
            };

            return next;
        },
    );
};

export const useSetInternalOrderAsInProgress = () => {
    const client = useQueryClient();

    return useMutation({
        mutationFn: (data: InProgressInternalOrderMutationVariables) => {
            return fetchClient(InProgressInternalOrderDocument, data);
        },
        onSuccess: (data) => {
            if (data.inProgressInternalOrder?.internalOrder) {
                updateInternalOrderStatus(
                    client,
                    data.inProgressInternalOrder.internalOrder.id,
                    data.inProgressInternalOrder.internalOrder,
                );
            }
        },
    });
};

export const useSetInternalOrderAsCompleted = () => {
    const client = useQueryClient();

    return useMutation({
        mutationFn: (data: ReceiveInternalOrderMutationVariables) => {
            return fetchClient(ReceiveInternalOrderDocument, data);
        },
        onSuccess: (data) => {
            if (data.receiveInternalOrder?.internalOrder) {
                updateInternalOrderStatus(
                    client,
                    data.receiveInternalOrder.internalOrder.id,
                    data.receiveInternalOrder.internalOrder,
                );
            }
        },
    });
};

export const useSetInternalOrderAsCanceled = () => {
    const client = useQueryClient();

    return useMutation({
        mutationFn: (data: CancelInternalOrderMutationVariables) => {
            return fetchClient(CancelInternalOrderDocument, data);
        },
        onSuccess: (data) => {
            if (data.cancelInternalOrder?.internalOrder) {
                updateInternalOrderStatus(
                    client,
                    data.cancelInternalOrder.internalOrder.id,
                    data.cancelInternalOrder.internalOrder,
                );
            }
        },
    });
};
