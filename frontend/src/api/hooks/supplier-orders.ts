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
    SupplierOrdersDocument,
    SupplierOrderByIdDocument,
    SupplierOrdersBySupplierIdDocument,
    CreateSupplierOrderMutationVariables,
    CreateSupplierOrderDocument,
    CreateSupplierOrderMutation,
    DeleteSupplierOrderDocument,
    DeleteSupplierOrderMutation,
    SupplierOrderByIdQuery,
    CancelSupplierOrderDocument,
    ReceiveSupplierOrderMutationVariables,
    ReceiveSupplierOrderDocument,
    CancelSupplierOrderMutationVariables,
    ReceiveSupplierOrderMutation,
    CancelSupplierOrderMutation,
} from '../graphql';

export const useSupplierOrders = () => {
    return usePaginatedQuery(
        queryKeys.supplierOrdersPaginatedList,
        SupplierOrdersDocument,
        'supplierOrders',
        {},
        {
            page: { type: 'int' },
        },
    );
};

export const useSupplierOrderById = (id: string | undefined) => {
    return useQuery({
        queryKey: queryKeys.supplierOrderDetailsById(id),
        queryFn: () => {
            return fetchClient(SupplierOrderByIdDocument, {
                id: id as string,
            });
        },
        enabled: typeof id === 'string',
    });
};

export const useSupplierOrdersBySupplierId = (id: string | undefined) => {
    return useQuery({
        queryKey: queryKeys.supplierOrderDetailsBySupplierId(id),
        queryFn: () => {
            return fetchClient(SupplierOrdersBySupplierIdDocument, {
                id: id as string,
            });
        },
        enabled: typeof id === 'string',
    });
};

type UseCreateSupplierOrderOptions = UseMutationOptions<
    CreateSupplierOrderMutation,
    Error,
    CreateSupplierOrderMutationVariables
>;

export const useCreateSupplierOrder = ({
    onSuccess,
    ...options
}: UseCreateSupplierOrderOptions = {}) => {
    const client = useQueryClient();

    return useMutation<
        CreateSupplierOrderMutation,
        Error,
        CreateSupplierOrderMutationVariables
    >({
        mutationFn: (data) => {
            return fetchClient(CreateSupplierOrderDocument, data);
        },
        onSuccess: (data, variables, context) => {
            if (data.createSupplierOrder?.supplierOrder) {
                client.invalidateQueries({
                    queryKey: [queryDomains.supplierOrders],
                    type: 'all',
                    refetchType: 'all',
                });
            }

            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...options,
    });
};

export const useDeleteSupplierOrder = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeleteSupplierOrderMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeleteSupplierOrderMutation, Error, string>({
        mutationFn: (id: string) => {
            return fetchClient(DeleteSupplierOrderDocument, {
                id,
            });
        },
        onSuccess: (data, variables, context) => {
            client.invalidateQueries({
                queryKey: [queryDomains.supplierOrders],
                type: 'all',
                refetchType: 'all',
            });

            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...options,
    });
};

const updateSupplierOrderStatus = (
    client: ReturnType<typeof useQueryClient>,
    id: string,
    responseOrder:
        | NonNullable<
              NonNullable<
                  ReceiveSupplierOrderMutation['receiveSupplierOrder']
              >['supplierOrder']
          >
        | NonNullable<
              NonNullable<
                  CancelSupplierOrderMutation['cancelSupplierOrder']
              >['supplierOrder']
          >,
) => {
    client.invalidateQueries({
        queryKey: [queryDomains.supplierOrders],
        type: 'all',
        refetchType: 'all',
    });

    client.setQueryData<SupplierOrderByIdQuery>(
        queryKeys.supplierOrderDetailsById(id),
        (prev) => {
            const prevOrder = prev?.supplierOrderById;

            if (!prev || !prevOrder) {
                return prev;
            }

            const next: SupplierOrderByIdQuery = {
                ...prev,
                supplierOrderById: {
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

export const useSetSupplierOrderAsCompleted = () => {
    const client = useQueryClient();

    return useMutation({
        mutationFn: (data: ReceiveSupplierOrderMutationVariables) => {
            return fetchClient(ReceiveSupplierOrderDocument, data);
        },
        onSuccess: (data) => {
            if (data.receiveSupplierOrder?.supplierOrder) {
                updateSupplierOrderStatus(
                    client,
                    data.receiveSupplierOrder.supplierOrder.id,
                    data.receiveSupplierOrder.supplierOrder,
                );
            }
        },
    });
};

export const useSetSupplierOrderAsCanceled = () => {
    const client = useQueryClient();

    return useMutation({
        mutationFn: (data: CancelSupplierOrderMutationVariables) => {
            return fetchClient(CancelSupplierOrderDocument, data);
        },
        onSuccess: (data) => {
            if (data.cancelSupplierOrder?.supplierOrder) {
                updateSupplierOrderStatus(
                    client,
                    data.cancelSupplierOrder.supplierOrder.id,
                    data.cancelSupplierOrder.supplierOrder,
                );
            }
        },
    });
};
