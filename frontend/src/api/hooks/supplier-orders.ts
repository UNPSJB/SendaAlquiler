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
    SupplierOrdersDocument,
    SupplierOrderByIdDocument,
    SupplierOrdersBySupplierIdDocument,
    CreateSupplierOrderMutationVariables,
    CreateSupplierOrderDocument,
    CreateSupplierOrderMutation,
    DeleteSupplierOrderDocument,
    DeleteSupplierOrderMutation,
} from '../graphql';

export const useSupplierOrders = () => {
    return usePaginatedQuery(
        queryKeys.supplierOrdersPaginatedList,
        SupplierOrdersDocument,
        'supplierOrders',
        {
            page: 'number',
        },
    );
};

export const useSupplierOrderById = (id: string | undefined) => {
    return useQuery(
        queryKeys.supplierOrderDetailsById(id),
        () => {
            return fetchClient(SupplierOrderByIdDocument, {
                id: id as string,
            });
        },
        {
            enabled: typeof id === 'string',
        },
    );
};

export const useSupplierOrdersBySupplierId = (id: string | undefined) => {
    return useQuery(
        queryKeys.supplierOrderDetailsBySupplierId(id),
        () => {
            return fetchClient(SupplierOrdersBySupplierIdDocument, {
                id: id as string,
            });
        },
        {
            enabled: typeof id === 'string',
        },
    );
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
    >(
        (data) => {
            return fetchClient(CreateSupplierOrderDocument, data);
        },
        {
            onSuccess: (data, variables, context) => {
                if (data.createSupplierOrder?.supplierOrder) {
                    client.invalidateQueries(queryKeys.supplierOrdersPaginatedList());
                }

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};

export const useDeleteSupplierOrder = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeleteSupplierOrderMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeleteSupplierOrderMutation, Error, string>(
        (id: string) => {
            return fetchClient(DeleteSupplierOrderDocument, {
                id,
            });
        },
        {
            onSuccess: (data, variables, context) => {
                client.invalidateQueries(queryKeys.supplierOrdersPaginatedList());

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};
