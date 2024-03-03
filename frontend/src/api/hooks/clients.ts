import {
    InfiniteData,
    UseMutationOptions,
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import usePaginatedQuery from '@/modules/usePaginatedQuery';

import { queryDomains, queryKeys } from './constants';

import { fetchClient } from '../fetch-client';
import {
    ClientByIdDocument,
    ClientsDocument,
    CreateClientDocument,
    CreateClientMutation,
    CreateClientMutationVariables,
    DeleteClientDocument,
    DeleteClientMutation,
    UpdateClientMutation,
    UpdateClientMutationVariables,
    UpdateClientDocument,
    ClientsQueryVariables,
    ClientsQuery,
} from '../graphql';

export const useDeleteClient = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeleteClientMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeleteClientMutation, Error, string>({
        mutationFn: (id: string) => {
            return fetchClient(DeleteClientDocument, {
                id,
            });
        },
        onSuccess: (data, variables, context) => {
            client.invalidateQueries({
                queryKey: [queryDomains.clients],
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

type UseUpdateClientOptions = UseMutationOptions<
    UpdateClientMutation,
    Error,
    UpdateClientMutationVariables
>;

export const useUpdateClient = ({
    onSuccess,
    ...options
}: UseUpdateClientOptions = {}) => {
    const client = useQueryClient();

    return useMutation<UpdateClientMutation, Error, UpdateClientMutationVariables>({
        mutationFn: (data) => {
            return fetchClient(UpdateClientDocument, data);
        },
        onSuccess: (data, context, variables) => {
            if (data.updateClient?.client) {
                client.invalidateQueries({
                    queryKey: [queryDomains.clients],
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

type UseCreateClientOptions = UseMutationOptions<
    CreateClientMutation,
    Error,
    CreateClientMutationVariables
>;

export const useCreateClient = ({
    onSuccess,
    ...options
}: UseCreateClientOptions = {}) => {
    const client = useQueryClient();

    return useMutation<CreateClientMutation, Error, CreateClientMutationVariables>({
        mutationFn: (data) => {
            return fetchClient(CreateClientDocument, data);
        },
        onSuccess: (data, context, variables) => {
            if (data.createClient?.client) {
                client.invalidateQueries({
                    queryKey: [queryDomains.clients],
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

export const useClients = () => {
    return usePaginatedQuery(
        queryKeys.clientsPaginatedList,
        ClientsDocument,
        'clients',
        {
            localities: null,
            query: null,
        },
        {
            localities: {
                type: 'multiple-string',
            },
            page: {
                type: 'int',
            },
            query: {
                type: 'string',
            },
        },
    );
};

export const useInfiniteClients = (filters: ClientsQueryVariables) => {
    return useInfiniteQuery<
        ClientsQuery,
        Error,
        InfiniteData<ClientsQuery>,
        unknown[],
        number | null
    >({
        queryKey: queryKeys.clientsInfiniteList(filters),
        queryFn: (props) => {
            return fetchClient(ClientsDocument, {
                localities: filters.localities,
                query: filters.query && filters.query.length >= 3 ? filters.query : null,
                page: props.pageParam,
            });
        },
        getPreviousPageParam: (firstPage) => {
            if (firstPage.clients.currentPage <= 1) {
                return null;
            }

            return firstPage.clients.currentPage - 1;
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.clients.currentPage >= lastPage.clients.numPages) {
                return null;
            }

            return lastPage.clients.currentPage + 1;
        },
        initialPageParam: 1,
    });
};

export const useClientById = (id: string | undefined) => {
    return useQuery({
        queryKey: queryKeys.clientDetailsById(id),
        queryFn: () => {
            return fetchClient(ClientByIdDocument, {
                id: id as string,
            });
        },
        enabled: typeof id === 'string',
    });
};
