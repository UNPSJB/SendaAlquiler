import {
    UseMutationOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import usePaginatedQuery from '@/modules/usePaginatedQuery';

import { queryDomains, queryKeys } from './constants';

import fetchClient from '../fetch-client';
import {
    SalesDocument,
    CreateSaleMutation,
    CreateSaleMutationVariables,
    SaleByIdDocument,
    CreateSaleDocument,
    DeleteSaleDocument,
    DeleteSaleMutation,
    SalesByClientIdDocument,
} from '../graphql';

export const useSaleById = (id: string | undefined) => {
    return useQuery({
        queryKey: queryKeys.saleDetailsById(id),
        queryFn: () => {
            return fetchClient(SaleByIdDocument, {
                id: id as string,
            });
        },
        enabled: typeof id === 'string',
    });
};

type UseCreateSaleOptions = UseMutationOptions<
    CreateSaleMutation,
    Error,
    CreateSaleMutationVariables
>;

export const useCreateSale = ({ onSuccess, ...options }: UseCreateSaleOptions = {}) => {
    const client = useQueryClient();

    return useMutation<CreateSaleMutation, Error, CreateSaleMutationVariables>({
        mutationFn: (data) => {
            return fetchClient(CreateSaleDocument, data);
        },
        onSuccess: (data, variables, context) => {
            const sale = data.createSale?.sale;

            if (sale) {
                client.invalidateQueries({
                    queryKey: [queryDomains.sales],
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

export const useSales = () => {
    return usePaginatedQuery(
        queryKeys.salesPaginatedList,
        SalesDocument,
        'sales',
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

export const useDeleteSale = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeleteSaleMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeleteSaleMutation, Error, string>({
        mutationFn: (id: string) => {
            return fetchClient(DeleteSaleDocument, {
                id,
            });
        },
        onSuccess: (data, variables, context) => {
            client.invalidateQueries({
                queryKey: [queryDomains.sales],
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

export const useSalesByClientId = (id: string | undefined) => {
    return useQuery({
        queryKey: queryKeys.salesListByClientId(id),
        queryFn: () => {
            return fetchClient(SalesByClientIdDocument, {
                id: id as string,
            });
        },
        enabled: typeof id === 'string',
    });
};
