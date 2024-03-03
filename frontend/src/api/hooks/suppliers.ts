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
    CreateSupplierDocument,
    CreateSupplierMutation,
    CreateSupplierMutationVariables,
    SupplierByIdDocument,
    SuppliersDocument,
    AllSuppliersDocument,
    DeleteSupplierDocument,
    DeleteSupplierMutation,
    UpdateSupplierDocument,
    UpdateSupplierMutation,
    UpdateSupplierMutationVariables,
} from '../graphql';

export const useDeleteSupplier = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeleteSupplierMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeleteSupplierMutation, Error, string>({
        mutationFn: (id: string) => {
            return fetchClient(DeleteSupplierDocument, {
                id,
            });
        },
        onSuccess: (data, variables, context) => {
            client.invalidateQueries({
                queryKey: [queryDomains.suppliers],
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

export const useAllSuppliers = () => {
    return useQuery({
        queryKey: ['all-suppliers'],
        queryFn: () => {
            return fetchClient(AllSuppliersDocument, {});
        },
    });
};

export const usePaginatedSuppliers = () => {
    return usePaginatedQuery(
        queryKeys.suppliersPaginatedList,
        SuppliersDocument,
        'suppliers',
        {
            query: null,
        },
        {
            page: {
                type: 'int',
            },
            query: {
                type: 'string',
            },
        },
    );
};

export const useSupplierById = (id: string | undefined) => {
    return useQuery({
        queryKey: queryKeys.supplierDetailsById(id),
        queryFn: () => {
            return fetchClient(SupplierByIdDocument, {
                id: id as string,
            });
        },
        enabled: typeof id === 'string',
    });
};

type UseCreateSupplierOptions = UseMutationOptions<
    CreateSupplierMutation,
    Error,
    CreateSupplierMutationVariables
>;

export const useCreateSupplier = ({
    onSuccess,
    ...options
}: UseCreateSupplierOptions = {}) => {
    const client = useQueryClient();

    return useMutation<CreateSupplierMutation, Error, CreateSupplierMutationVariables>({
        mutationFn: (data) => {
            return fetchClient(CreateSupplierDocument, data);
        },
        onSuccess: (data, context, variables) => {
            if (data.createSupplier?.supplier) {
                client.invalidateQueries({
                    queryKey: [queryDomains.suppliers],
                    type: 'all',
                    refetchType: 'all',
                });
            }

            if (onSuccess) {
                onSuccess(data, context, variables);
            }
        },
        ...options,
    });
};

type UseUpdateSupplierOptions = UseMutationOptions<
    UpdateSupplierMutation,
    Error,
    UpdateSupplierMutationVariables
>;

export const useUpdateSupplier = ({
    onSuccess,
    ...options
}: UseUpdateSupplierOptions = {}) => {
    const client = useQueryClient();

    return useMutation<UpdateSupplierMutation, Error, UpdateSupplierMutationVariables>({
        mutationFn: (data) => {
            return fetchClient(UpdateSupplierDocument, data);
        },
        onSuccess: (data, context, variables) => {
            if (data.updateSupplier?.supplier) {
                client.invalidateQueries({
                    queryKey: [queryDomains.suppliers],
                    type: 'all',
                    refetchType: 'all',
                });
            }

            if (onSuccess) {
                onSuccess(data, context, variables);
            }
        },
        ...options,
    });
};
