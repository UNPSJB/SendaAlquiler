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
    ClientByIdDocument,
    ClientsDocument,
    CreateClientDocument,
    CreateClientMutation,
    CreateClientMutationVariables,
    DeleteClientDocument,
    DeleteClientMutation,
    AllClientsDocument,
    UpdateClientMutation,
    UpdateClientMutationVariables,
    UpdateClientDocument,
    AllClientsQueryVariables,
} from '../graphql';

export const useDeleteClient = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeleteClientMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeleteClientMutation, Error, string>(
        (id: string) => {
            return fetchClient(DeleteClientDocument, {
                id,
            });
        },
        {
            onSuccess: (data, variables, context) => {
                client.invalidateQueries([queryDomains.clients]);

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
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

    return useMutation<UpdateClientMutation, Error, UpdateClientMutationVariables>(
        (data) => {
            return fetchClient(UpdateClientDocument, data);
        },
        {
            onSuccess: (data, context, variables) => {
                if (data.updateClient?.client) {
                    client.invalidateQueries([queryDomains.clients]);
                }

                if (onSuccess) {
                    onSuccess(data, context, variables);
                }
            },
            ...options,
        },
    );
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

    return useMutation<CreateClientMutation, Error, CreateClientMutationVariables>(
        (data) => {
            return fetchClient(CreateClientDocument, data);
        },
        {
            onSuccess: (data, context, variables) => {
                if (data.createClient?.client) {
                    client.invalidateQueries([queryDomains.clients]);
                }

                if (onSuccess) {
                    onSuccess(data, context, variables);
                }
            },
            ...options,
        },
    );
};

export const useAllClients = (props?: AllClientsQueryVariables) => {
    const query = typeof props?.query === 'string' ? props.query : null;
    const variables = props || {
        query,
    };

    return useQuery(
        queryKeys.clientsNonPaginated(variables),
        () => {
            return fetchClient(AllClientsDocument, variables);
        },
        {
            enabled: query === null ? true : query.length >= 3,
        },
    );
};

export const useClients = () => {
    return usePaginatedQuery(queryKeys.clientsPaginatedList, ClientsDocument, 'clients', {
        page: 'number',
    });
};

export const useClientById = (id: string | undefined) => {
    return useQuery(
        queryKeys.clientDetailsById(id),
        () => {
            return fetchClient(ClientByIdDocument, {
                id: id as string,
            });
        },
        {
            enabled: typeof id === 'string',
        },
    );
};
