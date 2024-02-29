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
    SalesDocument,
    CreateSaleMutation,
    CreateSaleMutationVariables,
    SaleByIdDocument,
    CreateSaleDocument,
    DeleteSaleDocument,
    DeleteSaleMutation,
    SalesByClientIdDocument,
} from '../graphql';

export const useSales = () => {
    return usePaginatedQuery(
        queryKeys.salesPaginatedList,
        SalesDocument,
        'sales',
        {},
        {
            page: { type: 'int' },
        },
    );
};

export const useSaleById = (id: string | undefined) => {
    return useQuery(
        queryKeys.saleDetailsById(id),
        () => {
            return fetchClient(SaleByIdDocument, {
                id: id as string,
            });
        },
        {
            enabled: typeof id === 'string',
        },
    );
};

type UseCreateSaleOptions = UseMutationOptions<
    CreateSaleMutation,
    Error,
    CreateSaleMutationVariables
>;

export const useCreateSale = ({ onSuccess, ...options }: UseCreateSaleOptions = {}) => {
    const client = useQueryClient();

    return useMutation<CreateSaleMutation, Error, CreateSaleMutationVariables>(
        (data) => {
            return fetchClient(CreateSaleDocument, data);
        },
        {
            onSuccess: (data, variables, context) => {
                const sale = data.createSale?.sale;

                if (sale) {
                    client.invalidateQueries(queryKeys.salesPaginatedList());
                }

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};

export const useDeleteSale = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeleteSaleMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeleteSaleMutation, Error, string>(
        (id: string) => {
            return fetchClient(DeleteSaleDocument, {
                id,
            });
        },
        {
            onSuccess: (data, variables, context) => {
                client.invalidateQueries(queryKeys.salesPaginatedList());

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};

export const useSalesByClientId = (id: string | undefined) => {
    return useQuery(
        queryKeys.salesListByClientId(id),
        () => {
            return fetchClient(SalesByClientIdDocument, {
                id: id as string,
            });
        },
        {
            enabled: typeof id === 'string',
        },
    );
};
