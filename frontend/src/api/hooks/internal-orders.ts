import {
    UseMutationOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import toast from 'react-hot-toast';

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
    InternalOrderHistoryStatusChoices,
    ReceiveInternalOrderDocument,
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
    status: InternalOrderHistoryStatusChoices,
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
                    currentHistory: {
                        ...prevOrder.currentHistory,
                        status,
                    },
                },
            };

            return next;
        },
    );
};

export const useSetInternalOrderAsInProgress = () => {
    const client = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => {
            return fetchClient(InProgressInternalOrderDocument, {
                id,
            });
        },
        onSuccess: (data) => {
            const id = data.inProgressInternalOrder?.internalOrder?.id;

            if (id) {
                updateInternalOrderStatus(
                    client,
                    id,
                    InternalOrderHistoryStatusChoices.InProgress,
                );
            }
        },
        onError: () => {
            toast.error('Hubo un error al actualizar el estado del pedido');
        },
    });
};

export const useSetInternalOrderAsCompleted = () => {
    const client = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => {
            return fetchClient(ReceiveInternalOrderDocument, {
                id,
            });
        },
        onSuccess: (data) => {
            const id = data.receiveInternalOrder?.internalOrder?.id;

            if (id) {
                updateInternalOrderStatus(
                    client,
                    id,
                    InternalOrderHistoryStatusChoices.Completed,
                );
            }
        },
        onError: () => {
            toast.error('Hubo un error al actualizar el estado del pedido');
        },
    });
};
