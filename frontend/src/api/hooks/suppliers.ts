import {
    UseMutationOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import usePaginatedQuery from '@/modules/usePaginatedQuery';

import { queryKeys } from './constants';

import {
    CreateSupplierDocument,
    CreateSupplierMutation,
    CreateSupplierMutationVariables,
    SupplierByIdDocument,
    SuppliersDocument,
    AllSuppliersDocument,
    DeleteSupplierDocument,
    DeleteSupplierMutation,
} from '../graphql';
import { clientGraphqlQuery } from '../graphqlclient';

export const useDeleteSupplier = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeleteSupplierMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeleteSupplierMutation, Error, string>(
        (id: string) => {
            return clientGraphqlQuery(DeleteSupplierDocument, {
                id,
            });
        },
        {
            onSuccess: (data, variables, context) => {
                client.invalidateQueries(queryKeys.suppliersPaginatedList());

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};

export const useAllSuppliers = () => {
    return useQuery(['all-suppliers'], () => {
        return clientGraphqlQuery(AllSuppliersDocument, {});
    });
};

export const usePaginatedSuppliers = () => {
    return usePaginatedQuery(
        queryKeys.suppliersPaginatedList,
        SuppliersDocument,
        'suppliers',
        {
            page: 'number',
        },
    );
};

export const useSupplierById = (id: string | undefined) => {
    return useQuery(
        queryKeys.supplierDetailsById(id),
        () => {
            return clientGraphqlQuery(SupplierByIdDocument, {
                id: id as string,
            });
        },
        {
            enabled: typeof id === 'string',
        },
    );
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

    return useMutation<CreateSupplierMutation, Error, CreateSupplierMutationVariables>(
        (data) => {
            return clientGraphqlQuery(CreateSupplierDocument, data);
        },
        {
            onSuccess: (data, context, variables) => {
                if (data.createSupplier?.supplier) {
                    client.invalidateQueries(queryKeys.suppliersPaginatedList());
                }

                if (onSuccess) {
                    onSuccess(data, context, variables);
                }
            },
            ...options,
        },
    );
};
